'use client';
/* Mori: build worlds, not just images. v2 launch page (Creative on Launch + Chapters, Hanzo's black and white). The film
   settles into a cube seen from above (a hexagon whose three near edges draw in); the viewport is the one dark room.
   Signature: a point cloud that turns. Points scattered through space settle onto a surface (SDF to mesh), then the
   shape keeps turning 360°; drag it to orbit (it carries your throw), and switch the view between wireframe, shaded
   and normals. (A drawn illustration of a mesh, not Mori's output.)
   Beyond: the studio map (Creative.jsx): every creative model serving your field, in its own words and colour.
   The film is the hero's and the cube's alone: each chapter and the fits picture draw their own object (MoriArt.jsx:
   a quad sphere closed by triangle fans, the six material maps, rooms rising on a metric grid, the export formats
   landing beside a turning solid, a camera scanning a cube). Order: chapters, fits, studio map, the dark viewport,
   then the model cards, so the two card grids never sit back to back.
   No chapter pane is ever empty: each object rests on its settled frame until its chapter arrives, then draws in.
   V2: 8/10 motion-map: particles + shrink-to-card, side-carousel, pixel-resolve, card-deal, scramble */
import { useEffect, useMemo, useRef, useState } from 'react';
import { Specs } from './Studio';
import { MoriFits } from './MoriArt';
import { ShrinkCard, CapsCarousel, PixelFilters, useEntrances } from './MoriMotion';
import { usePaused } from '../../v2/ModelFilm';
import Creative from './Creative';
import { poly, dense, focus } from '../../v2/Launch';
import { useLoop, fit, rng, arrows } from './live';
import './Mori.css';

const U = 72, V = 26;
const MODES = ['wireframe', 'shaded', 'normals'];

function mesh() {
  const P = new Float32Array(U * V * 3), N = new Float32Array(U * V * 3), S = new Float32Array(U * V * 3), r0 = rng(42);
  const at = (u, v) => {
    const a = (u / U) * Math.PI * 2, b = (v / V) * Math.PI * 2 + a; // a whole turn of twist, so the seam at u = U meets u = 0
    const r = 0.42 * (1 + 0.2 * Math.sin(3 * a + 2 * b));
    return [(1 + r * Math.cos(b)) * Math.cos(a), r * Math.sin(b) * 1.1, (1 + r * Math.cos(b)) * Math.sin(a)];
  };
  for (let u = 0; u < U; u++) for (let v = 0; v < V; v++) {
    const i = (u * V + v) * 3, p = at(u, v), pu = at(u + 0.01, v), pv = at(u, v + 0.01);
    const du = [pu[0] - p[0], pu[1] - p[1], pu[2] - p[2]], dv = [pv[0] - p[0], pv[1] - p[1], pv[2] - p[2]];
    let n = [du[1] * dv[2] - du[2] * dv[1], du[2] * dv[0] - du[0] * dv[2], du[0] * dv[1] - du[1] * dv[0]];
    const l = Math.hypot(...n) || 1; n = n.map((x) => x / l);
    P.set(p, i); N.set(n, i);
    // the scattered start: a random point in a ball (the field before it is meshed)
    let q; do { q = [r0() * 2 - 1, r0() * 2 - 1, r0() * 2 - 1]; } while (q[0] * q[0] + q[1] * q[1] + q[2] * q[2] > 1);
    S.set(q.map((x) => x * 1.9), i);
  }
  return { P, N, S };
}

