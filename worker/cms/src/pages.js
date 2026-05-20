// Editable-region read/write for landing pages. Convention:
//   <h1 data-cms-editable="hero-headline">…</h1>
//   <p  data-cms-editable="hero-subtitle">…</p>
//
// Regions must not contain another tag of the same name (no nested <p> inside
// a <p> region). All other inline tags are fine.

import { ghGetFile, ghPutFile } from './github.js';

// Whitelist of pages Ian can edit. Anything not listed is invisible to the CMS,
// so accidental edits can't reach the public site.
export const PAGES = [
  { file: 'index.html',     label: 'Home' },
  { file: 'about.html',     label: 'About' },
  { file: 'services.html',  label: 'Services' },
  { file: 'playbooks.html', label: 'Playbooks' },
  { file: 'tools.html',     label: 'Tools' },
  { file: 'work.html',      label: 'Work' },
  { file: 'contact.html',   label: 'Contact' },
  { file: 'givesback.html', label: 'Gives Back' },
  { file: 'challenge.html', label: '30-Day Challenge' },
];

export function listPages() {
  return PAGES;
}

function findOpeningTag(html, attrIdx) {
  let i = attrIdx;
  while (i > 0 && html[i] !== '<') i--;
  if (html[i] !== '<') return null;
  const m = html.slice(i + 1).match(/^([a-zA-Z][a-zA-Z0-9-]*)/);
  if (!m) return null;
  const tagName = m[1];
  const openEnd = html.indexOf('>', attrIdx);
  if (openEnd === -1) return null;
  return { tagName, tagStart: i, contentStart: openEnd + 1 };
}

function findMatchingClose(html, contentStart, tagName) {
  const openRe = new RegExp(`<${tagName}\\b[^>]*>`, 'gi');
  const closeRe = new RegExp(`</${tagName}\\s*>`, 'gi');
  let depth = 1;
  let pos = contentStart;
  while (depth > 0 && pos < html.length) {
    openRe.lastIndex = pos;
    closeRe.lastIndex = pos;
    const open = openRe.exec(html);
    const close = closeRe.exec(html);
    if (!close) return -1;
    if (open && open.index < close.index) {
      depth++;
      pos = open.index + open[0].length;
    } else {
      depth--;
      if (depth === 0) return close.index;
      pos = close.index + close[0].length;
    }
  }
  return -1;
}

export function extractRegions(html) {
  const regions = [];
  const re = /\sdata-cms-editable="([^"]+)"/g;
  let m;
  while ((m = re.exec(html)) !== null) {
    const id = m[1];
    const open = findOpeningTag(html, m.index);
    if (!open) continue;
    const closeAt = findMatchingClose(html, open.contentStart, open.tagName);
    if (closeAt === -1) continue;
    regions.push({
      id,
      tag: open.tagName.toLowerCase(),
      html: html.slice(open.contentStart, closeAt),
    });
  }
  return regions;
}

export function replaceRegion(html, id, newContent) {
  const escId = id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const re = new RegExp(`\\sdata-cms-editable="${escId}"`);
  const m = re.exec(html);
  if (!m) return { html, replaced: false };
  const open = findOpeningTag(html, m.index);
  if (!open) return { html, replaced: false };
  const closeAt = findMatchingClose(html, open.contentStart, open.tagName);
  if (closeAt === -1) return { html, replaced: false };
  return {
    html: html.slice(0, open.contentStart) + newContent + html.slice(closeAt),
    replaced: true,
  };
}

export async function getPage(env, file) {
  const f = await ghGetFile(env, file);
  if (!f) return null;
  return {
    file,
    sha: f.sha,
    regions: extractRegions(f.contentText),
  };
}

export async function savePage(env, file, updates) {
  // updates: { id: newHtml, ... }
  const f = await ghGetFile(env, file);
  if (!f) throw new Error(`Page not found: ${file}`);
  let html = f.contentText;
  const skipped = [];
  for (const [id, content] of Object.entries(updates)) {
    const r = replaceRegion(html, id, content);
    if (!r.replaced) skipped.push(id);
    else html = r.html;
  }
  if (html !== f.contentText) {
    await ghPutFile(env, file, html, `cms: edit ${file}`, f.sha);
  }
  return { file, skipped };
}
