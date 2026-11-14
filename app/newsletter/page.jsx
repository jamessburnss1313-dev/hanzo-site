// Persona: a builder who wants Hanzo's releases in the inbox
// Goal: subscribe
// CTA: Subscribe (kit Cta newsletter.subscribe; the header carries it after the hero)
// Metric: lead_submit
// Signature: one-question: the form asks one thing at a time and slides to the next (address, check, sent); the paper writes each answer down and folds into an envelope.
// Beyond: the double opt-in drawn before you commit: subscribe, confirm the link, then the first issue; nothing in between.
// V2: 8/10 motion-map: one-question + stretch-scroll, shrink-to-card, noise-dissolve, card-deal, pixel-resolve
import Newsletter from '../../components/pages/Newsletter';
import JsonLd from '../../components/JsonLd';

export const metadata = {
  title: 'Subscribe to Hanzo AI Newsletter & Developer Updates — Hanzo AI',
  description: 'Opt in to receive frontier AI model announcements (Enso, Zen 6), developer tutorials, platform updates, and technical deep dives from Hanzo AI.',
};

export default function Page() {
  return <><JsonLd route="/newsletter" /><Newsletter /></>;
}
