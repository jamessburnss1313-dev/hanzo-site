'use client';
/* Persona: enterprise buyer (fraud, AML and trust-and-safety leads). Goal: start a sales conversation. CTA: "Talk to us" → /contact-sales. Metric: contact_sales_submit.
   Risk. V2: 8/10 motion-map: decode + orbit-in, ink-spread, squash-land, velocity-skew, depth-parallax (pinned chapters removed; sections reordered)
   Signature: the dial that decides, and shows its work. Pick a stage (signup, payment, post-purchase; the stage is a
   field) and signals light; the needle swings to a score and the plane returns an action and its reasons. It never
   declines on its own: past the line it summons a person, the ceiling Hanzo's engine refuses to start above.
   Beyond: "Attribution, by hand". Set any signal back to neutral and score again; the drop is that signal's
   contribution, exactly how Hanzo says its scores explain themselves. The dial is labelled an illustration, because no
   figure on this page is a customer result.
   Motion map: signature = decode (headlines, the decision word and POST /v1/event resolve from scrambled characters;
   hover re-scrambles); entrances orbit-in, ink-spread, squash-land, velocity-skew, depth-parallax (../risk/Enter.jsx).
   Colour: none (JAMES.md, 0 UI hues); the hot side of the dial is ink, status reads by shape and word. Every self-running
   demo has a pause control. One dark room: "Your data, your model". Every word and link is Hanzo's. */
import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { EASE, Magnetic } from '../../ui';
import { A } from '../../kit';
import { useLive, useEvery, useSteps } from '../cloud/Frame';
import Settle from '../../v2/Settle';
import { OpenCards, Detail } from '../../v2/OpenSheet';
import NoJs from '../../v2/x-gauss/NoJs';
import { usePause } from '../../v2/x-gauss/Pause';
import Sigil from '../../Sigil';
import '../../v2/Scale.css';
import '../../v2/x-gauss/Rhythm.css';
import Decode, { DecodeLines } from '../risk/Decode';
import { OrbitIn, InkSpread, SquashLand, VelocitySkew, DepthParallax } from '../risk/Enter';
import './Risk.css';

// illustrative weights for the dial (not measured, not a customer result)
const STAGES = [
  ['signup', 'Signup and onboarding', [['several customers acting as one', 34], ['free-trial abuse', 21], ['account sharing', 12]]],
  ['payment', 'Payment', [['card testing', 38], ['velocity counters', 19], ['bot-driven payment abuse', 15]]],
  ['post-purchase', 'Ongoing and post-purchase', [['payout fraud', 30], ['negative balances', 16], ['disputes', 11]]],
];
const LINE = 50;

/* Runs a short sequence once each time its section comes into view (0 … n-1, ms apart), then rests on `rest`. */
function useRun(n, ms, on, rest) {
  const [i, setI] = useState(rest);
  const [go, setGo] = useState(false);
  useEffect(() => { if (on) { setI(0); setGo(true); } else setGo(false); }, [on]);
  useEvery(ms, on && go, () => { if (i >= n - 1) { setGo(false); setI(rest); } else setI(i + 1); });
  return [i, setI, go];
}

