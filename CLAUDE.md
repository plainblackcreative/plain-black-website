# CLAUDE.md — plain-black-website

Project conventions and standing instructions for Claude when working in this repo.

## Brand rules — read these first

All visual, typographic, and copy decisions in this repo are governed by the **PlainBlack Repo System Prompt**.

> The brand docs have moved to the private `plainblack-admin` repo (`docs-from-public-repo/`). Find `REPO_SYSTEM_PROMPT.md` there before designing anything customer-facing.

Key non-negotiables:

- Never use the word **Creative** under the PlainBlack logo in client-facing outputs.
- Dark, cinematic, minimalist — no SaaS UI, no white rounded cards.
- Green is an accent, not a main colour.
- Voice is direct, human, honest, slightly rebellious. Make readers feel seen, not stupid.
- The site fights for the underdog.

Run the **Design Self-Check** (last section of the prompt) before finalising any work.

## Related docs

All brand and ops docs are now in `plainblack-admin/docs-from-public-repo/`. Key files: `PLAINBLACK_BUILD_SPEC.md`, `PLAINBLACK_MASTER.md`, `brand-voice.md`, `blog-gen-handoff.md`.

## Canonical chrome (header, mobile nav, footer)

Every public page on the site must carry the same header / mobile nav / footer. The footer canonical lives in [`partials/footer.html`](partials/footer.html) — edit it there, never per-page.

**When creating a new top-level page:**

1. Drop a placeholder `<footer class="site-footer"></footer>` (empty is fine — the repair script fills it). If you copied an existing page, you already have one.
2. Add the path to `ALLOW_LIST` in `scripts/lint-site-chrome.js` (scripts are now in `plainblack-admin/scripts-from-public-repo/`). If the page is intentionally custom in some way, add the labels it's allowed to drop to the `EXEMPTIONS` map with a comment explaining why.

That's it. The pre-push hook runs `repair:footer` → `sync-tracking` → `lint:chrome` on every push. If repair rewrites a footer (or sync-tracking regenerates the manifest), the hook aborts and tells you to commit the regenerated files. Header / mobile-nav drift on top-level pages still has to be fixed by hand — no template for those yet, extend the pattern if the pain shows up.

Manual escape hatches: `npm run repair:footer` and `npm run lint:chrome` are both fine to run on demand.

`partials/` is for build-time templates only — it is not served. Add it to `.gitignore` only if it ever holds untracked outputs.

## Deployment

Site is served at https://www.plainblackcreative.com (CNAME in this repo). Hosted via the same path as other PB sites.
