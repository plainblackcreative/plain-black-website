#!/usr/bin/env node
/* One-shot: insert the Instagram social link directly after every
 * Facebook social link across all top-level HTML pages. Idempotent.
 *
 *   node scripts/add-instagram-icon.js
 *
 * Matches the exact existing Facebook anchor and inserts an Instagram
 * anchor after it on the same line + newline. Skips files that already
 * contain the Instagram link.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const FB_ANCHOR = '<a href="https://www.facebook.com/plainblackcreative" target="_blank" rel="noopener" aria-label="PlainBlack on Facebook"><img src="/assets/icons/facebook-icon.svg" alt="Facebook" loading="lazy"></a>';
const IG_ANCHOR = '<a href="https://www.instagram.com/plainblackcreative/" target="_blank" rel="noopener" aria-label="PlainBlack on Instagram"><img src="/assets/icons/instagram-icon.svg" alt="Instagram" loading="lazy"></a>';

function files() {
  return fs.readdirSync(ROOT)
    .filter(f => f.endsWith('.html'))
    .map(f => path.join(ROOT, f));
}

let touched = 0;
let skipped = 0;
let missing = 0;

for (const file of files()) {
  const src = fs.readFileSync(file, 'utf8');
  if (!src.includes(FB_ANCHOR)) {
    missing++;
    continue;
  }
  if (src.includes(IG_ANCHOR)) {
    skipped++;
    continue;
  }
  const out = src.split(FB_ANCHOR).join(FB_ANCHOR + '\n' + IG_ANCHOR);
  fs.writeFileSync(file, out);
  touched++;
  console.log('  updated  ' + path.basename(file));
}

console.log('');
console.log('Touched:  ' + touched);
console.log('Skipped:  ' + skipped + ' (already had Instagram link)');
console.log('No match: ' + missing + ' (no Facebook link)');