/* The hero object: a gauge on the left, the decision and its reasons on the right. */
function Dial() {
  const [ref, live] = useLive(0.3);
  const [paused, pauseBtn] = usePause({ position: 'relative', right: 'auto', top: 'auto' });
  const [st, setSt] = useState(1);
  const [off, setOff] = useState([false, false, false]); // a signal set back to neutral
  const [mine, setMine] = useState(false);
  const [beat, setBeat] = useState(0);
  // idle: walk the stages and set one signal to neutral, then back, so the dial is always deciding something
  useEvery(2200, live && !mine && !paused, () => {
    const b = beat + 1;
    setBeat(b);
    if (b % 3 === 0) { setSt((s) => (s + 1) % 3); setOff([false, false, false]); }
    else setOff([false, false, false].map((_, i) => i === (b % 3) - 1));
  });
  const sig = STAGES[st][2];
  const score = sig.reduce((a, [, w], i) => a + (off[i] ? 0 : w), 0);
  const hot = score >= LINE;
  const act = hot ? 'summon a person' : 'allow';
  const rot = -90 + (score / 100) * 180;
  const pick = (i) => { setMine(true); setSt(i); setOff([false, false, false]); };
  const flip = (i) => { setMine(true); setOff((o) => o.map((v, k) => (k === i ? !v : v))); };
  return (
    <div className="rk-dial" ref={ref}>
      <div className="rk-dial-l">
        <div className="rk-gauge" aria-hidden="true">
          <svg viewBox="0 0 220 124">
            <path d="M14 112 A 96 96 0 0 1 206 112" className="rk-arc" />
            <path d="M110 16 A 96 96 0 0 1 206 112" className="rk-arc hot" />
            <line x1="110" y1="6" x2="110" y2="28" className="rk-tick" />
          </svg>
          <motion.i className="rk-needle" animate={{ rotate: rot }} transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }} />
          <span className="rk-hub" />
          <span className="rk-l0 x-mono">0</span><span className="rk-lline x-mono">the line</span><span className="rk-l1 x-mono">100</span>
        </div>
        <div className="rk-out" aria-live={mine ? 'polite' : 'off'}>
          <div className="rk-action"><span className="rk-action-box"><b className={hot ? 'hot' : ''}><Decode text={act} start="change" ms={520} /></b></span><span className="rk-action-k x-mono">action</span></div>
        </div>
      </div>
      <div className="rk-dial-r">
        <div className="rk-stage-row"><div className="rk-stage" role="tablist" aria-label="Stage" onKeyDown={(e) => { const n = { ArrowRight: (st + 1) % 3, ArrowLeft: (st + 2) % 3, Home: 0, End: 2 }[e.key]; if (n === undefined) return; e.preventDefault(); pick(n); e.currentTarget.children[n]?.focus(); }}>
          {STAGES.map(([k], i) => (
            <button key={k} type="button" role="tab" aria-selected={st === i} tabIndex={st === i ? 0 : -1} onClick={() => pick(i)}>
              <span>{k}</span>
            </button>
          ))}
        </div><span className="rk-pause">{pauseBtn}</span></div>
        <p className="rk-field x-mono">stage: '{STAGES[st][0]}'</p>
        <p className="rk-reasons-k">reasons · tap one to set it back to neutral</p>
        <ul className="rk-reasons">
          {sig.map(([t, w], i) => (
            <li key={STAGES[st][0] + t}>
              <button type="button" aria-pressed={off[i]} onClick={() => flip(i)} className={off[i] ? 'off' : ''}>
                <span>{t}</span>
                <motion.i style={{ originX: 0 }} animate={{ scaleX: off[i] ? 0 : w / 40 }} transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }} />
              </button>
            </li>
          ))}
        </ul>
        <p className="rk-ill">Illustration. No figure on this page is a customer result.</p>
      </div>
    </div>
  );
}

function Hero() {
  return (
    <section className="rk-hero" aria-labelledby="rk-h1" data-morph-target>
      <div className="w2-wrap rk-hero-g">
        <div className="rk-hero-copy">
          <DecodeLines as="h1" id="rk-h1" className="w2-display rk-h1" lines={['One risk plane', 'for accounts, payments', 'and agents']} />
          <motion.div className="rk-hero-act" initial={{ y: 12 }} animate={{ y: 0 }} transition={{ duration: 0.8, ease: EASE, delay: 0.45 }}>
            <Magnetic strength={0.25}><A to="/contact-sales" className="w2-cta" data-thumb="Talk to us" data-cta="risk.hero">Talk to us <i aria-hidden="true">→</i></A></Magnetic>
          </motion.div>
        </div>
        <Settle from={1.02} lift={10}><Dial /></Settle>
      </div>
    </section>
  );
}

/* Where this is today: the lede said once, as a statement, with the two faces as objects under it. Their long words open
   from the + into sheets. */
function Faces() {
  const [ref, live] = useLive(0.2);
  return (
    <section className={'w2-sec rk-say' + (live ? ' on' : '')} aria-labelledby="rk-today" ref={ref}>
      <div className="w2-wrap">
        <Decode as="h2" id="rk-today" className="w2-headline rk-today-h" text="Where this is today" />
        <p className="rk-say-h">Two faces over one engine, at two different stages.</p>
        <OrbitIn><div className="rk-engine">
          <p className="rk-say-c live" data-enter><b>Available now</b> — the compliance face, at api.hanzo.ai/v1/aml: monitoring, alerts, cases, rules, sanctions screening, relationship lookback and a retained-record clock.</p>
          <p className="rk-say-c dev" data-enter><b>In development</b> — the decide plane, which will score an account, a transaction, a session or an agent and return a decision you can explain, from a model trained on your organization's own data rather than a pooled model of somebody else's traffic.</p>
          <div className="rk-eng-core" aria-hidden="true" data-enter>
            <span className="rk-eng-w live"><i /></span>
            <span className="rk-eng-box x-mono">one engine</span>
            <span className="rk-eng-w dev" />
          </div>
          <Detail className="rk-d-live" label="compliance face" title="compliance face" kicker="/v1/aml">
            <p>Hanzo Risk is two faces over one engine, and they are not at the same stage. The <strong>compliance face is live</strong> at <strong>api.hanzo.ai/v1/aml</strong>, behind your Hanzo identity: monitoring, alerts, cases, rules, sanctions screening, relationship lookback, and a retained-record plane that keeps a five-year clock.</p>
            <p>Its source is public and every rule cites the instrument it implements, so what this page claims can be read back out of the code. It is <strong>not open source</strong>: the engine is licensed under the Lux Ecosystem License — free for research and on Lux networks, and licensed separately for commercial use anywhere else.</p>
          </Detail>
          <Detail className="rk-d-dev" label="decide plane" title="decide plane" kicker="/v1/risk">
            <p>The <strong>decide plane</strong> — <strong>/v1/risk</strong>, everything else on this page — and the shared model plane behind both are being built. Every capability below says which of the two it is.</p>
          </Detail>
        </div></OrbitIn>
      </div>
    </section>
  );
}

