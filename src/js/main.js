import '../styles/main.css';
import { products, byId, bySlug, pad } from '../data/products.js';
import IMAGES from '../data/images.json';
import { pictureFrom, productDetail, esc } from '../templates/shared.js';
import { initEnquiry, prefill } from './enquiry.js';

const picture = pictureFrom(IMAGES);
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;
const desktop = matchMedia('(min-width: 1000px)');

document.documentElement.classList.add('js');
$$('[data-year]').forEach((el) => (el.textContent = new Date().getFullYear()));

/* ------------------------------------------------------------------ header */
(function header() {
  const h = $('[data-header]');
  if (!h) return;
  let last = 0;
  const onScroll = () => {
    const y = scrollY;
    h.classList.toggle('is-scrolled', y > 24);
    const menuOpen = document.body.classList.contains('menu-open');
    h.classList.toggle('is-hidden', !menuOpen && y > innerHeight * 0.9 && y > last + 4);
    if (y < last - 4) h.classList.remove('is-hidden');
    last = y;
  };
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Mobile menu
  const btn = $('[data-menu-toggle]');
  const menu = $('[data-mobile-menu]');
  const set = (open) => {
    btn.setAttribute('aria-expanded', open);
    menu.hidden = !open;
    menu.classList.toggle('is-open', open);
    document.body.classList.toggle('is-locked', open);
    document.body.classList.toggle('menu-open', open);
    if (open) h.classList.add('is-scrolled');
  };
  btn?.addEventListener('click', () => set(btn.getAttribute('aria-expanded') !== 'true'));
  menu?.addEventListener('click', (e) => e.target.closest('a') && set(false));
  addEventListener('keydown', (e) => e.key === 'Escape' && btn?.getAttribute('aria-expanded') === 'true' && set(false));

  // Active section in nav
  const links = $$('.site-nav a');
  const map = new Map(links.map((a) => [a.hash.slice(1), a]));
  const io = new IntersectionObserver(
    (es) => es.forEach((e) => e.isIntersecting && links.forEach((a) => a.setAttribute('aria-current', a === map.get(e.target.id)))),
    { rootMargin: '-45% 0px -50% 0px' },
  );
  map.forEach((_, id) => { const s = document.getElementById(id); s && io.observe(s); });
})();

/* ------------------------------------------------------------------ reveal */
(function reveal() {
  const els = $$('[data-reveal]');
  if (reduced || !('IntersectionObserver' in window)) return els.forEach((e) => e.classList.add('is-in'));
  const io = new IntersectionObserver(
    (es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } }),
    { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
  );
  els.forEach((e) => io.observe(e));
})();

/* ------------------------------------------------------- hero parallax */
(function parallax() {
  const els = $$('[data-parallax]');
  if (reduced || !els.length) return;
  let ticking = false;
  const run = () => {
    ticking = false;
    els.forEach((el) => {
      const r = el.parentElement.getBoundingClientRect();
      if (r.bottom < 0) return;
      const k = parseFloat(el.dataset.parallax);
      el.style.transform = `translate3d(0, ${(-r.top * k).toFixed(1)}px, 0) scale(${1 + Math.min(1, -r.top / r.height) * 0.06})`;
    });
  };
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(run); } }, { passive: true });
})();

/* ------------------------------------------------- magnetic + tilt */
if (finePointer && !reduced) {
  $$('[data-magnetic]').forEach((el) => {
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left - r.width / 2) / r.width;
      const y = (e.clientY - r.top - r.height / 2) / r.height;
      el.style.transform = `translate(${x * 10}px, ${y * 8}px)`;
    });
    el.addEventListener('pointerleave', () => (el.style.transform = ''));
  });
  $$('[data-tilt]').forEach((el) => {
    const card = el.parentElement;
    card.addEventListener('pointermove', (e) => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      el.style.transform = `translate3d(${x * -18}px, ${y * -14}px, 0)`;
    });
    card.addEventListener('pointerleave', () => (el.style.transform = ''));
    el.style.transition = 'transform 1.2s cubic-bezier(.22,1,.36,1)';
  });
}

/* ------------------------------------------------- flagship accordion */
(function flagships() {
  const grid = $('[data-flagships]');
  if (!grid) return;
  const cards = $$('.flagship', grid);
  const activate = (c) => cards.forEach((x) => x.classList.toggle('is-active', x === c));
  const sync = () => grid.classList.toggle('is-interactive', matchMedia('(min-width: 900px)').matches);
  sync();
  addEventListener('resize', sync);
  cards.forEach((c) => {
    c.addEventListener('pointerenter', () => activate(c));
    c.addEventListener('focusin', () => activate(c));
    c.addEventListener('keydown', (e) => { if (e.key === 'Enter' && e.target === c) openProduct(+c.dataset.openProduct); });
  });
})();

