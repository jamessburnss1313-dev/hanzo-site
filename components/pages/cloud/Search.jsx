'use client';
/* Search (v2, Cloud 4 chat). Stage hero with a flip board → four ways as a sticky stack → a dark "how it works" room →
   pricing with a fit-finder → frameworks → Get Search (centred close). No pinned scene. Ink, greys and white only.
   Persona: a developer adding search to their docs or product. Goal: read the docs and create an index.
   CTA: "Read the docs" (hero solid, data-thumb; data-cta primary / close). Desktop: the shared header outlines its
   "Try Hanzo" while a "Read the docs" is on screen and carries "Read the docs" solid once the hero ask scrolls away.
   Phone (≤700px): the header keeps a solid "Try Hanzo", so the hero's "Read the docs" sits quiet (outlined) and the
   shared slim bar carries it after the hero; one solid per viewport at both widths.
   Metric: api_key_created (developers, MASTER §1).
   V2: 8/10 motion-map: flip-board + blinds, sticky-stack, zoom-through, pull-back, grow-from-point
   Signature: flip-board. "Kubernets" types itself into a search bar the size of the screen; under it the results are a
   departure board (rank, document, where it matched), and every time the mode changes (Text, Vector, RRF, by itself or
   pressed) the tiles that differ flip through letters and land on the new ranking.
   Beyond: "Which plan fits?" Set your projects and docs per project and the plan whose limits cover them lights up, read
   straight from Hanzo's own plan limits.
   Entrances, in page order: hero object blinds; four ways sticky-stack; dark room zoom-through; pricing pull-back;
   frameworks grow-from-point (from the last place pressed or pointed). Each runs once on entering view; JS off and
   reduced motion show the final state. Also: typing and streaming (time), tab pill (state). Idle lower down: the dark room steps through index, query and ask on its own while in
   view (pause first in the room), and the closing bar retypes the query and fuses its two lists once at 60% in view. The hero object runs on arrival and carries a pause control. Every word, price and link is
   Hanzo's; the query, the results and the RAG question are examples, and the streamed answer is Hanzo's own sentence. */
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useInView } from 'motion/react';
import useCalm from '../../v2/useCalm';
import { EASE } from '../../ui';
import { A, Cta } from '../../kit';
import { useSteps } from './Frame';
import { useDemo, PauseBtn } from '../../v2/x-hamilton/Demo';
import Console from '../../v2/x-hamilton/Console';
import Drawer from '../../v2/Drawer';
import StageHero from '../../v2/StageHero';
import Finale from '../../v2/Finale';
import './Search.css';

const DOCS = 'https://docs.hanzo.ai/docs/cli/search';
const GH = 'https://github.com/hanzoai';
const MODES = [['Text', 'Typos and facets'], ['Vector', 'Your embeddings'], ['RRF', 'One merged rank'], ['RAG', 'Answers with sources']];
const Q = 'Kubernets';
const TEXT = ['Deploy to Kubernetes', 'Kubernetes ingress', 'Cluster quotas'];
const VEC = ['Running containers in production', 'Deploy to Kubernetes', 'Scaling a service'];
const RRF = ['Deploy to Kubernetes', 'Kubernetes ingress', 'Running containers in production', 'Cluster quotas'];
const FROM = { 'Deploy to Kubernetes': 'text · vector', 'Kubernetes ingress': 'text', 'Running containers in production': 'vector', 'Cluster quotas': 'text' };
// RAG: an example question about Hanzo's own docs; the streamed answer is Hanzo's sentence, the sources its headings
const RAG_Q = 'How does RAG chat answer?';
const RAG_A = 'The retrieved passages go to a model and come back as an answer with links to what it read.';
const SRC = ['RAG chat', 'How it works'];

/* Entrances (MOTION-MAP /search): each main section arrives its own way, once, when it enters view. The hidden
   start states live in Search.css under html.js only, and reduced motion shows the final state. */
