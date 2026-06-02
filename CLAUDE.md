# CLAUDE.md — plain-black-website

Project conventions and standing instructions for Claude when working in this repo.

## Brand rules — read these first

All visual, typographic, and copy decisions in this repo are governed by the **PlainBlack Repo System Prompt**.

📄 [`docs/REPO_SYSTEM_PROMPT.md`](docs/REPO_SYSTEM_PROMPT.md)

Before designing or writing anything customer-facing, read it. Key non-negotiables:

- Never use the word **Creative** under the PlainBlack logo in client-facing outputs.
- Dark, cinematic, minimalist — no SaaS UI, no white rounded cards.
- Green is an accent, not a main colour.
- Voice is direct, human, honest, slightly rebellious. Make readers feel seen, not stupid.
- The site fights for the underdog.

Run the **Design Self-Check** (last section of the prompt) before finalising any work.

## Related docs in this repo

- [`docs/PLAINBLACK_BUILD_SPEC.md`](docs/PLAINBLACK_BUILD_SPEC.md) — build / technical spec
- [`docs/PLAINBLACK_MASTER.md`](docs/PLAINBLACK_MASTER.md) — master reference
- [`docs/brand-voice.md`](docs/brand-voice.md) — voice notes (cross-check for overlap with REPO_SYSTEM_PROMPT)
- [`docs/blog-gen-handoff.md`](docs/blog-gen-handoff.md) — blog generator integration

## Canonical chrome (header, mobile nav, footer)

Every public page on the site must carry the same header / mobile nav / footer. The footer canonical lives in [`partials/footer.html`](partials/footer.html) — edit it there, never per-page.

**When creating a new top-level page:**

1. Drop a placeholder `<footer class="site-footer"></footer>` (empty is fine — the repair script fills it).
2. Add the path to `ALLOW_LIST` in [`scripts/lint-site-chrome.js`](scripts/lint-site-chrome.js). If the page is intentionally custom in some way, add the labels it's allowed to drop to the `EXEMPTIONS` map with a comment explaining why.
3. Run `npm run repair:footer` to stamp the canonical footer.
4. `npm run lint:chrome` should now pass.

The pre-push hook runs `lint:chrome` automatically and refuses to push on drift. Footer drift can be auto-healed with `npm run repair:footer`; header / mobile nav drift on top-level pages must still be fixed by hand (no template for those yet — extend the pattern if the pain shows up).

`partials/` is for build-time templates only — it is not served. Add it to `.gitignore` only if it ever holds untracked outputs.

## Deployment

Site is served at https://www.plainblackcreative.com (CNAME in this repo). Hosted via the same path as other PB sites.
