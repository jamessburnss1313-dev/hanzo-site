'use client';
/* Enso: one endpoint that routes every request. v2 page: Hanzo's own clear hero (8 Nov), then Chapters, ink on white, Enso's own film.
   Signature: the switchboard. Requests stream in by themselves, pass through Enso, which weighs quality, speed and
   cost, and land in the tier made for them (Flash at volume, Pro while someone waits, Ultra where a wrong answer is
   expensive). Send any of Hanzo's own task words by hand.
   Beyond: the GPQA Diamond explorer. Pick any model (or let it tour) and see it beside Enso's three tiers in
   Hanzo's own figures and words, with every result in a table you can re-sort by score or by cost. */
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useInView, useReducedMotion } from 'motion/react';
import { EASE } from '../../ui';
import { A, More, Cta, Img, Stat, DataTable, Band } from '../../kit';
import { useLoop, fit, rng } from './live';
import { Lines, film } from '../../v2/Launch';
import { FilmPause } from '../../v2/ModelFilm';
import './Model.css';
import '../../v2/Launch.css';
import ModelCards from './ModelCards';
import ModelFilm, { usePaused } from '../../v2/ModelFilm';
import './Enso.css';
import { PLANS, checkout } from '../../../lib/plans';

/* ---------- entrances (page-local; James's motion map: fold-out, cursor-lens, ink-spread, word-shuffle, orbit-in) ----------
   Each section arrives once, the first time it scrolls in. The final state is the server HTML (JS off reads it all);
   start states live only under html.js in Enso.css; reduced motion jumps straight to data-in. */
const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
const EMPH = 'cubic-bezier(.16, 1, .3, 1)';
const pointer = { x: -1, y: -1 }; // the last pointer position on the page (client px), for the lens
function useEnter(play, margin = '0px 0px -16% 0px') {
  const ref = useRef(null);
  const fn = useRef(play);
  fn.current = play;
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reduced()) { el.setAttribute('data-in', ''); return; }
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      el.setAttribute('data-in', '');
      fn.current?.(el);
    }, { rootMargin: margin });
    io.observe(el);
    return () => io.disconnect();
  }, [margin]);
  return ref;
}
// cursor-lens: the section opens through a round lens centred on the pointer, magnified at first; the lens follows the
// pointer while it opens (no pointer, as on a phone: it opens from the middle)
function lens(el) {
  const wrap = el.querySelector('.x-wrap');
  const t0 = performance.now(), D = 1150;
  let cx = null, cy = null;
  const step = (now) => {
    const r = el.getBoundingClientRect();
    const has = pointer.x >= 0 && pointer.y >= r.top && pointer.y <= r.bottom;
    const tx = has ? pointer.x - r.left : r.width / 2, ty = has ? pointer.y - r.top : Math.min(r.height / 2, innerHeight * 0.5 - r.top);
    cx = cx === null ? tx : cx + (tx - cx) * 0.18; cy = cy === null ? ty : cy + (ty - cy) * 0.18;
    const k = Math.min(1, (now - t0) / D), e = 1 - Math.pow(1 - k, 3);
    const far = Math.hypot(Math.max(cx, r.width - cx), Math.max(cy, r.height - cy));
    el.style.clipPath = `circle(${(60 + e * (far - 60)).toFixed(1)}px at ${cx.toFixed(1)}px ${cy.toFixed(1)}px)`;
    if (wrap) { wrap.style.transformOrigin = `${cx.toFixed(1)}px ${cy.toFixed(1)}px`; wrap.style.transform = `scale(${(1.14 - 0.14 * e).toFixed(4)})`; }
    if (k < 1) requestAnimationFrame(step);
    else { el.style.clipPath = ''; if (wrap) { wrap.style.transform = ''; wrap.style.transformOrigin = ''; } el.querySelector('.eo-board')?.dispatchEvent(new Event('eo-measure')); }
  };
  requestAnimationFrame(step);
}
// ink-spread: an organic blot (one jagged polygon, same points every frame) spreads from a point until it covers all
function ink(el) {
  const n = 28, R = rng(7);
  const jag = Array.from({ length: n }, () => 0.72 + R() * 0.5);
  const blot = (s) => `polygon(${jag.map((j, i) => { const a = (i / n) * Math.PI * 2; return `calc(32% + ${(Math.cos(a) * j * s).toFixed(1)}vmax) calc(38% + ${(Math.sin(a) * j * s).toFixed(1)}vmax)`; }).join(',')})`;
  el.animate([{ clipPath: blot(0.5) }, { clipPath: blot(22), offset: 0.55 }, { clipPath: blot(190) }], { duration: 1500, easing: 'cubic-bezier(.45, 0, .2, 1)' });
}
// word-shuffle: each word starts in another word's place and swaps back into its own
function shuffle(el) {
  const ws = [...el.querySelectorAll('.eo-w')];
  if (ws.length < 2) return;
  const at = ws.map((w) => [w.offsetLeft, w.offsetTop]);
  const order = ws.map((_, i) => (i * 3 + 2) % ws.length); // a fixed derangement for 6 words
  ws.forEach((w, i) => {
    const j = order[i] === i ? (i + 1) % ws.length : order[i];
    w.style.transition = 'none';
    w.style.transform = `translate(${at[j][0] - at[i][0]}px, ${at[j][1] - at[i][1]}px)`;
    w.style.opacity = '.35';
  });
  void el.offsetWidth;
  ws.forEach((w, i) => {
    w.style.transition = `transform .7s ${EMPH} ${0.18 + i * 0.07}s, opacity .5s ease ${0.18 + i * 0.07}s`;
    w.style.transform = '';
    w.style.opacity = '';
  });
}

