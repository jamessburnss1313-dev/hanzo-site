// Signature: one-question: How it works one step per screen, sliding to the next, the summary building beside it
// Beyond: the summary that builds as you answer, handing over to "Get your link"
// V2: 8/10 motion-map: one-question + slot-roll, word-shuffle, cursor-lens, card-deal, sticky-stack
import Referral from '../../components/pages/Referral';
import JsonLd from '../../components/JsonLd';

export const metadata = {
  title: 'Bring a builder to Hanzo — Hanzo AI',
  description: 'One link counts everyone who signs up through it, and who goes on to use Hanzo.',
};

export default function Page() {
  return <><JsonLd route="/referral" /><Referral /></>;
}