const AML = [
  ['Transaction monitoring', 'Transactions are scored against the rule library as they arrive. An alert carries the rule that fired and the citation behind it — the authority, the document and the locator inside it — so a reviewer lands on the primary text instead of taking the alert on trust.'],
  ['Rules you can read', 'Twenty typology rules ship as a starting library, each citing the standard it implements. A candidate rule can be replayed over your own history, and the report is the difference between what it would have caught and what the live library catches — one replay at a time per organization. Activating a rule of your own belongs to the decide plane and is not here yet.'],
  ['Cases', 'An alert becomes a case with a timeline, and both are durable — they are there after a restart, and one institution’s volume cannot evict another’s. Closing a case requires a rationale, and the record keeps it: a resolution nobody can account for is not a resolution.'],
  ['Sanctions screening', 'OFAC, UK OFSI, EU and UN designations, parsed from each authority’s own published export rather than a reseller’s copy of it. The freshness of every list is on the record.'],
  ['Relationship lookback', 'Ask whether a business relationship with a named party is open now, or was open inside the last five years, and what its nature was. The answer is a lookup on that party in an index of relationship records, so what it reads does not grow with the ledger. It reads relationships and not transactions, which is a different question from the one the rules answer.'],
  ['Retention', 'A retained record — a relationship, a transaction, the assessment behind a case, a refusal — carries its own five-year clock, started by the end of the relationship, by the occasional transaction, or by the refusal itself. Disposal runs daily and proves what it destroyed before it reports it. Alerts and case timelines are durable, and are not on that clock.'],
];
const CASE = [['transaction', 'arrives'], ['rule fired', 'with its citation'], ['authority · document · locator', 'the primary text'], ['case opened', 'with a timeline'], ['closed', 'rationale on the record']];

const LIFE = [
  ['Signup and onboarding', 'Multi-account abuse, free-trial abuse, account sharing and account fraud, judged when the account is created. The device and pairing signals exist for exactly one question: are several nominally unrelated customers acting as one?'],
  ['Payment', 'Card testing, transaction fraud and bot-driven payment abuse, scored at authorization time. The hot path is meant to read velocity counters held in memory, not the warehouse, so a payment decision does not fail when analytics does.'],
  ['Ongoing and post-purchase', 'Pay-as-you-go abuse, negative balances and payout fraud, plus the disputes that arrive weeks later. A resolved dispute is a label, and the label goes back into the model that made the call.'],
];

const FACTS = ['a registration in your organization', 'a credential of a known class', 'a live session', 'metered usage'];

/* Chapter 1 visual: an alert becoming a case, step by step, with the five-year clock. */
function CaseFile({ on }) {
  const [k, setK] = useState(CASE.length);
  useEffect(() => { if (on) setK(0); }, [on]);
  useEvery(1100, on, () => setK((v) => (v >= CASE.length + 2 ? 0 : v + 1)));
  return (
    <div className="rk-case w2-object" aria-hidden="true">
      <p className="rk-case-k x-mono"><span>/v1/aml</span><span>alert → case</span></p>
      <ol>
        {CASE.map(([t, d], i) => (
          <motion.li key={t} initial={false} animate={{ opacity: i < k ? 1 : 0.18 }} transition={{ duration: 0.4, ease: EASE }}>
            <i className={i < k ? 'on' : ''} /><b>{t}</b><span>{d}</span>
          </motion.li>
        ))}
      </ol>
      <div className="rk-clock">
        <svg viewBox="0 0 44 44"><circle cx="22" cy="22" r="18" /><motion.circle cx="22" cy="22" r="18" className="on" initial={false} animate={{ pathLength: Math.min(1, k / CASE.length) }} transition={{ duration: 1.1, ease: EASE }} /></svg>
        <span><b>five-year clock</b> on every retained record</span>
      </div>
    </div>
  );
}

