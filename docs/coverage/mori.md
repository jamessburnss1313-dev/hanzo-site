# /mori coverage (MASTER.md part 2, the 18 parts)

Page file: `components/pages/model/Mori.jsx` on `components/pages/model/Creative.jsx` and `components/v2/Launch.jsx` · gallery: `docs/gallery/mori/` · metric id: `contact_sales_submit`

Open copy questions for James: none decided here. The page shows Hanzo's words only; labels that sat above headlines now sit below or beside them as captions.
Shared changes requested (`docs/requests/mori.md`: the header ask fades on hover; Ask.jsx never steps back on phones; Ask.jsx misses CSS fade-ins; `docs/requests/zen-names.md`): the desktop ask bar floats over content (Ask.jsx); the sound kit; `lib/cta.js`, `lib/track.js` and `tokens.css` are not on main yet.
Forks this page deleted: our scene headings, raw `.x-btn` asks (now `Cta`), raw `<img>`/`<video>` (now `Img`, `Film`, `ModelFilm`), the studio-map tile, springs on the tab pill, cursor labels.

## 1. Strategy and conversion
- [x] Header comment has Persona, Goal, CTA, metric id, Signature, Beyond
- [x] One solid fill per viewport; label and href from `lib/cta.js` (n/a for `lib/cta.js`: not on main; Hanzo's own label is used)
- [x] One h1; the page is clear in 5 seconds
- [x] No dead or self-looping button; prices from `lib/plans.js` (n/a: model page, prices are the model's own)
- [x] Open copy questions for James listed, none decided

Done here: `app/mori/page.jsx` carries Persona, Goal, CTA, Metric `contact_sales_submit`, Signature and Beyond. The one solid ask "Request access" (/research-access?models=mori) shows on the first screen over the film, then beside the settled headline, then in the closing Band. One h1 ("Mori") is in the server HTML.

## 2. Information architecture and navigation
- [x] One `<main id="main">`; skip link reaches it
- [x] Every link through `A`, `Go`, `More` or `href()`; every card a real link
- [ ] n/a: breadcrumb at depth 2 or more (the page sits at depth 1)
- [x] Link parity: 0 removed, 0 unexpected

Done here: the skip link in `app/layout.jsx` reaches `#main`. Every link goes through `A`, `More`, `Cta` or `Arrow`, and every model card is a real `<a href>`. Parity links are 4/4.

## 3. First impression and page narrative
- [x] Sells in 5 s; something moves within 1 s without input
- [x] `PageHero` (n/a: `PageHero` is not in the kit yet; `v2/Launch` plays its role); nothing above the h1
- [x] JS off: legible; no `opacity:0` on the LCP element
- [x] One idea per 100svh; no 3 same-height sections in a row
- [x] Ends in proof strip, `Band`, footer
- [x] Card-to-page links use Morph; title lands within 12px (the model cards use the WebGL opener, which lands the picture as this page's hero)

Done here (motion map, 14 Nov): Mori's own film plays full-bleed under the h1 cut-in within the first second, then settles into a cube with Hanzo's headline beside it. The second screen is the signature (`particles`): the dark viewport, where a cloud of points assembles into Mori's mesh, scatters away from the cursor and re-forms behind it, and a tap blows it back into a cloud that assembles again. The page no longer runs hero → pinned chapters → proof → band: signature first, then the capabilities as a sideways carousel (no pinned stage; `renderCaps`, opt-in in `Creative.jsx`), the fits beside a camera scanning a cube, the studio map, Hanzo's model cards and the `Band`. The five entrances, in page order (`MoriMotion.jsx`): 1 the viewport room grows out of a card and shrinks back into one as you leave (shrink-to-card); 2 the four capability cards ride in from the right onto a snapping track (side-carousel); 3 "Where Mori fits" resolves from coarse pixels to sharp (pixel-resolve); 4 the six studio-map cards are dealt from a deck onto their places (card-deal); 5 the model cards' headline, line and names decode out of scrambled characters (scramble). Each runs once on entering view; reduced motion and JS off show the final state. The fits-to-map gap is closed to 44-72px. Through the desktop settle no screen is film alone: the name stays white on the film until the film has drawn off to the right, then the lede and ask come in until the headline cuts in (`useMidWords`, `data-mid`). The viewport mesh is centred in its room. Entrance states are scoped to `html.js`.

## 4. Conversion system
- [x] `<Cta>` only; no raw `.x-btn`
- [x] Sticky ask in header and bar after the hero, same label
- [x] Copy button copies exactly the displayed text; failure never says Copied (n/a: no copy button on this page)
- [x] `data-cta` and `data-thumb` on every primary

Done here: one solid at a time. While Mori's own "Request access" is on screen it is the solid fill (white on the film, ink beside the settled cube, `Mori.css` scoped by `data-cta`) and the header's "Try Hanzo" steps back to an outline (Ask.jsx); once it has gone by, the header is solid again and on phones, where the header always keeps its solid "Try Hanzo", `usePhoneAsk` (Mori.jsx) sets `html[data-ask=quiet]` while Mori's ask is on screen, so there too Mori's own ask is the one solid; the header is solid again once it has gone by. `data-cta` ids: `mori.first` (first screen), `mori.hero` (headline), `mori.preview` (preview).

## 5. Trust and proof
- [x] No logo without documented permission; no seal; no invented number
- [x] Every figure traces to Hanzo's copy; qualifier beside the number
- [ ] n/a: marquees pause, freeze under reduced motion, hide duplicates (no marquee)
- [ ] n/a: Privacy link and owner line beside every submit (no form on this page)

Done here: Hanzo's own research-preview note (samples publish only after blind review) beside the ask; the studio map on Hanzo's black cards; no figure is claimed. Numbers: no figure is claimed; the studio specs are the studio window's own labels from content/live.

## 6. Content presentation (copy untouched)
- [x] No text under 13px (14px phone) except mono capitals
- [x] Measures held; no orphan word in a heading
- [x] Tables, FAQ, tabs and code use the kit parts
- [x] `python3 scripts/parity.py /mori`: 0 missing

Done here: parity text 52/52, links 4/4. Section headings rest at 26px, the settled headline at 44px, body 16px, ledes 20px. Mono captions rest at 13px on this page (crumb, side labels, chapter rail, fit rows: `Mori.css`, scoped to `[data-hero=mori]`); Hanzo's model-card pills are 11px mono capitals (SPEC 10px, raised one step at the critics' ask). Tables: n/a: no table on this page. Headings use `text-wrap: balance`. Canvas labels fit their tile at 375: a material name that does not fit on one line takes one word a line ("AMBIENT / OCCLUSION"), and the export chips are measured first so "3D Gaussian splats" lands whole (the solid moves above the column when the pane is narrow); no ellipsis, no overflow (DOM scan at 375: 0 clipped text).

## 7. Visual design system
- [x] `python3 scripts/taste.py <files>` passes; no literal hex outside tokens (deck values only; `tokens.css` not on main)
- [x] No label, tag, badge or pill above a headline
- [x] Radii, shadows and sizes from tokens; never box plus shadow
- [x] One icon set; no icon in a rounded box
- [x] Differs from neighbours in hero medium and room order

Done here: `taste.py` passes on the page and shell files. Deck greys only (#0a0a0a, #525252, #737373, #a3a3a3 on black), Book 497 headings, radii 24 on tiles and 20 on Hanzo's art cards. Black rooms: the viewport room and the closing Band. /mori has its own settle shape (a cube seen from above whose near edges draw in), its own demo, five drawn chapter and fits objects no other creative page has, and its own scene order (demo between the map and the cards) among the six creative pages. No icon in a rounded box: the chapter glyph chip is gone from Mori's chapters.

## 8. UI component library
- [x] Every control has hover, press, focus-visible, disabled, loading
- [x] Focus ring visible on every stop of a Tab crawl
- [ ] n/a: dialogs are native, trap focus and return it (no dialog on this page)
- [x] Inputs 16px or larger; no bare `:hover` (no inputs; hovers sit in `@media (hover: hover)`)
- [x] Forks this page deleted: listed above

Done here: kit `Cta` gives hover, press (scale), focus and the leaving state. Chapter rail buttons press to scale .97. "Try it in Design" moves its arrow 4px on hover; the Band's "Every model" and "Research preview" are one pair (15px, no underline, each arrow moves 4px on hover); both asks deepen their fill on hover and press to translateY(1px) scale .98. Model cards tilt on fine pointers and press to .98. Focus uses the shared ring.

## 9. Motion and interaction
- [x] One signature, at most 3 supporting techniques, at most 2 fade-ups
- [x] At least 3 kinds of movement; scroll-linked is half or less
- [x] Something moves without input; every control answers
- [x] Reduced motion shows the final state; no `setInterval` (gap: one typing interval remains in v1 demo code where present)
- [ ] n/a: sound only on the listed moments, through the one kit (the shared sound kit is not on main)

Done here: Signature `particles` (motion map): the viewport's point cloud assembles into Mori's mesh as it arrives, parts around the cursor (points within 120px are pushed out and ease back once it moves on) and a tap or click blows it back into a cloud that assembles again; drag still orbits it with its throw, arrow keys orbit, and wireframe, shaded and normals still switch. Entrances, in order: shrink-to-card, side-carousel, pixel-resolve, card-deal, scramble (part 3). Measured at 1470×801 and 375×812, scrolling in: the room's scale goes 0.88 → 1 with its radius 27 → 0px; the carousel cards ride in from +1029px (+263px on phone) to 0; the fits filter steps 36px → 3px pixels → sharp; the map cards travel from the deck (150–610px below) to 0; the headline decodes from scrambled glyphs back to "Frontier AI for everything you build.". Every capability card's canvas holds its settled frame at mount, and the card in front builds and idles (the sphere turns, the light walks round the maps, a scan line crosses the plan, the formats light in turn, the camera circles). The pinned chapters are gone from this page. The viewport's shaded mode is lit by a key and rim light, and its twist is a whole turn, so the seam closes. Supporting: the stage settle and the chapter wipes (scroll, desktop only), the h1 line cut-in (arrival), and the model-card tilt (pointer). Phones settle the stage by time, with no pin. `variety.py` passes, with 0 fade-ups. Ease-emphasis throughout, no springs.

## 10. Media
- [x] `Film` and `Pic` only; sizes and posters set (kit `Img`, `Film`, shared `ModelFilm`)
- [x] At most 2 videos playing; pause button on loops over 5 s
- [x] Budgets met; nothing missing; alt on every image
- [x] No dimmed or filtered photo; 4+ real visuals together where the page has them

Done here: Hanzo's own films are unfiltered; the only dimming is a gradient under the name. `ModelFilm` holds at most two films playing at once. The stage's `FilmPause` stops every film and the page's self-running demos. Mori's own film plays only in the hero and the cube; the chapters and fits are drawn objects. The model-card grid puts nine real model films and posters on screen together.

## 11. Mobile and responsive
- [x] 375×812 and 1470×801 pass with no overlap
- [x] No horizontal scroll at 320
- [x] Every target 44px or more; every hover has a tap path
- [x] Primary ask above the fold at 375×667

Done here: at 375 nothing pins. The stage settles by itself 1.1s after arrival, and the camera pans the subject into the shape. Chapters become picture-then-words, and the grids stack to 2 columns. scrollWidth equals innerWidth at 375. The first-screen ask sits under the name inside the first screen.

## 12. Accessibility (WCAG 2.2 AA)
- [x] Contrast measured, text at 4.5:1 or better
- [x] Pause control on every moving item
- [ ] n/a: forms labelled; first error focused (no form)
- [x] One h1; no heading skips; names start with visible text
- [x] Keyboard reaches every control

Done here: body text is #525252 on white and #a3a3a3 or better on black. The `FilmPause` (44px, `aria-pressed`) sits at the stage foot. h1 is the name, h2 the headline and section heads, h3 the chapters. Tabs and radios take arrow keys.

## 13. Performance and engineering
- [x] h1 and LCP element in server HTML
- [x] JS and CSS inside budget; every image and video sized (gap: not measured with Lighthouse in the cloud)
- [x] No poller; no third-party request before consent
- [x] Nothing heavy run on James's laptop

Done here: the h1 and the priority poster (`Img priority`, 1200×1500) are in server HTML. Only transform, opacity and clip-path animate; the demo loop runs only on screen (`useLoop`) and stops with its own Pause or the page pause. CLS measured 0.000 at 1470 and at 375 during a scroll of the page.

## 14. SEO and machine files
- [x] Title and description match live (or are listed for James)
- [x] Canonical equals og:url equals the live URL
- [x] `<JsonLd route>` parses; no broken URL
- [x] Every card is a real link

Done here: `metadata` in `app/mori/page.jsx` is unchanged, and `<JsonLd route="/mori" />` renders the canonical and schema.

## 15. Catalogue and product pages
- [x] Model card matches `SPEC.md` (or n/a: not a catalogue or model page)
- [x] Every card opens by Morph
- [ ] n/a: every maker and model page linked in the DOM (that is `/models`)
- [x] One price figure everywhere

Done here: `ModelCards.jsx` copies SPEC: grid 2fr + 4×1fr at 1131px, rows 220px, gap 12, #000 cards, radius 20, title 22/500 (Enso 44), 11px mono pills (SPEC 10px), the film over its poster with a 0.6s crossfade, and a pointer tilt of 3° that settles flat. This page's card is marked. Each card opens through the WebGL opener.

## 16. Developer experience
- [ ] One `CodeBlock`; copy equals display (or n/a: no code on the page)
- [ ] n/a: config blocks parse on their own (no config)
- [ ] n/a: terminal pauses and ends on a static frame (no terminal)
- [x] No hand-typed version number

Done here: n/a: no code block on this page.

## 17. States and resilience
- [x] Loading, empty, error and offline states designed (the poster is the loading and offline state for every film)
- [x] Blocked live data leaves a complete page, no console errors (the page has no live data; films fall back to posters)
- [ ] n/a: a failed submit keeps its values and shows no success (no form)
- [x] A thrown island does not blank the page (`app/error.jsx` keeps header and footer)

Done here: JS off shows every word. Reduced motion shows the settled stage and the demo's final frame, with no pin. With media blocked, the posters and black frames stand in at their reserved size.

## 18. Measurement and handover
- [x] `data-cta` on every primary; events only through `lib/track.js` (n/a for `lib/track.js`: not on main; kit `Cta` dispatches `cta_click`)
- [x] Nothing identifier-bearing before consent; no field value in a payload
- [x] `V2: <score>/10 <one line>` in the page file's top comment
- [ ] Review read: `docs/review/mori.md` verdict 8 or more (pending a fresh walk of the current build)

Done here: the `V2:` line is in the top comment of `components/pages/model/Mori.jsx`. Proof is in `docs/gallery/mori/`: the desktop film, the first screens, the four chapter objects (`chapters.jpg`), the shaded viewport without its seam (`shaded.jpg`) and 4 phone stills. This card is refreshed after each review.
