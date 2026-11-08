'use client';
/* One Web3 product (/blockchain/<product>, 16 pages, one template), read as a launch.
   Persona: a developer or product team building on chains (Developer). Goal: see what this product does on which
   chains, then get a key. CTA: Hanzo's "Try Hanzo" beside the headline (data-thumb, data-cta="blockchain.key"; the
   site header carries it after the hero), "View Documentation" as a text link. Metric: api_key_created (signup_start).
   First screen: the product's name, claim and lede with its one ask on the left; on the right Hanzo's own "Get Your
   API Key" card (its chains streaming, HA / <50ms / 100+ counting up once) with the product acting itself out on top
   of it, in the server HTML and moving from frame 0: the product's first capabilities are the stations of one lane, a
   block runs through them and lands on a chain its page names, three runs (about 8 s), then it settles (KeyStage.jsx).
   Bundler merges four operations into one block first; Oracle's first station keeps ticking; DeFi runs stake, lend,
   swap, yield in its own order. The exchange (no key card) puts its products up as a console that walks itself.
   Signature: the capabilities as one pinned deck after the hero, one capability at a time: the top card lifts away
   and the next comes forward as you scroll; the marks say where you are, preview a title under the pointer, and jump.
   Beyond: "Your chain". This product's own Supported Chains are pills; pick one and the panel beside it answers at
   once whether this product names it (a tick or a dash) and which other Web3 products do (each a link), cross-fading
   on each pick; every chain Hanzo lists across its Web3 products waits behind one "Show all".
   Motion: idle (the lane, the chain stream, the contour, the Built For walk) · time (the code typing in, the count-up)
   · pointer (magnetic ask, the stream holds under a pointer, the next-product rail tilts 2.5 degrees and drags with
   inertia) · state (the deck, Built For's gliding bar, the chain answer, Show all) · scroll (the deck, the h1 settle).
   V2: 8/10 the ask beside a 52px headline and this product's own capability deck turning in the hero (its contour per card), the key card as a proof room after it, the exchange's console and pinned deck at 25svh a card, chips that drive the chain finder, real controls (hover and press on every one, plain language list, GitHub as a link), no inner scroll on phones, resting sizes, tokens only, no springs or setInterval. */
import { useEffect, useRef, useState } from 'react';
import { useScroll, useMotionValueEvent, useReducedMotion, useInView } from 'motion/react';
import { Copy, Magnetic, useCalm } from '../../ui';
import Sigil from '../../Sigil';
import { A } from '../../kit';
import FamLines from '../../v2/FamLines';
import FamNext from '../../v2/FamNext';
import { ui } from '../../v2/famUi';
import { play } from '../../../lib/sound';
import KeyStage from './KeyStage';
import { Picks, Chains, TiltRail } from './BcParts';
import '../../v2/fam.css';
import './blockchain.css';
import './BlockPage.css';

const GO = { 'Try Hanzo': '/signup', 'View Documentation': 'https://docs.hanzo.ai', 'View Pricing': '/pricing?tab=blockchain' };
const MODE = { bundler: 'merge', oracle: 'tick' }; // how each member acts itself out in the hero (KeyStage)

export function Stream({ chains, label }) {
  if (!chains.length) return null;
  const row = (k) => chains.map((c) => <li key={k + c} aria-hidden={k ? true : undefined}><i className="xb2-blk" aria-hidden="true" /><b>{c}</b></li>);
  return (
    <div className="xbc-stream" aria-label={label}>
      <ul style={{ '--n': chains.length }}>{row('')}{row('b')}</ul>
    </div>
  );
}

/* the code card: file name, Copy, and the SDK languages Hanzo lists as a plain caption (one sample exists, so they are
   not drawn as tabs). Long samples rest at 18 lines (14 on a phone) under a fade, with "Show all" to open the rest;
   lines wrap instead of running off the card. Copy always copies the whole sample. */
