#!/usr/bin/env node
/* Resize + recompress portfolio / brand images so the live site doesn't
 * ship 4 MB hero crops to mobile users.
 *
 *   npm install
 *   npm run optimize-images
 *
 * Reads every webp/jpg/png in assets/branding/ and writes 800w + 1600w
 * webp variants into assets/branding/optimized/. Idempotent — re-runs
 * only regenerate the outputs.
 *
 * Static .gif files (animated) are left alone — sharp would flatten them.
 *
 * After running, the markup uses <picture> with the optimized variants
 * via srcset; the original src is the 1600w version, so even browsers
 * that ignore srcset still get a saner file.
 */

const fs = require('fs/promises');
const path = require('path');
const sharp = require('sharp');

const SRC_DIR = path.resolve(__dirname, '..', 'assets', 'branding');
const OUT_DIR = path.resolve(SRC_DIR, 'optimized');

const SIZES = [800, 1600];     // px wide
const QUALITY = 78;             // webp quality (78 is a sweet spot)

function kb(b) { return Math.round(b / 1024); }
function fmt(label, n, w) { return label.padEnd(28) + String(n).padStart(6) + ' KB' + (w ? '  (' + w + 'px)' : ''); }

(async () => {
  await fs.mkdir(OUT_DIR, { recursive: true });

  const all = await fs.readdir(SRC_DIR);
  const files = all.filter(f =>
    /\.(webp|jpe?g|png)$/i.test(f) && !f.startsWith('.') && f !== 'optimized'
  );

  if (!files.length) {
    console.log('No source images found in', SRC_DIR);
    return;
  }

  console.log('── optimize-images ──────────────────────────────');
  console.log('SRC:', SRC_DIR);
  console.log('OUT:', OUT_DIR);
  console.log();

  let inputBytes = 0;
  let outputBytes = 0;

  for (const file of files) {
    const inPath = path.join(SRC_DIR, file);
    const stat = await fs.stat(inPath);
    if (!stat.isFile()) continue;
    inputBytes += stat.size;

    const meta = await sharp(inPath).metadata();
    const base = file.replace(/\.[^.]+$/, '');

    console.log(fmt(file, kb(stat.size), meta.width));

    for (const w of SIZES) {
      const targetW = Math.min(w, meta.width || w);
      const outName = `${base}-${w}w.webp`;
      const outPath = path.join(OUT_DIR, outName);

      await sharp(inPath)
        .resize({ width: targetW, withoutEnlargement: true })
        .webp({ quality: QUALITY })
        .toFile(outPath);

      const outStat = await fs.stat(outPath);
      outputBytes += outStat.size;
      console.log(fmt('  → ' + outName, kb(outStat.size), targetW));
    }
    console.log();
  }

  const savings = inputBytes - outputBytes;
  console.log('─────────────────────────────────────────────────');
  console.log('Input total :', kb(inputBytes).toString().padStart(6), 'KB');
  console.log('Output total:', kb(outputBytes).toString().padStart(6), 'KB');
  console.log('Saved       :', kb(savings).toString().padStart(6), 'KB',
              '(' + Math.round(100 * savings / inputBytes) + '% smaller)');
  console.log();
  console.log('Markup uses /assets/branding/optimized/<name>-{800w,1600w}.webp');
  console.log('via <picture> srcset. Originals remain in assets/branding/ as');
  console.log('source-of-truth for future re-runs.');
})();
