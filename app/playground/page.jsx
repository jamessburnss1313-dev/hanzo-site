// Signature: the playground, running — eight kinds of run take turns in one window on Hanzo's own model media (Iro develops, Koma's film plays, Kai's subject is found) with the run's tokens and cost filling beside it
// Beyond: the anatomy of a first request — scroll and "a key, a model name, and a message" lights one part at a time while the same part lights in the real curl request, then the Python client
// V2: 8/10 motion-map: drag-canvas + glitch-in, tile-flip, cover-slide, scramble, swing-door (pinned first-request scene removed)
// Persona: Developer
// Goal: open the Playground and run a first request
// CTA: Open the Playground → https://platform.hanzo.ai/playground (data-cta playground.hero, playground.close; the site's sticky ask bar carries it via data-thumb)
// Metric: api_key_created
import Playground from '../../components/pages/cloud/Playground';
import JsonLd from '../../components/JsonLd';
import INDEX from '../../content/pages.json';

export const metadata = { title: INDEX['/playground'].title, description: INDEX['/playground'].description };

export default function Page() {
  return <><JsonLd route="/playground" /><Playground /></>;
}