/* Chapter 2 visual: the three stages on one track, the same call at each one. */
function Track({ on }) {
  const [at, choose] = useSteps(3, 2400, on);
  return (
    <div className="rk-track w2-object">
      <p className="rk-track-call x-mono" aria-hidden="true">same call · same record · same model · <b>stage: '{STAGES[at][0]}'</b></p>
      <div className="rk-track-line" aria-hidden="true"><motion.i animate={{ scaleX: (at + 1) / 3 }} transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }} /></div>
      <div className="rk-stops">
        {LIFE.map(([t], i) => (
          <button key={t} type="button" className={'rk-stop' + (at === i ? ' on' : '')} aria-pressed={at === i} onClick={() => choose(i)}>
            <i aria-hidden="true" /><span>{t}</span>
          </button>
        ))}
      </div>
      <ul className="rk-track-sig" aria-hidden="true">
        {STAGES[at][2].map(([t]) => <motion.li key={t} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, ease: EASE }}>{t}</motion.li>)}
      </ul>
    </div>
  );
}

/* Chapter 3 visual: four facts about our own platform; with all four a caller is an agent, with none it is anonymous. */
function Lanes({ on }) {
  const [has, setHas] = useState([true, true, true, true]);
  const [mine, setMine] = useState(false);
  const [n, setN] = useState(0);
  useEvery(1500, on && !mine, () => { const v = (n + 1) % 6; setN(v); setHas(FACTS.map((_, i) => (v < 4 ? i >= v : v === 4 ? false : true))); });
  const count = has.filter(Boolean).length;
  const lane = count === 4 ? 'agent' : count === 0 ? 'anon' : 'mid';
  return (
    <div className="rk-lanes w2-object">
      <ul className="rk-facts">
        {FACTS.map((f, i) => (
          <li key={f}><button type="button" role="switch" aria-checked={has[i]} onClick={() => { setMine(true); setHas((h) => h.map((v, k) => (k === i ? !v : v))); }}><i />{f}</button></li>
        ))}
      </ul>
      <div className="rk-lane-box" aria-live={mine ? 'polite' : 'off'}>
        <div className={'rk-lane' + (lane === 'agent' ? ' on' : '')}><b>agent policy</b><span>all four facts carried</span></div>
        <div className={'rk-lane' + (lane === 'anon' ? ' on anon' : '')}><b>anonymous lane</b><span>declares nothing, authenticates as nobody · bounded</span></div>
        <motion.i className="rk-caller" animate={{ y: lane === 'agent' ? 0 : lane === 'anon' ? 80 : 40, opacity: lane === 'mid' ? 0.4 : 1 }} transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }} aria-hidden="true" />
        <p className="rk-lane-n x-mono">{count} of 4 facts</p>
      </div>
    </div>
  );
}

function Chapters() {
  const chapters = [
    {
      t: 'Available now: the compliance face',
      b: (<>
        <p>Anti-money-laundering monitoring is a different job from stopping fraud, and it is the half that is live. It is one face of the same engine, not a separate product.</p>
        <Detail label={AML.map(([t]) => t).join(' · ')} title="Available now: the compliance face" kicker="/v1/aml" wide>
          <ol className="rk-six">{AML.map(([t, d], i) => <li key={t}><h4>{t}{i === 0 && <span className="w2-pill live">Available now</span>}</h4><p>{d}</p></li>)}</ol>
        </Detail>
      </>),
    },
    {
      t: 'The customer lifecycle',
      b: (<>
        <p>In development. Loss does not arrive at one moment, so the plane will not watch one moment. Same call, same record, same model at each stage — the stage is a field.</p>
        <Detail label={LIFE.map(([t]) => t).join(' · ')} title="The customer lifecycle" kicker="In development">
          <ol className="rk-six">{LIFE.map(([t, d], i) => <li key={t}><h4>{t}{i === 0 && <span className="w2-pill dev">In development</span>}</h4><p>{d}</p></li>)}</ol>
        </Detail>
      </>),
    },
    {
      t: 'Agents are not bots',
      b: (<>
        <p>In development. This is the argument for building the decide plane here rather than buying one, not a description of something running today.</p>
        <Detail title="Agents are not bots" kicker="In development">
          <p>A user-agent string cannot tell you whether traffic is a scraper or a customer’s agent doing work it was asked to do. The plane will not read one.</p>
          <p>Hanzo runs agents. An agent transacting here has a registration in your organization, a credential of a known class, a live session and metered usage — four facts about our own platform rather than four guesses about a client. Traffic carrying them will be treated as an agent and get the agent policy. Traffic that declares nothing and authenticates as nobody will be in the anonymous lane and bounded like one.</p>
          <p><strong>Treating a customer’s agent as a bad bot is a lost sale. Treating a bad bot as an agent is a loss. The difference has to be computed, and computing it needs facts only the platform the agent runs on has.</strong></p>
        </Detail>
      </>),
    },
  ];
  return (
    <section className="w2-sec rk-ch" aria-label="Where the plane stands">
      <div className="w2-wrap">
        <SquashLand className="rk-ch-list">
          {chapters.map((c, i) => <ChapterRow key={c.t} c={c} i={i} />)}
        </SquashLand>
      </div>
    </section>
  );
}

