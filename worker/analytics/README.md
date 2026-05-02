# PlainBlack Website Overview — Cloudflare Worker

Backs the **Website Overview** dashboard (`/admin/website-overview.html`) with
real Cloudflare Web Analytics data, via the Cloudflare GraphQL Analytics API.

The worker is a thin proxy: it queries the API server-side (so the API token
never hits the browser), normalises path strings, and returns a small JSON
payload the dashboard can drop in.

No KV, no D1, no DB — Cloudflare already stores the analytics. The worker
caches each response for 5 minutes via the Cache API so the GraphQL endpoint
doesn't get hammered.

---

## One-time deploy

```bash
cd worker/analytics
npx wrangler login                    # opens browser
npm install                            # installs wrangler

# 1. Get your Cloudflare account ID and Web Analytics site tag.
#    Account ID: dash.cloudflare.com → any URL after /accounts/<TAG>/...
#    Site tag:   dash → Analytics & Logs → Web Analytics → your site → Manage site
#
#    Paste both into wrangler.toml under [vars].

# 2. Create an API token with `Account Analytics:Read` scope.
#    dash.cloudflare.com → My Profile → API Tokens → Create Token →
#    "Custom token" → Permissions: Account → Analytics → Read.
#
#    Set it as a secret:
npx wrangler secret put CF_API_TOKEN

# 3. Deploy
npx wrangler deploy
#   → returns a URL like:
#       https://pb-analytics.YOUR-SUBDOMAIN.workers.dev
```

## Wire the dashboard up

Open `/admin/website-overview.html` in your browser. There's a
**Connect live data** button in the demo banner — click it, paste the
worker URL, and that's it. Saved per-device in `localStorage` under
`pb-analytics-url`.

To rotate the API token: re-run `wrangler secret put CF_API_TOKEN`. No
dashboard change needed — the worker URL doesn't change.

## Endpoints

```
GET   /?days=7         → { range, totals: {...}, pages: [...] }
GET   /?days=30        → same, 30-day window
GET   /?days=90        → same, 90-day window
GET   /health          → { ok: true }
```

`days` is clamped to 1..90.

## Response shape

```json
{
  "range": { "start": "2026-04-26", "end": "2026-05-02", "days": 7 },
  "totals": {
    "views": 5421,
    "visitors": 3218,
    "daily": [{ "day": "2026-04-26", "views": 740 }, ...]
  },
  "pages": [
    { "url": "/blog", "views": 920 },
    { "url": "/", "views": 612 },
    ...
  ]
}
```

`url` values are normalised to match the dashboard's manifest convention:
`.html` extensions stripped, trailing slashes stripped (except `/`), query
strings dropped. Counts for paths that collapse to the same canonical form
are summed.

## Cost / limits

- Workers free tier: 100,000 requests/day. With a 5-min cache and a single
  internal user, this worker will see <300 requests/day.
- Cloudflare GraphQL Analytics API is rate-limited per account — the cache
  takes care of that too.
- No KV, no D1 — nothing to bill on storage.
