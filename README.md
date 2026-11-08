# hanzo.ai — the redesign

Every page of hanzo.ai, redesigned on Hanzo's own stack: **Next.js 16 (static export) · React 19 · Motion 12**, with
light and dark mode from Hanzo's own **`@hanzo/appearance`** and **`@hanzo/design`**.

- **897 pages**: every URL in hanzo.ai's sitemap, plus the home page.
- **Hanzo's words, numbers and links, unchanged.** The redesign changes how pages look and move, not what they say.
  Wording and prices are Hanzo's to change (see [Prices, plans and checkout links](#prices-plans-and-checkout-links)).
- **Light and dark** follow the visitor's saved Hanzo choice, or their device setting.

## Run it

Node 20 or newer. Next.js is 16.4.5 (upgraded from 15.5.4 with the official codemod on 8 Nov; Turbopack is the default
bundler, Cache Components stays off because the site is a static export, React stays on 19.2.8).

```bash
npm ci
```

```bash
npm run dev       # http://localhost:4180, hot reload
```

```bash
npm run build     # static export of every page into out/
```

```bash
npm run preview   # serves out/ on http://localhost:4181
```

**`npm run build` reads live figures first.** `prebuild` runs `scripts/live.mjs`. It refreshes `content/live/_*.json`
from api.hanzo.ai and hanzo.ai: commit calendar, research runs, model rates and plan prices. If any source fails, the
build stops rather than ship stale numbers. To build from the saved snapshots on purpose (offline, or in CI without
network), run:

```bash
HZ_LIVE_OFFLINE=1 npm run build
```

In dev and preview, any file this repo lacks (Hanzo's own model
videos, `/images/…`, `/memoji/…`) is fetched from hanzo.ai, so pages look complete before `public/` is merged.

## Folder map

```
app/                 one folder per route (app/pricing/page.jsx = /pricing). [slug] folders render a page family:
                     /models/*, /cloud/*, /blog/*, /customers/*, /compare/*, /benchmarks/*, /oss/*, /agents/*,
                     /solutions/*, /integrations/*, /legal/*, /careers/*, /blockchain/*, /products/*
app/layout.jsx       the shell for every page: <head>, the appearance boot script, Hanzo's header and footer
app/globals.css      site-wide tokens and base styles (light values, plus dark as references to Hanzo's tokens)
app/system.css       shared component styles
components/          the page code
  pages/             one file per page or page family (Pricing.jsx, ChatPage.jsx, ModelsPage.jsx, About.jsx…)
  home/              home page sections
  kit.jsx, ui.jsx    the shared building blocks every page uses (buttons, links, bands, tabs, sheets, motion helpers)
  v2/                shared motion components (odometer, line reveal, stages…)
  Chrome.jsx         Hanzo's header, menus and footer
  Appearance.jsx     light/dark (see below)
content/             Hanzo's content, as captured from hanzo.ai
  pages/             each page's captured HTML (pages.json: titles and descriptions)
  live/              what hanzo.ai shows today, per page (text and links), plus the _*.json figure snapshots
  jsonld/, outline/  each page's structured data and its heading outline
content.js           home data: header, footer, logos, product screens
lib/                 shared logic: plans.js (prices and checkout links), routes.json (every route), nav.js,
                     liveSources.mjs (the api.hanzo.ai sources), og/ (social images)
public/              fonts, logos, customer and author images, hanzo.css (Hanzo's own stylesheet)
scripts/             build and checking tools (see Scripts)
docs/                DARK-MODE.md, COPY-RULE.md, MOTION-MAP.md, and build-notes/ (the design process; not needed to run)
```

## Light and dark mode

Hanzo's own system, exactly as live hanzo.ai runs it. Full detail: `docs/DARK-MODE.md`.

- **`@hanzo/appearance`** (0.2.14). `app/layout.jsx` puts `bootScript({ base: { theme: 'system' } })` in `<head>`.
  Before the first paint it replays the visitor's saved choice (`localStorage['hanzo.appearance.painted']`), else follows
  the device (`prefers-color-scheme`). It sets `light t_light` or `dark t_dark` on `<html>`.
- **`components/Appearance.jsx`** calls `useAppearance()` once at the root. It applies the choice Hanzo IAM keeps across
  Hanzo sites, follows the device while the theme is `system`, and syncs across tabs. There is no visible switch,
  as on live.
