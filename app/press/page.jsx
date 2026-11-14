// V2: 8/10 motion-map: magnet-grid + conveyor, pull-back, velocity-skew, orbit-in, stack-drop
// Persona: a journalist or analyst writing about Hanzo (MASTER: investors and press)
// Goal: leave with the kit, the facts and the right person to email
// CTA: "Contact Press Team" (mailto:press@hanzo.ai) in the hero and the shared sticky ask bar (data-thumb), data-cta press.hero; "Request Executive Bios" (press.bios) at the end; metric: one contact click
// Signature: magnet-grid: the hero's field of dots draws Hanzo's mark, bends toward the cursor or finger and ripples from a click or tap
// Beyond: the boilerplate copies in one press and the press email copies beside the address, so a writer leaves with both without retyping
// Deletes: the second copy of the kit plates, the 3x3 channel tiles and icon circles, the six partner boxes, the page tokens overriding deck greys, the aria-label-only captions, the magenta accent, springs, the portrait filter
import Press from '../../components/pages/Press';
import JsonLd from '../../components/JsonLd';

export const metadata = {
  title: 'Press Resources. — Hanzo AI',
  description: 'Everything you need to write about Hanzo AI, Inc. Download our press kit, access brand assets, and find media contacts.',
};

export default function Page() {
  return <><JsonLd route="/press" /><Press /></>;
}
