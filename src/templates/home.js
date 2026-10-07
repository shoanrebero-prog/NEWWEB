import fs from 'node:fs';
import { site } from '../config.js';
import { products, flagships, byId, pad } from '../data/products.js';
import { logo } from '../brand/logo.js';
import { head, header, footer, picture, imgPath, esc, arrow } from './partials.js';
import { enquirySection } from './enquiry.js';

const MAP = JSON.parse(fs.readFileSync(new URL('../data/map.json', import.meta.url), 'utf8'));

/* ---------------- Hero ---------------- */
const hero = () => `
<section class="hero" aria-labelledby="hero-title">
  <div class="hero__media" data-parallax="0.18">
    ${picture('hero-port', { alt: 'Container terminal at dusk with ship-to-shore cranes and stacked containers', sizes: '100vw', eager: true, priority: true })}
  </div>
  <div class="hero__grid" aria-hidden="true"></div>
  <div class="wrap hero__content">
    <p class="eyebrow hero__label">Global Environmental Services &amp; Trading SPC</p>
    <h1 class="display-xl hero__title" id="hero-title">
      <span class="line"><span>Sourcing.</span></span>
      <span class="line"><span>Supplying.</span></span>
      <span class="line"><span class="accent">Connecting.</span></span>
    </h1>
    <p class="hero__sub">Industrial products and procurement solutions from Oman to global markets.</p>
    <div class="hero__ctas">
      <a class="btn btn--primary btn--lg" href="#featured" data-magnetic>Explore Products ${arrow()}</a>
      <a class="btn btn--ghost btn--lg" href="#enquiry" data-enquire>Send an Enquiry</a>
    </div>
  </div>
  <p class="hero__scroll" aria-hidden="true">Scroll</p>
</section>`;

/* ---------------- Featured supply (3 flagships) ---------------- */
const featured = () => `
<section class="featured" id="featured" aria-labelledby="featured-title">
  <div class="wrap">
    <div class="featured__head">
      <div>
        <p class="eyebrow eyebrow--accent" data-reveal>Featured supply</p>
        <h2 class="display-m" id="featured-title" data-reveal style="--d:.08s;margin-top:16px">Three core platforms.</h2>
      </div>
      <p class="muted" data-reveal style="--d:.16s;max-width:38ch">Materials, power and storage — where many project and facility requirements begin.</p>
    </div>
    <div class="featured__grid" data-flagships>
      ${flagships
        .map(
          (p, i) => `
      <article class="flagship${i === 0 ? ' is-active' : ''}" data-open-product="${p.id}" tabindex="0" aria-label="${esc(p.name)}" data-reveal style="--d:${i * 0.1}s">
        <div class="flagship__media" data-tilt>${picture(p.image, { alt: p.imageAlt, sizes: '(min-width: 900px) 60vw, 100vw' })}</div>
        <div class="flagship__top"><span>${pad(p.id)}</span><span>Flagship</span></div>
        <div class="flagship__body">
          <h3 class="flagship__name">${esc(p.featuredName)}</h3>
          <p class="flagship__line">${esc(p.featuredLine)}</p>
          <div class="flagship__thumbs" aria-hidden="true">${(p.gallery || []).map((g) => picture(g, { alt: '', sizes: '64px' })).join('')}</div>
          <a class="flagship__cta" href="/products/${p.slug}/" data-open-product="${p.id}">
            <span class="circle">${arrow()}</span><span>${esc(p.cta)}</span>
          </a>
        </div>
      </article>`,
        )
        .join('')}
    </div>
  </div>
</section>`;