function useEnter(ref, amount = 0.2) {
  const seen = useInView(ref, { amount, once: true });
  return seen ? ' in' : '';
}
// grow-from-point: the last place the visitor pressed or pointed, in page coordinates
const lastPoint = { x: null, y: null };
if (typeof window !== 'undefined') {
  const keep = (e) => { lastPoint.x = e.pageX; lastPoint.y = e.pageY; };
  window.addEventListener('pointerdown', keep, { passive: true });
  window.addEventListener('pointermove', keep, { passive: true });
}

/* Signature: the flip board. The results are a departure board: rank, document and where it matched, one tile per
   character. When the mode changes, every tile that differs flips through a few letters and lands on the new value,
   left to right, like a station board. One timer drives the board; reduced motion sets the values at once. */
const FLAP = ' ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789·';
const COLS = [1, 32, 13];
const pad = (v, n) => (v + ' '.repeat(n)).slice(0, n);
const lineOf = (row) => COLS.map((n, i) => pad(row[i] || '', n)).join('');
function FlipBoard({ rows, calm }) {
  const want = rows.map(lineOf);
  const key = want.join('|');
  const [shown, setShown] = useState(want);
  const left = useRef(null);
  useEffect(() => {
    if (calm) { setShown(want); return; }
    // each tile that changes gets a few random letters first; tiles further right wait a little longer
    left.current = want.map((w, r) => [...w].map((ch, c) => (shown[r][c] === ch ? 0 : 2 + ((c + r * 3) % 4) + Math.floor(c / 9))));
    let t = 0;
    const tick = () => {
      let busy = false;
      const next = want.map((line, r) => [...line].map((ch, c) => {
        const n = left.current[r][c];
        if (n <= 0) return ch;
        left.current[r][c] = n - 1;
        busy = true;
        return n === 1 ? ch : FLAP[(c * 7 + n * 13 + r) % FLAP.length];
      }).join(''));
      setShown(next);
      if (busy) t = setTimeout(tick, 70);
    };
    t = setTimeout(tick, 70);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, calm]);
  return (
    <div className="se2-board" aria-hidden="true">
      {shown.map((line, r) => (
        <div className={'se2-board-row' + (r === 0 ? ' top' : '')} key={r}>
          {[...line].map((ch, c) => (
            <span key={c + ':' + ch} className={'se2-tile' + (c === 0 ? ' rk' : c > COLS[0] + COLS[1] - 1 ? ' src' : '')}>{ch === ' ' ? '\u00a0' : ch}</span>
          ))}
        </div>
      ))}
    </div>
  );
}

/* An answer that streams in word by word (written into a text node), sources after it. */
function Streamed({ run, big }) {
  const out = useRef(null);
  const [done, setDone] = useState(!run);
  useEffect(() => {
    const words = RAG_A.split(' ');
    if (!run) { if (out.current) out.current.textContent = RAG_A; setDone(true); return; }
    let i = 0;
    setDone(false);
    if (out.current) out.current.textContent = '';
    let t = 0;
    const step = () => {
      i++;
      if (out.current) out.current.textContent = words.slice(0, i).join(' ');
      if (i >= words.length) setDone(true); else t = setTimeout(step, 90);
    };
    t = setTimeout(step, 90);
    return () => clearTimeout(t);
  }, [run]);
  return (
    <div className={'se2-rag' + (big ? ' big' : '')}>
      <p className="se2-rag-q">{RAG_Q}</p>
      <p className="se2-rag-a"><span className="se2-ghost" aria-hidden="true">{RAG_A}</span><span className="se2-live"><span ref={out}>{RAG_A}</span>{!done && <i className="se2-caret sm" aria-hidden="true" />}</span></p>
      <div className={'se2-srcs' + (done ? ' on' : '')}>{SRC.map((x, i) => <span key={x} className="l2-mono">[{i + 1}] {x}</span>)}</div>
    </div>
  );
}

/* The Stage object: a search bar the size of the screen. The query types itself (into a text node), then the four
   modes take turns over the same results; press a mode to hold it. */