- **Colours come from `@hanzo/design`** (0.5.39, `tokens/colors.css`). Dark is the default (`:root`, `:not(.light)`),
  light is `.light`. Every dark colour in this repo is a reference to Hanzo's tokens (`var(--foreground)`,
  `var(--muted)`…), written as `html:not(.light) …` rules beside each page's CSS. Light values are separate, so
  changing one mode never moves the other.
- To test: DevTools › Rendering › `prefers-color-scheme`, or Playwright `newContext({ colorScheme: 'dark' })`.

## Prices, plans and checkout links

**Change plan prices and checkout links in one file: `lib/plans.js`.** Every page reads them from there: home, /pricing,
/bot, /buying-specialist, /dev, /chat, /enso, /benchmarks, /studio, /beta and /agents. The values match Hanzo's billing
API (`content/live/_pricing.json`, from api.hanzo.ai/v1/billing/plans, 8 Nov 2026).

| What | Where |
|---|---|
| Go, Pro, Dev, Max, Ultra monthly prices and their checkout plan ids (`go`, `pro-2x`, `dev-5x`, `max-10x`, `ultra`) | `lib/plans.js` lines 9–16 |
| Team seats (Standard $20/$25, Premium $100/$125), Enterprise seat ($20/month, 20-seat minimum), the 20% yearly saving | `lib/plans.js` lines 20–25 |
| Card checkout link (`/pay/confirm/card?plan=…&returnUrl=…`) | `lib/plans.js` line 30 (`checkout`); full-URL form line 32 |
| Team checkout from /pricing; Team cart from the buying specialist (`/pay/cart?plan=team…`) | `lib/plans.js` lines 34 and 36 |

These prices are **not** plan prices, so they stay where they are shown. Each one is Hanzo's copy:

| What | Where |
|---|---|
| Per-token model rates on /pricing (API tab), and the compute, tool and web-call rates | `components/pages/Pricing.jsx` lines 403 (`RATES`), 416 (`GROUPS`), 453 (`TOOLS`) |
| Volume & Dedicated ("from $5k/mo") | `components/pages/Pricing.jsx` line 134, `components/home/Pricing.jsx` line 124 |
| Model rates on /models and each model page | `components/pages/models/rates.js` line 6; `content/live/_models.json` (refreshed at build) |
| Home "cheaper" figures and Pareto plot | `components/home/figures.js`, from `content/live/_models.json` and `_research.json` |
| /bot FAQ lines that quote prices ($100/mo floor, $800/mo, $15/mo floor) | `components/pages/Bot.jsx` lines 711, 713, 831 |
| /enterprise offer ($999 a month) | `components/pages/Enterprise.jsx` line 634 |
| Product pages with their own plan tables: Captable, Dataroom, Sign, Crawl, DNS, Search | `const PLANS` in `components/pages/apps/Captable.jsx` 320, `apps/Dataroom.jsx` 370, `apps/Sign.jsx` 309, `cloud/Crawl.jsx` 330, `cloud/Dns.jsx` 339, `cloud/Search.jsx` 401 |
| Prices inside blog posts, press releases and benchmarks | each page's own data file; they are dated statements, not live prices |

Other plan links, as live has them. /pricing: Free goes to `/signup`, Enterprise to `/enterprise/start`, API to `/dev`
and `/contact-sales` (`components/pages/Pricing.jsx`, `planOf` and `cardOf`). Home pricing: Free and Team to `https://hanzo.ai/signup`, API to `https://platform.hanzo.ai`,
Enterprise and Volume to `/pricing` (`components/home/Pricing.jsx` lines 103–125).

## Before it goes live on hanzo.ai

1. **Merge `public/` from the current site.** Model videos (`/models/*.webm`), `/images/models/*`, `/memoji/*` and other
   media are referenced at their existing hanzo.ai paths and are not in this repo.
2. **App routes are not in this repo:** `/chat` (the app), `/pay/*`, `/signup`, `/login`, dashboards. Links point at
   them as they are today. Serve them from the app with edge rewrites, or drop `output: 'export'` in `next.config.mjs` and
   add Next.js `rewrites()` to the app's origin.
3. **Build with network** (no `HZ_LIVE_OFFLINE`), so figures and plan prices are fresh from api.hanzo.ai.
4. **Browser reads.** The home page also re-reads model rates and research figures from api.hanzo.ai in the visitor's
   browser (`components/home/useFigures.js`), keeping the build's snapshot if that fails. api.hanzo.ai must allow
   hanzo.ai's origin (it does today).

