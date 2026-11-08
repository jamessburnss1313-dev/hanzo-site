'use client';
/* The cloud family's shared grammar: the hero shell, the agent prompt, code panes, related links, the closing
   "Get X" block, and the hooks that run a demo only while it is seen. Each page brings its own hero visual and composes
   its own sections, so no two pages share a layout; these parts are the words they have in common. */
import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useReducedMotion } from 'motion/react';
import { EASE, Rise, Copy, useCalm } from '../../ui';
import { A, Go, More } from '../../kit';
import './Frame.css';

/* [ref, live, calm]: live is true while the element is on screen and motion is allowed. */
export function useLive(amount = 0.2) {
  const ref = useRef(null);
  const seen = useInView(ref, { amount });
  const calm = useCalm(); // false on the server and the first render, so what hydrates matches the HTML
  return [ref, seen && !calm, calm];
}

/* Calls fn every ms while run is true (the latest fn, so it can read fresh state). */
export function useEvery(ms, run, fn) {
  const f = useRef(fn);
  f.current = fn;
  useEffect(() => {
    if (!run) return;
    const t = setInterval(() => f.current(), ms);
    return () => clearInterval(t);
  }, [ms, run]);
}

/* A requestAnimationFrame loop, fn(t seconds, dt), only while run is true. */
export function useFrame(run, fn) {
  const f = useRef(fn);
  f.current = fn;
  useEffect(() => {
    if (!run) return;
    let raf = 0, last = performance.now();
    const loop = (now) => {
      f.current(now / 1000, Math.min(0.05, (now - last) / 1000));
      last = now;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [run]);
}

/* A step counter that advances every ms while live; returns [step, setStep(byHand)] and pauses once the hand has chosen. */
export function useSteps(n, ms, live) {
  const [at, setAt] = useState(0);
  const [mine, setMine] = useState(false);
  useEffect(() => {
    if (!live || mine) return;
    const t = setTimeout(() => setAt((v) => (v + 1) % n), ms);
    return () => clearTimeout(t);
  }, [at, live, mine, n, ms]);
  return [at, (i) => { setAt(i); setMine(true); }, mine];
}

const lineIn = (t, d, key) => (
  <span className="x-line" key={key}>
    <motion.span className="x-line-in" initial={{ y: '105%' }} animate={{ y: 0 }} transition={{ duration: 1.1, ease: EASE, delay: d }}>{t}</motion.span>
  </span>
);

const fadeUp = (d) => ({ initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.9, ease: EASE, delay: d } });

/* The hero shell. look: split (copy left), flip (visual left), stack (copy above a wide visual), over (copy on the visual).
   title is a string or an array of lines; sub is a second, softer line under it (the live pages' subtitles). */
export function Hero({ kick, icon, title, sub, lede, acts = [], children, look = 'split', note, dark, className = '' }) {
  const lines = Array.isArray(title) ? title : [title];
  return (
    <section className={`cf-hero ${look} ${dark ? 'dark' : ''} ${className}`} data-room={dark ? 'dark' : undefined}>
      <div className="x-wrap cf-hero-grid">
        <div className="cf-hero-copy">
          {kick && <motion.p className="cf-kick" {...fadeUp(0)}>{icon}<span>{kick}</span></motion.p>}
          <h1 className="cf-h1">{lines.map((t, i) => lineIn(t, 0.05 + i * 0.12, i))}</h1>
          {sub && <motion.p className="cf-sub" {...fadeUp(0.3)}>{sub}</motion.p>}
          {lede && <motion.p className="cf-lede" {...fadeUp(0.38)}>{lede}</motion.p>}
          {acts.length > 0 && (
            <motion.div className="cf-acts" {...fadeUp(0.5)}>
              {acts.map(([t, to], i) => <Go key={t} to={to} solid={i === 0}>{t}</Go>)}
            </motion.div>
          )}
          {note}
        </div>
        <motion.div className="cf-stage" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.2, ease: EASE, delay: 0.15 }}>
          {children}
        </motion.div>
      </div>
    </section>
  );
}

/* "Paste and ship": the prompt that hands this product to any agent. */
export function Paste({ name, prompt, api, dark, className = '' }) {
  return (
    <Rise className={`cf-paste ${dark ? 'dark' : ''} ${className}`}>
      <div className="cf-paste-h">
        <p className="cf-paste-t">Paste and ship</p>
        <p className="cf-paste-d">Paste this into any agent. It reads the skill manifest and calls {name} from there.</p>
      </div>
      <div className="cf-paste-box">
        <div className="cf-paste-bar">
          <span className="cf-paste-k">Agent prompt</span>
          {api && <span className="cf-api"><i>api</i>{api}</span>}
          <Copy text={prompt} />
        </div>
        <pre className="cf-paste-code"><code>{prompt}</code><span className="cf-caret" aria-hidden="true" /></pre>
      </div>
    </Rise>
  );
}