/* ---------- the signature: particles form Enso's ring ----------
   A cloud of ink dots drifts, then assembles into the ensō (the same open brush stroke as Enso's mark) when the section
   comes into view, breathes, and scatters away from the cursor or a finger. One canvas, one rAF (useLoop: only while on
   screen and the tab is visible), stops with the page pause; reduced motion draws the finished ring once. */
function Form() {
  const box = useRef(null), cv = useRef(null), dots = useRef(null), ptr = useRef(null), at = useRef(-1);
  const seen = useInView(box, { once: true, amount: 0.3 });
  const paused = usePaused();
  const home = (p, w, h, t) => [p.hx * w + Math.sin(t * 0.4 + p.ph) * 18, p.hy * h + Math.cos(t * 0.33 + p.ph) * 18];
  const target = (p, w, h, t, still) => {
    const s = Math.min(w, h), b = still ? 1 : 1 + Math.sin(t * 0.9) * 0.012;
    const r = s * 0.36 * b + p.off * s * 0.075 * (0.4 + 0.6 * Math.sin(Math.PI * p.u));
    const a = -Math.PI / 2 + p.u * Math.PI * 2 * 0.875;
    return [w / 2 + Math.cos(a) * r, h / 2 + Math.sin(a) * r];
  };
  useLoop(box, (t, dt, still) => {
    const c = cv.current;
    if (!c) return;
    const { w: W, h: H, d } = fit(c);
    const w = W / d, h = H / d;
    if (!dots.current) {
      const R = rng(42), n = w < 520 ? 800 : 1500;
      dots.current = Array.from({ length: n }, (_, i) => {
        const p = { u: R(), off: R() - 0.5, hx: R(), hy: R(), ph: R() * 6.28, sz: 1.3 + R() * 1.7, al: 0.45 + R() * 0.55, lag: R() * 0.9, vx: 0, vy: 0 };
        if (i % 9 === 0) p.off *= 3.2; // a few stray specks off the stroke, as a brush leaves
        [p.x, p.y] = [p.hx * w, p.hy * h];
        return p;
      });
    }
    const P = dots.current, g = c.getContext('2d');
    if (still) { // reduced motion: the finished ring
      P.forEach((p) => { [p.x, p.y] = target(p, w, h, 0, true); });
    } else if (!paused) {
      if (seen && at.current < 0) at.current = t;
      const since = at.current < 0 ? -1 : t - at.current;
      const q = ptr.current;
      for (const p of P) {
        const go = since >= p.lag;
        const [tx, ty] = go ? target(p, w, h, t, false) : home(p, w, h, t);
        const K = go ? 16 : 2.2, D = go ? 8 : 2.6;
        let ax = (tx - p.x) * K - p.vx * D, ay = (ty - p.y) * K - p.vy * D;
        if (q) {
          const dx = p.x - q[0], dy = p.y - q[1], dd = Math.hypot(dx, dy) || 1, Rr = w < 520 ? 70 : 96;
          if (dd < Rr) { const f = (1 - dd / Rr) * 5200; ax += (dx / dd) * f; ay += (dy / dd) * f; }
        }
        p.vx += ax * dt; p.vy += ay * dt; p.x += p.vx * dt; p.y += p.vy * dt;
      }
    }
    g.clearRect(0, 0, W, H);
    g.fillStyle = getComputedStyle(c).getPropertyValue('--eo-ink').trim() || '#0a0a0a'; // dark sets --eo-ink (Enso.css)
    for (const p of P) { g.globalAlpha = p.al; const s = p.sz * d; g.fillRect(p.x * d - s / 2, p.y * d - s / 2, s, s); }
    g.globalAlpha = 1;
  });
  const move = (e) => { const r = cv.current.getBoundingClientRect(); ptr.current = [e.clientX - r.left, e.clientY - r.top]; };
  return (
    <section className="lv-sec eo-form" ref={box} aria-labelledby="eo-spec-h">
      <div className="x-wrap eo-form-in">
        <div className="eo-form-t">
          <h2 id="eo-spec-h" className="lv-h">One endpoint for every frontier model.</h2>
          <p className="lv-p">Enso routes each request for quality, speed and cost.</p>
        </div>
        <canvas ref={cv} className="eo-dots" aria-hidden="true" onPointerMove={move} onPointerDown={move} onPointerLeave={() => (ptr.current = null)} onPointerUp={(e) => e.pointerType !== 'mouse' && (ptr.current = null)} />
      </div>
    </section>
  );
}

