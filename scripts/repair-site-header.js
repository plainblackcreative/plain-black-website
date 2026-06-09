#!/usr/bin/env node
// Stamp the canonical header + mobile nav (sourced from index.html) onto
// pages whose header has drifted. Mirror of repair-site-footer.js, but the
// header carries per-page state the footer doesn't, so this script is more
// careful:
//
//   - It heals CONDITIONALLY. index.html's header markup is formatted a
//     little differently from the rest of the site, so an unconditional
//     stamp would rewrite every page. Instead we test each page's header
//     *region* against the canonical header signatures and rewrite only the
//     ones that actually drift — conforming pages are left byte-untouched.
//   - It is active-marker-agnostic: the canonical template is neutralised
//     (active class stripped), and each page's own active nav item is
//     detected and re-applied to the stamped desktop nav.
//   - It preserves header modifier classes (e.g. site-header--dark) so a
//     themed page keeps its theme.
//
// Pages whose EXEMPTIONS opt them out of header signatures are skipped —
// e.g. contact.html, which intentionally drops the self-referential CTA.
//
// Run after editing the canonical header in index.html, or any time the
// lint reports header / mobile-nav drift.
//
// Run:  npm run repair:header   (or: node scripts/repair-site-header.js)
// Exit code: 0 always. Prints a per-page summary.

const fs = require('fs');
const path = require('path');
const { ALLOW_LIST, EXEMPTIONS } = require('./lint-site-chrome.js');

const ROOT  = path.resolve(__dirname, '..');
const INDEX = path.join(ROOT, 'index.html');

// The header + the mobile nav that immediately follows it. The trailing
// mobile-nav is optional in the MATCH (so a page that has lost its drawer
// still heals) but required by the conformance gate below.
const HEADER_RE = /<header class="site-header[^"]*">[\s\S]*?<\/header>(\s*<nav class="mobile-nav">[\s\S]*?<\/nav>)?/;

// Canonical header signatures, tested against a page's header REGION only
// (not the whole document) so that, e.g., a Tools link in the footer can't
// mask a Tools link missing from the header nav.
const HEADER_REQUIRED = [
  /<header class="site-header[^"]*">/,
  '<a href="/" class="site-header__logo">',
  'class="logo-mark"',
  'class="site-header__cluster"',
  'class="site-header__cta-wrap"',
  'class="site-header__cta"',
  // Tools must appear in the header nav — tolerate the active variant so a
  // page that marks Tools active (tools.html and its children) still counts
  // as conforming and isn't needlessly rewritten.
  /<a href="\/tools"( class="active")?>Tools<\/a>/,
  'class="hamburger"',
  '<nav class="mobile-nav">',
];

// Lint labels that live in the header / mobile nav. If a page's EXEMPTIONS
// touch any of these, it has chosen to diverge — skip rewriting its header.
const HEADER_EXEMPT_LABELS = new Set([
  'site header element',
  'header logo link to /',
  'text logo-mark (no raster <img> logo)',
  'header cluster wrapper',
  'CTA wrap (CTA outside <nav>)',
  'Get-in-Touch CTA',
  'nav: Tools link',
  'mobile hamburger button',
  'mobile nav element',
]);

if (!fs.existsSync(INDEX)) {
  console.error('Missing canonical source: ' + INDEX);
  process.exit(2);
}
const CANON_RAW = (fs.readFileSync(INDEX, 'utf8').match(HEADER_RE) || [])[0];
if (!CANON_RAW) {
  console.error('Could not extract a canonical header block from index.html');
  process.exit(2);
}
// Neutralise the active marker so the template is page-agnostic.
const CANON_TEMPLATE = CANON_RAW.replace(/ class="active"/g, '');

function conforms(region) {
  return HEADER_REQUIRED.every(s => (s instanceof RegExp ? s.test(region) : region.includes(s)));
}

function escapeRe(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Re-apply the page's active nav item to the stamped desktop nav only
// (the <nav class="site-header__nav"> segment), leaving the mobile nav as-is.
function applyActive(block, activeHref) {
  if (!activeHref) return block;
  return block.replace(/<nav class="site-header__nav">[\s\S]*?<\/nav>/, navSeg =>
    navSeg.replace(new RegExp('(<a href="' + escapeRe(activeHref) + '")>'), '$1 class="active">')
  );
}

// The CTA is a per-page slot (the lint only checks for the class, not the
// href/text) — e.g. the gives-back cases point it at "Register Your Club".
// Preserve the page's own CTA anchor rather than overwriting it with the
// canonical "Get in Touch".
const CTA_RE = /<a [^>]*class="site-header__cta"[^>]*>[\s\S]*?<\/a>/;
function preserveCta(block, ctaAnchor) {
  if (!ctaAnchor) return block;
  return block.replace(CTA_RE, () => ctaAnchor);
}

let changed = 0, untouched = 0, skipped = 0, missing = 0;

for (const rel of ALLOW_LIST) {
  const full = path.join(ROOT, rel);
  if (!fs.existsSync(full)) { missing++; continue; }

  const exempt = EXEMPTIONS[rel] || [];
  if (exempt.some(label => HEADER_EXEMPT_LABELS.has(label))) {
    skipped++;
    continue;
  }

  const before = fs.readFileSync(full, 'utf8');
  const m = HEADER_RE.exec(before);
  if (!m) {
    // No header block to replace — lint will already flag this. Don't
    // synthesise one; let the human notice.
    missing++;
    continue;
  }

  const region = m[0];
  if (conforms(region)) { untouched++; continue; }

  // Build the page-specific canonical block: preserve any header modifier
  // class and the page's own active nav item.
  const modifier  = (region.match(/<header class="site-header([^"]*)">/) || [])[1] || '';
  const activeHref = (region.match(/<a href="([^"]*)" class="active"/) || [])[1] || '';
  const ctaAnchor = (region.match(CTA_RE) || [])[0] || '';
  let block = CANON_TEMPLATE.replace(/<header class="site-header[^"]*">/, '<header class="site-header' + modifier + '">');
  block = applyActive(block, activeHref);
  block = preserveCta(block, ctaAnchor);

  const after = before.slice(0, m.index) + block + before.slice(m.index + region.length);
  if (after !== before) {
    fs.writeFileSync(full, after);
    changed++;
    console.log('✓ ' + rel);
  } else {
    untouched++;
  }
}

console.log('\nHeader sync: ' + changed + ' rewritten, ' + untouched + ' already canonical, ' + skipped + ' exempt, ' + missing + ' missing/no-header.');
