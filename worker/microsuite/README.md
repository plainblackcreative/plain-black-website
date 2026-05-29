# pb-microsuite

Single Cloudflare Worker backing the Days 22-27 micro-tools on the PlainBlack
30-Day Build Challenge. Six small endpoints, one shared Anthropic key, one
KV-backed per-IP rate limiter.

## Endpoints

| Endpoint   | Day | Tool                       |
|------------|-----|----------------------------|
| `POST /today`   | 22 | The Do This Today Card     |
| `POST /exit`    | 23 | The Polite Exit Generator  |
| `POST /bouncer` | 24 | The Contact Form Bouncer   |
| `POST /next`    | 25 | What Happens Next Page     |
| `POST /book`    | 26 | Before You Hit Book        |
| `POST /trust`   | 27 | Local Trust Builder Page   |
| `GET  /health`  | —  | `{ ok: true }`             |

Each tool POSTs its own JSON shape and gets back a structured JSON response
specific to that tool. See `src/index.js` for prompts + schemas.

## Limits

- 60 successful calls per IP per hour (rolling). Endpoint-agnostic — burning
  the limit on `/today` also throttles `/exit`. Keeps abuse-control simple.
- 4000-char total input cap per request (across all inputs combined).
- 8s Anthropic call timeout per request.

## Deploy

```bash
npx wrangler kv namespace create MICRO_KV
# Paste returned id into wrangler.toml's [[kv_namespaces]] id
npx wrangler secret put ANTHROPIC_API_KEY
npx wrangler deploy
```

## Adding a new endpoint

1. Add a new entry to the `TOOLS` map in `src/index.js` with `system`,
   `schemaHint` (for response validation), and a `userMessage(body)` function
   that turns the request body into the user message to send.
2. Add the route in the `fetch` handler.
3. Deploy.