/* GA item 17: the way to buy. Enso ships in every plan; Go ($8/month, "access to every model", /pricing) goes straight to its card checkout. */
const GO = checkout(PLANS.go.id);
const Plan = ({ slot }) => <Cta to={GO} kind="link" id={'enso.go-' + slot} className="eo-go">{`Every model through Enso, Go is $${PLANS.go.price}/month`}</Cta>;

const TIERS = [
  { name: 'Enso Flash', code: 'enso', inp: '$0.33', out: '$1.65', ctx: true, axis: 0, why: 'at volume', wb: 'https://platform.hanzo.ai/workbench?model=enso', desc: 'For chat, extraction, classification and simple agent steps at volume.' },
  { name: 'Enso Pro', code: 'enso-pro', inp: '$4.40', out: '$22', ctx: '262K', axis: 1, why: 'while someone waits', wb: 'https://platform.hanzo.ai/workbench?model=enso-pro', desc: 'For coding, code review and agents that answer while someone waits.' },
  { name: 'Enso Ultra', code: 'enso-ultra', inp: '$5.50', out: '$27.50', ctx: true, axis: 2, why: 'a wrong answer is expensive', wb: 'https://platform.hanzo.ai/workbench?model=enso-ultra', desc: 'For work where a wrong answer is expensive: research, security review and long autonomous runs.', more: 'For hard reasoning over long material: it thinks at high effort, holds a 1M-token context and reads images.' },
];
const AXES = ['cost', 'speed', 'quality'];
// Hanzo's own task words from each tier, in the order the board sends them by itself
const TASKS = [['chat', 0], ['coding', 1], ['research', 2], ['extraction', 0], ['code review', 1], ['security review', 2], ['classification', 0], ['agents', 1], ['long autonomous runs', 2], ['simple agent steps', 0]];

const bez = (p, t) => { const u = 1 - t; return [0, 1].map((k) => u * u * u * p[0][k] + 3 * u * u * t * p[1][k] + 3 * u * t * t * p[2][k] + t * t * t * p[3][k]); };
const ease = (t) => 1 - Math.pow(1 - Math.min(1, Math.max(0, t)), 3);

