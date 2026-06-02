#!/usr/bin/env node
// Site-wide chrome lint. Validates that every canonical public page
// (top-level pages + every blog post) carries the same header / mobile
// nav / footer signatures. Catches drift on new pages before they ship.
//
// To opt a new page IN, add its path to ALLOW_LIST below. To opt a page
// OUT (intentional landing page with a custom layout), leave it off the
// list.
//
// Run: npm run lint:chrome   (or: node scripts/lint-site-chrome.js)
// Exit code: 0 if clean, 1 if any page fails. Wired into CI.

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

// Canonical public pages that must share the same chrome. Anything off
// this list is intentionally custom (landing pages, admin tools, drafts).
const ALLOW_LIST = [
  // top-level
  'index.html',
  'about.html',
  'services.html',
  'playbooks.html',
  'tools.html',
  'work.html',
  'blog.html',
  'contact.html',
  'givesback.html',
  'privacy.html',
  'challenge.html',
];

// Plus every published blog post. Skip redirect stubs (e.g. blog/index.html
// is a <meta refresh> shim that points / -> /blog and has no canonical chrome
// by design).
for (const f of fs.readdirSync(path.join(ROOT, 'blog')).sort()) {
  if (!f.endsWith('.html')) continue;
  const body = fs.readFileSync(path.join(ROOT, 'blog', f), 'utf8');
  if (/<meta\s+http-equiv=["']refresh["']/i.test(body)) continue;
  ALLOW_LIST.push(path.join('blog', f));
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
// nav items active, but the chrome scaffolding is identical.
const REQUIRED = [
  // Header structure
  { sig: '<header class="site-header">',                                label: 'site header element' },
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
  { sig: '<a href="/playbooks">Playbooks</a>',                          label: 'footer Quick Link: Playbooks' },
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
  { sig: '<a href="/playbooks.html">', label: '.html-style playbooks link (should be /playbooks)' },
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
    if (!html.includes(r.sig)) issues.push('missing: ' + r.label);
  }
  for (const f of FORBIDDEN) {
    if (exempt.includes(f.label)) continue;
    if (html.includes(f.sig)) issues.push('found: ' + f.label);
  }
  if (isBlog) {
    for (const r of BLOG_ONLY_REQUIRED) if (!html.includes(r.sig)) issues.push('missing: ' + r.label);
  }

  if (issues.length) {
    failed++;
    results.push({ file: rel, issues });
  }
}

if (require.main === module) {
  console.log('───────────────────────────────────────────────────────');
  console.log('Site chrome lint, ' + ALLOW_LIST.length + ' page(s) scanned');
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
  console.log('Header + mobile nav drift on top-level pages must still be fixed by hand.');
  process.exit(1);
}

// Exposed so scripts/repair-site-footer.js can share the same ALLOW_LIST
// and EXEMPTIONS table — single source of truth for which pages share
// canonical chrome and which are intentionally custom.
module.exports = { ALLOW_LIST, EXEMPTIONS };