function Viewport() {
  const stage = useRef(null), cv = useRef(null), deg = useRef(null);
  const geo = useMemo(mesh, []);
  const [mode, setMode] = useState(0);
  const S = useRef({ yaw: 0.6, pitch: 0.42, vy: 0, vp: 0, drag: null, born: 0, q: new Float32Array(U * V * 3), proj: new Float32Array(U * V * 3), nz: new Float32Array(U * V * 3), ox: new Float32Array(U * V), oy: new Float32Array(U * V), ptr: null, tap: null });

  const paused = usePaused();
  const pausedRef = useRef(paused);
  pausedRef.current = paused;
  useLoop(stage, (t, dt, still0) => {
    const still = still0 || pausedRef.current;
    const c = cv.current, s = S.current;
    if (!c) return;
    const { w, h, d } = fit(c, 1.5);
    const g = c.getContext('2d');
    if (!still) {
      s.born += dt;
      if (!s.drag) { s.yaw += (0.32 + s.vy) * dt; s.pitch += s.vp * dt; s.vy *= 0.94; s.vp *= 0.9; s.pitch += (0.42 - s.pitch) * dt * 0.6; }
    } else s.born = 9;
    const wide = w / d > 760;
    const cx = w * 0.5, cy = h * (wide ? 0.5 : 0.48), sc = Math.min(w * (wide ? 0.5 : 0.9), h) * 0.32;
    const cyw = Math.cos(s.yaw), syw = Math.sin(s.yaw), cp = Math.cos(s.pitch), sp = Math.sin(s.pitch);
    const { P, N, S: start } = geo, q = s.q, n = U * V;
    const { proj, nz } = s;
    for (let i = 0; i < n; i++) {
      const k = i * 3, delay = (i % V) / V * 0.5 + Math.floor(i / V) / U * 0.4;
      const e = Math.min(1, Math.max(0, (s.born - delay) / 1.4)), f = 1 - Math.pow(1 - e, 3);
      for (let j = 0; j < 3; j++) q[k + j] = start[k + j] + (P[k + j] - start[k + j]) * f;
      let x = q[k] * cyw - q[k + 2] * syw, z = q[k] * syw + q[k + 2] * cyw, y = q[k + 1];
      const y2 = y * cp - z * sp, z2 = y * sp + z * cp;
      const persp = 4.2 / (4.2 + z2);
      proj[k] = cx + x * sc * persp; proj[k + 1] = cy + y2 * sc * persp; proj[k + 2] = z2;
      const a = N[k], b = N[k + 1], cc = N[k + 2];
      const nx = a * cyw - cc * syw, nzz = a * syw + cc * cyw;
      nz[k] = nx; nz[k + 1] = b * cp - nzz * sp; nz[k + 2] = b * sp + nzz * cp;
    }
    // the cursor scatters the cloud: points near it are pushed out along the line from the cursor and ease back into
    // the shape once it moves on (a finger does the same while it rests on the canvas)
    const ptr = s.ptr, R = 120 * d, ox = s.ox, oy = s.oy, k8 = Math.min(1, (still ? 1 : dt) * 9);
    for (let i = 0; i < n; i++) {
      const k = i * 3;
      let tx = 0, ty = 0;
      if (ptr && !still) {
        const ddx = proj[k] - ptr.x * d, ddy = proj[k + 1] - ptr.y * d, dist = Math.hypot(ddx, ddy);
        if (dist < R) { const f = ((R - dist) / R) ** 1.4 * R * 0.9 / (dist + 1); tx = ddx * f; ty = ddy * f; }
      }
      ox[i] += (tx - ox[i]) * k8; oy[i] += (ty - oy[i]) * k8;
      proj[k] += ox[i]; proj[k + 1] += oy[i];
    }
    g.clearRect(0, 0, w, h);
    const settled = s.born > 2.2;
    const m = settled ? mode : 0;
    if (m === 0 || !settled) {
      g.lineWidth = d * 0.8;
      for (let b = 0; b < 3; b++) { // three depth bands, far to near
        g.strokeStyle = `rgba(255,255,255,${[0.08, 0.16, 0.3][b] * (settled ? 1 : Math.min(1, s.born / 2.2))})`;
        g.beginPath();
        for (let u = 0; u < U; u++) for (let v = 0; v < V; v++) {
          const i = (u * V + v) * 3, zb = proj[i + 2] > 0.35 ? 0 : proj[i + 2] > -0.35 ? 1 : 2;
          if (zb !== b) continue;
          const r = (((u + 1) % U) * V + v) * 3, dn = (u * V + ((v + 1) % V)) * 3;
          g.moveTo(proj[i], proj[i + 1]); g.lineTo(proj[r], proj[r + 1]);
          g.moveTo(proj[i], proj[i + 1]); g.lineTo(proj[dn], proj[dn + 1]);
        }
        g.stroke();
      }
      for (let i = 0; i < n; i++) {
        const k = i * 3, near = 0.35 + 0.65 * (1 - (proj[k + 2] + 1.5) / 3);
        g.fillStyle = `rgba(255,255,255,${Math.max(0.15, Math.min(1, near))})`;
        g.fillRect(proj[k] - d, proj[k + 1] - d, 2 * d, 2 * d);
      }
    } else {
      const quads = [];
      for (let u = 0; u < U; u++) for (let v = 0; v < V; v++) {
        const a = (u * V + v) * 3, b = (((u + 1) % U) * V + v) * 3, c2 = (((u + 1) % U) * V + ((v + 1) % V)) * 3, e = (u * V + ((v + 1) % V)) * 3;
        quads.push([proj[a + 2] + proj[c2 + 2], a, b, c2, e]);
      }
      quads.sort((x, y) => y[0] - x[0]);
      for (const [, a, b, c2, e] of quads) {
        if (m === 1) { // a key light from the top left and a rim from behind, two-sided, so it reads as a sculpted solid
          const dl = -nz[a] * 0.45 - nz[a + 1] * 0.6 - nz[a + 2] * 0.66, key = Math.abs(dl), rim = Math.pow(1 - Math.abs(nz[a + 2]), 3);
          const spec = Math.pow(key, 24);
          const v = Math.round(Math.min(245, 28 + Math.pow(key, 1.2) * 170 + rim * 40 + spec * 60)); g.fillStyle = `rgb(${v},${v},${v})`;
        }
        else { const v = Math.round(40 + (nz[a] * 0.3 + nz[a + 1] * 0.25 - nz[a + 2] * 0.45 + 0.5) * 200); const c = Math.max(24, Math.min(240, v)); g.fillStyle = `rgb(${c},${c},${c})`; } // normals as a grey relief, no hue
        g.beginPath(); g.moveTo(proj[a], proj[a + 1]); g.lineTo(proj[b], proj[b + 1]); g.lineTo(proj[c2], proj[c2 + 1]); g.lineTo(proj[e], proj[e + 1]); g.closePath(); g.fill(); g.strokeStyle = g.fillStyle; g.lineWidth = d * 0.75; g.stroke(); // the stroke closes the hairline gaps between quads
      }
    }
    if (deg.current) deg.current.style.transform = `rotate(${(s.yaw * 180) / Math.PI}deg)`;
  });

  const at = (e) => { const r = e.currentTarget.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; };
  const down = (e) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    const s = S.current;
    s.drag = { x: e.clientX, y: e.clientY, t: performance.now() };
    s.tap = { x: e.clientX, y: e.clientY, t: performance.now() };
    s.ptr = at(e);
  };
  const move = (e) => {
    const s = S.current, dr = s.drag;
    s.ptr = at(e);
    if (!dr) return;
    const dx = e.clientX - dr.x, dy = e.clientY - dr.y, dtm = Math.max(16, performance.now() - dr.t) / 1000;
    s.yaw += dx * 0.01; s.pitch = Math.max(-1.1, Math.min(1.3, s.pitch + dy * 0.008));
    s.vy = (dx * 0.01) / dtm * 0.5; s.vp = (dy * 0.008) / dtm * 0.5;
    s.drag = { x: e.clientX, y: e.clientY, t: performance.now() };
  };
  // a tap (no drag) blows the whole shape back into a cloud, and it assembles again
  const up = (e) => {
    const s = S.current, tp = s.tap;
    s.drag = null; s.tap = null;
    if (tp && e && Math.hypot(e.clientX - tp.x, e.clientY - tp.y) < 6 && performance.now() - tp.t < 350) s.born = 0.15;
    if (e && e.pointerType !== 'mouse') s.ptr = null;
  };
  const leave = () => { S.current.ptr = null; };

  return (
    <div className="mr-view" ref={stage}>
      <div className="mb-bar mr-bar"><i /><i /><i /><b>studio.hanzo.ai / <span>mori-1</span></b><em>mori</em><em>example</em></div>
      <canvas ref={cv} className="mr-cv" role="img" aria-label="A 3D mesh turning; drag or use the arrow keys to orbit" tabIndex={0} onKeyDown={(e) => { const s = S.current, k = { ArrowLeft: [-0.3, 0], ArrowRight: [0.3, 0], ArrowUp: [0, -0.2], ArrowDown: [0, 0.2] }[e.key]; if (k) { e.preventDefault(); s.yaw += k[0]; s.pitch = Math.max(-1.1, Math.min(1.3, s.pitch + k[1])); } }} onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up} onPointerLeave={leave} />
      <div className="mr-hud mr-tl">
        <p className="mb-mono">SDF ➔ QUAD MESH: 245,820 TRIS</p>
        <p className="mb-mono mr-spin"><i ref={deg} aria-hidden="true" />SPINNING · 360°</p>
      </div>
      <div className="mr-hud mr-tr">
        <p className="mb-mono">PBR CHANNELS: ALBEDO · NORMAL · ROUGHNESS · METALLIC</p>
        <p className="mb-mono">EXPORTS: GLTF · USDZ · FBX</p>
      </div>
      <div className="mr-modes mb-chips" role="radiogroup" aria-label="View" onKeyDown={arrows}>
        {MODES.map((m, i) => <button key={m} type="button" role="radio" aria-checked={mode === i} className="mb-chip" onClick={() => setMode(i)}>{m}</button>)}
      </div>
    </div>
  );
}

