# /newsletter coverage (MASTER.md part 2, the 18 parts)

Page file: `components/pages/Newsletter.jsx` · gallery: `docs/gallery/newsletter/` · metric id: `lead_submit`

Open copy questions for James: the form's state lines ("Check your inbox: we sent … a link to confirm.", "Enter an email address like you@example.com.", "Too many tries from here. Try again in an hour.", "We could not reach our mail service. Try again in a minute.") come from the page as it arrived in the 7 Nov snapshot (`4203095f`) and are not in `content/live/newsletter.json`; listed for James. "Read", "Nothing is sent to you until you do.", "The newsletter", "Newsletter", "Three steps" and "Subscribing…" are removed. Also for James: Hanzo's one sentence "We email a link to confirm first, and every issue has a one-click unsubscribe" is shown whole under the field, and re-set (words unchanged) as the dark room's h2 and the step labels "a link to confirm", "once or twice a month", "one-click unsubscribe". Keep or drop the re-cut?
Shared changes requested (`docs/requests/<page>.md`): `docs/requests/affiliate.md` (the header's ask outlines while a page's own ask is on screen, and carries it after the hero; on /newsletter it carries "Subscribe"); `docs/requests/newsletter.md` (the phone header keeps a solid "Try Hanzo"; the kit solid hover `#2c2c2e` is off the ramp).
Forks this page deleted: the hand-made submit button (now kit `Cta` busy), the label above the h1, the looping retyped paper, box-plus-shadow on the field, paper and envelope, 88px statements and 48px step titles, the invented step words.


## 1. Strategy and conversion
- [x] Header comment has Persona, Goal, CTA, metric id, Signature, Beyond
- [x] One solid fill per viewport; label and href from `lib/cta.js`
- [x] One h1; the page is clear in 5 seconds
- [x] No dead or self-looping button; prices from `lib/plans.js`
- [x] Open copy questions for James listed, none decided

Done here: Header comment in `app/newsletter/page.jsx` names Persona, Goal, CTA, Metric `lead_submit`, Signature, Beyond. One solid per screen: kit `Cta` "Subscribe" (`newsletter.subscribe`) in the hero field; the form wrapper carries `data-thumb` so the header carries Subscribe after the hero; the room's "Subscribe ↑" is outlined at every width, so the header carries the one solid (on phones the shared header keeps "Try Hanzo"; requested in `docs/requests/newsletter.md`). Open copy questions listed above.

## 2. Information architecture and navigation
- [x] One `<main id="main">`; skip link reaches it
- [x] Every link through `A`, `Go`, `More` or `href()`; every card a real link
- ~~Breadcrumb at depth 2 or more~~ n/a: depth 1 page.
- [x] Link parity: 0 removed, 0 unexpected

Done here: One `<main>` from the layout; links via `A`/`Cta`; parity links 3/3.

## 3. First impression and page narrative
- [x] Sells in 5 s; something moves within 1 s without input
- [ ] `PageHero`; nothing above the h1
- [x] JS off: legible; no `opacity:0` on the LCP element
- [x] One idea per 100svh; no 3 same-height sections in a row
- [ ] Ends in proof strip, `Band`, footer
- ~~Card-to-page links use Morph; title lands within 12px~~ n/a: no cards that open pages.

Done here: Nothing above the h1. "The Hanzo newsletter" (52px) cuts in by line mask; the paper lands and sets its three items as ink bars once within 2 s (no words: each statement is said exactly once on the page), then rests; it tilts toward a fine pointer (2.5° max) and writes the typed address on itself. The signature (`one-question`, MOTION-MAP) is the first screen: the form asks for the address, slides to the check (the answer summarised; Subscribe sends it, an arrow goes back), then to Hanzo's sent line, while a three-step summary under it and the paper beside it fill in. No pinned scenes. Five sections, five entrances in order (`components/pages/newsletter/enter.jsx`): 1 hero stretch-scroll; 2 the three statements shrink-to-card as you leave; 3 the envelope noise-dissolves in; 4 the four steps are card-dealt; 5 the close pixel-resolves. `PageHero` is not in the kit (left open). The page ends on the close (an outlined Subscribe that glides back to the field in the same tab) then the footer (left open: no `Band`). JS off: `NoJs` shows final states; the paper's lines are set.

## 4. Conversion system
- [x] `<Cta>` only; no raw `.x-btn`
- [x] Sticky ask in header and bar after the hero, same label
- ~~Copy button copies exactly the displayed text; failure never says Copied~~ n/a: no copy control.
- [x] `data-cta` and `data-thumb` on every primary

Done here: Kit `Cta` only; `data-cta` on the submit and the close; no copy control.

## 5. Trust and proof
- ~~No logo without documented permission; no seal; no invented number~~ n/a: no logos, seals or figures.
- ~~Every figure traces to Hanzo's copy; qualifier beside the number~~ n/a: no figures.
- ~~Marquees pause, freeze under reduced motion, hide duplicates~~ n/a: no marquee.
- [x] Privacy link and owner line beside every submit

