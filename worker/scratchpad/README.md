# PlainBlack Hub scratchpad — Cloudflare Worker

Backs the Hub's scratchpad. Stores notes in **Cloudflare KV**, gated by a
**bearer token** (single shared secret, set in Cloudflare, paste once into
each browser).

No third-party services. No keys in the repo.

---

## One-time deploy

```bash
cd worker/scratchpad
npx wrangler login                    # opens browser
npm install                            # installs wrangler

# 1. Create the KV namespace
npx wrangler kv namespace create SCRATCHPAD_KV
#   → copy the printed `id` into wrangler.toml (replace REPLACE_WITH_...)

# 2. Set the shared secret (the bearer token)
#    Use a long random string. Generate with:
#       openssl rand -base64 32
npx wrangler secret put SCRATCHPAD_TOKEN
#   → paste the secret when prompted

# 3. Deploy
npx wrangler deploy
#   → returns a URL like:
#       https://pb-scratchpad.YOUR-SUBDOMAIN.workers.dev
```

## Wire the Hub up

Open the Hub (`/admin/`) in your browser. The first time you focus the
scratchpad input, it'll prompt for two things:

1. **Worker URL** — the `https://pb-scratchpad.…workers.dev` URL above.
2. **Token** — the same secret you put into Cloudflare in step 2.

Both saved to `localStorage` per device. Each person (you + Ian) does this
once on each device they use.

To rotate the token: re-run `wrangler secret put SCRATCHPAD_TOKEN`, then
clear the `pb-scratchpad-token` localStorage key on each device (or just
re-paste when prompted).

## Endpoints

```
GET   /            → { notes: [...] }
PUT   /            → body: { notes: [...] }   →  { ok: true, count }
GET   /health      → { ok: true }              (open, no auth)
```

All non-`/health` routes require `Authorization: Bearer <SCRATCHPAD_TOKEN>`.

## Cost / limits

Cloudflare Workers free tier: 100,000 requests/day, 10ms CPU per request.
KV free tier: 100,000 reads + 1,000 writes per day, 1GB storage.

The scratchpad realistically uses ~tens of writes per day. You will not
get close to the limits.
