# GES Global Trade — Website Strategy & Design Rationale

Source of truth: *GES Global Trade Company Profile 2026* (25 pp). Every company
statement on the site traces back to that document. Where the site uses wording
that is not in the profile, it describes a general capability ("requirements can
be consolidated…") rather than a factual claim.

---

## 1. What the profile says (condensed)

| Topic | Profile content used on the site |
|---|---|
| Entity | Global Environmental Services & Trading SPC, trading as GES Global Trade |
| Base | Salalah, Sultanate of Oman — *single* physical base |
| Markets | Oman · GCC · Africa · Global markets |
| Model | Sourcing · Procurement · Supply — single point of contact between buyers and manufacturers |
| Positioning | "A connector between supply and opportunity." Multi-category trading & procurement partner |
| Mission | Reliable and sustainable supply solutions by connecting global markets with quality products |
| Vision | A trusted global trading partner, known for integrity, efficiency and long-term value creation |
| Values | Trust · Quality · Sustainability · Customer Focus · Global Collaboration |
| Portfolio | 21 product platforms; 4 covered in detail (Gypsum, Cables, Electrical Equipment, Warehouse) |
| Process | Understand → Source → Compare → Coordinate → Deliver |
| Logistics | Packing (bulk, bagged, palletised, drummed, containerised), documentation, sea & land freight |
| Quality | "Quality is a process, not a promise." Suitability · supplier coordination · documentation · commercial accuracy · reliable sourcing · consistent communication |
| Honesty statements | "We do not claim to be the largest or the cheapest." "We do not represent overseas offices or warehouses that we do not operate." Specs/certificates come from the manufacturer, on request |
| Order types | Project supply · bulk supply · recurring & repeat orders · distribution |
| Who they work with | Contractors & project owners · industrial facilities · distributors & traders · manufacturers seeking Oman/GCC/Africa access |
| Contact (per brief) | info@gesglobaltrade.com only — no phone, no WhatsApp |

### Claims deliberately **not** made
No certifications, manufacturer partnerships, brands, customer names, offices,
warehouses, headcount, years in business, volumes, awards, guarantees, "best",
"lowest price" or "No. 1". Product imagery carries no manufacturer branding. The
numeric ranges in the profile (generators 10–3000+ kVA, portable 1–20 kVA,
compressors 7.5–500+ kW, forklifts 1–16T+) appear **only** on their own product
pages, phrased as the range "covered", never as a universal specification.

---

## 2. Visitor & conversion strategy

**Primary visitor.** A procurement manager, buyer, contractor's project
manager or distributor in Oman / GCC / East Africa with a live requirement
(often a BOQ) who is qualifying potential suppliers.

**Their problem.** Fragmented procurement: many product families per project,
many suppliers, many quotations, many shipments, unclear documentation, and
suppliers that over-promise.

**What they must understand within 5 seconds.** Who: GES Global Trade, Oman.
What: industrial products and procurement. How it feels: a serious, organised
B2B operation. → Hero = name + "Sourcing. Supplying. Connecting." + one cinematic
logistics visual + two CTAs. Nothing else.

**Visual priority.** The three flagships (Gypsum, Cables, Racking) because the
profile treats them as core platforms and they are the most recognisable
"what do they actually sell" proof.

**What generates an enquiry.**
1. Recognising their product quickly (flagships → 21-platform slider).
2. Believing GES can handle *several* of their needs at once (multi-category).
3. Believing the process is organised (5-stage workflow, quality approach).
4. Believing the claims are honest (explicit Oman-only presence, no hype).
5. A form that accepts what they already have (BOQ / spec / drawing upload),
   pre-filled with the product they were looking at.

**Homepage vs. detail.** Homepage = visual discovery; *no* sub-lists. Product
families, applications, packaging and ranges live in the product panel (fast,
in-page) and in a dedicated, indexable page per platform (`/products/<slug>/`).

**Presenting 21 platforms without overwhelm.** One product on stage at a time
(index `04 / 21`, name, one line, 2–4 examples, CTA) with depth-stacked
neighbours, plus a compact "all platforms" index for direct jumping.

**Conversion path.**
Hero → Featured Supply → 21 Platforms → (panel/page → *Request this product*) →
pre-filled enquiry. Every section ends one click from the form; the header CTA
is persistent.

**3D without slowing the site.** The hero image is the LCP element and loads
first (preloaded, AVIF/WebP, responsive). The Three.js brand symbol is
lazy-imported only when its section approaches the viewport, only on devices
with WebGL and no `prefers-reduced-motion`; otherwise a static SVG renders.
Depth/parallax elsewhere is CSS transforms on the compositor.

---

## 3. Brand

**Concept — "the closing loop".** A heavy navy arc forms the G (supply: solid,
engineered). Its opening is bridged by a thin electric-blue arc on the outer rim,
so the silhouette closes into a full circle (global reach; supply connected to
opportunity). The crossbar runs from the rim into a single node at the centre:
one origin (Salalah) routing outward. No globe, arrows, handshake or clip-art.

**Wordmark.** Sora (geometric, precise), outlined to paths — **GES** bold +
**GLOBAL TRADE** regular, tracked.

**System.** Primary horizontal · stacked · compact (symbol + GES) · symbol ·
dark (for light backgrounds) · light (for dark backgrounds) · monochrome ·
favicon. All generated from one script: `scripts/brand/build-logo.py`.

**Colour.**

| Token | Hex | Use |
|---|---|---|
| Midnight 950 | `#050C18` | deepest backgrounds |
| Navy 900 | `#0B1F3A` | primary brand, logo |
| Navy 800 | `#12294A` | panels |
| Navy 700 | `#1B3A64` | borders on dark |
| Electric 500 | `#2BA8FF` | accent, single use per view |
| Steel 300 | `#A9B6C6` | secondary text on dark |
| Graphite 600 | `#3A4556` | secondary text on light |
| Mist 100 | `#EEF2F6` | light surfaces |
| White | `#FFFFFF` | text on dark, light surfaces |

**Type.** Sora (display), IBM Plex Sans (body), IBM Plex Mono (indices, labels,
data) — self-hosted woff2.

---

## 4. Concept: "The Global Supply Interface"

Dark, cinematic surfaces for discovery (hero, flagships, slider, market map);
light editorial surfaces for reasoning (process, quality, industries); a calm
dark finale for the enquiry. Mono-spaced indices (`01 / 21`, `S-01`), thin
rules and coordinate-style labels give a quiet "interface" layer over real
industrial photography — technology as framing, the product as the hero.

---

## 5. Copy selections

Used: *Sourcing. Supplying. Connecting.* · *One commercial relationship.
Multiple supply requirements.* · *From specification to shipment.* · *Quality is
a process, not a promise.* (profile) · *Start with the requirement. We'll work
from there.* · *Tell us what you need.* · *Real solutions. Greater connections.*
(profile).
Not used: urgency, superlatives, guarantees.

---

## 6. Commercial review (Phase 38)

See `docs/REVIEW.md`.