function Switchboard() {
  const board = useRef(null), cv = useRef(null), queue = useRef(null), node = useRef(null), lanes = useRef([]);
  const geom = useRef(null), pulses = useRef([]), clock = useRef({ next: 0.6, i: 0, hold: 0 }), uid = useRef(3);
  const [log, setLog] = useState([{ id: 2, task: 'research', tier: 2, done: true }, { id: 1, task: 'coding', tier: 1, done: true }, { id: 0, task: 'chat', tier: 0, done: true }]);
  const [axis, setAxis] = useState(-1);
  const [hit, setHit] = useState(-1);
  const [last, setLast] = useState(['chat', 'coding', 'research']);
  const calm = useReducedMotion();
  const paused = usePaused();

  const measure = () => {
    const b = board.current?.getBoundingClientRect();
    if (!b || !node.current || !queue.current) return;
    const rel = (el) => { const r = el.getBoundingClientRect(); return { l: r.left - b.left, t: r.top - b.top, r: r.right - b.left, b: r.bottom - b.top, w: r.width, h: r.height }; };
    const q = rel(queue.current), n = rel(node.current), L = lanes.current.map(rel);
    const cx = n.l + n.w / 2, cy = n.t + n.h / 2, R = n.w / 2;
    const wide = b.width > 860;
    let inP, outP;
    if (wide) {
      const s = [q.r, q.t + 26], e = [cx - R, cy], m = (s[0] + e[0]) / 2;
      inP = [s, [m, s[1]], [m, e[1]], e];
      outP = L.map((l) => { const s2 = [cx + R, cy], e2 = [l.l, l.t + l.h / 2], m2 = (s2[0] + e2[0]) / 2; return [s2, [m2, s2[1]], [m2, e2[1]], e2]; });
    } else {
      const s = [q.l + q.w / 2, q.b], e = [cx, n.t];
      inP = [s, [s[0], s[1] + 24], [e[0], e[1] - 24], e];
      outP = L.map((l) => { const s2 = [cx, n.b], e2 = [l.l, l.t + 40]; return [s2, [8, s2[1] + 30], [8, e2[1] - 30], e2]; });
    }
    geom.current = { inP, outP };
  };

  useEffect(() => {
    measure();
    const ro = new ResizeObserver(measure);
    const el = board.current;
    ro.observe(el);
    el.addEventListener('eo-measure', measure); // the room's lens entrance asks again once its magnification ends
    return () => { ro.disconnect(); el.removeEventListener('eo-measure', measure); };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const send = (k, byHand) => {
    const [task, tier] = TASKS[k];
    const id = uid.current++;
    pulses.current.push({ id, tier, task, age: 0, lit: false });
    setLog((l) => [{ id, task, tier, done: false }, ...l].slice(0, 4));
    if (byHand) clock.current.hold = 6;
    if (calm) { setLast((p) => p.map((x, j) => (j === tier ? task : x))); setLog((l) => l.map((e) => (e.id === id ? { ...e, done: true } : e))); }
  };

  useLoop(board, (t, dt, still) => {
    const c = cv.current;
    if (!c || !geom.current) return;
    const { w, h, d } = fit(c);
    const g = c.getContext('2d');
    g.clearRect(0, 0, w, h);
    g.lineWidth = 1.25 * d;
    const curve = (p, a) => { g.strokeStyle = `rgba(255,255,255,${a})`; g.beginPath(); g.moveTo(p[0][0] * d, p[0][1] * d); g.bezierCurveTo(p[1][0] * d, p[1][1] * d, p[2][0] * d, p[2][1] * d, p[3][0] * d, p[3][1] * d); g.stroke(); };
    const { inP, outP } = geom.current;
    curve(inP, 0.16);
    outP.forEach((p, i) => curve(p, i === hit ? 0.42 : 0.13));
    if (still || paused) return;
    const ck = clock.current;
    ck.hold = Math.max(0, ck.hold - dt);
    ck.next -= dt;
    if (ck.next <= 0) { ck.next = 1.7; if (!ck.hold) { send(ck.i % TASKS.length); ck.i++; } }
    const comet = (p, at) => {
      for (let k = 9; k >= 0; k--) {
        const [x, y] = bez(p, Math.max(0, at - k * 0.022));
        g.fillStyle = `rgba(255,255,255,${(1 - k / 10) * (k ? 0.35 : 1)})`;
        g.beginPath(); g.arc(x * d, y * d, (k ? 2.2 : 3.6) * d, 0, 6.283); g.fill();
      }
    };
    pulses.current = pulses.current.filter((pl) => {
      pl.age += dt;
      if (pl.age < 0.6) comet(inP, ease(pl.age / 0.6));
      else if (pl.age < 0.85) { if (!pl.lit) { pl.lit = true; setAxis(TIERS[pl.tier].axis); } }
      else if (pl.age < 1.5) { curve(outP[pl.tier], 0.5); comet(outP[pl.tier], ease((pl.age - 0.85) / 0.65)); }
      else {
        setHit(pl.tier); setAxis(-1);
        setLast((p) => p.map((x, j) => (j === pl.tier ? pl.task : x)));
        setLog((l) => l.map((e) => (e.id === pl.id ? { ...e, done: true } : e)));
        return false;
      }
      return true;
    });
  });

  useEffect(() => { if (hit < 0) return; const t = setTimeout(() => setHit(-1), 900); return () => clearTimeout(t); }, [hit, last]);

  return (
    <div className="eo-board mb-panel" ref={board}>
      <canvas ref={cv} className="eo-wires" aria-hidden="true" />
      <div className="eo-in">
        <p className="mb-mono">Requests</p>
        <ul className="eo-queue" ref={queue}>
          <AnimatePresence initial={false} mode="popLayout">
            {log.map((e) => (
              <motion.li key={e.id} layout initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, transition: { duration: 0.2 } }} transition={{ duration: 0.5, ease: EASE }}>
                <span>{e.task}</span>
                <em data-done={e.done ? '' : undefined}>{e.done ? TIERS[e.tier].name : 'routing'}</em>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      </div>
      <div className="eo-node" ref={node}>
        <svg className="eo-enso" viewBox="0 0 100 100" aria-hidden="true"><path d="M50 8a42 42 0 1 1-30.4 13" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" /></svg>
        <strong>Enso</strong>
        {AXES.map((a, i) => <span key={a} className={'eo-ax eo-ax' + i} data-on={axis === i ? '' : undefined}>{a}</span>)}
      </div>
      <ol className="eo-lanes" aria-label="All Enso models">
        {TIERS.map((tr, i) => (
          <li key={tr.code} className="eo-lane" ref={(el) => (lanes.current[i] = el)} data-hit={hit === i ? '' : undefined}>
            <div className="eo-lane-top">
              <b>{tr.name}</b>
              <code>{tr.code}</code>
            </div>
            <span className="eo-why">{AXES[tr.axis]} · {tr.why}</span>
            <p className="eo-last" aria-hidden="true"><i />{last[i]}</p>
            <p className="eo-lane-p mb-tnum"><b>{tr.inp}</b> <span>in · per 1M tokens</span> <b>{tr.out}</b> <span>out</span>{tr.ctx === true ? <> <b>1M</b> <span>context</span></> : tr.ctx ? <> <span>{`${tr.ctx} context`}</span></> : null}</p>
          </li>
        ))}
      </ol>
      <div className="eo-send">
        <p className="mb-mono">Send a request</p>
        <div className="mb-chips">
          {TASKS.map(([task], k) => <button key={task} type="button" className="mb-chip" onClick={() => send(k, true)}>{task}</button>)}
        </div>
      </div>
    </div>
  );
}

// GPQA Diamond: Hanzo's figures and Hanzo's own sentence for each model, verbatim
const SINGLE = ', a single model tested on the same 198 GPQA Diamond questions, $';
const GPQA = [
  ['DeepSeek V4 Pro', 76.3, 1.05, 'DeepSeek V4 Pro 0423 76.3%' + SINGLE + '1.05 per 1,000 of them'],
  ['Sonnet 5', 77.8, 42.91, 'Claude Sonnet 5 77.8%' + SINGLE + '42.91 per 1,000 of them'],
  ['Fable 5', 82.8, 14.95, 'Claude Fable 5 82.8%' + SINGLE + '14.95 per 1,000 of them'],
  ['Haiku 5.5', 83.3, 1.07, 'Claude Haiku 5.5 83.3%' + SINGLE + '1.07 per 1,000 of them'],
  ['Opus 4.8', 87.4, 45.01, 'Claude Opus 4.8 87.4%' + SINGLE + '45.01 per 1,000 of them'],
  ['Fable 5.1', 87.9, 46.25, 'Claude Fable 5.1 87.9%' + SINGLE + '46.25 per 1,000 of them'],
  ['Sonnet 5.5', 90.4, 10.41, 'Claude Sonnet 5.5 90.4%' + SINGLE + '10.41 per 1,000 of them'],
  ['GPT-5.5', 90.4, 18.64, 'GPT-5.5 90.4%' + SINGLE + '18.64 per 1,000 of them'],
  ['GLM 5.3', 90.9, 0.945, 'GLM 5.3 90.9% on GPQA Diamond, reported by Epoch AI (independent), 2026-08-14; $0.945 per 1,000 questions estimated from its list price. https://epoch.ai/models/glm-5-3', 'https://epoch.ai/models/glm-5-3'],
  ['Opus 5.5', 90.9, 21.23, 'Claude Opus 5.5 90.9%' + SINGLE + '21.23 per 1,000 of them'],
  ['GPT-5.6 Sol', 91.9, 10.08, 'GPT-5.6 Sol 91.9%' + SINGLE + '10.08 per 1,000 of them'],
  ['Grok 4.7', 92.7, 4.57, 'Grok 4.7 92.7% on GPQA Diamond, reported by Epoch AI (independent), 2026-09-21; $4.57 per 1,000 questions estimated from its list price. https://epoch.ai/models/grok-4-7', 'https://epoch.ai/models/grok-4-7'],
  ['Kimi K3', 93.5, 10.61, 'Kimi K3 93.5% on GPQA Diamond, reported by Moonshot AI (lab), 2026-07-16; $10.61 per 1,000 questions estimated from its list price. https://github.com/MoonshotAI/Kimi-K3', 'https://github.com/MoonshotAI/Kimi-K3'],
  ['GPT-6 Sol', 94.3, 5.09, 'GPT-6 Sol 94.3% on GPQA Diamond, reported by Epoch AI (independent), 2026-09-22; $5.09 per 1,000 questions estimated from its list price. https://epoch.ai/models/gpt-6-sol', 'https://epoch.ai/models/gpt-6-sol'],
  ['Enso Flash', 95.5, 3.26, 'Enso Flash at $3.26 per 1,000, its cost on new questions: 95.5% · questions it has seen'],
  ['Enso', 96.5, 10.03, 'Enso at $10.03 per 1,000, its cost on new questions: 96.5% · questions it has seen'],
  ['Enso Ultra', 98.0, 14.76, 'Enso Ultra at $14.76 per 1,000, its cost on new questions: 98.0% · questions it has seen'],
];
const ENSO = GPQA.filter((g) => g[0].startsWith('Enso'));
const OTHERS = GPQA.filter((g) => !g[0].startsWith('Enso'));
const LX = [Math.log10(0.8), Math.log10(60)];
const px = (c) => Math.round((70 + ((Math.log10(c) - LX[0]) / (LX[1] - LX[0])) * 900) * 100) / 100; // rounded: server and browser maths agree
const py = (s) => Math.round((540 - ((s - 75) / 25) * 500) * 100) / 100;
const money = (c) => '$' + (c < 1 ? c.toFixed(3) : c.toFixed(2));

function Gpqa() {
  const box = useRef(null), plot = useRef(null);
  const seen = useInView(plot, { amount: 0.35 }); // the plot, not the whole (tall) section, so the tour starts when the chart is in view
  const once = useInView(box, { once: true, amount: 0.25 });
  const [sel, setSel] = useState(OTHERS.findIndex((g) => g[0] === 'Opus 5.5'));
  const [mine, setMine] = useState(false);
  const [sort, setSort] = useState('score');
  const calm = useReducedMotion();
  const paused = usePaused();
  useEffect(() => {
    if (!seen || mine || calm || paused) return;
    const t = setInterval(() => setSel((s) => (s + 1) % OTHERS.length), 2600);
    return () => clearInterval(t);
  }, [seen, mine, calm, paused]);
  const pick = (i) => { setSel(i); setMine(true); };
  // every result sits in a drawer under the chart: closed it is hidden="until-found" (find-in-page and #eo-results open it)
  const drawer = useRef(null);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const el = drawer.current;
    const show = () => setOpen(true);
    const byHash = () => { if (location.hash === '#eo-results') show(); };
    byHash();
    el.addEventListener('beforematch', show);
    addEventListener('hashchange', byHash);
    return () => { el.removeEventListener('beforematch', show); removeEventListener('hashchange', byHash); };
  }, []);
  // React writes hidden as a boolean, so the drawer sets "until-found" itself; the server sends it open (JS off reads every row)
  useEffect(() => {
    const el = drawer.current;
    if (open) el.removeAttribute('hidden'); else el.setAttribute('hidden', 'until-found');
  }, [open]);
  const m = OTHERS[sel];
  const rows = [...GPQA].sort(sort === 'score' ? (a, b) => b[1] - a[1] : (a, b) => a[2] - b[2]);
  const frontier = ENSO.map((g) => `${px(g[2])},${py(g[1])}`).join(' ');
  const head = useEnter(shuffle, '0px 0px -8% 0px');
  return (
    <section className="eo-gpqa lv-sec" ref={box} aria-labelledby="eo-gpqa-h">
      <div className="x-wrap">
        <div className="lv-sh">
          <h2 id="eo-gpqa-h" className="lv-h eo-shuffle" ref={head}>{'A New Pareto Frontier of Intelligence'.split(' ').map((w, i, a) => <span key={i}><span className="eo-w">{w}</span>{i < a.length - 1 ? ' ' : ''}</span>)}</h2>
          <p className="lv-p">GPQA Diamond challenges AI with 198 graduate-level science questions. See how Enso balances accuracy and cost across 1,000 answers.</p>
        </div>
        <div className="lv-stats eo-figs">
          {[...ENSO].reverse().map((g) => <Stat key={g[0]} value={`${g[1].toFixed(1)}%`} label={g[0]} note={`${money(g[2])} per 1,000 questions`} />)}
        </div>
        <div className="eo-plotwrap" ref={plot}>
          <svg className="eo-plot" viewBox="0 0 1000 600" role="group" aria-label="GPQA Diamond % against $ per 1,000 questions">
            {[75, 80, 85, 90, 95, 100].map((v) => (
              <g key={v}><line x1="70" x2="970" y1={py(v)} y2={py(v)} className="eo-grid" /><text x="56" y={py(v) + 5} textAnchor="end" className="eo-tick">{v}</text></g>
            ))}
            {[1, 3, 10, 30].map((v) => <text key={v} x={px(v)} y="572" textAnchor="middle" className="eo-tick">${v}</text>)}
            <text x="70" y="22" className="eo-axis">GPQA Diamond %</text>
            <text x="520" y="598" textAnchor="middle" className="eo-axis">cheaper ← $ per 1,000 questions → dearer</text>
            <motion.polyline points={frontier} className="eo-front" initial={{ pathLength: 0 }} animate={once ? { pathLength: 1 } : {}} transition={{ duration: 1.4, ease: EASE, delay: 0.9 }} />
            {m && ENSO.map((g) => (
              <motion.line key={g[0]} className="eo-link" x1={px(m[2])} y1={py(m[1])} animate={{ x2: px(g[2]), y2: py(g[1]) }} initial={false} transition={{ duration: 0.6, ease: EASE }} x2={px(g[2])} y2={py(g[1])} />
            ))}
            {GPQA.map((g, i) => {
              const enso = g[0].startsWith('Enso');
              const k = OTHERS.indexOf(g);
              const on = k === sel;
              return (
                <g key={g[0]} transform={`translate(${px(g[2])} ${py(g[1])})`}>
                  <motion.g
                    className={'eo-dot' + (enso ? ' enso' : '') + (on ? ' on' : '')}
                    initial={{ opacity: 0, scale: 0.6 }}
                    animate={once ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 0.5, ease: EASE, delay: 0.2 + i * 0.045 }}
                    tabIndex={enso ? undefined : 0}
                    role={enso ? 'img' : 'button'}
                    aria-label={g[3]}
                    aria-pressed={enso ? undefined : on}
                    onClick={enso ? undefined : () => pick(k)}
                    onKeyDown={enso ? undefined : (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(k); } }}
                  >
                    <title>{g[3]}</title>
                    <circle r={enso ? 11 : on ? 9 : 6.5} />
                    <circle r="18" className="eo-hit" />
                    <text x={enso || px(g[2]) > 700 ? -16 : 12} y={enso ? 5 : 4} textAnchor={enso || px(g[2]) > 700 ? 'end' : 'start'} className="eo-lab">{`${g[0]} ${g[1].toFixed(1)}%`}</text>
                  </motion.g>
                </g>
              );
            })}
          </svg>
          <aside className="eo-read" aria-live={mine ? 'polite' : 'off'}>
            <p className="mb-mono">Compare</p>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div key={m[0]} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.35, ease: EASE }}>
                <p className="eo-read-m"><b>{m[0]}</b><span className="mb-tnum">{`${m[1].toFixed(1)}% · ${money(m[2])}`}</span></p>
                <p className="eo-read-s">{m[3].replace(/ https:\S+$/, '')}</p>
                {m[4] && <A to={m[4]} className="eo-src">Source</A>}
              </motion.div>
            </AnimatePresence>
            <ul className="eo-vs">
              {ENSO.map((g) => (
                <li key={g[0]}>
                  <b>{g[0]}</b>
                  <span className="mb-tnum">{`${g[1].toFixed(1)}% · ${money(g[2])}`}</span>
                  <em data-yes={g[2] < m[2] ? '' : undefined}>{g[2] < m[2] ? 'cheaper' : 'dearer'}</em>
                </li>
              ))}
            </ul>
          </aside>
        </div>
        <div className="eo-table" data-open={open ? '' : undefined}>
          <button type="button" className="eo-disc" aria-expanded={open} aria-controls="eo-results" onClick={() => setOpen((o) => !o)}>
            <span className="eo-disc-t">GPQA Diamond</span>
            <span className="eo-disc-a">{open ? 'Close' : 'Show all'}<svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M8 3v10M3 8h10" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg></span>
          </button>
          <div id="eo-results" className="eo-results" ref={drawer}>
            <div className="eo-sort" role="group" aria-label="Sort">
              <button type="button" className="eo-sortb" aria-pressed={sort === 'score'} onClick={() => setSort('score')}>By score</button>
              <button type="button" className="eo-sortb" aria-pressed={sort === 'cost'} onClick={() => setSort('cost')}>By cost</button>
            </div>
            <DataTable
              caption="GPQA Diamond"
              cols={[{ key: 'm', label: 'Model' }, { key: 's', label: 'GPQA Diamond %', num: true }, { key: 'c', label: '$ per 1,000 questions', num: true }]}
              rows={rows.map((g) => {
                const enso = g[0].startsWith('Enso');
                return {
                  m: <>{enso ? <b>{g[0]}</b> : g[0]} {g[4] && <A to={g[4]} className="eo-src" aria-label={g[0] + ' source'}>↗</A>}</>,
                  s: enso ? <b>{`${g[1].toFixed(1)}%`}</b> : `${g[1].toFixed(1)}%`,
                  c: enso ? <b>{money(g[2])}</b> : money(g[2]),
                };
              })}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