Done here: No figures, logos or seals; the privacy link and the confirm-first, one-click-unsubscribe line sit under the field.

## 6. Content presentation (copy untouched)
- [x] No text under 13px (14px phone) except mono capitals
- [x] Measures held; no orphan word in a heading
- ~~Tables, FAQ, tabs and code use the kit parts~~ n/a: no table, FAQ, tabs or code.
- [x] `python3 scripts/parity.py /newsletter`: 0 missing

Done here: Parity 7/7 text. Type from MASTER: h1 52px, lede 21px, field 17px, one statement at 44px at a time (each of the three statements is rendered in exactly one element on the whole page, measured: one visible element each over a full scroll at 1470×801 and 375×812; the counter and three hairlines sit under the mask as its caption); phone rows 26px; dark-room head 26px, the one opt-in step at 64px over 17px rail words (phone: 28px over a numbers-only rail), mono 13px.

## 7. Visual design system
- [x] `python3 scripts/taste.py <files>` passes; no literal hex outside tokens
- [x] No label, tag, badge or pill above a headline
- [x] Radii, shadows and sizes from tokens; never box plus shadow
- [x] One icon set; no icon in a rounded box
- [x] Differs from neighbours in hero medium and room order

Done here: `taste.py` passes (greys only; the red is gone); nothing above a headline; no box plus shadow; radii 28 composer, 16, 12, 8 paper; one dark room. The hero object is the paper issue.

## 8. UI component library
- [x] Every control has hover, press, focus-visible, disabled, loading
- [x] Focus ring visible on every stop of a Tab crawl
- ~~Dialogs are native, trap focus and return it~~ n/a: no dialog.
- [x] Inputs 16px or larger; no bare `:hover`
- [x] Forks this page deleted: the hand-made submit button (now kit `Cta` busy), the label above the h1, the looping retyped paper, box-plus-shadow on the field, paper and envelope, 88px statements and 48px step titles, the invented step words. listed below

Done here: Kit `Cta` states (hover fill, press .97, focus ring, busy); the dark room's quiet Subscribe fills white 10% and lifts its arrow on hover; Privacy thickens its underline on hover; the four opt-in steps are buttons (hover underline, press .97, white focus ring, `aria-current="step"`); the field pill answers hover and focus; an invalid email marks the pill dashed; the Hanzo mark link has hover, press and focus.

## 9. Motion and interaction
- [x] One signature, at most 3 supporting techniques, at most 2 fade-ups
- [x] At least 3 kinds of movement; scroll-linked is half or less
- [x] Something moves without input; every control answers
- [x] Reduced motion shows the final state; no `setInterval`
- ~~Sound only on the listed moments, through the one kit~~ n/a: the shared sound kit is not on main yet; nothing page-local plays sound.

Done here: Motion map (James, 7 Nov): signature `one-question`: three panels on one track slide 110% sideways (550 ms ease-emphasis), only the panel in view is focusable and takes focus; a three-segment summary fills as you answer; the paper writes the address, stamps itself (spring) at the check and folds into an envelope when sent (the POST is the same as hanzo.ai's; never sent for real in tests, intercepted). Entrances, in section order: 1 stretch-scroll (the hero stretches up to 1.22× vertically on arrival and with scroll speed, then relaxes); 2 shrink-to-card (the statements shrink to 0.86 with 28px corners on #f5f5f5 as you leave); 3 noise-dissolve (the envelope block is covered in grain that clears pixel by pixel over 1.1 s once 35% in view); 4 card-deal (the four step cards are dealt from the first card's place, 110 ms apart, rotating to flat); 5 pixel-resolve (the close and its contour card resolve 36→3 px→sharp through an SVG pixelate filter). Kept: line-mask h1, paper tilt, envelope fold, word ink-in with caret, the envelope walking the four steps once (1.4 s a step; press a step to hold it), every hover. Reduced motion and JS off show final states. Verified with Playwright at 1470×801 and 375×812: frames of each entrance in `docs/gallery/newsletter/motion-*.mp4`, 0 console errors.

## 10. Media
- ~~`Film` and `Pic` only; sizes and posters set~~ n/a: no images or video; the paper and envelope are DOM with the page's own Sigil masthead.
- ~~At most 2 videos playing; pause button on loops over 5 s~~ n/a: no video.
- ~~Budgets met; nothing missing; alt on every image~~ n/a: no images.
- ~~No dimmed or filtered photo; 4+ real visuals together where the page has them~~ n/a: no photos.

Done here: No raster media; the paper's masthead is the page's own Sigil field.

## 11. Mobile and responsive
- [x] 375×812 and 1470×801 pass with no overlap
- [x] No horizontal scroll at 320
- [x] Every target 44px or more; every hover has a tap path
- [x] Primary ask above the fold at 375×667

