'use client';
/* Registry, v2 launch page (Cloud 3).
   V2: 8/10 motion-map: zoom-map + tilt-3d-hover (hero window), pendulum (system map), opposite-drift (dark room),
   fold-out (registry console), invert-flash (related capabilities). Second screen: the whole system (Hanzo IAM, acme,
   Builds, the OCI clients, Hanzo Cloud) wired to one registry; scroll zooms into the image's layer stack until it
   fills the screen and its six facts act on it (hover, tap, arrows; walks on by itself). No pinned chapter stage.
   Order: hero → zoom map → dark room → registry console → related → one close with "Get started" and the prompt.
   Signature: a push that asks IAM first. docker push meets a 401 that names Hanzo IAM, a short-lived token travels from
   IAM to the client, the registry checks its signature, the layers go up, and the image lands in the org's repository
   with its cosign signature beside it as an ordinary artifact.
   Beyond: the secret swap. In the dark room, one press deletes the dockerconfigjson secret and wipes in what IAM gives
   instead, row by row (where the credential lives, adding a teammate, someone leaving), in Hanzo's own phrases.
   Persona: Developer. Goal: read the source, then push a first image with an IAM token.
   CTA: "View Source" → https://github.com/hanzoai (data-cta registry.hero, registry.close; the site's sticky ask bar
   carries the same words from data-thumb). Metric: api_key_created.
   Motion: idle = the push (once), the resting caret, the stack's slow float, the building console; pointer = hovering
   (or tapping, on a phone) a step of the push shows that moment, the magnetic ask; state = the secret switch, its rows
   and the struck heading, pause and replay; arrival = the cut-in title, the timed wipe into the dark room; scroll = the
   Stage settle and the pinned layer stack (where the intro's token runs out on its own).
   Every word and link is Hanzo's; repository and people names are examples. */
import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useMotionValueEvent, useReducedMotion } from 'motion/react';
import { Paste, Code, useLive } from './Frame';
import SettleStage from '../../v2/SettleStage';
import ClipWipe from '../../v2/ClipWipe';
import LaunchClose, { Arr } from '../../v2/LaunchClose';
import LineMask from '../../v2/LineMask';
import LivePause, { usePause } from '../../v2/LivePause';
import { A } from '../../kit';
import './Registry.css';

const GH = 'https://github.com/hanzoai';

/* ---------- the hero object: the push ---------- */
const LAYERS = [0.82, 0.55, 0.34, 0.12];
const LOG = [
  ['$ docker push oci.hanzo.ai/acme/api:v1.2.3', ''],
  ['401 · token from Hanzo IAM', 'warn'],
  ['token minted by your IAM login', 'ok'],
  ['signature checked against its certificate', 'ok'],
];
const WAIT = [800, 1000, 1300, 900, 2000, 900, 2600];

