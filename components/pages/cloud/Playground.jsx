'use client';
/* Playground, v2 launch page (Cloud 3).
   V2: 8/10 motion-map: drag-canvas + glitch-in (hero), tile-flip (canvas), cover-slide (related), scramble (dark room),
   swing-door (close); the pinned first-request scene is gone.
   Signature (motion map): drag to explore. The Playground's parts (the first-request sentence, the curl and Python
   cards, the eight kinds, the nine models) lie on one endless board you pan with a pointer (both ways) or a finger
   (sideways), throw with inertia, or steer with the arrow keys; it drifts by itself until touched. The hero window
   still runs the eight kinds by itself.
   Beyond: the anatomy of a first request. Tap a phrase (a key, a model name, a message) and the board glides to the
   curl card with that token marked; "is the whole first request." glides to the Python client. On arrival the sentence
   reads itself once.
   Persona: Developer. Goal: open the Playground and run a first request.
   CTA: "Open the Playground" → https://platform.hanzo.ai/playground (data-cta playground.hero, playground.close; the
   site's sticky ask bar carries the same words from data-thumb). Metric: api_key_created.
   Motion: idle = the running window, the drifting board, the caret; pointer = drag and throw the board, hovering a kind
   previews its run, hovering a phrase marks its token; state = kind tabs, pause; arrival = the five entrances.
   Every word and link is Hanzo's; the meter shows proportions, not measured figures. */
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useScroll, useReducedMotion, useTransform } from 'motion/react';
import { Copy } from '../../ui';
import { Paste, useLive } from './Frame';
import LaunchClose, { Arr } from '../../v2/LaunchClose';
import LineMask from '../../v2/LineMask';
import LivePause, { usePause } from '../../v2/LivePause';
import RelatedCards from '../../v2/RelatedCards';
import { A, Img, Film } from '../../kit';
import { useEnter, useScramble } from '../playground/enter';
import './Playground.css';

const PLAY = 'https://platform.hanzo.ai/playground';
const EASE = [0.16, 1, 0.3, 1];
const MODES = ['Chat', 'Completions', 'Decisions', 'Embeddings', 'Image', 'Video', 'Audio', 'Vision'];
const MODEL = ['zen', 'zen', 'zen', 'zen', 'iro', 'koma', 'oto', 'kai']; // the model each kind runs on: the media it shows
const FIRST = 4; // the window opens on Image, so the first screen carries Iro's own colour; the tabs keep Hanzo's order
// relative run shape for the meter bars only: [tokens in, tokens out, time]; never shown as numbers
const RUN = [[0.3, 0.6, 0.2], [0.4, 0.9, 0.3], [0.5, 0.1, 0.1], [0.35, 0, 0.05], [0.45, 0, 0.55], [0.5, 0, 0.95], [0.4, 0, 0.35], [0.6, 0.45, 0.25]];
/* the kinds take turns; a kind you pick holds for two turns, then the window carries on by itself */
function useSteps(n, ms, live) {
  const [at, setAt] = useState(0);
  const [mine, setMine] = useState(false);
  useEffect(() => {
    if (!live) return;
    const t = setTimeout(() => { setMine(false); setAt((v) => (v + 1) % n); }, mine ? ms * 2 : ms);
    return () => clearTimeout(t);
  }, [at, live, mine, n, ms]);
  return [at, (i) => { setAt(i); setMine(true); }, mine];
}
const rnd = (i) => { const x = Math.sin(i * 91.7) * 43758.5453; return x - Math.floor(x); };

