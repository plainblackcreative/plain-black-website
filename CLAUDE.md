# CLAUDE.md — plain-black-website

Project conventions and standing instructions for Claude when working in this repo.

## Brand rules — read these first

All visual, typographic, and copy decisions in this repo are governed by the **PlainBlack Repo System Prompt**.

> The brand docs live in PlainBlack's private admin repo (ask Jay for access). Find the repo system prompt there before designing anything customer-facing.

Key non-negotiables:

- Never use the word **Creative** under the PlainBlack logo in client-facing outputs.
- Dark, cinematic, minimalist — no SaaS UI, no white rounded cards.
- Green is an accent, not a main colour.
- Voice is direct, human, honest, slightly rebellious. Make readers feel seen, not stupid.
- The site fights for the underdog.

Run the **Design Self-Check** (last section of the prompt) before finalising any work.

## Related docs

All brand and ops docs live in PlainBlack's private admin repo (ask Jay for access): the build spec, the master brief, the brand-voice guide, and the blog-gen handoff.

## Canonical chrome (header, mobile nav, footer)

Every public page on the site must carry the same header / mobile nav / footer. The footer canonical lives in [`partials/footer.html`](partials/footer.html) — edit it there, never per-page.

**When creating a new top-level page:**

1. Drop a placeholder `<footer class="site-footer"></footer>` (empty is fine — the repair script fills it). If you copied an existing page, you already have one.
2. Add the path to `ALLOW_LIST` in `scripts/lint-site-chrome.js`. If the page is intentionally custom in some way, add the labels it's allowed to drop to the `EXEMPTIONS` map with a comment explaining why.

That's it. The pre-push hook runs `repair:footer` → `sync-tracking` → `lint:chrome` on every push. If repair rewrites a footer (or sync-tracking regenerates the manifest), the hook aborts and tells you to commit the regenerated files. Header / mobile-nav drift on top-level pages still has to be fixed by hand — no template for those yet, extend the pattern if the pain shows up.

Manual escape hatches: `npm run repair:footer` and `npm run lint:chrome` are both fine to run on demand.

`partials/` is for build-time templates only — it is not served. Add it to `.gitignore` only if it ever holds untracked outputs.

## Hosting & deploy — the one true answer (STOP assuming Cloudflare Pages)

**This site is hosted by GitHub Pages, not Cloudflare Pages.** Every session that has
assumed Cloudflare Pages has been wrong, and older copy in this repo said so — it was
never true. Do not "correct" this back to Cloudflare Pages.

The confusion is understandable: three signals scream "Cloudflare" while the real host
is GitHub. Don't be fooled by any of them:
- the `server: cloudflare` response header,
- `www` resolving to Cloudflare IPs (`104.21.x` / `172.67.x`),
- old docs that literally said "Cloudflare Pages auto-deploys from main".

What is actually true:

- **Build & serve:** GitHub Pages, **legacy Jekyll build**, from the `main` branch, path
  `/`. Build config is [`_config.yml`](_config.yml). Push to `main` ⇒ GitHub Pages
  rebuilds ⇒ live. **There is no Cloudflare Pages project.** There is no build step you
  run locally; Jekyll runs on GitHub's side.
- **DNS:** `www` (the canonical host — see [`CNAME`](CNAME)) is a CNAME to
  `plainblackcreative.github.io`, **proxied** through Cloudflare (orange cloud → resolves
  to Cloudflare IPs). The apex `plainblackcreative.com` is **DNS-only**, pointing straight
  at GitHub Pages' anycast IPs (`185.199.108–111.153`).
- **Cloudflare's only jobs here:** DNS, the CDN/cache proxy on `www`, and edge SSL. It
  does **not** deploy the site.
- **Check deploy status via GitHub, not Cloudflare:**
  `gh api repos/plainblackcreative/plain-black-website/pages/builds/latest`.
- **Cloudflare Workers are a separate thing and ARE real** — the forms/bot/leaderboard/etc.
  are Cloudflare *Workers* deployed manually with `wrangler`. That's genuine Cloudflare,
  but it's Workers, not Pages, and their source is **not** in this repo (the `worker/`
  dirs here are empty scaffolding). A proper Worker inventory is a separate TODO.

Evidence (captured 2026-07-12): apex → `185.199.108–111.153` (GitHub Pages); live
responses carry GitHub Pages' Fastly headers (`via: 1.1 varnish`, `x-github-request-id`,
`x-served-by: cache-akl…`); `gh api …/pages` reports `build_type: legacy`,
`source: main /`.
