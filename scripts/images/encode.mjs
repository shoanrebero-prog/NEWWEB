// node encode.mjs <master.png> <out-prefix> <w1,w2,...> <masterWidth>
// Writes <out-prefix>-<w>.avif and .webp for each width. Widths larger than the
// master are upscaled with Lanczos3 and lightly sharpened.
import sharp from 'sharp';

const [, , src, prefix, list, mw] = process.argv;
const widths = list.split(',').map(Number);
const pipe = (w) => {
  let s = sharp(src).resize({ width: w, kernel: 'lanczos3' });
  if (w > +mw) s = s.sharpen({ sigma: 0.6, m1: 0.4, m2: 1.2 });
  return s;
};
await Promise.all(
  widths.flatMap((w) => [
    pipe(w).avif({ quality: w > 1400 ? 52 : 56, effort: 5 }).toFile(`${prefix}-${w}.avif`),
    pipe(w).webp({ quality: w > 1400 ? 74 : 78, effort: 5 }).toFile(`${prefix}-${w}.webp`),
  ]),
);
