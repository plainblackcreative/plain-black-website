#!/usr/bin/env node
// One-shot repair tool. Reads the canonical chrome blocks
// (CANONICAL_BLOG_HEADER, CANONICAL_BLOG_MOBILE_NAV, CANONICAL_BLOG_FOOTER)
// straight out of admin/blog-gen.html and rewrites every blog/*.html so its
// header, mobile nav, and footer match.
//
// Run after editing the canonical constants in admin/blog-gen.html, or any
// time the lint script (scripts/lint-blog-chrome.js) reports drift.
//
// Run:  node scripts/repair-blog-chrome.js
// Exit code: 0 on success, 1 if no blog files found, 2 if canonical
// extraction from blog-gen.html fails.

const fs = require('fs');
const path = require('path');

const ROOT     = path.resolve(__dirname, '..');
const BLOG_DIR = path.join(ROOT, 'blog');
const GEN_FILE = path.join(ROOT, 'admin', 'blog-gen.html');

function extractTemplate(genSrc, name) {
  // Pulls the value of `const NAME = \`...\`;` out of blog-gen.html.
  const re = new RegExp('const\\s+' + name + '\\s*=\\s*`([\\s\\S]*?)`;');
  const m = genSrc.match(re);
  if (!m) {
    console.error('Could not find ' + name + ' in admin/blog-gen.html');
    process.exit(2);
  }
  return m[1];
}

const genSrc = fs.readFileSync(GEN_FILE, 'utf8');
const HEADER = extractTemplate(genSrc, 'CANONICAL_BLOG_HEADER');
const MOBILE = extractTemplate(genSrc, 'CANONICAL_BLOG_MOBILE_NAV');
const FOOTER = extractTemplate(genSrc, 'CANONICAL_BLOG_FOOTER');

function repair(html) {
  return html
    .replace(/<header class="site-header">[\s\S]*?<\/header>/, HEADER)
    .replace(/<nav class="mobile-nav">[\s\S]*?<\/nav>/,        MOBILE)
    .replace(/<footer class="site-footer">[\s\S]*?<\/footer>/, FOOTER);
}

if (!fs.existsSync(BLOG_DIR)) {
  console.error('No blog/ directory at', BLOG_DIR);
  process.exit(1);
}

const files = fs.readdirSync(BLOG_DIR).filter(f => f.endsWith('.html')).sort();
let changed = 0, untouched = 0;

for (const f of files) {
  const p = path.join(BLOG_DIR, f);
  const before = fs.readFileSync(p, 'utf8');
  const after = repair(before);
  if (after !== before) {
    fs.writeFileSync(p, after);
    changed++;
    console.log('✓ ' + f);
  } else {
    untouched++;
  }
}

console.log('\nRepaired ' + changed + ' / ' + files.length + ' blog posts (' + untouched + ' already canonical).');
