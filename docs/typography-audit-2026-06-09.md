# PlainBlack Typography Audit — Synthesis Report

> Auto-generated 2026-06-09 by a multi-agent drift audit across all 200 site HTML files.
> This session healed the **foundation + flagship** tier. The per-tier roadmap below is the
> backlog for follow-up sessions (blog, tools, playbooks, docs, givesback, challenge).

## 1. Proposed Fixed Type Scale

Base assumption: `html{font-size:15px}` stays. clamp() midpoints use `vw` so the floor is hit at ~360px mobile and the ceiling near ~1280px desktop. All px values below are absolute, not rem-relative.

| Token | clamp() value | px range (min → max) | Font-family | Weight | Line-height |
|---|---|---|---|---|---|
| `--fs-hero` | `clamp(2.5rem, 1.6rem + 4.6vw, 6rem)` | 40 → 96 | Playfair Display | `var(--fw-hero)` 800 | `var(--lh-tight)` 1.05 |
| `--fs-h2` | `clamp(1.875rem, 1.35rem + 2.4vw, 3.5rem)` | 30 → 56 | Playfair Display | `var(--fw-heading)` 700 | `var(--lh-snug)` 1.15 |
| `--fs-h3` | `clamp(1.375rem, 1.18rem + 0.9vw, 2rem)` | 22 → 32 | Playfair Display | `var(--fw-h3)` 700 | `var(--lh-snug)` 1.2 |
| `--fs-lead` | `clamp(1.375rem, 1.2rem + 0.8vw, 1.75rem)` | 22 → 28 | Figtree | `var(--fw-body)` 400 | `var(--lh-relaxed)` 1.5 |
| `--fs-body` | `clamp(1rem, 0.97rem + 0.18vw, 1.125rem)` | 15 → 18 | Figtree | `var(--fw-body)` 400 | `var(--lh-body)` 1.65 |
| `--fs-button` | `clamp(0.9375rem, 0.92rem + 0.1vw, 1.0625rem)` | 15 → 17 | Figtree | `var(--fw-medium)` 600 | `var(--lh-tight)` 1.1 |
| `--fs-small` | `clamp(0.8125rem, 0.8rem + 0.1vw, 0.9375rem)` | 13 → 15 | Figtree | `var(--fw-body)` 400 | `var(--lh-snug)` 1.3 |
| `--fs-label` | `clamp(0.75rem, 0.73rem + 0.08vw, 0.9375rem)` | 12 → 15 | Figtree | `var(--fw-label)` 650 | `var(--lh-tight)` 1.1 |
| `--fs-caption` | `clamp(0.8125rem, 0.8rem + 0.05vw, 0.9375rem)` | 13 → 15 | Figtree | `var(--fw-body)` 400 | `var(--lh-snug)` 1.3 |

Companion tokens: `--fw-hero` 800, `--fw-heading` 700, `--fw-h3` 700, `--fw-medium` 600, `--fw-label` 650, `--fw-body` 400; `--lh-tight` 1.05, `--lh-snug` 1.2, `--lh-body` 1.65, `--lh-relaxed` 1.5.

**Hard rule:** no token below 12px; body floor is 15px. Every sub-13px size collapses into `--fs-label` (12px) or `--fs-caption` (13px) — eyebrows and tags only, never running body.

## 2. Drift Summary (baseline before heal)

- 200 files inventoried; 127 carry real typography, 73 are redirect/stub shims (no work).
- ~1,180 distinct size/family/weight combos site-wide; worst single files: `tools/daily-distillery.html` (28), `index.html` (25), `playbooks/ai-agents` (24).
- **97 files** have body text < 15px. Bands: 11 files < 10px (egregious), ~45 at 10–12.9px, ~41 at 13–14.9px.
- **22 files** have heading-font issues: 7 `figtree-hero` (hero set in Figtree, should be Playfair), 15 `mixed` (mostly the shared `.post-content h3 = Figtree` convention).
- 6 genuine non-brand-font breaches (see §4).

## 3. Roadmap by Tier (follow-up backlog)

### Flagship (healed this session)
index, services, tools, about, contact, work, blog, playbooks, givesback, idea-engine, name-frame, brand-spark, brand-sprint, first-fix, privacy, thanks, 404. **De-scoped to a dedicated rebuild:** `should-we-talk-yet.html` (off-brand island — Cormorant + Nunito, does not load style.css).

