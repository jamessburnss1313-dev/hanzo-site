'use client';
/* Referrals.
   Persona: a builder already on Hanzo who wants to bring a friend or teammate. Goal: get their referral link.
   CTA: "Get your link" (/signup?next=/referral; data-cta referral.hero, referral.flow, referral.close; thumb).
   Metric: signup_start.
   Signature (motion map: one-question): How it works, one question at a time. Each of Hanzo's four step sentences gets
   its own screen with its drawing; Next slides to the following one (or swipe on touch), and the answer builds beside
   it as a summary: your link, then each step as it is done. The last one hands over to "Get your link" (a link to the
   signup page; nothing is submitted).
   Entrances (motion map, in page order): 1 hero: slot-roll (the h1's words roll into place like reels); 2 the
   question flow: word-shuffle (its words arrive out of order and swap into place); 3 the dark room: cursor-lens (a
   round lens sweeps across the two sentences magnifying them, then follows the pointer); 4 the counts: card-deal
   (three tiles dealt from one deck onto their places); 5 the close: sticky-stack (the card sticks at the top and the
   sign-in line and ask stack over it as you scroll).
   Beyond: the summary that builds as you answer.
   V2: 8/10 motion-map: one-question + slot-roll, word-shuffle, cursor-lens, card-deal, sticky-stack
   Every word is Hanzo's (Next, Previous and Replay from content/ui-strings.json); no figure is invented. */
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useInView, useReducedMotion } from 'motion/react';
import { A, Cta } from '../kit';
import '../v2/ProgramScale.css';
import './Referral.css';

const EASE = [0.16, 1, 0.3, 1];
const SIGNUP = '/signup?next=%2Freferral';
const LOGIN = '/login?next=%2Freferral';
const COUNTS = ['Referred', 'Pending', 'Qualified'];
const STEPS = [
  ['Share it anywhere: every way out carries your link.', 'share'],
  ['An account that signs up through it is yours, once and for good.', 'lock'],
  ['It qualifies with its first metered spend.', 'meter'],
  ['Each one moves you up the beta waitlist.', 'up'],
];
const useIso = typeof window === 'undefined' ? useEffect : useLayoutEffect;

/* Phones: Hanzo's header carries this page's ask in the same words, as it does on desktop (components/Ask.jsx does it
   above 700px; see docs/requests/referral.md). */
function usePhoneHeaderAsk() {
  useEffect(() => {
    const mq = matchMedia('(max-width: 700px)');
    const H = document.documentElement;
    let btn = null, text = '', link = '', io = null;
    const undo = () => {
      io?.disconnect(); io = null;
      if (!btn) return; // only undo what this hook did (on desktop Ask.jsx owns the header)
      btn.textContent = text; btn.setAttribute('href', link); btn.removeAttribute('data-ask-hide'); btn.removeAttribute('data-cta');
      if (H.dataset.ask === 'quiet') delete H.dataset.ask;
      btn = null;
    };
    const start = () => {
      undo();
      const own = document.querySelector('main [data-cta="referral.hero"]');
      const ends = [...document.querySelectorAll('main [data-cta="referral.close"], main [data-cta="referral.flow"]')];
      if (!mq.matches || !own) return;
      btn = document.querySelector('header[data-slot=masthead] a[data-x-ask], header[data-slot=masthead] a[href="https://hanzo.ai/signup"]');
      if (!btn) return;
      text = btn.dataset.xAsk || btn.textContent; link = btn.dataset.xHref || btn.getAttribute('href');
      const label = own.getAttribute('data-thumb'), href = own.getAttribute('href');
      const vis = new Map();
      // the hero's ask on screen: quiet "Try Hanzo"; past it: solid "Get your link"; another "Get your link" on screen:
      // quiet "Get your link" (one solid fill at a time, as Ask.jsx does on desktop)
      io = new IntersectionObserver((list) => {
        if (!btn) return;
        list.forEach((e) => vis.set(e.target, e.isIntersecting));
        if (vis.get(own)) { H.dataset.ask = 'quiet'; btn.textContent = text; btn.setAttribute('href', link); btn.removeAttribute('data-ask-hide'); btn.removeAttribute('data-cta'); return; }
        btn.textContent = label; btn.setAttribute('href', href); btn.setAttribute('data-ask-hide', ''); btn.setAttribute('data-cta', 'header-ask');
        if (ends.some((e) => vis.get(e))) H.dataset.ask = 'quiet'; else delete H.dataset.ask;
      }, { rootMargin: '-60px 0px 0px 0px' });
      io.observe(own);
      ends.forEach((e) => io.observe(e));
    };
    // Ask.jsx restores the header on its own schedule after a route change, so set up again a few times
    const ts = [300, 1500, 3200].map((ms) => setTimeout(start, ms));
    mq.addEventListener('change', start);
    return () => { ts.forEach(clearTimeout); mq.removeEventListener('change', start); undo(); };
  }, []);
}