// the film closes into a cube seen from above: a hexagon, its three near edges drawn in once it settles
const hexAt = (W, H, wide) => {
  const c = wide ? [W * 0.71, H * 0.5] : [W / 2, H * 0.25], R = wide ? Math.min(H * 0.44, W * 0.25) : Math.min(W * 0.42, H * 0.2);
  return { c, V: [-90, -30, 30, 90, 150, 210].map((a) => [c[0] + R * Math.cos((a * Math.PI) / 180), c[1] + R * Math.sin((a * Math.PI) / 180)]) };
};
const HEX = poly((W, H, wide) => dense(hexAt(W, H, wide).V, 5));
const EDGES = (W, H, wide) => {
  const { c, V } = hexAt(W, H, wide);
  return (
    <svg className="mr-edges" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
      {[V[3], V[5], V[1]].map(([x, y], i) => <line key={i} x1={c[0]} y1={c[1]} x2={x} y2={y} />)}
    </svg>
  );
};

/* phones: Mori's own "Request access" is the one solid while it is on screen; the header's "Try Hanzo" steps back to an
   outline then (the same html[data-ask=quiet] Ask.jsx sets on desktop) and is solid again once it has gone by */
function usePhoneAsk() {
  useEffect(() => {
    const mq = matchMedia('(max-width: 700px)'), H = document.documentElement;
    const els = [...document.querySelectorAll("[data-cta='mori.first'], [data-cta='mori.hero']")];
    if (!els.length) return;
    const on = new Set();
    const set = () => { if (mq.matches && on.size) H.dataset.ask = 'quiet'; else if (mq.matches) delete H.dataset.ask; };
    const io = new IntersectionObserver((es) => { es.forEach((e) => { const r = e.boundingClientRect; if (e.isIntersecting && r.bottom > 60 && getComputedStyle(e.target.closest('.lv-name, .lv-head') || e.target).visibility !== 'hidden') on.add(e.target); else on.delete(e.target); }); set(); }, { threshold: [0, 0.5, 1] });
    els.forEach((el) => io.observe(el));
    mq.addEventListener('change', set);
    // Ask.jsx restores the header a moment after each route starts (and clears data-ask): keep ours while it holds
    const mo = new MutationObserver(() => { if (mq.matches && on.size && H.dataset.ask !== 'quiet') set(); });
    mo.observe(H, { attributes: true, attributeFilter: ['data-ask'] });
    // the headline's actions fade in as the film settles; when that ends, let Ask.jsx look again (it re-checks on
    // scroll), so the header never holds a second solid "Request access" beside the page's own
    const head = document.querySelector('[data-hero=mori]');
    const again = () => dispatchEvent(new Event('scroll'));
    head?.addEventListener('transitionend', again);
    return () => { io.disconnect(); mo.disconnect(); head?.removeEventListener('transitionend', again); mq.removeEventListener('change', set); if (mq.matches) delete H.dataset.ask; };
  }, []);
}

