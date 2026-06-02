#!/usr/bin/env node
// Stamp the canonical footer (partials/footer.html) onto every page in
// the lint ALLOW_LIST. Pages whose EXEMPTIONS table opts them out of
// footer signatures are skipped — e.g. givesback.html, whose 3rd
// footer column is intentionally program-specific.
//
// Run after editing partials/footer.html, or any time the lint reports
// footer drift on a top-level page.
//
// Run:  npm run repair:footer   (or: node scripts/repair-site-footer.js)
// Exit code: 0 always. Prints a per-page diff summary.

const fs = require('fs');
const path = require('path');
const { ALLOW_LIST, EXEMPTIONS } = require('./lint-site-chrome.js');

const ROOT       = path.resolve(__dirname, '..');
const PARTIAL    = path.join(ROOT, 'partials', 'footer.html');
const FOOTER_RE  = /<footer class="site-footer">[\s\S]*?<\/footer>/;

// Labels in EXEMPTIONS that are footer-scoped. If a page's exemption list
// touches any of these, we skip rewriting its footer — it has chosen to
// diverge intentionally and the lint script accepts the divergence.
const FOOTER_EXEMPT_LABELS = new Set([
  'Ian tap-to-show phone button',
  'Jayden tap-to-show phone button',
  'Ian email link',
  'Jayden email link',
  'footer Quick Link: Services',
  'footer Quick Link: Playbooks',
  'footer Quick Link: Tools',
  'footer Quick Link: Work',
  'footer Quick Link: About',
  'footer Quick Link: Blog',
  'footer Quick Link: Givesback',
  'footer Quick Link: Contact',
  'footer grid layout',
  'footer socials wrapper class',
]);

if (!fs.existsSync(PARTIAL)) {
  console.error('Missing canonical: ' + PARTIAL);
  process.exit(2);
}
const FOOTER = fs.readFileSync(PARTIAL, 'utf8').trimEnd();

let changed = 0, untouched = 0, skipped = 0, missing = 0;

for (const rel of ALLOW_LIST) {
  const full = path.join(ROOT, rel);
  if (!fs.existsSync(full)) { missing++; continue; }

  const exempt = EXEMPTIONS[rel] || [];
  if (exempt.some(label => FOOTER_EXEMPT_LABELS.has(label))) {
    skipped++;
    continue;
  }

  const before = fs.readFileSync(full, 'utf8');
  if (!FOOTER_RE.test(before)) {
    // Page is on ALLOW_LIST but has no footer block to replace — lint
    // will already be flagging this as a missing-element issue. Don't
    // synthesise one; let the human notice.
    missing++;
    continue;
  }
  const after = before.replace(FOOTER_RE, FOOTER);
  if (after !== before) {
    fs.writeFileSync(full, after);
    changed++;
    console.log('✓ ' + rel);
  } else {
    untouched++;
  }
}

console.log('\nFooter sync: ' + changed + ' rewritten, ' + untouched + ' already canonical, ' + skipped + ' exempt, ' + missing + ' missing/no-footer.');
