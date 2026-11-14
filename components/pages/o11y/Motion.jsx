'use client';
/* /o11y's own motion (docs/MOTION-MAP.md): the flip-board signature and the page's five entrances, page-local.
   Each entrance triggers once when its section enters view; under reduced motion and with JS off the final state shows
   (the hidden starting states live under `html.js` and are dropped by `prefers-reduced-motion`).
     1 ink-spread     the hero window is revealed by three ink blots spreading (CSS mask, @property radii)
     2 explode-gather the board starts as scattered fragments and collapses into the whole
     3 pixel-resolve  the OTLP room resolves from coarse blocks to sharp (an SVG pixelate filter, stepped)
     4 sticky-stack   the six parts are cards that stack at the top as you scroll past them (CSS sticky)
     5 cursor-trail   a trail sweeps across the close once, then follows the pointer or finger */
import { useEffect, useRef, useState } from 'react';
import LivePause from '../../v2/LivePause';

const calmNow = () => typeof window !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;

/* true once the element has entered view (or at once under reduced motion) */
export function useEnter(amount = 0.25) {
  const ref = useRef(null);
  const [inn, setIn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (calmNow() || !('IntersectionObserver' in window)) { setIn(true); return; }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setIn(true); io.disconnect(); } }, { threshold: amount });
    io.observe(el);
    return () => io.disconnect();
  }, [amount]);
  return [ref, inn];
}

/* ---------- 1. ink-spread ---------- */
export function InkSpread({ children, className = '' }) {
  const [ref, inn] = useEnter(0.05);
  const [done, setDone] = useState(false);
  useEffect(() => { if (!inn) return; const t = setTimeout(() => setDone(true), 2200); return () => clearTimeout(t); }, [inn]);
  return <div ref={ref} className={`ob-ink ${inn ? 'in' : ''} ${done ? 'done' : ''} ${className}`}>{children}</div>;
}

/* ---------- 3. pixel-resolve ---------- */
const STEPS = [36, 28, 20, 14, 9, 5, 2];
export function PixelResolve({ children, className = '' }) {
  const [ref, inn] = useEnter(0.2);
  const [s, setS] = useState(STEPS[0]);
  const [done, setDone] = useState(false);
  useEffect(() => {
    if (!inn) return;
    if (calmNow()) { setDone(true); return; }
    let i = 0, id;
    const step = () => { i += 1; if (i >= STEPS.length) setDone(true); else { setS(STEPS[i]); id = setTimeout(step, 110); } };
    id = setTimeout(step, 110);
    return () => clearTimeout(id);
  }, [inn]);
  return (
    <div ref={ref} className={`ob-px ${inn ? 'in' : ''} ${done ? 'done' : ''} ${className}`}>
      <svg className="ob-px-defs" width="0" height="0" aria-hidden="true" focusable="false">
        <filter id="ob-px-f" x="0" y="0" width="1" height="1" colorInterpolationFilters="sRGB">
          <feFlood x={s / 2} y={s / 2} width="1" height="1" />
          <feComposite width={s} height={s} />
          <feTile result="a" />
          <feComposite in="SourceGraphic" in2="a" operator="in" />
          <feMorphology operator="dilate" radius={s / 2} />
        </filter>
      </svg>
      {children}
    </div>
  );
}