function Chat() {
  return (
    <div className="pg-chat">
      <motion.p className="pg-bub me" initial={{ opacity: 0, y: 12, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.45, ease: EASE }}>Hello</motion.p>
      <motion.div className="pg-bub ai" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, ease: EASE, delay: 0.45 }}>
        {[94, 82, 88, 70, 46].map((w, i) => <motion.i key={i} style={{ width: w + '%' }} initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.5, ease: EASE, delay: 0.7 + i * 0.3 }} />)}
      </motion.div>
    </div>
  );
}
function Completions() {
  const rows = [[100, 1], [100, 1], [64, 1], [100, 0], [100, 0], [92, 0], [100, 0], [48, 0]];
  return <div className="pg-comp">{rows.map(([w, given], i) => <motion.i key={i} className={given ? 'given' : ''} style={{ width: w + '%' }} initial={{ scaleX: given ? 1 : 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.45, ease: 'linear', delay: given ? 0 : 0.3 + (i - 3) * 0.42 }} />)}</div>;
}
function Decisions() {
  return (
    <svg className="pg-tree" viewBox="0 0 320 200" aria-hidden="true">
      <motion.path d="M160 40 C160 90 80 90 80 150" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.6, delay: 0.3, ease: EASE }} />
      <motion.path d="M160 40 C160 90 240 90 240 150" className="on" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.6, delay: 0.3, ease: EASE }} />
      <circle cx="160" cy="34" r="12" className="root" />
      <motion.circle cx="80" cy="158" r="12" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.9, duration: 0.3, ease: EASE }} />
      <motion.circle cx="240" cy="158" r="12" className="pick" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1.1, duration: 0.3, ease: EASE }} />
    </svg>
  );
}
function Embeddings() {
  const hubs = [[70, 60], [220, 70], [150, 150]];
  return (
    <svg className="pg-emb" viewBox="0 0 300 200" aria-hidden="true">
      {Array.from({ length: 42 }).map((_, i) => {
        const h = hubs[i % 3];
        return <motion.circle key={i} r="4" className={'c' + (i % 3)} initial={{ cx: Math.round(rnd(i + 9) * 300), cy: Math.round(rnd(i + 99) * 200), opacity: 0 }} animate={{ cx: Math.round(h[0] + (rnd(i) - 0.5) * 60), cy: Math.round(h[1] + (rnd(i + 50) - 0.5) * 44), opacity: 1 }} transition={{ duration: 1.4, ease: EASE, delay: 0.2 + (i % 14) * 0.03 }} />;
      })}
    </svg>
  );
}
/* Iro develops: the tiles clear with CSS, so the picture comes through at first paint, with JS off too */
function Image() {
  return (
    <div className="pg-img">
      <Img src="/models/iro.webp" w={1200} h={1500} priority />
      <div className="pg-tiles">{Array.from({ length: 60 }).map((_, i) => <i key={i} style={{ '--d': (0.2 + rnd(i) * 2.2).toFixed(2) + 's' }} />)}</div>
    </div>
  );
}
function Video({ paused }) {
  const box = useRef(null);
  useEffect(() => { const v = box.current?.querySelector('video'); if (!v) return; if (paused) v.pause(); else v.play?.().catch(() => {}); }, [paused]);
  return <div className="pg-vid" ref={box}><Film src="/models/koma.webm" poster="/models/koma.webp" w={1200} h={1500} /><i className="pg-head" /></div>;
}
/* Audio: Oto's own film, with the waveform it is singing drawn along its foot */
function Audio({ paused }) {
  const box = useRef(null);
  useEffect(() => { const v = box.current?.querySelector('video'); if (!v) return; if (paused) v.pause(); else v.play?.().catch(() => {}); }, [paused]);
  return (
    <div className="pg-aud" ref={box}>
      <Film src="/models/oto.webm" poster="/models/oto.webp" w={1200} h={1500} />
      <div className="pg-wave">{Array.from({ length: 56 }).map((_, i) => <i key={i} style={{ animationDelay: `${-rnd(i) * 1.2}s`, height: `${24 + rnd(i + 3) * 76}%` }} />)}</div>
    </div>
  );
}
function Vision() {
  return (
    <div className="pg-vis">
      <Img src="/models/kai.webp" w={1200} h={1500} />
      <motion.i className="pg-box" initial={{ left: '8%', top: '10%', width: '80%', height: '78%', opacity: 0 }} animate={{ left: '30%', top: '18%', width: '38%', height: '56%', opacity: 1 }} transition={{ duration: 1.2, ease: EASE, delay: 0.3 }}>
        <motion.span initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.4 }}>found</motion.span>
      </motion.i>
    </div>
  );
}
const CANVAS = [Chat, Completions, Decisions, Embeddings, Image, Video, Audio, Vision];