### Blog (93 files) — follow-up
Highest leverage = bump shared `.post-content p` from `0.97rem` (14.55px) to the 15px floor; heals ~40 posts at once. Worst bespoke offenders: `why-hire-us` (10.2px), `why-small-business-websites-fail`, `why-sports-fans-stay-loyal`, `why-were-all-convinced-red-vs-blue`, `worst-sales-promotion-in-history` (all 10.8px), `ai-chatbots-transforming-business` (12px). Decide once whether `.post-content h3 = Figtree` is canon (it's one shared rule, shows as `mixed` on ~15 posts).

### Tools (26 files) — follow-up
Worst: `daily-distillery` (28 combos, JetBrains Mono + Roboto, 9.3px Gmail-mockup chrome — mockup likely scope-exempt), `tools/...avoid-squirrels` (figtree-hero, DM Mono, 8.1px, no style.css). Bulk sit at 10.5–10.8px smallest, mostly labels/code → label-floor + body-bump.

### Playbook (20 files) — follow-up
Client templates under `playbooks/future/*` and `*-TEMPLATE-V1` are **exempt** (client brand fonts). PlainBlack playbooks sit uniformly at 13px body — one shared template token migration heals the set.

### News (14) — zero work (redirect stubs). Others (9) — stubs except `leo-linkedin.html` (fine).

### Docs (5) — recommend de-scoping from brand heal (internal dashboards), but flag `plainblack-hub-mockup.html` (7px) and `dashboard.html` (9px) as worst floors in the audit.

### Givesback (5) — near model-citizens; hero Playfair correct, only 12.75–13.2px card body. Easy token swap.

### Challenge (8) — `thai-thani-papamoa/*` exempt (client build). `30-day-back-half-poc.html` (8.25px) + `challenge.html` (9.3px badges) need label-floor + body-bump.

## 4. Non-Brand Font Violations (PlainBlack, non-exempt)

| Path | Non-brand font(s) | Note |
|---|---|---|
| `should-we-talk-yet.html` | Cormorant + Nunito | Entire page off-brand; no style.css. Highest severity. |
| `index.html` | Instrument Serif | Decorative quote mark only (not actually loaded → falls back to system serif). Replace with Playfair. |
| `tools/.../avoid-squirrels.html` | DM Mono | kbd/code; also figtree-hero. |
| `tools/daily-distillery.html` | JetBrains Mono + Roboto | Roboto = Gmail-mockup realism (defensible); JetBrains Mono is a real extra webfont. |
| `30-day-back-half-poc.html` | JetBrains Mono | Code/prompt blocks. |
| `blog/is-social-media-necessary.html` | Bebas Neue | 6rem display counter — a real third display face. |

**Exempt / intentional (do not touch):** `blog/the-font-fiasco.html` (Comic Sans is the joke), `thai-thani-papamoa/*` (client brand), `playbooks/future/*` + `marketing-foundations-TEMPLATE-V1` (client brand fonts). A future `--font-mono` token should sanction code-block monospace (SF Mono / Menlo / Fira Code) so accents are consistent rather than ad-hoc.

## 5. Watch-Outs for the Heal

1. `should-we-talk-yet.html` does NOT load style.css — token migration won't reach it; needs a manual rebuild.
2. Bespoke clamp ladders fight a blanket swap (`daily-distillery` 28 combos, `index` 25, `ai-agents` 24). Map each clamp to the nearest token by **intent**, don't blindly replace.
3. `figtree-hero` files often have **no font-family on the H1 at all** (givesback, idea-engine, name-frame) — fix = add Playfair to the H1 selector. `index.html`/`about.html` are the opposite (explicit Figtree override to remove). Read each before editing.
4. `.post-content h3 = Figtree` is one shared rule, not 15 per-file bugs — decide once.
5. Shared `style.css` is highest-leverage **and** highest-risk; the `0.97rem` body rule drives ~40 blog pages plus flagship defer-pages. Change the token, then spot-check a defer-only page and a heavy-bespoke page together.
6. Distinguish label/code px from body px before bumping — many sub-12px hits are eyebrows/tags/code/mockup chrome, not prose. Route to `--fs-label` / `--font-mono`, reserve 15px floor for body.
7. Unit bug to FIX, not migrate: `dont-lose-them-at-404.html` and `fear-sells-until-it-doesnt.html` have `0.75px` (should be `0.75rem`).
8. `15px` html base is load-bearing — keep `--fs-*` in rem and the base pinned, or the whole scale drifts.
