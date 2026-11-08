// Dark-mode readability check: every page of the local preview in dark, every visible text element,
// Usage: HZ_BASE=http://localhost:3000 CHROME=/path/to/chrome node scripts/darkcheck.mjs  (dev server running). Writes OUT/summary.json.
// contrast of its text colour against the first opaque background behind it. Flags ratio < 3.
import puppeteer from 'puppeteer-core';
import fs from 'node:fs';
const pages = fs.readFileSync(process.env.PAGES || new URL('./copycheck-pages.txt', import.meta.url).pathname, 'utf8').split('\n').map(s => s.trim()).filter(Boolean);
const OUT = process.env.OUT || 'darkcheck-out';
const b = await puppeteer.launch({ executablePath: process.env.CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true, args: ['--no-sandbox'] });
const res = {};
async function check(path) {
  const p = await b.newPage(); await p.setViewport({ width: 1470, height: 801 });
  await p.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: 'dark' }, { name: 'prefers-reduced-motion', value: 'reduce' }]);
  try { await p.goto((process.env.HZ_BASE || 'http://localhost:4300') + (path === '/' ? '/' : path + '/'), { waitUntil: 'networkidle2', timeout: 90000 }); } catch {}
  await p.evaluate(async () => { for (let y = 0; y < document.documentElement.scrollHeight; y += 700) { scrollTo(0, y); await new Promise(r => setTimeout(r, 120)); } scrollTo(0, 0); });
  await new Promise(r => setTimeout(r, 800));
  const r = await p.evaluate(() => {
    const parse = c => { const m = c.match(/[\d.]+/g); if (!m) return null; const v = m.map(Number); if (/^color\(srgb/.test(c)) { v[0] *= 255; v[1] *= 255; v[2] *= 255; } return v; }; // color(srgb r g b / a) is 0..1
    const lum = ([r, g, b]) => { const f = v => { v /= 255; return v <= .03928 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4; }; return .2126 * f(r) + .7152 * f(g) + .0722 * f(b); };
    const bgOf = e => { for (let n = e; n; n = n.parentElement) { const s = getComputedStyle(n); if (s.backgroundImage !== 'none' && n !== document.body && n !== document.documentElement) return null; const c = parse(s.backgroundColor); if (c && (c[3] === undefined || c[3] > .85)) return c; } return [13, 13, 13]; };
    const bad = [];
    if (!document.documentElement.classList.contains('dark')) return { notDark: true, bad };
    for (const e of document.querySelectorAll('body *')) {
      if (e.children.length || !e.textContent.trim() || e.closest('svg,canvas,[aria-hidden=true],.x-sr,script,style')) continue;
      const s = getComputedStyle(e); const rc = e.getBoundingClientRect();
      if (rc.width < 2 || rc.height < 2 || s.visibility === 'hidden' || +s.opacity < .3) continue;
      const fg = parse(s.color); const bg = bgOf(e); if (!fg || !bg) continue;
      const a = (fg[3] ?? 1); const mix = fg.slice(0, 3).map((v, i) => v * a + bg[i] * (1 - a));
      const L1 = lum(mix), L2 = lum(bg); const ratio = (Math.max(L1, L2) + .05) / (Math.min(L1, L2) + .05);
      if (ratio < 3) bad.push({ t: e.textContent.trim().slice(0, 50), ratio: +ratio.toFixed(2), fg: s.color, bg: 'rgb(' + bg.slice(0, 3).join(',') + ')', cls: (e.className + '').slice(0, 40) });
    }
    return { bad };
  });
  res[path] = { notDark: !!r.notDark, count: r.bad.length, samples: r.bad.slice(0, 8) };
  await p.close();
  console.log(path, r.notDark ? 'NOT DARK' : r.bad.length);
}
const q = [...pages];
await Promise.all([0, 1].map(async () => { while (q.length) await check(q.shift()); }));
await b.close();
fs.writeFileSync(OUT + '/summary.json', JSON.stringify(res, null, 1));
const bad = Object.entries(res).filter(([, v]) => v.count || v.notDark).sort((a, b) => b[1].count - a[1].count);
console.log('PAGES WITH UNREADABLE TEXT IN DARK:', bad.length, 'of', Object.keys(res).length);
bad.slice(0, 60).forEach(([k, v]) => console.log(k, v.notDark ? 'NOT DARK' : v.count));
