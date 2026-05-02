// PlainBlack Website Overview — Cloudflare Worker
// Proxies the Cloudflare GraphQL Analytics API for Web Analytics (RUM) data
// and returns it in the shape the dashboard expects:
//   { totals: { views, visitors, daily: [{day, views}] },
//     pages:  [{ url, views }] }
//
// CORS is restricted via ALLOWED_ORIGINS. Responses are cached for 5 min.

const CF_GRAPHQL = 'https://api.cloudflare.com/client/v4/graphql';
const CACHE_TTL = 300; // seconds — CF Web Analytics aggregates aren't realtime anyway

export default {
  async fetch(request, env, ctx) {
    const allowedOrigins = (env.ALLOWED_ORIGINS || '').split(',').map(s => s.trim()).filter(Boolean);
    const origin = request.headers.get('Origin') || '';
    const allowOrigin = allowedOrigins.includes(origin) ? origin : (allowedOrigins[0] || '*');

    const cors = {
      'Access-Control-Allow-Origin': allowOrigin,
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400',
      'Vary': 'Origin',
    };

    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });

    const url = new URL(request.url);
    if (url.pathname === '/health') return json({ ok: true }, 200, cors);
    if (request.method !== 'GET')   return json({ error: 'method not allowed' }, 405, cors);

    const days = clamp(parseInt(url.searchParams.get('days') || '7', 10), 1, 90);

    if (!env.CF_API_TOKEN || !env.CF_ACCOUNT_TAG || !env.CF_SITE_TAG ||
        env.CF_ACCOUNT_TAG.startsWith('REPLACE_') || env.CF_SITE_TAG.startsWith('REPLACE_')) {
      return json({ error: 'worker not configured (missing CF_API_TOKEN / CF_ACCOUNT_TAG / CF_SITE_TAG)' }, 503, cors);
    }

    // Cache by days-in-range. The CF aggregates only update every few minutes
    // anyway, so a short Cache API entry keeps us well under any rate limits.
    const cacheKey = new Request(`https://cache.local/analytics?days=${days}`, { method: 'GET' });
    const cache = caches.default;
    const cached = await cache.match(cacheKey);
    if (cached) return withHeaders(cached, cors);

    try {
      const data = await fetchAnalytics(env, days);
      const res = json(data, 200, { ...cors, 'Cache-Control': `public, max-age=${CACHE_TTL}` });
      ctx.waitUntil(cache.put(cacheKey, res.clone()));
      return res;
    } catch (err) {
      return json({ error: 'upstream failed', detail: String(err.message || err) }, 502, cors);
    }
  },
};

async function fetchAnalytics(env, days) {
  const today = new Date();
  const end = today.toISOString().slice(0, 10);
  const startDate = new Date(today.getTime() - (days - 1) * 86400000);
  const start = startDate.toISOString().slice(0, 10);

  const query = `
    query Analytics($accountTag: String!, $siteTag: String!, $start: Date!, $end: Date!) {
      viewer {
        accounts(filter: {accountTag: $accountTag}) {
          total: rumPageloadEventsAdaptiveGroups(
            limit: 1
            filter: {siteTag: $siteTag, date_geq: $start, date_leq: $end}
          ) {
            sum { visits }
            count
          }
          daily: rumPageloadEventsAdaptiveGroups(
            limit: 100
            filter: {siteTag: $siteTag, date_geq: $start, date_leq: $end}
            orderBy: [date_ASC]
          ) {
            dimensions { date }
            sum { visits }
            count
          }
          pages: rumPageloadEventsAdaptiveGroups(
            limit: 200
            filter: {siteTag: $siteTag, date_geq: $start, date_leq: $end}
            orderBy: [count_DESC]
          ) {
            dimensions { metric: requestPath }
            count
          }
        }
      }
    }
  `;

  const res = await fetch(CF_GRAPHQL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${env.CF_API_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query,
      variables: { accountTag: env.CF_ACCOUNT_TAG, siteTag: env.CF_SITE_TAG, start, end },
    }),
  });

  if (!res.ok) throw new Error(`graphql ${res.status}`);
  const body = await res.json();
  if (body.errors?.length) throw new Error(body.errors.map(e => e.message).join('; '));

  const account = body.data?.viewer?.accounts?.[0];
  if (!account) throw new Error('no account in response — check CF_ACCOUNT_TAG');

  const totalRow = account.total?.[0];
  const views    = totalRow?.count ?? 0;
  const visitors = totalRow?.sum?.visits ?? 0;

  // Fill the daily series for every day in range (CF returns only days with data).
  const dailyMap = {};
  for (const row of account.daily || []) {
    dailyMap[row.dimensions.date] = row.count;
  }
  const daily = [];
  for (let i = 0; i < days; i++) {
    const d = new Date(startDate.getTime() + i * 86400000).toISOString().slice(0, 10);
    daily.push({ day: d, views: dailyMap[d] || 0 });
  }

  // Per-page rollup. CF reports raw paths (with .html, with trailing slashes,
  // with query strings) — collapse them to the canonical form the dashboard uses.
  const pageMap = {};
  for (const row of account.pages || []) {
    const norm = normalizePath(row.dimensions.metric);
    if (!norm) continue;
    pageMap[norm] = (pageMap[norm] || 0) + row.count;
  }
  const pages = Object.entries(pageMap)
    .map(([url, views]) => ({ url, views }))
    .sort((a, b) => b.views - a.views);

  return {
    range: { start, end, days },
    totals: { views, visitors, daily },
    pages,
  };
}

function normalizePath(p) {
  if (!p) return '';
  let s = p.split('?')[0].split('#')[0];
  if (!s.startsWith('/')) s = '/' + s;
  if (s.endsWith('/index.html')) s = s.slice(0, -'/index.html'.length) || '/';
  if (s.endsWith('.html')) s = s.slice(0, -'.html'.length);
  if (s.length > 1 && s.endsWith('/')) s = s.slice(0, -1);
  return s || '/';
}

function clamp(n, lo, hi) { return Math.max(lo, Math.min(hi, isNaN(n) ? lo : n)); }

function json(obj, status, headers) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { 'Content-Type': 'application/json', ...headers },
  });
}

function withHeaders(res, extra) {
  const h = new Headers(res.headers);
  for (const [k, v] of Object.entries(extra)) h.set(k, v);
  return new Response(res.body, { status: res.status, headers: h });
}
