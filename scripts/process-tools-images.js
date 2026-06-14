/* One-off: take the 10 PNGs Jay dropped into
   /assets/plainblack_asset_pack/website/tools-images/ and turn them
   into the proper card / hero / OG variants for the three tools.

   - Crops to exact aspect ratio (cover, centered)
   - Resizes to the target pixel dimensions
   - Outputs WebP (q80) + JPG (q85, mozjpeg) — except OG which is JPG only
   - Drops files into the correct sized folders with the PB naming pattern
   - Run once: `node scripts/process-tools-images.js`

   Image-to-slot mapping decided by inspection on 2026-05-05:
   - Scam Checker: pb-scam2 → card, pb-scam → hero, pb-scam3 → OG
   - Brand Spark : ...card2 → card, ...card3 → hero, ...card → OG
   - Build Map  : (8) → card, (10) → hero, (9) → OG
   The "(1)" laptop/cassette image is unused (no clear slot).
*/

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const SRC = path.resolve(__dirname, '..', 'assets/plainblack_asset_pack/website/tools-images');
const DEST_BASE = path.resolve(__dirname, '..', 'assets/plainblack_asset_pack/website');

const TASKS = [
  // ─── Scam Checker ───────────────────────────────────────
  { src:'pb-scam2.png', name:'pb-scam-card', w:1200, h:600, formats:['webp','jpg'], folder:'card-1200x600' },
  { src:'pb-scam.png',  name:'pb-scam-hero', w:1600, h:900, formats:['webp','jpg'], folder:'hero-1600x900' },
  { src:'pb-scam3.png', name:'pb-scam-og',   w:1200, h:630, formats:['jpg'],        folder:'og-1200x630'   },

  // ─── Brand Spark ────────────────────────────────────────
  { src:'pb-brand-spark-card2.png', name:'pb-brand-spark-card', w:1200, h:600, formats:['webp','jpg'], folder:'card-1200x600' },
  { src:'pb-brand-spark-card3.png', name:'pb-brand-spark-hero', w:1600, h:900, formats:['webp','jpg'], folder:'hero-1600x900' },
  { src:'pb-brand-spark-card.png',  name:'pb-brand-spark-og',   w:1200, h:630, formats:['jpg'],        folder:'og-1200x630'   },

  // ─── Build Map ──────────────────────────────────────────
  { src:'ChatGPT Image May 5, 2026 at 04_09_13 PM (8).png',  name:'pb-build-map-card', w:1200, h:600, formats:['webp','jpg'], folder:'card-1200x600' },
  { src:'ChatGPT Image May 5, 2026 at 04_09_13 PM (10).png', name:'pb-build-map-hero', w:1600, h:900, formats:['webp','jpg'], folder:'hero-1600x900' },
  { src:'ChatGPT Image May 5, 2026 at 04_09_13 PM (9).png',  name:'pb-build-map-og',   w:1200, h:630, formats:['jpg'],        folder:'og-1200x630'   }
];

(async function run(){
  for(const t of TASKS){
    const srcPath = path.join(SRC, t.src);
    if(!fs.existsSync(srcPath)){
      console.error('MISSING SOURCE:', srcPath);
      continue;
    }
    const folderPath = path.join(DEST_BASE, t.folder);
    if(!fs.existsSync(folderPath)) fs.mkdirSync(folderPath, { recursive:true });

    for(const fmt of t.formats){
      const outName = `${t.name}-${t.w}x${t.h}.${fmt}`;
      const outPath = path.join(folderPath, outName);
      const base = sharp(srcPath).resize({ width:t.w, height:t.h, fit:'cover', position:'center' });
      if(fmt === 'webp') await base.webp({ quality:80 }).toFile(outPath);
      if(fmt === 'jpg')  await base.jpeg({ quality:85, mozjpeg:true }).toFile(outPath);
      const sizeKB = (fs.statSync(outPath).size / 1024).toFixed(1);
      console.log(`✓ ${t.folder}/${outName} (${sizeKB} KB)`);
    }
  }
  console.log('\nDone.');
})().catch(err => { console.error(err); process.exit(1); });
