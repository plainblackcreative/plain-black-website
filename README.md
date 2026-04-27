# PlainBlack Website

Marketing site for PlainBlack Creative — branding + AI playbooks for small businesses in Australia and New Zealand.

Lives at **[www.plainblackcreative.com](https://www.plainblackcreative.com)**.
Internal admin lives at **[admin.plainblackcreative.com](https://admin.plainblackcreative.com)**.

---

## Architecture map

The site is a static HTML / CSS / vanilla-JS site (no build step) deployed via Cloudflare Pages. Dynamic features (chat bot, scratchpad, leaderboard) are backed by small Cloudflare Workers, each holding their own secrets in Cloudflare and never in the repo.

```
www.plainblackcreative.com  ──┐
admin.plainblackcreative.com ─┼─▶  Cloudflare Pages (this repo, main branch, auto-deploys)
                              │
404 game leaderboard ─────────┼─▶  pb-leaderboard Worker  ─▶ Workers KV
PlainBlack chat bot ──────────┼─▶  pb-bot         Worker  ─▶ Anthropic API (Claude Haiku)
Hub scratchpad      ──────────┴─▶  pb-scratchpad  Worker  ─▶ Workers KV
                                   ↳ all bound to jkbrownnz.workers.dev
```

Each Worker has its own subdir under `worker/` with `wrangler.toml`, `src/index.js`, and a `README.md` of deploy steps.

| Path | Purpose | Auth model |
|---|---|---|
| `worker/scratchpad/` | Hub scratchpad notes (read+write KV) | Bearer token (per-device, in localStorage) |
| `worker/leaderboard/` | 404-game scoreboard | Public read, public write rate-limited per-IP |
| `worker/bot/` | "Ask PlainBlack" chat widget proxy → Anthropic API | Public POST rate-limited per-IP, ANTHROPIC_API_KEY held server-side |

---

## Page inventory

### Public site (dark cinematic)

- `index.html` — home (hero + dual-landing tabs + services + journey + portfolio + testimonials + FAQ)
- `services.html`, `playbooks.html`, `work.html`, `about.html`, `blog.html`, `contact.html`, `givesback.html`
- `givesback/cases/*.html` — five standalone cause landing pages (shareable URLs with their own OG meta)
- `blog/*.html` — 44 blog posts (regenerated from `docs/blog-library.json` via `admin/blog-gen.html`)
- `playbooks/ready/*/` — 6 playbook landers (each self-contained)
- `404.html` — branded 404 with the bad-ideas game (leaderboard backed by Worker)

### Admin (gated)

- `admin/index.html` — the **Hub**. Project tile registry, scratchpad, "today" panel, sticky push-to-GitHub button. Re-skinned in PlainBlack mint+Playfair. Gated by password + GitHub PAT (both held in localStorage on each device). Shift-click the scratchpad header to re-prompt for Worker URL + token.
- `admin/blog-gen.html` — blog post generator (writes to `docs/blog-library.json`, regenerates `blog.html` cards)
- `admin/generator.html` — landing-page generator
- `admin/INTAKE_TO_GENERATOR.html` — intake form glue

### Shared assets

- `assets/style.css` — global styles (color tokens, button system, mobile nav drawer, footer seam, parallax + grain rules)
- `assets/site-header.js` — sticky-header scroll behaviour, hero-bleed detection, mobile-nav drawer wiring
- `assets/site-bot.js` — self-injecting "Ask PlainBlack" chat widget. Calls the `pb-bot` Worker; falls back to a static keyword KB on outage / rate-limit
- `assets/plainblack_asset_pack/` — moody product photography (founder-desk, mess-to-control, underdog-toolkit, section-background) used as section bgs across the site
- `assets/Light_logo.png` — kept as a fallback / OG image only. Visible logo is now CSS-rendered text + pulsing mint dot via `.logo-mark`

---

## Local preview

Static-only, custom Node server in `.claude/preview-server.js` (gitignored). Resolves `/foo` → `foo.html` so Jekyll-style pretty URLs work.

```bash
node .claude/preview-server.js
# → http://localhost:8765
```

(Or use any static server. The site has no build step.)

---

## Deploy flow

- **Site** — Cloudflare Pages auto-deploys from `main`. No CI script. Push to `main` ⇒ live.
- **Workers** — manual `cd worker/<name> && npx wrangler deploy`. Each worker dir has a README of one-time setup (KV namespace + secrets) and ongoing deploy.

### Branch protection (recommended, not yet enabled)

History on this repo so far has been mostly `git push origin main` direct. Once you've stabilised, enable branch protection on `main`:

1. GitHub → Settings → Branches → Add rule for `main`
2. Require pull request before merging
3. Require status checks (none currently configured, but reserves the slot for later)
4. Restrict who can push directly

Then work on `claude/*` or `feat/*` branches and merge via PR.

---

## Common tasks

| Want to … | Where |
|---|---|
| Add a blog post | `admin/blog-gen.html` (UI) → push commit |
| Fix a typo on the home page | `index.html`, push, Pages auto-deploys |
| Change the bot's tone/facts | `worker/bot/src/index.js` (system prompt at top), `cd worker/bot && npx wrangler deploy` |
| Rotate the scratchpad token | `cd worker/scratchpad && npx wrangler secret put SCRATCHPAD_TOKEN`, then shift-click the hub scratchpad header to re-paste on each device |
| See chat-bot logs | `cd worker/bot && npx wrangler tail` |
| Bump the leaderboard rate limit | `worker/leaderboard/src/index.js`, change `RL_TTL_SECONDS`, deploy |
| Update an asset-pack image | replace under `assets/plainblack_asset_pack/website/`, name + dimensions must match |

---

## Things to know

- **Brand fonts**: only Playfair Display + Figtree (+ DM Mono for code/system labels in the hub). No Bebas Neue.
- **Brand colour**: mint `#3ecf8e`. Token name is `--mint`.
- **Dark cinematic style**: every section across every public page uses the asset-pack image with a mint-tinted dark gradient overlay. Parallax via `background-attachment: fixed` (desktop only, off for `prefers-reduced-motion`). SVG noise grain overlays the heroes.
- **Pulsing mint dot**: the `.pulse-dot` and `.logo-mark__dot` patterns are the recurring brand motif. Every page logo, the bot's "live" indicator, the GivesBack hero badge, the blog "Featured Post" tag, and the period after "underdog." on the home hero all pulse on the same mint cadence.
- **Mobile nav**: slide-in drawer with backdrop blur (≤ 768px). Hamburger animates to X. Body scroll locks. Wired in `assets/site-header.js`.