const TIER_TASKS = TIERS.map((_, i) => TASKS.filter(([, k]) => k === i).map(([w]) => w));

// a chapter's picture: Enso's own film, framed a little closer each tier, with that tier's card laid on it
function TierArt({ i, on }) {
  const tr = TIERS[i];
  return (
    <div className="eo-art" style={{ '--z': 1.12 + i * 0.22, '--x': ['-4%', '6%', '-2%'][i], '--y': ['3%', '-5%', '2%'][i], ...[{}, { '--cl': 'auto', '--cr': '32px', '--ct': '32px', '--cb': 'auto' }, { '--cl': 'auto', '--cr': '32px' }][i] }}>
      <Img src={film('enso', 'webp')} w={1200} h={1500} />
      <ModelFilm slug="enso" play={on} />
      <div className="eo-tcard" aria-hidden="true">
        <p className="eo-tcard-top"><b>{tr.name}</b><code>{tr.code}</code></p>
        <p className="eo-tcard-ax">{AXES[tr.axis]}</p>
        <ul>{TIER_TASKS[i].map((w) => <li key={w}>{w}</li>)}</ul>
        <p className="eo-tcard-p mb-tnum"><b>{tr.inp}</b> in <b>{tr.out}</b> out</p>
      </div>
    </div>
  );
}