function Window() {
  const [ref, live, calm] = useLive(0.3);
  const [paused, pause] = usePause();
  const [hov, setHov] = useState(null); // a kind under a fine pointer previews its run
  const run = live && !paused && hov === null;
  const [raw, chooseRaw, mine] = useSteps(MODES.length, 3800, run);
  const at = (raw + FIRST) % MODES.length;
  const cur = hov ?? at;
  const choose = (i) => { setHov(null); chooseRaw((i - FIRST + MODES.length) % MODES.length); };
  const Canvas = CANVAS[cur];
  const strip = useRef(null);
  useEffect(() => { // phones: keep the lit kind inside the tab strip
    const s = strip.current, b = s?.children[cur]; if (!s || !b || s.scrollWidth <= s.clientWidth) return;
    s.scrollTo({ left: b.offsetLeft - (s.clientWidth - b.offsetWidth) / 2, behavior: calm ? 'auto' : 'smooth' });
  }, [cur, calm]);
  const key = (e) => {
    const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : e.key === 'Home' ? -cur : e.key === 'End' ? MODES.length - 1 - cur : 0;
    if (!d) return; e.preventDefault();
    const n = (cur + d + MODES.length) % MODES.length; choose(n); strip.current?.children[n]?.focus();
  };
  const [tin, tout, secs] = RUN[cur];
  const bars = [['Tokens in', tin], ['Tokens out', tout], ['Time', secs], ['Cost', Math.min(1, (tin + tout) * 0.6 + secs * 0.5)]];
  return (
    <div className={'pg-win' + (paused ? ' paused' : '')} ref={ref}>
      <div className="pg-bar">
        <LivePause paused={paused} onToggle={pause} className="pg-pause" />
        <i /><i /><i /><span>Playground</span><b>{MODEL[cur]}</b>
      </div>
      <div className="pg-modes" role="tablist" aria-label="Kind of run" ref={strip} onKeyDown={key} onPointerLeave={() => setHov(null)}>
        {MODES.map((m, i) => (
          <button key={m} type="button" role="tab" id={'pg-k' + i} aria-controls="pg-run" tabIndex={cur === i ? 0 : -1} aria-selected={cur === i} onClick={() => choose(i)} onPointerEnter={(e) => e.pointerType === 'mouse' && setHov(i)}>
            {cur === i && <motion.i layoutId="pg-mode" className="pg-mode-bg" transition={{ duration: 0.3, ease: EASE }} />}
            <span>{m}</span>
            {cur === i && run && <em key={raw + (mine ? 'h' : '')} className="pg-mode-t" style={mine ? { animationDuration: '7.6s' } : undefined} />}
          </button>
        ))}
      </div>
      <div className="pg-body" role="tabpanel" id="pg-run" aria-labelledby={'pg-k' + cur}>
        <div className="pg-canvas" aria-hidden="true">
          <div className="pg-stagebox">
            {calm ? <div className="pg-cv"><Canvas paused /></div> : (
              <AnimatePresence mode="wait" initial={false}>
                <motion.div key={cur} className="pg-cv" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8, transition: { duration: 0.2 } }} transition={{ duration: 0.35, ease: EASE }}><Canvas paused={paused} /></motion.div>
              </AnimatePresence>
            )}
          </div>
          <div className="pg-input"><span>Hello</span><b><svg viewBox="0 0 16 16" width="15" height="15"><path d="M8 13V3M3.5 7.5 8 3l4.5 4.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg></b></div>
        </div>
        <aside className="pg-run" aria-label="This run">
          <p className="pg-run-k">Run · {MODES[cur]}</p>
          <div className="pg-model"><span>Model</span><b>{MODEL[cur]}</b></div>
          <ul className="pg-meter">
            {bars.map(([l, v], i) => <li key={l} className={i === 3 ? 'cost' : ''}><span>{l}</span><i><b key={cur} style={{ '--v': v, '--d': 0.3 + i * 0.12 + 's' }} /></i></li>)}
          </ul>
        </aside>
      </div>
    </div>
  );
}

/* ---------- the first request, scrubbed ---------- */
const CURL = `curl https://api.hanzo.ai/v1/chat/completions \\
  -H "Authorization: Bearer $HANZO_API_KEY" \\
  -d '{"model":"zen","messages":[{"role":"user","content":"Hello"}]}'`;
const PY = `pip install hanzoai

import os
from hanzoai.cloud import ApiClient, Configuration, KeysApi

api = ApiClient(Configuration(
    host="https://api.hanzo.ai",
    access_token=os.environ["HANZO_API_KEY"],
))
print(KeysApi(api).get_keys().keys)`;
const PARTS = [['A key', 'HANZO_API_KEY'], ['a model name', '"zen"'], ['a message', '"Hello"']];