function Ask() {
  const [ref, live, calm, paused, toggle] = useDemo(0.05);
  const [at, choose] = useSteps(4, 4200, live);
  const enter = useEnter(ref, 0.1);
  const box = useRef(null);
  const [typed, setTyped] = useState(true);
  useEffect(() => {
    if (calm || !live) { if (box.current) box.current.textContent = Q; setTyped(true); return; }
    if (at !== 0) return;
    let i = 0;
    setTyped(false);
    if (box.current) box.current.textContent = '';
    let t = 0;
    const step = () => {
      i++;
      if (box.current) box.current.textContent = Q.slice(0, i);
      if (i >= Q.length) setTyped(true); else t = setTimeout(step, 105);
    };
    t = setTimeout(step, 105);
    return () => clearTimeout(t);
  }, [at, live, calm]);
  const rows = at === 0 ? TEXT : at === 1 ? VEC : RRF;
  return (
    <div className={'l2-obj se2-ask se2-e-blinds' + enter} ref={ref}>
      <PauseBtn paused={paused} onClick={toggle} />
      <div className="se2-blinds" aria-hidden="true">{Array.from({ length: 8 }, (_, i) => <i key={i} style={{ transitionDelay: i * 55 + 'ms' }} />)}</div>
      <div className="se2-bar">
        <svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5" fill="none" stroke="currentColor" strokeWidth="2" /><path d="M15.5 15.5 21 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
        <span className="se2-q" ref={box} aria-hidden="true">{Q}</span><i className="se2-caret" aria-hidden="true" />
        <span className="se2-api l2-mono" aria-hidden="true">/v1/search</span>
      </div>
      <div className="se2-modes" role="tablist" aria-label="Search mode">
        {MODES.map(([m, d], i) => (
          <button key={m} type="button" role="tab" aria-selected={at === i} onClick={() => choose(i)}>
            {at === i && <motion.span layoutId="se2-mode" className="se2-mode-bg" transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }} />}
            <b>{m}</b><span>{d}</span>
          </button>
        ))}
      </div>
      <div className="se2-out" aria-hidden="true">
        {at < 3 ? (
          <div className={'se2-board-wrap' + (typed ? '' : ' wait')}>
            <FlipBoard calm={calm} rows={[0, 1, 2, 3].map((i) => (rows[i] ? [String(i + 1), rows[i], at === 2 ? FROM[rows[i]] : at === 0 ? 'text' : 'vector'] : ['', '', '']))} />
            <p className="se2-board-cap l2-mono">{at === 0 ? 'typo fixed' : at === 2 ? 'one merged rank' : 'docs · vector'}</p>
          </div>
        ) : (
          <Streamed run={live} />
        )}
      </div>
    </div>
  );
}

const WAYS = [
  ['Full text', "Typo tolerance, facets and filters. A user who types Kubernets still finds the page, and a user who wants only last quarter's docs can say so."],
  ['Vector', "Bring your own embedding model — ours or anyone's — and search by meaning. Useful exactly when the user does not know the word your document uses."],
  ['Hybrid', 'Reciprocal Rank Fusion merges the two lists by rank rather than by score, so a keyword hit and a semantic hit compete fairly without a threshold you have to tune.'],
  ['RAG chat', 'The retrieved passages go to a model and come back as an answer with links to what it read. Streamed, so the first sentence arrives before the last one is written.'],
];

// a fixed scatter of documents in embedding space; the query sits among its three nearest by meaning
const DOTS = Array.from({ length: 46 }, (_, i) => { const a = Math.sin(i * 12.9898) * 43758.5453, b = Math.sin(i * 78.233) * 12543.1; return [Math.round(60 + (a - Math.floor(a)) * 880) / 10, Math.round(80 + (b - Math.floor(b)) * 840) / 10]; });
const NEAR = [[60, 30, 'Running containers in production'], [70, 52, 'Deploy to Kubernetes'], [44, 58, 'Scaling a service']];

/* Chapter 01's word: "Kubernets" as typed, then the missing "e" drops in and is underlined (once, when seen). */
function FixWord({ run }) {
  const [fixed, setFixed] = useState(true);
  useEffect(() => {
    if (!run) return;
    setFixed(false);
    const t = setTimeout(() => setFixed(true), 1100);
    return () => clearTimeout(t);
  }, [run]);
  return <p className="se2-w0-q">Kubern<mark className={fixed ? 'on' : ''}>e</mark>tes</p>;
}

