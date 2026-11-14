'use client';
/* Network, Cloud 3 launch page, round 3 to docs/MASTER.md (the only brief), answering the 7/10 review.
   V2: 8/10 motion-map: graph + split-merge, grow-from-point, typewriter, zoom-through, invert-flash (the hero peers settle on springs, drag and spring back, and point/tap lights and names their paths; no pinned scene; order hero, black room, facts, prompt, close).
   Persona: Developer who needs compute (buys it on the fabric, then calls it with a key).
   Goal: buy compute on hanzo.network.
   CTA: "Buy Compute" → https://docs.hanzo.ai/docs/network (data-cta network.hero, network.close; the site's sticky ask
   carries the same label from data-thumb).
   Metric: api_key_created.
   Signature: ask the fabric. A map of the peers connected right now, each wearing the models it has loaded; a request
   leaves "you", walks the links to a peer that already has the model in memory, and a model nobody has loaded gets a
   placement. It runs once by itself (four asks, about ten seconds) and rests on the placement; play in its toolbar
   replays it; pick a model to steer it (arrow keys too); point at any peer to see the route the fabric would take to it
   and what it has loaded.
   Beyond: lend it to. In chapter five choose inference or builds: the machine that joins the map is labelled for it and
   the one command that puts it there (hanzo fabric join or hanzo runner) comes with Hanzo's own line and a copy button.
   Motion (1 signature + 3): idle = the request walking the fabric (the one mover on its screen, runs once, pausable);
   pointer = the route preview on any peer, the strand in the black room, the magnetic close; state = the chapters'
   map changing per fact (line art draws the topology, the join and the settlement), the model picker and lend toggle
   (a sliding pill, 300ms ease-emphasis); arrival = the cut-in title, the timed wipe into the black room; scroll (under
   half) = the hero map growing as you leave it, the pinned chapters.
   Every word and link is Hanzo's; the map, routes, hashes and the strand are drawn, not measured; the model pictures are
   Hanzo's own renders (public/models). */
import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useReducedMotion, useInView } from 'motion/react';
import { Copy } from '../../ui';
import { A, Img } from '../../kit';
import { Paste } from './Frame';
import '../../v2/LaunchType.css';
import LaunchClose, { Arr } from '../../v2/LaunchClose';
import LivePause, { usePause } from '../../v2/LivePause';
import { Enter, Typed, useEnter } from '../network/Enter';
import './Network.css';

const DOCS = 'https://docs.hanzo.ai/docs/network';
const EMPH = [0.16, 1, 0.3, 1];
const PILL = { duration: 0.3, ease: EMPH }; // MASTER §3.1: toggles slide with ease-emphasis at 300ms, never a spring

/* ---------- the hero object: the fabric ---------- */
// peers: [x%, y%, models loaded] inside the map's own frame; index 9 is you
const PEERS = [[38, 12, ['zen']], [62, 7, ['kai']], [88, 17, []], [50, 33, ['zen', 'kai']], [76, 38, ['enso']], [26, 49, []], [59, 56, ['koe']], [91, 58, []], [6, 61, ['enso']], [41, 86, []], [72, 72, ['zen']]];
const LINKS = [[0, 1], [1, 2], [0, 3], [1, 3], [2, 4], [3, 4], [3, 5], [3, 6], [4, 6], [4, 7], [5, 8], [5, 6], [6, 7], [6, 10], [7, 10], [5, 9], [6, 9], [8, 9], [9, 10], [0, 5]];
const YOU = 9;
// [model asked for, path of peers from you, placed (nobody had it loaded)]
const ASKS = [['kai', [9, 5, 3]], ['enso', [9, 8]], ['koe', [9, 6]], ['uta', [9, 6, 7], true]];
const HOP = 0.55;
const ADJ = PEERS.map((_, i) => LINKS.flatMap(([a, b]) => (a === i ? [b] : b === i ? [a] : [])));
// the route the fabric would take from you to a peer: fewest hops
const routeTo = (to) => {
  const prev = { [YOU]: -1 };
  const q = [YOU];
  while (q.length) { const v = q.shift(); if (v === to) break; ADJ[v].forEach((w) => { if (!(w in prev)) { prev[w] = v; q.push(w); } }); }
  const p = [];
  for (let v = to; v !== -1 && v !== undefined; v = prev[v]) p.unshift(v);
  return p;
};
const onPath = (path, a, b) => path.findIndex((p, i) => i > 0 && ((path[i - 1] === a && p === b) || (path[i - 1] === b && p === a)));
const peerName = (p) => (p === YOU ? 'you' : 'peer ' + String(p).padStart(2, '0'));