/* ---------------- 21 product platforms ---------------- */
const platforms = () => `
<section class="section platforms" id="products" aria-labelledby="platforms-title">
  <div class="platforms__bg" aria-hidden="true" data-stage-bg>
    ${products.map((p, i) => `<picture data-bg="${i}"${i === 0 ? ' class="is-active"' : ''}><img data-src="${imgPath(p.image, 480, 'webp')}" alt="" width="480" height="320"></picture>`).join('')}
  </div>
  <div class="wrap">
    <div class="section-head section-head--split">
      <div>
        <p class="eyebrow eyebrow--accent" data-reveal>Product portfolio</p>
        <h2 class="display-l" id="platforms-title" data-reveal style="--d:.08s;margin-top:18px">21 product platforms.</h2>
      </div>
      <div>
        <p class="lead" data-reveal style="--d:.16s">One commercial relationship across multiple product requirements — from minerals and cable to power, water and site equipment.</p>
      </div>
    </div>

    <div class="stage" data-stage>
      <div class="stage__info">
        <p class="stage__index" aria-live="polite"><span class="now" data-stage-num>01</span><span>/ 21</span></p>
        <h3 class="stage__name"><span class="swap" data-stage-name>${esc(products[0].name)}</span></h3>
        <p class="stage__desc"><span class="swap" data-stage-desc>${esc(products[0].short)}</span></p>
        <div class="stage__keys swap" data-stage-keys>${products[0].keyProducts.map((k) => `<span class="tag">${esc(k)}</span>`).join('')}</div>
        <div class="stage__actions">
          <a class="btn btn--primary" href="/products/${products[0].slug}/" data-stage-explore data-open-product="1" data-magnetic>Explore ${arrow()}</a>
          <a class="btn btn--outline" href="#enquiry" data-enquire data-stage-enquire data-product="${esc(products[0].name)}">Request</a>
        </div>
        <div class="stage__nav">
          <button class="navbtn navbtn--prev" type="button" data-stage-prev aria-label="Previous product platform">${arrow()}</button>
          <div class="stage__progress" aria-hidden="true"><span data-stage-progress></span></div>
          <button class="navbtn" type="button" data-stage-next aria-label="Next product platform">${arrow()}</button>
        </div>
      </div>
      <div class="stage__viewport">
        <div class="stage__track" data-stage-track role="group" aria-roledescription="carousel" aria-label="Product platforms">
          ${products
            .map(
              (p, i) => `
          <div class="slide" data-slide="${i}" data-pos="${i === 0 ? 0 : i === 1 ? 1 : i === 20 ? -1 : 'far'}" role="group" aria-roledescription="slide" aria-label="${pad(p.id)} of 21: ${esc(p.name)}">
            ${picture(p.image, { alt: p.imageAlt, sizes: '(min-width: 1000px) 62vw, 86vw', eager: i < 2 })}
            <a class="slide__hit" href="/products/${p.slug}/" data-open-product="${p.id}" tabindex="-1" aria-hidden="true"></a>
            <div class="slide__m">
              <span class="num">${pad(p.id)} / 21</span>
              <h3>${esc(p.name)}</h3>
              <p>${esc(p.short)}</p>
              <a class="btn btn--primary btn--sm" href="/products/${p.slug}/" data-open-product="${p.id}">Explore ${arrow()}</a>
            </div>
          </div>`,
            )
            .join('')}
        </div>
      </div>
    </div>

    <nav class="rail" aria-label="All product platforms">
      <ol class="rail__list">
        ${products.map((p, i) => `<li class="rail__item"><button type="button" data-goto="${i}"${i === 0 ? ' aria-current="true"' : ''}><span>${pad(p.id)}</span>${esc(p.name)}</button></li>`).join('')}
      </ol>
    </nav>
  </div>
</section>`;

