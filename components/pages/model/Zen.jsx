'use client';
/* Zen: open models, yours to run. v2 launch page (Launch, ink on white, Zen's own film), built to docs/MOTION-MAP.md.
   Signature: particles (Particles form it). Right after the stage, about 900 ink dots assemble into Zen's own picture,
   the sphere over its turning rings; the pointer pushes them apart, a tap scatters them, and they re-form.
   Entrances: diagonal-wipe, letter-cascade, tilt-3d-hover, glitch-in, focus-pull-scroll (the signature room, the
   reasoning room, the three parts, the family tiles, Hanzo's model cards; each page-local, in that order).
   Order: stage, particles + figures, the reasoning room, the parts, the family, the model cards, the band; no pinned
   chapter scene. The reasoning trace stays: Zen thinks out loud about which Zen to run, lighting the card rows it reads.
   Beyond: the trace is a chooser built only from Zen's own facts (local use, video, price), and the family tiles
   below lead to every Zen model, Zen 7 and Zen 6 Max with each one's living sigil.
   V2: 7/10 motion-map build: particles signature, five page-local entrances, own section order, no pinned chapters */
import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { Magnetic } from '../../ui';
import { A, More, Cta, Img, Stat } from '../../kit';
import Sigil from '../../Sigil';
import useScheme from './scheme';
import { arrows } from './live';
import { play } from '../../../lib/sound';
import Launch, { Lines, lerp, film } from '../../v2/Launch';
import ModelCards from './ModelCards';
import ModelFilm, { usePaused } from '../../v2/ModelFilm';
import Swarm from './zen/Swarm';
import { useEnter, Letters } from './zen/enter';
import './Zen.css';

const CARDS = [
  { name: 'Zen 6 Flash', code: 'zen6-flash', desc: 'The compact build of Zen 6, for local and low-cost use.', size: 'Packed ternary, 5.95 GB', mods: 'Text and images', wb: 'https://platform.hanzo.ai/workbench?model=zen6-flash' },
  { name: 'Zen 6', code: 'zen6', desc: 'The open-weight flagship for agentic coding and multimodal work.', size: '27.3B dense', mods: 'Text, images and video', wb: 'https://platform.hanzo.ai/workbench?model=zen6' },
];
// each step reads one row of a card: [card, row, words, verdict]. Every word is Hanzo's own card copy (no composed
// sentences); every need has three steps, so the trace keeps one fixed height and never moves the page.
const NEEDS = [
  { tab: 'Open weights', steps: [
    [0, 'desc', CARDS[0].desc, 'yes'],
    [0, 'size', CARDS[0].size],
    [0, 'mods', CARDS[0].mods],
  ], pick: [0] },
  { tab: CARDS[1].mods, steps: [
    [0, 'mods', CARDS[0].mods, 'no'],
    [1, 'mods', CARDS[1].mods, 'yes'],
    [1, 'desc', CARDS[1].desc],
  ], pick: [1] },
  { tab: CARDS[0].size, steps: [
    [1, 'size', CARDS[1].size, 'no'],
    [0, 'size', CARDS[0].size, 'yes'],
    [0, 'desc', CARDS[0].desc],
  ], pick: [0] },
];

