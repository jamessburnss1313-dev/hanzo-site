# /registry coverage (MASTER.md part 2, the 18 parts)

Page file: `components/pages/cloud/Registry.jsx` (+ `Registry.css`) · route: `app/registry/page.jsx` · gallery: `docs/gallery/registry/` · metric id: `api_key_created`

Open copy questions for James: "View Source" and "View on GitHub" both point at the `github.com/hanzoai` org page, not a registry repo (Hanzo's links, kept as they are).
Shared changes requested (`docs/requests/<page>.md`): none.
Forks this page deleted: the page CSS that forced the header's "Try Hanzo" to an outline; the second white "repository window" in the chapters (now the layer stack) and its six grey row lists (handshake, repos, artifacts, tags, people); the switch label that repeated the dark room's h2; the swap row that repeated the hero lede; the forever-looping push; the spring knob; a drop shadow on a non-floating row; the shared `LaunchConsole` (generic services, Builds caption) for a page-local registry console with the same words and links; the shared `RelatedCards` grey Sigil boxes for page-local cards drawn as layer stacks; the separate "Get started" strip and the Paste block, now folded into the close; off-deck greys (#a1a1a6, #6e6e73, #0b0b0c and seven more).

Tick what applies. Strike the rest as `n/a: reason`. Fill each `Done here:` line with one or two sentences of evidence (a value, a file, a number). A part counts once its `Done here:` line has text.

## 1. Strategy and conversion
- [x] Header comment has Persona, Goal, CTA, metric id, Signature, Beyond
- [x] One solid fill per viewport; label and href from Hanzo's own hero link
- [x] One h1; the page is clear in 5 seconds
- [x] No dead or self-looping button; n/a prices: no prices on the page
- [x] Open copy questions for James listed, none decided

Done here: "View Source" is the hero's one solid (`data-cta="registry.hero"`); the shared Ask keeps the header outlined while it is on screen, then carries "View Source" solid in the header for the rest of the page (the page no longer overrides it). One h1 "Hanzo Registry".

## 2. Information architecture and navigation
- [x] One `<main>`; skip link reaches it (shared shell)
- [x] Every link through `A`; every related card a real link
- [x] n/a breadcrumb: depth 1
- [x] Link parity: 0 removed, 0 unexpected

Done here: `python3 scripts/parity.py /registry`: links 12/12. Order (breaks the shared cloud order on purpose): push → dark room "Delete the dockerconfigjson secret", straight off the lede's last words → "Built on Hanzo IAM" pinned stack (per 46svh, about 3.2 screens of scroll) → the registry console (acme's repositories, each opening into its layers and tags) → related capabilities drawn as stacks → one close that carries "Get started with Registry", View on GitHub and the agent prompt (the page ends once).

## 3. First impression and page narrative
- [x] Sells in 5 s; something moves within 1 s without input
- [x] Stage hero with `LineMask` h1; nothing above the h1
- [x] JS off: legible; the h1 is not hidden
- [x] One idea per 100svh; heights vary (hero, 7-screen pin, dark room, console, rows, close)
- [x] Ends in close (`LaunchClose`), footer
- [x] Related card titles carry `data-morph` (the site's Morph opens them into their page)

Done here: The push starts at first paint (docker push → 401 naming IAM → token → signature → layers → v1.2.3 + cosign signature) inside one outlined window that tilts in (tilt-3d-hover), then rests on the signed image with a blinking prompt. Motion map (14 Nov): no pinned chapter stage; the second screen is the zoom map (the whole system around one registry, zooming into its layer stack). Order: hero → zoom map → dark room → registry console → related → one close.

## 4. Conversion system
- [x] Kit `lx-cta` asks; no raw `.x-btn`
- [x] Sticky ask in the header after the hero, same label "View Source"
- [x] Copy buttons copy the displayed text (Frame `Code`, `Paste`)
- [x] `data-cta` and `data-thumb` on every primary

Done here: `registry.hero` and `registry.close` both carry `data-thumb="View Source"`; the header button takes those words once the hero ask scrolls away.

## 5. Trust and proof
- [x] No logo, no seal, no invented number
- [x] Figures (401, /v2/) are Hanzo's words; names (acme, ana…) are labelled examples in the code header
- [x] n/a marquees: none
- [x] n/a submit: no form

Done here: Status is read by ✓, a filled !, strike-through and weight, never colour; the console keeps Hanzo's "Example project…" note.

## 6. Content presentation (copy untouched)
- [x] No text under 13px desktop, 14px phone
- [x] Measures held (lede 44ch)
- [x] Code uses Frame `Code`; chapters use `PinnedChapters`
- [x] `python3 scripts/parity.py /registry`: 0 missing

Done here: Parity 69/69 text, 12/12 links. "Related capabilities" and the chapter numbers raised to 13px (14px phone), "Agent prompt" and the close facts to 14px on phone. The credential sentence is said by Hanzo's lede, the pinned intro and the dark room only; the demo no longer repeats it.

## 7. Visual design system
- [x] `python3 scripts/taste.py` passes; every literal hex is on the deck ramp
- [x] No label above a headline (chapter numbers sit under the title)
- [x] The hero window is outlined, not raised; tiles flat
- [x] One icon set; no icon in a rounded box
- [x] Differs from neighbours

Done here: taste OK on both files. The chapters' object is one big inked stack of layer plates (about 330px plates, ink to #525252, a #f5f5f5 manifest plate) on the page's white with no window chrome, labelled on the object; the grey row lists are gone (one caption per chapter), so it no longer mirrors /o11y's or /metrics's white window; the hero is the only window. Section heads rest at 32px (26px phone); the dark room's ledger has one hairline.

## 8. UI component library
- [x] Every control has hover, press, focus-visible
- [x] Focus ring from the kit on every stop
- [x] n/a dialogs: none
- [x] No bare `:hover` (all inside `@media (hover: hover)`)
- [x] Forks this page deleted: listed above

Done here: Quickstart fills white on hover and presses .97; About IAM, the console title, "Deploy to Cloud" and "hanzoai" thicken their underline and press .97; Replay turns its arrow; the switch knob leans 4px; pause and replay are 44px. Console rows select on hover, click or Enter (the image panel restacks its layers); sidebar icons show their name on hover and focus; "Open in the console" fills ink. Related cards play their drawing on hover or focus (layers spread, the project frame tightens, the staging stack lifts, source lines become layers) and press .97.

## 9. Motion and interaction
- [x] One signature (the push that asks IAM first), supporting: line mask, pinned scene, wipe
- [x] Kinds: idle, pointer, time, state, arrival, scroll (scroll is under half)
- [x] Something moves without input; every control answers
- [x] Reduced motion shows the final state; no `setInterval`
- [x] n/a sound: shared kit

Done here: Signature `zoom-map`: a 240svh section whose sticky stage shows Hanzo IAM, acme, Builds, the OCI clients and Hanzo Cloud wired (flowing dashes) to one registry; scroll scales the map 1→3.4 and fades it while the layer stack grows 0.42→1, then the six facts arrive as tabs (hover, tap, ←/→; they walk on every 4.2 s until picked) and each acts on the stack (token seats as a password falls, org inks the top, signature and attestation dock, /v2/, a layer slides out, people fold). Entrances in order: 1 tilt-3d-hover (hero window tips back 24°/−18° and levels, then leans to a fine pointer), 2 pendulum (the system swings in from its top edge: −12°, 8°, −5°, 2.6°, −1°, 0), 3 opposite-drift (dark room words and terminal drift in from ∓140px with the scroll), 4 fold-out (console unfolds from a top hinge, rotateX −82°→0), 5 invert-flash (related cards arrive inverted, flash, then normal). Kept: the push once + Replay, carets, stack float, swap wipe, console build. Reduced motion: every entrance at rest, the zoom shown at its end. Verified frame by frame with Playwright at 1470×801 and 375×812.

## 10. Media
- [x] n/a Film/Pic: Hanzo has no Registry images or film; every object is product UI or drawn
- [x] n/a videos
- [x] n/a images
- [x] n/a photos

Done here: Objects are the terminal/registry window, the layer stack, the console, the agent prompt and the close's Sigil.

## 11. Mobile and responsive
- [x] 375×812 and 1470×801 pass with no overlap
- [x] No horizontal scroll at 320
- [x] Targets 44px or more; tapping a push step holds it (tap again to release)
- [x] Primary ask above the fold at 375×667

Done here: Phone: the terminal (cause) comes first, then acme/api where v1.2.3 and its signature land (effect); the console's image panel drops under its list; related cards become rows with a small drawing; the pinned window shows the stack plus one short caption per chapter inside 40svh; related titles 21px so "Environments" no longer breaks.

## 12. Accessibility (WCAG 2.2 AA)
- [x] Contrast 4.5:1 or better (#525252 lede on white, #a3a3a3 on black)
- [x] Pause control first in the demo; Replay once it rests
- [x] n/a forms
- [x] One h1; h2s per section; the switch is named by its h2 (`aria-labelledby`) with `aria-pressed`
- [x] Keyboard reaches every control

Done here: Reduced motion: push at end state, no caret blink, no float, swap without wipes.

## 13. Performance and engineering
- [x] h1 in server HTML
- [x] Page-local CSS only; no images
- [x] No poller; one setTimeout chain that stops off screen, paused, hovered or done
- [x] Filmed in the cloud

Done here: Animations are transform, opacity, clip-path and translate only.

## 14. SEO and machine files
- [x] Title and description from `content/pages.json` (unchanged)
- [x] Canonical unchanged
- [x] `<JsonLd route="/registry" />` unchanged
- [x] Every card is a real link

Done here: `app/registry/page.jsx` untouched.

## 15. Catalogue and product pages
- [x] n/a model cards: a cloud product page
- [x] n/a Morph
- [x] n/a maker links
- [x] n/a price

Done here: Cloud anatomy: identity (hero), console, facts (pinned chapters), the close.

## 16. Developer experience
- [x] Frame `Code` with copy; copy equals display
- [x] n/a config blocks
- [x] Terminal pauses and ends on a static frame (signed image + prompt)
- [x] No hand-typed version number (v1.2.3 is an example tag)

Done here: Login-and-push terminal in the dark room, agent prompt with Copy, Quickstart to docs.

## 17. States and resilience
- [x] Push states: running, paused, held (hover/tap), done (Replay)
- [x] No live data; page complete with no console errors
- [x] n/a submit
- [x] Islands are page-local and plain React

Done here: 0 console errors at 1470×801 and 375×812 (Playwright check, 7 Nov).

## 18. Measurement and handover
- [x] `data-cta` on every primary
- [x] Nothing before consent
- [x] `V2:` line in the page file's top comment
- [x] Review read: `docs/review/registry.md`

Done here: `registry.hero`, `registry.close`; gallery in `docs/gallery/registry/`.
