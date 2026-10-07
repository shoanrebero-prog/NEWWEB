import { site } from '../config.js';

const MAX_BYTES = 8 * 1024 * 1024;
const $ = (s, r = document) => r.querySelector(s);

/** Pre-select the product platform (and optional extra platforms) in the enquiry form. */
export function prefill({ product, also } = {}) {
  const form = $('[data-enquiry-form]');
  if (!form) return;
  const sel = $('[data-product-select]', form);
  if (product && sel && [...sel.options].some((o) => o.value === product)) {
    sel.value = product;
    sel.closest('.field')?.classList.remove('is-invalid');
    const wrap = sel.closest('.select');
    wrap.classList.remove('is-flash');
    void wrap.offsetWidth;
    wrap.classList.add('is-flash');
  }
  if (also?.length) {
    const details = $('[data-addmore]', form);
    details.open = true;
    form.querySelectorAll('input[name="additional_platforms"]').forEach((c) => (c.checked = also.includes(c.value)));
  }
}

export function initEnquiry() {
  const form = $('[data-enquiry-form]');
  if (!form) return;
  const status = $('[data-form-status]', form);
  const input = $('[data-files]', form);
  const list = $('[data-filelist]', form);
  const drop = $('[data-dropzone]', form);
  $('[data-source-page]', form).value = location.pathname;
  let files = [];

  const fmt = (b) => (b > 1048576 ? `${(b / 1048576).toFixed(1)} MB` : `${Math.max(1, Math.round(b / 1024))} KB`);
  const syncInput = () => {
    const dt = new DataTransfer();
    files.forEach((f) => dt.items.add(f));
    input.files = dt.files;
  };
  const renderFiles = () => {
    list.innerHTML = files
      .map((f, i) => `<li><span>${f.name.replace(/[<>&"]/g, '')}<small>${fmt(f.size)}</small></span><button type="button" data-remove="${i}" aria-label="Remove ${f.name.replace(/"/g, '')}">Remove</button></li>`)
      .join('');
    const total = files.reduce((a, f) => a + f.size, 0);
    drop.closest('.field').classList.toggle('is-invalid', total > MAX_BYTES);
    let err = drop.closest('.field').querySelector('.field__error');
    if (total > MAX_BYTES) {
      if (!err) { err = document.createElement('p'); err.className = 'field__error'; drop.closest('.field').append(err); }
      err.textContent = `Attachments total ${fmt(total)}. Please keep uploads under 8 MB, or email larger files to ${site.email}.`;
    } else err?.remove();
  };
  const add = (fl) => {
    for (const f of fl) if (!files.some((x) => x.name === f.name && x.size === f.size)) files.push(f);
    syncInput();
    renderFiles();
  };
  input.addEventListener('change', () => { const fl = [...input.files]; files = []; add(fl); });
  list.addEventListener('click', (e) => {
    const b = e.target.closest('[data-remove]');
    if (!b) return;
    files.splice(+b.dataset.remove, 1);
    syncInput();
    renderFiles();
  });
  ['dragenter', 'dragover'].forEach((t) => drop.addEventListener(t, (e) => { e.preventDefault(); drop.classList.add('is-over'); }));
  ['dragleave', 'drop'].forEach((t) => drop.addEventListener(t, (e) => { e.preventDefault(); drop.classList.remove('is-over'); }));
  drop.addEventListener('drop', (e) => add([...e.dataTransfer.files]));

  // Validation
  const fields = [...form.querySelectorAll('[required]')];
  const check = (el) => {
    const ok = el.checkValidity();
    const field = el.closest('.field');
    field.classList.toggle('is-invalid', !ok);
    let err = field.querySelector('.field__error');
    if (!ok) {
      if (!err) { err = document.createElement('p'); err.className = 'field__error'; err.id = `${el.id}-err`; field.append(err); }
      err.textContent = el.type === 'email' && el.value ? 'Please enter a valid email address.' : 'This field is required.';
      el.setAttribute('aria-invalid', 'true');
      el.setAttribute('aria-describedby', err.id);
    } else {
      err?.remove();
      el.removeAttribute('aria-invalid');
      el.removeAttribute('aria-describedby');
    }
    return ok;
  };
  fields.forEach((el) => el.addEventListener('blur', () => el.value && check(el)));
  fields.forEach((el) => el.addEventListener('input', () => el.closest('.field').classList.contains('is-invalid') && check(el)));

  const show = (kind, html) => {
    status.className = `form__status is-${kind}`;
    status.innerHTML = html;
    status.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  };

  const mailto = (fd) => {
    const lines = [
      ['Name', fd.get('name')], ['Company', fd.get('company')], ['Email', fd.get('email')],
      ['Product platform', fd.get('product_platform')], ['Additional platforms', fd.getAll('additional_platforms').join(', ')],
      ['Requirement', fd.get('requirement')], ['Specification', fd.get('specification')], ['Quantity', fd.get('quantity')],
      ['Delivery location', fd.get('delivery_location')], ['Required delivery date', fd.get('required_date')],
      ['Attachments to add', files.map((f) => f.name).join(', ')],
    ].filter(([, v]) => v);
    const body = lines.map(([k, v]) => `${k}: ${v}`).join('\n');
    const subject = `Requirement — ${fd.get('product_platform') || 'Enquiry'}${fd.get('company') ? ` — ${fd.get('company')}` : ''}`;
    return `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const bad = fields.filter((el) => !check(el));
    if (bad.length) { bad[0].focus(); return; }
    if (files.reduce((a, f) => a + f.size, 0) > MAX_BYTES) { drop.focus?.(); return; }
    if (form.company_website.value) return; // honeypot
    const fd = new FormData(form);
    form.classList.add('is-sending');
    status.className = 'form__status';
    status.textContent = 'Sending…';

    const local = /^(localhost|127\.|0\.0\.0\.0|\[::1\])/.test(location.hostname);
    const target = site.formEndpoint || (!local && form.hasAttribute('data-netlify') ? '/' : '');
    let sent = false;
    if (target) {
      try {
        const res = await fetch(target, { method: 'POST', body: fd, headers: { Accept: 'application/json' } });
        sent = res.ok;
      } catch { sent = false; }
    }
    form.classList.remove('is-sending');
    if (sent) {
      form.reset();
      files = [];
      renderFiles();
      show('ok', `<strong>Requirement received.</strong>Thank you — we will review it and reply by email to ${fd.get('email').replace(/[<>&"]/g, '')}.`);
      return;
    }
    // Fallback: prepare an email with the requirement written out.
    const href = mailto(fd);
    show(
      'ok',
      `<strong>Your email is ready to send.</strong>We have opened an email to ${site.email} with your requirement filled in.${files.length ? ' Please attach your files to that email before sending.' : ''} If nothing opened, <a href="${href}" style="color:#8fd0ff;text-decoration:underline">click here</a> or write to <a href="mailto:${site.email}" style="color:#8fd0ff">${site.email}</a>.`,
    );
    location.href = href;
  });
}
