import fs from 'node:fs';
import { logo } from '../brand/logo.js';
import { site } from '../config.js';
import { products, pad } from '../data/products.js';
import { esc, arrow, pictureFrom } from './shared.js';

export const IMAGES = JSON.parse(fs.readFileSync(new URL('../data/images.json', import.meta.url), 'utf8'));
export const picture = pictureFrom(IMAGES);
export const imgPath = picture.src;
export { esc, arrow };

export function head({ title, description, path = '/', image = 'hero-port', type = 'website', jsonld = [], preload = '' }) {
  const url = site.url + path;
  const ogImg = site.url + imgPath(image, IMAGES[image].widths.filter((w) => w <= 1600).at(-1), 'webp');
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${url}">
<meta name="theme-color" content="#050C18">
<meta name="color-scheme" content="dark light">
<link rel="icon" href="/brand/favicon.svg" type="image/svg+xml">
<link rel="icon" href="/brand/favicon-32.png" sizes="32x32" type="image/png">
<link rel="apple-touch-icon" href="/brand/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
<meta property="og:type" content="${type}">
<meta property="og:site_name" content="${site.name}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${ogImg}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(description)}">
<meta name="twitter:image" content="${ogImg}">
${preload}
${jsonld.map((j) => `<script type="application/ld+json">${JSON.stringify(j)}</script>`).join('\n')}
</head>`;
}

export function header({ home = true } = {}) {
  const base = home ? '' : '/';
  return `
<a class="skip" href="#main">Skip to content</a>
<header class="site-header" data-header>
  <div class="site-header__inner">
    <a class="site-header__logo" href="/" aria-label="GES Global Trade — home">${logo({ variant: 'light' })}</a>
    <nav class="site-nav" aria-label="Primary">
      <a href="${base}#products">Products</a>
      <a href="${base}#industries">Industries</a>
      <a href="${base}#procurement">Procurement</a>
      <a href="${base}#about">About</a>
    </nav>
    <a class="btn btn--primary btn--sm site-header__cta" href="${base}#enquiry" data-enquire data-magnetic>Send Enquiry</a>
    <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="mobile-menu" data-menu-toggle>
      <span class="sr-only">Menu</span><span class="menu-toggle__bars" aria-hidden="true"></span>
    </button>
  </div>
</header>
<div class="mobile-menu" id="mobile-menu" hidden data-mobile-menu>
  <nav aria-label="Mobile">
    <a href="${base}#products"><span>01</span>Products</a>
    <a href="${base}#industries"><span>02</span>Industries</a>
    <a href="${base}#procurement"><span>03</span>Procurement</a>
    <a href="${base}#about"><span>04</span>About</a>
  </nav>
  <a class="btn btn--primary btn--lg btn--block" href="${base}#enquiry" data-enquire>Send Enquiry ${arrow()}</a>
  <p class="mobile-menu__meta">Salalah, Sultanate of Oman<br><a href="mailto:${site.email}">${site.email}</a></p>
</div>`;
}

export function footer() {
  const cols = [products.slice(0, 7), products.slice(7, 14), products.slice(14)];
  return `
<footer class="site-footer">
  <div class="wrap site-footer__top">
    <div class="site-footer__brand">
      <a href="/" aria-label="GES Global Trade — home">${logo({ variant: 'light' })}</a>
      <p class="site-footer__legal">${site.legalName}</p>
      <p>Salalah, Sultanate of Oman</p>
      <p class="mono site-footer__markets">Oman · GCC · Africa · Global Markets</p>
      <a class="site-footer__email" href="mailto:${site.email}">${site.email}</a>
    </div>
    <nav class="site-footer__nav" aria-label="Footer">
      <div>
        <p class="eyebrow">Company</p>
        <a href="/#products">Products</a><a href="/#industries">Industries</a><a href="/#procurement">Procurement</a><a href="/#about">About</a><a href="/#enquiry">Send Enquiry</a>
      </div>
      ${cols
        .map(
          (c, i) => `<div>
        <p class="eyebrow">${i === 0 ? 'Product platforms' : '&nbsp;'}</p>
        ${c.map((p) => `<a href="/products/${p.slug}/"><span class="mono">${pad(p.id)}</span> ${esc(p.name)}</a>`).join('')}
      </div>`,
        )
        .join('')}
    </nav>
  </div>
  <div class="wrap site-footer__bottom">
    <p>© <span data-year>2026</span> ${site.legalName}. All rights reserved.</p>
    <p class="mono">Sourcing today for a sustainable tomorrow.</p>
  </div>
</footer>`;
}

/** Product platform <option>s, grouped for the enquiry form. */
export function productOptions(selected = '') {
  return products
    .map((p) => `<option value="${esc(p.name)}"${p.name === selected ? ' selected' : ''}>${pad(p.id)} — ${esc(p.name)}</option>`)
    .join('');
}
