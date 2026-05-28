# pb-briefs

Cloudflare Worker behind `/briefs/`. Stores intake answers in KV, paraphrases
each section via Claude Haiku, and serves saved briefs by slug.

## Endpoints

- `GET  /health` → `{ ok: true }`
- `POST /paraphrase` body `{ section, input }` → `{ ok, paraphrase, flag? }`
- `POST /save` body `{ sections, slug? }` → `{ ok, slug }`
- `GET  /:slug` → `{ ok, sections, schema, createdAt, updatedAt }`

## Schema

10 fixed sections, ids: `business`, `customer`, `offer`, `bottleneck`,
`tried`, `worked`, `horizon`, `constraint`, `done`, `proof`. Section
metadata (titles + paraphrase guidance) lives in `src/index.js`.

## Storage

KV namespace `BRIEFS_KV`. Each brief at key `brief:<slug>`. TTL 365 days.

Per-IP rate limit at `rl:briefs:<ip>` (rolling 1h, 80 calls/hr).

## Limits

- 8s fetch timeout, 1.5MB HTML cap (not used by this worker but reserved)
- 2200 char cap per section field
- 25,000 char cap per brief total
- Slug: 10 chars, URL-safe alphabet

## Deploy

```bash
# One-time setup
npx wrangler kv namespace create BRIEFS_KV
# Paste returned id into wrangler.toml
npx wrangler secret put ANTHROPIC_API_KEY

# Deploy
npx wrangler deploy
```
