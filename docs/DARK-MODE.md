# Dark mode: how to convert your pages (8 Nov)

We use Hanzo's own system, exactly as live hanzo.ai runs it, and build none of our own. Your job is your own page files only:
- The redesign must look right in both modes and match live hanzo.ai in dark.
- Bright mode must not change by a single pixel.
- The copy rule still holds: change no words, and `scripts/copycheck.mjs` stays at missing 0.

## How it works (the foundation is done; don't change it)
- **`@hanzo/appearance` 0.2.14** (Hanzo's package, hanzoai/ui `pkg/appearance`).
  - `app/layout.jsx` puts `bootScript({ base: { theme: 'system' } })` in `<head>`. Its output is byte-identical to the script in live hanzo.ai's HTML.
  - Before the first paint, it replays `localStorage['hanzo.appearance.painted']` (`{ theme, vars }`). With nothing saved, it falls back to `system`, which follows `prefers-color-scheme`.
  - It sets `light t_light` or `dark t_dark` on `<html>`, plus `color-scheme` and `data-scheme`.
- **`<Appearance />`** (`components/Appearance.jsx`) calls `useAppearance({ install: { theme: 'system' } })` once at the root, as Hanzo's README says.
  - After hydration it applies the person's choice: their preference, `localStorage['hanzo.appearance']`, which Hanzo IAM keeps across Hanzo sites.
  - It follows the device while the theme is `system`, and re-applies when the choice changes in another tab.
  - It renders nothing. There is no visible switch, because live shows none.
- **The server HTML says `class="t_dark"`**, as live's does. React never writes these classes (`suppressHydrationWarning`), so hydration and client navigation keep them.
- **Colours come from `@hanzo/design` 0.5.39** (`tokens/colors.css`, imported in `app/layout.jsx`; `public/hanzo.css` carries the same ramps).
  - Dark is Hanzo's default: `:root` / `:not(.light)`. Light is `.light`.
  - Our tokens in dark are references to Hanzo's (`--ink: var(--foreground)` and so on, in `app/globals.css` and `app/system.css`), so no dark colour is ours.
  - Our light values are unchanged.
- **Already dark-correct:** Hanzo's header, menus and footer (through hanzo.css), the cookie banner and preferences, the announcement strip, sign-in buttons, buttons, the search palette and scrims, the menu feature card, sheets, drawers, pause buttons, related cards, every `components/v2/*.css`, and the home hero's dot field (it draws in `--ink` at 17%).

## Testing it like live
- **Device:** emulate `prefers-color-scheme` (DevTools › Rendering, or Playwright `newContext({ colorScheme: 'dark' })`). With nothing saved, the page follows it, including a change while it is open.
- **A saved choice:** run `localStorage.setItem('hanzo.appearance', '{"theme":"dark"}')` (or `"light"`), then reload. It wins over the device, as James's saved "light" does on his dark Mac.
  - `hanzo.appearance.painted` is only the first-frame replay. Set on its own, it shows for one frame, then `useAppearance()` re-applies the real preference, as live's `<Hanzo>` root does.
- **Measured on 8 Nov.** Every case lands on the right class at first paint and after hydration, with no errors:
  - saved dark on a light device → dark;
  - saved light on a dark device → light;
  - nothing saved → follows the device, and flips live.

## The tokens

| Use it for | Token | Light (unchanged) | Dark (Hanzo's token) |
|---|---|---|---|
| Page background | `var(--bg)` | `#fff` | `var(--background)` |
| Text, headings, ink fills | `var(--ink)` | `#0a0a0a` | `var(--foreground)` |
| Secondary text | `var(--soft)` | `#6e6e73` | `var(--muted-foreground)` |
| Captions, mono labels | `var(--faint)` | `#86868b` | `var(--text-tertiary)` |
| Hairlines | `var(--line)` | black 8% | `var(--border)` |
| Muted fill (old `#f5f5f7`) | `var(--x-fill)` | `#f5f5f7` | `var(--muted)` |
| A surface on the page (old `#fff` card, button, menu) | `var(--x-raised)` | `#fff` | `var(--card)` |
| Text on an ink fill (old `#fff` on `#0a0a0a`) | `var(--x-on-ink)` | `#fff` | `var(--primary-foreground)` |
| Recessed bar (old `#fafafa`) | `var(--x-sunk)` | `#fafafa` | `var(--surface-card-quiet)` |
| Selected pill in a track | `var(--x-knob)` | `#fff` | `var(--secondary)` |
| Stronger borders (old black 10, 12, 15%) | `var(--x-e10)`, `var(--x-e12)`, `var(--x-e15)` | black .10, .12, .15 | `var(--border)`, `var(--border-control)` |
| Rooms (`[data-room]`) | `var(--room-*)` | as before | Hanzo's tokens; `[data-room=light]` follows the page into dark |

- **Write dark rules with Hanzo's selector**, `html:not(.light) .your-thing { … }`, never `html.dark`. That way JS-off renders like live, as dark.
- **Don't use `var(--card)` or `var(--raised)` for a new light fill.** Hanzo defines those names on inner elements (`--card` is `#f2f2f2`, `--raised` is `#e4e4e4`), so they don't resolve to our light values and bright mode shifts. That is why our new tokens start with `--x-`.
- **A one-off grey** keeps its exact light value with `light-dark(#ececef, var(--muted))`. `light-dark()` follows the html class: `html.light` and `html:not(.light)` set `color-scheme`.
- **Invent no colours.** In dark, use only Hanzo's tokens: `--background`, `--foreground`, `--card`, `--muted`, `--secondary`, `--border*`, `--text-*`, `--surface-*`, `--glass*`, `--primary*`.

## How to convert a page
1. **Find what's left.** Run `node scripts/darkcheck.mjs /your-page` with the dev server on :4180 (`CHROME=/opt/pw-browsers/chromium-1243/chrome-linux64/chrome` in the cloud). It lists every bright background and low-contrast text by class, at 1470 and 375.
2. **Replace hard-coded colours in your page CSS:**
   - `#fff` backgrounds → `var(--x-raised)`, or `var(--bg)` for a full-width section.
   - `#0a0a0a` / `#0a0a0b` / `#111` text → `var(--ink)`. `#6e6e73` → `var(--soft)`. `#86868b` → `var(--faint)`.
   - `#f5f5f7` → `var(--x-fill)`. `#fafafa` → `var(--x-sunk)`.
   - `color: #fff` on an ink fill → `var(--x-on-ink)`.
   - `rgba(0,0,0,.08)` hairlines → `var(--line)`.
   - Canvas and inline styles: read the colour from CSS (`getComputedStyle(el).color` with `color: var(--ink)`), and redraw when `<html>`'s class changes (see `Dots` in `components/Hero.jsx`).
3. **Leave alone** anything that is black in both modes: `[data-room=dark]` sections, films, Hanzo's media, and white type on a film.
4. **Bright mode is unchanged.** Run a server on the code before your change on :4190: a `git worktree`, `npx next dev -p 4190`, with node_modules linked (webpack accepts a link; turbopack doesn't). Then run `HZ_OLD=http://localhost:4190 node scripts/lightcheck.mjs /your-page`. Done means `light: OK`.
5. **Dark matches live.** `darkcheck.mjs` should say `dark: OK`. Then compare your page and live hanzo.ai side by side in dark at 1470×801 and 375×812, with no console errors, no sideways scroll and no unreadable text.
6. **Copy unchanged.** Run `node scripts/copycheck.mjs /your-page` and confirm missing 0.

## Setup notes
- **React is now 19.2.8**, the version `@hanzo/appearance` requires as a peer; Next 15.5.4 accepts it. Run `npm ci` after pulling.
- **`npm run build` refuses stale live figures** when hanzo.ai is unreachable, as in the cloud sandbox. `HZ_LIVE_OFFLINE=1 npm run build` builds from the saved figures on purpose.

## Left for the page chats (measured 8 Nov)
- `/` (Home): `.xs-ev` (activity feed), `.xh-pause` and the platform mock in `components/pages/Home.css`.
- `/pricing`: the `.xpr-*` panel, tabs and rail.
- `/chat`: the `.cht-*` window, tools and rows.
- Every other page: run `darkcheck.mjs` on it.

## Converting a whole page at once (group 1, 8 Nov)
The 50 group-1 pages were converted with three scripts. They work for any page.
1. **Find what is dark on purpose.** `HZ_BASE=http://localhost:4181 node scripts/darkctx.mjs pages.txt ctx.json` loads each page in light and records, for every CSS rule, whether its elements sit on a dark fill (terminals, films, black rooms, a dark console shell and the white chips inside it).
2. **Convert.** `CTX=ctx.json node scripts/darkify.mjs your.css …` rewrites each hard-coded light colour as `light-dark(<the exact old colour>, <Hanzo token>)`: white/near-white fills → `--background`, light greys → `--muted` / `--secondary`, dark text → `--foreground`, mid-grey text → `--muted-foreground` / `--text-tertiary`, black hairlines and rings → `--border` / `--border-control`. `var(--hz-*)` greys count as their hex. It leaves dark fills, light text, shadows, colours already in `light-dark()`/`var()`, rules written for dark, and the rules from step 1. Light mode keeps the exact old colour by construction.
3. **Check.** `darkcheck.mjs` now reads the background actually painted under each text (`elementsFromPoint`, so a sliding pill or a sibling card counts) at 1470 and 375, and skips text that is clipped, off to the side or fully transparent. `lightcheck.mjs` against a build of the old code must say `light: OK`.
4. **Prove.** `HZ_BASE=… PAGES=pages.txt node scripts/darkproof.mjs` writes live-dark vs ours-dark side by side to `docs/dark-proof/`, and logs sideways scroll and console errors.
- Things the script can't know need a hand rule, e.g. text on an ink fill (`var(--ink)` turns light in dark, so its caption must use `--x-on-ink`), or a demo tile that is white in both modes.
- In the cloud sandbox, serve the build with `NODE_USE_ENV_PROXY=1 NODE_EXTRA_CA_CERTS=/root/.ccr/ca-bundle.crt node scripts/serve.mjs 4181` so Hanzo's own images load.
