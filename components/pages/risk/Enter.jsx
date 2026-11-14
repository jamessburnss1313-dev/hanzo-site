'use client';
/* Enter (page-local, /risk): the five ways /risk's main sections arrive (docs/MOTION-MAP.md), in page order:
   1 OrbitIn (Where this is today), 2 InkSpread (What it decides on), 3 SquashLand (the three chapters),
   4 VelocitySkew (Your data, your model), 5 DepthParallax (Rules, lists and suppression).
   Each one runs once when its section enters view. The server render is the final state (JS off is legible), the
   start state is only set on the client for a section still below the fold, and reduced motion keeps the final state. */
import { useEffect, useRef, useState } from 'react';
import { motion, animate, useReducedMotion, useScroll, useTransform, useVelocity, useSpring } from 'motion/react';

/* arms a section that starts below the fold; calls go() once it is `amount` in view */
function useArrive(amount, setStart, go) {
  const ref = useRef(null);
  const calm = useReducedMotion();
  useEffect(() => {
    const el = ref.current;
    if (!el || calm) return undefined;
    if (el.getBoundingClientRect().top < innerHeight * 0.9) return undefined; // already on screen: leave it be
    setStart(el);
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { io.disconnect(); go(el); } }, { threshold: amount });
    io.observe(el);
    return () => io.disconnect();
  }, [calm]); // eslint-disable-line react-hooks/exhaustive-deps
  return ref;
}
const items = (el) => [...el.querySelectorAll('[data-enter]')];
const EMPH = [0.16, 1, 0.3, 1];

/* 1. orbit-in: each [data-enter] item travels a curved arc (a quarter orbit around the section's centre) into place */
export function OrbitIn({ children, className = '' }) {
  const ref = useArrive(0.3, (el) => {
    items(el).forEach((it, i) => { it.style.opacity = '0'; it.style.transform = `rotate(${i % 2 ? 40 : -40}deg) translate(${i % 2 ? 260 : -260}px, 0) rotate(${i % 2 ? -40 : 40}deg)`; it.style.transformOrigin = '50% 50%'; });
  }, (el) => {
    items(el).forEach((it, i) => {
      const s = i % 2 ? 1 : -1;
      // a quarter orbit: rotate the radius from 40° to 0° while it shrinks to 0, counter-rotating the item upright
      animate(0, 1, { duration: 1.3, delay: i * 0.14, ease: [0.45, 0, 0.25, 1], onUpdate: (p) => {
        const a = 40 * (1 - p) * s, r = 260 * (1 - p) * s;
        it.style.transform = `rotate(${a}deg) translate(${r}px, ${-80 * Math.sin(Math.PI * p) * (1 - p)}px) rotate(${-a}deg)`;
        it.style.opacity = String(Math.min(1, p * 2.2));
      }, onComplete: () => { it.style.transform = ''; it.style.opacity = ''; } });
    });
  });
  return <div ref={ref} className={'rk-en-orbit ' + className}>{children}</div>;
}

/* 2. ink-spread: an organic blot (a noisy 32-point polygon) grows from the left third until it covers the section */
const blot = (s) => 'polygon(' + Array.from({ length: 32 }, (_, i) => {
  const t = (i / 32) * Math.PI * 2, r = s * (1 + 0.16 * Math.sin(3 * t + 0.6) + 0.09 * Math.sin(7 * t + 2.1) + 0.05 * Math.cos(11 * t));
  return `${(32 + r * Math.cos(t)).toFixed(2)}% ${(46 + r * Math.sin(t) * 1.35).toFixed(2)}%`;
}).join(', ') + ')';
export function InkSpread({ children, className = '' }) {
  // the observed box is the unclipped wrapper (an observer measures a clipped target as almost nothing)
  const ref = useArrive(0.25, (el) => { el.firstElementChild.style.clipPath = blot(0.5); }, (el) => {
    const ink = el.firstElementChild;
    animate(0, 1, { duration: 1.6, ease: [0.55, 0, 0.35, 1], onUpdate: (p) => { ink.style.clipPath = blot(0.5 + p * p * 140); }, onComplete: () => { ink.style.clipPath = ''; } });
  });
  return <div ref={ref} className={'rk-en-ink ' + className}><div className="rk-en-ink-in">{children}</div></div>;
}

/* 3. squash-land: each [data-enter] item drops in, squashes wide on landing, stretches back and settles */
export function SquashLand({ children, className = '' }) {
  const ref = useArrive(0.2, (el) => items(el).forEach((it) => { it.style.opacity = '0'; it.style.transform = 'translateY(-140px) scale(.92, 1.12)'; it.style.transformOrigin = '50% 100%'; }), (el) => {
    items(el).forEach((it, i) => {
      animate(it, { opacity: [0, 1, 1, 1, 1], y: [-140, 0, 0, -10, 0], scaleX: [0.92, 1, 1.1, 0.97, 1], scaleY: [1.12, 1, 0.84, 1.04, 1] },
        { duration: 0.95, delay: i * 0.16, times: [0, 0.42, 0.58, 0.78, 1], ease: ['easeIn', 'easeOut', 'easeOut', 'easeOut'] })
        .then(() => { it.style.transform = ''; it.style.opacity = ''; });
    });
  });
  return <div ref={ref} className={'rk-en-squash ' + className}>{children}</div>;
}

/* 4. velocity-skew: the section arrives skewed and straightens; from then on it leans with scroll speed and
   straightens when the page is still */
export function VelocitySkew({ children, className = '' }) {
  const calm = useReducedMotion();
  const [arrived, setArrived] = useState(false);
  const { scrollY } = useScroll();
  const v = useVelocity(scrollY);
  const lean = useSpring(useTransform(v, [-2400, 0, 2400], [6, 0, -6], { clamp: true }), { stiffness: 260, damping: 30 });
  const ref = useArrive(0.15, (el) => { el.style.transform = 'skewY(7deg) translateY(60px)'; el.style.opacity = '.0'; }, (el) => {
    animate(el, { skewY: [7, -2, 0], y: [60, 0, 0], opacity: [0, 1, 1] }, { duration: 0.9, times: [0, 0.7, 1], ease: EMPH }).then(() => { el.style.transform = ''; el.style.opacity = ''; setArrived(true); });
  });
  useEffect(() => { if (!ref.current || ref.current.getBoundingClientRect().top < innerHeight * 0.9) setArrived(true); }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <div ref={ref} className={'rk-en-skew ' + className}>
      <motion.div style={calm || !arrived ? undefined : { skewY: lean }}>{children}</motion.div>
    </div>
  );
}

/* 5. depth-parallax: [data-depth="n"] layers start spread apart by depth and close up as the section scrolls in,
   each at its own speed (deeper = slower) */
export function DepthParallax({ children, className = '' }) {
  const ref = useRef(null);
  const calm = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'start 0.25'] });
  useEffect(() => {
    if (calm || !ref.current) return undefined;
    const layers = [...ref.current.querySelectorAll('[data-depth]')];
    const apply = (p) => layers.forEach((l) => { const d = +l.dataset.depth; l.style.transform = p >= 1 ? '' : `translateY(${((1 - p) * d * 90).toFixed(1)}px) scale(${(1 - (1 - p) * d * 0.035).toFixed(3)})`; });
    apply(scrollYProgress.get());
    return scrollYProgress.on('change', apply);
  }, [calm, scrollYProgress]);
  return <div ref={ref} className={'rk-en-depth ' + className}>{children}</div>;
}
