#!/usr/bin/env node
/* The public Mods page. Fills the two marked blocks in mods.html from the dashboard's own catalogue (name, words, drawn preview
   with a made-up business) and its stacks, plus scripts/mods-showcase.json for what only this page decides.
     node scripts/build-mods-page.js            PORTAL=<path> if the portal repo is not at ~/Studio/platform/portal
   Run by hand after the catalogue changes; the result is committed. */
const fs = require('fs'), path = require('path'), os = require('os'), vm = require('vm');
const ROOT = path.join(__dirname, '..');
const PORTAL = process.env.PORTAL || path.join(os.homedir(), 'Studio/platform/portal');
const read = (p) => fs.readFileSync(path.join(PORTAL, 'demo/assets', p), 'utf8');
const cfg = JSON.parse(fs.readFileSync(path.join(__dirname, 'mods-showcase.json'), 'utf8'));
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-');

const win = {};
vm.runInNewContext(read('js/hub-addons.js'), { window: win, document: {} });
const tools = win.HUB_ADDONS.tools.filter((t) => !cfg.hide.includes(t.key) && !t.always);
const known = new Set(tools.map((t) => t.key));
for (const list of [cfg.concept, Object.keys(cfg.tryIt), Object.keys(cfg.usedBy)]) for (const k of list) if (!known.has(k)) throw new Error(`mods-showcase.json names ${k}, which is not a mod on this page`);

const m = /var SUITES_STD = (\[[\s\S]*?\n {2}\]);/.exec(read('js/hub.js'));
if (!m) throw new Error('could not find the stacks in hub.js');
const suites = vm.runInNewContext(m[1]);
const groups = suites.map((s) => ({ label: s.label, sections: s.keys, tools: [] }));
const other = groups.find((g) => g.label === 'Tools') || groups[groups.length - 1];
tools.forEach((t) => { (groups.find((g) => g.sections.includes(t.section)) || other).tools.push(t); });
groups.forEach((g) => g.tools.sort((a, b) => g.sections.indexOf(a.section) - g.sections.indexOf(b.section)));

function card(t) {
  const used = cfg.usedBy[t.key] || [], concept = cfg.concept.includes(t.key), tryIt = cfg.tryIt[t.key];
  const chips = (used.length ? '<span class="md-chip is-used">In use</span>' : '') + (concept ? '<span class="md-chip">Concept</span>' : '') + (tryIt ? '<span class="md-chip">Free version</span>' : '');
  const list = (t.includes || []).map((x) => `<li>${esc(x)}</li>`).join('');
  return `<article class="md-card fade-up" data-used="${used.length ? 1 : 0}" data-try="${tryIt ? 1 : 0}" data-concept="${concept ? 1 : 0}">
<div class="md-card__top"><h3>${esc(t.name)}</h3><div class="md-chips">${chips}</div></div>
<p class="md-what">${esc(t.what)}</p>
<div class="md-preview" aria-hidden="true">${t.preview()}</div>
<details class="md-more"><summary>What's in it<span class="md-sr"> for ${esc(t.name)}</span></summary><ul>${list}</ul></details>
${used.length ? `<p class="md-used"><strong>Used by</strong> ${esc(used.join(', '))}</p>` : ''}${tryIt ? `<a class="md-try" href="${esc(tryIt)}">Try the free version</a>` : ''}
</article>`;
}
const shown = groups.filter((g) => g.tools.length);
const html = `<div class="md-filters" role="group" aria-label="Show">
<button type="button" class="md-filter" data-f="all" aria-pressed="true">All</button>
<button type="button" class="md-filter" data-f="used" aria-pressed="false">In use</button>
<button type="button" class="md-filter" data-f="try" aria-pressed="false">Free version</button>
<button type="button" class="md-filter" data-f="concept" aria-pressed="false">Concepts</button>
${shown.map((g) => `<button type="button" class="md-filter" data-f="s:${slug(g.label)}" aria-pressed="false">${esc(g.label)}</button>`).join('\n')}
</div>
${shown.map((g) => `<section class="md-stack" data-stack="${slug(g.label)}" aria-labelledby="stack-${slug(g.label)}">
<h2 id="stack-${slug(g.label)}">${esc(g.label)}</h2>
<div class="md-grid">
${g.tools.map(card).join('\n')}
</div>
</section>`).join('\n')}`;

/* The preview styles, from the dashboard's own stylesheet, for the classes these previews use. */
const used = new Set();
for (const mm of html.matchAll(/class="([^"]+)"/g)) mm[1].split(/\s+/).forEach((c) => used.add(c));
const css = [];
for (const line of read('css/hub.css').split('\n')) {
  const t = line.trim();
  if (!/^:root \.[\w-]/.test(t) || !t.endsWith('}') || /\.nav-item|\.panel|\.search-result/.test(t)) continue;
  const sel = t.slice(0, t.indexOf('{'));
  const first = sel.split(',').map((s) => (/^:root \.([\w-]+)/.exec(s.trim()) || [])[1]);
  if (first.every((c) => c && used.has(c) && !c.startsWith('md-'))) css.push(t.replace(/:root \./g, '.md-preview .'));
}
const words = html.replace(/<[^>]+>/g, ' ');
if (/—/.test(words)) throw new Error('an em dash reached the page: ' + /.{40}—.{20}/.exec(words)[0]);
if (/\bPB\b/.test(words)) throw new Error('"PB" reached the page');

const file = path.join(ROOT, 'mods.html');
let page = fs.readFileSync(file, 'utf8');
const put = (a, b, body) => {
  if (!page.includes(a) || !page.includes(b)) throw new Error('mods.html has lost its markers: ' + a);
  page = page.slice(0, page.indexOf(a) + a.length) + '\n' + body + '\n' + page.slice(page.indexOf(b));
};
put('<!-- pb:mods:start -->', '<!-- pb:mods:end -->', html);
put('/* pb:mods-css:start */', '/* pb:mods-css:end */', css.join('\n'));
fs.writeFileSync(file, page);
console.log(`mods.html: ${tools.length} mods in ${shown.length} stacks, ${css.length} preview styles.`);
