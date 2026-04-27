# PlainBlack chat bot — Cloudflare Worker

Backs the floating chat widget on every page. Holds the Anthropic API
key as a Worker secret (never exposed to the browser), proxies chat
turns to Claude with a baked-in PlainBlack system prompt.

The browser POSTs `{message, history}`. Worker returns `{reply}`.

---

## One-time deploy

```bash
cd worker/bot
npm install

# 1. KV namespace for per-IP rate limiting
npx wrangler kv namespace create BOT_KV
#   → copy the printed `id` into wrangler.toml (replace the placeholder)

# 2. Anthropic API key (set as a secret, never in the repo)
#    Get one at https://console.anthropic.com/settings/keys
npx wrangler secret put ANTHROPIC_API_KEY
#   → paste your key when prompted (starts with sk-ant-...)

# 3. Deploy
npx wrangler deploy
#   → returns https://pb-bot.<your-subdomain>.workers.dev
```

## Wire the frontend

The Worker URL is hardcoded in `assets/site-bot.js` (no secret to
hide). After deploy, find the `BOT_URL` constant near the top of
`site-bot.js` and update it if your subdomain isn't `jkbrownnz`.

## Endpoints

```
POST  /            → body: { message: "...", history?: [{role, content}, ...] }
                    →  { reply: "..." }
                    or  { error: "rate_limited", retry_after: 60 }
GET   /health      → { ok: true }
```

## Rate limit

8 requests per IP per 60 seconds. Resets via KV TTL.
Adjust in `src/index.js` (`RL_LIMIT_PER_MIN`).

## Cost

Claude Haiku 4.5 pricing: ~$1/million input tokens, ~$5/million output.
A typical chat turn is ~500 input + ~150 output tokens. So roughly
**$0.001 per chat turn**. 1,000 conversations = $1.

Cloudflare Workers free tier: 100k requests/day. KV: 1k writes/day.
You will not hit either limit organically.
