#!/usr/bin/env node
// Site-wide chrome lint. Fail-closed: every public HTML page on the site
// must carry the same header / mobile nav / footer signatures. Catches
// drift on new pages before they ship — a new page that lacks canonical
// chrome fails loudly instead of slipping through uncovered.
//
// Coverage is computed automatically (no hand-maintained allow list):
//   - every *.html under the repo root is a candidate
//   - redirect stubs (<meta http-equiv="refresh">) are skipped
//   - excluded internal dirs (EXCLUDE_DIRS) are skipped
//   - genuine bespoke pages (CUSTOM_LIST) are skipped
//   - everything else is ENFORCED.
//
// To opt a new bespoke page OUT, add it to CUSTOM_LIST with a one-line
// reason. To let an enforced page drop specific signatures, add it to
// EXEMPTIONS. Otherwise: carry the canonical chrome.
//
// Run: npm run lint:chrome   (or: node scripts/lint-site-chrome.js)
// Exit code: 0 if clean, 1 if any page fails. Wired into CI + pre-push.

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

// Internal directories that never carry public canonical chrome — drafts,
// templates, build scratch, the footer partial itself. Paths are matched
// as leading prefixes (forward-slash, repo-relative).
const EXCLUDE_DIRS = [
  'docs/',
  '30day-challenge-builds/',
  'playbooks/future/',
  'playbooks/ready/',
  'partials/',
];

// Genuine bespoke pages that intentionally do NOT carry canonical chrome.
// Each is skipped wholesale by the lint AND by the repair scripts. Add a
// one-line reason before adding to this list.
const CUSTOM_LIST = [
  '404.html',                          // bespoke error page, no standard chrome by design
  '30-day-back-half-poc.html',         // internal proof-of-concept, not a public page
  'leo-linkedin.html',                 // one-off campaign / personal page
  'should-we-talk-yet.html',           // bespoke interstitial
  'tools/the-ultimate-one-stop-shop-portal-for-everything-you-need-to-avoid-squirrels.html', // bespoke portal / easter egg
  'tools/bradley-roofing-quote-filter.html', // client tool (Bradley Roofing), self-contained
  // Self-contained landers: Google-Fonts only, no /assets/style.css, inline
  // chrome CSS using .lander-mobile-nav + a custom CTA. Cannot carry canonical
  // chrome without a full reskin (tracked as a separate follow-up).
  'brand-spark.html',                  // self-contained lander (inline chrome CSS, .lander-mobile-nav)
  'tools/scam-check.html',             // self-contained lander (inline chrome CSS, custom CTA)
  // The 7 playbook landers were redirect-stubbed in the 2026-06-14 playbook
  // sunset; redirect stubs are auto-skipped by isRedirectStub, so they no
  // longer need a CUSTOM_LIST entry.
  'shipped-html-inventory.html',                    // internal reference page, no site chrome by design
];
const CUSTOM_SET = new Set(CUSTOM_LIST);

// Recursively collect every *.html file under ROOT, repo-relative with
// forward slashes. Skips VCS / dependency dirs.
function collectHtml(dir, acc) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    // Skip hidden tooling dirs (.git, .claude, …) and dependencies.
    if (entry.name.startsWith('.') || entry.name === 'node_modules') continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      collectHtml(full, acc);
    } else if (entry.isFile() && entry.name.endsWith('.html')) {
      acc.push(path.relative(ROOT, full).split(path.sep).join('/'));
    }
  }
  return acc;
}

