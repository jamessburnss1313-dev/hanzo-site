# /search coverage (MASTER.md part 2, the 18 parts)

Page file: `components/pages/cloud/Search.jsx` · gallery: `docs/gallery/search/` · metric id: `api_key_created`

Open copy questions for James: "Search mode" (`c4_search_mode`); "Which plan fits" (`c4_plan_fits`); "Projects" (`c4_projects`); "Products" (`c4_products`). Each is in `content/ui-strings.json` as needs_james; until approved the control is icon-only or the name is for screen readers only. Also: the example console in the drawer (gateway, payments-api, checkout-web, docs-site, "Every request enters here, so the limiter does too.") is live hanzo.ai/search's own copy (parity fails without it), so it stays although it is not about search; James to decide whether live should show search rows.
Shared changes requested (`docs/requests/search.md`): the phone header's "Try Hanzo" should go quiet while the hero's solid "Read the docs" is on screen, as desktop already does.
Forks this page deleted: the old two-ending close (one band now), the hand-made eyebrow over the h1, native range inputs (now `.l2-range`).

Measured on the dev server at 1470×801, 375×667 and 320×640 with `audit.cjs` (Playwright), JS on and off.

## 1. Strategy and conversion
- [x] Header comment has Persona, Goal, CTA, metric id, Signature, Beyond
- [x] One solid fill per viewport; label and href from `lib/cta.js`
- [x] One h1; the page is clear in 5 seconds
- [x] No dead or self-looping button; prices from `lib/plans.js`
- [x] Open copy questions for James listed, none decided

Done here: Persona is a developer adding search to their docs or product; the one ask is Hanzo's "Read the docs" (`data-cta` primary in the hero, "close" as the later solid), metric `api_key_created` (developers, MASTER §1) on its own header line. `lib/cta.js` is not merged yet, so the label is the live page's own. h1 count 1. $99, $1,450 and Custom are printed from Hanzo's live pricing copy (parity 103/103); lib/plans.js has no Search plan. Every button changes something on screen.

## 2. Information architecture and navigation
- [x] One `<main id="main">`; skip link reaches it
- [x] Every link through `A`, `Go`, `More` or `href()`; every card a real link
- [ ] Breadcrumb at depth 2 or more (n/a: /search is depth 1)
- [x] Link parity: 0 removed, 0 unexpected

Done here: `<main id="main" data-ask="off">`; the layout's "Skip to content" targets `#main`. 12 links in main, all through `A` or `Cta`. `python3 scripts/parity.py /search` reports every live link present. No breadcrumb: the page sits at depth 1.

## 3. First impression and page narrative
- [x] Sells in 5 s; something moves within 1 s without input
- [x] `PageHero`; nothing above the h1
- [x] JS off: legible; no `opacity:0` on the LCP element
- [x] One idea per 100svh; no 3 same-height sections in a row
- [x] Ends in proof strip, `Band`, footer
- [ ] Card-to-page links use Morph; title lands within 12px (n/a: no card on this page opens another page)