/* Light syntax colour for shell, python and JSON lines: comments, strings, the command word. */
function hl(line, lang) {
  if (/^\s*(#|\/\/)/.test(line)) return <span className="c">{line}</span>;
  const parts = line.split(/("[^"]*"|'[^']*')/);
  return parts.map((p, i) => {
    if (i % 2) return <span key={i} className="s">{p}</span>;
    if (i === 0 && lang !== 'python' && lang !== 'json') {
      const m = p.match(/^(\s*)([\w./-]+)(.*)$/s);
      // every run of text sits in its own span, so a copy check that reads leaf elements finds the code word for word
      if (m) return <span key={i}>{m[1]}<span className="k">{m[2]}</span>{m[3] && <span>{m[3]}</span>}</span>;
    }
    if (lang === 'python') return <span key={i}>{p.split(/\b(import|from|print|def|return|for|in|with|as)\b/).map((w, j) => (j % 2 ? <span key={j} className="k">{w}</span> : w && <span key={j}>{w}</span>))}</span>;
    return p && <span key={i}>{p}</span>;
  });
}

/* A line with one phrase picked out (mark), the rest coloured as usual. */
function marked(l, lang, mark) {
  if (!mark || !l.includes(mark)) return hl(l, lang);
  return l.split(mark).flatMap((x, i) => [i > 0 && <mark key={'m' + i} className="cf-mark">{mark}</mark>, <span key={i}>{hl(x, lang)}</span>]);
}

/* A code pane: one or more tabs [{ k: 'curl', label, code, lang }]; every tab's code is in the page, the chosen one shown. */
export function Code({ tabs, title, light, mark, className = '' }) {
  const [at, setAt] = useState(0);
  const cur = tabs[at];
  return (
    <div className={`cf-code ${light ? 'light' : ''} ${className}`}>
      <div className="cf-code-bar">
        <i /><i /><i />
        {tabs.length > 1 ? (
          <div className="cf-code-tabs" role="tablist" aria-label={title || 'Code'}>
            {tabs.map((t, i) => (
              <button key={t.k} type="button" role="tab" aria-selected={at === i} onClick={() => setAt(i)}>
                {at === i && <motion.span layoutId={'cf-tab-' + (title || 'c')} className="cf-code-tab-bg" transition={{ type: 'spring', stiffness: 420, damping: 34 }} />}
                <span>{t.k}</span>
              </button>
            ))}
          </div>
        ) : <span className="cf-code-k">{tabs[0].k}</span>}
        <Copy text={cur.code} />
      </div>
      {tabs.map((t, i) => (
        <div key={t.k} className="cf-code-body" hidden={i !== at}>
          {t.label && <p className="cf-code-label">{t.label}</p>}
          <pre><code>{t.code.split('\n').map((l, j) => <span key={j} className="cf-ln">{marked(l, t.lang, mark)}{'\n'}</span>)}</code></pre>
        </div>
      ))}
    </div>
  );
}

/* Related products, as a row of links. */
export function Related({ items, title = 'Related capabilities', className = '' }) {
  return (
    <div className={'cf-related ' + className}>
      <p className="cf-related-k">{title}</p>
      <ul>
        {items.map(([t, to, d]) => (
          <li key={t}><A to={to} className="cf-rel"><b>{t}</b>{d && <span>{d}</span>}{!t.endsWith('→') && <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>}</A></li>
        ))}
      </ul>
    </div>
  );
}

const Gh = () => <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor" aria-hidden="true"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" /></svg>;

/* The closing block: Get X, its line, its licence and source, and where to run it. */
export function Get({ name, tag, repo = ['hanzoai', 'https://github.com/hanzoai'], stars, license = 'Apache-2.0', deploy = 'https://platform.hanzo.ai/deploy', self, children, mark, dark }) {
  return (
    <section className={'cf-get' + (dark ? ' dark' : '')} data-room={dark ? 'dark' : undefined}>
      <div className="x-wrap cf-get-in">
        <div className="cf-get-copy">
          <Rise as="h2" className="cf-get-h">Get {name}</Rise>
          {tag && <Rise as="p" className="cf-get-tag" delay={0.08}>{tag}</Rise>}
          <Rise className="cf-get-meta" delay={0.14}>
            {license && <span className="cf-chip"><span>License:</span> {license}</span>}
            {repo && <A to={repo[1]} className="cf-chip"><Gh />{repo[0]}{stars && <em>{stars}</em>}</A>}
          </Rise>
          {children}
        </div>
        <Rise className="cf-get-acts" delay={0.2}>
          {deploy && <Go to={deploy} solid>Deploy to Cloud</Go>}
          {self && <Go to={self}>Self-host</Go>}
        </Rise>
        {mark && <div className="cf-get-mark" aria-hidden="true">{mark}</div>}
      </div>
    </section>
  );
}

/* A section head that is just the page's words, left or centred. */
export function Head({ kick, title, lede, center, dark, className = '' }) {
  return (
    <header className={`cf-head ${center ? 'center' : ''} ${dark ? 'dark' : ''} ${className}`}>
      {kick && <Rise as="p" className="x-kick" y={10}>{kick}</Rise>}
      <Rise as="h2" y={20}>{title}</Rise>
      {lede && <Rise as="p" className="cf-head-l" delay={0.1}>{lede}</Rise>}
    </header>
  );
}

/* The live pages' example console: this product's sidebar links, four example projects and their state. */
const PROJECTS = (cap) => [
  ['gateway', 'Ready', cap],
  ['payments-api', 'Ready'],
  ['checkout-web', 'Building', 'A build is running from the last commit on main.'],
  ['docs-site', 'Ready', 'Static, published by the same pipeline as the rest.'],
];
const ICONS = ['M8 2v4M8 6 4 10M8 6l4 4M4 10v4M12 10v4', 'M8 1.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13ZM1.5 8h13M8 1.5c2 2 2 11 0 13M8 1.5c-2 2-2 11 0 13', 'M3 3h3v3H3zM10 10h3v3h-3zM6 4.5h3.5v5.5', 'M2.5 3h11v4h-11zM2.5 9h11v4h-11z', 'M8 2 2.5 5v6L8 14l5.5-3V5zM2.5 5 8 8l5.5-3M8 8v6', 'M2 12l4-4 3 3 5-6', 'M5 2.5h6M3.5 6h9M2 9.5h12v4H2z', 'M8 2a3 3 0 1 1 0 6 3 3 0 0 1 0-6ZM2.5 14c.8-2.6 3-4 5.5-4s4.7 1.4 5.5 4'];

/* side: [[label, href]], the first being this product; cap: the gateway row's line on this page; light: a white window. */
export function Console({ name, side, api, cap = 'Every request enters here, so the limiter does too.', host = true, light, session, className = '' }) {
  const ROWS = PROJECTS(cap);
  const [at, setAt] = useState(0);
  const ref = useRef(null);
  const seen = useInView(ref, { amount: 0.4 });
  // the building project finishes its build while you watch, then starts the next one
  const [built, setBuilt] = useState(false);
  useEffect(() => { if (!seen) return; const t = setInterval(() => setBuilt((b) => !b), 4200); return () => clearInterval(t); }, [seen]);
  const line = ROWS[at][2];
  return (
    <div className={'cf-con' + (light ? ' light' : '') + ' ' + className} ref={ref}>
      <div className="cf-con-bar"><i /><i /><i /><A to="/home" className="cf-con-title">{name} — Hanzo</A></div>
      <div className="cf-con-body">
        <nav className="cf-con-side" aria-label="Products">
          {side.map(([t, to], i) => (
            <A key={t} to={to} className={'cf-con-ico' + (i === 0 ? ' on' : '')} aria-label={t} title={t}>
              <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d={ICONS[i % ICONS.length]} fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" /></svg>
              <span className="cf-tip">{t}</span>
            </A>
          ))}
        </nav>
        {session ? (
          <div className="cf-con-main cf-sess">
            <p className="cf-sess-me">{session[1]}</p>
            <p className="cf-sess-who">{session[0]}</p>
            <p className="cf-sess-step"><i className={built ? 'done' : ''} />{session[2]}</p>
            <p className={'cf-sess-done' + (built ? ' on' : '')}>{session[3]}</p>
          </div>
        ) : (
        <div className="cf-con-main">
          <ul role="listbox" aria-label="Projects">
            {ROWS.map(([name, st], i) => {
              const s = name === 'checkout-web' && built ? 'Ready' : st;
              return (
                <li key={name} role="option" aria-selected={at === i} tabIndex={0} onClick={() => setAt(i)} onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), setAt(i))} onMouseEnter={() => setAt(i)}>
                  {at === i && <motion.span layoutId="cf-row" className="cf-row-bg" transition={{ type: 'spring', stiffness: 420, damping: 36 }} />}
                  <i className={'cf-dot ' + (s === 'Building' ? 'b' : 'r')} />
                  <span className="cf-name">{name}</span>
                  <span className="cf-st">{s}</span>
                </li>
              );
            })}
          </ul>
          <div className="cf-cap" aria-live="polite">
            {ROWS.filter((p) => p[2]).map(([name, , c]) => <p key={name} hidden={ROWS[at][0] !== name}>{c}</p>)}
            {!line && <p className="cf-cap-none">{ROWS[at][0]} · {ROWS[at][1]}</p>}
          </div>
        </div>
        )}
      </div>
      <div className="cf-con-foot">
        <span>{host && <span>api.hanzo.ai</span>}<b><span>{api}</span></b></span>
        <A to="https://hanzo.team/" className="cf-con-open">Open in the console ↗</A>
      </div>
    </div>
  );
}


export { More, A, Go };