function Push() {
  const [ref, live, calm] = useLive(0.3);
  const [paused, pause] = usePause();
  const [t, setT] = useState(0); // 0 push, 1 401, 2 token, 3 signature checked, 4 layers, 5 pushed, 6 signed
  const [hov, setHov] = useState(null); // a step under a fine pointer (or a tap on a phone) shows that moment
  useEffect(() => { if (calm) setT(6); }, [calm]);
  // the push runs once (about 9 s), then rests on the signed image; Replay runs it again
  useEffect(() => {
    if (calm || !live || paused || hov !== null || t >= 6) return;
    const id = setTimeout(() => setT((v) => v + 1), WAIT[t]);
    return () => clearTimeout(id);
  }, [t, live, calm, paused, hov]);
  const s = hov ?? t;
  const peek = (i) => ({
    'data-step': i,
    onPointerEnter: (e) => e.pointerType === 'mouse' && setHov(i),
    onClick: () => setHov((h) => (h === i ? null : i)),
  });
  const st = (i) => (s >= i ? ' in' : '') + (s === i ? ' now' : '');
  const done = t >= 6 && !calm;
  return (
    <div className={'rg-push' + (done ? ' done' : '')} ref={ref} data-t={s} onPointerLeave={(e) => e.pointerType === 'mouse' && setHov(null)}>
      {done
        ? <button type="button" className="lx-pause rg-pause rg-replay" aria-label="Replay" onClick={() => { setHov(null); setT(0); }}>
            <svg viewBox="0 0 16 16" width="15" height="15" aria-hidden="true"><path d="M3.2 8a4.8 4.8 0 1 0 1.5-3.5M3 2.5v3h3" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
        : <LivePause paused={paused} onToggle={pause} className="rg-pause" />}
      <div className="rg-term" aria-hidden="true">
        <div className="rg-term-bar"><i /><i /><i /><span>terminal</span></div>
        <div className="rg-term-body">
          {LOG.map(([l, k], i) => <p key={l} className={k + st(i)} {...peek(i)}>{l}</p>)}
          <div className={'rg-layers' + st(4)} {...peek(4)}>
            {LAYERS.map((w, i) => (
              <div key={i} className="rg-layer"><span>layer {i + 1}</span><i><b style={{ transitionDuration: (0.9 + w) + 's', transitionDelay: s >= 4 && hov === null ? i * 0.18 + 's' : '0s' }} /></i></div>
            ))}
          </div>
          <p className={'rg-caret' + (s >= 6 ? ' in' : '')}>$ <i /></p>
        </div>
        <div className="rg-iamchip"><span className="rg-iam-k">Hanzo IAM</span><b className="rg-token">token</b></div>
      </div>
      <div className="rg-repo">
        <div className="rg-repo-bar"><span>Container Registry</span></div>
        <div className="rg-repo-in" aria-hidden="true">
          <p className="rg-repo-k">oci.hanzo.ai</p>
          <p className="rg-repo-n"><b>acme</b>/api</p>
          <ul>
            <li className={'new' + st(5)} {...peek(5)}><b>v1.2.3</b><span>image</span></li>
            <li className={'sig' + st(6)} {...peek(6)}><b>v1.2.3</b><span>cosign signature</span></li>
            <li className="in"><b>v1.2.2</b><span>image</span></li>
          </ul>
          <div className={'rg-mini' + (s >= 4 ? ' up' : '') + (s >= 5 ? ' done' : '')}>
            {[0, 1, 2, 3].map((i) => <i key={i} style={{ '--z': i }} />)}
            <i className="top" style={{ '--z': 4 }} />
          </div>
          <p className="rg-org">a repository name begins with your org</p>
        </div>
      </div>
    </div>
  );
}

/* ---------- the chapters' object: the image itself, one big stack of layers that each fact acts on ---------- */
const CLIENTS = ['docker', 'podman', 'buildkit', 'skopeo', 'crane'];
const PEOPLE = [['ana', 'push'], ['kai', 'push'], ['lee', 'pull'], ['sam', 'revoked']];

/* The image drawn as its layers, a stack of inked plates seen from above, large enough to be each screen's one object.
   Every chapter does one visible thing to it, labelled on the object itself:
   intro: an IAM token hovers over it while its time runs out; 01: a password is struck off and falls away while the
   token seats on the stack; 02: the org claims the top plate (it turns ink, "acme/* · push"); 03: the signature and the
   attestation dock beside the image; 04: the stack squares up for /v2/; 05: a tag slides out and storage shrinks;
   06: four people fold into one directory, one of them revoked. One short caption sits under it. */
