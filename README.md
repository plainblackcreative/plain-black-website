# PlainBlack Website

Marketing site for PlainBlack Creative — branding + AI playbooks for small businesses in Australia and New Zealand.

Lives at **[www.plainblackcreative.com](https://www.plainblackcreative.com)**.
Internal admin lives at **[admin.plainblackcreative.com](https://admin.plainblackcreative.com)**.

---

## Architecture map

The site is a static HTML / CSS / vanilla-JS site **hosted on GitHub Pages** (legacy Jekyll build from `main`, config in [`_config.yml`](_config.yml)). **It is not Cloudflare Pages** — Cloudflare only sits in front of `www` as a DNS/CDN proxy. See [CLAUDE.md](CLAUDE.md) → "Hosting & deploy" for the full, evidence-backed breakdown and why past sessions kept getting this wrong. Dynamic features (leaderboard, forms, tools) are backed by small Cloudflare *Workers* (a separate service from Pages), each holding their own secrets in Cloudflare and never in the repo.

```
www.plainblackcreative.com  ──┐   (www: CNAME → *.github.io, proxied by Cloudflare)
admin.plainblackcreative.com ─┼─▶  GitHub Pages (this repo, main branch, Jekyll, auto-builds)
                              │   (apex: DNS-only → GitHub Pages 185.199.108–111.153)
404 game leaderboard ─────────┴─▶  pb-leaderboard Worker  ─▶ Workers KV
                                   ↳ all bound to jkbrownnz.workers.dev
```

**Worker source is NOT in this repo.** The `worker/*/src/` dirs here are empty scaffolding
— ignore them. The real source lives in the private `plainblack-admin` repo (under
`worker-public/`) plus the standalone `pb-forms` and `plainblack-api-proxy` repos. The full
map — every Worker, its endpoint, source path, KV bindings, and secret names — is in
[`WORKERS.md`](WORKERS.md).

| Worker | Purpose | Source | Auth model |
|---|---|---|---|
| `pb-leaderboard` | 404-game scoreboard | `plainblack-admin/worker-public/leaderboard/` | Public read, public write rate-limited per-IP |
| … | (8 more) | see [`WORKERS.md`](WORKERS.md) | |

---

## Page inventory

### Public site (dark cinematic)

- `index.html` — home (hero + dual-landing tabs + services + journey + portfolio + testimonials + FAQ)
- `services.html`, `playbooks.html`, `work.html`, `about.html`, `blog.html`, `contact.html`, `givesback.html`
- `givesback/cases/*.html` — five standalone cause landing pages (shareable URLs with their own OG meta)
- `blog/*.html` — 44 blog posts (regenerated from `docs/blog-library.json` via `admin/blog-gen.html`)
- `playbooks/<slug>/index.html` — public playbook lander (clean URL: `/playbooks/<slug>`)
- `playbooks/ready/<slug>/<slug>-TEMPLATE.html` — generator source template (admin-only; `admin/playbook-generator.html` reads via raw.githubusercontent.com)
- `404.html` — branded 404 with the bad-ideas game (leaderboard backed by Worker)

### Admin (gated)

- `admin/index.html` — the **Hub**. Project tile registry, "today" panel, sticky push-to-GitHub button. Re-skinned in PlainBlack mint+Playfair. Gated by password + GitHub PAT (both held in localStorage on each device).
- `admin/blog-gen.html` — blog post generator (writes to `docs/blog-library.json`, regenerates `blog.html` cards)
- `admin/playbook-generator.html` — landing-page generator
- `admin/INTAKE_TO_GENERATOR.html` — intake form glue

### Shared assets

- `assets/style.css` — global styles (color tokens, button system, mobile nav drawer, footer seam, parallax + grain rules)
- `assets/site-header.js` — sticky-header scroll behaviour, hero-bleed detection, mobile-nav drawer wiring
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

- **Site** — **GitHub Pages** builds (Jekyll) and deploys from `main`. No local build step; no CI script. Push to `main` ⇒ GitHub Pages rebuilds ⇒ live. Check status with `gh api repos/plainblackcreative/plain-black-website/pages/builds/latest` (not the Cloudflare dashboard — Cloudflare is only the DNS/CDN proxy).
- **Workers** — source is in other repos, not here (see [`WORKERS.md`](WORKERS.md)). Deploy manually from each Worker's own source dir: `cd <source dir> && npx wrangler deploy`. Each Worker's own README (in `plainblack-admin`) has the one-time KV + secret setup.

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
| Add a new top-level page | Copy chrome from `blog.html`, paste into new page, add to `ALLOW_LIST` in `scripts/lint-site-chrome.js`. CI will refuse the PR otherwise. |
| Fix a typo on the home page | `index.html`, push, Pages auto-deploys |
| Change the bot's tone/facts | `plainblack-admin/worker-public/bot/src/index.js` (system prompt at top), then `cd` there + `npx wrangler deploy` |
| See chat-bot logs | `cd ~/GitHub/plainblack-admin/worker-public/bot && npx wrangler tail` |
| Bump the leaderboard rate limit | `plainblack-admin/worker-public/leaderboard/src/index.js`, change the rate-limit const, deploy |
| Update an asset-pack image | replace under `assets/plainblack_asset_pack/website/`, name + dimensions must match |

---

## Things to know

- **Brand fonts**: only Playfair Display + Figtree (+ DM Mono for code/system labels in the hub). No Bebas Neue.
- **Brand colour**: mint `#3ecf8e`. Token name is `--mint`.
- **Dark cinematic style**: every section across every public page uses the asset-pack image with a mint-tinted dark gradient overlay. Parallax via `background-attachment: fixed` (desktop only, off for `prefers-reduced-motion`). SVG noise grain overlays the heroes.
- **Pulsing mint dot**: the `.pulse-dot` and `.logo-mark__dot` patterns are the recurring brand motif. Every page logo, the bot's "live" indicator, the GivesBack hero badge, the blog "Featured Post" tag, and the period after "underdog." on the home hero all pulse on the same mint cadence.
- **Mobile nav**: slide-in drawer with backdrop blur (≤ 768px). Hamburger animates to X. Body scroll locks. Wired in `assets/site-header.js`.
