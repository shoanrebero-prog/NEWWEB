import { defineConfig } from 'vite';
import fs from 'node:fs';
import path from 'node:path';

// Every generated HTML page is a build entry (see scripts/build-pages.mjs).
function pages() {
  const input = { index: 'index.html', 'thank-you': 'thank-you/index.html', 404: '404.html' };
  if (fs.existsSync('products')) {
    for (const slug of fs.readdirSync('products')) input[`products/${slug}`] = path.join('products', slug, 'index.html');
  }
  return input;
}

export default defineConfig({
  build: {
    rollupOptions: { input: pages() },
    assetsInlineLimit: 0,
    cssCodeSplit: true,
    chunkSizeWarningLimit: 700, // three.js chunk is lazy-loaded only
  },
  server: { host: true },
});
