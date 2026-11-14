# /referral coverage (MASTER.md part 2, the 18 parts)

Page file: `components/pages/Referral.jsx` · gallery: `docs/gallery/referral/` · metric id: `signup_start`

Open copy questions for James: none decided. Only the 21 strings of `content/live/referral.json` appear; the invented channel names, row labels and the split affiliate sentence from the earlier build are gone.
Shared changes requested (`docs/requests/<page>.md`): `docs/requests/referral.md` (Ask.jsx: on phones, quiet header while the hero ask shows, then the header carries the page's ask; done page-locally until then).
Forks this page deleted: hand-rolled `xp-cta`/`xp-ghost` anchors (now kit `Cta`), the icon boxes and the grey list-plus-box stage (now one strip), every tiled marquee (now one pinned journey), the share-chip list and the channel-name rail, the definition-list dark room and its second "Affiliates" link, every Apple grey.

## 1. Strategy and conversion
- [x] Header comment has Persona, Goal, CTA, metric id, Signature, Beyond
- [x] One solid fill per viewport; label and href are the live page's ("Get your link" → /signup?next=/referral)
- [x] One h1; the page is clear in 5 seconds
- [x] No dead or self-looping button; n/a prices
- [x] Open copy questions listed, none decided

Done here: one `<h1>` in server HTML; at the top the header is an outline at both widths (measured `rgba(0,0,0,0)` background) beside the hero's solid "Get your link"; after the hero the header is solid "Get your link" (measured `rgb(10,10,10)`) at 1470 and 375.

## 2. Information architecture and navigation
- [x] One `<main id="main">`; skip link reaches it (`app/layout.jsx`)
- [x] Every link through `A` or `Cta`
- [x] n/a breadcrumb: depth 1
- [x] Link parity: 0 removed, 0 unexpected

Done here: `parity.py /referral` → links 3/3 (/signup, /login, /affiliate).

## 3. First impression and page narrative
- [x] Sells in 5 s; something moves within 1 s without input
- [x] Slot-roll h1 (motion map); nothing above the h1
- [x] JS off: legible; no `opacity:0` on the LCP element (the slot reels are CSS and end in place; the questions list as one column)
- [x] Order (motion map, no pinned scene): hero (card) → How it works as one question at a time with a building summary → the one difference (dark room, lens) → the three counts dealt → the close stacking over the card
- [x] Ends on a close: the sign-in line and the ask stacking over the card at rest, then the footer
- [x] n/a Morph: no card opens a page

Done here: motion map for /referral: signature `one-question` + entrances 1 hero `slot-roll`, 2 How it works `word-shuffle`, 3 dark room `cursor-lens`, 4 counts `card-deal`, 5 close `sticky-stack`; the pinned journey and the steps strip (and the hairline through the gauge) are gone. Frames every 80 ms at 1470×801 and 375×812 in `docs/gallery/referral/entrances-*.mp4`.

## 4. Conversion system
- [x] `<Cta>` only; no raw `.x-btn`
- [x] Sticky ask in the header after the hero, same label, at both widths; no bottom bar (measured 0 `.x-ask`); the header returns to quiet while the closing ask is on screen, at both widths
- [x] n/a copy: signed-out Copy is `aria-disabled`; pressing it shakes the link and lights Sign in, never says Copied
- [x] `data-cta` (`referral.hero`, `referral.close`) and `data-thumb` on the primary

Done here: `usePhoneHeaderAsk` mirrors the desktop Ask.jsx move on phones (request filed).

## 5. Trust and proof
- [x] No logo, no seal, no invented number (counts show an em dash, as signed out on hanzo.ai)
- [x] No figure to trace; the pay tracks carry no numbers
- [x] n/a marquee: none left; the only loops (flow dots, pay tracks, the rider's breath) are ambient and freeze under reduced motion
- [x] n/a Privacy: no form

Done here: the journey carries only Hanzo's words (Referred, Pending, Qualified, `hanzo.ai/?ref=…` once).

## 6. Content presentation (copy untouched)
- [x] No text under 13px (14px phone) except mono capitals
- [x] Headings balanced; the dark room's two sentences sit in two columns (5/7)
- [x] Steps are `aria-pressed` buttons that replay their drawing; no table, FAQ or code
- [x] `python3 scripts/parity.py /referral`: 0 missing

Done here: parity `text 20/20 links 3/3`; no word on the page outside `content/live/referral.json`.

## 7. Visual design system
- [x] `taste.py` passes; deck greys only
- [x] No label above a headline ("Referrals" sits under the asks)
- [x] Radii 16/20/24/full; flat tiles
- [x] One icon set; no icon in a rounded box
- [x] Differs from /affiliate (display link, sticky chapters with a box) and /bounty: the signed-out card, a pinned one-word journey and a four-column strip

Done here: `taste.py components/pages/Referral.jsx components/pages/Referral.css` → OK.

## 8. UI component library
- [x] Every control has hover (in `@media (hover:hover)`), press, focus-visible
- [x] Focus ring on every Tab stop
- [x] n/a dialogs
- [x] n/a inputs
- [x] Forks deleted: listed above

Done here: Copy fills ink; steps lift 2px and ink; the "Affiliates" link brightens and moves its underline; press .97 or 1px.

## 9. Motion and interaction
- [x] Signature `one-question` (motion map): How it works asks one step per screen, Next/Previous (or a swipe) slides to the next, the summary beside it builds as each is done, the last hands over to "Get your link" (a link; nothing is submitted), Replay starts over
- [x] Entrances, in page order: `slot-roll` (h1 words roll down through reels of the page's own count words and settle), `word-shuffle` (the heading and first question arrive out of order and swap into place), `cursor-lens` (a round 1.5× lens sweeps the dark room's sentences, then follows a fine pointer), `card-deal` (the three counts dealt from one deck, turned, onto their places), `sticky-stack` (the card sticks, the sign-in line and ask stack over it)
- [x] Kinds: idle (flow dots, pay tracks), time (builder lands once, drawings draw), pointer (lens, hovers, swipe), state (question slides, summary), arrival (slot-roll), scroll (sticky-stack)
- [x] Reduced motion: final states (no reels, no shuffle, no lens, no deal, slides cut, all summary rows shown); JS off lists the questions as one column
- [x] Sound: `data-sound="tick"` on Next, Previous, Replay and Copy

Done here: Playwright (`/tmp/claude-0/rf/enter.cjs`): frames every 80 ms show each entrance at 1470×801 and 375×812; Next ×4 → summary 1, 2, 3, 4 done, slides −100…−300%, the flow's "Get your link" appears, Replay resets to 0; swipe works on touch; 0 horizontal overflow at 375 and 320; one solid fill on screen at every stop on phones. The only console error seen is a shared footer hydration mismatch when the page is scrolled before hydrating (not this page's code).

## 10. Media
- [x] n/a `Film`/`Pic`: no Hanzo photo or film on this page
- [x] n/a videos
- [x] No images to size
- [x] n/a photos

Done here: every object is DOM or inline SVG.

## 11. Mobile and responsive
- [x] 375×812 and 1470×801 pass with no overlap (flow dots run on their own track under the tiles)
- [x] No horizontal scroll (0 at 375)
- [x] Targets 44px or more
- [x] Primary ask above the fold at 375×667 (y ≈ 315)

Done here: on phones the journey stacks (no pin) and plays once, each step's drawing plays as it is reached, the dark room opens from an 8px inset inside its 24px text margin, and the close card sits under the ask.

## 12. Accessibility (WCAG 2.2 AA)
- [x] Text at 4.5:1 or better (unlit rail words #737373)
- [x] n/a pause: no loop over 5 s carries content; the journey follows the scroll and the strip ends at rest
- [x] n/a forms
- [x] One h1; h2s for How it works, the dark room and the close
- [x] Keyboard reaches every step button and both asks

Done here: Copy is `aria-describedby` the sign-in line; the tracks are `aria-hidden` beside the sentences they draw.

## 13. Performance and engineering
- [x] h1 and lede in server HTML
- [x] No new dependency; no rAF loop
- [x] No poller; no third-party request
- [x] Filming in the cloud only

Done here: 200 and 0 console errors at both sizes.

## 14. SEO and machine files
- [x] Title and description from the live page
- [x] Canonical from shared metadata
- [x] `<JsonLd route="/referral" />` renders
- [x] n/a cards

Done here: `app/referral/page.jsx` metadata unchanged.

## 15. Catalogue and product pages
- [x] n/a: not a catalogue or model page
- [x] n/a Morph
- [x] n/a model links
- [x] n/a prices

Done here: n/a, a programs page.

## 16. Developer experience
- [x] n/a: no code
- [x] n/a config
- [x] n/a terminal
- [x] n/a versions

Done here: n/a, the only mono text is `hanzo.ai/?ref=…`.

## 17. States and resilience
- [x] Signed-out state designed (Hanzo's own)
- [x] No live data
- [x] n/a submit
- [x] The header hook restores the header on unmount

Done here: `usePhoneHeaderAsk` undoes its label, href and `data-ask` on route change.

## 18. Measurement and handover
- [x] `data-cta` on every primary; events through the kit's `hz-event`
- [x] Nothing before consent
- [x] `V2:` line in the page file
- [x] Review read: `docs/review/referral.md` (7/10, third walk) fix list answered: the step 03 needle now rotates by CSS with `transform-box: view-box; transform-origin: 200px 220px`, measured in Playwright at 0.00px from the hub at rest (50°), mid-replay (37.7°) and after replay, at 1470 and 375; every other anchor measured the same way (share dots, the locked account, the waitlist bar: 0.00px). The hero's dead band is gone: the journey's word peeks under the hero at 1470×801 and its stage sticks at 22svh, so nothing blank follows it

Done here: 1 the tiled rails became one pinned journey (link once, one word big at a time); 2 phone clip starts at 8px inside a 24px text margin; 3 the close is a band with the card at rest; 4 the steps are one four-column strip, not a list beside a grey box; 5 "Affiliates" shows once; 6 phone header goes quiet at the closing ask.