function marked(code, mark) {
  return code.split('\n').map((l, j) => {
    const bits = mark && l.includes(mark) ? l.split(mark).flatMap((x, i) => [i > 0 && <mark key={'m' + i}>{mark}</mark>, <span key={i}>{x}</span>]) : l;
    const c = /^\s*#/.test(l) ? 'c' : '';
    return <span key={j} className={'pg-ln ' + c}>{bits}{'\n'}</span>;
  });
}

/* ---------- the signature: drag to explore. The Playground's parts (the first request, the curl and Python, the eight
   kinds, the models) lie on one endless canvas the visitor pans with a pointer or a finger, and throws with inertia.
   Each part wraps around the board, so there is no edge; tapping a phrase glides to where its token is marked. ---------- */
const DESK = { W: 2400, H: 1200, at: {
  say: [60, 64], curl: [600, 52], py: [1300, 84],
  k0: [60, 420], k1: [250, 420], k2: [440, 420], k3: [630, 420], k4: [860, 470], k5: [1050, 470], k6: [1240, 470], k7: [1430, 470],
  m0: [1880, 120], m1: [2040, 120], m2: [2200, 120], m3: [1880, 330], m4: [2040, 330], m5: [2200, 330], m6: [1880, 540], m7: [2040, 540], m8: [2200, 540],
} };
// phones pan sideways only (the finger's vertical stroke scrolls the page), so the small board is one long strip
const SMALL = { W: 2000, H: 1200, at: {
  say: [16, 20], curl: [360, 20], py: [980, 20],
  k0: [16, 250], k1: [166, 250], k2: [16, 410], k3: [166, 410], k4: [360, 290], k5: [510, 290], k6: [660, 290], k7: [810, 290],
  m0: [1470, 20], m1: [1610, 20], m2: [1750, 20], m3: [1470, 196], m4: [1610, 196], m5: [1750, 196], m6: [1470, 372], m7: [1610, 372], m8: [1750, 372],
} };
const mod = (a, n) => ((a % n) + n) % n;
const MINI = [Chat, Completions, Decisions, Embeddings];

