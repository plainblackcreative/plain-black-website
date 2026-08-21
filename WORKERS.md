# Worker inventory — plain-black-website

The site's dynamic bits are Cloudflare **Workers**. **Their source is NOT in this repo.**
This file is the map: which Worker backs what, where its real source lives, and how to
deploy or roll it back.

There used to be a `worker/` tree here full of empty `*/src/` dirs, left behind when
`476e255` moved the real source out on 2026-06-14. Git does not track empty directories, so
they survived the deletion and sat on one machine looking like source. Removed 2026-08-22.

> Not served (excluded in `_config.yml`). Secret **names** only — never paste values.
> KV namespace IDs and account tags live in each Worker's own `wrangler.toml`, not here.
>
> Hosting context: the static site is GitHub Pages, not Cloudflare Pages. See
> [CLAUDE.md](CLAUDE.md) → "Hosting & deploy". Workers are the one genuinely-Cloudflare
> piece — real Cloudflare Workers, deployed manually with `wrangler`.

## Where the source lives

- **`~/Studio/plainblack/admin/worker-public/<name>/`** — the eight shared Workers below
  (in the private `plainblack-admin` repo). Each has its own `wrangler.toml`, `src/index.js`,
  and `README.md` with one-time setup (KV + secrets).
- **`~/Studio/platform/pb-forms/`** — the forms Worker, in its own repo.
- **`~/Studio/platform/pb-api-proxy/`** — the LLM API proxy, in its own repo.
- **`~/Studio/plainblack/admin/worker/braindump/`** — internal, called by `pb-cms` (not by the public site).

## The Workers

| Worker | Backs | Public endpoint | Source | KV binding | Secrets (names only) |
|---|---|---|---|---|---|
| `pb-forms` | Contact / 404-report forms (contact form, `404.html`) | `pb-forms.jkbrownnz.workers.dev/submit` | `~/Studio/platform/pb-forms/` | — | `RESEND_API_KEY` |
| `pb-leaderboard` | 404-game scoreboard (`404.html`) | `pb-leaderboard.jkbrownnz.workers.dev` | `plainblack-admin/worker-public/leaderboard/` | `LEADERBOARD_KV` | — |
| `pb-briefs` | Brief generator | `pb-briefs.jkbrownnz.workers.dev` | `plainblack-admin/worker-public/briefs/` | `BRIEFS_KV` | `ANTHROPIC_API_KEY`, `MODEL` |
| `pb-filler-score` | Filler-word scanner | `pb-filler-score.jkbrownnz.workers.dev/scan` | `plainblack-admin/worker-public/filler-score/` | `FILLER_KV` | `ANTHROPIC_API_KEY`, `MODEL` |
| `pb-microsuite` | Microsuite tools (`/book /bouncer /exit /next /today /trust`) | `pb-microsuite.jkbrownnz.workers.dev` | `plainblack-admin/worker-public/microsuite/` | `MICRO_KV` | `ANTHROPIC_API_KEY`, `MODEL` |
| `pb-triage` | Site triage tool | `pb-triage.jkbrownnz.workers.dev` | `plainblack-admin/worker-public/triage/` | `TRIAGE_KV` | `ANTHROPIC_API_KEY`, `MODEL`, `PAGESPEED_API_KEY` |
| `plainblack-api-proxy` | Shared LLM proxy (rate-limited) | `plainblack-api-proxy.jkbrownnz.workers.dev` | `~/Studio/platform/pb-api-proxy/` | `RATE_LIMITER` (rate-limit binding) | `ANTHROPIC_API_KEY`, `OPENAI_API_KEY` |
| `pb-analytics` | Analytics read (admin-facing) | `pb-analytics.jkbrownnz.workers.dev` | `plainblack-admin/worker-public/analytics/` | — | `CF_API_TOKEN` |
| `pb-cms` | Admin CMS API (gated) | route: `admin.plainblackcreative.com/cms-api/*` | `plainblack-admin/worker-public/cms/` | — | `CMS_SHARED_TOKEN`, `BRAINDUMP_TOKEN` |
| `pb-braindump` | Internal store for `pb-cms` (not called by public site) | `pb-braindump.jkbrownnz.workers.dev` | `plainblack-admin/worker/braindump/` | — | — |
| `pb-geo-block` | **Nothing. Parked, unrouted 2026-07-15.** See "Parked" below | no route | `plainblack-admin/worker-public/geo-block/` | none | none |
| `pb-arcade` | Unknown. Routed but undocumented, source not recovered yet | route: `admin.plainblackcreative.com/arcade*` | **not on disk** | ? | ? |

The public marketing site calls: `pb-forms`, `pb-leaderboard`, `pb-briefs`,
`pb-filler-score`, `pb-microsuite`, `pb-triage`, `plainblack-api-proxy`. `pb-analytics`
and `pb-cms` are admin-facing; `pb-braindump` is internal.

The `pb-bot` chat widget was removed from the site on 2026-07-15 and the Worker deleted.
Its source is still in `plainblack-admin/worker-public/bot/` and its history is in this
repo at `assets/site-bot.js`. Do not re-add it without asking Jay: it was removed because
its hardcoded system prompt drifted from the site and sold a killed product.

## Parked: `pb-geo-block`

**Deployed but not routed. It receives no traffic. Leave it that way.**

It allowed only NZ + AU (by `request.cf.country`) plus 9 named crawlers (by user-agent
substring), and served every other visitor a branded 403 page. It was routed to
`www.plainblackcreative.com/*` from **2024-06-24 until 2026-07-15**, silently blocking
every overseas visitor, Google's own `Google-InspectionTool`, PageSpeed/Lighthouse,
Ahrefs, and Slack/WhatsApp link previews. Real Googlebot indexing was never affected.

It hid for three weeks because **it cannot be reproduced from a New Zealand machine**:
NZ is allowlisted, so a local `curl` returns 200 no matter what user-agent you spoof.
It was found by listing the zone's Worker routes, and confirmed by probing from 12
overseas hosts (all 12 returned 403). Route removed 2026-07-15 on Jay's call; verified
by re-probing (13 of 13 overseas hosts then returned 200).

Source is recovered into `plainblack-admin/worker-public/geo-block/`, whose
`wrangler.toml` deliberately has **no `[[routes]]` block**, so `wrangler deploy` cannot
silently re-block the site. Read that README before ever re-routing it.

**Lesson worth keeping:** a Worker route is invisible to every test you can run from
home if the rule allowlists home. Check routes, not responses:
`curl -H "Authorization: Bearer $TOKEN" .../zones/<zone_id>/workers/routes`.

## Undocumented: `pb-arcade`

Routed to `admin.plainblackcreative.com/arcade*` and live, but its source is **not on
disk anywhere** and it is not otherwise documented. Admin-facing, so lower stakes than
`pb-geo-block` was. Recover the source (`workers_get_worker_code` or the
`/accounts/<id>/workers/scripts/pb-arcade` API), commit it next to the others, and fill
in its row above.

## Deploy / logs / rollback

All Workers deploy the same way — from their own source dir, manual `wrangler` (no CI):

```bash
cd <source dir>          # e.g. ~/Studio/plainblack/admin/worker-public/bot
npx wrangler deploy       # deploy current source
npx wrangler tail         # live logs
npx wrangler deployments list   # see recent deploys + IDs
npx wrangler rollback [<deployment-id>]   # roll back to a previous deploy
```

Secrets are set per-Worker with `npx wrangler secret put <NAME>` (interactive prompt —
never in a file, never in chat). Each Worker's own `README.md` in `plainblack-admin` has
the exact KV-namespace + secret bootstrap for a fresh account.