/* ------------------------------------------------------- 21-platform stage */
let stageGoTo = () => {};
(function stage() {
  const root = $('[data-stage]');
  if (!root) return;
  const track = $('[data-stage-track]', root);
  const slides = $$('.slide', track);
  const N = slides.length;
  const num = $('[data-stage-num]', root);
  const name = $('[data-stage-name]', root);
  const desc = $('[data-stage-desc]', root);
  const keys = $('[data-stage-keys]', root);
  const explore = $('[data-stage-explore]', root);
  const enquire = $('[data-stage-enquire]', root);
  const progress = $('[data-stage-progress]', root);
  const rail = $$('[data-goto]');
  const bgs = $$('[data-stage-bg] picture');
  let i = 0;

  const swap = (el, html) => {
    if (reduced) { el.innerHTML = html; return; }
    el.classList.remove('is-in');
    el.classList.add('is-out');
    setTimeout(() => { el.innerHTML = html; el.classList.remove('is-out'); el.classList.add('is-in'); }, 300);
  };

  const loadBg = (k) => { const img = bgs[k]?.querySelector('img'); if (img && !img.src) img.src = img.dataset.src; };

  function render(animateText = true) {
    slides.forEach((s, k) => {
      let d = (k - i + N) % N;
      if (d > N / 2) d -= N;
      s.dataset.pos = Math.abs(d) <= 2 ? d : 'far';
      s.setAttribute('aria-hidden', d !== 0);
      s.querySelectorAll('a').forEach((a) => (a.tabIndex = d === 0 && !a.classList.contains('slide__hit') ? 0 : -1));
      if (Math.abs(d) <= 1) s.querySelector('img')?.setAttribute('loading', 'eager');
    });
    const p = products[i];
    num.textContent = pad(p.id);
    progress.style.setProperty('--p', (i + 1) / N);
    explore.href = `/products/${p.slug}/`;
    explore.dataset.openProduct = p.id;
    enquire.dataset.product = p.name;
    if (animateText) {
      swap(name, esc(p.name));
      swap(desc, esc(p.short));
      swap(keys, p.keyProducts.map((k) => `<span class="tag">${esc(k)}</span>`).join(''));
    }
    rail.forEach((b, k) => b.setAttribute('aria-current', k === i));
    loadBg(i);
    bgs.forEach((b, k) => b.classList.toggle('is-active', k === i));
  }

  const go = (k) => {
    i = (k + N) % N;
    if (desktop.matches) render();
    else {
      // Mobile: scroll the snap track to the card.
      const s = slides[i];
      track.scrollTo({ left: s.offsetLeft - track.offsetLeft - parseFloat(getComputedStyle(track).paddingLeft), behavior: reduced ? 'auto' : 'smooth' });
      render(false);
    }
  };
  stageGoTo = go;

  $('[data-stage-prev]', root).addEventListener('click', () => go(i - 1));
  $('[data-stage-next]', root).addEventListener('click', () => go(i + 1));
  rail.forEach((b) => b.addEventListener('click', () => go(+b.dataset.goto)));
  root.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); go(i + 1); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); go(i - 1); }
  });

  // Clicking a side slide brings it to the front instead of opening it.
  slides.forEach((s, k) =>
    s.addEventListener('click', (e) => {
      if (desktop.matches && s.dataset.pos !== '0') { e.preventDefault(); e.stopPropagation(); go(k); }
    }, true),
  );

  // Desktop drag / swipe on the stage.
  let sx = null, moved = false;
  track.addEventListener('pointerdown', (e) => { if (desktop.matches) { sx = e.clientX; moved = false; } });
  addEventListener('pointerup', (e) => {
    if (sx === null) return;
    const dx = e.clientX - sx;
    sx = null;
    if (Math.abs(dx) > 50) { moved = true; go(i + (dx < 0 ? 1 : -1)); }
  });
  track.addEventListener('click', (e) => { if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; } }, true);

  // Mobile: keep the index in sync with swipe position.
  let raf;
  track.addEventListener('scroll', () => {
    if (desktop.matches) return;
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => {
      const w = slides[0].getBoundingClientRect().width + 12;
      const k = Math.round(track.scrollLeft / w);
      if (k !== i && k >= 0 && k < N) { i = k; render(false); }
    });
  }, { passive: true });

  desktop.addEventListener('change', () => render(false));
  render(false);
})();