/* ---------------- Multi-category ---------------- */
const BUNDLES = [
  { title: 'Electrical & site package', ids: [2, 3, 18, 14], items: ['Cable', 'Switchgear', 'Safety', 'Site equipment'] },
  { title: 'Materials package', ids: [1, 5, 14], items: ['Gypsum', 'Minerals', 'Construction materials'] },
  { title: 'Warehouse package', ids: [4, 19, 7], items: ['Racking', 'Handling', 'Warehouse accessories'] },
];
const multi = () => `
<section class="section multi" aria-labelledby="multi-title">
  <div class="wrap">
    <div class="section-head section-head--split">
      <div>
        <p class="eyebrow eyebrow--accent" data-reveal>Multi-category procurement</p>
        <h2 class="display-l multi__statement" id="multi-title" data-reveal style="--d:.08s;margin-top:18px">One requirement. Multiple supply categories.</h2>
      </div>
      <p class="lead" data-reveal style="--d:.16s">Projects rarely need one product family. Consolidate compatible requirements through one commercial relationship — fewer suppliers to coordinate, one point of contact.</p>
    </div>
    <div class="bundles">
      ${BUNDLES.map(
        (b, i) => `
      <div class="bundle" data-reveal style="--d:${i * 0.1}s">
        <div class="bundle__head"><span class="mono muted" style="font-size:12px;letter-spacing:.12em">0${i + 1}</span></div>
        <div class="bundle__stack" aria-hidden="true">${b.ids.map((id, j) => `<span class="bundle__pic" style="--i:${j}">${picture(byId[id].image, { alt: '', sizes: '80px' })}</span>`).join('')}</div>
        <h3 class="bundle__title">${esc(b.title)}</h3>
        <p class="bundle__chain">${b.items.map((x) => `<span class="tag">${esc(x)}</span>`).join('<span class="plus">+</span>')}</p>
        <a class="link-arrow" href="#enquiry" data-enquire data-product="Multiple / other" data-also="${b.ids.map((id) => esc(byId[id].name)).join('|')}">Combine in one enquiry ${arrow()}</a>
      </div>`,
      ).join('')}
    </div>
    <p class="multi__note" data-reveal>Requirements can be consolidated across compatible product platforms within a single enquiry. Combinations are confirmed against availability, specification and destination.</p>
  </div>
</section>`;

/* ---------------- Procurement process ---------------- */
const STEPS = [
  ['Understand', 'Requirement · specification · quantity · destination'],
  ['Source', 'Supplier coordination · product availability'],
  ['Compare', 'Commercial options · lead time · delivery considerations'],
  ['Coordinate', 'Documentation · packing · shipment planning'],
  ['Deliver', 'Order follow-up · logistics coordination · customer support'],
];
const process = () => `
<section class="section surface-light process" id="procurement" aria-labelledby="process-title">
  <div class="wrap">
    <div class="section-head section-head--split">
      <div>
        <p class="eyebrow eyebrow--accent" data-reveal>How we work</p>
        <h2 class="display-l" id="process-title" data-reveal style="--d:.08s;margin-top:18px">From requirement to delivery.</h2>
      </div>
      <p class="lead" data-reveal style="--d:.16s">From specification to shipment, the requirement stays connected — one structured process, one point of contact.</p>
    </div>
    <ol class="process__line" role="list" data-process>
      <span class="process__track" aria-hidden="true"><span class="process__fill"></span></span>
      ${STEPS.map(
        ([t, d], i) => `
      <li class="step" data-step>
        <span class="step__dot" aria-hidden="true"></span>
        <div>
          <p class="step__num">0${i + 1}</p>
          <h3 class="step__title">${t}</h3>
          <p class="step__text">${d}</p>
        </div>
      </li>`,
      ).join('')}
    </ol>
    <div class="logistics" data-reveal>
      <div><h3>Packing</h3><p>Bulk, bagged, palletised, drummed or containerised — matched to the product.</p></div>
      <div><h3>Documentation</h3><p>Commercial invoice, packing list, certificate of origin and shipping documents as required.</p></div>
      <div><h3>Freight</h3><p>Sea and land freight to ports, project sites and customer facilities.</p></div>
      <div><h3>Order types</h3><p>Project supply, bulk supply, recurring orders and distribution.</p></div>
    </div>
    <div class="process__foot">
      <p>The product is only the start. Quantities, packing, documentation and lead time are coordinated alongside it.</p>
      <a class="btn btn--dark btn--lg" href="#enquiry" data-enquire data-magnetic>Start with the requirement ${arrow()}</a>
    </div>
  </div>
</section>`;

/* ---------------- Quality ---------------- */
const QUALITY = [
  ['Product suitability', 'Products proposed against the stated specification, application and destination.'],
  ['Supplier coordination', 'Working with reputed manufacturers and suppliers for each platform.'],
  ['Documentation', 'Quotations, shipping and commercial documentation coordinated with the order.'],
  ['Commercial accuracy', 'Clear pricing, quantities, packing details and lead times.'],
];
const quality = () => `
<section class="section quality" aria-labelledby="quality-title">
  <div class="wrap">
    <p class="eyebrow eyebrow--accent" data-reveal>Quality approach</p>
    <h2 class="quality__statement" id="quality-title" data-reveal style="--d:.08s;margin-top:22px">Quality is a process, <em>not a promise.</em></h2>
    <div class="quality__grid">
      ${QUALITY.map(([t, d], i) => `<div class="qpoint" data-reveal style="--d:${i * 0.08}s"><span class="qpoint__n">Q-0${i + 1}</span><h3>${t}</h3><p>${d}</p></div>`).join('')}
    </div>
    <p class="quality__note" data-reveal>Technical specifications and certificates are provided by the manufacturer and can be supplied on request.</p>
  </div>
</section>`;