/* ---------- 5. cursor-trail ---------- */
export function CursorTrail({ children, className = '' }) {
  const [ref, inn] = useEnter(0.15);
  const cv = useRef(null);
  useEffect(() => {
    const host = ref.current, c = cv.current;
    if (!host || !c || !inn || calmNow()) return;
    const ctx = c.getContext('2d');
    const pts = [];
    let raf = 0, W = 0, H = 0;
    const dpr = Math.min(2, devicePixelRatio || 1);
    const size = () => { W = host.offsetWidth; H = host.offsetHeight; c.width = W * dpr; c.height = H * dpr; c.style.width = W + 'px'; c.style.height = H + 'px'; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); };
    size();
    const LIFE = 700;
    const draw = (t) => {
      ctx.clearRect(0, 0, W, H);
      while (pts.length && t - pts[0].t > LIFE) pts.shift();
      for (let i = 1; i < pts.length; i++) {
        const a = pts[i - 1], b = pts[i], k = 1 - (t - b.t) / LIFE;
        ctx.strokeStyle = `rgba(10, 10, 10, ${0.4 * k})`;
        ctx.lineWidth = 1 + 3 * k;
        ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
      }
      raf = pts.length ? requestAnimationFrame(draw) : 0;
    };
    const add = (x, y) => { pts.push({ x, y, t: performance.now() }); if (!raf) raf = requestAnimationFrame(draw); };
    // the entrance: one scripted sweep across the section, left to right, as it arrives
    const t0 = performance.now(), SWEEP = 1300;
    let sweep = requestAnimationFrame(function go(t) {
      const p = Math.min(1, (t - t0) / SWEEP), e = 1 - Math.pow(1 - p, 3);
      const y0 = Math.min(H, innerHeight) * 0.5;
      add(W * (0.04 + 0.92 * e), y0 + Math.sin(e * Math.PI * 2) * 60);
      if (p < 1) sweep = requestAnimationFrame(go);
    });
    const move = (ev) => { const r = host.getBoundingClientRect(); add(ev.clientX - r.left, ev.clientY - r.top); };
    host.addEventListener('pointermove', move, { passive: true });
    addEventListener('resize', size);
    return () => { cancelAnimationFrame(raf); cancelAnimationFrame(sweep); host.removeEventListener('pointermove', move); removeEventListener('resize', size); };
  }, [inn, ref]);
  return (
    <div ref={ref} className={`ob-trail ${inn ? 'in' : ''} ${className}`}>
      {children}
      <canvas ref={cv} className="ob-trail-cv" aria-hidden="true" />
    </div>
  );
}

/* ---------- the signature: the flip board ---------- */
// six services; for each of O11y's six parts, one column of values (illustrative example data, like the span names)
const SVC = ['gateway', 'api', 'auth', 'queue', 'db', 'payments'];
const BOARD = [
  { unit: 'p99 ms', n: [412, 388, 21, 9, 241, 64], st: ['ok', 'ok', 'ok', 'ok', 'slow', 'ok'] },
  { unit: 'req/s', n: [1240, 1180, 1240, 310, 2960, 96], st: ['ok', 'ok', 'ok', 'ok', 'ok', 'ok'] },
  { unit: 'lines/min', n: [5200, 8400, 1900, 600, 3100, 420], st: ['ok', 'ok', 'ok', 'ok', 'warn', 'ok'] },
  { unit: 'count', v: ['0', '0', '0', '0', '1,000', '0'], st: ['ok', 'ok', 'ok', 'ok', 'error', 'ok'] },
  { unit: 'rule', v: ['quiet', 'quiet', 'quiet', 'quiet', 'firing', 'quiet'], st: ['ok', 'ok', 'ok', 'ok', 'paged', 'ok'] },
  { unit: 'wire', v: ['gRPC', 'gRPC', 'HTTP', 'gRPC', 'gRPC', 'HTTP'], st: ['ok', 'ok', 'ok', 'ok', 'ok', 'ok'] },
];
const fmt = (n) => n.toLocaleString('en-US');
// a few pseudo-random but fixed numbers, so server and client agree
const rnd = (i) => { const x = Math.sin(i * 12.9898) * 43758.5453; return x - Math.floor(x); };

function Flap({ text, w, right, d = 0 }) {
  const s = right ? text.padStart(w) : text.padEnd(w);
  return (
    <span className="ob-fl-word" aria-hidden="true">
      {[...s].map((ch, i) => (
        <span className="ob-fl" key={i}><b key={ch} style={{ '--d': `${d + i * 28}ms` }}>{ch === ' ' ? ' ' : ch}</b></span>
      ))}
    </span>
  );
}

