#!/usr/bin/env node
// Adds PlainBlack's note-mode script (scripts/pb-notes-snippet.txt) just before
// </body> in every public HTML page. Inside a client dashboard's Edit site frame
// it lets the client click any part of a page to leave a note; it does nothing
// for visitors. Idempotent: a page that already has it is left alone, and a page
// whose copy differs from the snippet file gets the current one.
//
// Uses inject-pb-source.js's page list, so every page that carries the trackers
// also carries this.
//
// Run: npm run inject-pb-notes   (or: node scripts/inject-pb-notes.js)

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SNIPPET = fs.readFileSync(path.join(__dirname, 'pb-notes-snippet.txt'), 'utf8').trim();
const START = '<!-- NOTE MODE (PlainBlack';
const END = '</script>';

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
  let src = fs.readFileSync(file, 'utf8');
  if (src.includes(SNIPPET)) return 'skip';
  const old = src.indexOf(START);
  let result = 'injected';
  if (old !== -1) {
    const end = src.indexOf(END, old);
    if (end === -1) return 'broken';
    src = src.slice(0, old) + src.slice(end + END.length).replace(/^\r?\n/, '');
    result = 'updated';
  }
  // The LAST </body>: a tool page can carry '</body>' inside a script string
  // (a popup it writes), which must not be mistaken for the page's own.
  const bodyClose = src.toLowerCase().lastIndexOf('</body>');
  if (bodyClose === -1) return 'no-body';
  fs.writeFileSync(file, src.slice(0, bodyClose) + SNIPPET + '\n' + src.slice(bodyClose));
  return result;
}

function main() {
  let injected = 0, skipped = 0, missing = 0;
  for (const section of SECTIONS) {
    const files = walk(section.dir, section.recurse).filter(f => section.filter(path.basename(f)));
    for (const f of files) {
      const result = inject(f);
      if (result === 'injected' || result === 'updated') { injected++; console.log('  +', path.relative(ROOT, f)); }
      else if (result === 'skip') skipped++;
      else { missing++; console.warn('  !', result, path.relative(ROOT, f)); }
    }
  }
  console.log(`\ndone: ${injected} injected, ${skipped} already had it, ${missing} missing </body>`);
}

main();
