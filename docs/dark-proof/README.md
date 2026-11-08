# Dark-mode proof, group 2 (8 Nov)

One image per page and width: **left = live hanzo.ai with the device set to dark, right = ours in dark**, full page, at
1470×801 (`<page>-1470.jpg`, shown at half size) and 375×812 (`<page>-375.jpg`). Made with `scripts/darkproof.mjs`
against the production build (`npm run build`, served by `scripts/serve.mjs`).

- `_darkcheck.json`: `scripts/darkcheck.mjs` on all 50 pages: **0 issues**.
- `_report.json`: per page and width, the html class on both sides, sideways scroll (none) and console errors.
  The errors listed are not from dark mode: 502s are Hanzo images the local preview could not fetch, and React #418
  (hydration) on /founder /gallery /gen /ingress /jin /kms /ledger appears only with "reduce motion" switched on,
  and was there before this change.

Pages that look blank in parts (/gateway, /functions, /metrics, /engine) are scroll-driven sections that a full-page
screenshot cannot play; they are the same in light.
