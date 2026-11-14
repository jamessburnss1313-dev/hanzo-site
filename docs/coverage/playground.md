# /playground coverage (MASTER.md part 2, the 18 parts)

Page file: `components/pages/cloud/Playground.jsx` (+ `Playground.css`, route `app/playground/page.jsx`) · gallery: `docs/gallery/playground/` · metric id: `api_key_created`

Open copy questions for James: the Python sample ends in `KeysApi(api).get_keys().keys` (lists keys, does not call a model); kept word for word, question left to James. The window labels ("Tokens in", "Tokens out", "Time", "Cost", "Run ·") are not yet in the UI-string register.
Shared changes requested (`docs/requests/playground.md`): UI-string register entries; a hover and press for "Deploy to Cloud" in `LaunchClose`; the 14px phone floor for `LaunchClose`'s facts row; `scroll-behavior: auto` in the motion probe's phone walk.
Forks this page deleted: the page CSS that outlined the header's "Try Hanzo"; the `SettleStage` wrapper on the hero (replaced by a page-local CSS arrival that cannot snap); the springs on the kind pill and the decision tree.

## 1. Strategy and conversion
- [x] Header comment has Persona, Goal, CTA, metric id, Signature, Beyond
- [x] One solid fill per viewport; label and href from the page's own CTA ("Open the Playground")
- [x] One h1; the page is clear in 5 seconds
- [x] No dead or self-looping button
- [x] Open copy questions for James listed, none decided

Done here: Persona Developer, Goal "open the Playground and run a first request", metric `api_key_created` in both file headers. Hero has one solid "Open the Playground" beside the quiet "Read the API"; once it leaves view the header's own ask is solid (walk 7 Nov 16:36: header `rgb(10,10,10)` from s1 on desktop), and the close repeats "Open the Playground".

## 2. Information architecture and navigation
- [x] One `<main>` (shared chrome supplies `id="main"` and the skip link)
- [x] Every link through `A`; every card a real link
- n/a: breadcrumb (depth 1)
- [x] Link parity: 0 removed, 0 unexpected

Done here: parity.py `links 7/7`; the nine wall tiles and three related cards are `A` links to `/zen`…`/uta`, `/cli`, `/desktop`, `/cloud/api-keys`.

## 3. First impression and page narrative
- [x] Sells in 5 s; something moves within 1 s without input
- n/a: `PageHero` (not in the kit yet); the hero is LineMask h1 + lede + one ask + the running window, nothing above the h1
- [x] JS off: legible; no `opacity:0` on the LCP element
- [x] One idea per 100svh
- [x] Section order breaks the shared sequence: hero → drag canvas → related → dark room (paste + model films) → `LaunchClose`, footer
- [x] Card-to-page links use Morph (`data-morph` on the wall art, `data-morph-target` on the hero)

