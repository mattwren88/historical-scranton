/* Generate responsive variants of every plate and thumbnail.
   Run after adding or replacing an image:  node tools/images.mjs

   Not called by build.mjs on purpose — encoding 13 pairs takes minutes, and
   the manifest changes far more often than the pixels do. */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { readManifest } from './manifest.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

/* Plate widths. The pair page's stage is 3/5 of a 1180px frame, but the expand
   button can grow it to the full frame, and the browser will not re-pick a
   candidate after that — so the ladder tops out at the expanded width. */
const PLATE_WIDTHS = [768, 1024, 1536, 2048];
/* Thumbnails sit in a 272px column; 640 covers it at 2x. */
const THUMB_WIDTHS = [320, 640];

const FORMATS = [
  { ext: 'avif', args: ['-quality', '55'] },
  { ext: 'webp', args: ['-quality', '72', '-define', 'webp:method=6'] },
  { ext: 'jpg',  args: ['-quality', '82', '-sampling-factor', '4:2:0', '-strip', '-interlace', 'Plane'] },
];

function newerThan(target, source) {
  if (!fs.existsSync(target)) return false;
  return fs.statSync(target).mtimeMs >= fs.statSync(source).mtimeMs;
}

function variants(source, outDir, base, widths, intrinsicWidth) {
  let made = 0;
  for (const w of widths) {
    /* Never upscale: a 1476px-wide plate gets no 1536 or 2048 variant. */
    if (w > intrinsicWidth) continue;
    for (const { ext, args } of FORMATS) {
      const out = path.join(outDir, `${base}-${w}.${ext}`);
      if (newerThan(out, source)) continue;
      execFileSync('magick', [source, '-resize', `${w}x`, ...args, out]);
      made++;
    }
  }
  return made;
}

const { pairs } = readManifest(ROOT);
let total = 0;
for (const pair of pairs) {
  const dir = path.join(ROOT, 'images', pair.slug);
  for (const half of ['then', 'now']) {
    total += variants(path.join(dir, `${half}.jpg`), dir, half, PLATE_WIDTHS, pair.plate.width);
    total += variants(path.join(dir, `thumb-${half}.jpg`), dir, `thumb-${half}`, THUMB_WIDTHS, 640);
  }
  console.log(`  ${pair.slug}`);
}
console.log(`wrote ${total} variant file(s)`);
