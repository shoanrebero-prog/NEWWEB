// node encode.mjs <master.png> <out-prefix> <w1,w2,...>
// Writes <out-prefix>-<w>.avif and <out-prefix>-<w>.webp for each width.
import sharp from 'sharp';

const [, , src, prefix, list] = process.argv;
const widths = list.split(',').map(Number);
await Promise.all(
  widths.flatMap((w) => [
    sharp(src).resize({ width: w }).avif({ quality: w > 1400 ? 50 : 55, effort: 5 }).toFile(`${prefix}-${w}.avif`),
    sharp(src).resize({ width: w }).webp({ quality: w > 1400 ? 72 : 76, effort: 5 }).toFile(`${prefix}-${w}.webp`),
  ]),
);
