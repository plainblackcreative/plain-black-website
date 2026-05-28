# pb-filler-score

Tiny Cloudflare Worker behind `/filler-score`. One job: take a URL, fetch the
target page server-side (no CORS shenanigans for the client), and return the
visible body text + headings.

The /filler-score page does the analysis (banned-phrase matching, scoring) client-side.

## Endpoints

- `GET  /health`  →  `{ ok: true }`
- `POST /scan`    body `{ url }`  →  `{ ok, finalUrl, title, h1s, h2s, bodyText, wordCount }`

## Limits

- 60 scans/IP/hour (KV-backed sliding window)
- 8s timeout per fetch
- 1.5MB HTML cap
- 8000-char body-text cap (about the first ~1200 words — plenty for above-the-fold analysis)
- Blocks loopback / private hosts

## Deploy

```bash
# One-time setup
npx wrangler kv namespace create FILLER_KV
# paste the returned id into wrangler.toml

# Deploy
npx wrangler deploy
```