/* Runs `fn` once when the element is well inside the screen. */
function useEnter(ref, fn, amount = 0.35) {
  const seen = useInView(ref, { once: true, amount });
  const done = useRef(false);
  useEffect(() => { if (seen && !done.current) { done.current = true; fn(); } }, [seen]); // eslint-disable-line react-hooks/exhaustive-deps
  return seen;
}

/* ---------- 1. slot-roll: each word of the h1 rolls down through a reel of the page's own words and stops ---------- */
function Slot({ word, n }) {
  // the reel above the word is drawn by CSS (::before, from data-reel), so the h1's text stays exactly Hanzo's
  const reel = [COUNTS[(n + 2) % 3], COUNTS[(n + 1) % 3], COUNTS[n % 3]].join('\n');
  return <span className="xrf-slot" style={{ '--n': n }}><span className="xrf-slot-i" data-reel={reel}>{word}</span></span>;
}
function SlotH1() {
  let n = 0;
  const line = (s) => s.split(' ').map((w, i, a) => <span key={w + i}><Slot word={w} n={n++} />{i < a.length - 1 ? ' ' : ''}</span>);
  return (
    <h1 id="xrf-h1" className="xp-display md xrf-h1">
      <span className="xrf-h1-l">{line('Bring a builder')}</span> <span className="xrf-h1-l">{line('to Hanzo.')}</span>
    </h1>
  );
}

/* hanzo.ai's own signed-out card. One builder rides in from the link, once, and lands in each count in turn.
   `rest`: already landed (the close); `small`: the close's size. */
function Card({ onCopy, rest, small }) {
  const calm = useReducedMotion() || rest;
  const [at, setAt] = useState(calm ? 3 : -1);
  const [nudge, setNudge] = useState(0);
  useEffect(() => {
    if (calm) { setAt(3); return; }
    const t = [1500, 2700, 3900, 5100].map((ms, i) => setTimeout(() => setAt(i), ms));
    return () => t.forEach(clearTimeout);
  }, [calm]);
  return (
    <div className={'xrf-win xp-obj' + (small ? ' small' : '')} data-slot={small ? undefined : 'referral'}>
      <div className="xrf-win-top"><i /><i /><i /><span className="x-mono">Your referral link</span></div>
      <div className="xrf-win-in">
        <div className={'xrf-link' + (at >= 0 ? ' sent' : '') + (nudge % 2 ? ' nudge' : nudge ? ' nudge2' : '')}>
          <span className="x-mono xrf-url">hanzo.ai/?ref=…</span>
          <button type="button" className="xrf-copy" aria-disabled="true" aria-label="Copy link" aria-describedby="xrf-signin" data-sound="tick" onClick={() => { setNudge((n) => n + 1); onCopy?.(); }}>
            <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><rect x="5" y="5" width="8.5" height="8.5" rx="2" fill="none" stroke="currentColor" strokeWidth="1.4" /><path d="M10.5 3.2V3a.8.8 0 0 0-.8-.8H3a.8.8 0 0 0-.8.8v6.7c0 .44.36.8.8.8h.2" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>
            Copy
          </button>
        </div>
        <div className="xrf-counts" data-at={at}>
          <i className="xrf-rider" aria-hidden="true" data-on={at >= 1 ? '' : undefined} />
          {COUNTS.map((c, i) => (
            <div key={c} className={'xrf-count' + (at === i + 1 || (at === 3 && i === 2) ? ' lit' : '') + (at > i + 1 ? ' past' : '')}><span className="x-mono">—</span><span>{c}</span></div>
          ))}
        </div>
        {!small && <i className="xrf-flow" aria-hidden="true">{[0, 1, 2, 3, 4].map((k) => <b key={k} style={{ '--k': k }} />)}</i>}
        {!small && <p className="xrf-q">An account qualifies with its first metered spend.</p>}
      </div>
    </div>
  );
}