Done here (motion map, 14 Nov): the pinned first-request scene is gone; its sentence, curl and Python now live on the drag canvas, the page's second screen. The five sections enter, in order, by glitch-in (hero, CSS from first paint: sliced, inverted, offset, then still), tile-flip (60 brand-tone tiles, 36 on phones, flip edge-on corner to corner over the board), cover-slide (related rides up 220px over the board's foot), scramble (the dark room's words and model names decode from scrambled characters) and swing-door (the close swings in on its left hinge). All run once on entering view (`components/pages/playground/enter.js`); JS off and reduced motion show the final state. Proof: `docs/gallery/playground/d-glitch-in.mp4`, `d-tile-flip.mp4`, `d-glitch-sheet.jpg`, `p-entrances-sheet.jpg`.

## 4. Conversion system
- [x] Kit asks (`lx-cta`, `lx-ghost`); no raw `.x-btn`
- [x] Sticky ask: the header's solid ask after the hero; phone bar "Open the Playground" (shared `Ask.jsx`)
- [x] Copy copies exactly the displayed curl or Python text (each card's `Copy` takes the same `CURL` or `PY` string its `pre` renders); the caret is an `aria-hidden` element, not text
- [x] `data-cta` (playground.hero, playground.close) and `data-thumb` on both primaries

Done here: the page no longer outlines the header's "Try Hanzo"; the solid fill sits on the hero ask, then the header. "Deploy to Cloud" now leans 3px with a 2px underline on hover and presses 1px (page-local, request filed).

## 5. Trust and proof
- [x] No logo, no seal, no invented number
- [x] The meter shows proportions only, never numbers
- n/a: marquees (none)
- n/a: forms (none)

Done here: the run meter's bars are relative shapes (`RUN` array) with no figures printed; every figure-like word on the page is Hanzo's.

## 6. Content presentation (copy untouched)
- [x] No text under 13px (14px phone) except mono capitals
- [x] Measures held
- [x] Tabs use APG roles; code shown in `pre` with Copy
- [x] `python3 scripts/parity.py /playground`: 0 missing

Done here: parity `text 48/48 links 7/7`. The scene sentence rests at 44px Book 497 (was 56px/600) under a 26px h2; the only sub-13 run left is the shared "RELATED CAPABILITIES" mono capitals (12px). The LaunchClose facts row is lifted to 14px on phones.

## 7. Visual design system
- [x] `taste.py` passes
- [x] No label, tag, badge or pill above a headline
- [x] Radii 6/8/12/16/24/28/full only; never box plus shadow
- [x] One icon set
- [x] Differs from neighbours (the running Playground window and the self-reading request are its own)

Done here: `taste: OK (2 checked)`. Off-deck greys mapped (`#f5f5f7`→`#f5f5f5`, `#8e8e93`/`#aeaeb2`/`#a1a1a6`→`#a3a3a3`, `#d9d9de`→`#d4d4d4`, `#161618`/`#111`→`#171717`, `#ececf0`→`#ededed`); radii 10/14/22/5/3 → 8/12/24/6/full. `.pg-req` is outlined only (the 0 40px 100px shadow is gone); `.pg-input` and the selected code tab lost their shadows. The window's hairline is drawn above its own fills (`.pg-win::after`), so its right and bottom edges show. The UI is greyscale and so is Hanzo's model media on this page.

## 8. UI component library
- [x] Hover (inside `hover:hover`), press (.97 / 1px, 90 ms), focus-visible on kinds, phrases, code tabs, Copy, asks
- [x] Focus ring on the kind tabs (2px ink)
- n/a: dialogs (none)
- n/a: inputs (none; the window's "Hello" field is a drawing)

Done here: the kinds are an APG tablist (roving tabindex, ← → Home End, `aria-controls` to a `tabpanel`); the off code pane is `inert`. New hovers: the hero ask's arrow leans 4px, Copy fills, the selected code tab fills, the repo link's mark turns, a resting phrase greys and starts its underline.

## 9. Motion and interaction
- [x] One signature (motion map: `drag-canvas`) + the five assigned entrances; no pinned or sticky scene
- [x] Kinds: idle (the running window, the drifting board, caret, wall films), pointer (drag and throw the board, kind preview, phrase marks), time (the sentence reads itself once), state (kind pill, pause), arrival (the five entrances)
- [x] Something moves without input; every control answers
- [x] Reduced motion: no entrances, no drift; the board still pans by drag and arrow keys (a cut, no glide); no `setInterval`
- [x] Sound only through the shared kit

Done here: the drag canvas is an endless dotted board (2400×1200 desktop, a 2000px strip on phones) whose parts wrap around it; a pointer pans both ways, a finger pans sideways (`touch-action: pan-y`, so the page still scrolls), a release throws with inertia (0.94 friction), arrow keys glide 120px, and a drag never fires a click. Tapping a phrase glides the board to the curl card with that token marked. Verified with Playwright 14 Nov at 1470×801 (mouse drag moved the board from x −284 to −1179) and 375×812 (CDP touch drag from x −432 to −663); every section went armed → in; no horizontal scroll at 375 or 320.

## 10. Media
- [x] `Film` and `Img` only; sizes and posters set
- [x] One film at a time in the window and one on the wall; both have a pause
- [x] Alt from labels; decorative art `alt=""`
- [x] No dimmed photo; nine real model renders together in the dark room

Done here: Video paints `koma.webp` under the film (no blank panel while it loads); Audio now plays Oto's own film with the waveform along its foot; each kind names the model it shows (zen, iro, koma, oto, kai) in the bar and the run panel.

## 11. Mobile and responsive
- [x] 375×812 and 1470×801: no overlap
- [x] No horizontal scroll (`scrollWidth` 375 at 375)
- [x] Targets 44px on phones; hover previews have tap paths
- [x] Primary ask above the fold at 375×667

Done here: the lit kind is scrolled into the centre of the phone tab strip on every change; the hero asks wrap so the ask keeps its arrow; the clipped Python client rolls slowly through its window on phones.

## 12. Accessibility (WCAG 2.2 AA)
- [x] Contrast: body on white `#525252`/`#737373`; the 44px scene sentence at `#737373` on `#f5f5f5` is large text (3:1)
- [x] Pause control on the window and the wall
- n/a: forms
- [x] One h1; h2s below
- [x] Keyboard reaches every control (kinds by arrows)

Done here: the kind labels fade with the pill (300 ms) so the new label is never white on white mid-glide; the off code pane is `inert`; 0 `title=`.

## 13. Performance and engineering
- [x] h1 and lede in server HTML; Iro's image `priority`
- [x] Every image and film sized (1200×1500)
- [x] No poller; no third party
- [x] Nothing heavy run on James's laptop (all walks in the cloud)

Done here: the hero arrival is pure CSS (no layout work on hydration); the scroll ease-back is one `useTransform` on transform only.

## 14. SEO and machine files
- [x] Title and description from `content/pages.json`
- [x] Canonical from the shared layout
- [x] `<JsonLd route="/playground" />`
- [x] Every card is a real link

Done here: `app/playground/page.jsx` reads `INDEX['/playground']` for metadata and renders `JsonLd`.

## 15. Catalogue and product pages
- n/a: model card (`SPEC.md`): not a catalogue or model page; the wall uses model renders, not the model card
- [x] Wall tiles carry `data-morph` and open their model pages
- n/a: maker lists
- n/a: prices (none on the page)

Done here: the nine wall tiles link to `/zen`, `/enso`, `/kai`, `/iro`, `/koma`, `/koe`, `/mori`, `/oto`, `/uta`.

## 16. Developer experience
- [x] Copy equals display (the shared `Copy` copies the same `CURL`/`PY` string the `pre` renders)
- n/a: config blocks (no JSON config)
- [x] The scene ends static under reduced motion
- [x] No hand-typed version number

Done here: curl and Python are Hanzo's own, unchanged; the active token is marked inside the real request; the shared `CodeBlock` is not used here (the `pre` is page-local), listed as a known gap.

## 17. States and resilience
- [x] Video and Audio show their poster until the film plays
- [x] No live data on the page; complete with the API blocked; 0 console errors
- n/a: forms
- [x] Islands are self-contained; a failed film leaves its poster

Done here: own walk 7 Nov 16:36 at 1470×801 and 375×812: status 200, 0 console errors from this page.

## 18. Measurement and handover
- [x] `data-cta` on both primaries; events through the shared ask
- [x] Nothing identifier-bearing before consent
- [x] `V2:` line in `Playground.jsx` and `app/playground/page.jsx`
- [ ] Review read: `docs/review/playground.md` (6/10 at 15:24 read and answered; the re-walk is pending)

Done here: every fix in the 15:24 review's "Fixes (in order)" list is answered above; proof in `docs/gallery/playground/` (d.jpg, p.jpg, d-0..2.png, p-0..2.png, d.mp4).