/* ---------------- Market reach ---------------- */
const REGIONS = [
  ['oman', 'Oman', 'Base of operations · Salalah'],
  ['gcc', 'GCC', 'Regional supply'],
  ['africa', 'Africa', 'Export & project supply'],
  ['global', 'Global markets', 'International sourcing'],
];
const reach = () => {
  const m = MAP;
  const arcs = m.arcs
    .map((a, i) => `<path class="arc" data-region="${a.region}" d="${a.d}" style="--i:${i}" pathLength="1" />`)
    .join('');
  const ends = m.arcs.map((a) => `<circle class="end" cx="${a.end[0]}" cy="${a.end[1]}" r="2.6" />`).join('');
  const labels = m.labels
    .filter((l) => l.region !== 'oman')
    .map((l) => `<text class="label" data-region="${l.region}" x="${l.at[0]}" y="${l.at[1]}" text-anchor="middle">${l.text}</text>`)
    .join('');
  const [ox, oy] = m.origin;
  return `
<section class="section reach" aria-labelledby="reach-title">
  <div class="wrap reach__grid">
    <div>
      <p class="eyebrow eyebrow--accent" data-reveal>Market reach</p>
      <h2 class="display-l" id="reach-title" data-reveal style="--d:.08s;margin-top:18px">From Salalah to global markets.</h2>
      <p class="lead" data-reveal style="--d:.16s;margin-top:22px">Oman-based. International sourcing. Regional and global markets.</p>
      <div class="reach__regions" style="margin-top:40px" data-regions>
        ${REGIONS.map(([k, t, d], i) => `<button class="region-btn" type="button" data-region="${k}" aria-pressed="false"><span class="n">0${i + 1}</span><span class="t">${t}</span><span class="d">${d}</span></button>`).join('')}
      </div>
      <p class="reach__statement">Physical presence: Salalah, Sultanate of Oman.</p>
    </div>
    <div class="map" data-map>
      <svg viewBox="${m.viewBox}" role="img" aria-label="Map showing GES Global Trade based in Salalah, Oman, serving the GCC, Africa and global markets">
        <g class="dots">
          <path class="land" d="${m.paths.land}"/>
          <path class="africa" d="${m.paths.africa}"/>
          <path class="gcc" d="${m.paths.gcc}"/>
          <path class="oman" d="${m.paths.oman}"/>
        </g>
        <g>${arcs}${ends}</g>
        ${labels}
        <circle class="origin-ring" cx="${ox}" cy="${oy}" r="9"/>
        <circle class="origin-ring" cx="${ox}" cy="${oy}" r="9"/>
        <circle class="origin" cx="${ox}" cy="${oy}" r="4.5"/>
        <text class="label label--origin" x="${ox + 14}" y="${oy + 22}">Salalah, Oman</text>
      </svg>
    </div>
  </div>
</section>`;
};

