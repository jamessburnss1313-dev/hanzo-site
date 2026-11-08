'use client';
/* Blockchain overview (/blockchain), v2 archetype C "Catalogue"; greys and ink only (JAMES.md 7).
   Persona: a developer building on one chain who will need a second
   Metric: signup_start (the catalogue's action: open a card)
   Goal: see that the chain is just an argument, find the piece they need, then start
   CTA: Try Hanzo -> /signup (the hero's one solid fill, then the site header; the close; data-thumb, data-cta)
   Signature: the chain becomes a parameter. Under the headline and the ask, chain: plus a value that rolls through
   every network Hanzo lists, by itself, like a reel; the product pages that name that chain light up quietly (a grey
   fill, never black) as the value lands. It pauses on its own button (WCAG 2.2.2), stops off screen and stands still
   for reduced motion. The chain it last landed on carries down the page: the pieces mark which of them name it.
   Beyond: the coverage matrix. Every Web3 product against every chain its own page names, readable across (a product,
   with its count) and down (a chain, with its count); hover or tap a cell, or a chain name above it, to light its row
   and column.
   Also: the pieces as a pinned scene, one in and one out: the left stage shows the piece at the middle of the screen
   (or under the pointer), with the chains its page names, while the index scrolls; each name opens into its page
   (Morph). The nine groups are a map beside their accordion; the agent's code streams in once (pause, final frame).
   Motion: the reel (idle, signature) + headlines cut into their line (arrival) + the pieces stage and the card-to-page
   morph (state) + the code streaming (time) + the matrix answering the pointer. Every word and link is Hanzo's;
   counts are counted from Hanzo's product pages.
V2: 8/10 deck scale (h1 52, headings 26, the chain: reel 64 as the one moment), the reel lighting the product pages that name each chain, a catalogue index that morphs into each page, groups that open, an agent dark room on the kit CodeBlock, the coverage matrix on the kit DataTable read across and down; deck greys, no springs or hover lifts, quiet asks under the header's solid
*/
import { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import { useInView, useReducedMotion } from 'motion/react';
import { useCalm } from '../../ui';
import { A, More, Cta, DataTable, CodeBlock } from '../../kit';
import BizLines from '../../v2/BizLines';
import { ui } from '../../v2/famUi';
import { play } from '../../../lib/sound';
import './BlockchainIndex.css';

const GO = { 'Try Hanzo': '/signup', 'View Pricing': '/pricing?tab=blockchain' };
const two = (n) => String(n).padStart(2, '0');
const bare = (h) => (h || '').replace(/\/$/, '');
// a chain the overview lists, named on a product's page ("Lux D-Chain" is "Lux D-Chain (DEX)" there)
const names = (list, c) => list.some((x) => x === c || x.startsWith(c + ' '));
const PauseI = ({ held }) => (held
  ? <svg viewBox="0 0 12 12" width="12" height="12" aria-hidden="true"><path d="M3 1.5v9l7.5-4.5z" fill="currentColor" /></svg>
  : <svg viewBox="0 0 12 12" width="12" height="12" aria-hidden="true"><path d="M3 1.5h2v9H3zM7 1.5h2v9H7z" fill="currentColor" /></svg>);
const Arrow = () => <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>;

/* an object that walks itself once while it is on screen (one beat at a time), and steps aside for 3 s whenever
   the visitor points at it or touches it; reduced motion: it never walks */
function useWalk(ref, n, beat) {
  const seen = useInView(ref, { amount: 0.25 });
  const calm = useCalm(); // hydration-safe: false until mounted
  const [step, setStep] = useState(-1);
  const [held, setHeld] = useState(false);
  const tm = useRef(0);
  useEffect(() => {
    if (!seen || held || calm || step >= n) return;
    const t = setTimeout(() => setStep(step + 1), step < 0 ? 400 : beat);
    return () => clearTimeout(t);
  }, [seen, held, calm, step, n, beat]);
  useEffect(() => () => clearTimeout(tm.current), []);
  const touch = () => { setHeld(true); clearTimeout(tm.current); tm.current = setTimeout(() => setHeld(false), 3000); };
  return [held || step < 0 || step >= n ? -1 : step, touch, held];
}

/* The signature: chain: and a reel of every network Hanzo lists; the product pages that name it light up (quietly).
   Pointing at a product tells you how many chains its page names. */
function Reel({ chains, all, onChain, alsoRun }) {
  const box = useRef(null);
  const inView = useInView(box, { amount: 0.3 });
  const seen = inView || alsoRun; // the pieces below follow the same chain, so it keeps turning while they are on screen
  const calm = useCalm(); // hydration-safe: false until mounted
  const [held, setHeld] = useState(false);
  const [i, setI] = useState(0);
  const [jump, setJump] = useState(false);
  const [hover, setHover] = useState(null);
  const n = chains.length;
  const fresh = useRef(true); // the first roll after coming into view comes quickly, so the line moves within a second
  useEffect(() => { if (!seen) fresh.current = true; }, [seen]);
  useEffect(() => {
    if (!seen || held || calm || n < 2) return;
    const wait = i >= n ? 60 : fresh.current ? 900 : 2000;
    const t = setTimeout(() => { fresh.current = false; if (i >= n) { setJump(true); setI(0); } else { setJump(false); setI(i + 1); } }, wait);
    return () => clearTimeout(t);
  }, [seen, held, calm, i, n]);
  const at = i % n;
  useEffect(() => { onChain && onChain(chains[at]); }, [at]); // eslint-disable-line react-hooks/exhaustive-deps
  const lit = all.filter((p) => names(p.chains, chains[at]));
  const hp = hover && all.find((p) => p.slug === hover);
  return (
    <div className="bci-reel" ref={box}>
      <div className="bci-line">
        <span className="bci-key x-mono" aria-hidden="true">chain:</span>
        <span className="bci-win" aria-hidden="true">
          <span className={'bci-roll' + (jump ? ' jump' : '')} style={{ transform: `translateY(${-i * 1.2}em)` }}>
            {[...chains, chains[0]].map((c, k) => <span key={k}>{c}</span>)}
          </span>
        </span>
        <span className="x-sr">chain: {chains[at]}</span>
      </div>
      <div className="bci-reel-bar">
        <span className="bci-reel-n x-mono" aria-hidden="true"><b>{two(at + 1)}</b> / {two(n)}</span>
        <span className="bci-track" aria-hidden="true">
          <i style={{ transform: `scaleX(${(at + 1) / n})` }} />
          <b key={i} className={'bci-tick' + (held || calm ? ' held' : '')} style={{ left: `${((at + 1) / n) * 100}%`, width: `${100 / n}%` }} />
        </span>
        <span className="bci-lit x-mono" aria-hidden="true">
          {hp ? <span key={hp.slug} className="bci-lit-h">{hp.name} · <b>{hp.chains.length}</b> chains on its page</span> : <><b>{lit.length}</b> / {all.length} product pages name it</>}
        </span>
        {!calm && <button type="button" className="bci-pause" onClick={() => setHeld(!held)} aria-pressed={held} aria-label={held ? 'Play the chains' : 'Pause the chains'}><PauseI held={held} /></button>}
      </div>
      <ul className="bci-prods" aria-label="Product pages that name this chain" onPointerLeave={() => setHover(null)}>
        {all.map((p) => (
          <li key={p.slug} className={lit.includes(p) ? 'on' : ''}>
            <A to={p.href} onPointerEnter={() => setHover(p.slug)} onFocus={() => setHover(p.slug)} onBlur={() => setHover(null)}>{p.name}</A>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Hero({ doc, chains, all, onChain, alsoRun }) {
  const [t1, ...tr] = doc.title;
  return (
    <section className="bci-hero" aria-labelledby="bci-h1">
      <div className="bz-wrap">
        <h1 id="bci-h1" className="bci-h1 bz-lines now" data-morph-target>
          <span className="bz-line"><span style={{ '--i': 0 }}>{t1}</span></span>
          {tr.map((t, k) => <Fragment key={k}>{' '}<span className="bz-line soft"><span style={{ '--i': k + 1 }}>{t}</span></span></Fragment>)}
        </h1>
        {doc.chip && <p className="bci-cap x-mono">{doc.chip}</p>}
        <div className="bci-ask">
          <div className="bci-acts">
            <Cta to={GO[doc.actions[0]] || '/signup'} id="blockchain.hero" kind="solid" thumb>{doc.actions[0]}</Cta>
            {doc.actions.slice(1).map((t) => <More key={t} to={GO[t] || '/signup'}>{t}</More>)}
          </div>
          <p className="bci-note">{doc.note}</p>
        </div>
        <Reel chains={chains} all={all} onChain={onChain} alsoRun={alsoRun} />
      </div>
    </section>
  );
}

/* Hanzo's lede, its categories and its four facts, after the first screen */
function Intro({ doc }) {
  return (
    <section className="bci-intro" aria-label={doc.cats.join(', ')}>
      <div className="bz-wrap">
        <div className="bci-more">
          <p className="bz-body">{doc.lede}</p>
          <ul className="bci-cats">{doc.cats.map((c) => <li key={c}>{c}</li>)}</ul>
        </div>
        <dl className="bci-facts">
          {doc.facts.map(([a, b, c]) => <div key={a}><dt className="x-mono">{a}</dt><dd><b><span>{b}</span></b><span>{c}</span></dd></div>)}
        </dl>
      </div>
    </section>
  );
}

/* The pieces: a pinned scene. The index scrolls on the right; the stage on the left holds one piece at a time (the
   row at the middle of the screen, or the one under the pointer or focus): its number, name, line and the chains
   its page names, with the reel's last chain marked. Each name morphs into its page's hero when you open it. */
const FIRST = 8; // desktop shows the first 8; phones fold to the first 5 (CSS), and the button opens the rest either way
const FIRST_PH = 5;
function Pieces({ b, all, chain, onSeen }) {
  const find = (h) => all.find((p) => bare(p.href) === bare(h));
  const [more, setMore] = useState(false);
  const [at, setAt] = useState(0);
  const [point, setPoint] = useState(-1);
  const list = useRef(null);
  const sec = useRef(null);
  const seen = useInView(sec);
  useEffect(() => { onSeen && onSeen(seen); }, [seen]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    const el = list.current;
    if (!el) return;
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) setAt(+e.target.dataset.k); }), { rootMargin: '-48% 0px -48% 0px' });
    el.querySelectorAll(':scope > li').forEach((li) => io.observe(li));
    return () => io.disconnect();
  }, [more]);
  const k = point >= 0 ? point : at;
  const c = b.cards[k];
  const p = c && find(c.href);
  return (
    <section className="bz-sec bci-pieces" aria-labelledby="bci-pieces-h" ref={sec}>
      <div className="bz-wrap bz-grid">
        <header className="bci-ph">
          <BizLines id="bci-pieces-h" className="bz-headline" lines={[b.title]} />
          <p className="bz-body">{b.lede}</p>
          <p className="bci-ph-n x-mono">{b.cards.length} pieces · open one</p>
          {c && (
            <div className="bci-stage" aria-hidden="true">
              <div className="bci-stage-in" key={k}>
                <p className="bci-stage-n x-mono"><span><b>{two(k + 1)}</b> / {two(b.cards.length)}</span>{chain && <span className="bci-stage-k">chain: <b key={chain}>{chain}</b></span>}</p>
                <p className="bci-stage-t">{c.name}</p>
                <p className="bci-stage-d">{c.text}</p>
                {p ? (
                  <ul className="bci-stage-c">
                    {p.chains.slice(0, 14).map((x) => <li key={x} className={chain && (x === chain || x.startsWith(chain + ' ')) ? 'on' : ''}>{x}</li>)}
                    {p.chains.length > 14 && <li className="n">+{p.chains.length - 14}</li>}
                  </ul>
                ) : <p className="bci-stage-c none x-mono">{c.cta}</p>}
              </div>
            </div>
          )}
        </header>
        <ol className={'bci-index' + (more ? ' all' : '')} ref={list} onPointerLeave={() => setPoint(-1)}>
          {b.cards.map((c2, j) => {
            const q = find(c2.href);
            const has = q && chain && names(q.chains, chain);
            return (
              <li key={c2.name} data-k={j} hidden={j >= FIRST && !more} className={j === k ? 'on' : ''}>
                <A to={c2.href} className="bci-card" onPointerEnter={(e) => e.pointerType === 'mouse' && setPoint(j)} onFocus={() => setPoint(j)} onBlur={() => setPoint(-1)}>
                  <span className="bci-card-n x-mono" aria-hidden="true">{two(j + 1)}</span>
                  <b className="bci-card-t" data-morph><span>{c2.name}</span></b>
                  <span className="bci-card-d">{c2.text}</span>
                  <span className="bci-card-c x-mono">{q ? <><i className={'bci-dot' + (has ? ' on' : '')} aria-hidden="true" /><b>{q.chains.length}</b> chains on its page</> : ' '}</span>
                  <span className="bci-card-go"><i>{c2.cta}</i><Arrow /></span>
                </A>
              </li>
            );
          })}
        </ol>
        {b.cards.length > FIRST_PH && (
          <button type="button" className={'bci-all' + (b.cards.length > FIRST ? '' : ' ph')} aria-expanded={more} onClick={() => setMore(!more)}>
            <span>{more ? 'Show fewer' : `Show all ${b.cards.length} pieces`}</span><i aria-hidden="true" />
          </button>
        )}
      </div>
    </section>
  );
}

/* What sits behind the key: nine groups, one open at a time, beside a map of the nine (the open one in ink; point
   at a tile to see its name, press it to open that group) */
function Groups({ b }) {
  const [open, setOpen] = useState(0);
  const [peek, setPeek] = useState(-1);
  const sec = useRef(null);
  const [walk, touch] = useWalk(sec, b.groups.length, 1300); // the map walks its nine tiles once by itself
  const lit = peek >= 0 ? peek : walk;
  const shown = lit >= 0 ? lit : open;
  const take = (k) => { touch(); setPeek(k); };
  const setMine = () => touch();
  return (
    <section className="bz-sec bci-groups" aria-labelledby="bci-groups-h" ref={sec}>
      <div className="bz-wrap bz-grid">
        <header className="bci-gh">
          <BizLines id="bci-groups-h" className="bz-headline" lines={[b.title]} />
          <p className="bz-body">{b.lede}</p>
          <div className="bci-map" aria-hidden="true" onPointerLeave={() => setPeek(-1)}>
            <div className="bci-map-g">
              {b.groups.map((g, k) => (
                <button key={g.title} type="button" tabIndex={-1} className={(k === open ? 'on' : '') + (k === lit ? ' peek' : '')} onPointerEnter={() => take(k)} onClick={() => { setMine(true); setOpen(k); }}>
                  <span className="x-mono">{two(k + 1)}</span>
                </button>
              ))}
            </div>
            <p className="bci-map-t"><span key={shown}>{b.groups[shown] ? b.groups[shown].title : ''}</span></p>
          </div>
        </header>
        <ul className="bci-glist">
          {b.groups.map((g, k) => (
            <li key={g.title} className={open === k ? 'on' : lit === k ? 'lit' : ''}>
              <button type="button" aria-expanded={open === k} aria-controls={'bci-g' + k} onClick={() => { setMine(true); setOpen(open === k ? -1 : k); }} onPointerEnter={() => take(k)} onPointerLeave={() => setPeek(-1)}>
                <span className="x-mono">{two(k + 1)}</span>
                <b><span>{g.title}</span></b>
                <i aria-hidden="true" />
              </button>
              <p id={'bci-g' + k} className="bci-gtext" hidden={open !== k}>{g.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* the agent's code streams in once, line by line, when it reaches the screen: every line is in the HTML (and copies
   whole); a pause control sits first; it ends on the whole code. Reduced motion and JS off show it whole. */
function Streamed({ code, label }) {
  const box = useRef(null);
  const [state, setState] = useState('idle'); // idle | run | held | done
  const st = useRef('idle');
  const tm = useRef(0);
  const step = useRef(() => {});
  useEffect(() => {
    const el = box.current;
    if (!el || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const r = el.getBoundingClientRect();
    if (r.top < innerHeight && r.bottom > 0) return; // already on screen: leave it whole
    const lines = [...el.querySelectorAll('.x-codeblock-l')];
    el.classList.add('bci-streaming');
    let k = 0;
    step.current = () => {
      if (st.current !== 'run') return;
      if (k >= lines.length) { el.classList.remove('bci-streaming'); el.classList.add('bci-streamed'); st.current = 'done'; setState('done'); play('done'); return; }
      lines[k].classList.add('on');
      k++;
      tm.current = setTimeout(step.current, lines[k - 1].textContent.trim() ? 230 : 60);
    };
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      st.current = 'run'; setState('run');
      step.current();
    }, { threshold: 0.4 });
    io.observe(el);
    return () => { clearTimeout(tm.current); io.disconnect(); el.classList.remove('bci-streaming'); };
  }, []);
  const toggle = () => {
    if (st.current === 'run') { st.current = 'held'; setState('held'); clearTimeout(tm.current); }
    else if (st.current === 'held') { st.current = 'run'; setState('run'); step.current(); }
  };
  return (
    <div className="bci-code-w" ref={box}>
      {(state === 'run' || state === 'held') && (
        <button type="button" className="bci-pause dark" aria-pressed={state === 'held'} aria-label={ui('pause')} onClick={toggle}><PauseI held={state === 'held'} /></button>
      )}
      <CodeBlock code={code} label={label} className="bci-code" />
    </div>
  );
}

/* The one dark room: an agent with an address, and the code that gives it one. */
function Agent({ b }) {
  return (
    <section className="bz-sec bci-agent" data-room="dark" aria-labelledby="bci-agent-h">
      <div className="bz-wrap bz-grid">
        <div className="bci-agent-copy">
          <BizLines id="bci-agent-h" className="bz-headline" lines={b.title} />
          <p className="bci-tag x-mono">{b.chip}</p>
          <p className="bz-body">{b.lede}</p>
          <ul className="bci-bul">{b.bullets.map((x, k) => <li key={x}><span className="x-mono" aria-hidden="true">{two(k + 1)}</span><span>{x}</span></li>)}</ul>
        </div>
        <Streamed code={b.code.text} label={b.file} />
      </div>
    </section>
  );
}

/* Beyond: the coverage matrix, read across (a product) and down (a chain); a cell, or a chain name, lights its row
   and column. */
function Matrix({ b, all }) {
  const cols = useMemo(() => {
    const c = {};
    all.forEach((p) => p.chains.forEach((x) => { c[x] = (c[x] || 0) + 1; }));
    return Object.keys(c).sort((x, y) => c[y] - c[x]).map((x) => [x, c[x]]);
  }, [all]);
  const [hot0, setHot0] = useState(null);
  // until you point at it, the crosshair walks the matrix by itself (one cell a beat, each product once, then rests)
  const sec = useRef(null);
  const [step, touch, mine] = useWalk(sec, all.length, 1400);
  const walk = step >= 0 ? [step, all[step].chains.length ? Math.max(0, cols.findIndex(([x]) => x === all[step].chains[step % all[step].chains.length])) : 0] : null;
  const hot = hot0 || walk;
  const setHot = (v) => { if (v) touch(); setHot0(v); };
  const [r, c] = hot || [-1, -1];
  const down = (j) => `${cols[j][1]} ${cols[j][1] === 1 ? 'product' : 'products'} down`;
  const read = !hot ? 'Point at a cell, or tap one'
    : r < 0 ? (c >= 0 ? `${cols[c][0]} · ${down(c)}` : 'Point at a cell, or tap one')
    : `${all[r].name} × ${cols[c][0]}: ${all[r].chains.includes(cols[c][0]) ? 'named on its page' : 'not named on its page'} · ${all[r].chains.length} chains across · ${down(c)}`;
  const colOf = (x) => cols.findIndex(([y]) => y === x || y.startsWith(x + ' '));
  return (
    <section className="bz-sec bci-mx-sec" aria-labelledby="bci-chains-h" ref={sec}>
      <div className="bz-wrap">
        <div className="bci-mx-head">
          <BizLines id="bci-chains-h" className="bz-headline" lines={[b.title]} />
          <p className="bz-body">{b.lede}</p>
        </div>
        <p className="bci-run" onPointerLeave={() => setHot(null)}>{b.chains.map((x, k) => (
          <Fragment key={x}><span className={c >= 0 && colOf(x) === c ? 'on' : ''} onPointerEnter={() => { const j = colOf(x); if (j >= 0) setHot([-1, j]); }}>{x}</span>{k < b.chains.length - 1 && <i aria-hidden="true"> · </i>}</Fragment>
        ))}</p>
        <p className="bci-read x-mono" aria-live={mine ? 'polite' : 'off'}>{read}</p>
        <div className="bci-mx" data-swipe-own onPointerLeave={() => setHot(null)} style={{ '--cols': cols.length }}>
          {hot && <style>{`${r >= 0 ? `.bci-mx .x-table tbody tr:nth-child(${r + 1}) > *, ` : ''}.bci-mx .x-table tr > :nth-child(${c + 2}) { background-color: light-dark(#f5f5f5, var(--x-fill)); } ${r >= 0 ? `.bci-mx .x-table tbody tr:nth-child(${r + 1}) > :nth-child(${c + 2}) { background-color: light-dark(#d4d4d4, var(--secondary)); }` : ''} .bci-mx .x-table thead th:nth-child(${c + 2}) .bci-vh { color: var(--ink); }`}</style>}
          <DataTable
            caption="Products × chains"
            cols={[{ key: 'p', label: 'Product' }, ...cols.map(([x], j) => ({ key: 'c' + j, label: <span className="bci-vh">{x}</span> })), { key: 'n', label: 'chains', num: true }]}
            rows={[
              ...all.map((p, i) => ({
                p: <A to={p.href}>{p.name}</A>,
                ...Object.fromEntries(cols.map(([x], j) => {
                  const on = p.chains.includes(x);
                  return ['c' + j, <span className={'bci-cell' + (on ? ' on' : '')} onPointerEnter={() => setHot([i, j])} onClick={() => setHot([i, j])}>{on ? <i aria-label={`${p.name} names ${x}`} /> : <span className="x-sr">—</span>}</span>];
                })),
                n: p.chains.length,
              })),
              { p: 'products', ...Object.fromEntries(cols.map(([x, k], j) => ['c' + j, k])), n: '' },
            ]}
          />
        </div>
      </div>
    </section>
  );
}

/* The close: one sentence at Display size, the same solid ask, and one full-width row for the other door. */
function End({ b }) {
  const [ask, ...rest] = b.buttons;
  return (
    <section className="bz-sec bci-end" aria-labelledby="bci-end-h">
      <div className="bz-wrap">
        <div className="bci-end-top">
          <div className="bci-end-main">
            <BizLines id="bci-end-h" className="bz-display md" lines={[b.title]} />
            <p className="bz-lede">{b.lede}</p>
          </div>
          <Cta to={GO[ask] || '/signup'} id="blockchain.close" kind="solid" size="lg" thumb>{ask}</Cta>
        </div>
        <ul className="bci-rows">
          {rest.map((t) => <li key={t}><A to={GO[t] || '/signup'} className="bci-row"><b>{t}</b><Arrow /></A></li>)}
          {b.links.map((l) => <li key={l.href}><A to={l.href} className="bci-row"><b>{l.label}</b><Arrow /></A></li>)}
        </ul>
        <ul className="bci-points">{b.points.map((x) => <li key={x}>{x}</li>)}</ul>
      </div>
    </section>
  );
}

export default function BlockchainIndex({ doc, all }) {
  const find = (k) => doc.blocks.find((b) => b.kind === k);
  const chainsBlock = find('chains');
  const chains = chainsBlock ? chainsBlock.chains : ['Ethereum'];
  const pieces = find('pieces'), groups = find('groups'), agent = find('agent'), last = find('band');
  const [chain, setChain] = useState(chains[0]);
  const [piecesSeen, setPiecesSeen] = useState(false);
  return (
    <main className="bz bci">
      <span data-ask-name="Hanzo Blockchain" hidden />
      <Hero doc={doc} chains={chains} all={all} onChain={setChain} alsoRun={piecesSeen} />
      <Intro doc={doc} />
      {pieces && <Pieces b={pieces} all={all} chain={chain} onSeen={setPiecesSeen} />}
      {groups && <Groups b={groups} />}
      {agent && <Agent b={agent} />}
      {chainsBlock && <Matrix b={chainsBlock} all={all} />}
      {last && <End b={last} />}
    </main>
  );
}