function Console() {
  const box = useRef(null);
  const seen = useInView(box, { amount: 0.3 });
  const calm = useReducedMotion();
  const paused = usePaused();
  const [n, setN] = useState(0);
  const [step, setStep] = useState(9); // the server shows a finished trace; the browser replays it
  const [mine, setMine] = useState(false);
  const need = NEEDS[n];
  const len = need.steps.length;
  const done = step > len;
  useEffect(() => { if (!calm) setStep(0); }, []); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (calm || paused || (!seen && !mine)) return;
    if (step <= len) { const t = setTimeout(() => setStep(step + 1), step === 0 ? 700 : 1500); return () => clearTimeout(t); }
    if (!mine) { const t = setTimeout(() => { setN((n + 1) % NEEDS.length); setStep(0); }, 3600); return () => clearTimeout(t); }
  }, [paused, step, seen, calm, n, mine, len]);
  const pick = (i) => { setMine(true); setN(i); setStep(calm ? 9 : 0); };
  useEffect(() => { if (step === len + 1 && seen) play('done'); }, [step, len, seen]); // the trace lands its answer: a faint settle (shared sound kit)
  const cur = step >= 1 && step <= len ? need.steps[step - 1] : null;
  const lit = (ci, row) => {
    if (cur && (cur[0] === ci || cur[0] === -1) && cur[1] === row) return 'on';
    const past = need.steps.slice(0, Math.min(step, len)).find((s) => (s[0] === ci || s[0] === -1) && s[1] === row);
    return past ? (past[3] === 'no' ? 'no' : 'seen') : undefined;
  };
  return (
    <div className="ze-console mb-panel" ref={box}>
      <div className="ze-trace">
        <div className="ze-tabs" role="tablist" aria-label="Zen" onKeyDown={arrows}>
          {NEEDS.map((k, i) => <button key={k.tab} type="button" role="tab" aria-selected={i === n} className="mb-chip" onClick={() => pick(i)}><Letters text={k.tab} from={i * 4} /></button>)}
        </div>
        <p className="ze-think" aria-hidden="true"><span className="ze-dot" data-on={!done ? '' : undefined} /><span className="ze-dots" data-on={!done && step > 0 ? '' : undefined}><i /><i /><i /></span></p>
        {/* every slot is in the DOM from the start at a fixed height; a step fills its slot by opacity and transform only */}
        <ol className="ze-steps" aria-live={mine ? 'polite' : 'off'} key={n}>
          {need.steps.map((s, i) => (
            <li key={i} data-v={s[3]} data-in={i < Math.min(step, len) ? '' : undefined} aria-hidden={i < Math.min(step, len) ? undefined : 'true'}>
              <span className="ze-n mb-tnum">{String(i + 1).padStart(2, '0')}</span>
              <span>{s[2]}</span>
            </li>
          ))}
        </ol>
        <p className="ze-answer" data-in={done ? '' : undefined} aria-hidden={done ? undefined : 'true'}>
          {need.pick.map((ci) => <code key={ci}>{CARDS[ci].code}</code>)}
        </p>
        <button type="button" className="ze-step" onClick={() => { setMine(true); setStep(step > len ? 0 : step + 1); }}>{step > len ? 'Replay' : 'Next'}</button>
      </div>
      <ul className="ze-cards">
        {CARDS.map((c, ci) => (
          <li key={c.code} className="ze-card" data-pick={done && need.pick.includes(ci) ? '' : undefined}>
            <div className="ze-card-h"><h3><Letters text={c.name} from={8 + ci * 6} /></h3><code>{c.code}</code></div>
            <p className="ze-row ze-price mb-tnum" data-l={lit(ci, 'price')}><b>$2.28</b> <span>in · per 1M tokens</span> <b>$7.26</b> <span>out</span></p>
            <p className="ze-row" data-l={lit(ci, 'desc')}>{c.desc}</p>
            <p className="ze-specs">
              <span className="ze-row" data-l={lit(ci, 'size')}>{c.size}</span>
              <span className="ze-row" data-l={lit(ci, 'mods')}>{c.mods}</span>
              <span className="ze-row" data-l={lit(ci, 'open')}>Open weights</span>
            </p>
            <p className="ze-acts">
              <A to={c.wb} className="ze-l">Open in Workbench</A>
              <A to="https://github.com/zenlm" className="ze-l">Docs on GitHub</A>
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}

const FAMILY = [
  ['/zen/models', 'Every Zen model', 'The complete Zen API catalog', [18, 2, 0.01]],
  ['/zen/7', 'Zen 7', 'Zen 7, the next open-weight generation. Apply for research access.', [7, 2.0]],
  ['/zen/zen6-max', 'Zen 6 Max', 'Built for the hardest work: deep reasoning, long context, and code.', [3.7, 9216, 5760]],
];

// the film closes into an arch: a window onto Zen's sphere
const ARCH = (t, W, H, wide) => {
  const w = wide ? Math.min(W * 0.32, H * 0.64) : Math.min(W * 0.62, H * 0.36);
  const h = wide ? H * 0.82 : H * (H < 740 ? 0.38 : 0.44); // short phones: leave the settled headline clear of the arch
  const l = wide ? W * 0.6 : (W - w) / 2, top = wide ? (H - h) / 2 : H * 0.05;
  const a = lerp(0, w / 2, t).toFixed(1), b = lerp(0, 16, t).toFixed(1);
  return `inset(${lerp(0, top, t).toFixed(1)}px ${lerp(0, W - l - w, t).toFixed(1)}px ${lerp(0, H - top - h, t).toFixed(1)}px ${lerp(0, l, t).toFixed(1)}px round ${a}px ${a}px ${b}px ${b}px)`;
};

// a chapter's picture: Zen's film with a model card on it
function CardArt({ ci, open, z, on }) {
  const c = CARDS[ci];
  return (
    <div className={'ze-art' + (open ? ' ze-art-sig' : '')} style={{ '--z': z }}>
      {open ? <Sigil seed="/zen/open-weights" data={[6, 27.3, 5.95]} className="ze-sigart" /> : <>
        <Img src={film('zen', 'webp')} w={1200} h={1500} />
        <ModelFilm slug="zen" play={on} />
      </>}
      {open ? (
        <div className="ze-open" aria-hidden="true">
          {CARDS.map((k) => <p key={k.code}><code>{k.code}</code><span>{k.name}</span></p>)}
        </div>
      ) : (
        <div className="ze-mcard" aria-hidden="true">
          <p className="ze-mcard-h"><b>{c.name}</b><code>{c.code}</code></p>
          <p className="ze-mcard-big mb-tnum">{c.size}</p>
          <p className="ze-mcard-m">{c.mods}</p>
        </div>
      )}
    </div>
  );
}

const cardBody = (c) => (
  <>
    <p>{c.desc}</p>
    <p className="ze-ch-specs"><span>{c.mods}</span></p>
    <p><More to={c.wb}>Open in Workbench</More></p>
  </>
);
const CHAPTERS = [
  { k: 'Open weights', title: 'Open weights', art: (on) => <CardArt open z={1.1} on={on} />, body: <><p>Download the weights, or call them on Hanzo Cloud.</p><p><More to="https://github.com/zenlm">Docs on GitHub</More></p></> },
  { k: CARDS[0].name, title: CARDS[0].name, art: (on) => <CardArt ci={0} z={1.35} on={on} />, body: cardBody(CARDS[0]) },
  { k: CARDS[1].name, title: CARDS[1].name, art: (on) => <CardArt ci={1} z={1.7} on={on} />, body: cardBody(CARDS[1]) },
];

// entrance 3, tilt-3d-hover: the three parts arrive tipped back in depth and level out one after another; then each
// tilts toward a fine pointer (2.5° at most) and settles flat when it leaves. No pinned chapter scene on /zen.
function Part({ c, i }) {
  const ref = useRef(null);
  const seen = useInView(ref, { amount: 0.35 });
  const tilt = (e) => {
    if (e.pointerType !== 'mouse' || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const r = ref.current.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
    ref.current.style.setProperty('--rx', (-y * 5).toFixed(2) + 'deg');
    ref.current.style.setProperty('--ry', (x * 5).toFixed(2) + 'deg');
  };
  const flat = () => { ref.current.style.setProperty('--rx', '0deg'); ref.current.style.setProperty('--ry', '0deg'); };
  return (
    <article ref={ref} className="ze-part" style={{ '--d': i }} onPointerMove={tilt} onPointerLeave={flat}>
      <div className="ze-part-art">{c.art(seen)}</div>
      <h3>{c.title}</h3>
      <div className="ze-part-b">{c.body}</div>
    </article>
  );
}

function Parts() {
  const [ref, inn] = useEnter(0.2);
  return (
    <section ref={ref} className="lv-sec ze-parts ze-e-tilt" data-in={inn ? '' : undefined} aria-label="Zen">
      <div className="x-wrap ze-parts-g">
        {CHAPTERS.map((c, i) => <Part key={c.title} c={c} i={i} />)}
      </div>
    </section>
  );
}

// entrance 1, diagonal-wipe: the signature room arrives behind a diagonal clip that sweeps from left to right
function SwarmRoom() {
  const [ref, inn] = useEnter(0.2);
  return (
    <section ref={ref} className="lv-sec ze-swarm ze-e-wipe" data-in={inn ? '' : undefined} aria-label="Zen 6 Flash, Zen 6">
      <div className="x-wrap ze-swarm-g">
        <div className="ze-swarm-art"><Swarm label="Zen" /></div>
        <div className="lv-stats ze-figs">
          <Stat value="5.95 GB" label={CARDS[0].name} />
          <Stat value="27.3B" label={CARDS[1].name} />
          <Stat value="$2.28" label="in · per 1M tokens" note="$7.26 out" />
        </div>
      </div>
    </section>
  );
}

// entrance 2, letter-cascade: the reasoning room's tab names and card names fall into place letter by letter
function TraceRoom() {
  const [ref, inn] = useEnter(0.25);
  return (
    <section ref={ref} className="lv-sec ze-live ze-e-letters" data-room="dark" data-in={inn ? '' : undefined} aria-label="Zen">
      <div className="x-wrap">
        <Console />
      </div>
    </section>
  );
}

// entrance 4, glitch-in: the family tiles arrive through a short monochrome glitch, then hold still
function Family() {
  const [ref, inn] = useEnter(0.3);
  const scheme = useScheme(); // the fields' ink follows the page: re-keyed so they redraw on a device switch
  return (
    <section ref={ref} className="lv-sec ze-family ze-e-glitch" data-in={inn ? '' : undefined} aria-label="The Zen family">
      <div className="x-wrap">
        <ul className="ze-fam">
          {FAMILY.map(([to, name, line, data], i) => (
            <li key={to} className={i === 0 ? 'big' : ''} style={{ '--d': i }}>
              <A to={to} className="ze-fam-a" data-cursor="">
                <Sigil key={scheme} seed={to} data={data} className="ze-sig" />
                <span className="ze-fam-n" data-morph>{name}</span>
                <span className="ze-fam-d">{line}</span>
                <svg className="ze-fam-go" viewBox="0 0 16 16" width="18" height="18" aria-hidden="true"><path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </A>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

// entrance 5, focus-pull-scroll: Hanzo's model cards come into focus as they scroll in (blur 4px to 0, scale 1.03 to
// 1, tied to the scroll; the page's one blur)
function FocusPull({ children }) {
  const ref = useRef(null);
  const calm = useReducedMotion();
  const [still, setStill] = useState(false); // read after mount: the server cannot know, so first render matches it
  useEffect(() => setStill(!!calm), [calm]);
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ['start end', 'start 0.35'] });
  const blur = useTransform(p, [0, 1], ['blur(4px)', 'blur(0px)']);
  const scale = useTransform(p, [0, 1], [1.03, 1]);
  const op = useTransform(p, [0, 0.6], [0.55, 1]);
  return <motion.div ref={ref} className="ze-e-focus" style={still ? { filter: 'none', scale: 1, opacity: 1 } : { filter: blur, scale, opacity: op }}>{children}</motion.div>;
}

// keyboard: focus entering the settled headline's links scrolls the stage to its settled point, so they show
const settleTo = () => {
  const s = document.querySelector('.lv-stage[data-hero="zen"]');
  if (!s || innerWidth <= 900) return;
  const end = s.getBoundingClientRect().top + scrollY + s.offsetHeight - innerHeight;
  if (scrollY < end - 2) scrollTo({ top: end, behavior: 'instant' });
};

export default function Zen() {
  return (
    <Launch
      slug="zen"
      ask={{ label: 'Try Hanzo', to: '/login', id: 'zen.first' }}
      shape={ARCH}
      aim={(W, H, wide) => (wide ? null : [-0.24 * W, -0.21 * H])}
      headClass="ze-head"
      head={
        <>
          <Lines id="ze-h" lines={['Open models.', 'Yours to run.']} />
          <p className="lv-lede">The open-weight family behind Hanzo. Download the weights, or call them on Hanzo Cloud.</p>
          <div className="lv-acts" onFocus={settleTo}>
            <Cta kind="quiet" to="/login" id="zen.hero">Try Hanzo</Cta>
            <Cta to="https://platform.hanzo.ai" kind="link" id="zen.hero-platform">API Platform</Cta>
            <More to="https://github.com/zenlm">Docs on GitHub</More>
          </div>
          <p className="lv-crumb">Hanzo / Zen</p>
        </>
      }
    >
      {/* /zen's own order: the particle signature, then straight into the reasoning room, then the three parts */}
      <SwarmRoom />
      <TraceRoom />
      <Parts />
      <Family />
      <FocusPull><ModelCards slug="zen" /></FocusPull>
      {/* the closing band, page-local: the same words as the kit Band, cut in by line mask (no blur), final with JS off */}
      <section className="x-band ze-band" data-room="dark" aria-label="Zen">
        <div className="x-wrap">
          <Lines reveal lines={['Open models.', 'Yours to run.']} />
          <div className="x-band-act">
            <Magnetic><Cta to="/login" id="zen.band" thumb>Try Hanzo</Cta></Magnetic>
          </div>
        </div>
      </section>
    </Launch>
  );
}
