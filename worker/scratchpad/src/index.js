// PlainBlack Hub scratchpad — Cloudflare Worker
// Stores a single shared notes blob in Workers KV.
// Auth: bearer token (set as SCRATCHPAD_TOKEN secret).

const KEY = 'scratchpad:notes';
const MAX_BODY_BYTES = 256 * 1024; // 256 KB ought to outlive your scratchpad

export default {
  async fetch(request, env) {
    const allowedOrigins = (env.ALLOWED_ORIGINS || '*').split(',').map(s => s.trim());
    const origin = request.headers.get('Origin') || '';
    const allowOrigin =
      allowedOrigins.includes('*')
        ? '*'
        : allowedOrigins.includes(origin) ? origin : allowedOrigins[0];

    const cors = {
      'Access-Control-Allow-Origin': allowOrigin,
      'Access-Control-Allow-Methods': 'GET, PUT, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400',
      'Vary': 'Origin'
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: cors });
    }

    // Health check (open)
    const url = new URL(request.url);
    if (url.pathname === '/health') {
      return json({ ok: true }, 200, cors);
    }

    // Bearer auth
    const token = (request.headers.get('Authorization') || '').replace(/^Bearer\s+/i, '');
    if (!env.SCRATCHPAD_TOKEN || token !== env.SCRATCHPAD_TOKEN) {
      return json({ error: 'unauthorized' }, 401, cors);
    }

    if (request.method === 'GET') {
      const raw = await env.SCRATCHPAD_KV.get(KEY);
      const notes = raw ? JSON.parse(raw) : [];
      return json({ notes }, 200, cors);
    }

    if (request.method === 'PUT') {
      let body;
      try {
        body = await request.json();
      } catch {
        return json({ error: 'invalid json' }, 400, cors);
      }
      if (!Array.isArray(body.notes)) {
        return json({ error: 'notes must be an array' }, 400, cors);
      }
      const serialised = JSON.stringify(body.notes);
      if (serialised.length > MAX_BODY_BYTES) {
        return json({ error: 'too large' }, 413, cors);
      }
      await env.SCRATCHPAD_KV.put(KEY, serialised);
      return json({ ok: true, count: body.notes.length }, 200, cors);
    }

    return json({ error: 'method not allowed' }, 405, cors);
  }
};

function json(obj, status, cors) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { 'Content-Type': 'application/json', ...cors }
  });
}