/* One chapter's picture, for the chapter reached. */
function Way({ at }) {
  const calm = useCalm();
  const ref = useRef(null);
  const seen = useInView(ref, { amount: 0.6 });
  const [fused, setFused] = useState(false);
  useEffect(() => { if (at !== 2) return; if (calm) { setFused(true); return; } if (!seen) { setFused(false); return; } const t = setTimeout(() => setFused(true), 900); return () => clearTimeout(t); }, [at, calm, seen]);
  return (
    <div className="l2-obj se2-way" ref={ref}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div key={at} className="se2-way-in" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16, transition: { duration: 0.2 } }} transition={{ duration: 0.55, ease: EASE }}>
          {at === 0 && (
            <div className="se2-w0">
              <FixWord run={!calm && seen} />
              <div className="se2-w0-f l2-mono"><span>docs</span><span className="on">last quarter</span></div>
              <ol>{TEXT.map((r, i) => <li key={r}><span className="l2-mono">{i + 1}</span>{r}{i === 0 && <em className="se2-fixc l2-mono">typo fixed</em>}</li>)}</ol>
            </div>
          )}
          {at === 1 && (
            <div className={'se2-w1' + (seen || calm ? ' go' : '')}>
              <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">{NEAR.map(([x, y], i) => <line key={i} x1="58" y1="46" x2={x} y2={y} style={{ animationDelay: 0.2 + i * 0.12 + 's' }} />)}</svg>
              {DOTS.map(([x, y], i) => <i key={i} style={{ left: x + '%', top: y + '%' }} />)}
              {NEAR.map(([x, y], i) => <i key={'n' + i} className="near" style={{ left: x + '%', top: y + '%' }} />)}
              <i className="q" style={{ left: '58%', top: '46%' }} />
            </div>
          )}
          {at === 1 && <ul className="se2-w1-l">{NEAR.map(([x, y, t]) => <li key={t} className={x >= 60 ? 'r' : ''} style={{ left: x + '%', top: y + '%' }}>{t}</li>)}<li className="q" style={{ left: '58%', top: '46%' }}>{Q}</li></ul>}
          {at === 1 && <ol className="se2-w1-list">{NEAR.map(([, , t], i) => <li key={t}><span className="l2-mono">{i + 1}</span>{t}</li>)}</ol>}
          {at === 2 && (
            <div className={'se2-w2' + (fused ? ' fused' : '')}>
              {!fused && <ol className="a">{TEXT.map((r) => <motion.li key={r} layoutId={'f-' + r}>{r}</motion.li>)}</ol>}
              {!fused && <ol className="b">{VEC.filter((r) => !TEXT.includes(r)).map((r) => <motion.li key={r} layoutId={'f-' + r}>{r}</motion.li>)}</ol>}
              {fused && <ol className="m">{RRF.map((r, i) => <motion.li key={r} layoutId={'f-' + r} transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1], delay: i * 0.04 }}><span className="l2-mono">{i + 1}</span>{r}<em className="l2-mono">{FROM[r]}</em></motion.li>)}</ol>}
            </div>
          )}
          {at === 3 && (
            <div className="se2-w3"><Streamed run={!calm && seen} big /></div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/* The four ways, as cards that stack at the top as you scroll past them (sticky-stack); each card keeps its picture. */
function Ways() {
  const ref = useRef(null);
  const enter = useEnter(ref, 0.05);
  return (
    <section className={'l2-sec se2-ways se2-e-stack' + enter} ref={ref}>
      <div className="l2-wrap">
        <div className="se2-ways-h">
          <h2 className="l2-head">Four ways to ask, one index</h2>
          <p className="l2-lede">The same documents answer all four. Choose per query, not per deployment.</p>
        </div>
        <ol className="se2-stack">
          {WAYS.map(([t, d], i) => (
            <li key={t} className="se2-card" style={{ '--i': i }}>
              <div className="se2-card-copy">
                <h3 className="l2-title">{t}</h3>
                <p className="se2-card-n l2-mono">{String(i + 1).padStart(2, '0')} / {String(WAYS.length).padStart(2, '0')}</p>
                <p className="l2-body">{d}</p>
              </div>
              <div className="se2-card-vis" aria-hidden="true"><Way at={i} /></div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

const STEPS = [
  ['Index your content', 'Push documents at build time or over the REST API. Text fields become searchable as they land; embeddings go to the vector store beside them. Adding a vector field later does not force a text reindex.'],
  ['Query it from anywhere', 'A React hook for search-as-you-type, the REST API for everything else, and an MCP tool so an agent can search the same index a user searches. One index, three callers.'],
  ['Let people ask instead', 'Turn on RAG chat and a question gets an answer built from the passages that were retrieved, each one linked. If the index has nothing, the answer says so rather than inventing one.'],
];

/* Page-local stepper: auto-advances every ms while live. A press holds for good (pick); hover or focus holds only
   while the pointer or focus stays (peek / leave), then the cycle resumes from that step after 1.5 s. */
function useCycle(n, ms, live) {
  const [at, setAt] = useState(0);
  const [held, setHeld] = useState(false);
  const [peeking, setPeeking] = useState(false);
  const back = useRef(false);
  useEffect(() => {
    if (!live || held || peeking) return;
    const wait = back.current ? 1500 : ms;
    back.current = false;
    const t = setTimeout(() => setAt((v) => (v + 1) % n), wait);
    return () => clearTimeout(t);
  }, [at, live, held, peeking, n, ms]);
  return {
    at,
    pick: (i) => { setAt(i); setHeld(true); },
    peek: (i) => { setAt(i); setPeeking(true); },
    leave: () => { back.current = true; setPeeking(false); },
  };
}

const CALLERS = ['React hook', 'REST API', 'MCP tool'];
const LANDING = ['Deploy to Kubernetes', 'Kubernetes ingress', 'Cluster quotas', 'Scaling a service'];

/* The dark room's object is the bar itself, small, showing what each step does: documents landing in the index, the
   three callers reaching the same index, and an answer with its two linked sources. While the room is in view the steps
   take turns by themselves (4.2 s each); hover, focus or tap holds one, and the pause sits first in the room. */
function HowBar({ at }) {
  return (
    <div className="se2-hb" aria-hidden="true">
      <div className="se2-hb-bar"><svg viewBox="0 0 24 24" width="18" height="18"><circle cx="10.5" cy="10.5" r="6.5" fill="none" stroke="currentColor" strokeWidth="2" /><path d="M15.5 15.5 21 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg><span className="l2-mono">/v1/search</span><b className="l2-mono">one index</b></div>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div key={at} className="se2-hb-in" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10, transition: { duration: 0.18 } }} transition={{ duration: 0.45, ease: EASE }}>
          {at === 0 && <ol className="se2-hb-docs">{LANDING.map((d, i) => <motion.li key={d} initial={{ opacity: 0, y: -18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 + i * 0.09, duration: 0.3, ease: [0.16, 1, 0.3, 1] }}><span className="l2-mono">text</span>{d}<em className="l2-mono">vector</em></motion.li>)}</ol>}
          {at === 1 && <div className="se2-hb-call">{CALLERS.map((c, i) => <motion.span key={c} className="l2-mono" initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1, duration: 0.4, ease: EASE }}>{c}<i /></motion.span>)}<b className="l2-mono">one index</b></div>}
          {at === 2 && <Streamed run />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function How() {
  const [ref, live, , paused, toggle] = useDemo(0.35);
  const { at, pick, peek, leave } = useCycle(3, 4200, live);
  const enter = useEnter(ref, 0.15);
  return (
    <section className={'l2-sec l2-dark se2-how se2-e-zoom' + enter} data-room="dark" ref={ref}>
      <div className="l2-wrap l2-grid se2-e-in">
        <div className="se2-how-l">
          <PauseBtn paused={paused} onClick={toggle} className="se2-how-pause" />
          <h2 className="l2-head">How it works</h2>
          <p className="l2-lede">Content in, ranked results out, and a model over the top if you want one.</p>
          <HowBar at={at} />
          <div className="se2-con-open">
            <Drawer label="Console" title="Hanzo Search">
              <Console name="Search" api="/v1/search" side={SIDE} />
              <p className="se2-note">Example project. Every name in it is one you would give your own.</p>
            </Drawer>
          </div>
        </div>
        <ol className="se2-steps">
          {STEPS.map(([t, d], i) => (
            <li key={t} className={at === i ? 'on' : ''} onPointerEnter={(e) => e.pointerType === 'mouse' && peek(i)} onPointerLeave={(e) => e.pointerType === 'mouse' && leave()}>
              <h3 className="l2-title">{t}</h3>
              <span className="se2-step l2-mono">Step {String(i + 1).padStart(2, '0')}</span>
              <p className="l2-body">{d}</p>
              <button type="button" className="se2-step-hit" aria-pressed={at === i} aria-label={t} onClick={() => pick(i)} onFocus={() => peek(i)} onBlur={leave} />
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

const FW = ['Hanzo Docs', 'Fumadocs', 'Nextra', 'Docusaurus', 'REST API'];

/* Frameworks: pick one and the bar shows where its docs come from (native, or the REST API for everything else). */
function Frameworks() {
  const [ref, live] = useDemo(0.5);
  const { at, pick, peek, leave } = useCycle(FW.length, 2600, live);
  const enter = useEnter(ref, 0.3);
  const [pt, setPt] = useState(null);
  useEffect(() => {
    if (!enter || !ref.current) return;
    const r = (ref.current.querySelector('.se2-e-in') || ref.current).getBoundingClientRect();
    const x = lastPoint.x == null ? r.width / 2 : lastPoint.x - (r.left + scrollX);
    const y = lastPoint.y == null ? r.height / 2 : lastPoint.y - (r.top + scrollY);
    setPt({ '--gx': Math.round(Math.max(0, Math.min(r.width, x))) + 'px', '--gy': Math.round(Math.max(0, Math.min(r.height, y))) + 'px' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enter]);
  return (
    <section className={'l2-sec tight se2-fw se2-e-grow' + (enter && pt ? ' in' : '')} ref={ref} style={pt || undefined}>
      <div className="l2-wrap l2-grid se2-e-in">
        <div className="se2-fw-h">
          <h2 className="l2-head">Works with any docs framework</h2>
          <p className="l2-body">Native support for Hanzo Docs, Fumadocs, Nextra, and Docusaurus. REST API for everything else.</p>
          <div className="se2-fw-bar" aria-live="polite">
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5" fill="none" stroke="currentColor" strokeWidth="2" /><path d="M15.5 15.5 21 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
            <AnimatePresence mode="wait" initial={false}><motion.b key={at} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6, transition: { duration: 0.12 } }} transition={{ duration: 0.3, ease: EASE }}>{FW[at]}</motion.b></AnimatePresence>
            <span className="l2-mono">{at === 4 ? 'everything else' : 'native'}</span>
            <i className="l2-mono">/v1/search</i>
          </div>
        </div>
        <ul className="se2-fw-l">
          {FW.map((f, i) => (
            <li key={f} className={(i === 4 ? 'rest' : '') + (at === i ? ' on' : '')}>
              <button type="button" aria-pressed={at === i} onClick={() => pick(i)} onPointerEnter={(e) => e.pointerType === 'mouse' && peek(i)} onPointerLeave={(e) => e.pointerType === 'mouse' && leave()} onFocus={() => peek(i)} onBlur={leave}><span>{f}</span><em className="l2-mono">{i === 4 ? 'everything else' : 'native'}</em></button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

const PLANS = [
  ['Build', '$99', ['5 projects', '10k docs per project', '2,500 AI chat sessions', 'Unlimited searches', 'React hook + REST API'], 'Read the docs', DOCS, [5, 10000]],
  ['Scale', '$1,450', ['25 projects', '100k docs per project', '50,000 AI chat sessions', 'Unlimited searches', 'Priority support'], 'Read the docs', DOCS, [25, 100000]],
  ['Enterprise', 'Custom', ['Unlimited projects', 'Unlimited docs', 'Unlimited AI chat sessions', 'Dedicated support + SLA'], 'Contact Sales', '/contact-sales', [Infinity, Infinity]],
];
const PROJ = [1, 2, 3, 5, 8, 12, 25, 40, 80];
const DOCN = [1000, 5000, 10000, 25000, 50000, 100000, 250000, 1000000];
const k = (n) => (n >= 1000000 ? n / 1000000 + 'M' : n >= 1000 ? n / 1000 + 'k' : String(n));

/* Beyond: set projects and docs per project; the plan whose limits cover both lights up. */
const fillOf = (i, n) => ({ '--p': (i / (n - 1)) * 100 + '%' }); // the track fill, rendered once hydrated

function Pricing() {
  const [p, setP] = useState(3);
  const [d, setD] = useState(2);
  const box = useRef(null);
  const sec = useRef(null);
  const enter = useEnter(sec, 0.2);
  const [up, setUp] = useState(false); // the fill renders after hydration, so server and client HTML match
  useEffect(() => setUp(true), []);
  const seen = useInView(box, { amount: 0.6, once: true });
  const calm = useCalm();
  const touched = useRef(false);
  useEffect(() => {
    if (!seen || calm || touched.current) return;
    // roll from the smallest setting up to the default (5 projects, 10k docs): Build lights as the limits are reached
    let i = 0, t = 0;
    const steps = [[0, 0], [1, 0], [1, 1], [2, 1], [2, 2], [3, 2]];
    const go = () => { if (touched.current) return; const [a, b] = steps[i]; setP(a); setD(b); i++; if (i < steps.length) t = setTimeout(go, 260); };
    t = setTimeout(go, 200);
    return () => clearTimeout(t);
  }, [seen, calm]);
  const proj = PROJ[p], docs = DOCN[d];
  const fit = PLANS.findIndex(([, , , , , [mp, md]]) => proj <= mp && docs <= md);
  return (
    <section className={'l2-sec se2-price se2-e-pull' + enter} id="pricing" ref={sec}>
      <div className="l2-wrap l2-grid se2-e-in">
        <div className="se2-price-h">
          <h2 className="l2-head">Pricing</h2>
          <p className="l2-body">Pay for hosted search, vector, and AI. Self-host Meilisearch free forever.</p>
          <div className="se2-fit" role="group" aria-label="Which plan fits" ref={box} onPointerDown={() => { touched.current = true; }} onKeyDown={() => { touched.current = true; }}>
            <p className="l2-kick">Which plan fits</p>
            <label><span>Projects</span><b className="l2-mono">{proj}</b><input className="l2-range" style={up ? fillOf(p, PROJ.length) : undefined} type="range" min="0" max={PROJ.length - 1} value={p} onChange={(e) => setP(+e.target.value)} aria-valuetext={proj + ' projects'} /></label>
            <label><span>Docs per project</span><b className="l2-mono">{k(docs)}</b><input className="l2-range" style={up ? fillOf(d, DOCN.length) : undefined} type="range" min="0" max={DOCN.length - 1} value={d} onChange={(e) => setD(+e.target.value)} aria-valuetext={k(docs) + ' docs per project'} /></label>
            <p className="se2-fit-r" aria-live="polite"><span className="l2-mono">fits</span> <b>{PLANS[fit][0]}</b></p>
          </div>
        </div>
        <ol className="se2-plans">
          {PLANS.map(([n, pr, pts, cta, to], i) => (
            <li key={n} className={'se2-plan' + (i === fit ? ' fit' : '')}>
              <div className="se2-plan-n">
                <h3 className="l2-title">{n}</h3>
                <p className="se2-amt l2-fig">{pr}{pr.startsWith('$') && <span>mo</span>}</p>
              </div>
              <ul>{pts.map((x) => <li key={x}>{x}</li>)}</ul>
              <Cta to={to} kind="quiet" id={'plan-' + n.toLowerCase()}>{cta}</Cta>
            </li>
          ))}
        </ol>
        <p className="se2-meili">Meilisearch is open source. Self-host free forever. Pay only for our hosted API, vector search, and AI features.</p>
      </div>
    </section>
  );
}

/* The close's object: the page ends where it began. At 60% in view the bar types "Kubernets" again, the text and
   vector lists stand side by side, then fuse into one merged rank and rest (once; reduced motion shows the rank). */
function EndBar() {
  const ref = useRef(null);
  const seen = useInView(ref, { amount: 0.6, once: true });
  const calm = useCalm();
  const box = useRef(null);
  const [phase, setPhase] = useState(2); // 0 typing, 1 two lists, 2 one merged rank
  useEffect(() => {
    if (!seen || calm) return;
    setPhase(0);
    let i = 0, t = 0;
    if (box.current) box.current.textContent = '';
    const step = () => {
      i++;
      if (box.current) box.current.textContent = Q.slice(0, i);
      if (i < Q.length) t = setTimeout(step, 110);
      else { setPhase(1); t = setTimeout(() => setPhase(2), 1400); }
    };
    t = setTimeout(step, 300);
    return () => clearTimeout(t);
  }, [seen, calm]);
  return (
    <div className={'se2-end p' + phase} aria-hidden="true" ref={ref}>
      <div className="se2-hb-bar se2-end-bar"><svg viewBox="0 0 24 24" width="22" height="22"><circle cx="10.5" cy="10.5" r="6.5" fill="none" stroke="currentColor" strokeWidth="2" /><path d="M15.5 15.5 21 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg><span ref={box}>{Q}</span>{phase === 0 && <i className="se2-caret sm" />}<b className="l2-mono">{phase === 2 ? 'one merged rank' : 'text · vector'}</b></div>
      <div className={'se2-end-out' + (phase === 2 ? ' fused' : '')}>
        {phase === 1 && <ol className="a">{TEXT.map((r) => <motion.li key={r} layoutId={'e-' + r}>{r}<em className="l2-mono">text</em></motion.li>)}</ol>}
        {phase === 1 && <ol className="b">{VEC.filter((r) => !TEXT.includes(r)).map((r) => <motion.li key={r} layoutId={'e-' + r}>{r}<em className="l2-mono">vector</em></motion.li>)}</ol>}
        {phase === 2 && <ol className="m">{RRF.map((r, i) => <motion.li key={r} layoutId={'e-' + r} transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1], delay: i * 0.05 }}><span className="l2-mono">{i + 1}</span>{r}<em className="l2-mono">{FROM[r]}</em></motion.li>)}</ol>}
        {phase === 0 && <ol className="m wait">{RRF.map((r, i) => <li key={r}><span className="l2-mono">{i + 1}</span>{r}<em className="l2-mono">{FROM[r]}</em></li>)}</ol>}
      </div>
    </div>
  );
}

// The drawer holds live hanzo.ai/search's own example console (its rows are Hanzo copy, so they stay as they are).
const SIDE = [['Search', '/search'], ['Chat', '/cloud/chat'], ['Bot', '/bot'], ['Crawl', '/crawl'], ['Studio', '/studio'], ['Console', '/console'], ['Referrals', '/cloud/referrals'], ['Marketplace', '/cloud/marketplace']];

export default function Search() {
  return (
    <main id="main" className="l2-page se2">
      <StageHero look="rise" kick="Hybrid Search + RAG" title="Hanzo Search" sub="Keyword and meaning in the same query" acts={[['Read the docs', DOCS], ['GitHub', GH]]}>
        <Ask />
      </StageHero>
      <Ways />
      <How />
      <Pricing />
      <Frameworks />
      <Finale
        name="Search"
        head="Make your content searchable and conversational"
        lede="Index once, search everywhere."
        small="Full-text, vector, hybrid, and RAG -- all from one API."
        ask={['Read the docs', DOCS]}
        links={[['View on GitHub', GH]]}
        object={<EndBar />}
        prompt="Read https://hanzo.ai/skill.md and use Hanzo Search in my project. Start with: hanzo search create"
        api="/v1/search"
        related={[['Chat', '/cloud/chat', 'Conversational AI'], ['Bot', '/bot', 'Multi-agent platform'], ['Crawl', '/crawl', 'Web crawler']]}
        tag="AI-powered search"
        className="se2-fin"
      />
    </main>
  );
}
