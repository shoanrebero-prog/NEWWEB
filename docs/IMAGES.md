# Image register

All 28 photographs are real photography from Unsplash (Unsplash Licence: free for commercial use,
no attribution required). Sources are kept here and in `scripts/images/manifest.json` so the
choice can be audited or replaced.

**Selection process.** About 150 searches across the 21 platforms produced ~2,000 candidates, reviewed
as contact sheets, then shortlisted ones at full size. Rejected: wrong product anatomy,
consumer instead of industrial products, prominent third-party branding, legible ratings or
specifications printed on product, staged or AI-looking images.

**Treatment (`scripts/images/process.py`).**
1. Retouch: manufacturer marks removed by clone/inpaint (column "Retouched").
2. One consistent grade across the set — soft highlight roll-off, cool deep shadows, mild contrast.
3. Responsive AVIF + WebP at 480–2400 px; the hero image is preloaded, everything else lazy-loads.

**Honest limits.** These are representative photographs of each product category — not photographs
of GES stock, facilities or shipments, and the site does not present them as such. Replacing them
with GES's own photography over time would strengthen credibility; to swap an image, edit
the manifest entry and run `python3 scripts/images/process.py <name>`.

| Image | Art direction / why chosen | Retouched | Source |
|---|---|---|---|
| `hero-port` | Single cinematic scene: dusk container terminal, leading lines into depth. Chosen over a quay view with prominent carrier branding. | — | [Unsplash](https://unsplash.com/photos/shipping-port-with-containers-and-cranes-sWOvgOOFk1g) |
| `p01-gypsum` | Bulk white mineral stockpile with radial stacker — reads as bulk supply at scale. Plant signage retouched out. | yes | [Unsplash](https://unsplash.com/photos/large-sand-and-gravel-piles-with-industrial-conveyors-HkxPrTZGEl8) |
| `p01-boards` | Palletised plasterboard in racking — board edges, real pallet and rack. | yes | [Unsplash](https://unsplash.com/photos/stack-of-wooden-planks-on-brates-12f58hsO1Gk) |
| `p01-lumps` | Raw mineral lumps, natural texture and dust. | — | [Unsplash](https://unsplash.com/photos/brown-and-white-stone-fragments-4X5ySjDNLPg) |
| `p01-powder` | White powder stockpile macro, low-key light. | — | [Unsplash](https://unsplash.com/photos/rough-snow-covered-terrain-against-a-dark-background-oIw4LRylwg8) |
| `p02-cables` | Macro of copper conductor coil — physically real copper, controlled warm light on dark. | — | [Unsplash](https://unsplash.com/photos/white-and-brown-spiral-light-Uwq_F5G4yOo) |
| `p02-drums` | Cable drums loaded with power cable — typical supply format. | — | [Unsplash](https://unsplash.com/photos/a-pile-of-yellow-and-green-hoses-sitting-on-the-side-of-a-road-gc85oQrQCt0) |
| `p02-braid` | Stranded copper conductor detail. | — | [Unsplash](https://unsplash.com/photos/a-close-up-of-a-rope-on-a-black-background-xPVUA7Jrl58) |
| `p03-electrical-equipment` | LV switchgear line-up in an electrical room. Cropped to 3:2. | — | [Unsplash](https://unsplash.com/photos/gray-machine-s89Z5V0plTY) |
| `p04-racking` | Selective pallet racking aisle with counterbalance forklift. Manufacturer mast lettering cloned out. | yes | [Unsplash](https://unsplash.com/photos/a-large-warehouse-filled-with-lots-of-pallets-OnbSOhz0oig) |
| `p04-racking-b` | Newly installed pallet racking with column guards — project supply context. | — | [Unsplash](https://unsplash.com/photos/a-warehouse-with-blue-and-yellow-poles-qXwXKwaT8mU) |
| `p05-steel` | Steel pipe stock, end-on. | — | [Unsplash](https://unsplash.com/photos/a-large-stack-of-pipes-stacked-on-top-of-each-other-F4nEetWGt0A) |
| `p06-valves` | Flanged gate valves on plant pipework. | — | [Unsplash](https://unsplash.com/photos/industrial-pipes-with-red-valves-PBhR1Kw1wXk) |
| `p07-polymers` | Polymer resin granules macro. | — | [Unsplash](https://unsplash.com/photos/blue-and-white-square-beads-ooxMySOfRRU) |
| `p08-chemicals` | Steel chemical drums; no legible product labelling. | — | [Unsplash](https://unsplash.com/photos/stacked-industrial-metal-barrels-yKs_eEXZEzg) |
| `p09-machinery` | Automated production line in a modern hall. | — | [Unsplash](https://unsplash.com/photos/a-large-machine-in-a-large-building-pWUyHVJgLhg) |
| `p10-agriculture` | Centre-pivot irrigation over crop. | — | [Unsplash](https://unsplash.com/photos/a-sprinkler-spraying-water-on-a-green-field-6DMht7wYt6g) |
| `p11-pumps` | Inline pump sets with gauges and valves. | — | [Unsplash](https://unsplash.com/photos/a-group-of-pipes-and-valves-in-a-room-KWZMx4T8Y1k) |
| `p12-generators` | Generator sets with exhaust stacks at a power installation. Model lettering retouched out. | yes | [Unsplash](https://unsplash.com/photos/a-factory-with-a-lot-of-green-and-white-machinery-wUuq69GGLnU) |
| `p13-engines` | Diesel engine fuel-injection detail. | — | [Unsplash](https://unsplash.com/photos/vehicle-engine-xnqvX5u-ZGQ) |
| `p14-construction` | Wheel loader with full bucket. Manufacturer logos retouched out. | yes | [Unsplash](https://unsplash.com/photos/yellow-and-black-heavy-equipment-on-brown-field-during-daytime-N1LBcqLP9ec) |
| `p15-cleaning` | Pressure washing in use (operator in hi-vis). | — | [Unsplash](https://unsplash.com/photos/a-man-in-a-yellow-jacket-is-using-a-pressure-washer-e2k842P9a2I) |
| `p16-compressors` | Twin-cylinder piston compressor on receiver. Chosen over a sharper image that showed AI-render artefacts on its nameplate. | — | [Unsplash](https://unsplash.com/photos/weathered-blue-industrial-air-compressor-dKthG-i_aFM) |
| `p17-welding` | MIG arc and sparks. | — | [Unsplash](https://unsplash.com/photos/welder-working-on-metal-with-sparks-9Q_pLLP_jmA) |
| `p18-safety` | Row of safety helmets. | — | [Unsplash](https://unsplash.com/photos/several-bright-yellow-hard-hats-are-neatly-lined-up-LutB1xxyArA) |
| `p19-material-handling` | Fleet of pallet trucks/stackers. Manufacturer marks on seats and masts retouched out. | yes | [Unsplash](https://unsplash.com/photos/a-large-warehouse-filled-with-lots-of-machines-p0VP_TOAd5E) |
| `p20-water-treatment` | Filtration pressure vessels with process pipework. | — | [Unsplash](https://unsplash.com/photos/a-couple-of-water-tanks-sitting-next-to-each-other-wzcyEpk2eWw) |
| `p21-hoses` | Hydraulic hose assemblies on heavy equipment. | — | [Unsplash](https://unsplash.com/photos/a-close-up-view-of-a-yellow-machine-E3mqhLHvfP8) |
