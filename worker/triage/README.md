# PlainBlack triage worker — `pb-triage`

Cloudflare Worker that powers the **Why Isn't This Working?** triage tool.

Backs the diagnosis on `/30day-challenge-builds/why-isnt-this-working/result.html`.
Holds the Anthropic API key as a Worker secret (never exposed to the browser).
Browser POSTs the structured diagnostic payload, worker returns a structured JSON diagnosis.

Pattern is intentionally identical to `worker/bot/` so the deploy + security
posture matches.

---

## One-time deploy

```bash
cd worker/triage
npm install

# 1. KV namespace for per-IP rate limiting
npx wrangler kv namespace create TRIAGE_KV
#   → copy the printed `id` into wrangler.toml (replace REPLACE_WITH_KV_ID)

# 2. Anthropic API key (set as a secret, never in the repo)
#    Reuse the same key as pb-bot if you like.
npx wrangler secret put ANTHROPIC_API_KEY
#   → paste your key when prompted (starts with sk-ant-...)

# 3. (Optional but recommended) Google PageSpeed Insights API key
#    Without a key, PSI calls work but share a low IP rate limit.
#    With a key, you get 25,000 requests/day per project, plenty for this tool.
#    Get one at: https://developers.google.com/speed/docs/insights/v5/get-started
npx wrangler secret put PAGESPEED_API_KEY
#   → paste your key when prompted

# 4. Deploy
npx wrangler deploy
#   → returns https://pb-triage.<your-subdomain>.workers.dev
```

## Wire the frontend

The Worker URL is hardcoded in the result page:
`30day-challenge-builds/why-isnt-this-working/result.html`

Look for the `TRIAGE_URL` constant near the top of the inline script. Default:

```js
const TRIAGE_URL = 'https://pb-triage.jkbrownnz.workers.dev';
```

Update if your subdomain isn't `jkbrownnz`.

## Endpoints

```
POST /          → body: { channel, outcomes[], sources[], tried[], freeform }
                  returns: full diagnosis JSON (see contract below)
GET  /health    → { ok: true }
```

## Payload contract (request)

```json
{
  "channel":  "website | ads | video | social | ai | content | seo | gbp | email | other",
  "outcomes": ["nothing-changed", "looks-good-no-enquiries", "views-no-action", ...],
  "sources":  ["agency", "freelancer", "tool", "diy", "in-house", "organic"],
  "tried":    ["spent-more", "changed-messaging", "different-platform", ...],
  "freeform": "Optional free text, max 1500 chars",
  "scanUrl":  "Optional https URL to scan with Lighthouse + page read"
}
```

`channel` + at least one `outcomes` entry is required. Sources, tried,
freeform and scanUrl are optional.

## Phase 1 scanning (`scanUrl`)

If `scanUrl` is provided, the worker runs in parallel:

1. **PageSpeed Insights API** (Lighthouse mobile audit) — returns scores
   for performance, accessibility, SEO and best-practices, plus core
   metrics (LCP, CLS, FCP, TBT) and top fix opportunities.
2. **Direct HTML fetch + scrape** (8s timeout, 1.5MB cap) — extracts
   title, meta description, H1 count + first H1, word count, form
   presence, mobile viewport meta, detected CTAs, and installed tracking
   pixels (GA, GTM, Meta Pixel, Hotjar, Clarity, LinkedIn).

Both findings are summarised into a concise prompt block labelled
`SCAN — <url>` and folded into the user message Claude sees. The
system prompt instructs Claude to cite real numbers from the scan
where they sharpen the diagnosis.

The full scan report is echoed back in the response as `data.scan`
so the frontend can display "Scanned: yourdomain.com" provenance.

If either subscan fails, the diagnosis still proceeds with whatever
data was retrieved (or no scan data at all). The diagnosis never
blocks on the scan.

## Response contract (200)

```json
{
  "diagnosisHeadline": "You bought execution before clarity.",
  "diagnosisBody": "1-2 sentence diagnosis...",
  "whatsHappening": ["bullet 1", "bullet 2", ...],
  "whyItFeelsBroken": ["bullet 1", "bullet 2", ...],
  "whatToDoNext": ["action 1", "action 2", ...],
  "badAdvice": "Single line of lazy default advice...",
  "dontBuyNext": ["more content", "more ads", "another redesign"],
  "dontBuyNextWhy": "Why more of the same doesn't help...",
  "nextMove": "Concrete first action they can take in 48h...",
  "plainBlackWouldBuild": "What PB would build...",
  "confidence": "low | medium | high",
  "tags": ["clarity", "offer-market-fit", ...]
}
```

## Errors

| Status | `error`               | Meaning |
|--------|------------------------|---------|
| 400    | `invalid_json`         | Body wasn't valid JSON |
| 400    | `invalid_channel`      | Missing or unknown channel |
| 400    | `missing_outcomes`     | No outcomes selected |
| 429    | `rate_limited`         | IP exceeded 10/hour, includes `retry_after` |
| 500    | `server_misconfigured` | `ANTHROPIC_API_KEY` not set |
| 502    | `upstream_error`       | Anthropic API returned non-2xx |
| 502    | `parse_failed`         | Model returned unparseable JSON |
| 502    | `fetch_failed`         | Network error to Anthropic |

## Settings

- **Model:** `claude-haiku-4-5` (override with `MODEL` var in wrangler.toml)
- **Max tokens:** 1400
- **Per-IP rate limit:** 10 calls / hour, KV-backed
- **CORS:** allowlist from `ALLOWED_ORIGINS` var

## Tail logs

```bash
npx wrangler tail
```
