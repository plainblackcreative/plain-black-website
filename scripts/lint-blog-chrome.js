#!/usr/bin/env node
// Scans blog/*.html and reports any post whose chrome (header, mobile nav,
// footer) drifts from the canonical signatures the gen ships. Catches the
// recurring class of bugs where a post lands on prod with a stripped Quick
// Links list, missing tap-to-show buttons, or stale .html-style nav URLs.
//
// On every publish the gen now self-heals via repairBlogChrome (see
// admin/blog-gen.html), so a clean run here is the steady state. A failing
// run usually means a hand-edit slipped through, or someone restored a post
// from an older backup.
//
// Run: npm run lint:blog   (or: node scripts/lint-blog-chrome.js)
// Exit code: 0 if clean, 1 if any post fails. Suitable for a pre-commit /
// CI gate later if we want one.

const fs = require('fs');
const path = require('path');

const BLOG_DIR = path.resolve(__dirname, '..', 'blog');

// Signatures every blog post must contain. If any are missing, the post's
// chrome has drifted from canonical and a republish through the gen (or
// a manual repair pass) will heal it.
const REQUIRED = [
  // Header
  { sig: '<header class="site-header">',                                label: 'site header element' },
  { sig: '<a href="/" class="site-header__logo"',                       label: 'header logo link to /' },
  { sig: 'class="site-header__cta"',                                    label: 'header Get-in-Touch CTA' },
  { sig: 'class="hamburger"',                                           label: 'mobile hamburger button' },

  // Mobile nav
  { sig: '<nav class="mobile-nav">',                                    label: 'mobile nav element' },

  // Footer Quick Links (clean URLs, no .html)
  { sig: '<a href="/services">Services</a>',                            label: 'footer Quick Link: Services' },
  { sig: '<a href="/playbooks">Playbooks</a>',                          label: 'footer Quick Link: Playbooks' },
  { sig: '<a href="/work">Work</a>',                                    label: 'footer Quick Link: Work' },
  { sig: '<a href="/about">About</a>',                                  label: 'footer Quick Link: About' },
  { sig: '<a href="/blog">Blog</a>',                                    label: 'footer Quick Link: Blog' },
  { sig: '<a href="/givesback">PlainBlack Gives Back</a>',              label: 'footer Quick Link: Givesback' },
  { sig: '<a href="/contact">Contact</a>',                              label: 'footer Quick Link: Contact' },

  // Get-in-Touch buttons + emails
  { sig: 'data-pb-reveal="ian"',                                        label: 'Ian tap-to-show phone button' },
  { sig: 'data-pb-reveal="jayden"',                                     label: 'Jayden tap-to-show phone button' },
  { sig: 'mailto:ian@plainblackcreative.com',                           label: 'Ian email link' },
  { sig: 'mailto:jayden@plainblackcreative.com',                        label: 'Jayden email link' },

  // Social icons
  { sig: 'linkedin-icon.svg',                                           label: 'LinkedIn social icon' },
  { sig: 'facebook-icon.svg',                                           label: 'Facebook social icon' },

  // Footer bottom
  { sig: '<a href="/privacy">Privacy Policy</a>',                       label: 'Privacy Policy link' },

  // Article shell
  { sig: '<article class="post-content">',                              label: 'post-content article element' },
  { sig: 'class="back-link"',                                           label: 'Back to Blog link' },
];

// Anti-signatures. If any are present, flag them. Catches the old .html-style
// nav URLs that should have been migrated to clean URLs.
const FORBIDDEN = [
  { sig: '<a href="/index.html">',     label: '.html-style home link (should be /)' },
  { sig: '<a href="/services.html">',  label: '.html-style services link (should be /services)' },
  { sig: '<a href="/playbooks.html">', label: '.html-style playbooks link (should be /playbooks)' },
  { sig: '<a href="/work.html">',      label: '.html-style work link (should be /work)' },
  { sig: '<a href="/about.html">',     label: '.html-style about link (should be /about)' },
  { sig: '<a href="/blog.html">',      label: '.html-style blog link (should be /blog)' },
  { sig: '<a href="/contact.html">',   label: '.html-style contact link (should be /contact)' },
  { sig: '<a href="/givesback.html">', label: '.html-style givesback link (should be /givesback)' },
  { sig: 'alt="Blog image"',           label: 'placeholder alt="Blog image" (should be descriptive)' },
];

function main() {
  if (!fs.existsSync(BLOG_DIR)) {
    console.error('No blog/ directory found at', BLOG_DIR);
    process.exit(2);
  }
  const files = fs.readdirSync(BLOG_DIR).filter(f => f.endsWith('.html')).sort();
  let failed = 0;
  const results = [];

  for (const file of files) {
    const full = path.join(BLOG_DIR, file);
    const html = fs.readFileSync(full, 'utf8');
    const issues = [];
    for (const r of REQUIRED) if (!html.includes(r.sig)) issues.push('missing: ' + r.label);
    for (const f of FORBIDDEN) if (html.includes(f.sig)) issues.push('found: '   + f.label);
    if (issues.length) {
      failed++;
      results.push({ file, issues });
    }
  }

  console.log('───────────────────────────────────────────────────────');
  console.log('Blog chrome lint, ' + files.length + ' post(s) scanned');
  console.log('───────────────────────────────────────────────────────');

  if (!failed) {
    console.log('All posts pass canonical chrome checks.');
    process.exit(0);
  }

  for (const r of results) {
    console.log('\nFAIL  blog/' + r.file);
    for (const i of r.issues) console.log('  - ' + i);
  }
  console.log('\n' + failed + ' of ' + files.length + ' post(s) failed.');
  console.log('Republish each affected post through admin/blog-gen.html');
  console.log('to auto-heal the chrome via repairBlogChrome.');
  process.exit(1);
}

main();