function Repo({ step, intro }) {
  const on = (i) => (!intro && step === i) || undefined;
  return (
    <div className="rg-rv" data-step={intro ? 'intro' : step}>
      <div className="rg-iso" aria-hidden="true">
        <div className="rg-iso-s">
          {[0, 1, 2, 3].map((i) => <i key={i} className="rg-pl" style={{ '--z': i }} />)}
          <i className="rg-pl rg-pl-top" style={{ '--z': 4 }} />
          <i className="rg-pl rg-pl-sig" style={{ '--z': 4 }} />
          <i className="rg-pl rg-pl-att" style={{ '--z': 3 }} />
          <i className="rg-pl rg-pl-tok" style={{ '--z': 7 }} />
        </div>
        <span className="rg-t rg-t-tok" data-on={intro || undefined}><b>Hanzo IAM · token</b><span className="rg-ttl-bar"><i /></span></span>
        <span className="rg-t rg-t-pw" data-on={on(0)}>password</span>
        <span className="rg-t rg-t-seat" data-on={on(0)}>✓ token · signature checked</span>
        <span className="rg-t rg-t-org" data-on={on(1)}><b>acme</b>/* · push</span>
        <span className="rg-t rg-t-sig" data-on={on(2)}>cosign signature</span>
        <span className="rg-t rg-t-att" data-on={on(2)}>in-toto attestation</span>
        <span className="rg-t rg-t-del" data-on={on(4)}>v1.2.3-oops</span>
        <span className="rg-ppl" data-on={on(5)}>{PEOPLE.map(([n, r], i) => <i key={n} className={r === 'revoked' ? 'off' : ''} style={{ '--i': i }}>{n[0]}</i>)}</span>
        <p className="rg-iso-n">oci.hanzo.ai / <b>acme</b> / api</p>
      </div>
      <div className="rg-rv-panes" aria-hidden="true">
        <p className="rg-rv-pane" data-on={on(0)}>no password stored at either end</p>
        <p className="rg-rv-pane" data-on={on(1)}>one grant in one place</p>
        <p className="rg-rv-pane" data-on={on(2)}>same repository as the image they describe</p>
        <div className="rg-rv-pane rg-v2" data-on={on(3)}><span className="lx-num">/v2/</span><span className="rg-clients">{CLIENTS.join(' · ')}</span></div>
        <div className="rg-rv-pane rg-store" data-on={on(4)}><i /><span>deleted · blobs reclaimed</span></div>
        <p className="rg-rv-pane" data-on={on(5)}>one directory of people · Hanzo Cloud</p>
      </div>
    </div>
  );
}

/* ---------- entrances: each main section arrives its own way, once, when it enters view (motion map, 7 Nov) ----------
   html.js scopes every start state, so with JS off (or before the observer fires) nothing is hidden. */
function useEnter(amount = 0.18) {
  const ref = useRef(null);
  const [inn, setIn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { setIn(true); return; }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setIn(true); io.disconnect(); } }, { threshold: amount });
    io.observe(el);
    return () => io.disconnect();
  }, [amount]);
  return [ref, inn];
}

/* 1 tilt-3d-hover: the hero window arrives tipped back and levels toward the pointer, then keeps leaning to it */
function TiltHero({ children }) {
  const [ref, inn] = useEnter(0.1);
  const move = (e) => {
    if (e.pointerType !== 'mouse') return;
    const el = ref.current, r = el.getBoundingClientRect();
    el.style.setProperty('--rx', (((e.clientY - r.top) / r.height - 0.5) * -6).toFixed(2) + 'deg');
    el.style.setProperty('--ry', (((e.clientX - r.left) / r.width - 0.5) * 8).toFixed(2) + 'deg');
  };
  const leave = () => { ref.current?.style.setProperty('--rx', '0deg'); ref.current?.style.setProperty('--ry', '0deg'); };
  return <div ref={ref} className="rg-tilt" data-in={inn || undefined} onPointerMove={move} onPointerLeave={leave}>{children}</div>;
}

/* ---------- the signature: zoom into the system ----------
   The first frame is the whole system around one registry: Hanzo IAM mints the tokens, Builds pushes the images, the
   org owns the repositories, every OCI client pulls from /v2/, Hanzo Cloud holds the people. Scrolling zooms into the
   registry itself: the map flies past the edges, the image's layer stack grows to fill the screen, and the six facts
   arrive under it as one row; each fact acts on the stack (hover, tap or arrow keys; it walks on by itself while you
   watch). The pendulum entrance swings the whole map in from its top edge. */