function Hero() {
  const [pulse, setPulse] = useState(0);
  return (
    <section className="xrf-hero" aria-labelledby="xrf-h1">
      <div className="xp-wrap xp-grid">
        <div className="xrf-words">
          <SlotH1 />
          <div className="xrf-rest">
            <p className="xp-lede xrf-lede">One link counts everyone who signs up through it, and who goes on to use Hanzo.</p>
            <div className="xrf-acts">
              <Cta to={SIGNUP} id="referral.hero" thumb className="xp-cta">Get your link</Cta>
              <Cta to={LOGIN} kind="quiet" id="referral.signin" className={'xp-ghost xrf-si' + (pulse ? ' pulse p' + (pulse % 2) : '')}>Sign in</Cta>
            </div>
            <p className="xp-kick plain xrf-cap">Referrals</p>
          </div>
        </div>
        <div className="xrf-card"><Card onCopy={() => setPulse((n) => n + 1)} /></div>
      </div>
    </section>
  );
}

/* ---------- 2. word-shuffle: words arrive out of order and swap into place (FLIP from a shuffled position) ---------- */
function Shuffle({ text, as: Tag = 'span', className, go }) {
  const box = useRef(null);
  const calm = useReducedMotion();
  const ran = useRef(false);
  useIso(() => {
    const el = box.current;
    if (!el || !go || ran.current || calm) return;
    ran.current = true;
    const ws = [...el.querySelectorAll('.xrf-w')];
    const at = ws.map((w) => { const r = w.getBoundingClientRect(); return [r.left, r.top]; });
    const order = ws.map((_, i) => i);
    for (let i = order.length - 1; i > 0; i--) { const j = (i * 7 + 3) % (i + 1); [order[i], order[j]] = [order[j], order[i]]; }
    if (order.every((v, i) => v === i) && order.length > 1) order.push(order.shift());
    ws.forEach((w, i) => {
      const [x, y] = at[order[i]], dx = x - at[i][0], dy = y - at[i][1];
      const d = 120 + order[i] * 70;
      w.animate([
        { transform: `translate(${dx}px, ${dy + 18}px)`, opacity: 0 },
        { transform: `translate(${dx}px, ${dy}px)`, opacity: 1, offset: 0.35 },
        { transform: 'none', opacity: 1 },
      ], { duration: 1000, delay: d, easing: 'cubic-bezier(.16,1,.3,1)', fill: 'backwards' });
    });
  }, [go, calm]);
  const words = text.split(' ');
  return (
    <Tag ref={box} className={className}>
      {words.map((w, i) => <span key={i}><span className="xrf-w">{w}</span>{i < words.length - 1 ? ' ' : ''}</span>)}
    </Tag>
  );
}