## Scripts

| Script | What it does |
|---|---|
| `node scripts/copycheck.mjs /pricing /about …` | **Compare our copy with live hanzo.ai.** Opens live hanzo.ai and our dev server (`npm run dev`, or `HZ_BASE=…`) in headless Chrome. Lists every line of live text missing from ours in `shots/copycheck/<page>.txt`. "missing 0" means every word is there. Needs Chrome (`CHROME=/path/to/chrome` on Linux). |
| `node scripts/live.mjs` | Refresh the figure snapshots in `content/live/_*.json` (runs before every build). `--pages /x /y` re-reads those pages' live text. |
| `npm run capture` / `npm run extract` | Re-capture pages from hanzo.ai into `content/`, and re-read the home's header, footer and logos. |
| `HZ_BASE=http://localhost:4180 node scripts/darkcheck.mjs` | Dark-mode readability: opens every page in `scripts/copycheck-pages.txt` in dark, and flags visible text under 3:1 contrast against its background. Done means 0 pages. `CHROME=/path/to/chrome` on Linux (run as root it also needs `--no-sandbox`). |
| `HZ_OLD=… node scripts/lightcheck.mjs /page` | Light mode unchanged: compares every element's computed colours with an older build. |
| `node --test scripts/*.test.mjs components/**/*.test.mjs` | Unit tests. Tests that open a browser need `CHROME=…`. |
| `python3 scripts/taste.py <files>` | Flags colours outside Hanzo's palette. |

The other scripts in `scripts/` were used during the design work: filming, motion maps, parity reports.

## Known differences from live

Wording and prices follow live hanzo.ai as captured on 8 Nov 2026 (`content/live/`, last figures snapshot
2026-11-08 03:50 UTC). Where this repo knowingly differs, it is listed here, and nothing was reworded to "fix" it:

- **Buy buttons added by design.** A few pages gained a direct way to buy, worded with Hanzo's own plan name and price
  (from `lib/plans.js`): home ("Free to start · Go is $8/month, every model"), /chat and /enso ("Go is $8/month…"),
  /dev ("Get Hanzo Dev, $8/month"), /benchmarks ("Use every model here, Go is $8/month"), /studio ("See plans, from
  $8/month"), /beta ("Skip the wait, go paid"), /about (a "Try Hanzo" / "Book a call" row). Live does not show these.
  Remove any you don't want; the rest of each page is unaffected.
- **Commit total on the home calendar.** hanzo.ai's daily figures sum to 835,124 while its label says 805,254. This
  site keeps Hanzo's label.
- **Dark mode was fixed spot by spot, the Hanzo way.** `scripts/darkcheck.mjs` listed 233 unreadable spots on 47 pages
  on 8 Nov (`docs/build-notes/dark-issues-8nov.json` has the earlier 259); each was fixed with Hanzo's token for its role,
  in rules under `html:not(.light)` (commits titled "dark tokens: ..."). It now reports 0 of 152 pages. Light mode is
  unchanged: 795 pages ship byte-identical CSS, and the 103 whose CSS changed show 0 computed-colour differences in
  `scripts/lightcheck.mjs` at 1470px and 375px. The checker reads text only, so canvases and images were checked by eye
  (the /enso particle ring was invisible in dark and now draws in `--foreground`). Pages outside
  `scripts/copycheck-pages.txt` were not run through the checker.
- **Not re-compared against live at handoff.** The final handoff build ran where hanzo.ai was not reachable, so
  `copycheck.mjs` was not re-run that day, and the snapshots above were used. If live has changed a line since 8 Nov,
  run `node scripts/copycheck.mjs <page>` and restore it: copy on live always wins.

## Docs

- `docs/DARK-MODE.md`: how dark mode is wired, and how to convert or test a page.
- `docs/COPY-RULE.md`: the rule this redesign follows: no wording changes, checked with `copycheck.mjs`.
- `docs/MOTION-MAP.md` (+ `motion-map.json`): each page's one signature interaction, so no two pages move alike.
- `docs/screenshots/`: the handoff spot-checks (home, /pricing, /chat, /models, /about; light and dark; 1470×801 and 375×812).
- `docs/build-notes/`: the design process: per-page checklists (`coverage/`), page reviews (`review/`), requests,
  plans and the earlier README. Not needed to run or change the site.
