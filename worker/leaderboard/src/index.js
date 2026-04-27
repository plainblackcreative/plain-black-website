// PlainBlack 404 game leaderboard — Cloudflare Worker
// Stores top-10 scores in Workers KV.
// Public endpoints (no auth) but POST is rate-limited per IP.

const KEY                  = 'leaderboard:scores';
const RL_PREFIX            = 'rl:';
const RL_TTL_SECONDS       = 30;       // 1 submission per IP per 30s
const MAX_SCORES           = 10;        // server-side cap
const MIN_TIME_MS          = 5000;      // < 5s is impossible, reject
const MAX_TIME_MS          = 60 * 60 * 1000; // > 1h is junk, reject
const NAME_RX              = /^[A-Z0-9]{1,3}$/;

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
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400',
      'Vary': 'Origin'
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: cors });
    }

    const url = new URL(request.url);
    if (url.pathname === '/health') {
      return json({ ok: true }, 200, cors);
    }

    if (request.method === 'GET') {
      const raw = await env.LEADERBOARD_KV.get(KEY);
      const scores = raw ? JSON.parse(raw) : [];
      return json({ scores }, 200, cors);
    }

    if (request.method === 'POST') {
      // Rate limit by IP
      const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
      const rlKey = RL_PREFIX + ip;
      const recent = await env.LEADERBOARD_KV.get(rlKey);
      if (recent) {
        return json({ error: 'rate_limited', retry_after: RL_TTL_SECONDS }, 429, cors);
      }

      let body;
      try { body = await request.json(); }
      catch { return json({ error: 'invalid_json' }, 400, cors); }

      // Sanitise name
      const name = String(body.name || '')
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, '')
        .slice(0, 3);
      if (!NAME_RX.test(name)) {
        return json({ error: 'invalid_name' }, 400, cors);
      }

      // Validate time
      const time = Number(body.time);
      if (!Number.isFinite(time) || time < MIN_TIME_MS || time > MAX_TIME_MS) {
        return json({ error: 'invalid_time' }, 400, cors);
      }

      // Insert + cap to top-10
      const raw = await env.LEADERBOARD_KV.get(KEY);
      const scores = raw ? JSON.parse(raw) : [];
      scores.push({
        name,
        time,
        date: new Date().toLocaleDateString('en-NZ', { day: 'numeric', month: 'short' })
      });
      scores.sort((a, b) => a.time - b.time);
      const top = scores.slice(0, MAX_SCORES);

      await env.LEADERBOARD_KV.put(KEY, JSON.stringify(top));

      // Set rate-limit key only after a successful insert
      await env.LEADERBOARD_KV.put(rlKey, '1', { expirationTtl: RL_TTL_SECONDS });

      return json({ scores: top, accepted: true }, 200, cors);
    }

    return json({ error: 'method_not_allowed' }, 405, cors);
  }
};

function json(obj, status, cors) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { 'Content-Type': 'application/json', ...cors }
  });
}