/* ---------------- About + Why GES ---------------- */
const ICON = {
  sourcing: '<path d="M4 12h6m4 0h6M12 4v6m0 4v6" /><circle cx="12" cy="12" r="2.4"/>',
  coverage: '<rect x="4" y="4" width="6.5" height="6.5"/><rect x="13.5" y="4" width="6.5" height="6.5"/><rect x="4" y="13.5" width="6.5" height="6.5"/><rect x="13.5" y="13.5" width="6.5" height="6.5"/>',
  project: '<path d="M4 20V9l8-5 8 5v11"/><path d="M9 20v-6h6v6"/>',
  flex: '<path d="M4 8h12m0 0-3-3m3 3-3 3M20 16H8m0 0 3-3m-3 3 3 3"/>',
  docs: '<path d="M7 3.5h7l4 4V20.5H7z"/><path d="M14 3.5v4h4M10 12h5M10 15.5h5"/>',
  global: '<circle cx="12" cy="12" r="8"/><path d="M4 12h16M12 4c2.5 2.6 2.5 13.4 0 16M12 4c-2.5 2.6-2.5 13.4 0 16"/>',
  long: '<path d="M4 17l5-5 4 4 7-8"/><path d="M15 8h5v5"/>',
  sustain: '<path d="M6 18c0-7 5-12 13-12 0 8-5 13-12 13"/><path d="M6 18l7-7"/>',
};
const WHY = [
  ['sourcing', 'Reliable sourcing', 'Focused supplier coordination.'],
  ['coverage', 'Wide product coverage', 'Multiple product categories through one relationship.'],
  ['project', 'Project support', 'Project, bulk and recurring requirements.'],
  ['flex', 'Commercial flexibility', 'Clear product options and flexible quantities where available.'],
  ['docs', 'Documentation support', 'Quotation, shipping and commercial documentation coordination.'],
  ['global', 'Global reach', 'Oman-based access serving GCC, Africa and global markets.'],
  ['long', 'Long-term approach', 'Built around repeat requirements and dependable partnerships.'],
  ['sustain', 'Sustainable orientation', 'Responsible, long-term value in how we source and supply.'],
];
const about = () => `
<section class="section about" id="about" aria-labelledby="about-title">
  <div class="wrap">
    <div class="about__grid">
      <div class="about__visual" data-symbol3d data-reveal>
        <span class="coords coords--top"><span>GES</span><span>Sourcing · Procurement · Supply</span></span>
        <div class="symbol-fallback">${logo({ variant: 'light', layout: 'symbol', title: 'GES symbol' })}</div>
        <span class="coords"><span>17.02° N · 54.09° E</span><span>Salalah</span></span>
      </div>
      <div class="about__copy">
        <p class="eyebrow eyebrow--accent" data-reveal>About GES Global Trade</p>
        <h2 class="display-m" id="about-title" data-reveal style="--d:.08s;margin-top:18px">A connector between supply and opportunity.</h2>
        <p data-reveal style="--d:.12s">Global Environmental Services &amp; Trading SPC, trading as GES Global Trade, is an Oman-based trading and procurement company. We act as a single point of contact between buyers and manufacturers — sourcing, coordinating and supplying products for industrial, commercial and infrastructure requirements.</p>
        <p data-reveal style="--d:.16s">From our base in Salalah, Sultanate of Oman, we serve customers in Oman, the GCC, Africa and international markets. We do not claim to be the largest or the cheapest; we focus on being reliable, transparent and responsive.</p>
        <div class="mv" data-reveal style="--d:.2s">
          <div><h3>Mission</h3><p>To provide reliable and sustainable supply solutions by connecting global markets with quality products.</p></div>
          <div><h3>Vision</h3><p>To become a trusted global trading partner known for integrity, efficiency and long-term value creation.</p></div>
        </div>
        <p class="values" data-reveal><strong>Values</strong><span>Trust</span><span>Quality</span><span>Sustainability</span><span>Customer focus</span><span>Global collaboration</span></p>
      </div>
    </div>

    <div class="why">
      <div class="section-head section-head--split">
        <h2 class="display-m" data-reveal>Why partner with GES.</h2>
        <p class="lead" data-reveal style="--d:.08s">For contractors, industrial facilities, distributors and manufacturers seeking access to Oman, the GCC and Africa.</p>
      </div>
      <div class="why__grid">
        ${WHY.map(([ic, t, d], i) => `<div class="why__item" data-reveal style="--d:${(i % 4) * 0.06}s"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true">${ICON[ic]}</svg><h3>${t}</h3><p>${d}</p></div>`).join('')}
      </div>
    </div>
  </div>