const FACTS = [
  ['IAM Token Auth', 'An unauthenticated pull gets a 401 naming Hanzo IAM. Your client fetches a token there, the registry checks its signature against a certificate it holds, and the push goes through. No password is stored at either end.'],
  ['Org-Scoped Repos', 'A repository name begins with your org, and what a token may do with it is decided by IAM at the moment the token is minted. Adding a teammate is one grant in one place, not a secret copied into a second.'],
  ['Cosign + Attestation', 'cosign signatures and in-toto attestations are ordinary OCI artifacts, so they push and pull to the same repository as the image they describe. Verification happens where the image runs, against exactly what the registry stored.'],
  ['OCI Compliant', 'The registry HTTP API v2 at /v2/, and nothing bespoke on top of it. Every client, scanner and admission controller that reads an image already speaks it, which is the whole point of not inventing one.'],
  ['Tags come off cleanly', 'Deletes are enabled, so a tag you pushed by mistake goes away and the blobs behind it are reclaimed. A registry you can only add to is one that only grows.'],
  ['The same account as everything else', 'Whoever signs into Hanzo Cloud is who pushes an image. One directory of people, one place to revoke someone — and no separate registry account to remember when they leave.'],
];

const NODES = [
  ['Hanzo IAM', 'token', 18, 26, 1],
  ['acme', 'org', 82, 22, 0],
  ['Builds', 'Source to signed image', 16, 76, 3],
  ['docker · podman · buildkit · skopeo · crane', '/v2/', 82, 70, 2],
  ['Hanzo Cloud', 'one directory of people', 50, 92, 4],
];