/* The four steps' drawings, wordless. The needle turns on the hub (200, 220) in viewBox units. */
function Scene({ k }) {
  const draw = (d = 0) => ({ initial: { pathLength: 0 }, animate: { pathLength: 1 }, transition: { duration: 0.8, ease: EASE, delay: d } });
  return (
    <svg viewBox="0 0 400 280" className="xrf-scene" aria-hidden="true">
      {k === 'share' && <g>
        <rect x="30" y="122" width="132" height="36" rx="18" className="xrf-s-pill" />
        <text x="96" y="146" textAnchor="middle" className="xrf-s-mono">?ref=…</text>
        {Array.from({ length: 9 }, (_, i) => { const y = 24 + i * 29; return <g key={i}>
          <motion.path d={`M162 140 C 230 140, 240 ${y}, 330 ${y}`} className="xrf-s-line" {...draw(0.07 * i)} />
          <motion.circle cx="336" cy={y} r="6" className="xrf-s-dot" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.3, ease: EASE, delay: 0.5 + 0.07 * i }} />
        </g>; })}
      </g>}
      {k === 'lock' && <g>
        <motion.path d="M20 140H288" className="xrf-s-line thick" {...draw(0.3)} />
        <motion.g initial={{ x: 80 }} animate={{ x: 0 }} transition={{ duration: 0.9, ease: EASE }}>
          <circle cx="318" cy="140" r="30" className="xrf-s-ink" />
          <circle cx="318" cy="132" r="9" className="xrf-s-hole" />
          <path d="M302 160a16 12 0 0 1 32 0" className="xrf-s-hole" />
        </motion.g>
        <rect x="134" y="118" width="44" height="40" rx="6" className="xrf-s-paper" />
        <motion.path d="M145 130v-8a11 11 0 0 1 22 0v8M139 130h34v24h-34z" className="xrf-s-line" {...draw(0.9)} />
      </g>}
      {k === 'meter' && <g>
        <path d="M80 220a120 120 0 0 1 240 0" className="xrf-s-track" />
        <motion.path d="M80 220a120 120 0 0 1 240 0" className="xrf-s-line thick" {...draw(0)} />
        {[0, 1, 2, 3, 4, 5, 6].map((i) => { const a = Math.PI - (i / 6) * Math.PI; return <path key={i} d={`M${200 + Math.cos(a) * 104} ${220 - Math.sin(a) * 104}L${200 + Math.cos(a) * 92} ${220 - Math.sin(a) * 92}`} className="xrf-s-tick" />; })}
        <g className="xrf-s-swing"><path d="M200 220V128" className="xrf-s-needle" /></g>
        <circle cx="200" cy="220" r="8" className="xrf-s-ink" />
      </g>}
      {k === 'up' && <g>
        {[0, 1, 2, 3, 4, 5].map((i) => <rect key={i} x="90" y={28 + i * 40} width="220" height="28" rx="14" className="xrf-s-bar" />)}
        <motion.rect x="90" width="220" height="28" rx="14" className="xrf-s-ink" initial={{ y: 228 }} animate={{ y: 68 }} transition={{ duration: 1.4, ease: EASE, delay: 0.3 }} />
        <motion.path d="M340 220V80M330 92l10-12 10 12" className="xrf-s-line" {...draw(0.3)} />
      </g>}
    </svg>
  );
}

