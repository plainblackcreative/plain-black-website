# PlainBlack 404 game leaderboard — Cloudflare Worker

Backs the leaderboard on `/404.html`. Stores top-10 scores in
**Cloudflare KV**. Public read, public write — but writes are
**rate-limited per IP** (1 submission every 30s) and validated
server-side (impossible-fast scores rejected, names sanitised, list
capped at 10 entries).

No third-party services. No secrets. The Worker URL is hardcoded
into `404.html` because there's nothing sensitive to hide.

---

## One-time deploy

```bash
cd worker/leaderboard
npm install

# 1. Create the KV namespace
npx wrangler kv namespace create LEADERBOARD_KV
#   → copy the printed `id` into wrangler.toml (replace REPLACE_WITH_...)

# 2. Deploy
npx wrangler deploy
#   → returns a URL like:
#       https://pb-leaderboard.YOUR-SUBDOMAIN.workers.dev
```

## Wire `404.html` up

Open `404.html` in this repo, find the `LB_URL` constant near the
top of the leaderboard script and replace its placeholder with the
Worker URL above. Commit, push, redeploy the site.

(Or pass me the URL and I'll patch the file for you.)

## Endpoints

```
GET   /            → { scores: [{name, time, date}, ...] }
POST  /            → body: { name: "ABC", time: 12345 }
                    →  { scores: [...], accepted: true }
                    or  { error: "rate_limited", retry_after: 30 }
GET   /health      → { ok: true }
```

Validation rules (server-side):
- `name`: A–Z / 0–9, max 3 chars (sanitised before insert)
- `time`: positive integer in ms, between 5000 (5s) and 3600000 (1h)
- list trimmed to top 10 by lowest time
- POST blocked for 30s after a successful insert from the same IP

## Cost / limits

Cloudflare Workers free tier: 100,000 requests/day, 10ms CPU each.
KV free tier: 100,000 reads + 1,000 writes per day, 1GB storage.

A 404-page leaderboard will not stress this. Reads are heavily
cached by the Worker runtime; writes are rare and rate-limited.