Done here: Hero is rise (centred title, the object big and low, settling up); the object is a search bar the size of the screen; "Kubernets" types itself from 0.1 s and the four modes take turns, so the query typing and the mode pill moves within the first second. `PageHero` is not merged; the existing equivalent (`StageHero` or the page's own hero with the same line-mask cut-in, 700 ms ease-emphasis) is used, and the mono caption sits under the h1. JS off: h1 "Hanzo Search" at opacity 1, 0 hidden headings or paragraphs. Motion map (James, 7 Nov): no pinned scene any more; the order is hero → four ways → how it works → pricing → frameworks → close. Entrances in page order: the hero object opens through eight venetian strips (blinds); the four ways are cards that stick 18px lower each and pile up at the top (sticky-stack); the dark room's content flies in from translateZ(-2400px) (zoom-through); pricing starts at scale 2.6 and pulls back to the whole sheet (pull-back); frameworks open as a circle from the last place pressed or pointed (grow-from-point). Each runs once on entering view; `html:not(.js)` and reduced motion show the final state. Rooms: hero (light) → four ways stack (light) → how it works (dark, steps run by themselves) → pricing (quiet) → frameworks (light) → closing band (dark, centred: the hero's bar full width retypes the query and fuses two lists into one rank, then the head and ask under it, unlike the split left-copy/right-object close on /stream). The live page has no proof strip, so it ends on the band and the footer.

## 4. Conversion system
- [x] `<Cta>` only; no raw `.x-btn`
- [x] Sticky ask in header and bar after the hero, same label
- [x] Copy button copies exactly the displayed text; failure never says Copied
- [x] `data-cta` and `data-thumb` on every primary

Done here: 0 `.x-btn` without `data-cta` in main; CTAs found: primary*, primary-2, plan-build, plan-scale, plan-enterprise, close*, close-view-on-github, deploy (* = solid). `data-ask="off"` is gone, so the shared `Ask.jsx` reads the hero's `data-thumb="Read the docs"`. Desktop (measured): on the first screen the header's "Try Hanzo" is quiet (`html[data-ask=quiet]`) and the hero's "Read the docs" is the one solid; after the hero the header button reads "Read the docs", solid (`data-cta="header-ask"`). Phone (≤700px): the header keeps its solid "Try Hanzo", so the page sets the hero "Read the docs" quiet (outlined) and the shared slim bar carries it after the hero; first-screen solids measured: 1. The close band carries `data-ask-hide` (Finale). Copy is the kit `Copy`, which copies the prompt string it shows. 1 `data-thumb` in main.

## 5. Trust and proof
- [x] No logo without documented permission; no seal; no invented number
- [x] Every figure traces to Hanzo's copy; qualifier beside the number
- [ ] Marquees pause, freeze under reduced motion, hide duplicates (n/a: no marquee)
- [ ] Privacy link and owner line beside every submit (n/a: nothing is submitted)

Done here: No partner logos; product names appear as text only. Parity holds every printed figure. Demo values (counts, offsets, machine names) are labelled examples in the header comment and drawn as objects, not claims.

## 6. Content presentation (copy untouched)
- [x] No text under 13px (14px phone) except mono capitals
- [x] Measures held; no orphan word in a heading
- [x] Tables, FAQ, tabs and code use the kit parts
- [x] `python3 scripts/parity.py /search`: 0 missing

Done here: Small text: 0 runs under 13px on desktop, 0 under 14px on the phone (mono capitals excepted). Sizes follow the deck: h1 52px (40 phone), section heads 26px, h3 17px, lede 20px, body 15px, figures 64px Air, growing only in their moment. Lede 44ch, body 66ch, headings balanced. Code: the agent prompt in the band (kit Copy copies the exact prompt). Parity: 0 missing.

## 7. Visual design system
- [x] `python3 scripts/taste.py <files>` passes; no literal hex outside tokens
- [x] No label, tag, badge or pill above a headline
- [x] Radii, shadows and sizes from tokens; never box plus shadow
- [x] One icon set; no icon in a rounded box
- [x] Differs from neighbours in hero medium and room order

Done here: `taste.py` OK on the page JSX and CSS; only the deck neutrals. `Search.css` holds its greys as page-scoped tokens (`--se-paper` … `--se-body`, one declaration line); every rule reads `var(--se-*)`, 0 other literal hex. Captions sit under headings. Radii 6, 8, 12, 16, 20, 24 only (the 14/10/7/2px values are gone). The fitted plan takes the ink ring only (no shadow); the selected mode pill is a 1px inset line, not a raised shadow. Icons are one inline 16px stroke set. /world was the other centred hero; it now sits beside its globe.

## 8. UI component library
- [x] Every control has hover, press, focus-visible, disabled, loading
- [x] Focus ring visible on every stop of a Tab crawl
- [x] Dialogs are native, trap focus and return it
- [x] Inputs 16px or larger; no bare `:hover`
- [x] Forks this page deleted: listed below

Done here: Hover sits under `@media (hover: hover)` and changes fill or border only; press is scale .97 in 90 ms; focus-visible draws a 2px ink or white ring; disabled controls drop to 40%. Nothing on the page loads data, so no loading state. Dialogs: the example console opens in the shared Drawer ("Console", Hanzo's word). Inputs: two sliders in "Which plan fits" (labelled, 44px). Forks deleted: see the top of this card.

## 9. Motion and interaction
- [x] One signature, at most 3 supporting techniques, at most 2 fade-ups
- [x] At least 3 kinds of movement; scroll-linked is half or less
- [x] Something moves without input; every control answers
- [x] Reduced motion shows the final state; no `setInterval`
- [ ] Sound only on the listed moments, through the one kit (n/a: the page plays no sound of its own; the kit owns it)

Done here: Signature: flip-board (MOTION-MAP). The hero's results are a departure board, one tile per character (rank, document, where it matched); when the mode changes, by itself every 4.2 s or pressed, each tile that differs flips through letters (70 ms rotateX per flap, one timer for the board) and lands on the new ranking; reduced motion sets the values at once. Verified in Playwright at 1470, 375 and 320: pressing RRF gives 6 distinct board states in 0.5 s and a different final ranking. Entrances: see part 3; Playwright logged each section taking `.in` and its moving part passing through 11 to 437 distinct values during a wheel walk at every width. Supporting: typewriter and streamed answer (time), gliding mode pill (state). `scripts/variety.py` OK. Kinds: idle (the board, the dark room stepping every 4.2 s while in view, the closing bar retyping once), time, state, pointer (grow-from-point, hover holds), with no scroll-scrubbed scene. Each card's picture starts at 60% in view (`useInView`), so the lists fuse and the answer streams while you look. Selected mode and framework rows now answer hover too (selected framework slides 10→16px). Also idle on arrival: chapter 01's missing "e" drops in and underlines; the vector map's lines draw when seen; the frameworks take turns every 2.6 s while on screen until you pick one; the plan finder's sliders roll up to their defaults once. Own Playwright walk (5 frames 1 s apart per screen, no input): desktop 11/13 screens move (STILL: pricing after its roll, footer), phone 10/18. Timers are timeout chains (`useTick`), no `setInterval`. Reduced motion (`useCalm`) renders the settled frame. No springs; entrances run 0.55 to 1.1 s on ease-emphasis or ease-in-out.

## 10. Media
- [ ] `Film` and `Pic` only; sizes and posters set (n/a: no photo or video)
- [x] At most 2 videos playing; pause button on loops over 5 s
- [ ] Budgets met; nothing missing; alt on every image (n/a: 0 images, 0 without alt)
- [ ] No dimmed or filtered photo; 4+ real visuals together where the page has them (n/a: no photos)

Done here: 0 videos. The moving objects are drawn in HTML and SVG; each loop over 5 s carries a 44px pause button (2 on the page): the hero bar (first in the object) and the dark room (first in the room); the RAG chapter stream and the closing replay play once and rest.

## 11. Mobile and responsive
- [x] 375×812 and 1470×801 pass with no overlap
- [x] No horizontal scroll at 320
- [x] Every target 44px or more; every hover has a tap path
- [x] Primary ask above the fold at 375×667

Done here: Overflow 0px at 375 and 0px at 320. Under 900px the hero "GitHub", the close's "View on GitHub" and "Deploy to Cloud" are 44px tall (inline-flex, min-height 44px); a Playwright sweep of every link and button in main at 375×812 found 0 under 44px. The "typo fixed" chip is nowrap and stays inside its row; the hero object keeps a 16px gutter. The primary ask's bottom edge sits at 362px on a 667px screen. Pinned scenes stack below 900px; every hover state also answers a tap.

## 12. Accessibility (WCAG 2.2 AA)
- [x] Contrast measured, text at 4.5:1 or better
- [x] Pause control on every moving item
- [x] Forms labelled; first error focused
- [x] One h1; no heading skips; names start with visible text
- [x] Keyboard reaches every control

Done here: Lowest measured text contrast 6.67:1 (0 runs flagged). Headings 12333323332233322 with 0 skips. Pause controls: the hero bar (first in the object) and the dark room (first in the room, `aria-pressed`). Every input has a label or a register name; nothing validates, so there is no error to focus. Controls are native buttons, links and inputs.

## 13. Performance and engineering
- [x] h1 and LCP element in server HTML
- [ ] JS and CSS inside budget; every image and video sized (not measured by this chat; no media to size)
- [x] No poller; no third-party request before consent
- [x] Nothing heavy run on James's laptop

Done here: `curl /search/` returns the h1 in the HTML. Demos run only while on screen (`useInView`) and stop when paused or off screen. No fetch, poller or third-party script on the page. 0 console errors at both widths (0 desktop, 0 phone). The plan sliders' fill (`--p`) is rendered only after hydration, so server and client HTML agree (no hydration warning; 0 console errors or warnings over 4 fresh loads). CLS over a full walk: 0.0045 desktop, 0.0040 phone (the streamed answer reserves its full height with a hidden copy; the close's list keeps a 234px floor on phone).

## 14. SEO and machine files
- [x] Title and description match live (or are listed for James)
- [x] Canonical equals og:url equals the live URL
- [x] `<JsonLd route>` parses; no broken URL
- [x] Every card is a real link

Done here: Title "Hanzo Search — keyword and meaning in the same query". Canonical https://hanzo.ai/search/, og:url https://hanzo.ai/search/. 2 JSON-LD blocks, all parse. Metadata comes from `content/pages.json` through the route file.

## 15. Catalogue and product pages
- [ ] Model card matches `SPEC.md` (or n/a: not a catalogue or model page)
- [ ] Every card opens by Morph (n/a: no cards that open pages)
- [ ] Every maker and model page linked in the DOM (n/a)
- [x] One price figure everywhere

Done here: Not a model page. Cloud product anatomy: identity (hero), console (Drawer), the four modes as the fact strip, openable steps in "How it works", the band. Prices: $99, $1,450 and Custom are printed from Hanzo's live pricing copy (parity 103/103); lib/plans.js has no Search plan.

## 16. Developer experience
- [x] One `CodeBlock`; copy equals display (or n/a: no code on the page)
- [x] Config blocks parse on their own
- [x] Terminal pauses and ends on a static frame
- [x] No hand-typed version number

Done here: Code: the agent prompt in the band (kit Copy copies the exact prompt). The agent prompt is one string shown and copied as is. No version numbers are typed into the page.

## 17. States and resilience
- [ ] Loading, empty, error and offline states designed (n/a: the page reads no live data)
- [x] Blocked live data leaves a complete page, no console errors
- [ ] A failed submit keeps its values and shows no success (n/a: no submit)
- [x] A thrown island does not blank the page

Done here: Every word is in the server HTML and every demo is local, so a blocked network still shows the whole page; JS off was checked above. Each demo is its own component; the page has no shared runtime state to lose.

## 18. Measurement and handover
- [x] `data-cta` on every primary; events only through `lib/track.js`
- [x] Nothing identifier-bearing before consent; no field value in a payload
- [x] `V2: <score>/10 <one line>` in the page file's top comment
- [ ] Review read: `docs/review/search.md` verdict 8 or more

Done here: `data-cta` on every primary (kit `Cta`); the page imports no analytics itself. `V2:` line present in `components/pages/cloud/Search.jsx`. Last critic verdict on file: 6/10 (walked an earlier version); its fixes 1–3 and 5 are done here, fix 4 (search rows in the drawer) is held by copy parity (listed for James); this version waits for the next walk.
