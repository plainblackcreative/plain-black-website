#!/usr/bin/env node
// Adds the "where an enquiry came from" script (assets/pb-source.js) just before
// </head> in every public HTML page. It has to run on every page because it
// records the first page a visitor opens. Idempotent: re-runs are no-ops.
//
// Mirrors scripts/inject-clarity.js's page list so every public page that
// carries the trackers also carries this.
//
// Run: npm run inject-pb-source   (or: node scripts/inject-pb-source.js)

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SNIPPET = '<script defer src="/assets/pb-source.js"></script>';

const SECTIONS = [
  { dir: ROOT, recurse: false, filter: f => f.endsWith('.html') },
  { dir: path.join(ROOT, 'blog'), recurse: false, filter: f => f.endsWith('.html') },
  { dir: path.join(ROOT, 'playbooks'), recurse: true, filter: f => f === 'index.html' },
  { dir: path.join(ROOT, 'givesback', 'cases'), recurse: false, filter: f => f.endsWith('.html') },
  { dir: path.join(ROOT, 'tools'), recurse: true, filter: f => f.endsWith('.html') },
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
  if (src.includes(SNIPPET)) return 'skip';
  const headClose = src.search(/<\/head>/i);
  if (headClose === -1) return 'no-head';
  fs.writeFileSync(file, src.slice(0, headClose) + SNIPPET + '\n' + src.slice(headClose));
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
      else { missing++; console.warn('  ! no </head> in', path.relative(ROOT, f)); }
    }
  }
  console.log(`\ndone: ${injected} injected, ${skipped} already had it, ${missing} missing </head>`);
}

main();