const CHAPTERS = TIERS.map((tr, i) => ({
  k: tr.name,
  title: tr.name,
  art: (on) => <TierArt i={i} on={on} />,
  body: (
    <>
      <p className="eo-ch-price mb-tnum"><b>{tr.inp}</b> <span>in · per 1M tokens</span> <b>{tr.out}</b> <span>out</span></p>
      <p>{tr.desc}</p>
      {tr.more && <p>{tr.more}</p>}
      <p className="eo-meta">{tr.ctx === true ? <span><b>1M</b> context</span> : tr.ctx ? <span>{`${tr.ctx} context`}</span> : null}<span>OpenAI-compatible API</span><span>Anthropic-compatible API</span></p>
      <p className="eo-acts">
        <A to="/login" className="eo-l">Try Hanzo</A>
        <A to={tr.wb} className="eo-l">Open in Workbench</A>
        <A to="https://github.com/hanzoai/enso" className="eo-l">Docs on GitHub</A>
      </p>
    </>
  ),
}));

// the three tiers as plain quick sections (no pinned chapter scene); each unfolds like paper from its top edge (fold-out)
function Tier({ c, i }) {
  const ref = useEnter();
  return (
    <article className={'eo-tier' + (i % 2 ? ' flip' : '')} ref={ref}>
      <div className="eo-tier-in">
        <div className="eo-tier-art">{c.art(true)}</div>
        <div className="eo-tier-t">
          <h3 className="eo-tier-h">{c.title}</h3>
          <div className="eo-tier-b">{c.body}</div>
        </div>
      </div>
    </article>
  );
}