/* One chapter: its words beside its own stepping object, which runs while it is in view (pause in the card's corner). */
function ChapterRow({ c, i }) {
  const [ref, live] = useLive(0.35);
  const [paused, pauseBtn] = usePause({ right: 12, top: 12 });
  const V = [CaseFile, Track, Lanes][i];
  return (
    <article className={'rk-ch-row' + (i % 2 ? ' flip' : '')} ref={ref}>
      <div className="rk-ch-t">
        <Decode as="h2" className="w2-headline" text={c.t} />
        <span className="rk-ch-n x-mono" aria-hidden="true">{String(i + 1).padStart(2, '0')} / 03</span>
        <div className="rk-ch-b">{c.b}</div>
      </div>
      <div className={'rk-vis' + (paused ? ' paused' : '')} data-enter>
        {pauseBtn}
        <V on={live && !paused} />
      </div>
    </article>
  );
}

const ON = [
  ['Accounts', 'Score any account on the platform, at signup and continuously afterwards. Covers multi-account abuse, free-trial abuse, account sharing, account takeover and account fraud. A merchant on your platform is an account too, so onboarding and ongoing monitoring run off the same score.'],
  ['Transactions', 'Score a transaction at authorization and return an action, a score and the reasons behind it. Covers card testing, transaction fraud and payment abuse across whatever methods and processors you already use.'],
  ['Abuse', 'Score the usage plane, not only the money: pay-as-you-go abuse, credential stuffing, scraping, quota abuse and spam. This is the plane that defends an AI product, where the loss is inference spend rather than a chargeback.'],
  ['Disputes', 'Assemble what a dispute response needs — the decision, the rules that fired, the values behind it and the identity of the model that produced it — out of a tamper-evident record. Hanzo does not process payments and has no dispute-network integration; the evidence is yours to submit.'],
];

/* A small object per subject: accounts acting as one, a transaction meeting its decision, usage climbing, a dispute's record. */
function OnArt({ i }) {
  if (i === 0) return <span className="rk-art acc"><i /><i /><i /><i /><b /></span>;
  if (i === 1) return <span className="rk-art tx"><i /><em /><b>action</b></span>;
  if (i === 2) return <span className="rk-art ab">{[30, 44, 38, 62, 80, 96].map((h, k) => <i key={k} style={{ height: h + '%' }} />)}</span>;
  return <span className="rk-art dp"><i /><i /><i /><i /><b>record</b></span>;
}

function DecidesOn() {
  const [ref, live] = useLive(0.15);
  return (
    <section className={'w2-sec rk-on' + (live ? ' on' : '')} ref={ref}>
      <div className="w2-wrap">
        <div className="rk-split">
          <Decode as="h2" className="w2-headline" text="What it decides on" />
          <p className="w2-lede">In development. Fraud is a use of a scoring plane, not a product that sits beside one. One call will judge an account, a transaction, a session or an agent.</p>
        </div>
        <InkSpread><OpenCards cols={4} className="rk-cards" items={ON.map(([t, d], i) => ({ id: 'rk-' + t, k: String(i + 1).padStart(2, '0'), t, art: <OnArt i={i} />, body: <p>{d}</p> }))} /></InkSpread>
      </div>
    </section>
  );
}

