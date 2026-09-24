# CLAUDE.md — plain-black-website

Project conventions and standing instructions for Claude when working in this repo.

## Brand guidance: read these sources first

The approved brand documents live in the private `plainblack-admin` repository, normally checked out as the sibling `../admin/`. Read these files under `PlainBlack_Claude_Code_Brand_Package/docs/` before customer-facing work:

- `REPO_SYSTEM_PROMPT.md`: current website guidance. New pages and blog posts must match the existing site's shared styles, components and relevant page patterns. The historical prompt retained at the bottom is not active instruction.
- `01_PlainBlack_Voice_and_Content_Guide.md`: approved writing guidance, within its stated scope.
- `02_PlainBlack_Visual_Brand_Guide.md`: broader visual guidance, alongside the existing website design system. Its flexibility for other assets does not authorise restyling the website.

Use supplied logo artwork by default or the specific treatment requested in the brief. There is no blanket ban on **Creative** beneath the logo. Reuse existing typography, colours and appropriate dark or light layouts. Do not restore superseded blanket design restrictions from the historical prompt.

Use the current brief and verified business records for audience, positioning, offers and claims. The business strategy overview is draft reference material. Do not treat historical examples or audience assumptions as approved facts.

Use the active **Design Self-Check Before Finishing** section in the website guidance. Follow this repository's technical, accessibility and release requirements.

### Voice & copy

- Lead with the offer relevant to the page and its approved brief. A page about a specific service may focus on that service. A broader overview may explain the wider offer. Keep audience, availability and commercial claims grounded in current approved business information. Do not expand a page into a full-service pitch unless its purpose calls for that.
- Describe pricing, billing and approval using the confirmed terms for the offer. “Approve every invoice” may be used when it accurately describes that arrangement; it is not a mandatory slogan. Choose invoice, spend, bill or another term for its meaning in context. Do not invent approval rights, payment methods or claims about how retainers work.
- When a call to action is useful, state the action clearly and make sure it matches what happens next. Use direct labels such as Book now, Get a quote or Read the guide when they accurately describe the destination. Choose wording for the current offer, audience and brief. A specific situation may be used when relevant and supported, but no lived-moment formula is required. Do not invent urgency, scarcity, benefits or commitments. A piece that needs no action does not need a CTA.
- **Never write "PB" where a customer can read it.** Copy, buttons, social, OG titles: "PlainBlack", or rephrase it away. Plumbing keeps `pb`: class names, filenames, commits, internal docs.
- **Keep every apostrophe.** I'm, let's, isn't, don't. Never drop them for casual texture; it reads as a mistake, not a style.
- **Keep useful qualifications and remedies.** State uncertainty honestly. Include a relevant risk and a useful remedy when they help the reader understand or act. Keep necessary explanations concise. Cut repetition, filler and clauses that merely defend a statement; do not omit useful information to satisfy a one-line limit.

## Related docs

All brand and ops docs live in the private `plainblack-admin` repo, checked out as a sibling folder alongside this one: the build spec, the master brief, the brand-voice guide, and the blog-gen handoff.

## Build craft (tools, pages, motion)

- Match the interaction to the tool’s purpose, audience and current brief. Playful controls, animation and visible feedback may be used when they make the tool clearer or more engaging. Forms, calculators and quote builders are valid when they suit the task. Do not require motion, rewards or a toy-like presentation in every tool. Preserve the existing website design system, accessibility requirements and useful explanatory text.
- Prefer the existing SVG icon style for interface consistency. Allow emoji when the brief calls for them and they suit the content. Check legibility and accessibility.
- Use pacing appropriate to the interaction. Avoid distracting or abrupt loops; provide reduced-motion behaviour where appropriate. A longer pause between cycles is an option, not a universal timing requirement.
- Choose an image treatment that keeps the intended subject visible at relevant screen sizes. Try suitable crops, responsive image sources or positioning, then inspect the result. Ask for another source image only when the available one cannot meet the brief.
- **Never reuse admin scoring colours or labels on a customer-facing card.** An uncoded tier dot on a screenshot-able card reads as a cruel near-miss scorecard, or as decoration pretending to be data. Decorative, relabelled, or cut.

## Front-end gotchas (every one has bitten)