/* --------------------------------------------------- product panel */
const panel = $('[data-panel]');
let lastFocus = null;
function openProduct(id, { push = true } = {}) {
  const p = byId[id];
  if (!p) return;
  if (!panel) { location.href = `/products/${p.slug}/`; return; }
  lastFocus = document.activeElement;
  const body = $('[data-panel-body]', panel);
  body.innerHTML = productDetail(p, { picture, mode: 'panel' });
  const sheet = $('[data-panel-sheet]', panel);
  sheet.scrollTop = 0;
  panel.classList.add('is-open');
  panel.setAttribute('aria-hidden', 'false');
  document.body.classList.add('is-locked');
  setTimeout(() => sheet.focus({ preventScroll: true }), 50);
  if (push) history.pushState({ product: p.slug }, '', `?product=${p.slug}`);
  document.title = `${p.name} | GES Global Trade`;
}
function closeProduct({ pop = false } = {}) {
  if (!panel?.classList.contains('is-open')) return;
  panel.classList.remove('is-open');
  panel.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('is-locked');
  document.title = 'GES Global Trade | Industrial Products & Procurement Solutions';
  if (!pop && history.state?.product) history.back();
  lastFocus?.focus?.({ preventScroll: true });
}
document.addEventListener('click', (e) => {
  const t = e.target.closest('[data-open-product]');
  if (t && panel && !e.metaKey && !e.ctrlKey && !e.shiftKey) {
    e.preventDefault();
    const already = panel.classList.contains('is-open');
    openProduct(+t.dataset.openProduct, { push: !already });
    if (already) history.replaceState({ product: byId[+t.dataset.openProduct].slug }, '', `?product=${byId[+t.dataset.openProduct].slug}`);
  }
  if (e.target.closest('[data-panel-close]')) closeProduct();
});
if (panel) {
  addEventListener('keydown', (e) => {
    if (!panel.classList.contains('is-open')) return;
    if (e.key === 'Escape') closeProduct();
    if (e.key === 'Tab') {
      const f = $$('a[href], button, [tabindex="0"]', panel).filter((x) => x.offsetParent !== null);
      if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
  addEventListener('popstate', () => {
    const slug = new URLSearchParams(location.search).get('product');
    if (slug && bySlug[slug]) openProduct(bySlug[slug].id, { push: false });
    else closeProduct({ pop: true });
  });
  const slug = new URLSearchParams(location.search).get('product');
  if (slug && bySlug[slug]) {
    history.replaceState({ product: slug }, '', location.href);
    openProduct(bySlug[slug].id, { push: false });
  }
}

/* ------------------------------------------------- enquiry */
initEnquiry();
document.addEventListener('click', (e) => {
  const t = e.target.closest('[data-enquire]');
  if (!t) return;
  const form = $('[data-enquiry-form]');
  if (!form) return; // link navigates to /#enquiry
  e.preventDefault();
  const inPanel = panel?.classList.contains('is-open') && panel.contains(t);
  const go = () => {
    prefill({ product: t.dataset.product, also: t.dataset.also?.split('|') });
    $('#enquiry').scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
    setTimeout(() => $('#f-name')?.focus({ preventScroll: true }), reduced ? 0 : 900);
  };
  if (inPanel) { closeProduct(); setTimeout(go, 350); } else go();
});
if (location.hash === '#enquiry') {
  const p = new URLSearchParams(location.search).get('enquire');
  if (p) prefill({ product: p });
}

/* --------------------------------------------- process line progress */
(function processLine() {
  const line = $('[data-process]');
  if (!line) return;
  const steps = $$('[data-step]', line);
  const fill = $('.process__fill', line);
  let ticking = false;
  const run = () => {
    ticking = false;
    const r = line.getBoundingClientRect();
    const vh = innerHeight;
    const horizontal = desktop.matches;
    const p = horizontal ? Math.min(1, Math.max(0, (vh * 0.85 - r.top) / (vh * 0.5))) : Math.min(1, Math.max(0, (vh * 0.7 - r.top) / r.height));
    fill.style.transform = horizontal ? `scaleX(${p})` : `scaleY(${p})`;
    steps.forEach((s, k) => s.classList.toggle('is-on', p >= (k / (steps.length - 1)) * 0.98 || (reduced && true)));
  };
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(run); } }, { passive: true });
  addEventListener('resize', run);
  run();
})();

/* ------------------------------------------------------- market map */
(function map() {
  const m = $('[data-map]');
  if (!m) return;
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { m.classList.add('is-in'); io.disconnect(); } }), { threshold: 0.25 });
  io.observe(m);
  const btns = $$('[data-regions] [data-region]');
  const set = (k) => {
    if (k) m.dataset.focus = k; else delete m.dataset.focus;
    btns.forEach((b) => b.setAttribute('aria-pressed', b.dataset.region === k));
  };
  btns.forEach((b) => {
    b.addEventListener('click', () => set(m.dataset.focus === b.dataset.region ? null : b.dataset.region));
    if (finePointer) {
      b.addEventListener('pointerenter', () => set(b.dataset.region));
      b.addEventListener('pointerleave', () => set(null));
    }
  });
})();

/* ------------------------------------------------- 3D brand symbol */
(function symbol() {
  const host = $('[data-symbol3d]');
  if (!host || reduced) return;
  const gl = (() => { try { const c = document.createElement('canvas'); return !!(c.getContext('webgl2') || c.getContext('webgl')); } catch { return false; } })();
  if (!gl) return;
  const io = new IntersectionObserver((es) => {
    if (es.some((e) => e.isIntersecting)) {
      io.disconnect();
      import('./symbol3d.js').then((m) => m.mount(host)).catch(() => {});
    }
  }, { rootMargin: '300px' });
  io.observe(host);
})();
