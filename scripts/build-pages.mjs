// Generates every HTML page from src/data + src/templates, plus SEO files and PNG icons.
// Output HTML is written to the project root (Vite's root) and is git-ignored.
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import { site } from '../src/config.js';
import { products, pad } from '../src/data/products.js';
import { homePage } from '../src/templates/home.js';
import { head, header, footer, picture, esc, arrow, imgPath, IMAGES } from '../src/templates/partials.js';
import { productDetail } from '../src/templates/shared.js';
import { enquirySection } from '../src/templates/enquiry.js';

const ROOT = path.resolve(import.meta.dirname, '..');
const write = (rel, html) => {
  const f = path.join(ROOT, rel);
  fs.mkdirSync(path.dirname(f), { recursive: true });
  fs.writeFileSync(f, html);
};
const script = '<script type="module" src="/src/js/main.js"></script>';

// Clean previously generated product pages (slugs may change).
fs.rmSync(path.join(ROOT, 'products'), { recursive: true, force: true });

/* Home */
write('index.html', homePage());

/* Product pages */
products.forEach((p, i) => {
  const prev = products[(i + products.length - 1) % products.length];
  const next = products[(i + 1) % products.length];
  const url = `${site.url}/products/${p.slug}/`;
  const title = `${p.name} | GES Global Trade`;
  const description = `${p.short} Sourced and supplied by GES Global Trade from Salalah, Oman to the GCC, Africa and global markets.`;
  const jsonld = [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${site.url}/` },
        { '@type': 'ListItem', position: 2, name: 'Products', item: `${site.url}/#products` },
        { '@type': 'ListItem', position: 3, name: p.name, item: url },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'OfferCatalog',
      name: p.name,
      url,
      description: p.intro,
      provider: { '@type': 'Organization', name: site.name, url: site.url },
      itemListElement: p.groups.map((g) => ({ '@type': 'OfferCatalog', name: g.title, itemListElement: g.items.map((n) => ({ '@type': 'Offer', itemOffered: { '@type': 'Product', name: n } })) })),
    },
  ];
  const preload = `<link rel="preload" as="image" type="image/avif" imagesrcset="${IMAGES[p.image].widths.map((w) => `${imgPath(p.image, w, 'avif')} ${w}w`).join(', ')}" imagesizes="100vw" fetchpriority="high">`;
  write(
    `products/${p.slug}/index.html`,
    `${head({ title, description, path: `/products/${p.slug}/`, image: p.image, jsonld, preload })}
<body class="page-product">
${header({ home: false })}
<main id="main">
<article class="pd">
${productDetail(p, { picture, mode: 'page' })}
</article>
<div class="wrap"><nav class="pager" aria-label="More product platforms">
  <a href="/products/${prev.slug}/"><span>← ${pad(prev.id)}</span><strong>${esc(prev.name)}</strong></a>
  <a href="/products/${next.slug}/"><span>${pad(next.id)} →</span><strong>${esc(next.name)}</strong></a>
</nav></div>
${enquirySection({ selected: p.name, heading: 'Tell us what you need.' })}
</main>
${footer()}
${script}
</body>
</html>`,
  );
});

/* Thank-you & 404 */
const simple = (rel, { title, h, p, cta, noindex }) =>
  write(
    rel,
    `${head({ title, description: site.description, path: '/' + rel.replace('index.html', '') }).replace('</head>', noindex ? '<meta name="robots" content="noindex">\n</head>' : '</head>')}
<body class="page-simple">
${header({ home: false })}
<main id="main" class="simple"><div>
  <p class="eyebrow eyebrow--accent">GES Global Trade</p>
  <h1 class="display-l">${h}</h1>
  <p>${p}</p>
  ${cta}
</div></main>
${footer()}
${script}
</body>
</html>`,
  );
simple('thank-you/index.html', {
  title: 'Requirement received | GES Global Trade',
  h: 'Requirement received.',
  p: `Thank you. We will review the requirement and reply by email. If anything is urgent or you have further documents, write to <a href="mailto:${site.email}" style="color:#8fd0ff">${site.email}</a>.`,
  cta: `<a class="btn btn--primary btn--lg" href="/">Back to GES Global Trade ${arrow()}</a>`,
  noindex: true,
});
simple('404.html', {
  title: 'Page not found | GES Global Trade',
  h: 'This page isn’t here.',
  p: 'The page may have moved. Explore the 21 product platforms or send us the requirement directly.',
  cta: `<a class="btn btn--primary btn--lg" href="/#products">Explore Products ${arrow()}</a>`,
  noindex: true,
});

/* SEO files */
const today = new Date().toISOString().slice(0, 10);
fs.writeFileSync(
  path.join(ROOT, 'public/sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${site.url}/</loc><lastmod>${today}</lastmod><priority>1.0</priority></url>
${products.map((p) => `  <url><loc>${site.url}/products/${p.slug}/</loc><lastmod>${today}</lastmod><priority>${p.flagship ? '0.9' : '0.7'}</priority></url>`).join('\n')}
</urlset>
`,
);
fs.writeFileSync(path.join(ROOT, 'public/robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${site.url}/sitemap.xml\n`);
fs.writeFileSync(
  path.join(ROOT, 'public/site.webmanifest'),
  JSON.stringify(
    {
      name: site.name,
      short_name: 'GES',
      start_url: '/',
      display: 'browser',
      background_color: '#050C18',
      theme_color: '#050C18',
      icons: [
        { src: '/brand/icon-192.png', sizes: '192x192', type: 'image/png' },
        { src: '/brand/icon-512.png', sizes: '512x512', type: 'image/png' },
      ],
    },
    null,
    1,
  ),
);

/* PNG icons + raster logos from the SVG masters */
const brand = path.join(ROOT, 'public/brand');
const fav = fs.readFileSync(path.join(brand, 'favicon.svg'));
await Promise.all([
  sharp(fav, { density: 300 }).resize(32, 32).png().toFile(path.join(brand, 'favicon-32.png')),
  sharp(fav, { density: 600 }).resize(180, 180).png().toFile(path.join(brand, 'apple-touch-icon.png')),
  sharp(fav, { density: 600 }).resize(192, 192).png().toFile(path.join(brand, 'icon-192.png')),
  sharp(fav, { density: 1200 }).resize(512, 512).png().toFile(path.join(brand, 'icon-512.png')),
  sharp(fs.readFileSync(path.join(brand, 'ges-logo-dark.svg')), { density: 600 }).resize({ width: 1200 }).png().toFile(path.join(brand, 'ges-logo-dark.png')),
  sharp(fs.readFileSync(path.join(brand, 'ges-logo-light.svg')), { density: 600 }).resize({ width: 1200 }).png().toFile(path.join(brand, 'ges-logo-light.png')),
]);

console.log(`pages: 1 home + ${products.length} products + thank-you + 404`);
