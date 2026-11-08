// Which CSS rules style things that are dark ON PURPOSE (terminals, films, black rooms, a dark console shell and the
// white chips inside it)? Those stay as they are in both modes (docs/DARK-MODE.md), so scripts/darkify.mjs must leave them.
// Loads each page in LIGHT at 1470 and 375, and for every element asks: is there a dark fill (or an image/dark gradient)
// among its ancestors? Then every style rule in the page's stylesheets is matched against the DOM and counted.
// Usage: HZ_BASE=http://localhost:4180 node scripts/darkctx.mjs pages.txt out.json
import { createRequire } from 'node:module';
import fs from 'node:fs';
const { chromium } = createRequire(import.meta.url)('playwright');
const BASE = process.env.HZ_BASE || 'http://localhost:4180';
const pages = fs.readFileSync(process.argv[2], 'utf8').trim().split('\n');
const out = fs.existsSync(process.argv[3]) ? JSON.parse(fs.readFileSync(process.argv[3], 'utf8')) : {};
const b = await chromium.launch();
async function run(path, w) {
  const phone = w < 500;
  const ctx = await b.newContext({ viewport: { width: w, height: phone ? 812 : 801 }, colorScheme: 'light', reducedMotion: 'reduce', isMobile: phone, hasTouch: phone });
  const p = await ctx.newPage();
  try { await p.goto(BASE + (path === '/' ? '/' : path + '/'), { waitUntil: 'networkidle', timeout: 120000 }); } catch {}
  await p.evaluate(async () => { for (let y = 0; y < document.documentElement.scrollHeight; y += 700) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 60)); } });
  const r = await p.evaluate(() => {
    const parse = (c) => { const m = c.match(/[\d.]+/g); if (!m) return null; const v = m.map(Number); if (/^color\(srgb/.test(c)) { v[0] *= 255; v[1] *= 255; v[2] *= 255; } return v; };
    const darkFill = (n) => {
      const s = getComputedStyle(n);
      if (s.backgroundImage !== 'none') {
        if (/url\(/.test(s.backgroundImage)) return true;
        const cols = s.backgroundImage.match(/rgba?\([^)]*\)|color\([^)]*\)/g) || [];
        if (cols.length && cols.every((c) => { const v = parse(c); return v && (v[3] ?? 1) > .5 ? (v[0] + v[1] + v[2]) / 3 < 70 : true; }) && cols.some((c) => (parse(c)[3] ?? 1) > .5)) return true;
      }
      const c = parse(s.backgroundColor);
      return !!c && (c[3] ?? 1) > .85 && (c[0] + c[1] + c[2]) / 3 < 70;
    };
    const memo = new Map();
    const inDark = (e) => { // a dark fill among the ancestors (not the element itself)
      const a = []; let n = e.parentElement, res = false;
      for (; n && n !== document.body; n = n.parentElement) { if (memo.has(n)) { res = memo.get(n); break; } a.push(n); if (darkFill(n)) { res = true; break; } }
      // memo stores "this node or an ancestor is dark"
      for (const x of a) memo.set(x, res);
      return res;
    };
    const STATE = /:(hover|focus|focus-visible|focus-within|active|visited|checked|disabled|placeholder-shown|target)\b|::?(before|after|placeholder|marker|selection|-webkit-[\w-]+|first-letter|first-line)/g;
    const rules = [];
    const walk = (list) => { for (const r of list) { if (r.selectorText !== undefined) rules.push(r.selectorText); if (r.cssRules) walk(r.cssRules); } };
    for (const s of document.styleSheets) { try { walk(s.cssRules); } catch {} }
    const res = {};
    for (const sel of new Set(rules)) {
      let els = [];
      for (const part of sel.split(/,(?![^(]*\))/)) {
        const tries = [part.replace(STATE, ''), part.replace(STATE, '').replace(/\[[^\]]*\]/g, ''), part.replace(STATE, '').replace(/\[[^\]]*\]/g, '').replace(/((?:^|\s|>|\+|~)[^\s>+~]*?\.[\w-]+)((?:\.[\w-]+)+)\s*$/, '$1')];
        for (const t of tries) { try { const q = t.trim() ? [...document.querySelectorAll(t)] : []; if (q.length) { els.push(...q); break; } } catch { break; } }
      }
      if (!els.length) continue;
      let d = 0, l = 0; for (const e of els.slice(0, 400)) (inDark(e) ? d++ : l++);
      res[sel] = [d, l];
    }
    return res;
  });
  await ctx.close();
  for (const [k, [d, l]] of Object.entries(r)) { const o = (out[k] ||= [0, 0]); o[0] += d; o[1] += l; }
}
for (const path of pages) { for (const w of [1470, 375]) await run(path, w); console.log(path, Object.keys(out).length); }
fs.writeFileSync(process.argv[3], JSON.stringify(out));
await b.close();