function isExcludedDir(rel) {
  return EXCLUDE_DIRS.some(prefix => rel.startsWith(prefix));
}
function isRedirectStub(html) {
  return /<meta\s+http-equiv=["']refresh["']/i.test(html);
}

// ENFORCED set, computed once at module load. Exported as ALLOW_LIST so the
// repair scripts share the exact same source of truth for which pages must
// carry canonical chrome.
const ALLOW_LIST = [];
for (const rel of collectHtml(ROOT, []).sort()) {
  if (isExcludedDir(rel)) continue;
  if (CUSTOM_SET.has(rel)) continue;
  const html = fs.readFileSync(path.join(ROOT, rel), 'utf8');
  if (isRedirectStub(html)) continue;
  ALLOW_LIST.push(rel);
}

// Per-page exemptions for intentional canonical-chrome variances.
// Each entry maps a page path to the labels it is allowed to drop.
// Add a comment explaining WHY before adding to this list.
const EXEMPTIONS = {
  // Contact page: no self-referential "Get in Touch" button on /contact.
  'contact.html': ['Get-in-Touch CTA', 'CTA wrap (CTA outside <nav>)'],
  // Givesback page: 3rd footer column is replaced with program-specific
  // links; reveal-phone block lives elsewhere in the page funnel.
  'givesback.html': [
    'Ian tap-to-show phone button',
    'Jayden tap-to-show phone button',
    'Ian email link',
    'Jayden email link',
  ],
};

// Structural signatures every canonical page must contain. These are
// intentionally active-marker-agnostic — different pages mark different
// nav items active, but the chrome scaffolding is identical. A `sig` may
// be a string (substring match) or a RegExp (e.g. the header element,
// which tolerates modifier classes like site-header--dark).
const REQUIRED = [
  // Header structure
  { sig: /<header class="site-header[^"]*">/,                            label: 'site header element' },
  { sig: '<a href="/" class="site-header__logo">',                      label: 'header logo link to /' },
  { sig: 'class="logo-mark"',                                           label: 'text logo-mark (no raster <img> logo)' },
  { sig: 'class="site-header__cluster"',                                label: 'header cluster wrapper' },
  { sig: 'class="site-header__cta-wrap"',                               label: 'CTA wrap (CTA outside <nav>)' },
  { sig: 'class="site-header__cta"',                                    label: 'Get-in-Touch CTA' },
  { sig: '<a href="/tools">Tools</a>',                                  label: 'nav: Tools link' },
  { sig: 'class="hamburger"',                                           label: 'mobile hamburger button' },

  // Mobile nav
  { sig: '<nav class="mobile-nav">',                                    label: 'mobile nav element' },

  // Footer structure
  { sig: '<footer class="site-footer">',                                label: 'site footer element' },
  { sig: 'class="footer-grid"',                                         label: 'footer grid layout' },
  { sig: 'class="footer-socials"',                                      label: 'footer socials wrapper class' },
  { sig: 'data-pb-reveal="ian"',                                        label: 'Ian tap-to-show phone button' },
  { sig: 'data-pb-reveal="jayden"',                                     label: 'Jayden tap-to-show phone button' },
  { sig: 'mailto:ian@plainblackcreative.com',                           label: 'Ian email link' },
  { sig: 'mailto:jayden@plainblackcreative.com',                        label: 'Jayden email link' },
  { sig: 'linkedin-icon.svg',                                           label: 'LinkedIn social icon' },
  { sig: 'facebook-icon.svg',                                           label: 'Facebook social icon' },
  { sig: '<a href="/privacy">Privacy Policy</a>',                       label: 'Privacy Policy link' },

  // Footer Quick Links (clean URLs only)
  { sig: '<a href="/services">Services</a>',                            label: 'footer Quick Link: Services' },
  { sig: '<a href="/tools">Tools</a>',                                  label: 'footer Quick Link: Tools' },
  { sig: '<a href="/work">Work</a>',                                    label: 'footer Quick Link: Work' },
  { sig: '<a href="/about">About</a>',                                  label: 'footer Quick Link: About' },
  { sig: '<a href="/blog">Blog</a>',                                    label: 'footer Quick Link: Blog' },
  { sig: '<a href="/givesback">PlainBlack Gives Back</a>',              label: 'footer Quick Link: Givesback' },
  { sig: '<a href="/contact">Contact</a>',                              label: 'footer Quick Link: Contact' },
];

// Anti-signatures — if present, page has drifted.
const FORBIDDEN = [
  { sig: '<a href="/index.html">',     label: '.html-style home link (should be /)' },
  { sig: '<a href="/services.html">',  label: '.html-style services link (should be /services)' },
  { sig: '<a href="/tools.html">',     label: '.html-style tools link (should be /tools)' },
  { sig: '<a href="/work.html">',      label: '.html-style work link (should be /work)' },
  { sig: '<a href="/about.html">',     label: '.html-style about link (should be /about)' },
  { sig: '<a href="/blog.html">',      label: '.html-style blog link (should be /blog)' },
  { sig: '<a href="/contact.html">',   label: '.html-style contact link (should be /contact)' },
  { sig: '<a href="/givesback.html">', label: '.html-style givesback link (should be /givesback)' },
];

// Article-shell signatures only required for blog posts. Content-level
// drift (e.g. placeholder alt text) lives in lint-blog-chrome.js, not
// here — this script gates CI and should fail only on chrome drift.
const BLOG_ONLY_REQUIRED = [
  { sig: '<article class="post-content">', label: 'post-content article element' },
  { sig: 'class="back-link"',               label: 'Back to Blog link' },
];

function matches(sig, html) {
  return sig instanceof RegExp ? sig.test(html) : html.includes(sig);
}

let failed = 0;
const results = [];

for (const rel of ALLOW_LIST) {
  const full = path.join(ROOT, rel);
  if (!fs.existsSync(full)) {
    failed++;
    results.push({ file: rel, issues: ['missing: file does not exist'] });
    continue;
  }
  const html = fs.readFileSync(full, 'utf8');
  const issues = [];
  const isBlog = rel.startsWith('blog/');
  const exempt = EXEMPTIONS[rel] || [];

  for (const r of REQUIRED) {
    if (exempt.includes(r.label)) continue;
    if (!matches(r.sig, html)) issues.push('missing: ' + r.label);
  }
  for (const f of FORBIDDEN) {
    if (exempt.includes(f.label)) continue;
    if (matches(f.sig, html)) issues.push('found: ' + f.label);
  }
  if (isBlog) {
    for (const r of BLOG_ONLY_REQUIRED) if (!matches(r.sig, html)) issues.push('missing: ' + r.label);
  }

  if (issues.length) {
    failed++;
    results.push({ file: rel, issues });
  }
}

if (require.main === module) {
  console.log('───────────────────────────────────────────────────────');
  console.log('Site chrome lint, ' + ALLOW_LIST.length + ' page(s) enforced');
  console.log('───────────────────────────────────────────────────────');

  if (!failed) {
    console.log('All pages pass canonical chrome checks.');
    process.exit(0);
  }

  for (const r of results) {
    console.log('\nFAIL  ' + r.file);
    for (const i of r.issues) console.log('  - ' + i);
  }
  console.log('\n' + failed + ' of ' + ALLOW_LIST.length + ' page(s) failed.');
  console.log('To auto-heal site footers: npm run repair:footer');
  console.log('To auto-heal site headers: npm run repair:header');
  process.exit(1);
}

// Exposed so scripts/repair-site-footer.js and scripts/repair-site-header.js
// share the same ALLOW_LIST (the enforced set) and EXEMPTIONS table — single
// source of truth for which pages share canonical chrome and which are
// intentionally custom.
module.exports = { ALLOW_LIST, EXEMPTIONS, CUSTOM_LIST };