function Explore() {
  const sec = useRef(null), view = useRef(null), items = useRef({});
  const enter = useEnter(sec, 0.3);
  const calm = useReducedMotion();
  const [small, setSmall] = useState(false);
  const [sel, setSel] = useState(0); // 0..2 a part of the sentence, 3 the whole request in Python
  const [hv, setHv] = useState(null);
  const [auto, setAuto] = useState(null);
  const L = small ? SMALL : DESK;
  const Lr = useRef(L); Lr.current = L; // the rAF loop reads the current board
  const st = useRef({ x: 0, y: 0, vx: 0, vy: 0, drag: null, moved: false, goal: null, touched: false, raf: 0, seen: false });

  const place = () => {
    const s = st.current, v = view.current, L = Lr.current; if (!v) return;
    const vw = v.clientWidth, vh = v.clientHeight;
    for (const [k, el] of Object.entries(items.current)) {
      if (!el) continue;
      const [x0, y0] = L.at[k];
      let X = mod(x0 + s.x, L.W), Y = mod(y0 + s.y, L.H);
      if (X > vw + 40) X -= L.W; if (Y > vh + 40) Y -= L.H;
      el.style.transform = `translate3d(${X.toFixed(1)}px, ${Y.toFixed(1)}px, 0)`;
    }
    v.style.backgroundPosition = `${mod(s.x, 24).toFixed(1)}px ${mod(s.y, 24).toFixed(1)}px`;
  };
  const loop = () => {
    const s = st.current;
    if (!s.drag) {
      if (s.goal) { // a glide to a part (tap a phrase, or the arrow keys)
        const dx = s.goal[0] - s.x, dy = s.goal[1] - s.y;
        s.x += dx * 0.12; s.y += dy * 0.12;
        if (Math.abs(dx) + Math.abs(dy) < 0.6) { s.x = s.goal[0]; s.y = s.goal[1]; s.goal = null; }
      } else if (Math.abs(s.vx) + Math.abs(s.vy) > 0.05) { s.x += s.vx; s.y += s.vy; s.vx *= 0.94; s.vy *= 0.94; } // the throw
      else if (!s.touched && s.seen && !calm) { s.x -= 0.35; } // untouched: the board drifts by itself
      else { s.vx = s.vy = 0; place(); s.raf = 0; return; }
    }
    place();
    s.raf = requestAnimationFrame(loop);
  };
  const wake = () => { if (!st.current.raf) st.current.raf = requestAnimationFrame(loop); };

  useEffect(() => { const m = matchMedia('(max-width: 899px)'); const f = () => setSmall(m.matches); f(); m.addEventListener('change', f); return () => m.removeEventListener('change', f); }, []);
  useLayoutEffect(place); // every render re-applies the board's offset
  useEffect(() => {
    const v = view.current; if (!v) return;
    const io = new IntersectionObserver(([e]) => { st.current.seen = e.isIntersecting; if (e.isIntersecting) wake(); }, { threshold: 0.2 });
    io.observe(v);
    return () => { io.disconnect(); cancelAnimationFrame(st.current.raf); st.current.raf = 0; };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { // on arrival the sentence reads itself once: a key, a model name, a message
    if (enter !== 'in' || calm) return;
    const ts = [0, 1, 2].map((i) => setTimeout(() => setAuto(i), 1100 + i * 1200));
    ts.push(setTimeout(() => setAuto(null), 1100 + 3 * 1200));
    return () => ts.forEach(clearTimeout);
  }, [enter, calm]);

  const down = (e) => {
    if (e.button > 0) return;
    const s = st.current;
    s.drag = { id: e.pointerId, x: e.clientX, y: e.clientY, sx: s.x, sy: s.y, t: performance.now(), lx: e.clientX, ly: e.clientY };
    s.moved = false; s.goal = null; s.vx = s.vy = 0; s.touched = true;
  };
  const move = (e) => {
    const s = st.current, d = s.drag; if (!d || d.id !== e.pointerId) return;
    const dx = e.clientX - d.x, dy = e.pointerType === 'touch' ? 0 : e.clientY - d.y;
    if (!s.moved && Math.hypot(dx, dy) > 6) { s.moved = true; view.current.setPointerCapture?.(e.pointerId); view.current.dataset.drag = ''; }
    if (!s.moved) return;
    const now = performance.now(), dt = Math.max(8, now - d.t);
    s.vx = ((e.clientX - d.lx) / dt) * 16; s.vy = e.pointerType === 'touch' ? 0 : ((e.clientY - d.ly) / dt) * 16;
    d.t = now; d.lx = e.clientX; d.ly = e.clientY;
    s.x = d.sx + dx; s.y = d.sy + dy; place();
  };
  const up = (e) => {
    const s = st.current; if (!s.drag || s.drag.id !== e.pointerId) return;
    s.drag = null; delete view.current.dataset.drag; wake();
  };
  const click = (e) => { if (st.current.moved) { e.preventDefault(); e.stopPropagation(); st.current.moved = false; } };
  const glideTo = (k) => { // bring a part to the middle of the view
    const s = st.current, v = view.current, el = items.current[k]; if (!v || !el) return;
    const [x0, y0] = L.at[k];
    const gx = (v.clientWidth - el.offsetWidth) / 2 - x0, gy = small ? s.y : Math.min(40, (v.clientHeight - el.offsetHeight) / 2) - y0;
    const near = (a, g, n) => g + Math.round((a - g) / n) * n; // the nearest copy of that spot on the endless board
    s.goal = [near(s.x, gx, L.W), near(s.y, gy, L.H)]; s.touched = true; s.vx = s.vy = 0;
    if (calm) { s.x = s.goal[0]; s.y = s.goal[1]; s.goal = null; place(); } else wake();
  };
  const key = (e) => {
    const k = { ArrowLeft: [120, 0], ArrowRight: [-120, 0], ArrowUp: [0, 120], ArrowDown: [0, -120] }[e.key];
    if (!k || e.target !== view.current) return;
    e.preventDefault();
    const s = st.current; s.touched = true; s.goal = [(s.goal?.[0] ?? s.x) + k[0], (s.goal?.[1] ?? s.y) + k[1]];
    if (calm) { s.x = s.goal[0]; s.y = s.goal[1]; s.goal = null; place(); } else wake();
  };

  const show = hv ?? auto ?? sel;
  const pick = (i) => { setHv(null); setAuto(null); setSel(i); glideTo(i === 3 ? 'py' : 'curl'); };
  const peek = (i) => (e) => e.pointerType === 'mouse' && setHv(i);
  const put = (k) => (el) => { items.current[k] = el; };
  const pos = (k) => ({ transform: `translate3d(${L.at[k][0]}px, ${L.at[k][1]}px, 0)` });
  const tiles = small ? 36 : 60;

  return (
    <section ref={sec} className="pg-ex" data-enter={enter || undefined}>
      <div className="lx-wrap pg-ex-head">
        <h2 className="lx-title pg-ex-h">Then the same request from code</h2>
      </div>
      <div className="lx-wrap pg-ex-wrap">
        <div ref={view} className="pg-cv-view" role="region" aria-label="Playground" tabIndex={0}
          onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up} onClickCapture={click} onKeyDown={key}>
          <div className="pg-cv-item pg-say" ref={put('say')} style={pos('say')}>
            <p className="pg-anat" data-at={show} onPointerLeave={() => setHv(null)}>
              {PARTS.map(([t], i) => (
                <span key={t} className="pg-g">
                  <button type="button" className={'pg-ph' + (show === i ? ' on' : '') + (show === 3 ? ' all' : '')} onClick={() => pick(i)} onPointerEnter={peek(i)} aria-pressed={sel === i}>{t}</button>{i === 0 ? ',' : i === 1 ? ', and' : ''}
                </span>
              ))}{' '}
              <button type="button" className={'pg-ph' + (show === 3 ? ' on' : '')} onClick={() => pick(3)} onPointerEnter={peek(3)} aria-pressed={sel === 3}>is the whole first request.</button>
            </p>
          </div>
          <div className="pg-cv-item pg-req pg-req-curl" ref={put('curl')} style={pos('curl')}>
            <div className="pg-req-bar"><i /><i /><i /><span className="pg-req-n">curl</span><Copy text={CURL} /></div>
            <div className="pg-req-pane"><p className="pg-req-l">One request</p><pre><code>{marked(CURL, show < 3 ? PARTS[show][1] : null)}<i className="pg-caret" aria-hidden="true" /></code></pre></div>
          </div>
          <div className="pg-cv-item pg-req pg-req-py" ref={put('py')} style={pos('py')}>
            <div className="pg-req-bar"><i /><i /><i /><span className="pg-req-n">python</span><Copy text={PY} /></div>
            <div className="pg-req-pane"><p className="pg-req-l">The Python client</p><pre><code>{marked(PY, show === 3 ? 'HANZO_API_KEY' : null)}</code></pre></div>
          </div>
          {MODES.map((m, i) => {
            const Mini = MINI[i];
            return (
              <div key={m} className="pg-cv-item pg-kind" ref={put('k' + i)} style={pos('k' + i)}>
                <div className="pg-kind-art" aria-hidden="true">
                  {Mini ? <div className="pg-kind-mini"><Mini /></div> : <Img src={`/models/${MODEL[i]}.webp`} alt="" w={1200} h={1500} />}
                </div>
                <p className="pg-kind-n"><span>{m}</span><b>{MODEL[i]}</b></p>
              </div>
            );
          })}
          {MODELS.map(([n, m], i) => (
            <A key={m} to={'/' + m} className="pg-cv-item pg-cv-model" ref={put('m' + i)} style={pos('m' + i)} draggable={false}>
              <Img src={`/models/${m}.webp`} alt="" w={1200} h={1500} />
              <span>{n}</span>
            </A>
          ))}
          {enter && <div className="pg-flip" aria-hidden="true" style={{ '--c': small ? 6 : 10 }}>{Array.from({ length: tiles }).map((_, i) => { const c = small ? 6 : 10, r = Math.floor(i / c), q = i % c; return <i key={i} style={{ '--d': ((r + q) * 45) + 'ms' }} />; })}</div>}
        </div>
      </div>
    </section>
  );
}


