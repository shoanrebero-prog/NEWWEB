/**
 * Pure template helpers shared by the Node page builder and the browser bundle.
 * No Node or DOM APIs here — callers pass in the image metadata.
 */
import { byId, pad } from '../data/products.js';

export const esc = (s = '') =>
  String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

export const arrow = (cls = '') =>
  `<svg class="i-arrow ${cls}" viewBox="0 0 20 20" aria-hidden="true"><path d="M3 10h13M11 4.5 16.5 10 11 15.5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="square"/></svg>`;

/** Build a picture() renderer bound to an images.json map. */
export function pictureFrom(IMAGES) {
  const src = (name, w, ext) => `/img/${IMAGES[name].dir}/${name}-${w}.${ext}`;
  function picture(name, { alt, sizes = '100vw', eager = false, className = '', priority = false } = {}) {
    const im = IMAGES[name];
    if (!im) throw new Error(`Unknown image: ${name}`);
    const set = (ext) => im.widths.map((w) => `${src(name, w, ext)} ${w}w`).join(', ');
    const fw = im.widths[Math.min(1, im.widths.length - 1)];
    const a = alt ?? im.alt ?? '';
    return (
      `<picture class="${className}">` +
      `<source type="image/avif" srcset="${set('avif')}" sizes="${sizes}">` +
      `<source type="image/webp" srcset="${set('webp')}" sizes="${sizes}">` +
      `<img src="${src(name, fw, 'webp')}" alt="${esc(a)}" width="${im.width}" height="${im.height}"` +
      ` loading="${eager ? 'eager' : 'lazy'}" decoding="async"${priority ? ' fetchpriority="high"' : ''}` +
      ` style="background-color:${im.color}${im.pos ? `;object-position:${im.pos}` : ''}">` +
      `</picture>`
    );
  }
  picture.src = src;
  return picture;
}

const ul = (items) => `<ul>${items.map((i) => `<li>${esc(i)}</li>`).join('')}</ul>`;

/**
 * Product detail body — used by the slide-over panel and by /products/<slug>/.
 * @param {object} p        product record
 * @param {object} o        { picture, mode: 'panel'|'page' }
 */
export function productDetail(p, { picture, mode = 'panel' }) {
  const num = pad(p.id);
  const req = `<a class="btn btn--primary btn--lg" href="${mode === 'page' ? '#enquiry' : '/#enquiry'}" data-enquire data-product="${esc(p.name)}" data-magnetic>${esc(p.enquiryLabel || 'Request This Product')} ${arrow()}</a>`;
  const crumbs =
    mode === 'page'
      ? `<nav class="crumbs" aria-label="Breadcrumb"><a href="/">Home</a><span aria-hidden="true">/</span><a href="/#products">Products</a><span aria-hidden="true">/</span><span aria-current="page">${esc(p.name)}</span></nav>`
      : '';
  const H = mode === 'page' ? 'h1' : 'h2';

  const hero = `
  <header class="pd__hero">
    ${picture(p.image, { alt: p.imageAlt, sizes: mode === 'page' ? '100vw' : '(min-width: 1080px) 1080px, 100vw', eager: mode === 'page', priority: mode === 'page' })}
    <div class="pd__hero-inner">
      ${crumbs}
      <p class="pd__num">${num} / 21${p.flagship ? ' · Flagship platform' : ''}</p>
      <${H} class="pd__title" ${mode === 'panel' ? 'id="panel-title"' : ''}>${esc(p.name)}</${H}>
      ${p.tagline ? `<p class="pd__tagline">${esc(p.tagline)}</p>` : ''}
    </div>
  </header>`;

  const highlights = p.highlights
    ? `<div class="pd__highlights">${p.highlights.map(([t, d]) => `<div><h3>${esc(t)}</h3><p>${esc(d)}</p></div>`).join('')}</div>`
    : '';

  const gallery =
    p.gallery && p.gallery.length
      ? `<section><h3 class="pd__h">In detail</h3><div class="pd__gallery">${p.gallery
          .map((g, i) => `<figure>${picture(g, { sizes: i === 0 ? '(min-width: 1080px) 700px, 66vw' : '(min-width: 1080px) 340px, 33vw' })}</figure>`)
          .join('')}</div></section>`
      : '';

  const groups = `<section><h3 class="pd__h">Product families</h3><div class="pd__groups">${p.groups
    .map((g) => `<div class="pd__group"><h4>${esc(g.title)}</h4>${ul(g.items)}</div>`)
    .join('')}</div></section>`;

  const ranges = p.ranges
    ? `<div><h3 class="pd__h">Ranges covered</h3><div class="pd__ranges">${p.ranges
        .map(([k, v]) => `<div><span>${esc(k)}</span><span>${esc(v)}</span></div>`)
        .join('')}</div><p class="pd__ranges-note">Indicative ranges from the GES product portfolio. Final specification, rating and model are confirmed against your requirement.</p></div>`
    : '';
  const packaging = p.packaging
    ? `<div><h3 class="pd__h">Supply & packaging</h3><div class="pd__list">${p.packaging.map((x) => `<span class="tag">${esc(x)}</span>`).join('')}${(p.logistics || []).map((x) => `<span class="tag">${esc(x)}</span>`).join('')}</div></div>`
    : '';
  const sectors = `<div><h3 class="pd__h">${p.highlights ? 'Applications & sectors' : 'Industries served'}</h3><div class="pd__list">${p.sectors.map((s) => `<span class="tag">${esc(s)}</span>`).join('')}</div></div>`;

  const side = [ranges, packaging, sectors].filter(Boolean);
  const two = `<div class="pd__two">${side.join('')}</div>`;

  const cta = `
  <div class="pd__cta">
    <div>
      <h3>Send the ${esc(p.name.toLowerCase())} requirement.</h3>
      <p>Product, specification, quantity and destination — start with what you know. Specifications and certificates come from the manufacturer and can be provided on request.</p>
    </div>
    ${req}
  </div>`;

  const related = p.related?.length
    ? `<section><h3 class="pd__h">Often combined with</h3><div class="pd__related">${p.related
        .map((id) => byId[id])
        .map(
          (r) =>
            `<a class="relcard" href="/products/${r.slug}/" data-open-product="${r.id}">${picture(r.image, { alt: '', sizes: '260px' })}<div><span>${pad(r.id)}</span><h4>${esc(r.name)}</h4></div></a>`,
        )
        .join('')}</div></section>`
    : '';

  const full = mode === 'panel' ? `<p class="pd__fullpage">Share or bookmark: <a href="/products/${p.slug}/">open the ${esc(p.name)} page</a></p>` : '';

  return `${hero}
  <div class="pd__body">
    <div class="pd__intro"><p>${esc(p.intro)}</p><div class="pd__intro-actions">${req}</div></div>
    ${highlights}
    ${groups}
    ${gallery}
    ${two}
    ${cta}
    ${related}
    ${full}
  </div>`;
}
