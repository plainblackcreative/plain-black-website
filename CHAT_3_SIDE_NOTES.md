# Chat 3 side notes

Things noticed during the Chat 3 audit-fix pass that were out of scope. Not fixed here. For user review, to feed into a future chat.

## Audit line-number drift / factual errors

1. **Audit C7 incorrect.** Audit report claimed `google-reviews-LANDING.html` had "zero Meta Pixel tracking." It does not — the full Pixel block is present at L53–59 and a `fbq('track', 'Lead')` at L4941. Fix 6 C7 was skipped because the Pixel is already there. Audit subagent grep evidently missed these matches. Audit entry should be retracted in future revisions.

2. **Audit Fix 2 line references for roofing-ai-LANDING were stale.**
   - Audit said L2418, L2678, L2698 contained "within the hour".
   - Actual file had "within the hour" at L32, L34, L2418, L2591, L2678, L2698, L2751 (delivery-promise instances) plus L2435, L2519 (module content about storm outreach, not delivery).
   - I fixed all 7 delivery-promise instances and rephrased the 2 module-content instances to satisfy the verification gauntlet's strict `grep -rn "within the hour" = 0` requirement. The module-content rewrites were out of Fix 2's strict scope but needed to pass the gauntlet — flagging so the rewrite quality can be reviewed.
   - Module-content changes made:
     - L2435: `Outreach goes within the hour.` → `Outreach goes out fast.`
     - L2519: `Automated outreach to your target suburbs within the hour.` → `Automated outreach to your target suburbs, fast.`
   - If you want more specific language than "fast", a future copy pass can refine.

3. **Audit assumption that only 90-day + roofing had form-label drift was wrong.**
   - Fix 8 said `google-reviews`, `marketing`, `ai-agents` "likely already use `Primary service`". They did not. All three used `Type of business`.
   - I extended Fix 8 to all 5 landers. Every lander now has label `Primary service` on field 5.

## Assets

1. **`/assets/og-default.jpg` does not exist yet.** Fix 10 wrote this path into every lander's `og:image` and `twitter:image` meta tags. Social shares will currently show no preview image until the asset is created. Action: create this file (JPEG, ideally 1200×630 for optimal OG ratio) and place it at `/assets/og-default.jpg`.

2. **Per-product OG images as a future enhancement.** Using a single shared `og-default.jpg` is acceptable for now but per-product images (one per lander) would improve social share CTRs. Out of scope for Chat 3.

## Minor code quirks noticed during reads

1. **Marketing lander module mentions LSA (Local Services Ads)** in body copy (L3118, L3174, L3177). LSA is a US-only product. If Marketing playbook is sold into AU/NZ, that mention is either stale or needs AU/NZ equivalents. Flagged for product-copy review in the future "Optional-sections mechanism rollout" chat referenced by the original audit's I2.

2. **google-reviews template comment block at L54 is a 107,672-character line** containing base64-encoded logo data inside an HTML comment. Not a bug — probably an example value demonstrating how the logo placeholder resolves. Worth awareness: this single line blows out file size and makes structured diffs in that region awkward.

3. **Marketing + ai-agents templates use `--accent: #3ecf8e` (mint)** hardcoded with no placeholder commentary. This is correct per spec. google-reviews had the commentary residue (cleaned up by Fix 13). 90-day and roofing have steel blue accent. No further action.

4. **playbooks.html FAQ only has 7 questions** (L605–640 in the old state). The new 9-question locked FAQ order Chat 3 introduced applies to the 5 landers, not the main-site playbooks index. playbooks.html has its own separate FAQ which already contains the correct privacy wording at L595 (outside FAQ, in a security callout) and at L634 (FAQ Q6 — "Is my playbook secure?"). No action for this pass, flagging for later consistency review.

## Things I did NOT change

- Paywall C1 (stripped state of all templates) — explicitly routed to Chat 5 per audit brief.
- I2 optional-sections mechanism — routed to its own chat.
- Architectural divergence (google-reviews IIFE, inline onclick prompts, `[[METRO]]`) — deferred for a future normalisation chat.
- I11 "PlainBlack Creative Limited" in copyright lines — spec clarification per Rule 6 of this prompt (legal entity permitted in copyright), no code changes needed.

## Verification gauntlet adjustments

The gauntlet's `grep -rn "within the hour" playbooks/ready/*/LANDING.html = 0` requirement forced fixes to module-content copy that was semantically correct but matched the string. If the gauntlet's intent was "no delivery promises say within the hour" then my fixes satisfy the intent. If the intent was narrower than that, see point 2 in the "audit line-number drift" section above for the module-content rewrites.
