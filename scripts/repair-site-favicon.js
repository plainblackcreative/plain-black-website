#!/usr/bin/env node
// Stamp the canonical favicon / icon block (partials/head-icons.html) into
// the <head> of every page in the lint ALLOW_LIST. Favicon <link>/<meta>
// tags have no single wrapping element, so the canonical block is fenced
// with <!-- pb:favicon:start --> / <!-- pb:favicon:end --> comment anchors
// (the equivalent of the footer's <footer> anchor).
//
// - Pages that already carry the fenced block: the block is replaced in
//   place (idempotent — a no-op once canonical).
// - Pages that don't yet have it (first run): scattered legacy icon tags
//   (rel=icon / shortcut icon / apple-touch-icon / mask-icon / manifest and
//   the theme-color / apple-mobile-web-app-* / msapplication-* metas) are
//   stripped, then the fenced block is inserted right after <meta charset>
//   (matching the site's existing convention of icons at the top of <head>).
//
// Redirect stubs and CUSTOM_LIST pages (e.g. the Thai Thani / squirrels
// microsites with their own theme-color) are NOT in ALLOW_LIST, so they are
// never touched.
//
// Run:  npm run repair:favicon   (or: node scripts/repair-site-favicon.js)
// Exit code: 0 always. Prints a per-page summary.

const fs = require('fs');
const path = require('path');
const { ALLOW_LIST } = require('./lint-site-chrome.js');

const ROOT    = path.resolve(__dirname, '..');
const PARTIAL = path.join(ROOT, 'partials', 'head-icons.html');

// The fenced canonical block, replaced in place on every re-run.
const FENCE_RE = /<!-- pb:favicon:start -->[\s\S]*?<!-- pb:favicon:end -->/;

// Where to insert the block on first run: immediately after <meta charset…>.
const CHARSET_RE = /<meta\s+charset=["'][^"']*["']\s*\/?>/i;

// A line that is SOLELY a legacy favicon-domain tag (anchored start-to-end so
// a line carrying other content is never removed). Matched per-line on first
// run only. `rel` is matched anywhere inside the <link> so attribute order
// doesn't matter; `rel="canonical"` is deliberately NOT in the alternation.
const LEGACY_LINE_RE = new RegExp(
  '^\\s*(?:' +
    '<link\\b[^>]*\\brel=["\'](?:shortcut icon|icon|apple-touch-icon(?:-precomposed)?|mask-icon|manifest)["\'][^>]*>' +
    '|' +
    '<meta\\b[^>]*\\bname=["\'](?:theme-color|apple-mobile-web-app-title|apple-mobile-web-app-capable|apple-mobile-web-app-status-bar-style|msapplication-[^"\']*)["\'][^>]*>' +
  ')\\s*$',
  'i'
);

if (!fs.existsSync(PARTIAL)) {
  console.error('Missing canonical: ' + PARTIAL);
  process.exit(2);
}
const BLOCK = fs.readFileSync(PARTIAL, 'utf8').trimEnd();

let rewritten = 0, untouched = 0, fallback = 0, missing = 0;

for (const rel of ALLOW_LIST) {
  const full = path.join(ROOT, rel);
  if (!fs.existsSync(full)) { missing++; continue; }

  const before = fs.readFileSync(full, 'utf8');
  let after;

  if (FENCE_RE.test(before)) {
    // Already stamped — replace the fenced region (idempotent).
    after = before.replace(FENCE_RE, BLOCK);
  } else {
    // First run: strip scattered legacy icon tags, then insert the block.
    const stripped = before
      .split('\n')
      .filter(line => !LEGACY_LINE_RE.test(line))
      .join('\n');

    if (CHARSET_RE.test(stripped)) {
      after = stripped.replace(CHARSET_RE, m => m + '\n' + BLOCK);
    } else {
      // No <meta charset> — fall back to just inside <head>. Flagged so a
      // human notices the odd page.
      after = stripped.replace(/<head\b[^>]*>/i, m => m + '\n' + BLOCK);
      if (after !== stripped) fallback++;
    }
  }

  if (after !== before) {
    fs.writeFileSync(full, after);
    rewritten++;
    console.log('✓ ' + rel);
  } else {
    untouched++;
  }
}

console.log(
  '\nFavicon sync: ' + rewritten + ' rewritten, ' + untouched +
  ' already canonical, ' + fallback + ' inserted at <head> (no charset — check), ' +
  missing + ' missing.'
);