Done here: 375×812: the field stacks with a full-width Subscribe above the fold; the paper below, inside the gutters; no pinned scene under 900px (a 16:9 contour card over three 26px rows that ink in as they reach the middle); the field is 56px and the form slot holds 230px so success swaps in place; the hero stage has a fixed height (640px desktop, 440px phone) so the paper-to-envelope swap moves nothing (h1 moved 0px at both sizes); the opt-in step words stay on one line at 28px with room for the counter; measured CLS 0.0000 over a full 375×812 wheel scroll (was 0.296), desktop 0.0016; the opt-in stage shows one step at 28px over a numbers-only rail of four 56px targets with the marker gliding along, the counter under the rail; Privacy has a 44px hit area; no horizontal scroll at 320 (measured 0); targets 44px+.

## 12. Accessibility (WCAG 2.2 AA)
- [x] Contrast measured, text at 4.5:1 or better
- [x] Pause control on every moving item
- [x] Forms labelled; first error focused
- [x] One h1; no heading skips; names start with visible text
- [x] Keyboard reaches every control

Done here: Greys at 4.5:1+ (step words white 55% on #0a0a0a is 7:1); one h1, h2 in the dark room; the field labelled; the error is an alert tied to the field; the result takes focus. The opt-in walk runs once and stops by itself (no pause needed); pressing any step holds it. The big stage word is `aria-hidden` (the rail buttons carry the words).

## 13. Performance and engineering
- [x] h1 and LCP element in server HTML
- [x] JS and CSS inside budget; every image and video sized
- [x] No poller; no third-party request before consent
- [x] Nothing heavy run on James's laptop

Done here: h1 in server HTML; one request on submit only; no poller; motion is transform, opacity and font weight.

## 14. SEO and machine files
- [x] Title and description match live (or are listed for James)
- [x] Canonical equals og:url equals the live URL
- [x] `<JsonLd route>` parses; no broken URL
- [x] Every card is a real link

Done here: Title and description unchanged; `<JsonLd route="/newsletter" />` renders canonical and og tags.

## 15. Catalogue and product pages
- ~~Model card matches `SPEC.md` (or n/a: not a catalogue or model page)~~ n/a: not a catalogue or model page.
- ~~Every card opens by Morph~~ n/a: not a catalogue.
- ~~Every maker and model page linked in the DOM~~ n/a: not a catalogue.
- ~~One price figure everywhere~~ n/a: no prices.

Done here: n/a: not a catalogue or model page.

## 16. Developer experience
- ~~One `CodeBlock`; copy equals display (or n/a: no code on the page)~~ n/a: no code on the page.
- ~~Config blocks parse on their own~~ n/a: no config.
- ~~Terminal pauses and ends on a static frame~~ n/a: no terminal.
- ~~No hand-typed version number~~ n/a: no version numbers.

Done here: n/a: no code on the page.

## 17. States and resilience
- [x] Loading, empty, error and offline states designed
- ~~Blocked live data leaves a complete page, no console errors~~ n/a: no live data; the only request is the subscribe itself.
- [x] A failed submit keeps its values and shows no success
- [x] A thrown island does not blank the page

Done here: Success shows only when Hanzo answers pending (the confirm link is out); 400, 429 and failures keep the address and say why (tested with interception, 200 and 500).

## 18. Measurement and handover
- [x] `data-cta` on every primary; events only through `lib/track.js`
- [x] Nothing identifier-bearing before consent; no field value in a payload
- [x] `V2: <score>/10 <one line>` in the page file's top comment
- [x] Review read: `docs/review/newsletter.md` and every complaint answered

Done here: `data-cta` ids `newsletter.subscribe`, `newsletter.close` (kit Cta fires `cta_click`); V2 line in the page file and route header; review `docs/review/newsletter.md` (5/10 at `648b798`) read and answered: labels above headings gone, the three equal step boxes replaced by one stage with one step big at a time, Subscribe and Privacy hover, card present. Second review (6/10): phone shift removed, the statements told by the composed issue (one big at a time), the close Subscribe outlined in the dark room, the paper tilts and previews the address, the h1 holds still on success (measured 0px), both scenes pinned, the paper inside the phone gutters, copy questions listed. Third review (7/10): each sentence in at most two places at once, no second paper on phone and no placeholder bars, fixed hero stage, the room's Subscribe the one solid on desktop, phone step words on one line, `#a1a1a6`/`#ececef` replaced by `#a3a3a3`/`#e9e9e9`. Fourth review (7/10): structural fix: the hero paper's items are ink bars, the second paper is gone, each statement appears in exactly one element on the page (Playwright-counted at both widths), the counters sit outside the masks, the room's Subscribe outlined at every width, the error clears once the address is valid, steps carry `data-sound="tick"`, 56px phone field, 44px Privacy target. A fresh critic re-scores it.
