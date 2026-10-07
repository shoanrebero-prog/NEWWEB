// Generates the dot-matrix market-reach map as static SVG markup (no runtime map library).
// Output: src/data/map.json  { viewBox, paths: {land, gcc, africa, oman}, origin, arcs[], labels[] }
import fs from 'node:fs';
import { geoEquirectangular, geoContains } from 'd3-geo';
import { feature } from 'topojson-client';

const topo = JSON.parse(fs.readFileSync(new URL('../node_modules/world-atlas/countries-50m.json', import.meta.url)));
const countries = feature(topo, topo.objects.countries).features;

const OMAN = new Set(['512']);
const GCC = new Set(['682', '784', '634', '048', '414']);
// ISO 3166-1 numeric codes for African countries & territories.
const AFRICA = new Set(
  '012 024 072 086 108 120 132 140 148 174 175 178 180 204 226 231 232 233 262 266 270 288 324 384 404 426 430 434 450 454 466 478 480 504 508 516 562 566 624 638 646 654 678 686 690 694 706 710 716 728 729 732 748 768 788 800 818 834 854 894'.split(' '),
);

const W = 1200, H = 760;
const LON0 = -24, LON1 = 128, LAT0 = -40, LAT1 = 62;
const projection = geoEquirectangular()
  .scale(1)
  .translate([0, 0]);
// Fit the lon/lat window to the viewBox manually (equirectangular = linear).
const sx = W / (LON1 - LON0), sy = H / (LAT1 - LAT0);
const project = ([lon, lat]) => [(lon - LON0) * sx, (LAT1 - lat) * sy];

const STEP = 1.45; // degrees between dots
const buckets = { land: [], gcc: [], africa: [], oman: [] };

// Pre-compute bbox per country for speed.
const boxes = countries.map((f) => {
  let x0 = 180, x1 = -180, y0 = 90, y1 = -90;
  const walk = (c) => (typeof c[0] === 'number' ? ((x0 = Math.min(x0, c[0])), (x1 = Math.max(x1, c[0])), (y0 = Math.min(y0, c[1])), (y1 = Math.max(y1, c[1]))) : c.forEach(walk));
  walk(f.geometry.coordinates);
  return [x0, y0, x1, y1];
});

for (let lat = LAT1 - STEP / 2; lat > LAT0; lat -= STEP) {
  for (let lon = LON0 + STEP / 2; lon < LON1; lon += STEP) {
    let hit = null;
    for (let i = 0; i < countries.length; i++) {
      const b = boxes[i];
      if (lon < b[0] || lon > b[2] || lat < b[1] || lat > b[3]) continue;
      if (geoContains(countries[i], [lon, lat])) { hit = countries[i]; break; }
    }
    if (!hit) continue;
    const id = String(hit.id).padStart(3, '0');
    const key = OMAN.has(id) ? 'oman' : GCC.has(id) ? 'gcc' : AFRICA.has(id) ? 'africa' : 'land';
    const [x, y] = project([lon, lat]);
    buckets[key].push(`M${x.toFixed(1)} ${y.toFixed(1)}h0`);
  }
}
// Oman is small at this density: add a finer pass so the origin reads clearly.
buckets.oman = [];
const oman = countries.find((f) => String(f.id) === '512');
for (let lat = 27; lat > 16; lat -= STEP / 2) for (let lon = 51.5; lon < 60.5; lon += STEP / 2)
  if (geoContains(oman, [lon, lat])) { const [x, y] = project([lon, lat]); buckets.oman.push(`M${x.toFixed(1)} ${y.toFixed(1)}h0`); }

const origin = project([54.09, 17.02]); // Salalah

// Arc end-points indicate market directions only — not offices or facilities.
const targets = {
  gcc: [[55.27, 25.2], [46.7, 24.7], [51.5, 25.3], [47.98, 29.37], [50.58, 26.22]],
  africa: [[39.67, -4.04], [39.28, -6.8], [43.15, 11.59], [3.38, 6.52], [31.0, -29.86], [31.2, 30.0], [45.34, 2.04]],
  global: [[4.4, 51.9], [72.8, 19.0], [103.8, 1.35], [121.5, 31.2], [-10, 35], [114, -28]],
};
const arcs = [];
for (const [region, pts] of Object.entries(targets)) {
  for (const p of pts) {
    const [x, y] = project(p);
    const [ox, oy] = origin;
    const dx = x - ox, dy = y - oy, d = Math.hypot(dx, dy);
    const lift = Math.min(160, d * 0.32);
    const cx = (ox + x) / 2 - (dy / d) * lift * 0.2, cy = (oy + y) / 2 - lift;
    arcs.push({ region, d: `M${ox.toFixed(1)} ${oy.toFixed(1)}Q${cx.toFixed(1)} ${cy.toFixed(1)} ${x.toFixed(1)} ${y.toFixed(1)}`, end: [+x.toFixed(1), +y.toFixed(1)] });
  }
}

const labels = [
  { region: 'oman', text: 'Oman', at: project([57.5, 21.2]) },
  { region: 'gcc', text: 'GCC', at: project([44.5, 27.5]) },
  { region: 'africa', text: 'Africa', at: project([20, 3]) },
  { region: 'global', text: 'Global markets', at: project([90, 42]) },
].map((l) => ({ ...l, at: l.at.map((n) => +n.toFixed(1)) }));

const out = {
  viewBox: `0 0 ${W} ${H}`,
  paths: Object.fromEntries(Object.entries(buckets).map(([k, v]) => [k, v.join('')])),
  origin: origin.map((n) => +n.toFixed(1)),
  arcs,
  labels,
};
fs.writeFileSync(new URL('../src/data/map.json', import.meta.url), JSON.stringify(out));
console.log('map:', Object.fromEntries(Object.entries(buckets).map(([k, v]) => [k, v.length])));