- **Root-absolute URLs inside CSS custom properties.** A relative `url()` in a custom property resolves against the stylesheet consuming the `var()`, not the document, so it 404s under `/assets/css/`. Write `url('/assets/...')`. Direct inline `background-image` is fine relative.
- **iOS Safari ignores `.volume` on audio.** Silent no-op; desktop honours it, so it misdiagnoses easily. Never answer "still too loud on mobile" by lowering it again. Diagnose first, then offer Web Audio GainNode, a quieter re-encode, or removal.
- Ensure required design tokens are available and set the intended page background explicitly. Use the approved dark or light treatment for the page. Verify the result in the preview, including page loading.

## Canonical chrome (header, mobile nav, footer)

Every public page on the site must carry the same header / mobile nav / footer. The footer canonical lives in [`partials/footer.html`](partials/footer.html) — edit it there, never per-page.

**When creating a new top-level page:**

1. Drop a placeholder `<footer class="site-footer"></footer>` (empty is fine — the repair script fills it). If you copied an existing page, you already have one.
2. Add the path to `ALLOW_LIST` in `scripts/lint-site-chrome.js`. If the page is intentionally custom in some way, add the labels it's allowed to drop to the `EXEMPTIONS` map with a comment explaining why.

That's it. The pre-push hook runs `repair:footer` → `sync-tracking` → `lint:chrome` on every push. If repair rewrites a footer (or sync-tracking regenerates the manifest), the hook aborts and tells you to commit the regenerated files. Header / mobile-nav drift on top-level pages still has to be fixed by hand — no template for those yet, extend the pattern if the pain shows up.

Manual escape hatches: `npm run repair:footer` and `npm run lint:chrome` are both fine to run on demand.

`partials/` is for build-time templates only — it is not served. Add it to `.gitignore` only if it ever holds untracked outputs.

## Git & editing hygiene

- **Use separate worktrees when sessions overlap in this repository.** Never have concurrent sessions share a checkout. Ordinary single-session work does not require a worktree. Remove a worktree only after its changes are merged and it is clean; preserve unmerged work. Confirm `git branch --show-current` before every commit; stage by explicit path, never `git add -A`. Files you never touched in `git status` = stop.
- **Changes reach `main` by pull request. A direct push is refused.** Read from the API on 2026-09-22: `main` requires a pull request with zero approvals, **admin enforcement is ON** (so Jay's account is refused too, with `Changes must be made through a pull request`), linear history is required, and force pushes and branch deletion are blocked. The rule was removed on 2026-08-31 and is back. So: branch, push, open the PR, merge it with `--rebase` (linear history), delete the branch, then fast-forward local `main`. Merging publishes, so it still needs Jay's go. Never leave a branch behind.
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
- **`main` is protected here: changes arrive by pull request.** Zero approvals are
  required and admins are NOT exempt (checked 2026-09-22), so a direct push is refused
  for everyone. Open a PR and merge it; see Git & editing hygiene above.
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
  but it's Workers, not Pages, and their source is **not** in this repo — it is in
  `~/Studio/plainblack/admin/worker-public/` plus the `pb-forms` and `pb-api-proxy` repos
  under `~/Studio/platform/`. (An empty `worker/` scaffolding tree used to sit here and is
  gone as of 2026-08-22.) Full map — every Worker, endpoint,
  source path, KV binding, and secret name — is in [`WORKERS.md`](WORKERS.md).

Evidence (captured 2026-07-12): apex → `185.199.108–111.153` (GitHub Pages); live
responses carry GitHub Pages' Fastly headers (`via: 1.1 varnish`, `x-github-request-id`,
`x-served-by: cache-akl…`); `gh api …/pages` reports `build_type: legacy`,
`source: main /`.

### Nothing internal gets served

- **New files are exposed by default.** Anything not in `_config.yml`'s `exclude:` is served at the customer domain. Before adding an internal/dev/scratch file, ask if a customer should be able to open it; if not, exclude it per-file and verify a real 404 (browser UA, after Pages rebuilds).
- **Exclusion is not privacy.** The repo is public, so every tracked file stays readable on github.com regardless. `exclude:` only keeps it off the customer domain. Genuinely private material belongs in the private admin repo.
