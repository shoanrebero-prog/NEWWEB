import { site } from '../config.js';
import { products, pad } from '../data/products.js';
import { esc, arrow } from './shared.js';

/**
 * The enquiry section. Used on the homepage and on every product page.
 * `selected` pre-fills the primary platform (product pages); on the homepage the
 * platform is set at runtime from whichever product the visitor was viewing.
 */
export function enquirySection({ selected = '', heading = 'Tell us what you need.' } = {}) {
  return `
<section class="enquiry" id="enquiry" aria-labelledby="enquiry-title">
  <div class="enquiry__bg" aria-hidden="true"></div>
  <div class="wrap enquiry__grid">
    <div class="enquiry__intro">
      <p class="eyebrow eyebrow--accent">Send the requirement</p>
      <h2 class="display-l" id="enquiry-title">${esc(heading)}</h2>
      <p class="lead">Product, specification, quantity and destination — start with what you know.</p>
      <ul class="enquiry__steps" role="list">
        <li><span class="mono">01</span>We review the requirement and confirm anything open.</li>
        <li><span class="mono">02</span>We identify suitable sources for each line.</li>
        <li><span class="mono">03</span>You receive clear commercial options — quantities, packing and lead times.</li>
      </ul>
      <div class="enquiry__direct">
        <p class="eyebrow">Prefer email?</p>
        <a href="mailto:${site.email}" class="enquiry__email">${site.email}</a>
      </div>
    </div>

    <form class="form" name="enquiry" method="POST" action="/thank-you/" enctype="multipart/form-data"
          data-netlify="true" netlify-honeypot="company_website" data-enquiry-form novalidate>
      <input type="hidden" name="form-name" value="enquiry">
      <input type="hidden" name="source_page" value="" data-source-page>
      <p class="hp" aria-hidden="true"><label>Leave empty <input name="company_website" tabindex="-1" autocomplete="off"></label></p>

      <div class="form__row form__row--2">
        <div class="field">
          <label for="f-name">Name <span aria-hidden="true">*</span></label>
          <input id="f-name" name="name" autocomplete="name" required>
        </div>
        <div class="field">
          <label for="f-company">Company</label>
          <input id="f-company" name="company" autocomplete="organization">
        </div>
      </div>
      <div class="field">
        <label for="f-email">Email <span aria-hidden="true">*</span></label>
        <input id="f-email" name="email" type="email" autocomplete="email" required>
      </div>

      <div class="field">
        <label for="f-product">Product platform <span aria-hidden="true">*</span></label>
        <div class="select">
          <select id="f-product" name="product_platform" required data-product-select>
            <option value=""${selected ? '' : ' selected'} disabled>Select a product platform</option>
            ${products.map((p) => `<option value="${esc(p.name)}"${p.name === selected ? ' selected' : ''}>${pad(p.id)} — ${esc(p.name)}</option>`).join('')}
            <option value="Multiple / other">Multiple platforms / other</option>
          </select>
        </div>
        <details class="addmore" data-addmore>
          <summary>+ Add other platforms to the same enquiry</summary>
          <fieldset class="chips" aria-label="Additional product platforms">
            ${products
              .map(
                (p) =>
                  `<label class="chip"><input type="checkbox" name="additional_platforms" value="${esc(p.name)}"><span>${esc(p.name)}</span></label>`,
              )
              .join('')}
          </fieldset>
        </details>
      </div>

      <div class="field">
        <label for="f-req">Product / requirement <span aria-hidden="true">*</span></label>
        <textarea id="f-req" name="requirement" rows="3" required placeholder="e.g. 4C × 95 mm² XLPE/SWA/PVC armoured cable, 1,200 m"></textarea>
      </div>
      <div class="field">
        <label for="f-spec">Specification</label>
        <textarea id="f-spec" name="specification" rows="2" placeholder="Standard, grade, size, rating, application — or describe the use if the specification is open"></textarea>
      </div>
      <div class="form__row form__row--3">
        <div class="field">
          <label for="f-qty">Quantity</label>
          <input id="f-qty" name="quantity" placeholder="e.g. 2 × 40ft / 500 MT">
        </div>
        <div class="field">
          <label for="f-loc">Delivery location</label>
          <input id="f-loc" name="delivery_location" placeholder="Port, city or site">
        </div>
        <div class="field">
          <label for="f-date">Required delivery date</label>
          <input id="f-date" name="required_date" type="date">
        </div>
      </div>

      <div class="field">
        <span class="label" id="f-files-label">BOQ / specification / drawing</span>
        <label class="dropzone" for="f-files" data-dropzone>
          <input id="f-files" name="attachments" type="file" multiple
                 accept=".pdf,.xls,.xlsx,.csv,.doc,.docx,.dwg,.dxf,.jpg,.jpeg,.png,.zip" aria-describedby="f-files-help" data-files>
          <span class="dropzone__icon" aria-hidden="true">
            <svg viewBox="0 0 24 24"><path d="M12 16V4m0 0-4.5 4.5M12 4l4.5 4.5M4 15v4.5h16V15" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>
          </span>
          <span class="dropzone__text"><strong>Upload files</strong> or drag them here</span>
          <span class="dropzone__help" id="f-files-help">PDF, Excel, Word, DWG/DXF, images or ZIP · up to 8 MB total</span>
        </label>
        <ul class="filelist" data-filelist aria-live="polite"></ul>
      </div>

      <div class="form__submit">
        <button class="btn btn--primary btn--lg" type="submit" data-magnetic>
          <span>Send Requirement</span> ${arrow()}
        </button>
        <p class="form__note">We reply by email. Your details are used only to respond to this enquiry.</p>
      </div>
      <div class="form__status" role="status" aria-live="polite" data-form-status></div>
    </form>
  </div>
</section>`;
}
