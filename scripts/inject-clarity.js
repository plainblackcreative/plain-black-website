#!/usr/bin/env node
// Injects/updates the Microsoft Clarity tracking snippet just before </head>
// in every public HTML page. Idempotent — re-runs are no-ops. If an older
// Clarity snippet (any project id) is already present, it is replaced
// in place rather than duplicated.
//
// Mirrors scripts/inject-cf-beacon.js's page list so both trackers stay
// in sync across the same public pages.
//
// Run: npm run inject-clarity   (or: node scripts/inject-clarity.js)

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const CLARITY_ID = 'yijw9mcpiv'; // Clarity project id (public)
const SNIPPET = `<!-- Clarity tracking code for https://plainblackcreative.com/ -->
<script>
    (function(c,l,a,r,i,t,y){
        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i+"?ref=bwt";
        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
    })(window, document, "clarity", "script", "${CLARITY_ID}");
</script>`;

// Matches any existing Clarity block, old or new: an optional preceding
// comment line, then the IIFE `<script ...>...</script>`, whatever script
// tag attributes, project id, or query string it carries.
const EXISTING_BLOCK = /(?:<!--[^\n]*[Cc]larity[^\n]*-->\n)?<script[^>]*>\s*\(function\(c,l,a,r,i,t,y\)\{[\s\S]*?"clarity",\s*"script",\s*"[a-z0-9]+"\)[\s\S]*?<\/script>/;

const SECTIONS = [
  { dir: ROOT, recurse: false, filter: f => f.endsWith('.html') },
  { dir: path.join(ROOT, 'blog'), recurse: false, filter: f => f.endsWith('.html') },
  // Playbook landers live at playbooks/<slug>/index.html; TEMPLATE files at
  // playbooks/ready/<slug>/<slug>-TEMPLATE.html stay admin-only and don't
  // need the public snippet.
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
  if (EXISTING_BLOCK.test(src)) {
    fs.writeFileSync(file, src.replace(EXISTING_BLOCK, SNIPPET));
    return 'replaced';
  }
  const headClose = src.search(/<\/head>/i);
  if (headClose === -1) return 'no-head';
  const out = src.slice(0, headClose) + SNIPPET + '\n' + src.slice(headClose);
  fs.writeFileSync(file, out);
  return 'injected';
}

function main() {
  let injected = 0, replaced = 0, skipped = 0, missing = 0;
  for (const section of SECTIONS) {
    const files = walk(section.dir, section.recurse).filter(f => section.filter(path.basename(f)));
    for (const f of files) {
      const result = inject(f);
      if (result === 'injected') { injected++; console.log('  +', path.relative(ROOT, f)); }
      else if (result === 'replaced') { replaced++; console.log('  ~', path.relative(ROOT, f)); }
      else if (result === 'skip') skipped++;
      else if (result === 'no-head') { missing++; console.warn('  ! no </head> in', path.relative(ROOT, f)); }
    }
  }
  console.log(`\ndone: ${injected} injected, ${replaced} replaced, ${skipped} already had it, ${missing} missing </head>`);
}

main();
