# Commercial review & QA

## Phase 38 — three-person review

**Procurement manager — "Would I send this company an RFQ?"**
Yes. Within one screen of the enquiry form I can see what they handle and the five-stage
process, and their claims are bounded ("we do not claim to be the largest or the cheapest";
specs and certificates come from the manufacturer). The form takes my BOQ, my quantity and
destination, and the product I was looking at is already selected. *Change made during review:*
added "+ Add other platforms to the same enquiry" so one RFQ can cover a multi-category BOQ.

**Project manager — "Can I understand what they can supply quickly?"**
Yes. In about 10 seconds the three flagships (gypsum, cable, racking) show the range of the
business. The 21-platform stage gives one platform at a time with 2–4 concrete examples, plus a
full index to jump to any platform. Detail (families, applications, packaging, ranges) is one
click away in the panel or on an indexable product page. *Changes made during review:* the
stage was rebuilt as a right-receding deck so the slides never cover the text, and the
blurred backdrop was toned down.

**Business owner — "Does this company look credible enough for a serious supply discussion?"**
Yes, with one caveat. The brand system, photography and restraint read as an established B2B
operation, and the honesty statements (Oman-only presence, no invented partners) support that.
*Caveat:* all imagery is original AI-generated illustration of each category (see `docs/IMAGES.md`). Adding GES's own photographs (cargo,
packing, loading at Salalah) is the single highest-value improvement after launch.
*Change made during review:* removed a line about "access to Port of Salalah" because the
profile wording could not be confirmed.

## QA results (automated, Chromium)

| Check | Result |
|---|---|
| Production build (`npm run build`) | ✓ 24 pages, no errors |
| Console errors (home, product page, panel, deep link) | ✓ none |
| Horizontal overflow at 390 / 1440 px | ✓ 0 px |
| Viewports reviewed | 390×844 (phone), 1440×900, plus responsive breakpoints at 600/900/1000/1100 px |
| Product panel open / close / Esc / back button / deep link `?product=` | ✓ |
| "Request" from panel → form pre-selects platform | ✓ (e.g. Electrical Wires & Cables) |
| Product page form pre-selects its platform | ✓ |
| Multi-category "Combine in one enquiry" pre-selects additional platforms | ✓ |
| Required-field validation, email validation, 8 MB upload limit, file list + remove, drag & drop | ✓ |
| Initial transfer (desktop / mobile) | ~950 KB / ~520 KB; LCP = hero image (preloaded AVIF) |
| 3D symbol | Lazy-loaded (154 KB gz) only near viewport, only with WebGL and no reduced-motion; SVG fallback otherwise |
| Reduced motion | All animation and transitions disabled; content fully visible |
| SEO | Unique title/description per page, canonical, Open Graph/Twitter, Organization + WebSite + BreadcrumbList + OfferCatalog JSON-LD, sitemap.xml, robots.txt, descriptive alt text, semantic headings (one h1 per page) |

**Not tested in this environment:** real iOS Safari / Android Chrome devices and true 4K displays
(the layout is capped at 1520 px content width, and hero/flagship images go up to 2000–2400 px).
Netlify Forms delivery needs a live Netlify deploy to verify.