const CAP = 18;
export function Code({ file, code, langs }) {
  const [open, setOpen] = useState(false);
  const long = code.lines.length > CAP;
  return (
    <div className={'xbc-code xb3-code' + (long ? ' cap' : '') + (open ? ' open' : '')}>
      <div className="xbc-code-h">
        {file && <span className="x-mono xb3-file">{file}</span>}
        <Copy text={code.text} />
      </div>
      <pre tabIndex={0}><code>{code.lines.map((l, j) => <span key={j} className="xbc-ln">{l.length ? l.map(([k, t], n) => <span key={n} className={'c-' + k}>{t}</span>) : ' '}{'\n'}</span>)}</code></pre>
      {(long || (langs && langs.length > 0)) && (
        <div className="xb3-code-f">
          {langs && langs.length > 0 && <p className="xb3-langs x-mono">{langs.map((l, k) => <span key={l}>{l}{k < langs.length - 1 && <i aria-hidden="true"> / </i>}</span>)}</p>}
          {long && (
            <button type="button" className="xb3-more dark" aria-expanded={open} onClick={() => setOpen(!open)}>
              <span>{ui('oss_show_all')}</span><b className="x-mono">{code.lines.length}</b><i aria-hidden="true" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}

/* this product's own code, typed in once when it reaches the screen: every line is in the HTML from the start (and
   copies whole); the lines light up one after another by class, through refs, never a re-render per line. Reduced
   motion and no-JS show it whole. */
function Typed({ file, code, langs }) {
  const box = useRef(null);
  useEffect(() => {
    const el = box.current;
    if (!el || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const every = [...el.querySelectorAll('.xbc-ln')];
    const lines = every.filter((l) => l.getClientRects().length); // only the lines the capped card shows type in
    every.forEach((l) => { if (!lines.includes(l)) l.classList.add('on'); });
    const r = el.getBoundingClientRect();
    if (r.top < innerHeight && r.bottom > 0) return; // already on screen: leave it whole
    el.classList.add('xb2-type');
    let t = 0;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      let k = 0;
      const step = () => {
        if (k >= lines.length) { el.classList.add('done'); play('done'); return; }
        lines[k].classList.add('on');
        k++;
        t = setTimeout(step, lines[k - 1].textContent.trim() ? 60 : 20);
      };
      step();
    }, { threshold: 0.3 });
    io.observe(el);
    return () => { clearTimeout(t); io.disconnect(); };
  }, []);
  return <div ref={box}><Code file={file} code={code} langs={langs} /></div>;
}

/* ---------- the signature: the deck, one capability at a time ---------- */
/* The capabilities as one pinned deck (desktop): the words stay on the left while the deck on the right shows one
   capability at a time; as you scroll the top card lifts away and the next one comes forward (state changes eased at
   300–500 ms, not a scrub). Marks under the words show where you are, preview a title under the pointer or focus,
   and jump to any card. Phones swipe the same cards one at a time. */
function Deck({ b, seed }) {
  const sec = useRef(null);
  const rail = useRef(null);
  const n = b.items.length;
  const [at, setAt] = useState(0);
  const [peek, setPeek] = useState(-1);
  const { scrollYProgress } = useScroll({ target: sec, offset: ['start start', 'end end'] });
  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    if (!matchMedia('(min-width: 901px)').matches) return;
    const k = Math.max(0, Math.min(n - 1, Math.floor(p * n * 0.999)));
    if (k !== at) setAt(k);
  });
  // phones: the rail itself says which card is in view
  useEffect(() => {
    const el = rail.current;
    if (!el) return;
    const on = () => { if (matchMedia('(max-width: 900px)').matches) setAt(Math.round(el.scrollLeft / Math.max(1, el.firstElementChild ? el.firstElementChild.offsetWidth + 12 : 1))); };
    el.addEventListener('scroll', on, { passive: true });
    return () => el.removeEventListener('scroll', on);
  }, []);
  const jump = (k) => {
    if (matchMedia('(max-width: 900px)').matches) { const el = rail.current; const c = el && el.children[k]; c && el.scrollTo({ left: c.offsetLeft - el.offsetLeft, behavior: 'smooth' }); return; }
    const el = sec.current;
    const top = el.getBoundingClientRect().top + scrollY + ((el.offsetHeight - innerHeight) * (k + 0.5)) / n;
    window.__lenis ? window.__lenis.scrollTo(top, { duration: 1 }) : scrollTo({ top, behavior: 'smooth' });
  };
  const titleId = 'xb2-deck-' + b.title.length;
  const shown = peek >= 0 ? peek : at;
  return (
    <section ref={sec} className="xb2-deckx" style={{ '--n': n }} aria-labelledby={titleId}>
      <noscript><style>{'.xb2-deckx{height:auto}.xb2-deckx-pin{position:static;height:auto}.xb2-cards{display:grid;gap:12px;height:auto}.xb2-card{position:static!important;opacity:1!important;transform:none!important;visibility:visible!important}.xb2-card>*{opacity:1!important}.xb2-marks2,.xb3-peek{display:none}'}</style></noscript>
      <div className="xb2-deckx-pin">
        <div className="v2f-wrap v2f-grid xb2-deckx-g">
          <header className="xb2-deckx-h">
            <FamLines as="h2" id={titleId} play="view" className="v2f-head" text={b.title} />
            {b.lede && <p className="v2f-lede">{b.lede}</p>}
            <div className="xb2-marks2" role="group" aria-label={b.title} onPointerLeave={() => setPeek(-1)}>
              {b.items.map((it, k) => (
                <button key={it.title} type="button" aria-label={it.title + ', ' + ui('chapter') + ' ' + (k + 1) + ' ' + ui('of') + ' ' + n} aria-current={k === at ? 'step' : undefined} className={(k < at ? 'past' : '') + (k === peek ? ' peek' : '')} onClick={() => jump(k)} onPointerEnter={() => setPeek(k)} onFocus={() => setPeek(k)} onBlur={() => setPeek(-1)}><i><b /></i></button>
              ))}
            </div>
            <p className="xb3-peek x-mono" aria-hidden="true"><b>{String(shown + 1).padStart(2, '0')}</b> / {String(n).padStart(2, '0')} <span key={shown}>{b.items[shown].title}</span></p>
          </header>
          <div className="xb2-cards-w">
          <div className="xb2-hd-sig" aria-hidden="true"><Sigil seed={seed + '#' + b.items[at].title} data={[at + 1, n]} /></div>
          <ul ref={rail} className="xb2-cards" data-swipe-own>
            {b.items.map((it, k) => (
              <li key={it.title} className="xb2-card" data-s={k < at ? 'gone' : k === at ? 'on' : k - at < 4 ? 'next' : 'far'} style={{ '--d': Math.max(0, k - at) }}>
                <h3>{it.title}</h3>
                {it.text && <p>{it.text}</p>}
                {it.link && <A to={it.link.href} className="x-arrow"><span>{it.link.label}</span></A>}
              </li>
            ))}
          </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

/* products with their bullets (the exchange): big tiles */
function Tiles({ b }) {
  return (
    <section className="v2f-sec xb2-tiles">
      <div className="v2f-wrap">
        <header className="xb2-sh">
          {b.title && <FamLines as="h2" play="view" className="v2f-head" text={b.title} />}
          {b.lede && <p className="v2f-lede">{b.lede}</p>}
        </header>
        <ul className="xb2-tl">
          {b.items.map((it) => (
            <li key={it.title} className="v2f-card">
              <h3 className="v2f-title">{it.title}</h3>
              {it.text && <p>{it.text}</p>}
              {it.bullets.length > 0 && <ul className="xbc-bul">{it.bullets.map((x) => <li key={x}>{x}</li>)}</ul>}
              {it.link && <A to={it.link.href} className="x-arrow"><span>{it.link.label}</span></A>}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* a product line without a key card (the exchange): its products become the hero object, a console that walks
   through them by itself (pausing when touched); every product's words stay in the page, the others hidden */
function Console({ b, seed }) {
  const calm = useCalm(); // hydration-safe: false until mounted
  const box = useRef(null);
  const [at, setAt] = useState(0);
  const [held, setHeld] = useState(false);
  const [done, setDone] = useState(false);
  const seen = useInView(box, { amount: 0.3 });
  const n = b.items.length;
  // one round through the products, then it settles on the first with the sound kit's quiet 'done'
  useEffect(() => {
    if (calm || held || done || !seen || n < 2) return;
    const t = setTimeout(() => {
      const nx = (at + 1) % n;
      setAt(nx);
      if (nx === 0) { setDone(true); play('done'); }
    }, 3600);
    return () => clearTimeout(t);
  }, [calm, held, done, seen, n, at]);
  const it = b.items[at];
  return (
    <div ref={box} className="xb2-con v2f-obj" onPointerEnter={(e) => e.pointerType === 'mouse' && setHeld(true)} onPointerLeave={() => setHeld(false)}>
      <noscript><style>{'.xb2-con-p[hidden]{display:flex!important}'}</style></noscript>
      <div className="xb2-con-l">
        {seed && <Sigil seed={seed} data={[n]} className="xb2-con-sig" />}
        {b.title && <h2 className="v2f-title xb2-con-h">{b.title}</h2>}
        {b.lede && <p className="xb2-con-lede">{b.lede}</p>}
        <div className="xb2-con-tabs" role="tablist" aria-label={b.title}>
          {b.items.map((x, i) => (
            <button key={x.title} type="button" role="tab" id={'xb2-tab-' + i} aria-controls={'xb2-pan-' + i} aria-selected={i === at} onClick={() => { setAt(i); setHeld(true); }}>
              <b>{x.title}</b>
              {i === at && !calm && !held && !done && <i className="xb2-con-t" aria-hidden="true" />}
            </button>
          ))}
        </div>
      </div>
      <div className="xb2-con-r">
        {b.items.map((x, i) => (
          <div key={x.title} role="tabpanel" id={'xb2-pan-' + i} aria-labelledby={'xb2-tab-' + i} hidden={i !== at} className="xb2-con-p">
            <h3 className="v2f-head">{x.title}</h3>
            {x.text && <p className="v2f-lede">{x.text}</p>}
            {x.bullets.length > 0 && <ul className="xbc-bul xb2-con-b">{x.bullets.map((y) => <li key={y}>{y}</li>)}</ul>}
            {x.link && <A to={x.link.href} className="x-arrow"><span>{x.link.label}</span></A>}
          </div>
        ))}
        <span className="x-sr" aria-live="polite">{it.title}</span>
      </div>
    </div>
  );
}

/* the one ending: the Band in the page's own words, with "Get <product>" (its chips, GitHub, Deploy to Cloud) folded
   in as its last row */
function Band({ b, get }) {
  return (
    <section className="xb2-band xb3-band" data-room="dark" data-ask-hide>
      <div className="v2f-wrap v2f-grid xb2-band-g">
        {b.title ? <h2 className="v2f-display small xb2-band-h">{b.title}</h2> : <span className="xb2-band-h" />}
        <div className="xb2-band-r">
          {b.lede && <p className="v2f-lede">{b.lede}</p>}
          <div className="xb2-acts">{b.links.map((l, k) => <A key={l.href + k} to={l.href} className={'v2f-btn' + (k ? ' ghost' : ' light')} data-cta={k ? 'blockchain.band-second' : 'blockchain.band'}>{l.label}</A>)}{b.buttons.map((t) => <A key={t} to={GO[t] || '/signup'} className="v2f-btn ghost">{t}</A>)}</div>
        </div>
        {get && (
          <div className="xb3-get">
            <div className="xb3-get-t"><h3>{get.title}</h3>{get.text && <p>{get.text}</p>}</div>
            <div className="xb3-get-r">
              {get.chips.map((c) => <span key={c} className="xb3-tag x-mono">{c}</span>)}
              {get.github && <A to={get.github.href} className="x-arrow xb2-gh"><span>{get.github.text}</span></A>}
              {get.deploy && <A to={get.deploy.href} className="v2f-btn ghost" data-cta="blockchain.deploy">{get.deploy.text}</A>}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

const Arrow = () => <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>;

export default function BlockPage({ doc, all }) {
  const h = doc.hero;
  const key = doc.key;
  const chains = doc.chains;
  // the hero's four features repeat the first capabilities word for word on most pages: show them once
  const capText = new Set(doc.blocks.filter((b) => b.items).flatMap((b) => b.items.map((it) => it.title + '|' + it.text)));
  const feats = h.features.filter((f) => !capText.has(f.title + '|' + f.text));
  // no key card: the first list of products with their bullets becomes the hero object
  const conAt = key ? -1 : doc.blocks.findIndex((b) => b.kind === 'items' && b.items.some((it) => it.bullets.length));
  const deckAt = doc.blocks.findIndex((b) => b.kind === 'items' && b.items.length >= 6 && !b.items.some((it) => it.bullets.length));
  // the lane's stations: the product's own first capabilities (the hero's features, else the deck's first cards)
  const stations = (h.features.length ? h.features : deckAt >= 0 ? doc.blocks[deckAt].items : []).map((f) => f.title);
  // the ask sits beside the headline: the hero's own actions, or the key card's two moved up
  const askOf = (list, from) => (list.length > 0 && (
    <div className="xb2-acts">{list.map((a, i) => (i ? <A key={a.label} to={a.href} className="x-arrow xb2-ask2" data-cta={from + '-second'}><span>{a.label}</span><Arrow /></A>
      : <Magnetic key={a.label} strength={0.25}><A to={a.href} className="v2f-btn solid" data-thumb={a.label} data-cta={from}>{a.label}</A></Magnetic>))}</div>
  ));
  const keyActs = key ? key.actions.map((t) => ({ label: t, href: GO[t] || '/signup' })) : [];
  const heroActs = h.actions.length ? askOf(h.actions, 'blockchain.hero') : askOf(keyActs, 'blockchain.key');
  // the products after this one, in the family's order, as cards that open into their page
  const at = all.findIndex((p) => p.slug === doc.slug);
  const next = (at < 0 ? all : [...all.slice(at + 1), ...all.slice(0, at)]).slice(0, 6).map((p) => ({ href: p.href, title: p.name, preview: p.claim, meta: p.chains.slice(0, 3).join(' · '), seed: p.href, data: [p.chains.length] }));
  const get = doc.blocks.find((b) => b.kind === 'get');
  const hasBand = doc.blocks.some((b) => b.kind === 'band');
  const rail = next.length > 0 && (
    <section className="v2f-sec tight xb2-next" aria-label={h.back ? h.back.text : 'Web3'}>
      <div className="v2f-wrap"><TiltRail><FamNext items={next} label={h.back ? h.back.text : 'Web3'} /></TiltRail></div>
    </section>
  );
  return (
    <main className="xbc xb2 v2f">
      <section className={'xb2-hero' + (key || conAt >= 0 ? ' side' : '')} aria-labelledby="xbc-h1">
        <div className="v2f-wrap v2f-grid xb2-hero-g">
          <div className="xb2-hero-t">
            <FamLines as="h1" id="xbc-h1" text={h.title} className={'v2f-display xb2-h1' + (h.title.length > 11 ? ' mid' : '')} data-morph-target />
            {h.claim && <p className="xb2-claim">{h.claim}</p>}
            {h.lede && <p className="v2f-lede xb2-lede">{h.lede}</p>}
            {heroActs}
            {(h.chip || h.back) && (
              <p className="xb2-meta">
                {h.chip && <span className="v2f-kick">{h.chip}</span>}
                {h.back && <A to={h.back.href} className="x-arrow xb2-back"><span>{h.back.text}</span><Arrow /></A>}
              </p>
            )}
          </div>
          {conAt >= 0 && <div className="xb2-hero-o"><Console b={doc.blocks[conAt]} seed={doc.route} /></div>}
          {key && (
            <div className="xb2-hero-o">
              <KeyStage k={key} chains={chains} seed={doc.route} stations={stations} mode={MODE[doc.slug] || 'pass'}
                stream={<Stream chains={chains} label={`${key.title}: ${chains.join(', ')}`} />} />
            </div>
          )}
        </div>
        {feats.length > 0 && (
          <div className="v2f-wrap">
            <ul className="xb2-feat">{feats.map((f) => <li key={f.title}><b>{f.title}</b><span>{f.text}</span></li>)}</ul>
          </div>
        )}
        {key && h.actions.length > 0 && keyActs.length > 0 && <div className="v2f-wrap xb3-keyacts">{askOf(keyActs, 'blockchain.key')}</div>}
      </section>

      {doc.blocks.map((b, i) => {
        if (i === conAt) return null;
        if (b.kind === 'items') {
          if (i === deckAt) return <Deck key={i} b={b} seed={doc.route} />;
          if (b.items.some((it) => it.bullets.length)) return <Tiles key={i} b={b} />;
          return <Picks key={i} b={b} />;
        }
        if (b.kind === 'code') return (
          <section key={i} className={'v2f-sec xb2-int' + (b.title || b.lede || b.items.length ? '' : ' solo')}>
            <div className="v2f-wrap v2f-grid">
              <header className="xb2-int-h">
                {b.title && <FamLines as="h2" play="view" className="v2f-head" text={b.title} />}
                {b.lede && <p className="v2f-lede">{b.lede}</p>}
                {b.items.length > 0 && <ul className="xb2-int-i">{b.items.map((it) => <li key={it.title}><b>{it.title}</b>{it.text && <span>{it.text}</span>}</li>)}</ul>}
              </header>
              <div className="xb2-code"><Typed file={b.file} code={b.code} langs={b.langs} /></div>
            </div>
          </section>
        );
        if (b.kind === 'chains') return <Chains key={i} b={b} all={all} self={doc.slug} seed={doc.route} />;
        if (b.kind === 'band') return <div key={i}>{rail}<Band b={b} get={get} /></div>;
        if (b.kind === 'get' && !hasBand) return <Band key={i} b={{ title: '', lede: '', links: [], buttons: [] }} get={b} />;
        return null;
      })}
      {!hasBand && rail}
    </main>
  );
}