function Model() {
  const [ref, live] = useLive(0.3);
  const [paused, pauseBtn] = usePause({ position: 'relative', right: 'auto', top: 'auto' });
  return (
    <section className={'w2-sec rk-model w2-dark' + (live && !paused ? ' on' : '')} data-room="dark" ref={ref}>
      <VelocitySkew className="w2-wrap">
        <div className="rk-split">
          <Decode as="h2" className="w2-headline" text="Your data, your model" />
          <p className="w2-lede">In development. The endpoint your events already arrive through is live; reading those events as features, and training on them, is what is being built.</p>
        </div>
        <div className="rk-endpoint" aria-hidden="true">
          <Decode className="rk-ep x-mono" text="POST /v1/event" />
          <div className="rk-stream">{Array.from({ length: 14 }).map((_, i) => <i key={i} style={{ animationDelay: i * 0.29 + 's' }} />)}</div>
          <span className="rk-shadow x-mono">shadow</span>
          <span className="rk-pause">{pauseBtn}</span>
        </div>
        <Detail label="POST /v1/event" title="Your data, your model" kicker="In development" wide>
          <p>Most fraud products score you against a pooled model built from other people’s traffic. Hanzo already holds yours. Analytics, product events and errors arrive through one endpoint — <strong>POST /v1/event</strong> — and are stored as rows scoped to your organization, beside your model usage, in a warehouse Hanzo runs and every tenant shares. That endpoint is live today. Reading those events as features and training on them is what is coming: your users, your products, your normal.</p>
          <p>The boundary is the hard part, and the commitment is that it will be enforced in the code rather than asserted in a policy. A feature read will not be expressible without a tenant. The organization will come from your verified identity, never from a field a caller can set. Anything shared across organizations will be an <strong>aggregate</strong> — published quantiles, with no organization, no subject and no identifier in the row — and a bucket too few organizations contributed to will not be published at all. The model is meant to be per organization down to its geometry, so that two organizations do not merely keep separate counters; they have separate models.</p>
          <p>Two of the properties that plane needs are already in the engine’s behavioural model, and it is those that will be carried forward. A score there is attributable by construction: move one input back to its neutral value, score again, and the drop is that input’s contribution — no second model is asked to explain the first. And a statistical judgement may summon a person; it may not decline anything on its own, a ceiling the engine refuses to start above. On the live deployment that model runs in <strong>shadow</strong>: it scores, and it contributes nothing to any transaction’s outcome.</p>
        </Detail>
      </VelocitySkew>
    </section>
  );
}

const LISTS = ['addresses', 'emails', 'accounts', 'card ranges', 'networks', 'devices'];
const RULES = [['Custom rules', 'Write rules over your own fields in the same vocabulary the shipped library uses, and replay them over your own history before you turn them on.'], ['Lists', 'Allow and deny lists over addresses, emails, accounts, card ranges, networks and devices, referenced directly from a rule. Your lists are yours; a designation from a sanctions authority is not editable by a tenant, and the two never merge.'], ['Suppression', 'Suppress an activation you have already judged. A suppressed hit is recorded as suppressed rather than dropped, because silence must never read back as a clean result.']];

/* Rules, lists and suppression as one object: three steps on one card. The rule reads your fields, a list hits, the hit
   is recorded as suppressed rather than dropped. The step's own words swap under the card, one at a time. */
function Rules() {
  const [ref, live] = useLive(0.3);
  const [paused, pauseBtn] = usePause({ position: 'relative', right: 'auto', top: 'auto' });
  const [at, setAt] = useState(0);
  const [mine, setMine] = useState(false);
  const [n, setN] = useState(0);
  const run = live && !paused;
  useEvery(3200, run && !mine, () => setAt((v) => (v + 1) % 3));
  useEvery(800, run && at === 1, () => setN((v) => v + 1));
  const hit = [2, 4, 1, 5, 0, 3][n % 6];
  return (
    <section className="w2-sec rk-rules" ref={ref}>
      <DepthParallax className="w2-wrap rk-pair">
        <div className="rk-pair-h" data-depth="0.5">
          <Decode as="h2" className="w2-headline" text="Rules, lists and suppression" />
          <p className="rk-dev">In development.</p>
        </div>
        <div className={'rk-rule s' + at} data-depth="1.6">
          <div className="rk-rule-tabs" role="tablist" aria-label="Rules, lists and suppression" onKeyDown={(e) => { const k = { ArrowRight: (at + 1) % 3, ArrowLeft: (at + 2) % 3, Home: 0, End: 2 }[e.key]; if (k === undefined) return; e.preventDefault(); setMine(true); setAt(k); e.currentTarget.children[k]?.focus(); }}>
            {RULES.map(([t], i) => (
              <button key={t} type="button" role="tab" aria-selected={at === i} tabIndex={at === i ? 0 : -1} onClick={() => { setMine(true); setAt(i); }}><h3>{t}</h3></button>
            ))}
            <span className="rk-pause">{pauseBtn}</span>
          </div>
          <div className="rk-rule-stage" aria-hidden="true" data-depth="1.2">
            <p className="rk-rule-r x-mono"><b>rule</b><span>your own fields</span></p>
            <ul className="rk-rule-l">{LISTS.map((t, i) => <li key={t} className={at >= 1 && i === hit ? 'on' : ''}>{t}</li>)}</ul>
            <div className="rk-rule-h">
              <span className="rk-rule-step on">{LISTS[hit]}</span>
              <i className={at === 2 ? 'on' : ''} />
              <motion.b className="rk-rule-stamp x-mono" initial={false} animate={{ opacity: at === 2 ? 1 : 0, rotate: at === 2 ? -6 : 0, scale: at === 2 ? 1 : 1.2 }} transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}>suppressed</motion.b>
            </div>
          </div>
          <div className="rk-rule-d">
            {RULES.map(([t, d], i) => <p key={t} className={at === i ? 'on' : ''} aria-hidden={at !== i}>{d}</p>)}
          </div>
        </div>
      </DepthParallax>
    </section>
  );
}