</section>`;

/* ---------------- Industries ---------------- */
const INDUSTRIES = [
  ['Construction & Infrastructure', 'p14-construction', true],
  ['Commercial & Residential Buildings'],
  ['Oil & Gas & Petrochemical', 'p06-valves'],
  ['Industrial & Manufacturing', 'p09-machinery'],
  ['Renewable Energy'],
  ['Marine & Ports', 'hero-port', true],
  ['Utilities & Power Distribution', 'p12-generators'],
  ['Data Centres & Telecom'],
  ['Mining & Aggregates'],
  ['Water & Wastewater', 'p20-water-treatment'],
  ['Agriculture & Irrigation', 'p10-agriculture'],
  ['Logistics & Warehousing', 'p04-racking-b'],
  ['Government & Institutions'],
  ['OEMs & Project Suppliers'],
  ['Retail & Distribution'],
  ['Hotels & Hospitality'],
  ['Healthcare & Education'],
  ['Steel Fabrication'],
  ['Transport & Logistics'],
];
const industries = () => `
<section class="section surface-light industries" id="industries" aria-labelledby="industries-title">
  <div class="wrap">
    <div class="section-head section-head--split">
      <div>
        <p class="eyebrow eyebrow--accent" data-reveal>Industries we support</p>
        <h2 class="display-l" id="industries-title" data-reveal style="--d:.08s;margin-top:18px">Where the supply goes.</h2>
      </div>
      <p class="lead" data-reveal style="--d:.16s">Nineteen sectors across projects, facilities and distribution — each with different specifications, documentation and delivery needs.</p>
    </div>
    <ul class="industries__grid" role="list" style="grid-auto-flow:dense">
      ${INDUSTRIES.map(([t, img, wide], i) =>
        img
          ? `<li class="ind ind--img${wide ? ' ind--wide' : ''}" data-reveal style="--d:${(i % 6) * 0.04}s">${picture(img, { alt: '', sizes: '(min-width: 1100px) 33vw, 50vw' })}<span class="ind__n">${pad(i + 1)}</span><span class="ind__t">${esc(t)}</span></li>`
          : `<li class="ind" data-reveal style="--d:${(i % 6) * 0.04}s"><span class="ind__n">${pad(i + 1)}</span><span class="ind__t">${esc(t)}</span></li>`,
      ).join('')}
    </ul>
  </div>
</section>`;

/* ---------------- Page ---------------- */
export function homePage() {
  const heroImg = (w, ext) => imgPath('hero-port', w, ext);
  const preload = `<link rel="preload" as="image" type="image/avif" imagesrcset="${[640, 960, 1280, 1920, 2400].map((w) => `${heroImg(w, 'avif')} ${w}w`).join(', ')}" imagesizes="100vw" fetchpriority="high">`;
  const jsonld = [
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      '@id': `${site.url}/#org`,
      name: site.name,
      legalName: site.legalName,
      url: site.url,
      logo: `${site.url}/brand/ges-logo-dark.png`,
      email: site.email,
      description: site.description,
      slogan: 'Sourcing. Supplying. Connecting.',
      address: { '@type': 'PostalAddress', addressLocality: 'Salalah', addressCountry: 'OM' },
      areaServed: ['Oman', 'GCC', 'Africa', 'Worldwide'],
      knowsAbout: products.map((p) => p.name),
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Product platforms',
        itemListElement: products.map((p) => ({
          '@type': 'OfferCatalog',
          name: p.name,
          url: `${site.url}/products/${p.slug}/`,
        })),
      },
    },
    { '@context': 'https://schema.org', '@type': 'WebSite', name: site.name, url: site.url, publisher: { '@id': `${site.url}/#org` } },
  ];
  return `${head({ title: site.title, description: site.description, path: '/', jsonld, preload })}
<body class="page-home">
${header({ home: true })}
<main id="main">
${hero()}
${featured()}
${platforms()}
${multi()}
${process()}
${quality()}
${reach()}
${about()}
${industries()}
${enquirySection()}
</main>
${footer()}
<div class="panel" data-panel aria-hidden="true">
  <div class="panel__scrim" data-panel-close></div>
  <div class="panel__sheet" role="dialog" aria-modal="true" aria-labelledby="panel-title" tabindex="-1" data-panel-sheet>
    <button class="panel__close" type="button" data-panel-close aria-label="Close product details"><svg viewBox="0 0 20 20" aria-hidden="true"><path d="M4 4l12 12M16 4 4 16" stroke="currentColor" stroke-width="1.6"/></svg></button>
    <div data-panel-body></div>
  </div>
</div>
<script type="module" src="/src/js/main.js"></script>
</body>
</html>`;
}
