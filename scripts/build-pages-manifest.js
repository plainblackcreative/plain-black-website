#!/usr/bin/env node
// Scans the static site for public-facing HTML pages and emits
// admin/website-pages.json — the data source for the Website Overview dashboard.
//
// Run: npm run build-pages   (or: node scripts/build-pages-manifest.js)

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, 'admin', 'website-pages.json');
const SITE = 'https://www.plainblackcreative.com';

// pages we never want to surface (errors, post-form thanks, internal/admin)
const EXCLUDE_TOPLEVEL = new Set(['404.html', 'thanks.html']);

const SECTIONS = [
  { type: 'marketing', label: 'Marketing', dir: ROOT, recurse: false, filter: f => f.endsWith('.html') && !EXCLUDE_TOPLEVEL.has(f) },
  { type: 'blog',      label: 'Blog',      dir: path.join(ROOT, 'blog'), recurse: false, filter: f => f.endsWith('.html') },
  { type: 'playbook',  label: 'Playbook',  dir: path.join(ROOT, 'playbooks', 'ready'), recurse: true, filter: f => f.endsWith('-LANDING.html') },
  { type: 'case',      label: 'Givesback', dir: path.join(ROOT, 'givesback', 'cases'), recurse: false, filter: f => f.endsWith('.html') },
];

function walk(dir, recurse) {
  if (!fs.existsSync(dir)) return [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const out = [];
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (recurse) out.push(...walk(full, true));
    } else {
      out.push(full);
    }
  }
  return out;
}

function pick(html, re) {
  const m = html.match(re);
  return m ? m[1].trim() : '';
}

function metaContent(html, name, kind = 'name') {
  const re = new RegExp(`<meta\\s+${kind}=["']${name}["']\\s+content=["']([^"']*)["']`, 'i');
  return pick(html, re);
}

function stripTags(s) {
  return s
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function urlForFile(file, type) {
  const rel = path.relative(ROOT, file).split(path.sep).join('/');
  // Pretty URLs:
  // index.html → /
  // foo.html → /foo  (top-level marketing only — playbook/case landing keeps full path)
  // blog/foo.html → /blog/foo
  if (type === 'marketing') {
    if (rel === 'index.html') return '/';
    return '/' + rel.replace(/\.html$/, '');
  }
  if (type === 'blog') {
    return '/blog/' + path.basename(file).replace(/\.html$/, '');
  }
  // playbook/case keep their full paths (the canonical sitemap form)
  return '/' + rel;
}

function scoreSEO(p) {
  const checks = [];
  const add = (key, ok, weight, note) => checks.push({ key, ok, weight, note });

  add('title',          !!p.title,                                                  10, 'has <title>');
  add('title-length',   p.title.length >= 30 && p.title.length <= 65,               10, 'title 30–65 chars');
  add('description',    !!p.description,                                            10, 'has meta description');
  add('description-length', p.description.length >= 120 && p.description.length <= 165, 10, 'description 120–165 chars');
  add('og-image',       !!p.ogImage,                                                10, 'has og:image');
  add('og-title',       !!p.ogTitle,                                                 5, 'has og:title');
  add('og-description', !!p.ogDescription,                                           5, 'has og:description');
  add('canonical',      !!p.canonical,                                              10, 'has canonical link');
  add('twitter-card',   !!p.twitterCard,                                             5, 'has twitter:card');
  add('viewport',       p.hasViewport,                                               5, 'has viewport meta');
  add('h1',             p.hasH1,                                                    10, 'has H1');
  add('words-300',      p.wordCount >= 300,                                          5, 'word count ≥ 300');
  add('words-600',      p.wordCount >= 600,                                          5, 'word count ≥ 600');

  const total = checks.reduce((s, c) => s + (c.ok ? c.weight : 0), 0);
  return { score: total, checks };
}

function parsePage(file, type) {
  const html = fs.readFileSync(file, 'utf8');
  const stat = fs.statSync(file);

  const title       = pick(html, /<title>([^<]*)<\/title>/i).replace(/\s+/g, ' ').trim();
  const description = metaContent(html, 'description', 'name');
  const ogTitle     = metaContent(html, 'og:title', 'property');
  const ogDescription = metaContent(html, 'og:description', 'property');
  const ogImage     = metaContent(html, 'og:image', 'property');
  const canonical   = pick(html, /<link\s+rel=["']canonical["']\s+href=["']([^"']+)["']/i);
  const twitterCard = metaContent(html, 'twitter:card', 'name');
  const hasViewport = /<meta\s+name=["']viewport["']/i.test(html);
  const hasH1       = /<h1[\s>]/i.test(html);

  // body word count: extract <body>, strip tags, count words.
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  const bodyText  = bodyMatch ? stripTags(bodyMatch[1]) : stripTags(html);
  const wordCount = bodyText ? bodyText.split(/\s+/).filter(Boolean).length : 0;

  const partial = { title, description, ogTitle, ogDescription, ogImage, canonical, twitterCard, hasViewport, hasH1, wordCount };
  const seo = scoreSEO(partial);

  // Resolve OG image to absolute URL for the dashboard.
  let ogImageAbsolute = ogImage;
  if (ogImage && ogImage.startsWith('/')) ogImageAbsolute = SITE + ogImage;

  return {
    type,
    url: urlForFile(file, type),
    fullUrl: SITE + urlForFile(file, type),
    file: path.relative(ROOT, file).split(path.sep).join('/'),
    slug: path.basename(file).replace(/\.html$/, ''),
    title,
    description,
    ogTitle,
    ogDescription,
    ogImage,
    ogImageAbsolute,
    canonical,
    twitterCard,
    hasViewport,
    hasH1,
    wordCount,
    sizeBytes: stat.size,
    lastModified: stat.mtime.toISOString(),
    seoScore: seo.score,
    seoChecks: seo.checks,
  };
}

function main() {
  const pages = [];
  for (const section of SECTIONS) {
    const files = walk(section.dir, section.recurse).filter(f => section.filter(path.basename(f)));
    for (const f of files) {
      try {
        pages.push(parsePage(f, section.type));
      } catch (err) {
        console.warn('skipped', f, err.message);
      }
    }
  }

  pages.sort((a, b) => a.url.localeCompare(b.url));

  const manifest = {
    generatedAt: new Date().toISOString(),
    site: SITE,
    counts: {
      total: pages.length,
      marketing: pages.filter(p => p.type === 'marketing').length,
      blog: pages.filter(p => p.type === 'blog').length,
      playbook: pages.filter(p => p.type === 'playbook').length,
      case: pages.filter(p => p.type === 'case').length,
    },
    pages,
  };

  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(manifest, null, 2));
  console.log(`wrote ${pages.length} pages → ${path.relative(ROOT, OUT)}`);
}

main();