function useSize(ref) {
  const [s, setS] = useState({ w: 0, h: 0 });
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setS({ w: e.contentRect.width, h: e.contentRect.height }));
    ro.observe(el);
    return () => ro.disconnect();
  }, [ref]);
  return s;
}

/* a model a peer has loaded wears Hanzo's own render of it (the only colour on the page, from Hanzo's media) */
// where each render's mark sits (fraction of the picture), so a 32px crop lands on it at a fixed zoom
const MARK = { zen: [0.67, 0.48], kai: [0.65, 0.5], enso: [0.7, 0.37], koe: [0.67, 0.47], uta: [0.83, 0.67] };
const Thumb = ({ m }) => <span className="nw-th" style={{ '--cx': MARK[m][0], '--cy': MARK[m][1] }}><Img src={`/models/${m}.webp`} w={1200} h={1500} alt="" /></span>;
const Tag = ({ m, hit }) => <b className={'nw-tag' + (hit ? ' hit' : '')}><Thumb m={m} />{m}</b>;

/* the signature: a living graph. The peers start bunched in the middle and settle outward on springs (each link pulls
   toward its own length, every peer repels its neighbours, an anchor holds the shape), then keep breathing a little.
   Drag a peer and let go: it springs back and pulls its links with it. Point at a peer (tap on a phone): its paths
   light (the route from you and every link it has) and each peer on them is named. Reduced motion: the settled map. */
function useGraph(calm, peerEls, lineEls, box, onSettle) {
  useEffect(() => {
    const els = peerEls.current, ls = lineEls.current, el = box.current;
    if (!el) return;
    const place = (P) => {
      P.forEach((q, i) => { const n = els[i]; if (n) { n.style.left = q.x.toFixed(2) + '%'; n.style.top = q.y.toFixed(2) + '%'; } });
      LINKS.forEach(([a, b], k) => { const l = ls[k]; if (l) { l.setAttribute('x1', P[a].x.toFixed(2)); l.setAttribute('y1', P[a].y.toFixed(2)); l.setAttribute('x2', P[b].x.toFixed(2)); l.setAttribute('y2', P[b].y.toFixed(2)); } });
    };
    if (calm) { onSettle(); return; }
    // start bunched toward the middle, a little turned, so the settle reads as a graph finding its shape
    const P = PEERS.map(([x, y], i) => ({ x: 50 + (x - 50) * 0.18 + Math.sin(i * 2.3) * 3, y: 50 + (y - 50) * 0.18 + Math.cos(i * 1.7) * 3, vx: 0, vy: 0 }));
    const REST = LINKS.map(([a, b]) => Math.hypot(PEERS[a][0] - PEERS[b][0], PEERS[a][1] - PEERS[b][1]));
    let ptr = null, drag = -1, raf = 0, t0 = performance.now(), last = t0, seen = true, settledOnce = false;
    const pos = (e) => { const r = el.getBoundingClientRect(); return { x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 }; };
    const move = (e) => { if (e.pointerType !== 'mouse') return; ptr = pos(e); };
    const leave = () => { ptr = null; };
    const down = (e) => { if (e.pointerType !== 'mouse') return; const i = els.indexOf(e.target.closest('.nw-peer')); if (i < 0) return; drag = i; el.setPointerCapture?.(e.pointerId); e.preventDefault(); };
    const up = () => { drag = -1; };
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerleave', leave);
    el.addEventListener('pointerdown', down);
    addEventListener('pointerup', up);
    const io = new IntersectionObserver(([e]) => { seen = e.isIntersecting; if (seen && !raf) { last = performance.now(); raf = requestAnimationFrame(step); } }, { threshold: 0 });
    io.observe(el);
    function step(now) {
      raf = 0;
      if (!seen) return;
      const dt = Math.min(2, (now - last) / 16.67); last = now;
      const t = (now - t0) / 1000;
      for (let s = 0; s < 2; s++) {
        const h = dt / 2;
        // link springs toward their own length
        LINKS.forEach(([a, b], k) => {
          const A = P[a], B = P[b], dx = B.x - A.x, dy = B.y - A.y, d = Math.hypot(dx, dy) || 0.01, f = (d - REST[k]) * 0.012 * h;
          A.vx += (dx / d) * f; A.vy += (dy / d) * f; B.vx -= (dx / d) * f; B.vy -= (dy / d) * f;
        });
        P.forEach((q, i) => {
          // repel any peer closer than 9 (and the pointer, a little, so the graph leans away from the cursor)
          for (let j = i + 1; j < P.length; j++) { const o = P[j], dx = o.x - q.x, dy = o.y - q.y, d = Math.hypot(dx, dy) || 0.01; if (d < 9) { const f = ((9 - d) / 9) * 0.25 * h; q.vx -= (dx / d) * f; q.vy -= (dy / d) * f; o.vx += (dx / d) * f; o.vy += (dy / d) * f; } }
          if (ptr && i !== drag) { const dx = q.x - ptr.x, dy = q.y - ptr.y, d = Math.hypot(dx, dy) || 0.01; if (d < 12 && d > 2.5) { const f = ((12 - d) / 12) * 0.12 * h; q.vx += (dx / d) * f; q.vy += (dy / d) * f; } }
          // the anchor: where the peer lives, breathing a little (about ±0.7)
          const ax = PEERS[i][0] + Math.sin(t * 0.6 + i * 1.9) * 0.7, ay = PEERS[i][1] + Math.cos(t * 0.5 + i * 2.7) * 0.7;
          q.vx += (ax - q.x) * 0.006 * h; q.vy += (ay - q.y) * 0.006 * h;
        });
        P.forEach((q, i) => {
          if (i === drag && ptr) { q.x += (ptr.x - q.x) * 0.5; q.y += (ptr.y - q.y) * 0.5; q.vx = 0; q.vy = 0; return; }
          q.vx *= Math.pow(0.9, h); q.vy *= Math.pow(0.9, h); q.x += q.vx * h; q.y += q.vy * h;
        });
      }
      place(P);
      if (!settledOnce && t > 1.5) { settledOnce = true; onSettle(); }
      raf = requestAnimationFrame(step);
    }
    place(P);
    raf = requestAnimationFrame(step);
    return () => { cancelAnimationFrame(raf); io.disconnect(); el.removeEventListener('pointermove', move); el.removeEventListener('pointerleave', leave); el.removeEventListener('pointerdown', down); removeEventListener('pointerup', up); };
  }, [calm]); // eslint-disable-line react-hooks/exhaustive-deps
}