/* ---------- Signature: How it works, one question at a time, with the answer summarised as it builds ---------- */
function Flow() {
  const box = useRef(null);
  const calm = useReducedMotion();
  const [go, setGo] = useState(false);
  useEnter(box, () => setGo(true), 0.3);
  const [i, setI] = useState(0);
  const [done, setDone] = useState(calm ? 4 : 0); // how many steps the summary holds
  const sx = useRef(null);
  const to = (n) => { const m = Math.max(0, Math.min(3, n)); setI(m); setDone((d) => Math.max(d, m)); };
  const next = () => { if (i === 3) setDone(4); else to(i + 1); };
  const replay = () => { setI(0); setDone(0); };
  const last = i === 3 && done === 4;
  return (
    <section className="xp-sec xrf-flow-s" ref={box} aria-labelledby="xrf-how-h">
      <div className="xp-wrap">
        <Shuffle as="h2" text="How it works" className="xp-head xrf-how-h" go={go} />
        <div className="xrf-qa">
          <div className="xrf-ask-box" onPointerDown={(e) => { sx.current = e.clientX; }}
            onPointerUp={(e) => { if (sx.current == null) return; const dx = e.clientX - sx.current; sx.current = null; if (Math.abs(dx) > 50) (dx < 0 ? next() : to(i - 1)); }}>
            <div className="xrf-slides" style={{ transform: `translateX(${-i * 100}%)` }}>
              {STEPS.map(([t, k], n) => (
                <div key={k} className={'xrf-slide' + (n === i ? ' on' : '')} aria-hidden={n !== i} inert={n !== i || undefined}>
                  <span className="xp-count">{String(n + 1).padStart(2, '0')} / 04</span>
                  {n === 0 ? <Shuffle as="h3" text={t} className="xrf-qt" go={go} /> : <h3 className="xrf-qt">{t}</h3>}
                  <div className="xrf-qart">{(n === i && go) || calm ? <Scene key={`${k}${done}`} k={k} /> : <svg viewBox="0 0 400 280" className="xrf-scene" aria-hidden="true" />}</div>
                </div>
              ))}
            </div>
            <div className="xrf-qnav">
              <button type="button" className="xrf-qbtn ghost" onClick={() => to(i - 1)} disabled={i === 0} data-sound="tick">Previous</button>
              {last
                ? <>
                    <button type="button" className="xrf-qbtn ghost" onClick={replay} data-sound="tick">Replay</button>
                    <Cta to={SIGNUP} id="referral.flow" className="xp-cta">Get your link</Cta>
                  </>
                : <button type="button" className="xrf-qbtn" onClick={next} data-sound="tick">Next</button>}
            </div>
          </div>
          <aside className="xrf-sum" aria-live="polite">
            <span className="x-mono xrf-sum-k">Your referral link</span>
            <span className="x-mono xrf-sum-pill">hanzo.ai/?ref=…</span>
            <ol className="xrf-sum-list">
              {STEPS.map(([t, k], n) => (
                <li key={k} className={n < done ? 'on' : ''} aria-hidden={n >= done}>
                  <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M3.5 8.5l3 3 6-7" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  <span className="xrf-n x-mono">{String(n + 1).padStart(2, '0')}</span>
                  <span>{t}</span>
                </li>
              ))}
            </ol>
          </aside>
        </div>
      </div>
    </section>
  );
}

/* ---------- 3. cursor-lens: a round lens sweeps across the dark room's sentences magnifying them, then follows the
   pointer (fine pointers). The lens is an aria-hidden copy of the words, scaled 1.5x inside a circle. ---------- */
function Which() {
  const box = useRef(null);
  const stage = useRef(null);
  const calm = useReducedMotion();
  const [on, setOn] = useState(false);
  const raf = useRef(0);
  const put = (x, y, r) => { const s = stage.current; if (!s) return; s.style.setProperty('--lx', x + 'px'); s.style.setProperty('--ly', y + 'px'); s.style.setProperty('--lr', r + 'px'); };
  useEnter(box, () => {
    setOn(true);
    const s = stage.current; if (!s || calm) return;
    const w = s.offsetWidth, h = s.offsetHeight, t0 = performance.now(), D = 1700;
    s.classList.add('lens');
    const tick = (t) => {
      const k = Math.min(1, (t - t0) / D), e = 1 - Math.pow(1 - k, 3);
      const r = k < 0.85 ? Math.min(110, 110 * k / 0.15) : 110 * (1 - (k - 0.85) / 0.15);
      put(w * (0.04 + 0.92 * e), h * (0.3 + 0.25 * Math.sin(k * Math.PI)), r);
      if (k < 1) raf.current = requestAnimationFrame(tick); else s.classList.remove('lens');
    };
    raf.current = requestAnimationFrame(tick);
  });
  useEffect(() => () => cancelAnimationFrame(raf.current), []);
  const fine = () => typeof window !== 'undefined' && matchMedia('(hover: hover) and (pointer: fine)').matches;
  const move = (e) => { if (calm || !fine()) return; const r = stage.current.getBoundingClientRect(); stage.current.classList.add('lens'); put(e.clientX - r.left, e.clientY - r.top, 96); };
  const leave = () => stage.current?.classList.remove('lens');
  const seen = on;
  const words = (link) => <>
    <span className="xrf-half a">A referral pays nothing. </span>
    <span className="xrf-half b">{link ? <A to="/affiliate">Affiliates</A> : <u>Affiliates</u>} are paid on what their referrals spend.</span>
  </>;
  return (
    <section className="xp-sec xp-dark xrf-which" data-room="dark" ref={box} aria-labelledby="xrf-which-h">
      <div className="xp-wrap">
        <div className="xrf-lens-stage" ref={stage} onPointerMove={move} onPointerLeave={leave}>
          <h2 id="xrf-which-h" className="xp-display sm xrf-which-h">{words(true)}</h2>
          <div className="xrf-lens" aria-hidden="true"><div className="xp-display sm xrf-which-h">{words(false)}</div></div>
        </div>
        <div className={'xrf-tracks' + (seen ? ' on' : '')} aria-hidden="true">
          <div className="xrf-track a"><i className="xrf-fill" />{[0, 1, 2].map((k) => <b key={k} style={{ '--k': k }} />)}<em /></div>
          <div className="xrf-track b"><i className="xrf-fill" />{[0, 1, 2].map((k) => <b key={k} style={{ '--k': k }} />)}<em /></div>
        </div>
      </div>
    </section>
  );
}

