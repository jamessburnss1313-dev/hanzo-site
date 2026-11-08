// Dark-mode converter (docs/DARK-MODE.md). Rewrites hard-coded LIGHT-MODE colours in CSS files as
//   light-dark(<the exact old colour>, <Hanzo's dark token for that role>)
// so bright mode keeps the same computed colour and dark mode reads Hanzo's own tokens, as live hanzo.ai does.
// Leaves alone: things already dark (dark fills, light text on them: terminals, films, black rooms), colours already in
// light-dark()/var(), rules written for dark (html:not(.light), [data-room=dark], .dark), and custom properties (listed).
// Usage: [CTX=ctx.json] node scripts/darkify.mjs [--dry] file.css ...
//   CTX: scripts/darkctx.mjs's output. A rule whose elements sit mostly on a dark fill (dark on purpose) is left as it is.
import fs from 'node:fs';

const DRY = process.argv.includes('--dry');
const files = process.argv.slice(2).filter((a) => !a.startsWith('--'));
const norm = (sel) => sel.replace(/'/g, '"').replace(/\s+/g, ' ').replace(/\s*([,>+~])\s*/g, '$1').trim();
const CTX = {};
if (process.env.CTX) for (const [k, [d, l]] of Object.entries(JSON.parse(fs.readFileSync(process.env.CTX, 'utf8')))) CTX[norm(k)] = d > 0 && d >= l;
const COLOR = /var\(--hz-(?:\d+|black|white)\)|#[0-9a-fA-F]{8}\b|#[0-9a-fA-F]{6}\b|#[0-9a-fA-F]{4}\b|#[0-9a-fA-F]{3}\b|rgba?\([^()]*\)|\bwhite\b|\bblack\b/g;
// app/system.css's fixed grey deck (it never flips), read as the hex it stands for
const HZ = { black: '#000', 950: '#0a0a0b', 900: '#141416', 850: '#1c1c1e', 800: '#2c2c2e', 700: '#3a3a3c', 600: '#48484a', 500: '#6e6e73', 400: '#86868b', 300: '#a1a1a6', 200: '#c7c7cc', 150: '#d2d2d7', 100: '#e8e8ed', 50: '#f5f5f7', white: '#fff' };

function rgba(c) {
  c = c.toLowerCase();
  const hz = c.match(/^var\(--hz-(\w+)\)$/); if (hz) c = HZ[hz[1]] || '';
  if (!c) return null;
  if (c === 'white') return [255, 255, 255, 1];
  if (c === 'black') return [0, 0, 0, 1];
  if (c[0] === '#') {
    let h = c.slice(1);
    if (h.length <= 4) h = [...h].map((x) => x + x).join('');
    const n = [0, 2, 4, 6].map((i) => (i < h.length ? parseInt(h.slice(i, i + 2), 16) : 255));
    return [n[0], n[1], n[2], n[3] / 255];
  }
  const m = c.match(/[\d.]+%?/g);
  if (!m || m.length < 3) return null;
  const v = m.map((x) => (x.endsWith('%') ? parseFloat(x) / 100 : parseFloat(x)));
  return [v[0], v[1], v[2], v[3] ?? 1];
}
const grey = ([r, g, b]) => (r + g + b) / 3;
const chroma = ([r, g, b]) => Math.max(r, g, b) - Math.min(r, g, b);

// the role a colour plays, from its property; returns the dark token, or null to leave it
function darkFor(prop, col, ctx) {
  const c = rgba(col);
  if (!c) return null;
  const [, , , a] = c, v = grey(c), sat = chroma(c) > 40;
  const isBlackA = v < 30 && a < 1, isWhiteA = v > 225 && a < 1;
  if (/^(color|-webkit-text-fill-color|caret-color)$/.test(prop)) {
    if (ctx.darkBg) return null; // text written on a dark fill in the same rule
    if (sat) return null;
    if (isBlackA) return a >= .8 ? 'var(--foreground)' : a >= .5 ? 'var(--muted-foreground)' : 'var(--text-tertiary)';
    if (a < 1) return null;
    if (v < 60) return 'var(--foreground)';
    if (v < 120) return 'var(--muted-foreground)';
    if (v < 150) return 'var(--text-tertiary)';
    return null;
  }
  if (/^(background|background-color|background-image)$/.test(prop)) {
    if (sat) return null;
    if (isWhiteA) return a >= .5 ? `color-mix(in srgb, var(--background) ${Math.round(a * 100)}%, transparent)` : null; // frosted white panel; a faint white wash is a highlight on dark
    if (isBlackA) return null; // a shade: stays a shade
    if (a < 1) return null;
    if (v >= 250) return 'var(--background)';
    if (v >= 236) return 'var(--muted)';
    if (v >= 200) return 'var(--secondary)';
    return null;
  }
  if (/^(border|border-(top|right|bottom|left|block|inline)(-(start|end))?(-color)?|border-color|outline|outline-color|column-rule|text-decoration|text-decoration-color|box-shadow)$/.test(prop)) {
    if (sat) return null;
    if (prop === 'box-shadow' && !ctx.ring) return null; // a drop shadow stays a shadow
    if (isBlackA) return a > .13 ? 'var(--border-control)' : 'var(--border)';
    if (a < 1) return null;
    if (v >= 236 && prop === 'box-shadow') return null; // a white inner glint
    if (v >= 170) return 'var(--border)';
    if (v < 60) return 'var(--foreground)';
    return null;
  }
  if (/^(fill|stroke|stop-color)$/.test(prop)) {
    if (sat || a < 1) return null;
    if (v < 60) return 'var(--foreground)';
    if (v >= 236) return 'var(--muted)';
    return null;
  }
  return null;
}

const DARK_SEL = /:not\(\.light\)|html\.dark|\.dark\b|\[data-room=['"]?dark|data-theme=['"]?dark|\.t_dark/;

function convertDecl(prop, value, ctx, log) {
  if (/light-dark\(/.test(value)) return value;
  // box-shadow: per comma-separated layer, only rings (no blur) are hairlines
  if (prop === 'box-shadow') {
    return splitTop(value, ',').map((layer) => {
      const nums = layer.replace(COLOR, '').match(/-?[\d.]+px|\b0\b/g) || [];
      const ring = nums.length >= 4 && parseFloat(nums[2]) === 0 && parseFloat(nums[3]) > 0;
      return layer.replace(COLOR, (m) => sub(prop, m, { ...ctx, ring }, log));
    }).join(',');
  }
  return value.replace(COLOR, (m, off) => {
    const before = value.slice(0, off);
    if (/var\([^)]*$/.test(before) && !m.startsWith('var(')) return m; // a fallback inside var()
    if (/url\([^)]*$/.test(before)) return m;
    return sub(prop, m, ctx, log);
  });
}
function sub(prop, m, ctx, log) {
  const d = darkFor(prop, m, ctx);
  if (!d) return m;
  log.n++;
  return `light-dark(${m}, ${d})`;
}
function splitTop(s, sep) {
  const out = []; let depth = 0, cur = '';
  for (const ch of s) { if (ch === '(') depth++; if (ch === ')') depth--; if (ch === sep && !depth) { out.push(cur); cur = ''; } else cur += ch; }
  out.push(cur); return out;
}

// a small CSS walker: finds every { declarations } block with its selector chain, rewrites declarations in place
function processCss(src, log) {
  let out = '', i = 0; const stack = [];
  const n = src.length;
  while (i < n) {
    if (src.startsWith('/*', i)) { const e = src.indexOf('*/', i + 2); const j = e < 0 ? n : e + 2; out += src.slice(i, j); i = j; continue; }
    const ch = src[i];
    if (ch === '{') {
      // the prelude is everything since the last ; { or }
      const k = Math.max(out.lastIndexOf(';'), out.lastIndexOf('{'), out.lastIndexOf('}'), out.lastIndexOf('*/') + 1);
      const prelude = out.slice(k + 1).replace(/\/\*[\s\S]*?\*\//g, '').trim();
      stack.push(prelude); out += ch; i++; continue;
    }
    if (ch === '}') { stack.pop(); out += ch; i++; continue; }
    // inside a block whose prelude is a selector (not @media etc): read one declaration
    const top = stack[stack.length - 1];
    if (top !== undefined && !top.startsWith('@') || (top && /^@(font-face|page)/.test(top))) {
      // collect up to ; or } at depth 0 (parens), stopping at a nested { (nested rule)
      let j = i, depth = 0, quote = null;
      for (; j < n; j++) {
        const c = src[j];
        if (quote) { if (c === quote && src[j - 1] !== '\\') quote = null; continue; }
        if (c === '"' || c === "'") { quote = c; continue; }
        if (src.startsWith('/*', j)) break;
        if (c === '(') depth++; else if (c === ')') depth--;
        else if (!depth && (c === ';' || c === '}' || c === '{')) break;
      }
      if (j === i) { out += src[i]; i++; continue; }
      if (src[j] === '{') { out += src.slice(i, j); i = j; continue; }
      const decl = src.slice(i, j);
      const m = decl.match(/^(\s*)([-\w]+)(\s*:\s*)([\s\S]*?)(\s*)$/);
      const sels = stack.filter((s) => !s.startsWith('@'));
      const inKeyframes = stack.some((s) => /^@(-webkit-)?keyframes/.test(s));
      const darkRule = sels.some((s) => DARK_SEL.test(s)) || (sels.length && CTX[norm(sels[sels.length - 1])]);
      if (m && !darkRule && !m[2].startsWith('--')) {
        const blockText = blockOf(src, i);
        const ctx = { darkBg: hasDarkBg(blockText), sel: sels.join(' '), kf: inKeyframes };
        const nv = convertDecl(m[2].toLowerCase(), m[4], ctx, log);
        out += m[1] + m[2] + m[3] + nv + m[5];
      } else {
        if (m && m[2].startsWith('--') && COLOR.test(m[4]) && !/light-dark/.test(m[4]) && !darkRule) log.custom.push(`${sels.join(' ')} { ${m[2]}: ${m[4].trim()} }`);
        COLOR.lastIndex = 0;
        out += decl;
      }
      i = j; continue;
    }
    out += ch; i++;
  }
  return out;
}
// the text of the innermost block containing position p
function blockOf(src, p) {
  let a = p, depth = 0;
  for (; a > 0; a--) { if (src[a] === '}') depth++; if (src[a] === '{') { if (!depth) break; depth--; } }
  let b = p; depth = 0;
  for (; b < src.length; b++) { if (src[b] === '{') depth++; if (src[b] === '}') { if (!depth) break; depth--; } }
  return src.slice(a + 1, b);
}
// the rule paints its own dark fill (an ink button, a terminal): its text was written for that fill
function hasDarkBg(block) {
  const m = block.match(/(?:^|;|\s)background(?:-color)?\s*:\s*([^;]+)/);
  if (!m) return false;
  const v = m[1];
  if (/var\(--(ink|foreground|primary|x-ink|room-ink|btn-solid-bg)\)/.test(v) && !/light-dark/.test(v)) return true;
  const cols = v.match(COLOR) || []; COLOR.lastIndex = 0;
  return cols.some((c) => { const r = rgba(c); return r && grey(r) < 90 && r[3] > .5; });
}

let total = 0;
for (const f of files) {
  const src = fs.readFileSync(f, 'utf8');
  const log = { n: 0, custom: [] };
  const out = processCss(src, log);
  total += log.n;
  console.log(`${f}: ${log.n} colours${log.custom.length ? `, ${log.custom.length} custom properties to check by hand` : ''}`);
  if (process.env.VERBOSE) log.custom.forEach((c) => console.log('   ' + c.slice(0, 200)));
  if (!DRY && out !== src) fs.writeFileSync(f, out);
}
console.log('total', total);