function Fabric({ at, arrived, calm, peek, setPeek, idle, live, onSettle }) {
  const box = useRef(null);
  const peerEls = useRef([]);
  const lineEls = useRef([]);
  const { w, h } = useSize(box);
  useGraph(calm, peerEls, lineEls, box, onSettle);
  const [model, fullPath, placed] = ASKS[at];
  const path = live ? fullPath : [];
  const end = path[path.length - 1];
  const pv = peek === null ? [] : routeTo(peek);
  const named = peek === null ? new Set() : new Set([peek, ...pv, ...ADJ[peek]]);
  const tap = (i) => (e) => { if (e.pointerType === 'mouse' || i === YOU) return; setPeek(peek === i ? null : i); };
  return (
    <div className="nw-map" ref={box} aria-hidden="true" data-peek={peek === null ? undefined : ''}>
      <svg className="nw-links" viewBox="0 0 100 100" preserveAspectRatio="none">
        {LINKS.map(([a, b], j) => {
          const k = onPath(path, a, b);
          const v = onPath(pv, a, b);
          const nb = peek !== null && (a === peek || b === peek);
          return <line key={a + '-' + b} ref={(n) => { lineEls.current[j] = n; }} x1={PEERS[a][0]} y1={PEERS[a][1]} x2={PEERS[b][0]} y2={PEERS[b][1]} className={(k > 0 ? 'on' : '') + (v > 0 ? ' pv' : '') + (nb ? ' nb' : '')} style={k > 0 ? { transitionDelay: (k - 1) * HOP + 's' } : undefined} />;
        })}
      </svg>
      {PEERS.map(([x, y, ms], i) => {
        const k = path.indexOf(i);
        return (
          <div key={i} ref={(n) => { peerEls.current[i] = n; }} className={'nw-peer' + (k >= 0 ? ' lit' : '') + (i === end && arrived ? ' end' : '') + (i === YOU ? ' you' : '') + (i === peek ? ' peek' : '') + (named.has(i) ? ' named' : '') + (x > 84 ? ' l' : '')} style={{ left: x + '%', top: y + '%', '--d': Math.max(0, k) * HOP + 's' }}
            onPointerEnter={(e) => e.pointerType === 'mouse' && i !== YOU && setPeek(i)} onPointerLeave={(e) => e.pointerType === 'mouse' && setPeek(null)} onPointerUp={tap(i)}>
            <i />
            <span className="nw-tags">
              {named.has(i) && i !== YOU && <b className="nw-tag nm">{peerName(i)}</b>}
              {i === YOU ? <b className="nw-tag me">you</b> : ms.map((m) => <Tag key={m} m={m} hit={m === model && i === end && arrived} />)}
              {placed && i === end && arrived && <motion.b key={'p' + at} className="nw-tag hit" initial={calm ? false : { scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={PILL}><Thumb m={model} />{model}</motion.b>}
            </span>
          </div>
        );
      })}
      {!calm && live && w > 0 && (
        <motion.span
          key={'pk' + at}
          className="nw-packet"
          initial={{ x: (PEERS[YOU][0] / 100) * w, y: (PEERS[YOU][1] / 100) * h, opacity: 0 }}
          animate={{ x: path.map((p) => (PEERS[p][0] / 100) * w), y: path.map((p) => (PEERS[p][1] / 100) * h), opacity: [1, 1, 0] }}
          transition={{ duration: HOP * (path.length - 1), ease: [0.4, 0, 0.2, 1], opacity: { duration: HOP * (path.length - 1) + 0.3, times: [0, 0.8, 1] } }}
        />
      )}
      {/* at rest the screen is never still: a small bead keeps walking the resting route, quietly and forever
          (the one mover here; stops while paused, pointed at or off screen; absent under reduced motion) */}
      {idle && live && w > 0 && (
        <motion.span
          key={'idle' + at}
          className="nw-packet idle"
          initial={{ x: (PEERS[YOU][0] / 100) * w, y: (PEERS[YOU][1] / 100) * h, opacity: 0 }}
          animate={{ x: path.map((p) => (PEERS[p][0] / 100) * w), y: path.map((p) => (PEERS[p][1] / 100) * h), opacity: [0, 1, 1, 0] }}
          transition={{ duration: 2.4, ease: [0.4, 0, 0.2, 1], repeat: Infinity, repeatDelay: 1.2, delay: 0.8, opacity: { duration: 2.4, times: [0, 0.12, 0.85, 1], repeat: Infinity, repeatDelay: 1.2, delay: 0.8 } }}
        />
      )}
    </div>
  );
}

/* the map's own toolbar, inside its frame: what it is, the model you ask for, the route and the answer, the pause */
function Tool({ at, choose, arrived, peek, paused, pause }) {
  const [model, path, placed] = ASKS[at];
  const pv = peek === null ? null : routeTo(peek);
  const shown = pv || path;
  return (
    <div className="nw-tool">
      <LivePause paused={paused} onToggle={pause} inline className="nw-pause" />
      <p className="lx-kick nw-tool-k">Compute Marketplace</p>
      <div className="nw-ask">
        <p className="nw-ask-l" id="nw-ask-l">ask the fabric for</p>
        <div className="nw-seg nw-models" role="radiogroup" aria-labelledby="nw-ask-l">
          {ASKS.map(([m], i) => (
            <button key={m} type="button" role="radio" aria-checked={at === i} tabIndex={at === i ? 0 : -1} onClick={() => choose(i)}
              onKeyDown={(e) => { const d = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 0; if (!d) return; e.preventDefault(); const n = (i + d + ASKS.length) % ASKS.length; choose(n); e.currentTarget.parentElement.children[n]?.focus(); }}>
              {at === i && <motion.i layoutId="nw-pick" className="nw-pick" transition={PILL} />}
              <span>{m}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="nw-read">
        <p className={'nw-route' + (pv ? ' pv' : '')} aria-hidden="true">{(shown.length > 3 ? [shown[0], '…', shown[shown.length - 1]] : shown).map((p) => (p === '…' ? p : peerName(p))).join('  →  ')}</p>
        <p className={'nw-ans' + (arrived || pv ? ' on' : '')} aria-live="polite">
          {pv ? (PEERS[peek][2].length ? PEERS[peek][2].join(' · ') + ' loaded' : 'nothing loaded') : arrived ? (placed ? `nobody has ${model} loaded · placement` : `a peer that already has ${model} loaded`) : 'routing…'}
        </p>
      </div>
    </div>
  );
}

function Hero() {
  const ref = useRef(null);
  const [inView, setInView] = useState(true);
  const calm = useReducedMotion();
  const [paused, pause] = usePause();
  const [peek, setPeek] = useState(null);
  const run = inView && !paused && !calm && peek === null;
  // MASTER §4.1: the demo runs once (four asks, about ten seconds), then rests on the placement; play replays it
  const [at, setAt] = useState(0);
  const [mine, setMine] = useState(false);
  const [done, setDone] = useState(false);
  // the demo waits for the graph to settle (about 1.5 s), then walks
  const [live, setLive] = useState(false);
  useEffect(() => {
    if (!live || !run || mine || done) return;
    const t = setTimeout(() => (at >= ASKS.length - 1 ? setDone(true) : setAt(at + 1)), 2600);
    return () => clearTimeout(t);
  }, [at, run, mine, done, live]);
  const choose = (i) => { setAt(i); setMine(true); };
  const toggle = () => { if (done || mine) { setDone(false); setMine(false); setAt(0); if (paused) pause(); } else pause(); };
  const [arrived, setArrived] = useState(true);
  useEffect(() => {
    if (calm) { setArrived(true); return; }
    setArrived(false);
    if (!live) return;
    const t = setTimeout(() => setArrived(true), HOP * (ASKS[at][1].length - 1) * 1000 + 120);
    return () => clearTimeout(t);
  }, [at, calm, live]);
  const enterRef = useRef(null);
  const st = useEnter(enterRef, 0.05);
  // scale rhythm: the map grows into the page as you leave the hero (it is the moment), and rests at 1 on arrival
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const zoom = useTransform(scrollYProgress, [0, 1], [1, 1.16]);
  useEffect(() => scrollYProgress.on('change', (p) => setInView(p < 0.95)), [scrollYProgress]);
  return (
    <section className="nw-hero" ref={ref} data-morph-target data-ask-name="Hanzo Network">
      {/* entrance 1, split-merge: the words slide in from the left, the graph from the right, and meet */}
      <div className="lx-wrap nw-hero-grid nw-en nw-en-split" ref={enterRef} data-enter={st}>
        <div className="nw-hero-copy">
          <h1 className="lx-display nw-h1"><span className="nw-h1-a">Hanzo</span> <span className="nw-h1-b">Network</span></h1>
          <div className="nw-hero-low">
            <p className="lx-lede nw-lede">hanzo.network is the fabric that hanzod nodes form. Put a machine on it and it serves models to whoever the cluster routes there. Ask the fabric for a model and it finds a peer that already has it loaded.</p>
            <div className="nw-acts">
              <A to={DOCS} className="lx-cta" data-thumb="Buy Compute" data-cta="network.hero" data-cursor="">Buy Compute<Arr /></A>
              <A to="/node" className="lx-text" data-cursor="">Run a Node</A>
            </div>
          </div>
        </div>
        <div className="nw-fab">
          <div className="nw-fab-win">
            <motion.div className="nw-map-wrap" style={calm ? undefined : { scale: zoom }}>
              <Fabric at={at} arrived={arrived} calm={calm} peek={peek} setPeek={setPeek} live={live || !!calm} onSettle={() => setLive(true)} idle={(done || mine) && arrived && inView && !paused && !calm && peek === null} />
            </motion.div>
          </div>
          <Tool at={at} choose={choose} arrived={arrived} peek={peek} paused={paused || done || mine} pause={toggle} />
        </div>
      </div>
    </section>
  );
}

/* ---------- the chapters' object: the same fabric, zoomed in; each fact changes the map ---------- */
const FACTS = [
  ['Peers, not regions', 'There is no region menu to choose from. A node discovers its peers over the fabric, and the topology is whatever is connected right now — you can ask it and read the answer.'],
  ['Metered by the work', "A tenth of the block reward funds AI compute, and a provider's share is scaled by the level of the work it did. No subscription, no seat, nothing billed while a machine sits idle."],
  ['Proof of AI', "A node's confidential-compute tier is attested rather than declared, and what it earns is scaled by that attestation and by a trust score. A claim about a machine is worth nothing on its own."],
  ['Whatever the peers have loaded', 'Ask the cluster which models it serves, which node would answer for one, and where a model nobody has loaded should be placed. Routing follows what is really in memory.'],
  ['One command to join', 'hanzo fabric join names a network and starts the node on it. If you would rather lend the machine to builds than to inference, hanzo runner offers the same box as a CI runner.'],
  ['Anchored, not asserted', 'Work is ordered on the Hanzo L2 and committed to Lux as a Merkle root, under a stake-weighted validator set. What you can check is what settled, not what a status page says.'],
];
const LEND = [['inference', 'hanzo fabric join', 'names a network and starts the node on it.'], ['builds', 'hanzo runner', 'offers the same box as a CI runner.']];
const key = (a, b) => (a < b ? a + '-' + b : b + '-' + a);
const WORK = { '5-9': 3, '3-5': 3, '1-3': 2, '3-6': 2, '6-10': 2, '4-6': 1, '6-9': 1 }; // links carrying work, by its level
const IDLE = new Set([2, 7]);
const ATTESTED = new Set([0, 3, 4, 5, 6, 10]);
const DECLARED = new Set([1, 8]);
const JOIN = [16, 27]; // the machine that joins in chapter five, linked to peers 0 and 5
const SETTLE = [3, 6, 10, 4]; // peers whose work settles into the block in chapter six
const ROUTE = [9, 5, 3]; // kai, from you
const ROOT = [70, 97];
const P = (i) => PEERS[i];
// the links each chapter's dash runs: 01 discovery from you, 02 the links carrying work, 03 trust reaching the attested,
// 04 the route to kai, 05 the new machine to its two peers, 06 the work into the root
const flows = (step) => [
  [[P(9), P(5)], [P(9), P(6)], [P(9), P(8)], [P(9), P(10)]],
  Object.keys(WORK).filter((k) => WORK[k] > 1).map((k) => k.split('-').map((n) => P(+n))),
  [[P(5), P(3)], [P(3), P(0)], [P(3), P(4)], [P(6), P(10)]],
  [[P(9), P(5)], [P(5), P(3)]],
  [[JOIN, P(0)], [JOIN, P(5)]],
  SETTLE.map((p) => [P(p), ROOT]),
][step] || [];

function Story({ step, intro, lend }) {
  const box = useRef(null);
  const { w, h } = useSize(box);
  const X = (x) => (x * w) / 100, Y = (y) => (y * h) / 100;
  const st = intro ? 'intro' : step;
  const draw = step === 0 && !intro; // the topology draws itself in chapter one
  const lit = (a, b) => step === 3 && !intro && ROUTE.some((p, i) => i && key(ROUTE[i - 1], p) === key(a, b));
  return (
    <div className="nw-sm" data-st={st} aria-hidden="true">
      <div className="nw-sm-map" ref={box}>
        {w > 0 && (
          <svg viewBox={`0 0 ${w} ${h}`} className="nw-sm-links">
            {LINKS.map(([a, b], i) => {
              const wk = !intro && step === 1 ? WORK[key(a, b)] || 0 : 0;
              return <line key={key(a, b) + (draw ? 'd' : '')} x1={X(PEERS[a][0])} y1={Y(PEERS[a][1])} x2={X(PEERS[b][0])} y2={Y(PEERS[b][1])} pathLength="1" className={(draw ? 'draw ' : '') + (wk ? 'w' + wk : '') + (lit(a, b) ? ' on' : '')} style={draw ? { animationDelay: i * 40 + 'ms' } : undefined} />;
            })}
            {/* the work keeps moving while you read: a short dash runs the links this chapter is about, again and again
                (the one continuous mover on the screen; frozen under reduced motion) */}
            {!intro && flows(step).map(([a, b], i) => <line key={'f' + step + '-' + a + '-' + b} x1={X(a[0])} y1={Y(a[1])} x2={X(b[0])} y2={Y(b[1])} pathLength="1" className="flow" style={{ animationDelay: (i * 0.35).toFixed(2) + 's' }} />)}
            {step === 4 && !intro && [0, 5].map((p) => <line key={'j' + p + lend} x1={X(JOIN[0])} y1={Y(JOIN[1])} x2={X(PEERS[p][0])} y2={Y(PEERS[p][1])} pathLength="1" className="draw join" />)}
            {step === 5 && !intro && SETTLE.map((p, i) => <line key={'s' + p} x1={X(PEERS[p][0])} y1={Y(PEERS[p][1])} x2={X(ROOT[0])} y2={Y(ROOT[1])} pathLength="1" className="draw settle" style={{ animationDelay: i * 90 + 'ms' }} />)}
          </svg>
        )}
        {PEERS.map(([x, y, ms], i) => {
          const c = ['nw-sp'];
          if (i === YOU) c.push('you');
          if (!intro && step === 1 && IDLE.has(i)) c.push('idle');
          if (!intro && step === 2) c.push(ATTESTED.has(i) ? 'att' : DECLARED.has(i) ? 'dec' : '');
          if (!intro && step === 3 && ROUTE.includes(i)) c.push('lit');
          if (!intro && step === 5 && SETTLE.includes(i)) c.push('lit');
          if (x > 80) c.push('l');
          return (
            <div key={i} className={c.join(' ')} data-p={i} style={{ left: x + '%', top: y + '%', '--i': i }}>
              <i />
              <span className="nw-tags">
                {i === YOU && <b className="nw-tag me">you</b>}
                {!intro && step === 1 && IDLE.has(i) && <b className="nw-tag q">idle · nothing billed</b>}
                {!intro && step === 2 && ATTESTED.has(i) && i !== YOU && <b className="nw-tag q">attested ✓</b>}
                {!intro && step === 2 && DECLARED.has(i) && <b className="nw-tag x">declared ✕</b>}
                {!intro && step === 3 && i !== YOU && ms.map((m) => <Tag key={m} m={m} hit={m === 'kai' && i === 3} />)}
                {!intro && step === 3 && i === 7 && <b className="nw-tag place"><Thumb m="uta" />uta</b>}
              </span>
            </div>
          );
        })}
        {!intro && step === 4 && (
          <div className="nw-sp new" style={{ left: JOIN[0] + '%', top: JOIN[1] + '%' }} key={'n' + lend}>
            <i />
            <span className="nw-tags"><b className="nw-tag hit">{lend ? 'CI runner' : 'inference'}</b></span>
          </div>
        )}
        {!intro && step === 0 && <span className="nw-region" style={{ left: '6%', top: '6%' }}>region ▾</span>}
        {!intro && step === 5 && <span className="nw-root" style={{ left: ROOT[0] + '%', top: ROOT[1] + '%' }}><b>Merkle root</b> 0xa96d…e4</span>}
      </div>
      <div className="nw-sm-cap" key={st}>
        {intro && <p><b>hanzo.network</b> · peers connected right now</p>}
        {!intro && step === 0 && <p>topology · <b>connected right now</b></p>}
        {!intro && step === 1 && <div className="nw-sm-ten"><span>block reward</span><span className="nw-ten" aria-hidden="true">{Array.from({ length: 10 }).map((_, k) => <i key={k} className={k === 0 ? 'ai' : ''} />)}</span><span><b>a tenth</b> · AI compute</span></div>}
        {!intro && step === 2 && <p><b>attested</b> · declared · trust score</p>}
        {!intro && step === 3 && <p><code>route kai</code> → <b>peer 03</b> · <code>placement uta</code> → <b>peer 07</b></p>}
        {!intro && step === 4 && <p className="nw-cmd"><span>$</span> {LEND[lend][1]}</p>}
        {!intro && step === 5 && <p>Hanzo L2 → <b>Lux</b> · Merkle root</p>}
      </div>
    </div>
  );
}

function Lend({ k, setK }) {
  const [, cmd, d] = LEND[k];
  return (
    <div className="nw-lend">
      <div className="nw-seg nw-lend-c" role="group" aria-label="Lend the machine to">
        {LEND.map(([w], i) => (
          <button key={w} type="button" aria-pressed={k === i} onClick={() => setK(i)}>
            {k === i && <motion.i layoutId="nw-lend" className="nw-pick" transition={PILL} />}
            <span>{w}</span>
          </button>
        ))}
      </div>
      <p className="nw-lend-a" aria-live="polite"><code>{cmd}</code> {d}</p>
      <Copy text={cmd} label={'Copy ' + cmd} />
    </div>
  );
}

/* ---------- the black room's object: the two ends, joined by a strand of the fabric ---------- */
// the strand from you (first) to a peer with a model loaded (last), and a few peers either side of it
const STRAND = [[5, 58], [22, 30], [40, 62], [58, 28], [76, 60], [95, 40]];
const SPUR = [[13, 90, 0], [30, 6, 1], [49, 94, 2], [67, 4, 3], [86, 92, 4], [84, 10, 5]];
const strandD = STRAND.map(([x, y], i) => (i ? 'L' : 'M') + x + ' ' + y).join(''); // static, stretched

function Ends() {
  const ref = useRef(null);
  const band = useRef(null);
  const { w, h } = useSize(band);
  const seen = useInView(ref, { once: true, amount: 0.5 });
  const calm = useReducedMotion();
  const [flow, setFlow] = useState({ way: null, n: 0 });
  useEffect(() => { if (seen && !calm) setFlow((f) => ({ way: 'call', n: f.n + 1 })); }, [seen, calm]);
  const send = (way) => (e) => { if (calm || (e.pointerType && e.pointerType !== 'mouse')) return; setFlow((f) => ({ way, n: f.n + 1 })); };
  const Ar = () => <svg viewBox="0 0 16 16" width="24" height="24" aria-hidden="true"><path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>;
  return (
    <div className="nw-ends-obj" ref={ref}>
      <div className="nw-strand" ref={band} data-flow={calm ? 'rest' : flow.way || undefined} aria-hidden="true">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none">
          {SPUR.map(([x, y, s]) => <line key={x} x1={x} y1={y} x2={STRAND[s][0]} y2={STRAND[s][1]} className="spur" />)}
          <path d={strandD} className="way" />
        </svg>
        {flow.way && w > 0 && (
          <svg key={flow.n} viewBox={`0 0 ${w} ${h}`} className="nw-pulse">
            <path d={STRAND.map(([x, y], i) => (i ? 'L' : 'M') + ((x * w) / 100).toFixed(1) + ' ' + ((y * h) / 100).toFixed(1)).join('')} pathLength="100" className={'pulse ' + flow.way} />
          </svg>
        )}
        {SPUR.map(([x, y]) => <i key={'s' + x} className="nw-sn sp" style={{ left: x + '%', top: y + '%' }} />)}
        {STRAND.map(([x, y], i) => <i key={x + '-' + (i === 0 || i === STRAND.length - 1 ? flow.n : 0)} className={'nw-sn' + (i === 0 ? ' a' : i === STRAND.length - 1 ? ' b' : '')} style={{ left: x + '%', top: y + '%' }} />)}
        <b className="nw-st a" style={{ left: STRAND[0][0] + '%', top: STRAND[0][1] + '%' }}>you</b>
        <b className="nw-st b" style={{ left: STRAND[5][0] + '%', top: STRAND[5][1] + '%' }}>zen</b>
      </div>
      <div className="nw-two">
        <A to="https://platform.hanzo.ai/api-keys" className="nw-end" data-cursor="" onPointerEnter={send('call')} onFocus={() => !calm && setFlow((f) => ({ way: 'call', n: f.n + 1 }))}>
          <b>Get an API Key</b><span className="lx-kick">call it</span><Ar />
        </A>
        <A to="/node" className="nw-end serve" data-cursor="" onPointerEnter={send('serve')} onFocus={() => !calm && setFlow((f) => ({ way: 'serve', n: f.n + 1 }))}>
          <b data-morph data-cursor="">Provide Compute</b><span className="lx-kick">serve it</span><Ar />
        </A>
      </div>
    </div>
  );
}

/* the six facts, not pinned: the list on one side, the same fabric on the other; point at a fact (or tap it) and the
   map changes to show it; left alone, the map walks the six by itself (5 s each) until you pick one */
function Facts({ lend, setLend }) {
  const ref = useRef(null);
  const st = useEnter(ref, 0.15);
  const calm = useReducedMotion();
  const seen = useInView(ref, { amount: 0.3 });
  const [step, setStep] = useState(0);
  const [held, setHeld] = useState(false);
  useEffect(() => {
    if (held || !seen || calm || st === 'armed') return;
    const t = setTimeout(() => setStep((step + 1) % FACTS.length), 5000);
    return () => clearTimeout(t);
  }, [step, held, seen, calm, st]);
  const pick = (i) => { setStep(i); setHeld(true); };
  return (
    <section ref={ref} className="nw-how nw-en nw-en-type" data-kind="type" data-enter={st} aria-labelledby="nw-how-h">
      <div className="lx-wrap">
        {/* entrance 3, typewriter: the heading types itself with a caret, then the facts and the map come in */}
        <h2 className="lx-headline nw-how-h" id="nw-how-h"><Typed text="How the Network Works" on={st === 'in'} /></h2>
        <div className="nw-how-grid">
          <ol className="nw-facts">
            {FACTS.map(([t, d], i) => (
              <li key={t} className={'nw-fact' + (i === step ? ' on' : '')} onPointerEnter={(e) => e.pointerType === 'mouse' && pick(i)}>
                <h3 className="nw-fact-t"><button type="button" aria-pressed={i === step} onClick={() => pick(i)}><span className="nw-fact-n" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>{t}</button></h3>
                <p className="nw-fact-d">{d}</p>
                {i === 4 && <Lend k={lend} setK={(k) => { setLend(k); pick(4); }} />}
              </li>
            ))}
          </ol>
          <div className="nw-how-obj"><Story step={step} intro={false} lend={lend} /><p className="lx-kick nw-how-count" aria-live="polite">{String(step + 1).padStart(2, '0')} / {String(FACTS.length).padStart(2, '0')}</p></div>
        </div>
      </div>
    </section>
  );
}

export default function Network() {
  const [lend, setLend] = useState(0);
  return (
    <main className="lx nw">
      <Hero />

      {/* entrance 2, grow-from-point: the black room grows out of wherever the pointer last was */}
      <Enter kind="grow" as="section" className="lx-dark nw-ends" data-room="dark" threshold={0.12}>
        <div className="lx-wrap">
          <div className="nw-ends-h">
            <h2 className="lx-headline">Two ends of the same fabric</h2>
            <p className="lx-lede">Take a key and call it, or bring a machine and serve it. Most people who do the second started by doing the first.</p>
          </div>
          <Ends />
          <div className="nw-gh"><A to="https://github.com/hanzoai" className="lx-ghost">View on GitHub</A></div>
        </div>
      </Enter>

      <Facts lend={lend} setLend={setLend} />

      {/* entrance 4, zoom-through: the agent prompt flies in from far behind the screen */}
      <Enter kind="zoom" as="section" className="nw-pastes" threshold={0.25}>
        <div className="lx-wrap nw-paste">
          <Paste name="Network" prompt="Read https://hanzo.ai/skill.md and use Hanzo Network in my project. Start with: hanzo network list" />
          <div className="nw-docs"><span className="lx-kick">Network</span><A to={DOCS} className="nw-docs-a">Network docs →</A></div>
        </div>
      </Enter>

      {/* entrance 5, invert-flash: the close arrives inverted for a beat, then settles to paper */}
      <Enter kind="flash" className="nw-close" threshold={0.3}>
        <LaunchClose name="Network" tag="Decentralized compute network" seed="network" data={[10, 6]} ask={['Buy Compute', DOCS]} cta="network.close" self={DOCS} />
      </Enter>
    </main>
  );
}
