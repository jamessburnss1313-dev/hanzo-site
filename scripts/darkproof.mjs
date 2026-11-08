// Side-by-side proof: live hanzo.ai in dark (left) vs ours in dark (right), at 1470x801 and 375x812, full page.
// Usage: HZ_BASE=http://localhost:4180 node scripts/darkproof.mjs / /about ...  (or PAGES=file, CONC=3)  Writes docs/dark-proof/<slug>-<w>.jpg
// Pass SCHEME=light to shoot light instead. ONLY_OURS=1 skips live.
import { createRequire } from 'node:module';
const { chromium } = createRequire(import.meta.url)(process.env.PW || 'playwright');
import fs from 'node:fs';
import { execFileSync } from 'node:child_process';
const BASE = process.env.HZ_BASE || 'http://localhost:4180', LIVE = process.env.HZ_LIVE || 'https://hanzo.ai';
const SCHEME = process.env.SCHEME || 'dark', OUT = process.env.OUT || 'docs/dark-proof', TMP = process.env.TMP_DIR || '/tmp';
fs.mkdirSync(OUT, { recursive: true });
const b = await chromium.launch();
async function shot(url, w, file) {
  const phone = w < 500;
  const ctx = await b.newContext({ viewport: { width: w, height: phone ? 812 : 801 }, colorScheme: SCHEME, reducedMotion: 'reduce', isMobile: phone, hasTouch: phone, deviceScaleFactor: 1 });
  const p = await ctx.newPage(); const errs = [];
  p.on('pageerror', (e) => errs.push(String(e).slice(0, 160)));
  p.on('console', (m) => { if (m.type() === 'error') errs.push(m.text().slice(0, 160)); });
  try { await p.goto(url, { waitUntil: 'networkidle', timeout: 90000 }); } catch {}
  await p.evaluate(async () => { for (let y = 0; y < document.documentElement.scrollHeight; y += 600) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 100)); } scrollTo(0, 0); });
  await p.waitForTimeout(1200);
  const info = await p.evaluate(() => ({ cls: document.documentElement.className, sw: document.documentElement.scrollWidth, iw: innerWidth, h: document.documentElement.scrollHeight }));
  await p.screenshot({ path: file, fullPage: true, type: 'jpeg', quality: 70, timeout: 60000 }).catch(async () => p.screenshot({ path: file, type: 'jpeg', quality: 70 }));
  await ctx.close();
  return { ...info, errs };
}
const report = {};
const paths = process.env.PAGES ? fs.readFileSync(process.env.PAGES, 'utf8').trim().split('\n') : process.argv.slice(2);
const jobs = paths.flatMap((path) => [1470, 375].map((w) => [path, w]));
async function job([path, w]) {
  const slug = path === '/' ? 'home' : path.slice(1).replace(/\//g, '_');
  const ours = `${TMP}/${slug}-${w}-ours.jpg`, live = `${TMP}/${slug}-${w}-live.jpg`;
  const ro = await shot(BASE + (path === '/' ? '/' : path + '/'), w, ours);
  let rl = null;
  if (!process.env.ONLY_OURS) rl = await shot(LIVE + path, w, live);
  report[path + ' ' + w] = { ours: ro, live: rl && { cls: rl.cls } };
  console.log(path, w, 'ours', ro.cls.match(/\b(dark|light)\b/)?.[0], 'live', rl?.cls.match(/\b(dark|light)\b/)?.[0], 'sideways', ro.sw > ro.iw ? ro.sw - ro.iw : 0, 'errs', ro.errs.length, ro.errs.slice(0, 2).join(' | '));
  if (!process.env.ONLY_OURS) execFileSync('python3', [new URL('./sbs.py', import.meta.url).pathname, live, ours, `${OUT}/${slug}-${w}.jpg`, w < 500 ? '1' : '0.5']);
}
await Promise.all(Array.from({ length: +(process.env.CONC || 3) }, async () => { while (jobs.length) { const j = jobs.shift(); try { await job(j); } catch (e) { console.log(j.join(' '), 'FAILED', String(e).slice(0, 120)); } } }));
fs.writeFileSync(`${TMP}/darkproof-report.json`, JSON.stringify(report, null, 1));
await b.close();
