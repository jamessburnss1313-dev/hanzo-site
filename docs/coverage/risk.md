# /risk coverage (MASTER.md part 2, the 18 parts)

Page file: `components/pages/apps/Risk.jsx` (+ `Risk.css`) · gallery: `docs/gallery/risk/` · metric id: `contact_sales_submit`

Open copy questions for James: dial labels not in `content/ui-strings.json` ("the line", "action", "reasons · tap one to set it back to neutral", "stage: '<stage>'", "Illustration. No figure on this page is a customer result."); chapter visual captions ("alert → case", "same call · same record · same model", "N of 4 facts"); the closing band repeats the h1's words.
Shared changes requested: `docs/requests/templates.md` (covers every Business 2 page).
Forks this page deleted: the framed dial card and its corner name, the 76px score and the ±weights (no invented digits), the floating dial and chapter pauses, the "+"-only openers (now labelled with Hanzo's words), the 26px caps "Next", the black "summon a person" pill (now underlined ink), every spring, the colour comments, the inert `data-cursor` attributes.

## 1. Strategy and conversion
- [x] Header comment has Persona, Goal, CTA, metric id, Signature, Beyond
- [x] One solid fill per viewport; "Talk to us" → /contact-sales
- [x] One h1; clear in 5 seconds
- [x] No dead button
- [x] Copy questions listed

Done here: gate: 1 h1, max 1 solid per viewport; the close has its own band with the solid ask.

## 2. Information architecture and navigation
- [x] One `<main id="main">`; shared skip link
- [x] Every link through `A`
- [x] n/a breadcrumb
- [x] Link parity 0 removed

Done here: parity links 7/7.

## 3. First impression and page narrative
- [x] Sells in 5 s; the needle and action move within 2.2 s
- [x] h1 CSS cut-in painted by the server; nothing above it
- [x] JS off legible
- [x] Hero gauge → statement and two faces → three chapters → cards → dark room → rules → plans → what it is not → band
- [x] Ends on a band ("Talk to us"), then footer
- [x] n/a Morph

Done here: motion map (7 Nov): the page no longer reads hero → pinned chapters → proof → band. Order is now hero (the decoding h1 beside the dial), Where this is today, What it decides on, the three chapters as plain alternating rows (the pinned stage is gone), the dark room, Rules, Platforms, How it connects + Plans, What this is not, band. Every word is in the server HTML; JS off shows the final state.

## 4. Conversion system
- [x] Kit `A` + `.w2-cta`
- [x] Sticky ask "Talk to us" (`data-thumb`)
- [x] n/a copy button
- [x] `data-cta` on hero (`risk.hero`), band (`risk.close`) and the Next card (`risk.next`)

Done here: hero and band both carry `data-thumb="Talk to us"`.

## 5. Trust and proof
- [x] No logo, seal or invented number (the score digits and weights are gone)
- [x] Figures traced: twenty rules, five-year clock, four sanction lists (Hanzo's)
- [x] n/a marquees
- [x] n/a submit

Done here: the dial is labelled an illustration in Hanzo's words.

## 6. Content presentation (copy untouched)
- [x] Phone text 14px+ (mono capitals 12px)
- [x] Measures held; long opener labels wrap with the "+" unsquashed
- [x] Sheets via OpenSheet (focus trapped)
- [x] `parity.py /risk`: 0 missing

Done here: parity `text 114/114 links 7/7`; no sentence under any tile (Decides-on and Plans words open or swap), no side-by-side text columns (Rules and Platforms are separate screens).

## 7. Visual design system
- [x] `taste.py` passes (0 hues)
- [x] No label above a headline ("Next" is a 12px mono caption above its links, not a headline)
- [x] Tiles flat; the chapter visuals float
- [x] One icon set
- [x] Differs from neighbours: an unframed gauge, not a desk or window

Done here: gate hues [].

## 8. UI component library
- [x] Hover in `@media (hover:hover)`, press .98, focus-visible
- [x] Stage tabs take arrow keys, Home and End; facts are switches
- [x] Sheets trap Tab and return focus
- [x] No bare `:hover`
- [x] Forks deleted: listed above

Done here: fact switches get an ink border on hover.

## 9. Motion and interaction
- [x] Signature (the live dial), supporting: Settle, PinChapters, sheets; 0 fade-ups
- [x] Idle (dial, chapter visuals, event stream, rule card, declare stack, request flow; all stop out of view), pointer (reasons, switches), state (sheets), arrival (h1)
- [x] Moves without input; every control answers
- [x] Reduced motion rests; no springs
- [x] n/a sound (shared kit)

Done here: signature `decode` (components/pages/risk/Decode.jsx): the h1 lines, every section h2, the dial's decision word (on each change) and `POST /v1/event` resolve out of scrambled characters as they arrive; hovering any of them re-scrambles it. Entrances (components/pages/risk/Enter.jsx), in page order: 1 orbit-in (Where this is today: the two faces and the engine travel a curved arc into place), 2 ink-spread (What it decides on: an organic blot spreads to reveal the four cards), 3 squash-land (the three chapters' objects drop, squash and settle), 4 velocity-skew (the dark room arrives skewed, then leans with scroll speed), 5 depth-parallax (Rules: heading, card and stage close up at different speeds). Each runs once on entering view; reduced motion and JS off show the final state. Verified with Playwright frame strips and films at 1470x801 and 375x812 (docs/gallery/risk/).

## 10. Media
- [x] n/a images; Sigil drawing in Next
- [x] n/a video
- [x] n/a
- [x] n/a

Done here: one Sigil (seed hanzo-risk) beside Next.

## 11. Mobile and responsive
- [x] 375×812 and 1470×801 pass with no overlap
- [x] No horizontal scroll at 320
- [x] Targets 44px+
- [x] Primary above the fold at 375×667

Done here: the phone gauge stays full width (`align-items: stretch`); the dial pause sits beside the stage tabs.

## 12. Accessibility (WCAG 2.2 AA)
- [x] Contrast measured
- [x] Pause beside the stage tabs, under the chapter visual, beside the event stream
- [x] n/a forms
- [x] One h1; h2/h3 order
- [x] Keyboard reaches every control

Done here: the dial's result is `aria-live` only after the visitor acts.

## 13. Performance and engineering
- [x] h1 in server HTML
- [x] No images
- [x] No poller, no third party
- [x] Nothing heavy on James's laptop

Done here: one client island.

## 14. SEO and machine files
- [x] Title and description from `content/pages.json`
- [x] Canonical from shared layout
- [x] `<JsonLd route="/risk" />`
- [x] Cards open sheets

Done here: `app/risk/page.jsx`.

## 15. Catalogue and product pages
- [x] n/a
- [x] Cards open into sheets
- [x] n/a
- [x] n/a (nothing priced)

Done here: n/a.

## 16. Developer experience
- [x] Endpoints shown as Hanzo writes them (/v1/aml, /v1/risk, POST /v1/event)
- [x] n/a config
- [x] n/a terminal
- [x] No version

Done here: n/a beyond the endpoints.

## 17. States and resilience
- [x] Dial: every reason neutral reads "allow"; switches: none or all facts
- [x] Blocked network: complete page, no console errors
- [x] n/a submit
- [x] n/a

Done here: look.cjs both widths errors none.

## 18. Measurement and handover
- [x] `data-cta` on every primary
- [x] Nothing identifier-bearing
- [x] `V2:` line in `app/risk/page.jsx`
- [x] Review requested from an independent critic after this pass

Done here: previous review 6/10; all eight fixes addressed. Round 2 (this pass): "Rules, lists and suppression" gets a rule card (list chips light, Lists → Suppression, a "suppressed" stamp), the declare stack steps while in view instead of playing once, "How it connects" gets a request-flow drawing (your system → Risk, a decision back, the processor untouched), stage tabs take Home/End, off-deck greys swapped to the deck ramp, radii moved to the MASTER set, dead CSS dropped. Idle motion now reaches every screen: the decision-card drawings loop in view, the tier ladder steps, the three named gaps step, the live face pings, and on desktop the shorter column (Platforms, What this is not) stays sticky beside the longer one; a 1 s/2.4 s screenshot diff per screen finds STILL only in the shared footer (desktop 1 of 15, phone 3 of 18). Round 3 (critic 7/10): voids removed (hero and section padding), the faces drawn as one engine, Rules and Platforms split into one screen each with their text folded into the object or a sheet, connect notes open from their names, ladder tiles carry the tier names with the words swapping under, the phone keeps the hero "Talk to us" solid, phone stage pill on one line, gaps marked in place. Round 4 (critic 7/10, hero): the first screen is recomposed: a 3-line h1 (first baseline 27.5%, last 41.1% of 801), the dial beside it (58.7% of the hero width, 28px from the text, right edge on the container at 1446), the next section peeking 56px at 1470x801; on the phone the hero ask is the quiet ring so the header's "Try Hanzo" is the one solid; the verdict word holds one line with ACTION under it; chapter cards are flat #f5f5f5 tiles with their pause in the card's top-right corner (reachable at 375, not under the header); the declare stack, tier ladder and gaps run once on entry and rest (one continuous mover per viewport); the Abuse bars clear the card's +.