/* ---------- every model in the catalog: Hanzo's own model films, together ---------- */
const MODELS = [['Zen', 'zen'], ['Enso', 'enso'], ['Kai', 'kai'], ['Iro', 'iro'], ['Koma', 'koma'], ['Koe', 'koe'], ['Mori', 'mori'], ['Oto', 'oto'], ['Uta', 'uta']];

function Wall() {
  const [ref, live, calm] = useLive(0.3);
  const [paused, pause] = usePause();
  const [at, setAt] = useState(0);
  const [hand, setHand] = useState(false);
  useEffect(() => {
    if (!live || paused || hand || calm) return;
    const t = setTimeout(() => setAt((a) => (a + 1) % MODELS.length), 3600);
    return () => clearTimeout(t);
  }, [live, paused, hand, calm, at]);
  return (
    <div className="pg-wall" ref={ref} onPointerLeave={() => setHand(false)}>
      <LivePause dark paused={paused} onToggle={pause} className="pg-wall-pause" />
      <ul className="pg-wall-grid">
        {MODELS.map(([n, m], i) => (
          <li key={m}>
            <A to={'/' + m} className={'pg-tile' + (i === at ? ' on' : '')}
              onPointerEnter={(e) => { if (e.pointerType === 'mouse') { setHand(true); setAt(i); } }} onFocus={() => setAt(i)}>
              <Img src={`/models/${m}.webp`} alt="" w={1200} h={1500} className="pg-tile-img" data-morph />
              {i === at && live && !calm && !paused && <Film src={`/models/${m}.webm`} poster={`/models/${m}.webp`} w={1200} h={1500} className="pg-tile-film" />}
              <span className="pg-tile-n">{n}</span>
            </A>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* the hero window arrives once in CSS from first paint (so the server frame and the first client frame agree: no snap),
   then eases back a little as the hero leaves */
function HeroStage({ children }) {
  const ref = useRef(null);
  const calm = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 30%', 'end start'] });
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.96]);
  return (
    <div ref={ref} className="pg-stage">
      <motion.div className="pg-stage-in" style={calm ? undefined : { scale }}>{children}</motion.div>
    </div>
  );
}

/* entrance 3, cover-slide: related rides up over the bottom of the canvas */
function Covers({ children }) {
  const ref = useRef(null);
  const enter = useEnter(ref, 0.05);
  return <div ref={ref} className="pg-cover" data-enter={enter || undefined}>{children}</div>;
}
/* entrance 4, scramble: the dark room's words and the model names decode out of scrambled characters */
function Room() {
  const ref = useRef(null);
  const enter = useEnter(ref, 0.3);
  useScramble(ref, '.cf-paste-t, .cf-paste-d, .cf-paste-k, .pg-tile-n', enter === 'in');
  return (
    <section ref={ref} className="lx-dark pg-paste pg-room" data-room="dark" data-enter={enter || undefined}>
      <div className="lx-wrap pg-paste-grid">
        <Paste dark name="Playground" api="/v1/chat/completions" prompt="Read https://hanzo.ai/skill.md and use Hanzo Playground in my project." className="lx-paste" />
        <Wall />
      </div>
    </section>
  );
}
/* entrance 5, swing-door: the close swings in on a vertical hinge at its left edge */
function Door({ children }) {
  const ref = useRef(null);
  const enter = useEnter(ref, 0.2);
  return <div ref={ref} className="pg-door" data-enter={enter || undefined}>{children}</div>;
}

const REL = [['CLI', '/cli'], ['Desktop', '/desktop'], ['API Keys', '/cloud/api-keys']];

export default function Playground() {
  return (
    <main className="lx pg">
      <section className="pg-hero" data-morph-target data-ask-name="Try a model, then ship it">
        <div className="lx-wrap pg-hero-grid">
          <div className="pg-hero-copy">
            <LineMask as="h1" className="lx-display s pg-h1" lines={['Try a model,', 'then ship it']} />
            <p className="lx-body pg-lede">Chat, completions, decisions, embeddings, image, video, audio and vision, against every model in the catalog, with each run's tokens and cost beside the answer.</p>
            <div className="pg-acts">
              <A to={PLAY} className="lx-cta" data-thumb="Open the Playground" data-cta="playground.hero">Open the Playground<Arr /></A>
              <A to="/api" className="lx-ghost">Read the API</A>
            </div>
          </div>
          <HeroStage><Window /></HeroStage>
        </div>
      </section>

      <Explore />

      <Covers><RelatedCards className="pg-rel" items={REL} /></Covers>

      <Room />

      <Door><LaunchClose name="Playground" tag="Hands-on sandbox for every product" seed="playground" data={[8, 3]} ask={['Open the Playground', PLAY]} cta="playground.close" /></Door>
    </main>
  );
}
