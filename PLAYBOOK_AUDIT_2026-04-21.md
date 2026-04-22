# PlainBlack Playbook Audit — 2026-04-21

**Scope:** 5 landers + 5 templates + 1 main-site index page (11 files, ~44,437 lines).
**State at audit time:** post commit `a1e36bc` (paywall-strip, thanks.html, robots.txt merged to main).
**Files read:** listed at the end of this audit.
**Changes made:** none. Read-only.

---

## 1. Executive summary

- **8 critical**, **11 important**, **3 polish**, **3 architectural**, **5 automation-prep** findings.
- **Worst-offender file: 90-day-job-pipeline-LANDING.html** — delivery-timeframe contradictions (3 distinct promises), refund-wording deviation, missing privacy FAQ, and most barren meta-tag set across all 5 landers.
- **Most consistently broken standard: the locked Privacy/URL FAQ wording.** Missing in all 5 landers despite being verbatim present in [playbooks.html:595](playbooks.html#L595). Every customer arriving at a lander sees no privacy statement; every customer arriving at the main-site page sees the correct one.
- **Biggest structural shift since last audit:** commit `a1e36bc` stripped all paywall code from all 5 templates. The spec/prompt assumes a paywall-present state (C1 finding below recomposes accordingly).

---

## 2. Cross-reference grid

### Grid A — Landers

Legend: ✅ present / ❌ missing or fails / ⚠ different (one-word reason) / — N/A

| Standard | 90-day | google-reviews | roofing-ai | marketing | ai-agents |
|---|---|---|---|---|---|
| GA4 placement (head, after fonts, before style, with comment) | ✅ | ✅ | ✅ | ✅ | ✅ |
| META Pixel (bare PIXEL_ID present) | ⚠ comment | ❌ missing entirely | ✅ | ✅ | ✅ |
| product_id hidden field | ✅ | ✅ | ✅ | ✅ | ✅ |
| 5-field form only | ❌ 6-7 | ❌ 7 | ❌ 5+2 | ❌ 6-7 | ❌ 6-7 |
| FAQ order locked (8 items) | ⚠ missing privacy | ⚠ missing privacy | ⚠ missing privacy | ⚠ missing privacy | ⚠ missing privacy |
| Refund wording locked | ❌ `you are` | ✅ | ✅ | ✅ | ✅ |
| Privacy/URL wording locked | ❌ missing | ❌ missing | ❌ missing | ❌ missing | ❌ missing |
| Exit intent (all 4 elements) | ✅ | ✅ | ✅ | ✅ | ✅ |
| Sticky header Light_logo | ✅ | ✅ | ✅ | ⚠ mobile-only | ✅ |
| Footer Light_logo | ✅ | ✅ | ✅ | ✅ | ✅ |
| Anti-underline CSS | ✅ | ✅ | ✅ | ⚠ missing | ✅ |
| Asset paths leading-slash | ✅ | ✅ | ✅ | ✅ | ✅ |
| No double-bracket placeholders | ❌ L41-42 | ✅ | ✅ | ✅ | ✅ |
| No em dashes | ✅ | ✅ | ✅ | ❌ L5246 | ❌ L4 L1189 |
| Accent colour correct | ✅ `#2563a8` | ✅ `#3ecf8e` | ✅ `#2563a8` | ✅ `#3ecf8e` | ✅ `#3ecf8e` |
| Delivery timeframe `within 24 hours` | ❌ 3 conflicting | ✅ | ❌ `within the hour` | ✅ | ✅ |
| Hidden product_id value | ✅ `90-day-job-pipeline` | ✅ `google-reviews` | ✅ `roofing-ai` | ✅ `marketing` | ✅ `ai-agents` |

### Grid B — Templates

| Standard | 90-day | google-reviews | roofing-ai | marketing | ai-agents |
|---|---|---|---|---|---|
| GA4 placement | ✅ | ✅ | ✅ | ✅ | ✅ |
| SECTIONS array (not hardcoded HTML) | ❌ hardcoded + AI_PROMPTS | ❌ hardcoded + inline prompts | ✅ `sections` | ✅ `SECTIONS` | ✅ `SECTIONS` |
| 10 sections (1-2 free) | ⚠ unclear post-strip | ⚠ unclear post-strip | ⚠ unclear post-strip | ⚠ unclear post-strip | ⚠ unclear post-strip |
| checkPurchaseComplete before validateAccess | — stripped | — stripped | — stripped | — stripped | — stripped |
| API proxy URL correct | ✅ | ✅ | ✅ | ✅ | ✅ |
| Model `claude-sonnet-4-5` (no date) | ✅ | ✅ | ✅ | ✅ | ✅ |
| NO_UPDATE italic Playfair | ✅ | ✅ | ✅ | ✅ | ✅ |
| Accent hardcoded hex (not placeholder) | ✅ `#2563a8` | ✅ `#3ecf8e` | ✅ `#2563a8` | ✅ `#3ecf8e` | ✅ `#3ecf8e` |
| `--border: #cce8d8` | ⚠ `--border: #cce8d8` at L137 | ⚠ `--border:#cce8d8` at L143 | ✅ L148 | ✅ L73 | ✅ L72 |
| No footer | ✅ | ✅ | ✅ | ✅ | ✅ |
| Bare PIXEL_ID (not `[[PIXEL_ID]]`) | ✅ L32 | ✅ L99 | ✅ L84 | ❌ missing entirely | ❌ missing entirely |
| Sticky header Light_logo | ✅ | ✅ | ✅ | ✅ | ✅ |
| Anti-underline CSS | ✅ | ✅ | ✅ | ✅ | ✅ |
| No em dashes | ✅ | ✅ | ✅ | ✅ | ✅ |
| Paywall close button | — stripped | — stripped | — stripped | — stripped | — stripped |
| Paywall userHasScrolled guard | — stripped | — stripped | — stripped | — stripped | — stripped |
| Paywall re-arm behaviour | — stripped | — stripped | — stripped | — stripped | — stripped |
| Optional-sections mechanism | ✅ (country-gated Section 1) | ❌ | ❌ | ❌ | ❌ |
| Access model (const PAID vs endpoint) | ❌ none | ❌ none | ❌ none | ❌ none | ❌ none |
| Dev-mode fallback for unsubstituted endpoint | — stripped | — stripped | — stripped | — stripped | — stripped |
| Architecture (DOMContentLoaded vs IIFE, prompts style) | DOMContentLoaded arrow + AI_PROMPTS array | ⚠ IIFE + inline prompts | DOMContentLoaded arrow + sections array | DOMContentLoaded → init() + SECTIONS array | DOMContentLoaded → init() + SECTIONS array |
| noindex meta | ❌ missing | ❌ missing | ✅ L58 | ✅ L6 | ✅ L6 |

---

## 3. Findings — Critical

#### C1. Access model: all 5 templates currently have NO paywall mechanism

**Files affected:** all 5 TEMPLATE files
**What:** Commit `a1e36bc` (this session) stripped paywall from every template. There is no `const PAID`, no `ACCESS_TOKEN_ENDPOINT`, no `validateAccess`, no `renderLockedSection`, no `checkPurchaseComplete` anywhere in any template. Grep for `paywall|PAID|ACCESS_TOKEN_ENDPOINT|validateAccess|renderLockedSection|accessStatus|openPaywall|closePaywall`: **0 matches across all 5 files**.
**Why it matters:** Every template is now a clean unlocked playbook. If any of these files are served to paying customers as-is during the manual SOP window, they are fully unlocked with no gate, no Stripe CTA, no lock teasers, no access-state mechanism at all. Manual delivery today has no single-source flip point to gate anything. Pre-revenue, so impact is theoretical — but the manual SOP has no paywall anchor to rely on.
**Evidence:**
- [90-day-job-pipeline-TEMPLATE.html:2497](playbooks/ready/90-day-job-pipeline/90-day-job-pipeline-TEMPLATE.html#L2497): init is `applyOptionalSections(); renderAll();`
- [roofing-ai-TEMPLATE.html:3278-3281](playbooks/ready/roofing-ai/roofing-ai-TEMPLATE.html#L3278-L3281): init is `renderAll(); updateProgress();`
- [google-reviews-TEMPLATE.html:3543-3545](playbooks/ready/google-reviews/ai-powered-google-reviews-TEMPLATE.html#L3543-L3545): IIFE `(function init() { loadState(); })();`
- [marketing-TEMPLATE.html:3807-3815](playbooks/ready/marketing/marketing-TEMPLATE.html#L3807-L3815): `init()` calls `loadState(); renderNav(); renderSections(); bindMobileToggle(); updateProgress();`
- [ai-agents-TEMPLATE.html:3838-3846](playbooks/ready/ai-agents/ai-agents-TEMPLATE.html#L3838-L3846): identical shape to marketing

**Recommended fix (verbatim per audit brief, locked position):** Defer to proper Stage 2 migration (option b). Rationale: we are pre-revenue on the manual SOP. Injecting a dummy endpoint URL that forces pending state adds a moving part that needs to be un-injected during Stage 2 automation, during which time every customer delivery depends on it working. The right move is to (1) keep the manual SOP as the gate for now, (2) ship paid playbooks manually using the existing `const PAID = false` pattern on the 4 other templates the same way 90-day does, normalising to one access model across all 5, (3) cut over to real `ACCESS_TOKEN_ENDPOINT` during Stage 2 when Make.com Scenario 1 is live and testable end-to-end. Do not introduce a dummy endpoint as an interim measure.

**Consistency with current state:** The recommended "normalise to const PAID = false across all 5" requires reintroducing the pattern. None of the 5 templates currently have it. 90-day's previous `const PAID = fasle;` (literal typo) was removed in the same strip commit. For Chat 3 this means: add `const PAID = false;` to all 5 templates, wire it into an optional gate, or defer the gate work entirely until Chat 5's generator — the brief explicitly endorses deferral.

---

#### C2. 90-day lander delivers three conflicting timeframe promises to the same user

**Files affected:** [90-day-job-pipeline-LANDING.html](playbooks/ready/90-day-job-pipeline/90-day-job-pipeline-LANDING.html)
**What:** Customer sees `within minutes` (L3338, L3343), `Check your email in 2 minutes` (success state, L3393), and `within 24 hours` (form note, L3388) on the same page. Locked phrase is `within 24 hours`.
**Why it matters:** Revenue + support. Any customer who pays and doesn't see an email within 2 minutes will (a) email support panicking, (b) request refund, (c) post a complaint. The success-state copy is the most critical offender because it fires immediately after form submission and sets short-term expectations the ops pipeline cannot meet.
**Evidence:**
- L3338: timeframe copy `within minutes`
- L3343: timeframe copy `within minutes`
- L3388: form note `within 24 hours`
- L3393 (success state): `Check your email in 2 minutes.`
**Recommended fix:** Replace all three to the locked `within 24 hours`. Success-state h3 and body text are highest priority.

---

#### C3. roofing-ai lander promises delivery `within the hour`, not `within 24 hours`

**Files affected:** [roofing-ai-LANDING.html](playbooks/ready/roofing-ai/roofing-ai-LANDING.html)
**What:** Copy at L2418, L2678, L2698 uses `within the hour` / `Delivered within the hour`. Form note at L2740 does say `within 24 hours`, so the page also contradicts itself.
**Why it matters:** Same as C2 — unmeetable promise at scale, potential refund liability, support load. Mixing within-the-hour with within-24-hours signals copy drift between writer(s).
**Evidence:**
- L2418: `Delivered within the hour.`
- L2678: `We personalise it and email you a private link within the hour.`
- L2698 (form success): success message uses `within the hour`
- L2740: `We'll email your private playbook link within 24 hours.` (conflicting on same page)
**Recommended fix:** Collapse to a single promise, matching spec: `within 24 hours`.

---

#### C4. Privacy/URL FAQ wording missing from all 5 landers

**Files affected:** all 5 LANDING files
**What:** Locked wording is `Your playbook is hosted at a private, unguessable URL that is never listed, indexed, or shared with anyone other than you. No accounts, no logins, no passwords. Just a link only you have.` Not present in any lander FAQ. Curiously, **the main-site index [playbooks.html:595](playbooks.html#L595) contains the exact locked wording** in its security callout.
**Why it matters:** Privacy is the core trust signal for a payment-then-URL-delivered product. Prospects on landers reach checkout with no explicit answer to "is anyone else going to see this link?" The main-site page has the right answer; the purchase pages do not.
**Evidence:** Each lander audit agent independently confirmed absence:
- 90-day: not in 8 FAQ items (L3288-3323)
- google-reviews: not in 10-question FAQ (L3018-3055)
- roofing-ai: not in 8 FAQ items (L2649-2656)
- marketing: not in FAQ (L3361-3390)
- ai-agents: not in 8 FAQ items (L3337-3374)
- Reference (correct wording): [playbooks.html:595](playbooks.html#L595)

**Recommended fix:** Add the FAQ question+answer to each lander in the locked order position. Spec says 8 questions in a locked order — confirm what the canonical order is and insert.

---

#### C5. 90-day lander refund wording deviates from locked phrase

**Files affected:** [90-day-job-pipeline-LANDING.html:3308-3309](playbooks/ready/90-day-job-pipeline/90-day-job-pipeline-LANDING.html#L3308-L3309)
**What:** Locked: `...know what you're getting.` 90-day reads: `...know what you are getting.` Contraction expanded.
**Why it matters:** Minor in prose, but the refund policy is spec-locked verbatim and this deviation means one of the five landers has a different legally-operative refund statement.
**Evidence:** L3309: `By the time you pay, you know what you are getting.`
**Recommended fix:** Restore the contraction `you're`.

---

#### C6. Em dashes in customer-facing copy (marketing + ai-agents + main-site)

**Files affected:** marketing lander, ai-agents lander, playbooks.html
**What:** Locked rule is "no em dashes anywhere." Three offending files:
- [marketing-LANDING.html:5246](playbooks/ready/marketing/marketing-LANDING.html#L5246): `Get my playbook — $99` (mobile sticky CTA)
- [ai-agents-LANDING.html:1189](playbooks/ready/ai-agents/ai-agents-LANDING.html#L1189): `Get my playbook — $99`
- [ai-agents-LANDING.html:4](playbooks/ready/ai-agents/ai-agents-LANDING.html#L4): `PLAINBLACK AI AGENTS & AUTOMATIONS PLAYBOOK — LANDER` (HTML comment header, not customer-visible but still in source)
- [playbooks.html:7](playbooks.html#L7): `<title>AI Playbooks — PlainBlack</title>` **← browser tab + SEO impact**
- [playbooks.html:387](playbooks.html#L387): `Search playbooks — try 'roofing', 'reviews', 'AI'...` (search placeholder)
- [playbooks.html:701](playbooks.html#L701): `<input ... value="PlainBlack &mdash; Playbook Interest">` (hidden form subject, ends up in inbox)

**Why it matters:** Brand consistency; spec-locked. The playbooks.html `<title>` is the most visible — shows in every browser tab and in Google SERPs for that page.
**Recommended fix:** Replace each with comma, period, or two-word pivot. Drop the em dash from browser title immediately.

---

#### C7. google-reviews lander ships with zero Meta Pixel tracking

**Files affected:** [google-reviews-LANDING.html](playbooks/ready/google-reviews/ai-powered-google-reviews-LANDING.html)
**What:** All 4 other landers have the bare `PIXEL_ID` placeholder for Meta Pixel init (awaiting ID swap). google-reviews has no `fbq(`, no `PIXEL_ID`, no `facebook.com/tr` tracking pixel — not a single Pixel trace. The other 4 landers at least have the scaffolding.
**Why it matters:** Once Pixel is set up on the other four, google-reviews will be the only lander not contributing Purchase conversion events to the Meta pixel. Ad optimization data will be skewed — Meta will assume Google Reviews customers convert at a lower rate than they actually do because conversions go untracked.
**Evidence:** Lander audit agent grep for `PIXEL_ID|fbq\(|facebook.com/tr` returned zero matches in this file.
**Recommended fix:** Add the Meta Pixel script block from another lander (e.g., marketing-LANDING.html) near `<head>`, using bare `PIXEL_ID` placeholder matching the convention.

---

#### C8. Templates marketing + ai-agents ship with no Meta Pixel code

**Files affected:** [marketing-TEMPLATE.html](playbooks/ready/marketing/marketing-TEMPLATE.html), [ai-agents-TEMPLATE.html](playbooks/ready/ai-agents/ai-agents-TEMPLATE.html)
**What:** 3 of 5 templates (90-day L32-36, roofing L84-88, google-reviews L99-103) contain the standard Pixel init + noscript tracker block using bare `PIXEL_ID`. Marketing and ai-agents templates have **zero Pixel code**.
**Why it matters:** Once a paid customer lands on the delivered template, Meta Pixel fires a `PageView` — this is how Meta attributes the conversion to the ad campaign. Two templates delivered today attribute nothing. Attribution data drives campaign optimization spend decisions.
**Evidence:** Grep for `PIXEL_ID|fbq(` on both files returned 0 matches. Other 3 templates returned 3 matches each (init + track + noscript).
**Recommended fix:** Port the `<head>`-level Pixel block (plus `<noscript>` fallback) from one of the compliant templates into both files.

---

## 4. Findings — Important

#### I1. Templates google-reviews + 90-day missing `noindex` meta

**Files affected:** google-reviews-TEMPLATE.html, 90-day-job-pipeline-TEMPLATE.html
**What:** Templates are served at private unguessable URLs and must not be indexed. 3/5 templates have `<meta name="robots" content="noindex,nofollow">` in `<head>`. 2 do not.
**Why it matters:** If either URL is ever accidentally crawled (shared on social, forwarded, leaked), the paid playbook contents go into Google's index and the "unguessable URL" privacy promise becomes fictional.
**Evidence:**
- Present: [roofing-ai-TEMPLATE.html:58](playbooks/ready/roofing-ai/roofing-ai-TEMPLATE.html#L58), [marketing-TEMPLATE.html:6](playbooks/ready/marketing/marketing-TEMPLATE.html#L6), [ai-agents-TEMPLATE.html:6](playbooks/ready/ai-agents/ai-agents-TEMPLATE.html#L6)
- Missing: google-reviews, 90-day
**Recommended fix:** Add `<meta name="robots" content="noindex,nofollow">` to `<head>` of both.

---

#### I2. Optional-sections mechanism only implemented in 90-day

**Files affected:** all 5 TEMPLATEs
**What:** 90-day has a full mechanism: CSS class `.section-card.section-optional`, `OPTIONAL_SECTIONS_BY_COUNTRY` dict, `applyOptionalSections()` function, and Section 1 flagged for AU/NZ. The other 4 templates have zero equivalent. For each of the 4:

- **roofing-ai** — strong candidates for country-gated sections: Section 5 `Storm Season Leads` and Section 6 `Insurance Claims`. Both are US-centric (US storm market + US insurance claims handling). Architecture is JS-rendered from `const sections = [...]` at L2596, so porting the mechanism would mean adding an `optional: true` flag to section objects and a conditional class in `renderSection()`.
- **marketing** — Section mentions LSA (Local Services Ads) at L3118, L3174, L3177 in LANDER copy. Template uses `const SECTIONS = [...]` at L2857. If any section's `html` string references LSA specifically, that section is a candidate. Not a clear single-section gate like roofing's.
- **ai-agents** — no obvious country-gated content. Automations are platform-agnostic.
- **google-reviews** — no obvious country-gated content. Google Business Profile works the same in AU/NZ/US. Currency notation may need audit but not a section-level gate.

**Architecture differences that affect porting:**
- 90-day: hardcoded HTML sections + `applyOptionalSections()` adds a class at runtime
- roofing/marketing/ai-agents: JS-rendered from a data array, so an `optional` flag on the section object is cleanest
- google-reviews: hardcoded HTML + inline onclick, so would need DOM-query approach like 90-day

**Why it matters:** roofing delivered to an AU or NZ customer today includes two clearly US-specific sections (storm claims logic + insurance adjuster workflow) presented as universal — that's a quality issue for 40%+ of the addressable market.
**Recommended fix:** Port the mechanism to roofing-ai as priority 1. Review marketing sections for LSA-gating. Leave ai-agents and google-reviews unless clear candidates surface.

---

#### I3. Delivery timeframe inconsistency across all 5 landers (not just the two C-level offenders)

**Files affected:** all 5 LANDINGs
**What:** Even landers that pass the "within 24 hours" check have surrounding copy variants that may drift. Documenting for awareness:
- 90-day (C2): `within minutes`, `2 minutes`, `within 24 hours` — 3 different claims
- roofing-ai (C3): `within the hour` (x3), `within 24 hours` (x1)
- google-reviews: `within 24 hours` consistently ✓
- marketing: `within 24 hours` consistently ✓
- ai-agents: `within 24 hours` consistently ✓
**Recommended fix:** Rolled into C2, C3.

---

#### I4. Form anchor IDs diverge across all 5 landers

**Files affected:** all 5 LANDINGs
**What:** Form section IDs:
- 90-day: `#lead-form`
- google-reviews: `#lead-form-section`
- roofing-ai: `#get-yours`
- marketing: `#form`
- ai-agents: `#form`
**Why it matters:** Two are shared (`#form`), three are unique. Breaks shared CTA link patterns, blog-post cross-links, any future shared copy ("click the form on the playbook page"). Not blocking, but a consistency tax.
**Recommended fix:** Standardise on `#form`. Update three landers.

---

#### I5. Form field count — all 5 landers ship 6-7 fields against a 5-field spec

**Files affected:** all 5 LANDINGs
**What:** Spec: 5 fields — business name, owner first name, email, city/suburb, primary service. Actual:
- All 5 landers include a required **`country`** dropdown (+1)
- All 5 landers include an optional **`website`** field (+1)
- 90-day and roofing label their "primary service" as "trade type" / "type of business" (label drift but same field)
**Why it matters:** Extra required fields reduce form conversion. Country is required everywhere — +1 required field costs conversion by ~7-10% per added required field typically.
**Recommended fix:** Decide: is country now a required 6th field per revised spec? Or remove from all 5? Also, locked label for the service field should be one of {primary service, service, trade type, type of business} — pick one.

---

#### I6. CTA wording variations across and within landers

**Files affected:** all 5 LANDINGs
**What:** Spec default is `Get the Playbook`. Actual variants in circulation:
- 90-day: `Get the Playbook`, `Get my free playbook`, `Get the free preview`
- google-reviews: `Get the Playbook`, `Get my free preview`, `Get the free preview →`
- roofing-ai: `Get the Playbook`, `Get My AI Playbook`, `Get My Playbook for $99`, `Build my playbook`, `Get my playbook, $99`
- marketing: `Get the Playbook` x3, `Get Your Playbook` x2, `Get my playbook — $99`
- ai-agents: `Get my playbook — $99`, `Get Your Playbook`, `Get the Playbook`, `Build my playbook`

Each lander uses 3-5 different CTA strings depending on placement (hero / sticky / exit-intent / form button / nav CTA). Some variation is contextually appropriate (form button says "Build my playbook"; primary CTA says "Get the Playbook"). Others look like drift.
**Why it matters:** Brand consistency + tracking clarity. A/B test data fragments when the CTA string differs per placement.
**Recommended fix:** Define 2-3 canonical CTA strings by placement (hero, form button, sticky, exit-intent) and apply across all 5.

---

#### I7. Hero headlines documented (awareness, not a fix)

**Files affected:** all 5 LANDINGs
**What:** Verbatim hero `<h1>` per file:
- 90-day L3021: `Stop buying leads. Start owning your pipeline.`
- google-reviews L2807: `Your Google reviews are a marketing channel. <em>Most owners treat them like a suggestion box.</em>`
- roofing-ai L2409: `Stop doing manually<br>what <em>AI does</em> in minutes.`
- marketing L2991-2992: `Stop paying agencies.<br>Start running your own <em>paid ads system</em>.`
- ai-agents L2955-2958: `Stop doing the repetitive work.<br>Hand it to <em>AI that works for you.</em>`

**Pattern:** 4/5 use a `Stop X. Start Y.` or `Stop X. Hand it to Y.` structure. google-reviews is the outlier (statement-then-observation). Not a fix — just noting the structural divergence.

---

#### I8. Meta tag completeness varies dramatically across 5 landers

**Files affected:** all 5 LANDINGs
**What:** Completeness of social/SEO meta tags:
- 90-day: title + description only (**no og:*, no twitter:*, no canonical, no robots**)
- google-reviews: title + description only (**no og:*, no twitter:*, no canonical, no robots**)
- roofing-ai: title + description + og:title + og:description + og:type (partial og:*, **no twitter:*, no canonical, no robots, no og:image**)
- marketing: title + description + og:title + og:description + og:type (partial og:*, **no twitter:*, no canonical, no robots, no og:image**)
- ai-agents: title + description + og:title + og:description + og:type (partial og:*, **no twitter:*, no canonical, no robots, no og:image**)

**Why it matters:** Social sharing preview quality. A lander link shared on Facebook/LinkedIn/Twitter without `og:image` shows no preview image. Canonical absence is minor since landers are served from a single URL per product.
**Recommended fix:** Add a minimum pack of {og:title, og:description, og:type, og:url, og:image, twitter:card, canonical} to all 5. og:image can be a single shared `/assets/og-default.jpg` or per-product.

---

#### I9. Make.com card in marketing lacks free-tier pricing note

**Files affected:** [marketing-LANDING.html:3242,3335](playbooks/ready/marketing/marketing-LANDING.html)
**What:** Marketing lander mentions Make.com automations (4 of them) but never surfaces that Make.com has a free tier (1000 ops/month). Prospects may assume Make.com costs money and feel the playbook requires paid tooling.
**Evidence:**
- L3242: `30-minute Monday routine. Four Make.com automations (lead response, review requests, social auto-reply, weekly report). Everything runs itself.`
- L3335: `Four Make.com automations that run your lead response, review requests, and reporting on autopilot.`
**Why it matters:** Free-first positioning is a brand pillar. Hidden paid-dependency implication contradicts it.
**Recommended fix:** Add a pricing note: "Free tier covers 1000 ops/month, $9/mo above that." Positioned next to the Make.com mention.

---

#### I10. Paid-tool-first copy sweep — confirmed clean

**Files affected:** all 5 LANDINGs + all 5 TEMPLATEs
**What:** Searched for `sweet spot`, `industry standard`, `what everyone uses`, `most businesses use`. **Zero matches in any file.** Previously-flagged fixes confirmed landed:
- `NiceJob` in marketing-LANDING: **0 matches** (fix landed)
- `Superhuman` in ai-agents-LANDING: **0 matches** (fix landed)
**Why it matters:** Regression check — free-first brand rule currently holding.
**Recommended fix:** None (tracking only).

---

#### I11. "PlainBlack Creative Limited" in lander copyright lines

**Files affected:** all 5 LANDINGs + playbooks.html
**What:** Every footer copyright line reads `© 2026 PlainBlack Creative Limited.` Spec says brand is "PlainBlack only" and to flag "PlainBlack Creative" in customer-facing copy.
**Why it matters:** **Spec gap.** `PlainBlack Creative Limited` is the legal entity name, which must appear in copyright and T&Cs lines for legal validity in NZ/AU. The spec conflates brand (PlainBlack) with legal entity (PlainBlack Creative Limited), which are conventionally different. Flagging as a spec gap for Chat 3 to resolve — either (a) the spec is updated to allow legal-entity usage in copyright and nowhere else, or (b) the legal entity is trading as "PlainBlack" and the copyright line gets changed.
**Evidence:** Footer lines at 90-day L5171, roofing L4526, marketing L5231, ai-agents L5221, playbooks.html L685.
**Recommended fix:** Decide the brand/entity rule. If (a), codify in spec; if (b), edit 6 files.

---

## 5. Findings — Polish

#### P1. Duplicate `font-size: 3rem` in google-reviews `.paywall-price` — resolved by prior strip

**Files affected:** [google-reviews-TEMPLATE.html](playbooks/ready/google-reviews/ai-powered-google-reviews-TEMPLATE.html)
**What:** Previously flagged. Grep for `font-size: 3rem|font-size:3rem` returned 0 matches — the rule no longer exists because `.paywall-price` was stripped along with all paywall CSS in commit `a1e36bc`.
**Status:** ✅ Resolved as side-effect of paywall strip. No action.

---

#### P2. 90-day lander `[[PAIN_POINT]]` / `[[FEATURE_N_TITLE/DESC]]` placeholders in HTML comments

**Files affected:** [90-day-job-pipeline-LANDING.html:41-42](playbooks/ready/90-day-job-pipeline/90-day-job-pipeline-LANDING.html#L41-L42)
**What:** Lander file-header comment still lists `[[PAIN_POINT_1..3]]` and `[[FEATURE_N_TITLE/DESC]]` as documentation. Standard says "zero double-bracket placeholders in landers." Comments aren't customer-facing but they are in source.
**Why it matters:** Cosmetic. Signals that the lander was derived from a template and the documentation comment was never cleaned up.
**Recommended fix:** Delete those lines from the comment block.

---

#### P3. Accent-placeholder comments in google-reviews template

**Files affected:** [google-reviews-TEMPLATE.html:50,52-53,127-128](playbooks/ready/google-reviews/ai-powered-google-reviews-TEMPLATE.html)
**What:** Template's comment block references `[[ACCENT_COLOUR_HEX]]` and `[[ACCENT_COLOUR_DARK_HEX]]` as if these are placeholders, but the actual `--accent` value on L127 is the hardcoded `#3ecf8e`. Comments suggest a find-replace workflow that isn't wired up.
**Why it matters:** Documentation drift. Future template editor could believe the value needs replacing, when it's already hardcoded.
**Recommended fix:** Either remove the `[[ACCENT_COLOUR_HEX]]` comment block, or keep the placeholder documentation but clarify with `// default, override via find-replace` phrasing.

---

## 6. Architectural divergence — google-reviews

Documented only. Not for Chat 3 to fix — scoped for a future normalisation chat.

1. **IIFE pattern instead of DOMContentLoaded listener.**
   - [google-reviews-TEMPLATE.html:3543](playbooks/ready/google-reviews/ai-powered-google-reviews-TEMPLATE.html#L3543): `(function init() { loadState(); })();`
   - Other 4: use `document.addEventListener('DOMContentLoaded', ...)` (90-day L2497, roofing L3278, marketing L3807, ai-agents L3838).

2. **Inline `onclick="getAI('aiNN', '...full prompt string...')"` per section button.**
   - 10 matches across sections [L2740, 2805, 2871, 2968, 3033, 3096, 3160, 3225, 3289, 3355](playbooks/ready/google-reviews/ai-powered-google-reviews-TEMPLATE.html).
   - Other templates use either `AI_PROMPTS[idx]` (90-day) or `section.updatePrompt` on array-driven sections (roofing/marketing/ai-agents). google-reviews is the only template with prompt copy embedded directly in HTML onclick handlers.

3. **`[[METRO]]` placeholder alongside `[[REGION]]`.**
   - 16 matches of METRO+REGION combined in google-reviews, exclusively. None of the other 4 templates use `[[METRO]]`.
   - Not a fix — just means Make.com personalisation will need google-reviews-specific token handling.

These three together make google-reviews the odd sibling. Porting to the `SECTIONS` array pattern used in roofing/marketing/ai-agents would normalise architecture, but is a refactor not a fix.

---

## 7. Automation prep notes (for STAGE_2_AUTOMATION_PREP.md later)

Documented only. Not scheduled.

1. **Placeholder inventory per template — uneven.** Based on `[[` double-bracket grep:
   - roofing-ai: 178 `[[` tokens
   - marketing: 97
   - google-reviews: 209 (highest — includes the METRO token)
   - 90-day: 128
   - ai-agents: 98
   - **Make.com Scenario 1 personalisation step needs a per-template token list.** google-reviews will need its `[[METRO]]` handling; others don't. Every other placeholder token should be reconciled to a single master list so Make.com can iterate consistently.

2. **Webhook payload shape — all 5 landers post to Web3Forms.** Standard fields are common (owner_name, business_name, email, country, city, service, website, product_id, access_key). Extra hidden fields vary (subject, from_name in some). Make.com Scenario 1 parser should key off `product_id` to switch per-template personalisation logic.

3. **`product_id` hidden field values — all kebab-case and match folder name exactly:**
   - 90-day: `90-day-job-pipeline` ✓
   - google-reviews: `google-reviews` ✓
   - roofing-ai: `roofing-ai` ✓
   - marketing: `marketing` ✓
   - ai-agents: `ai-agents` ✓
   This is clean — one string value maps 1:1 to the folder path the generator uses as input.

4. **Access-model normalisation prerequisite.** Stage 2 (Make.com Scenario 1) needs every template to share a single access-flip mechanism. Currently zero templates have one (all stripped). **Recommended direction: match C1** — keep manual SOP as the gate, defer adding `const PAID = false` or `ACCESS_TOKEN_ENDPOINT` until Chat 5's generator, at which point the generator itself injects whichever model is right for that delivery. Do not reintroduce access-model code to templates just for Stage 2 prep.

5. **Template-specific quirks that complicate a shared personalisation script:**
   - google-reviews uses inline onclick prompt strings — Make.com's token-replacement needs to handle strings embedded in HTML attribute values, not just text content. Other 4 templates localise prompts inside `AI_PROMPTS[...]` arrays or `updatePrompt` fields on section objects, which are pure JS strings — easier targets.
   - 90-day uses `const AI_PROMPTS = [...]` (L2207) with index-based dispatch. roofing/marketing/ai-agents put prompts inside section objects. These two array-patterns are similar enough to share substitution rules; google-reviews's inline pattern is materially different.

---

## 8. Summary counts

| Severity | Count |
|---|---|
| Critical | 8 |
| Important | 11 |
| Polish | 3 |
| Architectural (documented, not scheduled) | 3 |
| Automation prep notes | 5 |

Total findings: **25** + 5 prep notes.

---

## Files read for this audit

All 11 files in scope were read:

1. [playbooks/ready/90-day-job-pipeline/90-day-job-pipeline-LANDING.html](playbooks/ready/90-day-job-pipeline/90-day-job-pipeline-LANDING.html) (5320 lines) — via lander-audit subagent
2. [playbooks/ready/google-reviews/ai-powered-google-reviews-LANDING.html](playbooks/ready/google-reviews/ai-powered-google-reviews-LANDING.html) (5034 lines) — via lander-audit subagent
3. [playbooks/ready/roofing-ai/roofing-ai-LANDING.html](playbooks/ready/roofing-ai/roofing-ai-LANDING.html) (4686 lines) — via lander-audit subagent
4. [playbooks/ready/marketing/marketing-LANDING.html](playbooks/ready/marketing/marketing-LANDING.html) (5398 lines) — via lander-audit subagent
5. [playbooks/ready/ai-agents/ai-agents-LANDING.html](playbooks/ready/ai-agents/ai-agents-LANDING.html) (5374 lines) — via lander-audit subagent
6. [playbooks/ready/90-day-job-pipeline/90-day-job-pipeline-TEMPLATE.html](playbooks/ready/90-day-job-pipeline/90-day-job-pipeline-TEMPLATE.html) (2514 lines) — targeted greps + prior-session knowledge from commit a1e36bc
7. [playbooks/ready/google-reviews/ai-powered-google-reviews-TEMPLATE.html](playbooks/ready/google-reviews/ai-powered-google-reviews-TEMPLATE.html) (3550 lines) — same
8. [playbooks/ready/roofing-ai/roofing-ai-TEMPLATE.html](playbooks/ready/roofing-ai/roofing-ai-TEMPLATE.html) (3284 lines) — same
9. [playbooks/ready/marketing/marketing-TEMPLATE.html](playbooks/ready/marketing/marketing-TEMPLATE.html) (4188 lines) — same
10. [playbooks/ready/ai-agents/ai-agents-TEMPLATE.html](playbooks/ready/ai-agents/ai-agents-TEMPLATE.html) (4221 lines) — same
11. [playbooks.html](playbooks.html) (868 lines) — read in full directly

**Spec references:** `/mnt/project/PLAINBLACK_BUILD_SPEC.md` and `/mnt/project/PLAINBLACK_MASTER.md` were not accessible from this working directory. Audit uses the standards embedded in the audit prompt, which appears to be an exhaustive subset of those specs. Any spec-gap items are flagged in findings (C1 recommendation language used verbatim per brief; I11 "PlainBlack Creative Limited" copyright legal-entity usage).

**Code changes made:** zero. Read-only audit. No files staged, committed, or pushed. Only one new file created: this audit document.
