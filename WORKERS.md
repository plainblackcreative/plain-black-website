# Worker inventory — plain-black-website

The site's dynamic bits are Cloudflare **Workers**. **Their source is NOT in this repo.**
The `worker/*/src/` dirs you see here are empty scaffolding — ignore them. This file is the
map: which Worker backs what, where its real source lives, and how to deploy/roll it back.

> Not served (excluded in `_config.yml`). Secret **names** only — never paste values.
> KV namespace IDs and account tags live in each Worker's own `wrangler.toml`, not here.
>
> Hosting context: the static site is GitHub Pages, not Cloudflare Pages. See
> [CLAUDE.md](CLAUDE.md) → "Hosting & deploy". Workers are the one genuinely-Cloudflare
> piece — real Cloudflare Workers, deployed manually with `wrangler`.

## Where the source lives

- **`~/GitHub/plainblack-admin/worker-public/<name>/`** — the eight shared Workers below
  (in the private `plainblack-admin` repo). Each has its own `wrangler.toml`, `src/index.js`,
  and `README.md` with one-time setup (KV + secrets).
- **`~/GitHub/pb-forms/`** — the forms Worker, in its own repo.
- **`~/GitHub/plainblack-api-proxy/`** — the LLM API proxy, in its own repo.
- **`~/GitHub/plainblack-admin/worker/braindump/`** — internal, called by `pb-cms` (not by the public site).

## The Workers

| Worker | Backs | Public endpoint | Source | KV binding | Secrets (names only) |
|---|---|---|---|---|---|
| `pb-forms` | Contact / 404-report forms (`assets/site-bot.js`, contact form) | `pb-forms.jkbrownnz.workers.dev/submit` | `~/GitHub/pb-forms/` | — | `RESEND_API_KEY` |
| `pb-bot` | "Ask PlainBlack" chat widget (`assets/site-bot.js`) | `pb-bot.jkbrownnz.workers.dev` | `plainblack-admin/worker-public/bot/` | `BOT_KV` | `ANTHROPIC_API_KEY`, `MODEL` |
| `pb-leaderboard` | 404-game scoreboard (`404.html`) | `pb-leaderboard.jkbrownnz.workers.dev` | `plainblack-admin/worker-public/leaderboard/` | `LEADERBOARD_KV` | — |
| `pb-briefs` | Brief generator | `pb-briefs.jkbrownnz.workers.dev` | `plainblack-admin/worker-public/briefs/` | `BRIEFS_KV` | `ANTHROPIC_API_KEY`, `MODEL` |
| `pb-filler-score` | Filler-word scanner | `pb-filler-score.jkbrownnz.workers.dev/scan` | `plainblack-admin/worker-public/filler-score/` | `FILLER_KV` | `ANTHROPIC_API_KEY`, `MODEL` |
| `pb-microsuite` | Microsuite tools (`/book /bouncer /exit /next /today /trust`) | `pb-microsuite.jkbrownnz.workers.dev` | `plainblack-admin/worker-public/microsuite/` | `MICRO_KV` | `ANTHROPIC_API_KEY`, `MODEL` |
| `pb-triage` | Site triage tool | `pb-triage.jkbrownnz.workers.dev` | `plainblack-admin/worker-public/triage/` | `TRIAGE_KV` | `ANTHROPIC_API_KEY`, `MODEL`, `PAGESPEED_API_KEY` |
| `plainblack-api-proxy` | Shared LLM proxy (rate-limited) | `plainblack-api-proxy.jkbrownnz.workers.dev` | `~/GitHub/plainblack-api-proxy/` | `RATE_LIMITER` (rate-limit binding) | `ANTHROPIC_API_KEY`, `OPENAI_API_KEY` |
| `pb-analytics` | Analytics read (admin-facing) | `pb-analytics.jkbrownnz.workers.dev` | `plainblack-admin/worker-public/analytics/` | — | `CF_API_TOKEN` |
| `pb-cms` | Admin CMS API (gated) | route: `admin.plainblackcreative.com/cms-api/*` | `plainblack-admin/worker-public/cms/` | — | `CMS_SHARED_TOKEN`, `BRAINDUMP_TOKEN` |
| `pb-braindump` | Internal store for `pb-cms` (not called by public site) | `pb-braindump.jkbrownnz.workers.dev` | `plainblack-admin/worker/braindump/` | — | — |

The public marketing site calls: `pb-forms`, `pb-bot`, `pb-leaderboard`, `pb-briefs`,
`pb-filler-score`, `pb-microsuite`, `pb-triage`, `plainblack-api-proxy`. `pb-analytics`
and `pb-cms` are admin-facing; `pb-braindump` is internal.

## Deploy / logs / rollback

All Workers deploy the same way — from their own source dir, manual `wrangler` (no CI):

```bash
cd <source dir>          # e.g. ~/GitHub/plainblack-admin/worker-public/bot
npx wrangler deploy       # deploy current source
npx wrangler tail         # live logs
npx wrangler deployments list   # see recent deploys + IDs
npx wrangler rollback [<deployment-id>]   # roll back to a previous deploy
```

Secrets are set per-Worker with `npx wrangler secret put <NAME>` (interactive prompt —
never in a file, never in chat). Each Worker's own `README.md` in `plainblack-admin` has
the exact KV-namespace + secret bootstrap for a fresh account.