/* Platforms: the declare stack is the screen; the paragraph on why the two planes stay apart opens from its words. */
function Platforms() {
  const [ref, live] = useLive(0.25);
  const [d] = useRun(5, 1100, live, 4);
  return (
    <section className="w2-sec rk-platsec" ref={ref}>
      <div className="w2-wrap rk-pair flip">
        <div className="rk-pair-h">
          <Decode as="h2" className="w2-headline" text="Platforms and marketplaces" />
          <p className="rk-dev">In development.</p>
          <p className="rk-plat-l">If you run a platform, your risk is your sellers as much as your buyers. Risk will <em>declare</em> a control against a subject — hold a payout, set a reserve, restrict a merchant, block a suspect transaction — and the money plane will read it. Risk will never move money itself.</p>
          <Detail label="That separation is deliberate." title="Platforms and marketplaces" kicker="In development">
            <p>That separation is deliberate. The thing that decides and the thing that pays should not be the same thing, and a control that is a written record rather than a side effect is one you can still account for a year later.</p>
          </Detail>
        </div>
        <div className="rk-ctrl" aria-hidden="true">
          {['hold a payout', 'set a reserve', 'restrict a merchant', 'block a suspect transaction'].map((c, i) => (
            <span key={c} className={d === i ? 'on' : ''}><b className="x-mono">declare</b>{c}</span>
          ))}
          <em className={'x-mono' + (d === 4 ? ' on' : '')}>money plane reads it</em>
        </div>
      </div>
    </section>
  );
}

const TIERS = [
  ['Lite', 'The smallest useful shape: screening on one stage, the shipped rules, and the record behind every decision.'],
  ['Standard', 'The full lifecycle — signup, payment and post-purchase — with rules and lists of your own.'],
  ['Plus', 'A model trained on your own events, with the search over model shape that finds which one to use.'],
  ['Pro', 'Platform and marketplace controls, the compliance face alongside the decide plane, and the retention that goes with it.'],
];

/* How it connects, drawn: your system sends what it knows, Risk returns a decision; the processor is never touched. */
function Flow() {
  const [ref, live] = useLive(0.2);
  return (
    <div className={'rk-flow' + (live ? ' on' : '')} ref={ref} aria-hidden="true">
      <span className="rk-flow-n x-mono">your system</span>
      <span className="rk-flow-w"><i /></span>
      <span className="rk-flow-n ink x-mono">Risk</span>
      <span className="rk-flow-back x-mono">an action, a score and the reasons</span>
      <span className="rk-flow-p x-mono">Keep the processor you have</span>
    </div>
  );
}

function ConnectPlans() {
  const [ref] = useLive(0.1);
  const [mine, setMine] = useState(false);
  const [lref, llive] = useLive(0.6);
  const [tier, setTier] = useRun(4, 1400, llive && !mine, 3);
  return (
    <section className="w2-sec rk-plans" ref={ref}>
      <div className="w2-wrap">
        <div className="rk-conn">
          <div>
            <Decode as="h2" className="w2-headline" text="How it connects" />
            <p className="w2-lede rk-conn-l">In development. Risk will ingest signals and return a decision. Everything about how you take money stays where it is.</p>
          </div>
          <div className="rk-conn-r">
            <Flow />
            <div className="rk-conn-d">
              {[['Keep the processor you have', 'Risk takes signals and returns a decision. It never touches a processor, so nothing about your payment stack has to move and there is no migration to schedule.'], ['Pure API', 'One call from your own system: send what you know, get back an action, a score and the reasons. A signup, a payment, a session and an agent are the same call — the stage is a field, not a different endpoint.']].map(([t, d]) => (
                <Detail key={t} label={t} title={t} kicker="How it connects"><p>{d}</p></Detail>
              ))}
            </div>
          </div>
        </div>
        <div className="rk-split">
          <Decode as="h2" className="w2-headline" text="Plans" />
          <p className="w2-lede">In development. Four tiers, each a subscription with screens included and metered beyond that on the Hanzo bill you already have. A screen is one decision about one transaction, account or customer. Nothing here is priced yet.</p>
        </div>
        <ol className="rk-ladder" ref={lref}>
          {TIERS.map(([t], i) => (
            <li key={t} className={i === tier ? 'on' : ''} style={{ '--h': 52 + i * 16 + '%' }}>
              <button type="button" aria-pressed={i === tier} onClick={() => { setMine(true); setTier(i); }} onPointerEnter={() => { setMine(true); setTier(i); }}>
                <span className="rk-ladder-n x-mono" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                <h3>{t}</h3>
              </button>
            </li>
          ))}
        </ol>
        <div className="rk-tier-d" aria-live={mine ? 'polite' : 'off'}>
          {TIERS.map(([t, d], i) => <p key={t} className={i === tier ? 'on' : ''} aria-hidden={i !== tier}><b>{t}</b>{d}</p>)}
        </div>
      </div>
    </section>
  );
}