/* The hero's Enso: Hanzo's film inside the ensō, at the size of a feature, not a takeover. It is the opener's landing
   (data-hero, then data-ready once the poster decodes); the one pause beside it stops every film and demo on the page. */
function Feature() {
  const box = useRef(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const img = box.current.querySelector('img');
    const done = () => setReady(true);
    if (img.complete) img.decode().then(done, done); else { img.addEventListener('load', done, { once: true }); img.addEventListener('error', done, { once: true }); }
  }, []);
  return (
    <div className="eo-feat" ref={box}>
      <div className="eo-feat-ring" data-hero="enso" data-ready={ready ? '' : undefined} aria-hidden="true">
        <Img src={film('enso', 'webp')} w={1200} h={1500} priority />
        <ModelFilm slug="enso" />
      </div>
      <FilmPause className="eo-feat-pause" />
    </div>
  );
}

export default function Enso() {
  const room = useEnter(lens, '0px 0px -12% 0px');
  const cards = useEnter(ink, '0px 0px -12% 0px');
  const band = useEnter(null, '0px 0px -10% 0px');
  useEffect(() => {
    const f = (e) => { if (e.pointerType === 'mouse') { pointer.x = e.clientX; pointer.y = e.clientY; } };
    addEventListener('pointermove', f, { passive: true });
    return () => removeEventListener('pointermove', f);
  }, []);
  return (
    <main className="x-model lv eo" data-cursor="">
      {/* Hanzo's own hero, as clear as theirs (COPY-RULE 4, 8 Nov): the crumb, the two-line headline, the lede and the
          three asks, word for word, with Enso's film held in its ensō beside them. Nothing pins, nothing takes the screen. */}
      <section className="eo-hero" aria-labelledby="eo-h">
        <div className="x-wrap eo-hero-g">
          <div className="eo-head eo-hero-t">
            <Lines as="h1" id="eo-h" lines={['The right intelligence.', 'Every time.']} reveal />
            <p className="lv-lede">One endpoint for every frontier model. Enso routes each request for quality, speed and cost.</p>
            <div className="lv-acts">
              <Cta kind="quiet" to="/login" id="enso.hero" thumb>Try Hanzo</Cta>
              <Cta to="https://platform.hanzo.ai" kind="link" id="enso.hero-platform">API Platform</Cta>
              <More to="https://github.com/hanzoai/enso">Docs on GitHub</More>
            </div>
            <p className="eo-buy"><Plan slot="hero" /></p>
            <p className="lv-crumb">Hanzo / Enso</p>
          </div>
          <Feature />
        </div>
      </section>
      <div className="x-model-body lv-body">
        {/* order (motion map: lead with the signature): particles form the ring → tiers (fold-out) → router room (cursor-lens)
            → model cards (ink-spread) → GPQA (word-shuffle; the figures still count up) → band (orbit-in) */}
        <Form />
        <section id="eo-tiers" className="eo-tiers" aria-label="Enso">
          <div className="x-wrap"><p className="eo-auto">The default for everyone, Free plan included: it picks the tier for each request and bills at the tier that answers.</p></div>
          <div className="x-wrap">{CHAPTERS.map((c, i) => <Tier key={c.title} c={c} i={i} />)}</div>
        </section>
        {/* the dark room: the live router; each tier's lane carries its own prices (one object, not a second table) */}
        <section className="lv-room lv-sec eo-live eo-lens" data-room="dark" aria-label="Enso" ref={room}>
          <div className="x-wrap">
            <Switchboard />
            <p className="eo-all"><More to="/models/enso">All Enso models</More></p>
          </div>
        </section>
        <div className="eo-ink" ref={cards}><ModelCards slug="enso" /></div>
        <Gpqa />
        <div className="eo-orbit" ref={band}><Band title="The right intelligence. Every time." action="Try Hanzo" to="/login" note={<Plan slot="close" />} /></div>
      </div>
    </main>
  );
}
