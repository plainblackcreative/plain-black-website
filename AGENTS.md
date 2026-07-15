# AGENTS.md — plain-black-website

Project conventions and standing instructions for Codex when working in this repo.

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

### Voice & copy

- **Websites are the door, not the offer.** Websites, logos and glow-ups are the way in; the offer is the full stack, broken down so an overwhelmed owner gets it. Never headline one narrow offering. (A services page led with Website Glow-Up once and was reverted the same night.)
- **"Approve every invoice" is the canonical pricing line.** Reach for it before inventing a metaphor for pricing, billing or commitment: a retainer means invoices just appear and you sign; here, every invoice is a decision the client made. Prefer invoice > spend > bill. Never "cheque".
- **CTAs name a lived moment, not an abstract pain.** The cursor blinking after "Hi Sarah, thanks for your email" is the moment. "It's 11pm and you still haven't published", "save time", "be more productive" all fail.
- **Never write "PB" where a customer can read it.** Copy, buttons, social, OG titles: "PlainBlack", or rephrase it away. Plumbing keeps `pb`: class names, filenames, commits, internal docs.
- **Keep every apostrophe.** I'm, let's, isn't, don't. Never drop them for casual texture; it reads as a mistake, not a style.
- **Name a risk once, then stop.** One line, no "Mitigation:", no defensive paragraphs. Jay turns concerns into creative moves himself. Exceptions: legal, safety, PII, irreversible publishing, money.

## Related docs

All brand and ops docs live in PlainBlack's private admin repo (ask Jay for access): the build spec, the master brief, the brand-voice guide, and the blog-gen handoff.

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

- **One working tree per session.** Sessions get their own worktree under `.claude/worktrees/`; don't work in a shared checkout. Two sessions in one tree share `.git/HEAD` and will check branches out from under each other. Confirm `git branch --show-current` before every commit; stage by explicit path, never `git add -A`. Files you never touched in `git status` = stop.
- **Parse-check JS after any bulk regex edit.** Tools here are single-file HTML with inline `<script>`, and regex can't tell prose from code (restoring apostrophes once turned `'Heck yes, lets talk.'` into a syntax error and blanked the page). Slice the script block through `new Function(...)` afterwards.

## Deployment

**Hosted on GitHub Pages, NOT Cloudflare Pages.** Legacy Jekyll build from the `main`
branch, path `/` (config: `_config.yml`). Push to `main` ⇒ GitHub Pages rebuilds ⇒ live.
Cloudflare only sits in front of `www` as a DNS/CDN proxy (hence the `server: cloudflare`
header and Cloudflare www IPs — don't be fooled, the origin is GitHub Pages). The apex
`plainblackcreative.com` points DNS-only at GitHub Pages' IPs (`185.199.108–111.153`).
Canonical host is `www` (see `CNAME`). Deploy status: `gh api
repos/plainblackcreative/plain-black-website/pages/builds/latest`. Cloudflare *Workers*
(forms/bot/leaderboard) are a separate service, deployed manually via `wrangler`; their
source is not in this repo. Full breakdown in `CLAUDE.md` → "Hosting & deploy".

### Nothing internal gets served

- **New files are exposed by default.** Anything not in `_config.yml`'s `exclude:` is served at the customer domain. Before adding an internal/dev/scratch file, ask if a customer should be able to open it; if not, exclude it per-file and verify a real 404 (browser UA, after Pages rebuilds).
- **Exclusion is not privacy.** The repo is public, so every tracked file stays readable on github.com regardless. `exclude:` only keeps it off the customer domain. Genuinely private material belongs in the private admin repo.
