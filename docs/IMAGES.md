# Image register

All 28 images on the site are **original AI-generated images** created for GES Global Trade
(Figma `generate_image`, gpt-image model). The earlier stock photographs have all been removed:
no Unsplash or other third-party images remain, and nothing is referenced that is not in this list.

## Process
1. **Research.** For each category, real-world references were checked first: manufacturer
   and dealer catalogues, datasheets and spec sheets (cable construction to IEC 60502 / BS 5467,
   genset canopy construction, RO skid and FRP vessel layouts, booster-set configurations, LV
   switchgear form-separation line-ups, FIBC bag construction, racking components). These were used
   only to understand product anatomy, materials, proportions and settings. No reference image was
   copied and no composition was reproduced.
2. **Brief.** Each prompt specifies product anatomy, environment, camera/lens, lighting and grade,
   and forbids text, logos, brand names and printed markings. See `docs/IMAGE-BRIEFS.md`.
3. **Inspect and reject.** Every image was reviewed at full size. Rejected and regenerated:
   - **Steel v1:** H-beams rendered with impossible double webs.
   - **Racking v1:** busier composition, kept as a detail image instead of the flagship.
   - **Hero v1:** over-saturated and too obviously AI-looking.
4. **Optimise.** `scripts/images/process.py` applies one light grade to the whole set, then
   writes AVIF + WebP at 480–2048 px. Each image carries a focal point (CSS `object-position`) so
   mobile and card crops keep the product in frame.

## Honest limits
- These are illustrative visuals of each product category, not photographs of GES stock,
  facilities or shipments, and the site does not present them as such. Adding GES's own
  photography over time (cargo, packing, loading) would add credibility.
- The generator outputs 1536 px masters. Widths of 2048 px (hero and flagships, for large or
  retina screens) are Lanczos-upscaled. They look sharp at normal viewing, but on 4K screens
  they are softer than a native high-resolution photograph would be.

## Files
Source masters: `assets/source/<name>.jpg`. To replace one, overwrite the master and run
`python3 scripts/images/process.py <name>`.

| Image | Folder | Content / alt text |
|---|---|---|
| `hero-port` | `public/img/hero/` | Container terminal at dusk with gantry cranes, a berthed container ship, and cable drums and bulk bags staged on the quay |
| `p01-gypsum` | `public/img/products/gypsum/` | Raw gypsum lumps and gypsum powder in front of palletised plasterboards and bulk bags in a materials warehouse |
| `p01-boards` | `public/img/products/gypsum/` | Edges of stacked standard, moisture-resistant and fire-resistant gypsum boards on pallets |
| `p01-bulk` | `public/img/products/gypsum/` | White FIBC jumbo bags, palletised 50 kg bags and crushed mineral lumps ready for export |
| `p02-cables` | `public/img/products/electrical-cables/` | Cut ends of four-core armoured power cables showing copper conductors, XLPE insulation and steel wire armour |
| `p02-mv` | `public/img/products/electrical-cables/` | Medium-voltage cable sample with conductor, semiconductive screens, XLPE insulation, copper tape screen and sheath |
| `p02-drums` | `public/img/products/electrical-cables/` | Cable drums of power cable and coils of single-core building wire in a cable store |
| `p03-electrical-equipment` | `public/img/products/electrical-equipment/` | Low-voltage switchgear line-up with withdrawable air circuit breaker and motor control units under cable trays |
| `p04-racking` | `public/img/products/warehouse-racking/` | Electric reach truck placing a pallet in tall selective pallet racking in a modern warehouse |
| `p04-racking-b` | `public/img/products/warehouse-racking/` | Long aisle of selective pallet racking with a forklift at work |
| `p04-mezzanine` | `public/img/products/warehouse-racking/` | Steel mezzanine with stairs, drive-in and cantilever racking and loading-bay doors |
| `p05-steel` | `public/img/products/steel-metal/` | Stacked H-beams, steel angles, rebar bundles and steel coils in a steel stockyard |
| `p06-valves` | `public/img/products/pipes-valves-fittings/` | Flanged gate valve, ball valve, flanges, elbow, tee, reducer and HDPE pipe on an inspection table |
| `p07-polymers` | `public/img/products/plastics-polymers/` | Polymer pellets, plastic sheets, stretch film, PVC and HDPE pipes and FIBC bags in a warehouse |
| `p08-chemicals` | `public/img/products/chemicals-fertilizers/` | Bagged fertilizer, IBC totes and chemical drums on spill pallets in a distribution warehouse |
| `p09-machinery` | `public/img/products/industrial-machinery/` | Industrial gearmotor on a baseplate with bearings, conveyor, mixer and machine tools |
| `p10-agriculture` | `public/img/products/agriculture-irrigation/` | Drip irrigation laterals along crop rows with a tractor sprayer and greenhouse tunnels |
| `p11-pumps` | `public/img/products/water-pumps/` | Pressure booster set of vertical multistage pumps with end-suction pumps and a borehole pump |
| `p12-generators` | `public/img/products/generators/` | Canopy diesel generator set with service door open showing engine and alternator |
| `p13-engines` | `public/img/products/engines/` | Six-cylinder industrial diesel engine with filters, piston, gaskets and coupling on a workbench |
| `p14-construction` | `public/img/products/construction-equipment/` | Excavator loading a dump truck with a wheel loader and roller on a construction site |
| `p15-cleaning` | `public/img/products/cleaning-equipment/` | Floor scrubbers, pressure washers and an industrial vacuum lined up in a facility |
| `p16-compressors` | `public/img/products/air-compressors/` | Rotary screw compressor, refrigerated dryer, filters and air receiver in a compressor room |
| `p17-welding` | `public/img/products/welding/` | MIG welding machine with wire feeder, torch, electrodes, helmet and gloves on a welding table |
| `p18-safety` | `public/img/products/safety-security/` | Safety helmets, eyewear, gloves, boots, harness, extinguisher, CCTV camera and first-aid kit |
| `p19-material-handling` | `public/img/products/material-handling/` | Diesel and electric forklifts, a stacker and pallet trucks under an overhead crane hoist |
| `p20-water-treatment` | `public/img/products/environmental-water-treatment/` | Reverse osmosis skid with FRP membrane vessels, filtration vessels and dosing tanks |
| `p21-hoses` | `public/img/products/industrial-hoses/` | Hydraulic hose assemblies, camlock and quick couplings, clamps and industrial hoses |