/* desktop settle: Launch fades the name out by 28% of the settle and cuts the headline in at 70%; between the two the
   stage would be film alone. While the settle is in that stretch, the stage carries data-mid and Mori.css brings the
   headline's lede, ask and crumb in early (the headline's own line cut-in still lands at 70%). */
function useMidWords() {
  useEffect(() => {
    const st = document.querySelector('.lv-stage[data-hero=mori]');
    if (!st || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let raf = 0;
    const check = () => {
      raf = 0;
      const pin = st.querySelector('.lv-pin'), r = st.getBoundingClientRect();
      const wide = pin && pin.getBoundingClientRect().width > 900;
      const span = r.height - (innerHeight - 60);
      const t = span > 0 ? (60 - r.top) / span / 0.8 : 0;
      // while the film still covers the left, the name stays (white on the film); once the film has drawn off to the
      // right, the headline's lede and ask come in on white until the headline cuts in
      const mid = !wide ? null : t > 0.15 && t < 0.6 ? 'name' : t >= 0.6 && t < 0.75 ? 'head' : null;
      if (mid) st.dataset.mid = mid; else delete st.dataset.mid;
    };
    const on = () => { if (!raf) raf = requestAnimationFrame(check); };
    addEventListener('scroll', on, { passive: true }); addEventListener('resize', on); check();
    return () => { removeEventListener('scroll', on); removeEventListener('resize', on); cancelAnimationFrame(raf); delete st.dataset.mid; };
  }, []);
}

export default function Mori() {
  usePhoneAsk();
  useMidWords();
  useEntrances();
  return (
    <Creative
      slug="mori"
      shape={HEX}
      pos="50% 75%"
      subject={[0.6, 0.62]}
      aim={(W, H, wide) => (wide ? null : focus(0.6, 0.62, W / 2, H * 0.25, 1.3, [W * 0.1, H * 0.04, W * 0.9, H * 0.46], [0.5, 0.75])(W, H))}
      over={EDGES}
      headClass="mr-v2"
      first="demo"
      flip
      renderCaps={(d) => <CapsCarousel d={d} />}
      fitsArt={(seen) => <MoriFits seen={seen} />}
      demo={
        <ShrinkCard>
          <section className="lv-room mr-room" data-room="dark" aria-label="Mori">
            <div className="mr-stage">
              <Viewport />
            </div>
            <div className="mr-below x-wrap">
              <div className="mr-specs"><Specs rows={[['Topology Quality', 'Quad-Dominant', 'Animation Ready'], ['UV Unwrapping', 'Automatic Atlas', 'On'], ['Geometry Engine', 'Hanzo Mori-1 Engine', 'SDF to mesh']]} /></div>
              <p className="mb-cap">An example of the canvas in Hanzo Design. Generation runs on Hanzo Cloud.</p>
            </div>
            <PixelFilters />
          </section>
        </ShrinkCard>
      }
    />
  );
}
