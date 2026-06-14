#!/usr/bin/env node
/* Build the First Fix image variants from the AI-generated source PNG.
 *
 *   node scripts/build-first-fix-images.js
 *
 * Reads:  assets/plainblack_asset_pack/website/pb-first-fix-source-1536x1024.png
 * Writes: jpg + webp variants into hero-1600x900/, og-1200x630/, card-1200x600/.
 *
 * Crop is centred with `cover` fit so the notebook (mid-bottom of source)
 * stays in view across all aspect ratios. Idempotent.
 */

const path = require('path');
const fs = require('fs/promises');
const sharp = require('sharp');

const ROOT = path.resolve(__dirname, '..');
const ASSETS = path.join(ROOT, 'assets', 'plainblack_asset_pack', 'website');
const SOURCE = path.join(ASSETS, 'pb-first-fix-source-1536x1024.png');
const BASENAME = 'pb-first-fix';

const VARIANTS = [
  { name: 'hero', w: 1600, h: 900, folder: 'hero-1600x900' },
  { name: 'og',   w: 1200, h: 630, folder: 'og-1200x630'   },
  { name: 'card', w: 1200, h: 600, folder: 'card-1200x600' },
];

const JPEG_QUALITY = 84;
const WEBP_QUALITY = 82;

(async () => {
  try {
    await fs.access(SOURCE);
  } catch {
    console.error('Source not found:', SOURCE);
    process.exit(1);
  }

  for (const v of VARIANTS) {
    const outDir = path.join(ASSETS, v.folder);
    await fs.mkdir(outDir, { recursive: true });
    const stem = path.join(outDir, `${BASENAME}-${v.name}-${v.w}x${v.h}`);

    const base = sharp(SOURCE).resize({
      width: v.w,
      height: v.h,
      fit: 'cover',
      position: 'centre',
    });

    await base.clone().jpeg({ quality: JPEG_QUALITY, mozjpeg: true }).toFile(stem + '.jpg');
    await base.clone().webp({ quality: WEBP_QUALITY }).toFile(stem + '.webp');

    const jpgKb = Math.round((await fs.stat(stem + '.jpg')).size / 1024);
    const webpKb = Math.round((await fs.stat(stem + '.webp')).size / 1024);
    console.log(`${v.name.padEnd(6)} ${String(v.w).padStart(4)}x${v.h}:  jpg ${String(jpgKb).padStart(4)} KB   webp ${String(webpKb).padStart(4)} KB`);
  }
})().catch(err => { console.error(err); process.exit(1); });
