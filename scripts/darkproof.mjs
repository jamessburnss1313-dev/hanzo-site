// Side-by-side dark proof: live hanzo.ai (device set to dark) on the left, ours (HZ_BASE) on the right, full page,
// at 1470x801 and 375x812. Writes docs/dark-proof/<page>-<width>.jpg. Uses the pre-installed Playwright.
// Usage: HZ_BASE=http://localhost:4180 node scripts/darkproof.mjs /download /edge ...   (MODE=light for a light pair)
import { createRequire } from 'node:module';
const req = createRequire(import.meta.url);
let pw; try { pw = req('playwright'); } catch { pw = req(require_g()); }
function require_g() { return (process.env.NODE_GLOBAL || '/opt/node22/lib/node_modules') + '/playwright'; }
const { chromium } = pw;
import fs from 'node:fs';

const BASE = process.env.HZ_BASE || 'http://localhost:4180';
const LIVE = process.env.HZ_LIVE || 'https://hanzo.ai';
const MODE = process.env.MODE || 'dark';
const OUT = process.env.OUT || 'docs/dark-proof';
const MAXH = 9000;
fs.mkdirSync(OUT, { recursive: true });
const b = await chromium.launch({ args: ['--no-sandbox'] });

async function shot(url, w) {
  const ctx = await b.newContext({ viewport: { width: w, height: w < 500 ? 812 : 801 }, colorScheme: MODE, reducedMotion: 'reduce', isMobile: w < 500, hasTouch: w < 500, deviceScaleFactor: 1 });
  await ctx.addInitScript(() => { try { localStorage.setItem('hz-consent', JSON.stringify({ necessary: true, at: Date.now() })); } catch {} });
  const p = await ctx.newPage();
  const errs = [];
  p.on('pageerror', (e) => errs.push(String(e.message || e)));
  p.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
  try { await p.goto(url, { waitUntil: 'networkidle', timeout: 60000 }); } catch {}
  await p.evaluate(async () => { for (let y = 0; y < document.documentElement.scrollHeight; y += 600) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 150)); } scrollTo(0, 0); });
  await p.waitForTimeout(1200);
  const info = await p.evaluate(() => ({ cls: document.documentElement.className, sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth, h: document.documentElement.scrollHeight }));
  const buf = await p.screenshot({ fullPage: true, type: 'png', clip: { x: 0, y: 0, width: w, height: Math.min(info.h, MAXH) } }).catch(() => p.screenshot({ type: 'png' }));
  await ctx.close();
  return { buf, info, errs };
}

const report = {};
for (const path of process.argv.slice(2)) {
  for (const w of [1470, 375]) {
    const slug = path.replace(/^\//, '').replace(/\//g, '_') || 'home';
    const [L, O] = await Promise.all([shot(LIVE + path.replace(/\/?$/, '/'), w), shot(BASE + path.replace(/\/?$/, '/'), w)]);
    const scale = w > 500 ? 0.5 : 1;
    const ctx = await b.newContext({ viewport: { width: Math.round(w * scale) * 2 + 24, height: 400 }, deviceScaleFactor: 1 });
    const p = await ctx.newPage();
    const img = (x) => 'data:image/png;base64,' + x.toString('base64');
    await p.setContent(`<body style="margin:0;background:#777;font:12px system-ui;color:#fff"><div style="display:flex;gap:24px;align-items:flex-start">
      <div><div style="padding:4px">LIVE hanzo.ai${path} (${MODE})</div><img style="width:${Math.round(w * scale)}px;display:block" src="${img(L.buf)}"></div>
      <div><div style="padding:4px">OURS ${path} (${MODE})</div><img style="width:${Math.round(w * scale)}px;display:block" src="${img(O.buf)}"></div></div></body>`);
    await p.waitForTimeout(300);
    await p.screenshot({ path: `${OUT}/${slug}-${w}${MODE === 'dark' ? '' : '-' + MODE}.jpg`, fullPage: true, type: 'jpeg', quality: 62 });
    await ctx.close();
    report[path + '@' + w] = { liveClass: L.info.cls, ourClass: O.info.cls, sideScroll: O.info.sw > O.info.cw, errors: O.errs.slice(0, 5) };
    console.log(path, w, 'sideScroll:', O.info.sw > O.info.cw, 'errors:', O.errs.length, O.errs[0] || '');
  }
}
await b.close();
fs.writeFileSync(`${OUT}/_report${MODE === 'dark' ? '' : '-' + MODE}.json`, JSON.stringify(report, null, 1));
