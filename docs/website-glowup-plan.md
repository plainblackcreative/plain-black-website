# Plan — Website Glow-Up push

Working plan for turning PlainBlack toward standalone website builds + glow-ups as the primary sales focus. One outcome per session. Created 2026-06-09.

## Context (done)
- pb-bot system prompt rewritten to sell websites/glow-ups, anchored on Build Map. Added the 4 missing offerings (Build Map, First Fix, Brand Spark, Customer Translator). Deployed and verified live against the two questions that previously turned buyers away.
- Build Map lead capture confirmed live (`SUBMISSION_PARKED = false`, posts to pb-forms `client=pbcreative`).

## Remaining work

### 1. Verify the conversion path end-to-end
- No decision needed. Do first.
- The bot now funnels every website buyer to /tools/build-map. Confirm a real submission lands.
- Check pb-forms config maps `pbcreative` to Jayden's inbox; send one test Build Map and confirm receipt.
- Fix the mapping if missing. A working funnel that drops leads is worse than no funnel.

### 2. Services page glow-up  (the income lever — blocked on Jayden)
- Decisions Jayden owns:
  - Price: glow-up starting number (e.g. "from $X").
  - Prominence: does Glow-Up lead the services page, or sit as a peer package.
- Then: write copy + build the section on services.html in the dark/cinematic brand style (no SaaS cards, green as accent), anchored to Build Map as the on-ramp.
- Cross-check docs/REPO_SYSTEM_PROMPT.md and run the Design Self-Check before finalising.

### 3. Supporting copy pass  (small, after #2)
- Homepage: a line + Build Map link saying we build and glow-up websites.
- "Agency vs PlainBlack" comparison table + Services FAQ: add a website/glow-up row.
- Surface the "restaurant for food" blog as the positioning anchor, linked from services.

### 4. Red-team before merge  (pre-ship gate)
- Run /red-team as a hostile in-market buyer over the updated services page + Build Map.
- Fix P0s, then branch -> push -> review preview -> merge to main.

## Sequencing
1 anytime now. 2 once Jayden gives price + prominence. Then 3, then 4 as the gate before deploy.

## Guardrails (per CLAUDE.md)
- Branch, never main. Let Jayden review the diff or Cloudflare preview before merge.
- No em dashes. PlainBlack voice: plain, direct, slightly dry.
- Look before editing services.html / index.html: grep the target file first.