function Not() {
  const [ref, live] = useLive(0.2);
  const [g] = useRun(3, 1200, live, -1);
  return (
    <section className="w2-sec rk-not" ref={ref}>
      <div className="w2-wrap rk-not-grid">
        <div>
          <Decode as="h2" className="w2-headline" text="What this is not" />
          <ul className="rk-gaps" aria-label="Three unmet requirements">
            {['There is no report workflow', 'There is no filing clock', 'There is no confidentiality marking on a case'].map((x, i) => <li key={x} className={i === g ? 'on' : ''}>{x}</li>)}
          </ul>
          <Detail label="Three unmet requirements" title="What this is not">
          <p>Hanzo does not process payments — your processor does, and <A to="/commerce">Hanzo Commerce</A> owns the money plane. There is no dispute-network integration today: Risk assembles the evidence, you submit it. No figure on this page is a customer result, because the decide plane has not carried customer traffic yet. When it has, the numbers here will be ours and measured.</p>
          <p>Three unmet requirements decide whether this is enough on its own, and they are named here rather than left to be found. There is no report workflow — no drafting, no approval step, no filing. There is no filing clock, so no deadline is measured anywhere. And there is no confidentiality marking on a case, so nothing in the engine keeps a case note away from the customer. What is here is the detection and the record; the filing is not.</p>
          <p>Anti-money-laundering compliance and fraud prevention are related jobs, not one job. <strong>/v1/aml</strong> is the compliance face, <strong>/v1/risk</strong> is the decide plane, and one engine serves both. Nearby: <A to="/idv">identity verification</A> for proving who somebody is, <A to="/guard">Guard</A> for what a model is allowed to say, and <A to="/analytics">Analytics</A> for the event plane the model reads.</p>
          </Detail>
        </div>
        <div className="rk-next">
          <div className="rk-next-art" aria-hidden="true"><Sigil seed="hanzo-risk" data={[5, 20, 4, 3]} /></div>
          <h2 className="w2-kicker gx-stay rk-next-h">Next</h2>
          {[['Talk to us', 'Tell us which stage is costing you, and help shape what the tiers include.', '/contact-sales'], ['The API', 'One base URL and one key for every Hanzo capability, including this one.', '/api'], ['The engine, source available', 'The monitoring engine underneath the compliance face, under the Lux Ecosystem License. Read it and check the citations; commercial use outside a Lux network is licensed separately.', 'https://github.com/luxfi/aml']].map(([t, d, to], i) => (
            <A key={t} to={to} className={'rk-next-a' + (i === 0 ? ' first' : '')} {...(i === 0 ? { 'data-cta': 'risk.next' } : {})}><b>{t}</b><span>{d}</span><i aria-hidden="true">→</i></A>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Risk() {
  return (
    <main id="main" className="rk w2 gx">
      <NoJs />
      <Hero />
      <Faces />
      <DecidesOn />
      <Chapters />
      <Model />
      <Rules />
      <Platforms />
      <ConnectPlans />
      <Not />
      <section className="w2-sec tight rk-band" aria-label="Talk to us">
        <div className="w2-wrap rk-band-in">
          <p className="rk-band-t">One risk plane for accounts, payments and agents</p>
          <Magnetic strength={0.25}><A to="/contact-sales" className="w2-cta" data-thumb="Talk to us" data-cta="risk.close">Talk to us <i aria-hidden="true">→</i></A></Magnetic>
        </div>
      </section>
    </main>
  );
}