/* ---------- 4. card-deal: the three counts are dealt from one deck onto their places ---------- */
function Deal() {
  const box = useRef(null);
  const row = useRef(null);
  const calm = useReducedMotion();
  useEnter(row, () => {
    const el = row.current; if (!el || calm) return;
    const tiles = [...el.children], R = el.getBoundingClientRect();
    const deckX = R.left + R.width / 2, deckY = R.bottom + 40;
    tiles.forEach((t, i) => {
      const r = t.getBoundingClientRect();
      const dx = deckX - (r.left + r.width / 2), dy = deckY - (r.top + r.height / 2);
      t.animate([
        { transform: `translate(${dx}px, ${dy}px) rotate(${-8 + i * 3}deg)`, opacity: 0 },
        { transform: `translate(${dx}px, ${dy}px) rotate(${-8 + i * 3}deg)`, opacity: 1, offset: 0.15 },
        { transform: `translate(0, -10px) rotate(${(i - 1) * 2}deg)`, offset: 0.8 },
        { transform: 'none' },
      ], { duration: 900, delay: 200 + i * 220, easing: 'cubic-bezier(.4,0,.2,1)', fill: 'backwards' });
    });
  }, 0.85);
  return (
    <section className="xp-sec xrf-deal" ref={box} aria-label="Referred, Pending, Qualified">
      <div className="xp-wrap">
        <div className="xrf-deal-row" ref={row}>
          {COUNTS.map((c, i) => (
            <div key={c} className={'xrf-dcard d' + i}>
              <span className="x-mono">{String(i + 1).padStart(2, '0')}</span>
              <b className="xrf-dash" aria-hidden="true">—</b>
              <span className="xrf-dl">{c}</span>
            </div>
          ))}
        </div>
        <p className="xp-lede xrf-deal-q">An account qualifies with its first metered spend.</p>
      </div>
    </section>
  );
}

/* ---------- 5. sticky-stack: the card sticks at the top, and the sign-in line and the ask stack over it ---------- */
function Close() {
  return (
    <section className="xrf-stack" aria-labelledby="xrf-signin">
      <div className="xp-wrap xrf-stack-in">
        <div className="xrf-sc xrf-sc1"><Card rest small /></div>
        <div className="xrf-sc xrf-sc2">
          <p id="xrf-signin" className="xp-head xrf-signin" role="heading" aria-level="2">Sign in and your link, and everyone it brings, is here.</p>
          <div className="xrf-acts">
            <Cta to={SIGNUP} id="referral.close" className="xp-cta">Get your link</Cta>
            <Cta to={LOGIN} kind="link" id="referral.close-signin">Sign in</Cta>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Referral() {
  usePhoneHeaderAsk();
  return (
    <main className="xp xrf">
      <Hero />
      <Flow />
      <Which />
      <Deal />
      <Close />
    </main>
  );
}
