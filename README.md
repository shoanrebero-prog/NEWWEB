# GES Global Trade — website

Website for **Global Environmental Services & Trading SPC** (trading as GES Global Trade), Salalah, Sultanate of Oman.

Static, fast and SEO-friendly: built at compile time from structured data, with progressive enhancement
(3D, motion and the product panel) on top of plain HTML that works without JavaScript.

```bash
npm install
npm run dev       # generate pages + Vite dev server
npm run build     # generate pages + production build → dist/
npm run preview   # serve dist/
```

## What's here

| Path | Purpose |
|---|---|
| `src/data/products.js` | **Single source of truth** for the 21 product platforms (names, families, applications, packaging, ranges, images, enquiry labels). Content from the Company Profile 2026. |
| `src/config.js` | Company details, email, SEO title/description, enquiry delivery settings |
| `src/templates/` | HTML templates (home, product detail, enquiry form, header/footer) |
| `scripts/build-pages.mjs` | Generates `index.html`, `/products/<slug>/`, thank-you, 404, sitemap, robots, manifest, PNG icons |
| `src/styles/main.css` | Design system (tokens, components, sections) |
| `src/js/main.js` | Header, 21-platform stage, product panel, reveals, map, prefill |
| `src/js/enquiry.js` | Form validation, file upload, delivery |
| `src/js/symbol3d.js` | 3D brand symbol (Three.js, lazy-loaded) |
| `public/brand/` | Logo system (SVG + PNG) |
| `assets/source/` | Original AI-generated image masters (1536 px) |
| `public/img/` | Optimised AVIF/WebP images, one folder per category (generated) |
| `scripts/brand/build-logo.py` | Generates every logo variant from one geometric definition |
| `scripts/images/` | Image manifest + pipeline (grade → responsive AVIF/WebP, focal points) |
| `scripts/build-map.mjs` | Builds the dot-matrix market map as static SVG data |
| `docs/` | Strategy, image register, commercial review & QA |

### Adding or editing a product platform

1. Add/edit the object in `src/data/products.js`.
2. Add the master to `assets/source/`, an entry to `scripts/images/manifest.json`, and run
   `python3 scripts/images/process.py <name>` (needs `pip install opencv-python-headless`).
3. `npm run build`. The slider, platform index, detail panel, product page, sitemap, footer and
   enquiry dropdown are all generated from the data.

## Enquiry delivery

The form supports Name, Company, Email, product platform (+ additional platforms), requirement,
specification, quantity, delivery location, required date and BOQ/drawing uploads (≤ 8 MB).
Clicking **Request** on any product pre-selects that platform.

Delivery, in order:
1. **`formEndpoint`** in `src/config.js` — any multipart form service (Formspree, Getform, Basin or your own API).
2. **Netlify Forms** — automatic when deployed to Netlify (`netlify.toml` included). Submissions and files appear in the Netlify dashboard; set an email notification to `info@gesglobaltrade.com`.
3. **Email fallback** — if neither is available, the visitor's email client opens with the requirement
   written out, addressed to `info@gesglobaltrade.com`, and they are told to attach files manually.

> On a host other than Netlify, set `formEndpoint` before launch, otherwise uploads can only be added via the email fallback.

## Brand

- **Symbol:** "the closing loop" — a heavy navy G (supply) whose opening is closed by a thin electric-blue arc on its outer rim (connection / global reach), with the crossbar running into a single central node (one origin, Salalah). See `docs/STRATEGY.md`.
- **Files:** `public/brand/ges-logo-{dark,light,mono-dark,mono-light}.svg` (primary), `ges-logo-stacked-*`, `ges-compact-*` (symbol + GES), `ges-symbol-*`, `favicon.svg`, PNG exports.
- **Type:** Sora (display/wordmark), IBM Plex Sans (text), IBM Plex Mono (labels) — self-hosted.
- **Colour:** Midnight `#050C18`, Navy `#0B1F3A`, Electric `#2BA8FF`, Steel `#A9B6C6`, Mist `#EEF2F6`.

## Accuracy rules applied

The site states only what the Company Profile supports. It does not name manufacturers, brands,
certifications, customers, offices, warehouses, volumes or awards, and makes no "best / cheapest /
No. 1" claims. Physical presence is stated as Salalah, Oman only. Numeric ranges (generators,
compressors, forklifts) appear only on their own product pages, as indicative ranges. Contact is
email only: **info@gesglobaltrade.com**.
