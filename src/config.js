/**
 * Site-wide configuration.
 *
 * Enquiry delivery (src/js/enquiry.js tries these in order):
 *  1. `formEndpoint` — any multipart form service (Formspree, Getform, Basin, your own API).
 *     Example: 'https://formspree.io/f/xxxxxxx'
 *  2. Netlify Forms — automatic when the site is hosted on Netlify (the form carries
 *     data-netlify="true"; uploads and submissions appear in the Netlify dashboard).
 *  3. Email fallback — opens the visitor's mail client addressed to `email` with the
 *     requirement pre-written. Attachments must then be added manually, and the visitor
 *     is told so.
 */
export const site = {
  name: 'GES Global Trade',
  legalName: 'Global Environmental Services & Trading SPC',
  url: 'https://www.gesglobaltrade.com',
  email: 'info@gesglobaltrade.com',
  location: 'Salalah, Sultanate of Oman',
  markets: ['Oman', 'GCC', 'Africa', 'Global Markets'],
  formEndpoint: '',
  title: 'GES Global Trade | Industrial Products & Procurement Solutions',
  description:
    'GES Global Trade is an Oman-based trading and procurement company supplying industrial, electrical, construction, power, water, environmental and project products across Oman, the GCC, Africa and global markets.',
};
