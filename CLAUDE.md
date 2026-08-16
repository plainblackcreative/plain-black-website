# CLAUDE.md — plain-black-website

Project conventions and standing instructions for Claude when working in this repo.

## Brand rules — read these first

All visual, typographic, and copy decisions in this repo are governed by the **PlainBlack Repo System Prompt**.

> The brand docs live in the private `plainblack-admin` repo, checked out as a sibling folder alongside this one. The repo system prompt is `docs/REPO_SYSTEM_PROMPT.md` inside it. Read it before designing anything customer-facing, rather than stopping to ask Jay for it.

Key non-negotiables:

- Never use the word **Creative** under the PlainBlack logo in client-facing outputs.
- Dark, cinematic, minimalist — no SaaS UI, no white rounded cards.
- Green is an accent, not a main colour.
- Voice is direct, human, honest, slightly rebellious. Make readers feel seen, not stupid.
- The site fights for the underdog.

Run the **Design Self-Check** (last section of the prompt) before finalising any work.

### Voice & copy

- **Websites are the door, not the offer.** Websites, logos and glow-ups are the way in; the offer is the full stack, broken down so an overwhelmed owner gets it. Never headline one narrow offering. (A services page led with Website Glow-Up once and was reverted the same night.)
- **"Approve every invoice" is the canonical pricing line.** Reach for it before inventing a metaphor for pricing, billing or commitment: a retainer means invoices just appear and you sign; here, every invoice is a decision the client made. Prefer invoice > spend > bill. Never "cheque".
- **CTAs name a lived moment, not an abstract pain.** The cursor blinking after "Hi Sarah, thanks for your email" is the moment. "It's 11pm and you still haven't published", "save time", "be more productive" all fail.
- **Never write "PB" where a customer can read it.** Copy, buttons, social, OG titles: "PlainBlack", or rephrase it away. Plumbing keeps `pb`: class names, filenames, commits, internal docs.
- **Keep every apostrophe.** I'm, let's, isn't, don't. Never drop them for casual texture; it reads as a mistake, not a style.
- **Name a risk once, then stop.** One line, no "Mitigation:", no defensive paragraphs. Jay turns concerns into creative moves himself. Exceptions: legal, safety, PII, irreversible publishing, money.

## Related docs

All brand and ops docs live in the private `plainblack-admin` repo, checked out as a sibling folder alongside this one: the build spec, the master brief, the brand-voice guide, and the blog-gen handoff.

## Build craft (tools, pages, motion)

- **Interactive tools must feel like toys, not forms.** Animated meters, multi-state toggles, conditional questions that visibly move scope, micro-rewards. Less copy, more state, more motion; the tool is the hero, not the header above it. Reading as a checkout, quote-builder or calculator is a fail state. Audience is small business owners: plain English, expand jargon on tap.
- **Inline SVG icons, never emoji.** Emoji render inconsistently, align badly, and ignore brand colour. Lucide-style stroke icons inherit `currentColor`.
- **Looping animations need a rest before restarting.** Last trigger to next cycle's first must be visibly longer than the in-cycle gaps, or it reads twitchy.
- **Don't fix a hero focal point with `background-position`.** Wide bands (~5:1) under `cover` have no percentage that frames the subject on both desktop and mobile. Failed on Bradley Roofing, then Recharge Physio. Ask Jay for a source cropped to the band ratio up front; if you ship a percentage anyway, say it's a band-aid.
- **Never reuse admin scoring colours or labels on a customer-facing card.** An uncoded tier dot on a screenshot-able card reads as a cruel near-miss scorecard, or as decoration pretending to be data. Decorative, relabelled, or cut.

## Front-end gotchas (every one has bitten)

- **Root-absolute URLs inside CSS custom properties.** A relative `url()` in a custom property resolves against the stylesheet consuming the `var()`, not the document, so it 404s under `/assets/css/`. Write `url('/assets/...')`. Direct inline `background-image` is fine relative.
- **iOS Safari ignores `.volume` on audio.** Silent no-op; desktop honours it, so it misdiagnoses easily. Never answer "still too loud on mobile" by lowering it again. Diagnose first, then offer Web Audio GainNode, a quieter re-encode, or removal.
- **Bespoke pages need tokens and a dark body.** No `assets/style.css` means no `var(--fs-*)`, so tokens silently collapse to 16px; confirm the link before tokenising, else hardcode the `clamp()`. And style.css sets `body{background:var(--white)}` ([`assets/style.css:75`](assets/style.css)), so dark pages must set their own `body` background or flash white. Verify computed values in the preview.

## Canonical chrome (header, mobile nav, footer)

Every public page on the site must carry the same header / mobile nav / footer. The footer canonical lives in [`partials/footer.html`](partials/footer.html) — edit it there, never per-page.

**When creating a new top-level page:**

1. Drop a placeholder `<footer class="site-footer"></footer>` (empty is fine — the repair script fills it). If you copied an existing page, you already have one.
2. Add the path to `ALLOW_LIST` in `scripts/lint-site-chrome.js`. If the page is intentionally custom in some way, add the labels it's allowed to drop to the `EXEMPTIONS` map with a comment explaining why.

That's it. The pre-push hook runs `repair:footer` → `sync-tracking` → `lint:chrome` on every push. If repair rewrites a footer (or sync-tracking regenerates the manifest), the hook aborts and tells you to commit the regenerated files. Header / mobile-nav drift on top-level pages still has to be fixed by hand — no template for those yet, extend the pattern if the pain shows up.

Manual escape hatches: `npm run repair:footer` and `npm run lint:chrome` are both fine to run on demand.

`partials/` is for build-time templates only — it is not served. Add it to `.gitignore` only if it ever holds untracked outputs.

## Git & editing hygiene

- **One session at a time in this checkout.** **Never create a worktree.** Jay is the only person who works on this repo, so a worktree buys nothing and leaves folders and detached-HEAD branches behind that he then has to clean up. If you find one, confirm it holds nothing unmerged, then remove it. The reason to keep it to one session is that two sessions in one tree share `.git/HEAD` and will check branches out from under each other; the fix is to wait, not to branch off a second tree. Confirm `git branch --show-current` before every commit; stage by explicit path, never `git add -A`. Files you never touched in `git status` = stop.
- **Parse-check JS after any bulk regex edit.** Tools here are single-file HTML with inline `<script>`, and regex can't tell prose from code (restoring apostrophes once turned `'Heck yes, lets talk.'` into a syntax error and blanked the page). Slice the script block through `new Function(...)` afterwards.

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
  dirs here are empty scaffolding — real source is in `plainblack-admin/worker-public/`
  plus the `pb-forms` and `plainblack-api-proxy` repos). Full map — every Worker, endpoint,
  source path, KV binding, and secret name — is in [`WORKERS.md`](WORKERS.md).

Evidence (captured 2026-07-12): apex → `185.199.108–111.153` (GitHub Pages); live
responses carry GitHub Pages' Fastly headers (`via: 1.1 varnish`, `x-github-request-id`,
`x-served-by: cache-akl…`); `gh api …/pages` reports `build_type: legacy`,
`source: main /`.

### Nothing internal gets served

- **New files are exposed by default.** Anything not in `_config.yml`'s `exclude:` is served at the customer domain. Before adding an internal/dev/scratch file, ask if a customer should be able to open it; if not, exclude it per-file and verify a real 404 (browser UA, after Pages rebuilds).
- **Exclusion is not privacy.** The repo is public, so every tracked file stays readable on github.com regardless. `exclude:` only keeps it off the customer domain. Genuinely private material belongs in the private admin repo.
