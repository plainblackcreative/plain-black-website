// pb-cms, tiny CMS worker for plainblackcreative.com.
//
// Auth: when fronted by Cloudflare Access, the verified Google email arrives
// in `Cf-Access-Authenticated-User-Email`. We check it against ALLOWED_EMAILS.
// As a fallback (e.g. for local dev or emergency access), an `Authorization:
// Bearer <CMS_SHARED_TOKEN>` header is also accepted when ALLOW_SHARED_TOKEN
// is "true".
//
// Writes: every save commits straight to `main` via the GitHub Contents API
// using a fine-grained PAT (GITHUB_TOKEN secret). Cloudflare Pages picks up
// the push and redeploys.

import { listPosts, getPost, savePost } from './blog.js';
import { listPages, getPage, savePage } from './pages.js';
import { ghPutBinary, ghGetFile } from './github.js';

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // CORS preflight for cross-origin admin-app calls.
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders(request, env) });
    }

    // The UI lives in plainblack-admin. This worker is API-only.
    if (url.pathname === '/' || url.pathname === '/index.html') {
      return withCors(json({
        service: 'pb-cms',
        ok: true,
        ui: 'lives in plainblack-admin; this endpoint is API-only',
      }), request, env);
    }

    if (!url.pathname.startsWith('/api/')) {
      return new Response('Not found', { status: 404 });
    }

    const who = await whoami(request, env);
    if (!who.ok) return withCors(unauthorized(), request, env);

    try {
      const r = await route(url, request, env, who);
      return withCors(r, request, env);
    } catch (e) {
      return withCors(json({ error: e.message || String(e) }, 500), request, env);
    }
  },
};

async function route(url, request, env, who) {
  const p = url.pathname;
  const m = request.method;

  if (p === '/api/whoami' && m === 'GET') {
    return json({ email: who.email, source: who.source });
  }

  // Blog
  if (p === '/api/posts' && m === 'GET') {
    return json(await listPosts(env));
  }
  if (p === '/api/posts' && m === 'POST') {
    const body = await request.json();
    if (!body.slug || !/^[a-z0-9][a-z0-9-]*$/.test(body.slug)) {
      return json({ error: 'slug required: lowercase letters, digits, dashes' }, 400);
    }
    const r = await savePost(env, body.slug, body);
    return json(r);
  }
  const postMatch = p.match(/^\/api\/posts\/([a-z0-9-]+)$/);
  if (postMatch) {
    const slug = postMatch[1];
    if (m === 'GET') {
      const post = await getPost(env, slug);
      return post ? json(post) : json({ error: 'not found' }, 404);
    }
    if (m === 'PUT') {
      const body = await request.json();
      const r = await savePost(env, slug, body);
      return json(r);
    }
  }

  // Pages
  if (p === '/api/pages' && m === 'GET') {
    return json(listPages());
  }
  const pageMatch = p.match(/^\/api\/pages\/([a-zA-Z0-9._-]+)$/);
  if (pageMatch) {
    const file = pageMatch[1];
    if (!listPages().some(x => x.file === file)) {
      return json({ error: 'page not in CMS whitelist' }, 403);
    }
    if (m === 'GET') {
      const page = await getPage(env, file);
      return page ? json(page) : json({ error: 'not found' }, 404);
    }
    if (m === 'PUT') {
      const body = await request.json();
      const r = await savePage(env, file, body.regions || {});
      return json(r);
    }
  }

  // Images
  if (p === '/api/images' && m === 'POST') {
    return await uploadImage(request, env);
  }

  return json({ error: 'not found' }, 404);
}

async function uploadImage(request, env) {
  const ct = request.headers.get('content-type') || '';
  if (!ct.startsWith('multipart/form-data')) {
    return json({ error: 'expected multipart/form-data' }, 400);
  }
  const form = await request.formData();
  const file = form.get('file');
  if (!(file instanceof File)) return json({ error: 'file field required' }, 400);

  const MAX = 5 * 1024 * 1024;
  if (file.size > MAX) return json({ error: 'image too large (max 5 MB)' }, 413);

  const ext = (file.name.match(/\.([a-zA-Z0-9]+)$/)?.[1] || 'bin').toLowerCase();
  const ALLOWED_EXT = new Set(['png', 'jpg', 'jpeg', 'webp', 'gif', 'svg']);
  if (!ALLOWED_EXT.has(ext)) {
    return json({ error: `unsupported extension .${ext}` }, 415);
  }

  const slugBase = (form.get('slug') || file.name.replace(/\.[^.]+$/, ''))
    .toString()
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60) || 'image';
  const stamp = new Date().toISOString().slice(0, 10);
  const dir = (form.get('dir') || 'assets/uploads').toString().replace(/^\/+|\/+$/g, '');
  const path = `${dir}/${stamp}-${slugBase}.${ext}`;

  const buf = await file.arrayBuffer();
  const b64 = arrayBufferToBase64(buf);
  await ghPutBinary(env, path, b64, `cms: upload ${path}`);
  return json({ path: '/' + path, url: '/' + path });
}

function arrayBufferToBase64(buf) {
  const bytes = new Uint8Array(buf);
  let bin = '';
  const CHUNK = 0x8000;
  for (let i = 0; i < bytes.length; i += CHUNK) {
    bin += String.fromCharCode.apply(null, bytes.subarray(i, i + CHUNK));
  }
  return btoa(bin);
}

// ─── Auth ───────────────────────────────────────────────────────────────────
async function whoami(request, env) {
  const email = request.headers.get('Cf-Access-Authenticated-User-Email');
  if (email) {
    const allowed = (env.ALLOWED_EMAILS || '')
      .split(',').map(s => s.trim().toLowerCase()).filter(Boolean);
    if (allowed.length === 0 || allowed.includes(email.toLowerCase())) {
      return { ok: true, email, source: 'access' };
    }
    return { ok: false };
  }
  if (env.ALLOW_SHARED_TOKEN === 'true' && env.CMS_SHARED_TOKEN) {
    const h = request.headers.get('Authorization') || '';
    const tok = h.startsWith('Bearer ') ? h.slice(7) : '';
    if (tok && tok === env.CMS_SHARED_TOKEN) {
      return { ok: true, email: 'shared-token', source: 'token' };
    }
  }
  return { ok: false };
}

function unauthorized() {
  return new Response(
    `Not authorized. This CMS sits behind Cloudflare Access. Make sure ` +
    `you're signed in at admin.plainblackcreative.com first.`,
    { status: 401, headers: { 'Content-Type': 'text/plain; charset=utf-8' } }
  );
}

// ─── Helpers ────────────────────────────────────────────────────────────────
function json(data, status = 200) {
  return new Response(JSON.stringify(data, null, 2), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
}

function corsHeaders(request, env) {
  const origin = request.headers.get('origin') || '';
  const allowed = (env.ALLOWED_ORIGINS || 'https://admin.plainblackcreative.com')
    .split(',').map(s => s.trim());
  const ok = allowed.includes(origin);
  return {
    'Access-Control-Allow-Origin': ok ? origin : 'null',
    'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Credentials': 'true',
    'Vary': 'Origin',
  };
}

function withCors(response, request, env) {
  const headers = new Headers(response.headers);
  const cors = corsHeaders(request, env);
  for (const [k, v] of Object.entries(cors)) headers.set(k, v);
  return new Response(response.body, { status: response.status, headers });
}