function ZoomMap() {
  const ref = useRef(null);
  const [eref, inn] = useEnter(0.08);
  const calm = useReducedMotion();
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  // plain functions of the scroll (not range maps), so the zoom follows the scroll exactly, frame for frame
  const k = (v, a, b) => Math.min(1, Math.max(0, (v - a) / (b - a)));
  const mapS = useTransform(p, (v) => 1 + 2.4 * k(v, 0.06, 0.55));
  const mapO = useTransform(p, (v) => 1 - k(v, 0.2, 0.5));
  const stkS = useTransform(p, (v) => 0.42 + 0.58 * k(v, 0.06, 0.55));
  const facO = useTransform(p, (v) => k(v, 0.46, 0.62));
  const facY = useTransform(p, (v) => 40 * (1 - k(v, 0.46, 0.62)));
  const [open, setOpen] = useState(false);
  useEffect(() => { if (calm) setOpen(true); }, [calm]);
  useMotionValueEvent(p, 'change', (v) => setOpen(!!calm || v > 0.5));
  const [sel, setSel] = useState(0);
  const [held, setHeld] = useState(false);
  // once the registry fills the screen, the facts walk on by themselves until the visitor picks one
  useEffect(() => {
    if (!open || held || calm) return;
    const id = setTimeout(() => setSel((s) => (s + 1) % FACTS.length), 4200);
    return () => clearTimeout(id);
  }, [open, held, sel, calm]);
  const pick = (i) => { setHeld(true); setSel(i); };
  const key = (e) => {
    const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
    if (!d) return;
    e.preventDefault();
    const n = (sel + d + FACTS.length) % FACTS.length;
    pick(n);
    e.currentTarget.parentElement.children[n]?.focus();
  };
  return (
    <section ref={ref} className={'rg-zm' + (open ? ' open' : '')} aria-labelledby="rg-zm-h">
      <div className="rg-zm-stick">
        <div className="lx-wrap rg-zm-in" ref={eref} data-in={inn || undefined}>
          <div className="rg-zm-head">
            <h2 className="rg-zm-h" id="rg-zm-h">Built on Hanzo IAM</h2>
            <p className="rg-zm-l">The credential expires on its own, so there is nothing to rotate and nothing to leak</p>
          </div>
          <div className="rg-zm-stage">
            <motion.div className="rg-zm-map" aria-hidden="true" style={{ scale: mapS, opacity: mapO }}>
              <svg className="rg-zm-wires" viewBox="0 0 100 100" preserveAspectRatio="none">
                {NODES.map(([n, , x, y]) => <line key={n} x1="50" y1="50" x2={x} y2={y} />)}
              </svg>
              {NODES.map(([n, d, x, y]) => (
                <span key={n} className="rg-zm-node" style={{ left: x + '%', top: y + '%' }}><b>{n}</b><em>{d}</em></span>
              ))}
            </motion.div>
            <motion.div className="rg-zm-stack" style={{ scale: stkS }}>
              <Repo step={sel} intro={false} />
            </motion.div>
          </div>
          <motion.div className="rg-zm-facts" style={{ opacity: facO, y: facY }}>
            <div className="rg-zm-tabs" role="tablist" aria-label="Built on Hanzo IAM">
              {FACTS.map(([t], i) => (
                <button key={t} type="button" role="tab" id={'rg-ft-' + i} aria-selected={sel === i} aria-controls={'rg-fp-' + i} tabIndex={sel === i ? 0 : -1}
                  onClick={() => pick(i)} onPointerEnter={(e) => e.pointerType === 'mouse' && open && pick(i)} onKeyDown={key}>
                  <span className="rg-zm-n">{String(i + 1).padStart(2, '0')}</span><h3>{t}</h3>
                </button>
              ))}
            </div>
            {FACTS.map(([t, d], i) => (
              <p key={t} className="rg-zm-p" role="tabpanel" id={'rg-fp-' + i} aria-labelledby={'rg-ft-' + i} hidden={sel !== i}>{d}</p>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* 3 opposite-drift: the dark room's words and its terminal drift in from opposite sides as you scroll into it */
function Drift({ children }) {
  const ref = useRef(null);
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ['start end', 'start 25%'] });
  const l = useTransform(p, [0, 1], ['-140px', '0px']);
  const r = useTransform(p, [0, 1], ['140px', '0px']);
  return <motion.div ref={ref} className="rg-drift" style={{ '--dl': l, '--dr': r }}>{children}</motion.div>;
}

/* 4 fold-out and 5 invert-flash: one-shot entrances on the console and the related cards */
function Enter({ kind, className = '', children }) {
  const [ref, inn] = useEnter(0.2);
  return <div ref={ref} className={'rg-en rg-en-' + kind + ' ' + className} data-in={inn || undefined}>{children}</div>;
}

// [row, the dockerconfigjson way, the IAM way]: both sides are Hanzo's phrases from this page
const SWAP = [
  ['Adding a teammate', 'a secret copied into a second', 'one grant in one place'],
  ['Someone leaves', 'a separate registry account to remember when they leave', 'one place to revoke someone'],
];

function Swap({ gone }) {
  return (
    <div className={'rg-swap' + (gone ? ' on' : '')}>
      <dl className="rg-swap-t">
        {SWAP.map(([k, a, b]) => (
          <div key={k} className="rg-swap-r">
            <dt>{k}</dt>
            <dd className="was" aria-hidden={gone}>{a}</dd>
            <dd className="now" aria-hidden={!gone}>{b}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

/* the dark room: the heading is the instruction and the switch carries it out (the switch is named by the heading,
   so the words are said once); pressed, the heading strikes through and IAM's way wipes in row by row */
function DelRoom() {
  const [gone, setGone] = useState(false);
  return (
    <div className={'lx-wrap rg-del-grid' + (gone ? ' on' : '')}>
      <div className="rg-del-l">
        <h2 className="lx-headline rg-del-h" id="rg-del-h">Delete the dockerconfigjson secret</h2>
        <button type="button" className="rg-swap-b" aria-pressed={gone} aria-labelledby="rg-del-h" onClick={() => setGone((g) => !g)}>
          <span className="rg-swap-sw" aria-hidden="true"><i /></span>
        </button>
        <p className="lx-lede">Put a token IAM mints in its place, and let it expire on its own. There is nothing left to rotate.</p>
        <div className="rg-del-acts">
          <A to="https://docs.hanzo.ai/docs/openapi/registry/" className="lx-ghost">Quickstart<Arr /></A>
          <A to="/iam" className="lx-text">About IAM</A>
        </div>
      </div>
      <Code title="Registry terminal" tabs={[{ k: 'terminal', code: '$ hanzo login oci.hanzo.ai\n# IAM mints a short-lived token\n$ docker push oci.hanzo.ai/acme/api:v1.2.3' }]} className="rg-code" />
      <Swap gone={gone} />
    </div>
  );
}

const SIDE = [['Registry', '/registry'], ['Projects', '/cloud/projects'], ['Environments', '/cloud/environments'], ['Builds', '/cloud/builds'], ['Releases', '/cloud/releases'], ['Pipelines', '/cloud/pipelines']];
const REL = [['Projects', '/cloud/projects', 'The deploy unit'], ['Environments', '/cloud/environments', 'Dev, staging, prod — isolated'], ['Builds', '/cloud/builds', 'Source to signed image']];

/* ---------- the tail is Registry's own: its console lists the org's repositories, each an image you can open into
   its tags; related capabilities are drawn as what they do to an image; the close carries "Get started" and the
   agent prompt, so the page ends once ---------- */
const CON_ICONS = ['M3 5.5 8 3l5 2.5L8 8zM3 8.5 8 11l5-2.5M3 11.5 8 14l5-2.5', 'M2.5 3.5h11v9h-11zM2.5 6.5h11', 'M3 4h4v4H3zM9 8h4v4H9zM5 8v4h4', 'M4 3v10M4 8h5l3-3M9 8l3 3', 'M8 2v12M3 7l5-5 5 5', 'M2.5 4.5h4v7h-4zM9.5 4.5h4v7h-4zM6.5 8h3'];
const REPOS = [['gateway', 'Ready'], ['payments-api', 'Ready'], ['checkout-web', 'Building'], ['docs-site', 'Ready']];

function RegConsole() {
  const [ref, live, calm] = useLive(0.4);
  const [at, setAt] = useState(2);
  const [built, setBuilt] = useState(false);
  // the building image finishes its push while you watch, then the next one starts (only on screen)
  useEffect(() => {
    if (calm) { setBuilt(true); return; }
    if (!live) return;
    const id = setTimeout(() => setBuilt((b) => !b), 4200);
    return () => clearTimeout(id);
  }, [live, built, calm]);
  const st = (n, s) => (n === 'checkout-web' && built ? 'Ready' : s);
  const cur = REPOS[at][0];
  const busy = st(cur, REPOS[at][1]) === 'Building';
  return (
    <div className="rg-rc" ref={ref}>
      <div className="rg-rc-bar"><i /><i /><i /><A to="/home" className="cf-con-title rg-rc-title">Registry — Hanzo</A></div>
      <div className="rg-rc-body">
        <nav className="rg-rc-side" aria-label="Products">
          {SIDE.map(([t, to], i) => (
            <A key={t} to={to} className={'rg-rc-ico' + (i === 0 ? ' on' : '')} aria-label={t}>
              <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d={CON_ICONS[i % CON_ICONS.length]} fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" /></svg>
              <span className="rg-rc-tip">{t}</span>
            </A>
          ))}
        </nav>
        <ul className="rg-rc-list" role="listbox" aria-label="Projects">
          {REPOS.map(([n, s], i) => {
            const now = st(n, s);
            return (
              <li key={n} role="option" aria-selected={at === i} tabIndex={0} onClick={() => setAt(i)} onMouseEnter={() => setAt(i)} onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), setAt(i))}>
                <span className="rg-rc-n"><em>acme/</em>{n}</span>
                <span className={'rg-rc-st' + (now === 'Building' ? ' b' : '')}>{now === 'Building' && <b className="rg-rc-spin" aria-hidden="true" />}{now}</span>
              </li>
            );
          })}
        </ul>
        <div className={'rg-rc-img' + (busy ? ' busy' : '')} aria-hidden="true">
          <div className="rg-rc-stack" key={cur}>
            {[0, 1, 2, 3].map((i) => <i key={i} style={{ '--z': i }} />)}
            <i className="top" style={{ '--z': 4 }} />
          </div>
          <p className="rg-rc-path">oci.hanzo.ai / <b>acme</b> / {cur}</p>
          <ul className="rg-rc-tags">
            <li><b>v1.2.3</b><span>image</span></li>
            <li className="sig"><b>v1.2.3</b><span>cosign signature</span></li>
          </ul>
        </div>
      </div>
      <p className="rg-rc-cap">The service the session above is changing.</p>
      <div className="rg-rc-foot">
        <span>api.hanzo.ai<b>/v1/registry</b></span>
        <A to="https://hanzo.team/" className="rg-rc-open">Open in the console ↗</A>
      </div>
    </div>
  );
}

/* related capabilities, each drawn as what it does to an image: Projects holds the image (a stack in its frame),
   Environments runs it three times (dev, staging, prod: three stacks), Builds makes it (source lines turning into
   layers). Hover plays the drawing; the title is the morph source like every card that opens into its page. */
function RelArt({ to }) {
  const k = to.split('/').pop();
  const n = k === 'environments' ? 3 : 1;
  return (
    <span className={'rg-ra rg-ra-' + k} aria-hidden="true">
      {k === 'builds' && <span className="rg-ra-src"><i /><i /><i /></span>}
      {Array.from({ length: n }, (_, j) => (
        <span key={j} className="rg-ra-s" style={{ '--j': j }}>{[0, 1, 2, 3].map((i) => <i key={i} style={{ '--z': i }} />)}</span>
      ))}
    </span>
  );
}

function Related() {
  return (
    <section className="rg-rel">
      <div className="lx-wrap">
        <h2 className="rg-rel-h">Related capabilities</h2>
        <Enter kind="flash">
        <ul className="rg-rel-grid">
          {REL.map(([t, to, d]) => (
            <li key={t}>
              <A to={to} className="rg-rel-card" data-cursor="">
                <RelArt to={to} />
                <span className="rg-rel-t" data-morph>{t}</span>
                <span className="rg-rel-d">{d}</span>
                <Arr />
              </A>
            </li>
          ))}
        </ul>
        </Enter>
      </div>
    </section>
  );
}

export default function Registry() {
  // the entrances' start states apply only once the page runs (JS off: everything shows at rest)
  const [armed, setArmed] = useState(false);
  useEffect(() => setArmed(true), []);
  return (
    <main className="lx rg" data-armed={armed || undefined}>
      <section className="rg-hero" data-morph-target data-ask-name="Hanzo Registry">
        <div className="lx-wrap rg-hero-grid">
          <SettleStage from={1.06} className="rg-stage"><TiltHero><Push /></TiltHero></SettleStage>
          <div className="rg-hero-copy">
            <LineMask as="h1" className="lx-display m rg-h1" lines={['Hanzo', 'Registry']} />
            <p className="lx-body rg-lede">A private registry for your container images at oci.hanzo.ai. It serves the OCI distribution API, so docker, podman, buildkit, skopeo and crane already know how to talk to it — and the credential is a short-lived token minted by your Hanzo IAM login, not a password living in a dockerconfigjson secret.</p>
            <A to={GH} className="lx-cta rg-cta" data-thumb="View Source" data-cta="registry.hero">View Source<Arr /></A>
          </div>
        </div>
      </section>

      <ZoomMap />

      <ClipWipe dark className="rg-del">
        <Drift><DelRoom /></Drift>
      </ClipWipe>

      <section className="lx-sec rg-con">
        <div className="lx-wrap rg-con-in">
          <Enter kind="fold">
            <RegConsole />
            <p className="rg-note">Example project. Every name in it is one you would give your own.</p>
          </Enter>
        </div>
      </section>

      <Related />

      <LaunchClose name="Registry" tag="OCI image registry" seed="registry" data={[401, 2, 6]} ask={['View Source', GH]} cta="registry.close" className="rg-close">
        <div className="rg-start">
          <div className="rg-start-row">
            <h3 className="rg-start-h">Get started with Registry</h3>
            <A to={GH} className="lx-text">View on GitHub</A>
          </div>
          <Paste name="Registry" prompt="Read https://hanzo.ai/skill.md and use Hanzo Registry in my project. Start with: hanzo registry images" className="lx-paste rg-paste" />
        </div>
      </LaunchClose>
    </main>
  );
}
