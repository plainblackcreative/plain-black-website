# Typography normalization — report + plan

Status: 2026-06-09. Branch `typography-normalize` (off `main`, isolated worktree).
Trigger (Jay): headers too large, nav text too small, italic in subheads looks dumb.

## Current state (audit)
- A fluid type-scale token system already exists in `assets/style.css` (`:root`, ~line 33-58): `--fs-hero/h2/h3/lead/body/button/small/label/caption` as `clamp()` + weight (`--fw-*`) and line-height (`--lh-*`) tokens. Families: Playfair Display (display) + Figtree (body). It is sound; it was only ~46% adopted.
- Heading italic is ONE device: italic Playfair + a green accent. Used at two scales — hero punch lines (`.serif` spans, ~16 pages) and section subheads (per-page `.x h2 em` rules). The green is set per context; `.serif` itself only sets italic + family.

## Decisions (locked with Jay)
1. **Scale = editorial restraint** — headers down hardest, nav/CTA up.
2. **Italic = drop the slant everywhere, KEEP the green** — headings upright, emphasized words stay green.
3. **Tiered, one outcome per session.**

## Phase A — DONE (commit 1896781; not pushed/merged)
File: `assets/style.css` + 2 rogue heroes. Verified in preview 375->1440px.
- `--fs-hero` 90->68px cap: `clamp(2.25rem, 1.5rem + 3.13vw, 4.5rem)`
- `--fs-h2` 52->43px; `--fs-h3` 30->26px
- New `--fs-nav` (15->16px). `.site-header__nav a` (was `0.87rem`) -> `var(--fs-nav)`; `.site-header__cta` (was `0.82rem`) -> `var(--fs-button)`
- `givesback.html` hero `5rem` -> `var(--fs-hero)` (loads style.css, fine)
- `30-day-back-half-poc.html` hero `8rem` -> hardcoded `clamp(2.25rem,1.5rem+3.13vw,4.5rem)` (token-less page — see Gotcha)
- Measured: hero 34/67.5, h2 26.5/43, nav 15/16, cta 14/15 (mobile/desktop).

## Phase B — italic pass (NEXT, per-page). Directive: drop slant, keep green.
Two parts:
1. **Global** (`assets/style.css`): remove `font-style:italic` from `.serif` (de-italics every hero punch line, keeps each one's colour); add `h1 em, h2 em, h3 em, h4 em { font-style: normal; }` to catch bare-`<em>` headings. This does NOT touch body `<p><em>`.
2. **Per-page `<style>` rules** that set heading italic at higher specificity — strip `font-style:italic`, keep `color`:
   - `index.html` `.dl-headline em` (:721)
   - `challenge.html` `.ch-story__title em` (:232)
   - `tools/daily-distillery.html` `.dd-shead h2 em`, `.dd-demo__head h2 em`, `.dd-dash__title em`, `.dd-dash__brief-title em`, `.dd-why h2 em`, `.cta-card h2 em` (138,157,521,566,878,907)
   - `tools/customer-translator.html` `.cta-card h2 em` (:415)
   - `tools/voice-twin.html` `.cta-card h2 em` (:300)
   - `tools/why-isnt-this-working/{index,diagnostic,result}.html` (`.wiw-pain__title em`, `.diag-intro h1 em`, `.scan-stage__title em`, `.result-hero h1 em`)
   - `30-day-back-half-poc.html` hero `font-style:italic` (:94) + `.closing h2 em` (:489) — bespoke, italic-heavy internal POC
   - `givesback.html` `.gb-hero__serif` italic
   - `404.html` `.headline span` / `.win-title span` (decorative — judgment)
- **Leave alone:** body `<p><em>`, the `.price` component, `.source-note` citations.
- **Coordinate:** `tools/...squirrels.html` has inline italic headings but was being edited by another session — don't touch until clear.

## Phase C — finish migration
Migrate remaining hardcoded main pages (`index.html` ~29, `services.html` ~13, etc.) onto tokens; reconcile bespoke pages; distinguish headings (normalize) from deliberate display numbers (`.build__num`, `.fs-score`, 404 bg — leave).

## Gotcha — token-less bespoke pages
Some standalone pages (e.g. `30-day-back-half-poc.html`) DON'T load `assets/style.css` (only Google Fonts). There `var(--fs-*)` is undefined and silently collapses font-size to ~16px (and 1rem=16px, not the 15px root style.css sets). Before swapping a hardcoded size for a token on any page, confirm the page links `assets/style.css`; if not, hardcode the `clamp()` values. Always verify rogue/bespoke edits in the preview.

## Guardrails
- Branch off `main`, never `main`. Verify branch before every commit (concurrent sessions share the main tree; work from an isolated worktree).
- Review in the local preview panel (worktree server), not CF Pages.
- After per-page edits, confirm in preview: headings upright + green retained, body `<em>` still italic.