export function FlipBoard({ tabs, label, clock }) {
  const [ref, inn] = useEnter(0.3);
  const [part, setPart] = useState(0);
  const [nums, setNums] = useState(() => BOARD.map((b) => b.n && [...b.n]));
  const [paused, setPaused] = useState(false);
  const [held, setHeld] = useState(false);
  const [live, setLive] = useState(false);
  const [hot, setHot] = useState(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setLive(e.isIntersecting), { threshold: 0.2 });
    io.observe(el);
    return () => io.disconnect();
  }, [ref]);
  const run = inn && live && !paused && !calmNow();
  // the parts advance on their own until a visitor picks one
  useEffect(() => {
    if (!run || held) return;
    const id = setTimeout(() => setPart((p) => (p + 1) % BOARD.length), 3400);
    return () => clearTimeout(id);
  }, [run, held, part]);
  // and the data changes underneath: one row's number moves a little every 1.3 s, and only its changed digits flip
  const tick = useRef(0);
  useEffect(() => {
    if (!run) return;
    let id;
    const step = () => {
      id = setTimeout(step, 1300);
      tick.current += 1;
      setNums((all) => all.map((col, p) => {
        if (!col) return col;
        const r = Math.floor(rnd(tick.current * 7 + p) * 6), base = BOARD[p].n[r];
        const next = [...col];
        next[r] = Math.max(1, Math.round(base * (0.94 + rnd(tick.current * 3 + r) * 0.12)));
        return next;
      }));
    };
    id = setTimeout(step, 1300);
    return () => clearTimeout(id);
  }, [run]);
  const b = BOARD[part];
  const vals = b.n ? nums[part].map(fmt) : b.v;
  const pick = (i) => { setPart(i); setHeld(true); };
  const toggle = () => { if (held) { setHeld(false); setPaused(false); } else setPaused((p) => !p); };
  return (
    <div ref={ref} className={`ob-board ob-xg ${inn ? 'in' : ''}`} data-part={part}>
      <div className="ob-board-bar ob-frag" style={{ '--fx': '-40px', '--fy': '-60px', '--fr': '-6deg', '--fi': 0 }}>
        <LivePause paused={paused || held} onToggle={toggle} dark inline className="ob-board-pause" />
        <span className="ob-suite-host">o11y.hanzo.ai</span>
        {clock}
        <div className="ob-tabs" role="group" aria-label={label}>
          {tabs.map((t, i) => <button key={t} type="button" className={part === i ? 'on' : ''} aria-pressed={part === i} onClick={() => pick(i)}>{t}</button>)}
          <i className="ob-tab-ink" aria-hidden="true" style={{ transform: `translateX(${part * 100}%)` }} />
        </div>
      </div>
      <div className="ob-board-grid" aria-hidden="true">
        <div className="ob-board-head ob-frag" style={{ '--fx': '30px', '--fy': '-80px', '--fr': '4deg', '--fi': 1 }}>
          <span>service</span><span className="r" key={b.unit}>{b.unit}</span><span>state</span>
        </div>
        {SVC.map((s, r) => {
          const st = b.st[r];
          return (
            <div key={s} className={'ob-board-row' + (st !== 'ok' ? ' alert' : '') + (hot === r ? ' hot' : '')}
              onPointerEnter={() => setHot(r)} onPointerLeave={() => setHot(null)}>
              {[0, 1, 2].map((c) => (
                <span key={c} className={'ob-frag ob-board-c c' + c}
                  style={{ '--fx': `${Math.round((rnd(r * 3 + c + 1) - 0.5) * 520)}px`, '--fy': `${Math.round((rnd(r * 5 + c + 9) - 0.5) * 360)}px`, '--fr': `${Math.round((rnd(r + c * 7) - 0.5) * 40)}deg`, '--fi': 2 + r * 3 + c }}>
                  {c === 0 && <Flap text={s} w={8} d={r * 40} />}
                  {c === 1 && <Flap text={vals[r]} w={6} right d={r * 40 + 120} />}
                  {c === 2 && <Flap text={st} w={6} d={r * 40 + 240} />}
                </span>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}
