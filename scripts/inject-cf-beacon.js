#!/usr/bin/env node
// Injects the Cloudflare Web Analytics beacon snippet just before </head>
// in every public HTML page. Idempotent — re-runs are no-ops.
//
// www.plainblackcreative.com is served by GitHub Pages, not CF Pages, so
// CF's edge auto-inject never fires. The beacon is a tiny JS snippet that
// reports pageviews from the visitor's browser regardless of host.
//
// Run: npm run inject-beacon   (or: node scripts/inject-cf-beacon.js)

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const TOKEN = 'fcefa9f88f014aa4a336f918d3eb543b'; // CF Web Analytics site tag (public)
const SNIPPET = `<!-- Cloudflare Web Analytics -->
<script defer src="https://static.cloudflareinsights.com/beacon.min.js" data-cf-beacon='{"token":"${TOKEN}"}'></script>
<!-- End Cloudflare Web Analytics -->`;
const SENTINEL = 'static.cloudflareinsights.com/beacon.min.js';

const SECTIONS = [
  { dir: ROOT, recurse: false, filter: f => f.endsWith('.html') },
  { dir: path.join(ROOT, 'blog'), recurse: false, filter: f => f.endsWith('.html') },
  { dir: path.join(ROOT, 'playbooks', 'ready'), recurse: true, filter: f => f.endsWith('-LANDING.html') },
  { dir: path.join(ROOT, 'givesback', 'cases'), recurse: false, filter: f => f.endsWith('.html') },
  // Admin tools too — CF Web Analytics is configured for manual JS Snippet
  // installation, so auto-inject doesn't fire even on the admin Pages project
  // any more. Keep tracking by snippet-injecting these as well.
  { dir: path.join(ROOT, 'admin'), recurse: false, filter: f => f.endsWith('.html') },
];

function walk(dir, recurse) {
  if (!fs.existsSync(dir)) return [];
  const out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) { if (recurse) out.push(...walk(full, true)); }
    else out.push(full);
  }
  return out;
}

function inject(file) {
  const src = fs.readFileSync(file, 'utf8');
  if (src.includes(SENTINEL)) return 'skip';
  const headClose = src.search(/<\/head>/i);
  if (headClose === -1) return 'no-head';
  const out = src.slice(0, headClose) + SNIPPET + '\n' + src.slice(headClose);
  fs.writeFileSync(file, out);
  return 'injected';
}

function main() {
  let injected = 0, skipped = 0, missing = 0;
  for (const section of SECTIONS) {
    const files = walk(section.dir, section.recurse).filter(f => section.filter(path.basename(f)));
    for (const f of files) {
      const result = inject(f);
      if (result === 'injected') { injected++; console.log('  +', path.relative(ROOT, f)); }
      else if (result === 'skip') skipped++;
      else if (result === 'no-head') { missing++; console.warn('  ! no </head> in', path.relative(ROOT, f)); }
    }
  }
  console.log(`\ndone: ${injected} injected, ${skipped} already had it, ${missing} missing </head>`);
}

main();
