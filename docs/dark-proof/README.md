# Dark-mode proof, group 1 (50 pages)

Each image is one page, full length: **live hanzo.ai in dark on the left, ours in dark on the right**, at 1470×801 (`<page>-1470.jpg`) and 375×812 (`<page>-375.jpg`). Captured 8 Nov from a production build of this branch merged with hanzo-handoff 806b74d2 (Next 16) (`HZ_LIVE_OFFLINE=1 npm run build`, `node scripts/serve.mjs`), device set to dark, reduced motion on (so animations sit still).

- **Dark:** `scripts/darkcheck.mjs` reports **0 issues on all 50 pages** at both widths (details: `darkcheck-summary.json`).
- **Light:** `scripts/lightcheck.mjs` against the code before this change reports **0 colour differences** on all 50 pages at both widths, for normal visitors. With reduce-motion on, `/benchmarks/cronquestions` differs only because the old build hit a hydration error that dropped the page’s `js` class (fixed here).
- **No sideways scroll and no console errors** on any page at either width (from the same captures).

| Page | 1470 | 375 | darkcheck 1470 / 375 | light diffs 1470 / 375 | sideways | console errors |
|---|---|---|---|---|---|---|
| `/` | [1470](home-1470.jpg) | [375](home-375.jpg) | 0 / 0 | 0 / 0 | no | 0 |
| `/about` | [1470](about-1470.jpg) | [375](about-375.jpg) | 0 / 0 | 0 / 0 | no | 0 |
| `/affiliate` | [1470](affiliate-1470.jpg) | [375](affiliate-375.jpg) | 0 / 0 | 0 / 0 | no | 0 |
| `/agents` | [1470](agents-1470.jpg) | [375](agents-375.jpg) | 0 / 0 | 0 / 0 | no | 0 |
| `/agents/crew` | [1470](agents_crew-1470.jpg) | [375](agents_crew-375.jpg) | 0 / 0 | 0 / 0 | no | 0 |
| `/analytics` | [1470](analytics-1470.jpg) | [375](analytics-375.jpg) | 0 / 0 | 0 / 0 | no | 0 |
| `/api` | [1470](api-1470.jpg) | [375](api-375.jpg) | 0 / 0 | 0 / 0 | no | 0 |
| `/authz` | [1470](authz-1470.jpg) | [375](authz-375.jpg) | 0 / 0 | 0 / 0 | no | 0 |
| `/auto` | [1470](auto-1470.jpg) | [375](auto-375.jpg) | 0 / 0 | 0 / 0 | no | 0 |
| `/automations` | [1470](automations-1470.jpg) | [375](automations-375.jpg) | 0 / 0 | 0 / 0 | no | 0 |
| `/base` | [1470](base-1470.jpg) | [375](base-375.jpg) | 0 / 0 | 0 / 0 | no | 0 |
| `/benchmarks` | [1470](benchmarks-1470.jpg) | [375](benchmarks-375.jpg) | 0 / 0 | 0 / 0 | no | 0 |
| `/benchmarks/cronquestions` | [1470](benchmarks_cronquestions-1470.jpg) | [375](benchmarks_cronquestions-375.jpg) | 0 / 0 | 0 / 0 (15 / 15 with reduce-motion: the old build’s hydration bug, see above) | no | 0 |
| `/beta` | [1470](beta-1470.jpg) | [375](beta-375.jpg) | 0 / 0 | 0 / 0 | no | 0 |
| `/beta/apply` | [1470](beta_apply-1470.jpg) | [375](beta_apply-375.jpg) | 0 / 0 | 0 / 0 | no | 0 |
| `/beta/research` | [1470](beta_research-1470.jpg) | [375](beta_research-375.jpg) | 0 / 0 | 0 / 0 | no | 0 |
| `/billing` | [1470](billing-1470.jpg) | [375](billing-375.jpg) | 0 / 0 | 0 / 0 | no | 0 |
| `/blockchain` | [1470](blockchain-1470.jpg) | [375](blockchain-375.jpg) | 0 / 0 | 0 / 0 | no | 0 |
| `/blockchain/bundler` | [1470](blockchain_bundler-1470.jpg) | [375](blockchain_bundler-375.jpg) | 0 / 0 | 0 / 0 | no | 0 |
| `/blog` | [1470](blog-1470.jpg) | [375](blog-375.jpg) | 0 / 0 | 0 / 0 | no | 0 |
| `/blog/kai-decision-models` | [1470](blog_kai-decision-models-1470.jpg) | [375](blog_kai-decision-models-375.jpg) | 0 / 0 | 0 / 0 | no | 0 |
| `/bot` | [1470](bot-1470.jpg) | [375](bot-375.jpg) | 0 / 0 | 0 / 0 | no | 0 |
| `/bounty` | [1470](bounty-1470.jpg) | [375](bounty-375.jpg) | 0 / 0 | 0 / 0 | no | 0 |
| `/brand` | [1470](brand-1470.jpg) | [375](brand-375.jpg) | 0 / 0 | 0 / 0 | no | 0 |
| `/buying-specialist` | [1470](buying-specialist-1470.jpg) | [375](buying-specialist-375.jpg) | 0 / 0 | 0 / 0 | no | 0 |
| `/captable` | [1470](captable-1470.jpg) | [375](captable-375.jpg) | 0 / 0 | 0 / 0 | no | 0 |
| `/careers` | [1470](careers-1470.jpg) | [375](careers-375.jpg) | 0 / 0 | 0 / 0 | no | 0 |
| `/careers/academic-research-intern` | [1470](careers_academic-research-intern-1470.jpg) | [375](careers_academic-research-intern-375.jpg) | 0 / 0 | 0 / 0 | no | 0 |
| `/chat` | [1470](chat-1470.jpg) | [375](chat-375.jpg) | 0 / 0 | 0 / 0 | no | 0 |
| `/chrome` | [1470](chrome-1470.jpg) | [375](chrome-375.jpg) | 0 / 0 | 0 / 0 | no | 0 |
| `/cli` | [1470](cli-1470.jpg) | [375](cli-375.jpg) | 0 / 0 | 0 / 0 | no | 0 |
| `/cloud/ai-metrics` | [1470](cloud_ai-metrics-1470.jpg) | [375](cloud_ai-metrics-375.jpg) | 0 / 0 | 0 / 0 | no | 0 |
| `/commerce` | [1470](commerce-1470.jpg) | [375](commerce-375.jpg) | 0 / 0 | 0 / 0 | no | 0 |
| `/compare` | [1470](compare-1470.jpg) | [375](compare-375.jpg) | 0 / 0 | 0 / 0 | no | 0 |
| `/compare/model-routing` | [1470](compare_model-routing-1470.jpg) | [375](compare_model-routing-375.jpg) | 0 / 0 | 0 / 0 | no | 0 |
| `/comparison` | [1470](comparison-1470.jpg) | [375](comparison-375.jpg) | 0 / 0 | 0 / 0 | no | 0 |
| `/computer` | [1470](computer-1470.jpg) | [375](computer-375.jpg) | 0 / 0 | 0 / 0 | no | 0 |
| `/console` | [1470](console-1470.jpg) | [375](console-375.jpg) | 0 / 0 | 0 / 0 | no | 0 |
| `/contact` | [1470](contact-1470.jpg) | [375](contact-375.jpg) | 0 / 0 | 0 / 0 | no | 0 |
| `/contact-sales` | [1470](contact-sales-1470.jpg) | [375](contact-sales-375.jpg) | 0 / 0 | 0 / 0 | no | 0 |
| `/crawl` | [1470](crawl-1470.jpg) | [375](crawl-375.jpg) | 0 / 0 | 0 / 0 | no | 0 |
| `/customers` | [1470](customers-1470.jpg) | [375](customers-375.jpg) | 0 / 0 | 0 / 0 | no | 0 |
| `/customers/damon-motorcycles` | [1470](customers_damon-motorcycles-1470.jpg) | [375](customers_damon-motorcycles-375.jpg) | 0 / 0 | 0 / 0 | no | 0 |
| `/dashboards` | [1470](dashboards-1470.jpg) | [375](dashboards-375.jpg) | 0 / 0 | 0 / 0 | no | 0 |
| `/dataroom` | [1470](dataroom-1470.jpg) | [375](dataroom-375.jpg) | 0 / 0 | 0 / 0 | no | 0 |
| `/datastore` | [1470](datastore-1470.jpg) | [375](datastore-375.jpg) | 0 / 0 | 0 / 0 | no | 0 |
| `/design` | [1470](design-1470.jpg) | [375](design-375.jpg) | 0 / 0 | 0 / 0 | no | 0 |
| `/desktop` | [1470](desktop-1470.jpg) | [375](desktop-375.jpg) | 0 / 0 | 0 / 0 | no | 0 |
| `/dev` | [1470](dev-1470.jpg) | [375](dev-375.jpg) | 0 / 0 | 0 / 0 | no | 0 |
| `/dns` | [1470](dns-1470.jpg) | [375](dns-375.jpg) | 0 / 0 | 0 / 0 | no | 0 |

Regenerate: `HZ_BASE=http://localhost:4181 PAGES=pages.txt node scripts/darkproof.mjs` (see docs/DARK-MODE.md).
