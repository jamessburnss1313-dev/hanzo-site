// Dark-mode readability check: every page of the local preview in dark, every visible text element, at 1470x801 and
// 375x812: contrast of its text colour against the background actually painted under it. Flags ratio < 3.
// Usage: HZ_BASE=http://localhost:4180 CHROME=/path/to/chrome node scripts/darkcheck.mjs  (dev server running).
//   PAGES=file (one route a line; default scripts/copycheck-pages.txt), OUT=dir (writes OUT/summary.json), WIDTHS=1470,375
// The background is read where the text is painted: the page is walked a screen at a time, and at each text's centre the
// stack of elements under it (document.elementsFromPoint, hit-testing everything) gives the first opaque fill below the
// text. That counts a sliding pill or a card drawn as a sibling layer, which an ancestor walk misses. A fill that is an
// image or gradient can't be measured and is skipped, as before.
import puppeteer from 'puppeteer-core';
import fs from 'node:fs';
const pages = fs.readFileSync(process.env.PAGES || new URL('./copycheck-pages.txt', import.meta.url).pathname, 'utf8').split('\n').map(s => s.trim()).filter(Boolean);
const OUT = process.env.OUT || 'darkcheck-out';
const WIDTHS = (process.env.WIDTHS || '1470,375').split(',').map(Number);
fs.mkdirSync(OUT, { recursive: true });
const b = await puppeteer.launch({ executablePath: process.env.CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true, args: ['--no-sandbox'], protocolTimeout: 900000 });
const res = {};
async function checkAt(path, w) {
  const p = await b.newPage(); const phone = w < 500;
  await p.setViewport({ width: w, height: phone ? 812 : 801, isMobile: phone, hasTouch: phone });
  await p.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: 'dark' }, { name: 'prefers-reduced-motion', value: 'reduce' }]);
  try { await p.goto((process.env.HZ_BASE || 'http://localhost:4180') + (path === '/' ? '/' : path + '/'), { waitUntil: 'networkidle2', timeout: 90000 }); } catch {}
  await new Promise(r => setTimeout(r, 800));
  const r = await p.evaluate(async () => {
    const parse = c => { const m = c.match(/[\d.]+/g); if (!m) return null; const v = m.map(Number); if (/^color\(srgb/.test(c)) { v[0] *= 255; v[1] *= 255; v[2] *= 255; } return v; }; // color(srgb r g b / a) is 0..1
    const lum = ([r, g, b]) => { const f = v => { v /= 255; return v <= .03928 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4; }; return .2126 * f(r) + .7152 * f(g) + .0722 * f(b); };
    const bad = [];
    if (!document.documentElement.classList.contains('dark')) return { notDark: true, bad };
    const hit = document.createElement('style'); hit.textContent = '*{pointer-events:auto!important}'; document.head.append(hit);
    // the first opaque fill painted under point (x, y), below the text element e; null if it is an image/gradient
    const bgAt = (e, x, y) => {
      const stack = document.elementsFromPoint(x, y);
      let i = stack.findIndex(n => n === e || e.contains(n) || n.contains(e));
      if (i < 0) return undefined; // not painted at this point (clipped away by an overflow, or off to the side)
      for (; i < stack.length; i++) {
        const n = stack[i]; if (e.contains(n) && n !== e) continue;
        const s = getComputedStyle(n);
        if (s.backgroundImage !== 'none' && n !== document.body && n !== document.documentElement) return null;
        const c = parse(s.backgroundColor); if (c && (c[3] === undefined || c[3] > .85) && (+s.opacity > .85 || n.contains(e))) return c; // a fill fading in with its own text still sits under it
      }
      return [13, 13, 13];
    };
    const texts = [...document.querySelectorAll('body *')].filter(e => !e.children.length && e.textContent.trim() && !e.closest('svg,canvas,[aria-hidden=true],.x-sr,script,style,noscript'));
    const seen = new Set();
    const H = innerHeight;
    for (let y = 0; y < document.documentElement.scrollHeight; y += Math.round(H * .8)) {
      scrollTo(0, y); await new Promise(r => setTimeout(r, 160));
      for (const e of texts) {
        if (seen.has(e)) continue;
        const rc = e.getBoundingClientRect();
        if (rc.top < 0 || rc.bottom > H || rc.width < 2 || rc.height < 2) continue;
        if (rc.right <= 0 || rc.left >= innerWidth) { seen.add(e); continue; } // off to the side (a strip that scrolls sideways): not on screen
        const s = getComputedStyle(e);
        let op = 1; for (let n = e; n; n = n.parentElement) op *= +getComputedStyle(n).opacity;
        if (s.visibility === 'hidden' || op < .3) continue;
        seen.add(e);
        const cx = Math.min(Math.max(rc.left + Math.min(rc.width / 2, 12), 0), innerWidth - 1), cy = rc.top + rc.height / 2;
        hit.disabled = true; const top = document.elementFromPoint(cx, cy); hit.disabled = false; // natural hit-testing: decorative overlays don't count
        if (top && top !== e && !e.contains(top) && !top.contains(e)) { // something sits over the text here: a fixed bar or banner means try again further down
          let fixed = false; for (let n = top; n && n !== document.body; n = n.parentElement) { const ps = getComputedStyle(n).position; if (ps === 'fixed' || ps === 'sticky') { fixed = !n.contains(e); break; } }
          if (fixed) { seen.delete(e); continue; }
        }
        const fg = parse(s.color); const bg = bgAt(e, cx, cy); if (bg === undefined) { seen.delete(e); continue; } if (!fg || !bg) continue;
        const a = (fg[3] ?? 1); const mix = fg.slice(0, 3).map((v, i) => v * a + bg[i] * (1 - a));
        const L1 = lum(mix), L2 = lum(bg); const ratio = (Math.max(L1, L2) + .05) / (Math.min(L1, L2) + .05);
        if (ratio < 3) bad.push({ t: e.textContent.trim().slice(0, 50), ratio: +ratio.toFixed(2), fg: s.color, bg: 'rgb(' + bg.slice(0, 3).join(',') + ')', cls: (e.className + '').slice(0, 40), par: (e.parentElement.className + '').slice(0, 40), y: Math.round(rc.top + scrollY) });
      }
    }
    hit.remove();
    return { bad, checked: seen.size, texts: texts.length };
  });
  await p.close();
  return r;
}
async function check(path) {
  const out = { notDark: false, count: 0, samples: [] };
  for (const w of WIDTHS) {
    let r; try { r = await checkAt(path, w); } catch (err) { r = { bad: [{ t: 'CHECK FAILED: ' + String(err).slice(0, 80), ratio: 0 }] }; }
    out.notDark ||= !!r.notDark; out.count += r.bad.length; out.samples.push(...r.bad.slice(0, 8).map(x => ({ w, ...x })));
    out['w' + w] = r.bad.length; out['n' + w] = r.checked + '/' + r.texts;
  }
  res[path] = out;
  console.log(path, out.notDark ? 'NOT DARK' : out.count, WIDTHS.map(w => w + ':' + out['w' + w] + ' (checked ' + out['n' + w] + ')').join(' '));
}
const q = [...pages];
await Promise.all([0, 1, 2].map(async () => { while (q.length) await check(q.shift()); }));
await b.close();
fs.writeFileSync(OUT + '/summary.json', JSON.stringify(res, null, 1));
const bad = Object.entries(res).filter(([, v]) => v.count || v.notDark).sort((a, b) => b[1].count - a[1].count);
console.log('PAGES WITH UNREADABLE TEXT IN DARK:', bad.length, 'of', Object.keys(res).length, ' issues:', bad.reduce((s, [, v]) => s + v.count, 0));
bad.slice(0, 60).forEach(([k, v]) => console.log(k, v.notDark ? 'NOT DARK' : v.count));
