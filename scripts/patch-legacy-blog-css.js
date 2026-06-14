#!/usr/bin/env node
// One-shot patcher for the 22 legacy blog posts that ship a self-contained
// inline <style> block (no <link> to /assets/style.css). Those posts can't
// pick up new global rules, so when the canonical chrome adopts new pieces
// (text logo-mark, .footer-socials class, etc.) the legacy posts render
// the new markup with no styling.
//
// This script identifies legacy posts (inline-style only, no global CSS
// link) and injects the minimum CSS needed to render the canonical chrome
// correctly. All values are hardcoded — no CSS-var dependency, since
// legacy posts' :root only defines a subset of the design tokens.
//
// Run: node scripts/patch-legacy-blog-css.js
// Idempotent: looks for the marker comment and skips already-patched posts.

const fs = require('fs');
const path = require('path');

const BLOG_DIR = path.resolve(__dirname, '..', 'blog');
const MARKER   = '/* canonical-chrome-shim';

const SHIM = `\n${MARKER} — injected by scripts/patch-legacy-blog-css.js. */\n` +
  `.logo-mark{display:inline-flex;align-items:baseline;font-family:'Playfair Display',serif;font-weight:700;line-height:1;letter-spacing:-0.01em;text-decoration:none;color:#f5f3ef}\n` +
  `.logo-mark__text{color:inherit}\n` +
  `.logo-mark__dot{display:inline-block;width:0.32em;height:0.32em;border-radius:50%;background:#3ecf8e;margin-left:0.08em;align-self:flex-end;margin-bottom:0.06em}\n` +
  `.site-header__logo .logo-mark{font-size:1.5rem}\n` +
  `.footer-col__logo.logo-mark{font-size:1.25rem;height:auto}\n` +
  `.site-header__cluster{display:flex;align-items:center;gap:32px}\n` +
  `.site-header__cta-wrap{isolation:isolate}\n` +
  `.footer-socials{display:flex;gap:14px;align-items:center;margin-top:32px;margin-bottom:24px}\n` +
  `.footer-socials a{display:inline-flex;opacity:0.85;transition:opacity 0.2s}\n` +
  `.footer-socials a:hover{opacity:1}\n` +
  `.footer-socials img{width:28px;height:28px;display:block}\n`;

function isLegacy(html) {
  // Legacy = self-contained inline <style> in <head>, NOT loading the
  // global stylesheet. Newer posts load /assets/style.css and don't need
  // this shim.
  const headMatch = html.match(/<head[\s\S]*?<\/head>/);
  if (!headMatch) return false;
  const head = headMatch[0];
  const loadsGlobal = /<link[^>]*href="\/assets\/style\.css"/.test(head);
  const hasInlineBlock = /<style>[\s\S]{500,}<\/style>/.test(head);
  return hasInlineBlock && !loadsGlobal;
}

function patch(html) {
  if (html.includes(MARKER)) return null; // already patched
  // Inject just before the first </style> that comes after <head> open.
  const idx = html.indexOf('</style>');
  if (idx < 0) return null;
  return html.slice(0, idx) + SHIM + html.slice(idx);
}

const files = fs.readdirSync(BLOG_DIR).filter(f => f.endsWith('.html')).sort();
let patched = 0, skippedNotLegacy = 0, skippedAlreadyPatched = 0;

for (const f of files) {
  const p = path.join(BLOG_DIR, f);
  const before = fs.readFileSync(p, 'utf8');
  if (!isLegacy(before)) { skippedNotLegacy++; continue; }
  const after = patch(before);
  if (after === null) { skippedAlreadyPatched++; continue; }
  fs.writeFileSync(p, after);
  patched++;
  console.log('✓ ' + f);
}

console.log('\nPatched ' + patched + ' legacy post(s).');
console.log('Skipped ' + skippedNotLegacy + ' non-legacy posts (load global CSS).');
console.log('Skipped ' + skippedAlreadyPatched + ' already-patched posts.');
