# /network coverage (MASTER.md part 2, the 18 parts)

Page file: `components/pages/cloud/Network.jsx` (+ `.css`) · route: `app/network/page.jsx` · gallery: `docs/gallery/network/` · metric id: `api_key_created`

Open copy questions for James: none decided. Three to confirm: (1) the live page sets "Compute Marketplace" as an eyebrow over the h1; MASTER part 7 moves it, so it names the fabric's toolbar here, words unchanged; (2) "Buy Compute" is the live hero label and links to the docs (https://docs.hanzo.ai/docs/network), not to a purchase flow, so the metric it feeds is closest to `api_key_created` (the black room's "Get an API Key"); (3) the drawn UI strings of the demo ("ask the fabric for", "routing…", "idle · nothing billed", "attested ✓", "declared ✕", "Merkle root" …) are listed for the register in `docs/requests/network.md` #7.
Shared changes requested (`docs/requests/network.md`): Frame's Paste on the deck (page-local overrides until then); `Copy` press to .97; the sticky ask (the header says "Try Hanzo", the desktop bar floats); a hue in the shared nav icon; the pinned chapter count above the h3; `lib/cta.js` and `lib/track.js`; the drawn UI strings into `content/ui-strings.json`.
Forks this page deleted: the six-block chain (it told /node's facts with /node's pictures; the fabric is now the chapters' object), the white "Paste and ship" band (the prompt now lives in the black room), the endless demo loop (it runs once and rests), the floating "Compute Marketplace" panel with its shadow over the map, the white wash under the lede, the 128px title's halo, the springs on the picker, lend toggle and placement tag, the shadows on blocks, pills and packet, the opacity fade that failed contrast, the hairline-plus-fill on the ends, the arrow that slid on hover, the peer that scaled on hover, the 56px card titles, the eyebrows over the two ends' titles, every Apple-grey literal.

Tick what applies. Strike the rest as `n/a: reason`. Fill each `Done here:` line with one or two sentences of evidence (a value, a file, a number). A part counts once its `Done here:` line has text.

## 1. Strategy and conversion
- [x] Header comment has Persona, Goal, CTA, metric id, Signature, Beyond
- [x] One solid fill per viewport; label and href from `lib/cta.js` (n/a for the file: it does not exist yet; the label and href are Hanzo's live hero ask)
- [x] One h1; the page is clear in 5 seconds
- [x] No dead or self-looping button; prices from `lib/plans.js` (n/a: no prices)
- [x] Open copy questions for James listed, none decided

Done here: `Persona: Developer who needs compute · Goal: buy compute on hanzo.network · CTA: "Buy Compute" → docs.hanzo.ai/docs/network · Metric: api_key_created`, plus Signature, Beyond and `V2:`, head both `Network.jsx` and `app/network/page.jsx`. The critic's probe counts one solid per viewport at all desktop and phone stops; `fs-audit.cjs` sees only "Buy Compute" on the first screen.

## 2. Information architecture and navigation
- [x] One `<main id="main">`; skip link reaches it (the layout's skip link targets the one `<main>`)
- [x] Every link through `A`, `Go`, `More` or `href()`; every card a real link
- [x] Breadcrumb at depth 2 or more (n/a: depth 1)
- [x] Link parity: 0 removed, 0 unexpected

Done here: Every link is kit `A`; the two ends in the black room are real `<a>` cards (platform.hanzo.ai/api-keys, /node). `parity.py /network`: 5/5 links.

## 3. First impression and page narrative
- [x] Sells in 5 s; something moves within 1 s without input
- [x] `PageHero` (n/a for the component: not merged; the hero is the kit's `LineMask` h1, the lede, one ask and the live fabric); nothing above the h1
- [x] JS off: legible; no `opacity:0` on the LCP element
- [x] One idea per 100svh; no 3 same-height sections in a row
- [x] Ends in proof strip, `Band`, footer (`LaunchClose`: Sigil, "Get Network", the one ask, licence and repo)
- [x] Card-to-page links use Morph; title lands within 12px (the one card, "Provide Compute", carries `data-morph` into /node's `data-morph-target`; on the dev server the shared Morph cut instead of flying, see part 15)

Done here: Motion map (James, 7 Nov): no pinned scene (0 `.lx-pin`), and the order is hero → black room (two ends) → how it works → agent prompt → close, so it no longer reads hero → chapters → proof → band. Five entrances, one per section, page-local in `components/pages/network/Enter.jsx` + `Network.css`, each once on entering view, final state with JS off and under reduced motion: (1) hero split-merge (words from the left, graph from the right, "Hanzo" and "Network" from opposite sides; transform only, 3 s CSS failsafe); (2) black room grow-from-point (a circle opens from the last pointer position, the content scales .3 → 1); (3) how it works typewriter (the h2 types with a caret, then the facts and map arrive); (4) agent prompt zoom-through (translateZ -1800px → 0 in a 900px perspective); (5) close invert-flash (invert(1) for about 0.35 s, then back to paper). `samp.cjs` samples each property every frame at 1470×801 and 375×812 and sees every one play (e.g. zoom z-1800 → 0 in 1.2 s, flash invert 1 → 0). JS off: all text in the server HTML.

## 4. Conversion system
- [x] `<Cta>` only; no raw `.x-btn` (the kit's 48px `lx-cta`; swapped when the deck `Cta` lands)
- [x] Sticky ask in header and bar after the hero, same label: on desktop the shared header now carries a solid "Buy Compute" at every stop (8 Nov walk, `shot.cjs`), with no floating bar; on phones the slim bottom bar says "Buy Compute" after the hero while the header keeps the shared "Try Hanzo" (shared, `docs/requests/network.md` #3).
- [x] Copy button copies exactly the displayed text; failure never says Copied (Frame's Paste and the lend toggle use the kit `Copy`)
- [x] `data-cta` and `data-thumb` on every primary

Done here: The hero ask has `data-cta="network.hero" data-thumb="Buy Compute"`, the close `network.close` with the same thumb; `data-ask-name="Hanzo Network"` sits on the hero section inside `<main>`. "Copy hanzo fabric join" copies exactly the command shown. The sticky-ask gap is the shared header's and is filed, not hidden.

## 5. Trust and proof
- [x] No logo without documented permission; no seal; no invented number
- [x] Every figure traces to Hanzo's copy; qualifier beside the number
- [x] Marquees pause, freeze under reduced motion, hide duplicates (n/a: no marquee)
- [x] Privacy link and owner line beside every submit (n/a: no form)

Done here: The only figure is Hanzo's "a tenth" of the block reward (one ink cell of ten, chapter two). Peers, routes, the attested and declared marks and the Merkle root are drawn and say so in the header comment; no seal, no logo strip.

## 6. Content presentation (copy untouched)
- [x] No text under 13px (14px phone) except mono capitals
- [x] Measures held; no orphan word in a heading
- [x] Tables, FAQ, tabs and code use the kit parts (n/a for tables, FAQ and tabs: none; the code is Frame's Paste)
- [x] `python3 scripts/parity.py /network`: 0 missing

Done here: Parity 37/37 text, 5/5 links. Type rests at the kit sizes: h1 52, chapter intro 44, chapter titles 32, the black room's heading 26 and its two ends 32, lede 20, body 16, captions 13/14; 12px only for Zen Mono capitals. The "01 / 06" counts sit under each chapter title (hidden on phones by the kit to keep the words clear of the bottom bar; the rail shows the place).

## 7. Visual design system
- [x] `python3 scripts/taste.py` passes; no literal hex outside tokens (deck values only)
- [x] No label, tag, badge or pill above a headline
- [x] Radii, shadows and sizes from tokens; never box plus shadow
- [x] One icon set; no icon in a rounded box
- [x] Differs from neighbours in hero medium and room order

Done here: `taste.py` OK; values #0a0a0a, #525252, #737373, #a3a3a3 (on black and graphite only), #d4d4d4, #e4e4e7, #f2f2f2, #f5f5f5, #171717, #262626, #000. The chapters' fabric is a flat #f5f5f5 tile (24), the ends flat #171717 tiles, nothing has a shadow. "call it" and "serve it" now sit under their titles. Neighbour /node keeps the machine card, the terminal and a quiet room; /network is the map page from hero to chapters, with a black room.

## 8. UI component library
- [x] Every control has hover, press, focus-visible, disabled, loading (n/a for disabled and loading: nothing here is ever unavailable or fetches)
- [x] Focus ring visible on every stop of a Tab crawl (kit: 2px ink with a white halo, inverted in the black room)
- [x] Dialogs are native, trap focus and return it (n/a: no dialog)
- [x] Inputs 16px or larger; no bare `:hover` (n/a for inputs: none; every hover is inside `@media (hover:hover)`)
- [x] Forks this page deleted: listed at the top

Done here: The model picker is an APG `radiogroup` (roving tabindex, arrow keys move and choose); the lend toggle uses `aria-pressed`; both fill #e4e4e7 on hover, press .97 in 90 ms, and their white pill slides 300 ms ease-emphasis. Text links press 1px; the ends deepen #171717 → #262626 and press .97. The route readout never cuts the peer you point at (it drops middle hops instead).

## 9. Motion and interaction
- [x] One signature, at most 3 supporting techniques, at most 2 fade-ups
- [x] At least 3 kinds of movement; scroll-linked is half or less
- [x] Something moves without input; every control answers
- [x] Reduced motion shows the final state; no `setInterval`
- [x] Sound only on the listed moments, through the one kit (n/a: the shared sound kit has not landed)

Done here: Signature `graph` (living graph), in the first screen: the hero peers start bunched in the middle and settle outward on springs (link springs to their own length, repulsion, an anchor that breathes ±0.7), then keep breathing; drag a peer (mouse) and let go and it springs back pulling its links (`mm.cjs`: 75.7% → 59.7% while dragged → 75.9% after release); point at (or tap) a peer and its paths light, the route from you dashed and its own links in ink, and every peer on them is named ("peer 02 · 03 · 04 · 06 · 07" for peer 04, at both sizes). The request demo then walks the settled graph once and a quiet bead keeps the resting route alive. Supporting: the six facts change the same fabric (state; an ink bead runs each fact's links; the map walks the facts every 5 s until you pick one), the sliding pills, the strand in the black room (pointer), the five entrances (above). Reduced motion: the settled graph, no entrances. Scroll-linked: only the hero map growing to 1.16.

## 10. Media
- [x] `Film` and `Pic` only; sizes and posters set (the kit's `Img` with w/h 1200×1500 until `Pic` lands)
- [x] At most 2 videos playing; pause button on loops over 5 s (no video; the fabric's 44px pause is first in its toolbar)
- [x] Budgets met; nothing missing; alt on every image (decorative crops in an `aria-hidden` map: `alt=""`, lazy, async)
- [x] No dimmed or filtered photo; 4+ real visuals together where the page has them

Done here: Every peer that has a model loaded wears Hanzo's own render of it (`/models/zen|kai|enso|koe|uta.webp`, a 32px crop on the mark, unfiltered): seven renders on the hero map at once, and again in chapter four with uta landing on peer 07. The rest is drawn product UI plus the close's Sigil from figures [10, 6].

## 11. Mobile and responsive
- [x] 375×812 and 1470×801 pass with no overlap
- [x] No horizontal scroll at 320
- [x] Every target 44px or more; every hover has a tap path
- [x] Primary ask above the fold at 375×667

Done here: Phone order is title, lede, ask (y≈300), then the full-width fabric and its toolbar. In the chapters the fabric sits in a 42svh window over the words (it was 38svh with a blank bottom third); only the tags that carry the chapter show, and `pinchk.cjs` passes 7/7. In chapter four peer 03's tags open to its left and, on phones, only its "kai" hit shows, and uta's placement tag sits above peer 07; `chk2.cjs` finds 0 tags touching another peer's ring at 1470 and 375. The route preview is pointer-only; the tap path is the model picker. No sideways scroll at 320.

## 12. Accessibility (WCAG 2.2 AA)
- [x] Contrast measured, text at 4.5:1 or better
- [x] Pause control on every moving item
- [x] Forms labelled; first error focused (n/a: no form)
- [x] One h1; no heading skips; names start with visible text
- [x] Keyboard reaches every control

Done here: #737373 on white 4.74:1, #525252 on #f2f2f2 7.0:1 and on #f5f5f5 7.4:1, #a3a3a3 on #171717 7.1:1 and on #000 8.3:1; the struck "region ▾" no longer fades (it measured 1.9:1). Headings: h1, h2 (intro), h3 ×6, h2 (black room), h2 (close). The maps are `aria-hidden`; the answer line is `aria-live`; the radiogroup takes arrow keys.

## 13. Performance and engineering
- [x] h1 and LCP element in server HTML
- [x] JS and CSS inside budget; every image and video sized
- [x] No poller; no third-party request before consent
- [x] Nothing heavy run on James's laptop

Done here: The h1 is real text cut in by CSS at first paint. The walk is a `setTimeout` chain that runs once, only on screen, unpaused and not pointed at. The five renders are lazy, sized (1200×1500) and 18–64 KB each (uta loads only once placed). Motion is transform, opacity, stroke and clip-path; filming ran in the cloud.

## 14. SEO and machine files
- [x] Title and description match live (or are listed for James)
- [x] Canonical equals og:url equals the live URL (owned by the shared layout)
- [x] `<JsonLd route>` parses; no broken URL
- [x] Every card is a real link

Done here: `app/network/page.jsx` takes `metadata` from `content/pages.json` unedited and renders `<JsonLd route="/network" />`; both ends are real `<a href>`.

## 15. Catalogue and product pages
- [x] Model card matches `SPEC.md` (n/a: not a catalogue or model page)
- [ ] Every card opens by Morph: partly. "Provide Compute" → /node carries `data-morph` and /node's hero `data-morph-target`, but on the dev server the shared Morph cut over instead of flying (its 700 ms hold expires while /node compiles); the flight belongs to `components/Morph.jsx`.
- [x] Every maker and model page linked in the DOM (n/a)
- [x] One price figure everywhere (n/a: no prices)

Done here: A cloud product on the shared anatomy: identity (title and "Compute Marketplace"), the live object, six facts on the same object, the two ends, the close.

## 16. Developer experience
- [x] One `CodeBlock`; copy equals display (the agent prompt and the lend command copy exactly what they show)
- [x] Config blocks parse on their own (n/a: no config block)
- [x] Terminal pauses and ends on a static frame (n/a: no terminal; that is /node's)
- [x] No hand-typed version number

Done here: `hanzo fabric join` / `hanzo runner` and the agent prompt are the code on the page; each Copy writes the displayed string. No version numbers.

## 17. States and resilience
- [x] Loading, empty, error and offline states designed (n/a: nothing is fetched; the page is whole at first paint)
- [x] Blocked live data leaves a complete page, no console errors
- [x] A failed submit keeps its values and shows no success (n/a: no form)
- [x] A thrown island does not blank the page (Sigil, Phone and Cursor boundaries are the shared layer's)

Done here: The fabric's own states are designed: routing, a peer with the model loaded, a placement, a previewed peer ("nothing loaded"), paused, at rest after its run, idle and declared peers. look2 and the probes log 0 page console errors (the footer's hydration badge is shared).

## 18. Measurement and handover
- [x] `data-cta` on every primary; events only through `lib/track.js` (n/a for the file: not built yet; ids are in place)
- [x] Nothing identifier-bearing before consent; no field value in a payload
- [x] `V2: <score>/10 <one line>` in the page file's top comment
- [ ] Review read: `docs/review/network.md` verdict 8 or more: read; it is 7/10 on `0d2a243`. Its fixes 1, 2, 4, 5 and 6 are done here; fix 3 (the sticky ask) is shared and filed. Awaiting the re-review.

Done here: `network.hero` and `network.close` are set. Gallery: `docs/gallery/network/d.mp4`, `d.jpg`, `p.jpg` (filmed with `film.cjs` after the fixes, no errors). My own score is 8/10; the critic's verdict decides.
