# Service Overhaul Inputs

Harvested verbatim from Hub workspaces P-4, P-8, P-12, P-19 and P-23 on 2026-06-12; originals deleted after migration; this doc is Session 1 ingest material for the service architecture bible (docs/SERVICE_ARCHITECTURE.md). Every relevant item is reproduced in full under its theme; borderline items are parked in Appendix A for Jay to call; every off-topic item is logged in Appendix B so nothing vanishes unaccounted. Light markdown cleanup of the original HTML was applied, but no content was trimmed. Punctuation note: item title lines that carried em dashes in the original Hub HTML have been rendered with commas in this document per PlainBlack brand-voice rules (no em dashes in any PlainBlack output); the substitution is mechanical and consistent, and content meaning is preserved throughout.

## Per-workspace counts

| Workspace | Items harvested | Relevant | Borderline | Off-topic |
| --- | --- | --- | --- | --- |
| P-4 | 8 | 1 | 3 | 4 |
| P-8 | 57 | 31 | 15 | 11 |
| P-12 | 52 | 48 | 3 | 1 |
| P-19 | 11 | 6 | 4 | 1 |
| P-23 | 7 | 2 | 2 | 3 |
| **Total** | **135** | **88** | **27** | **20** |

---

## Capabilities & service definitions

### Fold Into PlainBlack Services (P-12 / I-686)

**Fold Into PlainBlack Services**, done-for-you AI engagements consolidated from the retired P-17 archive. (MAIA = a nickname for PlainBlack's AI, not a separate brand or project.)

*Sources: ex-I-112, I-113, I-169, I-145, I-201, I-129. These are PlainBlack's own service offerings, reframed out of the standalone-brand framing.*

##### Service surfaces (done-for-you)

- **Custom AI bots & models** (primary revenue): chatbots, virtual assistants, task-automation bots, predictive analytics, recommendation engines, specialised ML.
- **AI voice agents**: after-hours call pickup. Pitch: "Don't want calls after hours? They'll call your competitor while you watch Netflix. We pick up." (Full voice-agent detail below; also belongs on P-21 AI Agents.)
- **Cold-outreach AI**: build the outbound demo and the demo IS the sale, self-demonstrating.
- **AI websites** (dynamic personalisation per referral, see storefront below), **AI logo design**, **AI ad copy & content** (SEO-optimised, conversion-focused).
- **Consulting wrapper**: educational content (blogs/demos/explainers), 1:1 or team consultation, custom setup & implementation, bespoke solution builds, a discovery phase to find untapped opportunities.

**Positioning:** "human is optional but available", AI does the work, humans do checks and the out-of-scope bits; an expert-AI frame. **Target:** Papamoa / Tauranga SMEs first (patch density = the edge; same pool as Blackberry, Pizza Pundits, ReDefined, Barber Tom). **Other use cases to spec:** after-hours web sales chat, review-reply bot, inbox-triage bot, booking/quote bot for tradies, recurring weekly-wrap report generator.

##### Storefront / landing page (ex-I-113)

Five iterations captured V1→V5. **V5 (dynamic personalisation per referral source) is recommended** and buildable on PB's stack (Astro + Cloudflare Pages + a `?from=` query param). Each outbound link (LinkedIn DM, email sig, ad, referral) carries a `?from=` tag; the page swaps hero + featured service + case study to match. Every visitor gets their own referral link (points loop). Fallback: no tag → V4 generic. Brand line through all versions: "PB delivers in seconds what would take a human days; humans optional but available." (V1 generic 10-section template, V2 "AI runs it all", V3 persona-fronted, V4 full agency suite incl. referral rewards, V5 dynamic, full verbatim drafts were preserved on I-113.)

##### Outreach motion + engagement pricing (ex-I-169)

- Email-first, **no cold-calling**. Apology-framed opener: "Heads-up, sending an email that might be mistaken for spam. I wouldn't bother you if it wasn't worthwhile for you."
- 3-explanation diagnostic (your business is irrelevant to AI [rhetorical] / you're hesitant where to start / someone's been naive about it) → forces gentle self-recognition.
- Two-outcome frame: zero risk (small low-stakes pilots) vs massive reward (save money + on employees, 3-day weekend, sales up). Deliberately asymmetric.
- **Engagement pricing ladder:** 1-week audit + plan **~$1,000** (set-and-forget) · 1-month implementation **$5k–$15k** (mid, to calibrate) · 6-month project **$100k+** (flagship anchor; needs ≥1 case study before quoting the number, until then say "for complex operations"). The $100k tier mostly exists to make $5k feel reasonable and $1k feel cheap.
- Intake mechanic: AI quote-request form (free-text → AI extracts context) + follow-up call (Jay or AI). *The intake GPT tool itself → Tools bucket.*
- Risk: the 3-explanation diagnostic can read smug, test on 5 friendly recipients first. "Jet skis" line for SMB; swap to "more time with family" for corporate.

##### "AI Proficiencies & Help" funnel (ex-I-145)

Hero: "If you've heard of it, you can have it." A menu of proficiencies, each = one PB asset (blog + landing section + demo + social). Pick-a-proficiency CTA → automated response with a proficiency-specific demo + scope + price → books a call. **Defensible position:** generalist + cutting-edge + transparent about real-vs-hype (e.g. "Chatbots, still relevant?", "AI Logos, you sure?") vs agencies who must say yes to everything. Rhythm: one proficiency/week → blog; after ~8 shipped, advertise to traffic. First 3: Custom GPT + AI Agent + Templates. *Each proficiency's packaged build → Playbooks; the "RTT Automation" proficiency meaning is unconfirmed → Unsure.*

##### Voice-agent service (ex-I-201)

- Done-for-you voicemail/receptionist for local service businesses. Build paths: **(A) white-label Vapi.ai / Bland.ai / Retell** (fast, lower margin), recommended first; (B) Twilio + ElevenLabs + Claude (higher margin/control, more maintenance).
- **Pricing: $300–$500 setup + $100–$200/mo.** Does: answer calls, take messages, book appointments, send summaries. Verticals: mechanics, cafes, trades.
- **Inbound** (after-hours pickup) + **outbound** (sales-qualifying, appointment confirmations, review-request, lead reactivation), sell as one in/out package.
- AI appointment-setting script, one-question filter: "Are you looking to implement AI in your business right now? Yes, no, or dunno only." Yes → offer 3 things PB does + book a Calendly slot; No → quarterly check-in list; Dunno → send a 5-min explainer + capture email.
- Open: NZ telemarketing regs (Fair Trading / Privacy / Do-Not-Call + AI disclosure), per-minute cost economics, NZ number sourcing, NZ-accent voice testing, pilot-vertical pick. *The Vapi demo as a self-selling tool → Tools.*

##### Meta-ads delivery reality / guardrail (ex-I-129)

Honest SOW boundary: AI does ~80% (copy, hooks, creative, audiences, structure, strategy, briefs) but a human must own the Business Manager + billing + asset/Pixel connection + final sign-off (Meta policy + legal). Pitch line: "AI does 80% of the work in 30 minutes; PB owns the strategy + relationship; you own the account + billing." Use as the SOW template for ReDefined and any ads engagement. Don't oversell "humans optional" on the *account* layer.

**Routing note:** voice agents + the AI marketing-agent material also belong on **P-21 (AI Agents)**, decide the service-line home during the fold.

---

### Plain Black V3 Intake Schema & Client Brief Template (P-12 / I-205)

**Plain Black V3 Intake Schema & Client Brief Template, internal 10-section structured intake form for capturing new client briefs.** Deeper than the existing 15-min Discovery Interview Framework: this is the post-conversation brief, includes internal PB-only notes section.

Attached: `PlainBlack_V3_Intake_Template.docx`, Word template, currently version 3.

#### The 10 sections (full schema preserved verbatim)

| # | Section | Fields |
| --- | --- | --- |
| 1 | **Business Overview** | Business Name · Location(s) · Industry / Niche · Years in Operation · Primary Services |
| 2 | **Target Market** | Ideal Customer Description · Demographics · Psychographics · Current Customer Quality (High / Low / Mixed) |
| 3 | **Commercial Metrics** | Average Job Value · Minimum Acceptable Job · Close Rate (%) · Monthly Revenue Target |
| 4 | **Current Marketing** | Channels Used · What’s Working · What’s Not · Ad Spend (if any) |
| 5 | **Competitive Landscape** | Main Competitors · What They Do Well · Where They’re Weak |
| 6 | **Brand Positioning** | How They Currently Describe Themselves · Desired Positioning · Tone of Voice |
| 7 | **Constraints & Opportunities** | Budget Range · Time Constraints · Operational Limits · Growth Opportunities |
| 8 | **Goals (Next 90 Days)** | Primary Goal · Secondary Goals |
| 9 | **Risk Factors** | What Could Cause Failure · Sales Bottlenecks · Operational Bottlenecks |
| 10 | **Plain Black Notes (Internal)** | Strategic Observations · Recommended Direction · Upsell Potential |

#### When this template gets used

- **Trigger:** after the first-touch 15-min Discovery Interview returns a yes-let’s-go signal.
- **Author:** Jay fills sections 1–9 with the client (or from notes after a longer working session); section 10 is PB-internal only.
- **Downstream:** feeds the brief into PB delivery (Playbooks personalisation, service-scope contract, project plan).

#### Discovery Interview vs V3 Intake (sister tools)

| Axis | Discovery Interview Framework | V3 Intake Schema |
| --- | --- | --- |
| Length | 15-min pulse-check | Full structured brief |
| Timing | First-touch with warm prospect | Post-conversation, pre-engagement |
| Audience for output | Both sides | Mostly internal PB delivery |
| Includes PB-only notes | No | Yes (section 10) |

#### Open questions

- **Delivery format**, Word doc · Notion page · Google Doc · a Make.com form that writes to a sheet? Each has trade-offs for client-vs-internal field handling.
- **Section 10 visibility**, keep as a separate sheet / page if delivered via shared tool, or duplicate the brief into a client-version and an internal-version on save?
- **What changed v1 → v2 → v3**, worth a changelog if this becomes a living artefact.
- **Industry / niche field (section 1)**, controlled vocabulary or free text? Controlled helps if the brief feeds the Playbooks template-routing logic.
- **Productisation angle**, this template + the Discovery Framework together could ship as a sellable diagnostic Playbook (“PB Brief-in-a-Box”). Worth holding the thought.

#### Cross-card relevance

- **Marketing & Lead-Gen Ideas, PB Discovery Interview Framework** (item `mpj110yu-51b431d1c`), sister tool, first-touch 15-min version.
- **PB Services, Playbook delivery automation** (item `mpj1nx4j-1j6o1dhd`), the intake-then-deliver chain. Output of this template feeds the Make.com placeholder personalisation step.
- **MAIA AI Consulting**, MAIA-specific engagements would use this template too, possibly with an AI-services-specific extension to section 1.
- **Active prospects**, Blackberry, Pizza Pundits, Battle Axe, Anita Pitu, Redefined, Tasman, etc., first candidates to run the V3 brief against once a yes-let’s-go signal lands.
**Next:** Jay drag-drops `PlainBlack_V3_Intake_Template.docx` onto this item via the inbox UI (item ID below). Then pick one in-flight prospect to run the brief against as a real-world test, output gaps inform v4.

Comments:

**Jay:**

> **[Cross-link, downstream playbook generator engine]**
>
> New item on this card (id `mpj34ri2-h1c71e1q1e`): **Plain Black Future-Proof Playbook Generation Framework**. 12-section master SOP for how Claude generates client playbooks from intake data. Includes the master Claude prompt template, QC checklist, intake→strategy mapping, and channel framework examples (Meta + Google Ads).
>
> **Why it matters here:** the V3 intake fields map almost 1:1 onto the framework’s intake-→-strategy table (industry / location / target customer / commercial metrics / current assets / capacity / goals / seasonality). Worth tightening field naming between the two so the same data flows directly into the prompt.

**Jay:**

> **[Triage answers, 24 May 2026]**
>
> *V3 Intake Schema*
>
> 1. **Delivery format for the intake?** → Captured in comment *Our website?*
> 2. **Section 10 visibility model?** → Captured in comment *I need context *
> 3. **Maintain a v1→v2→v3 changelog?** → Skip / unsure
> 4. **Industry / niche field, controlled vocab or free text?** → Free text with suggestions
> 5. **Productise as "PB Brief-in-a-Box"?** → Skip / unsure

**Jay:**

> ↩ Merged from "V3 Intake Schema & Client Brief Template, companion to V2 Prompt Pack. The 10-section structured intake that feeds the V2 Intake-to-Output prompt. Fill this in for every new playbook engagement befor", originally captured by someone on 2026-05-24, full content of someone's item:
>
> V3 Intake Schema & Client Brief Template, companion to V2 Prompt Pack. The 10-section structured intake that feeds the V2 Intake-to-Output prompt. Fill this in for every new playbook engagement befor

---

### V3 Intake Schema & Client Brief Template (P-12 / I-295)

**V3 Intake Schema & Client Brief Template, companion to V2 Prompt Pack.** The 10-section structured intake that feeds the V2 Intake-to-Output prompt. Fill this in for every new playbook engagement before running the prompt pack.

#### Why this exists

The V2 Prompt Pack assumes a well-formed intake. V3 is that intake, a strict 10-section schema covering business, market, money, marketing, competitors, positioning, constraints, goals, risks, and internal PB notes. No section is optional. Empty fields force the discovery call to surface what is missing.

#### The 10 sections, verbatim

##### 1. Business Overview

- Business Name
- Location(s)
- Industry/Niche
- Years in Operation
- Primary Services

##### 2. Target Market

- Ideal Customer Description
- Demographics
- Psychographics
- Current Customer Quality (High/Low/Mixed)

##### 3. Commercial Metrics

- Average Job Value
- Minimum Acceptable Job
- Close Rate (%)
- Monthly Revenue Target

##### 4. Current Marketing

- Channels Used
- What is Working
- What is Not
- Ad Spend (if any)

##### 5. Competitive Landscape

- Main Competitors
- What They Do Well
- Where They Are Weak

##### 6. Brand Positioning

- How They Currently Describe Themselves
- Desired Positioning
- Tone of Voice

##### 7. Constraints & Opportunities

- Budget Range
- Time Constraints
- Operational Limits
- Growth Opportunities

##### 8. Goals (Next 90 Days)

- Primary Goal
- Secondary Goals

##### 9. Risk Factors

- What Could Cause Failure
- Sales Bottlenecks
- Operational Bottlenecks

##### 10. Plain Black Notes (Internal)

- Strategic Observations
- Recommended Direction
- Upsell Potential

#### How it fits the stack

| Layer | Purpose | Artefact |
| --- | --- | --- |
| Intake (V3) | Capture the 10-section client brief | This template |
| Prompt Pack (V2) | Convert brief into playbook + ad copy + QA | PlainBlack_V2_Prompt_Pack |
| Framework (V1) | Original structure + non-negotiables | PlainBlack_Future_Proof_Playbook_Framework |

#### Operational notes

- Sections 1-9 are **client-facing** and can be filled in collaboratively on a discovery call.
- Section 10 is **internal only**, PB strategic observations, recommended direction, upsell potential. Never share verbatim.
- Current Customer Quality is the diagnostic that often unlocks the real positioning problem. If High then optimise. If Low then reposition. If Mixed then segment.
- What Could Cause Failure forces the client to name the risk upfront, protects PB from being blamed for foreseeable issues.

#### Cross-card relevance

- PB Services, V1 framework *mpj34ri2-h1c71e1q1e*, V2 prompt pack *mpj92172-z1f91c012*, this V3 intake = the canonical 3-layer playbook engine.
- Credibility & Media, section 6 (Brand Positioning) overlaps the brand-bible stack; tone of voice ladders into PB Voice & Style Guide.
- Marketing & Lead-Gen Ideas, Discovery Interview Framework should mirror sections 1-9.

Next: cross-reference Discovery Interview Framework on Marketing & Lead-Gen Ideas, confirm question flow aligns to V3 sections 1-9 in order. Source file safe to delete.

---

### Two new productisable concepts from this brain dump (P-8 / I-163)

**Two new productisable concepts from this brain dump, both about optimising for AI ecosystems instead of (or as well as) Google search.**

---

**1. SAO, "SEO but for AI search"**

> "SAO, like SEO for google, but for chat gpt, gemini"

**What it is:** structured optimisation for visibility inside AI answer engines (ChatGPT, Claude, Gemini, Perplexity, Google AI Overviews), not search-result rankings.

**Industry term check:** the more common labels are GEO (Generative Engine Optimisation) and AEO (Answer Engine Optimisation). "SAO" is Jay coinage; could be a deliberate PB brand differentiator OR conflict with the established terms. Decision parked. Either way the practice is the same.

**What an SAO engagement covers (mirrors the Build-Competitive-Directory item on Papamoa.info card)**

- Site-wide schema markup (JSON-LD, LocalBusiness sub-types, FAQPage, AggregateRating, etc.)
- `llms.txt` at root
- Machine-readable structured feed / API endpoint
- "Deep content" pages, 200+ word descriptions, FAQ blocks, editorial framing
- NAP consistency across the web
- AI-visibility audit per query ("ask ChatGPT what is the best X in your town and see if you appear")

**Pricing fit:** sits comfortably as a $999 one-off niche audit + 90-day fix sprint. Matches Area 2 (AIO & SEO) of the focus list on MAIA Specialisation Thesis item.

---

**2. Google Ecosystem Supercharge**

> "Google Ecosystem Supercharge, Gmail, Drive, Gemini, YouTube"

**What it is:** a productised audit + optimisation pass across a client Google ecosystem.

| Surface | What gets done |
| --- | --- |
| Gmail | Filters / labels / Gemini smart-reply tuning. Signature setup. Inbox automation rules. Cross-link to Gmail profile animation chore + email migration jkbrownnz→info@ (Hub + Inbox). |
| Drive | Folder structure standardisation. Per-client asset bundles (cross-link to Websites v2, Google Drive Folder with logins/resources is part of the $2k inclusions). Permission audit. Gemini-on-Drive enabled. |
| Gemini | Custom Gem setup per business workflow. Voice profile, knowledge attached, system instructions. Sister to Custom GPT focus area. |
| YouTube | Channel branding + chapter / description / tag optimisation for AI surfacing. Pairs with the new "AI-and-I make things better" YT channel idea (Content engine batch on this card). |

**Pricing fit:** $999 one-off setup. Could be the v1 of the $1k pay-the-bills package, high perceived value, one-day delivery via AI tooling.

---

**Why these two belong on this card (parked product concepts)**

Both are buildable services, both fit the $1k-profit-package mould, both demonstrate the maximum-AI-proficiency positioning without requiring a custom build.

**Cross-card relevance**

- **MAIA Specialisation Thesis** (MAIA card), Area 2 (AIO & SEO) candidate package
- **Build Competitive Directory** (Papamoa.info card), SAO uses the same schema + llms.txt + machine-readable architecture, narrower scope
- **Niche Audit Templates** (PB Services), SAO is the AI-search-visibility subset of those audits
- **Websites v2 No Brainer Retainer** (PB Services), Drive asset folder is already an inclusion; Google Ecosystem Supercharge is the formalised version
- **AI Proficiencies funnel** (MAIA), both qualify as proficiency entries

**Next:** pick one (Google Ecosystem Supercharge is the easier sell + faster template). Build the deliverable template. Run it on Jay own setup as the demo. Pitch 5 warm leads.

Comments:

**Jay (2026-05-23T12:53:00.956Z):**

> **[Naming reconciliation, GEO is the term Jay is now using]**
>
> The "SAO" naming flag on this item is resolved: Jay has adopted the industry-standard **GEO (Generative Engine Optimisation)** for the AI-search-visibility work, per the Carwyn directories pitch (Papamoa.info card, item `mpicmq0u-1n1gtd155`).
>
> So PB external-facing copy should use GEO, not SAO. SAO can stay as an internal-PB joke / Jay-coinage if useful.
>
> The Google Ecosystem Supercharge half of this item is unaffected, still a clean productisable $999 service line.

---

### Productised AI avatar UGC service (P-8 / I-164)

**Productised AI avatar UGC service, multi-language troupe, product/brand integration, with Jay-in-person tier available for the clients who want a real human in the lambo.**

**The offering**

- Troupe of AI avatars across languages, demographics, vibes, each can be activated for a brand-integration shoot without anyone leaving the desk
- Product placement / lifestyle integration, avatar holding the brand item, wearing the brand, using the service, eating the food
- Media sets, backgrounds, settings, scenes pre-built for repeatable shoots
- Outputs: shorts (Tentacles), product photography style stills, lifestyle reels

**The Jay-in-person tier (his words, verbatim)**

> "I can come for a free dinner and dress & diamonds, or crash the photoshoot's lambo, or LSKD it for a run/hoot of the Mount."

Read: there is also a real-human version. Jay shows up to dinner, the photoshoot, or the run, depending on the brand. Higher price point, lower volume, real footage and an actual face. Sits above the AI avatar tier.

**The ladder**

| Tier | Delivery | Pricing range |
| --- | --- | --- |
| AI Avatar, single language | Pick one persona + scene + product. Output: shorts pack. | $199–$499 per shoot |
| AI Avatar, multi-language troupe | Same content output in 3–5 languages for international brands. | $499–$999 per shoot |
| Jay shows up | Dinner / photoshoot / Mount activity. Real human, real footage, brand visible. | Negotiable, premium |

**Why both tiers in the same item**

Brands often start cheap (AI avatar test) and graduate to the real-human tier once they see the conversion rate. Selling both as one ladder catches both ends of the budget spectrum without splitting the brand pitch.

**Connection to existing PB avatar work**

- **4 existing PB avatars** (ai-avatar-system: MAIA, LUNA, KAYLA, SHAPERMINT-MOM), these are content characters with established personas. Could be the v1 troupe for this service if they get repurposed.
- **HeyGen Ian videos** (blog production upgrade on Hub + Inbox), same avatar-tech stack
- **Matrix-style chatbot UI** (MAIA card), could be the visual treatment for the avatar interaction layer
- **MAIA persona naming conflict** (MAIA AI Consulting card), if MAIA becomes the consulting brand AND a UGC avatar, the brand identity needs to handle both. Decision still parked.

**Open questions**

- Tool, HeyGen for video avatars (already in PB shortcuts), Synthesia, D-ID, Captions, Hailuo for multi-language. Which one earns the production-default slot?
- Disclosure, must AI-generated content be labelled? NZ FTC rules + the new platform rules (Meta, TikTok) are tightening on this. Default-disclose with a small "AI-made" badge.
- Image rights, when avatars closely resemble real people, deepfake-ish risk. Stick to clearly-stylised avatars, not photoreal lookalikes of real people.
- Brand safety, what brands does PB take? Not gambling, not crypto-pump, not anything that conflicts with the existing client list (one-per-industry rule from PapaMassive).

**Cross-card relevance**

- **Tentacles + Content/UGC** (this card), the troupe IS Tentacles' content production engine. Jay-in-person tier feeds the Tentacles' "actually shows up" content.
- **ai-avatar-system existing personas** (4 PB avatars on file), repurpose candidates
- **MAIA AI Consulting**, proficiency content (UGC Content, character) maps directly
- **Blog production upgrade** (Hub + Inbox), HeyGen Ian videos sit in this same family
- **"AI for wellbeing not wage savings"** positioning (niche-lock motion this card), AI avatars do the boring shoots so the brand keeps the budget for actual humans on important stuff

**Next:** pick one PB-existing avatar (probably MAIA or LUNA depending on the naming-resolution outcome). Produce one product-integration short with a real PB product (Blog Generator? Inbox Hero? Build Map?). Use as the case study / portfolio piece. Then pitch.

Comments:

**Jay (2026-05-24T07:57:49.966Z):**

> **[Triage answers, 24 May 2026]**
>
> *Avatar / AI video*
>
> 1. **Production default tool?** → HeyGen
> 2. **Disclosure, small "AI-made" badge by default?** → No, only when required
> 3. **Image rights, stylised vs photoreal?** → Photoreal OK with consent
> 4. **Brand safety boundaries?** → Skip / unsure

---

### Answer Engine Optimisation (AEO) (P-8 / I-196)

**Answer Engine Optimisation (AEO), the AI-search extension of the visibility / citation play.** Brief Jay parked: definition, how it differs from SEO, implementation pattern, plus two tools to try (Custom GPT for search-engine intelligence + Gemini GEMS for the Google equivalent).

#### What AEO is
A specialised SEO strategy focused on making content discoverable and relevant to AI-powered answer engines, **ChatGPT, Google’s AI Overviews, Perplexity**. The aim: be directly cited or summarised by these AI systems rather than just ranking in traditional SERPs.

- **Evolving SEO**, not a replacement, an evolution.
- **Direct answers**, clear, concise, accurate answers optimised for AI understanding + summarisation.
- **Beyond rankings**, goal is to be *featured in AI-generated answers*, not just on a results page.

#### AEO vs traditional SEO

| Axis | Traditional SEO | AEO |
| --- | --- | --- |
| **Focus** | High rankings in SERPs | Featured in AI-generated answers |
| **Content strategy** | Keyword + link-driven | Clarity, conciseness, structured info AI can parse + summarise |
| **Audience** | Human reader first | How AI processes & understands info (still readable for humans) |

#### How to implement AEO

1. **Optimise for AI understanding**, headings, bullet points, clear language AI can parse.
2. **Create FAQ pages & how-to guides**, formats AI summarises well.
3. **Use schema markup**, help AI understand context + structure.
4. **Build authority**, high-quality, authoritative content AI trusts.
5. **Track & analyse**, specialised tools to measure how content is featured in AI search; adjust.

#### Why it matters

- **Increased visibility**, AI-powered search is growing fast; AEO is how you appear there.
- **Pre-qualified leads**, AI citations often link back, bringing highly engaged users.
- **Future-proofing**, as AI search evolves, AEO becomes critical for staying relevant.

#### Jay’s action notes

| Action | What to try |
| --- | --- |
| **Custom GPT & search engine intelligence** | Spin up a Custom GPT for AEO / search-intel research workflows. What does AI-search visibility look like for a target query? |
| **Use Google’s version** | Gemini **GEMS**, Google’s custom-agent equivalent. Worth a parallel build to compare answer surfaces (ChatGPT vs Gemini vs Perplexity). |
| **Goal** | *Ranking in AI search*. |

#### Open questions for PB application

- Does AEO become a PB service offering (audit + implement) or just a posture across all PB content + client work?
- Which PB-owned properties get the AEO treatment first as a proof-of-citation? PB site, TaurangaNZ.info, Papamoa.info, Hub + Inbox marketing pages?
- What tracking tools matter? Need a shortlist (e.g. Perplexity Analytics, AI Search Console alternatives, manual citation tracking).
- Schema markup, PB site coverage today vs target; what’s the gap?

#### Cross-card relevance

- **MAIA AI Consulting**, AEO is a natural productised consulting offer (audit + structured-content rewrite + schema). Could be a MAIA service line or a Playbook.
- **Marketing & Lead-Gen Ideas**, AEO ties into the content-engine + niche-lock playbooks already filed there. Structured FAQ + how-to content is the lead-gen lever.
- **Claude Workflow**, the “Custom GPT / Gemini GEMS for search intel” action overlaps Jay’s research on AI workflows.
- **PB Services**, if AEO becomes a service line, it sits next to MAIA / Recruitment / AI Music. Pricing question collapses into the Playbook umbrella decision.
**Next:** set up a Custom GPT + a Gemini GEM for AEO research; pick one PB property as the proof-of-citation testbed; come back to package as service vs posture.

Comments:

**Jay (2026-05-24T00:58:25.422Z):**

> **[Cross-link, AEO is one of the strongest gaps for PB]**
>
> Market intelligence report filed on this card (id `mpj2jmo7-1jp1o1741d`) reports three AEO-relevant signals:
>
> - **Pattern 4:** Productized one-time AEO audit-and-fix at $500–$2,500 is genuine white space. Most agencies still sell AEO as a retainer.
> - **Gap 3:** AU/NZ-specific AEO/GEO is wide open, all credible operators US/UK-based.
> - **Gap 4:** Quarterly proprietary research moat is unclaimed in AU/NZ. First Page Sage owns it in the US.
> **Why it matters here:** AEO can become PB’s flagship category-claim move, not just “another tactic.” Quarterly “State of NZ AI search” report is cheap to produce and category-defining.

**Jay (2026-05-24T07:49:26.529Z):**

> **[Triage answers, 24 May 2026]**
>
> *AEO*
>
> 1. **AEO as a PB service or a posture?** → Skip / unsure
> 2. **Which PB properties get AEO first?** → Skip / unsure
> 3. **Tracking tools shortlist?** → Need research
> 4. **Schema markup gap on PB site?** → Need audit

**PlainBlack (2026-06-12T04:57:37.005Z):**

> [Triage P-19] Moved from P-19 Credibility & Media → P-8 Marketing & Lead-Gen Ideas during workspace re-sort.

---

### HUBS-as-a-service (P-8 / I-675)

**HUBS-as-a-service, productise the PB admin Hub for other businesses.**

- "One place for everything", same value prop as plainblack-admin (Hub + Inbox + tools), for any business.
- Pricing: **$99 setup + domain cost** (or $0 if they bring a domain), OR **$99/mo**.
- Same shape as the Websites service line (PB Services), productised flat-fee, AI-tooled delivery.
- Each client gets their own subdomain instance with their own card layout.

*Exploded from I-148 (Productisation ideas batch), see parent for cross-card context.*

---

### Interactive Restaurant Menus (P-8 / I-676)

**Interactive Restaurant Menus, HTML-based, hosted by PB.**

- Jay: "HTML Menus are epic with Claude."
- Each restaurant gets a menu page hosted by PB. Real photos (supplied). Easy to update (PB on request, or self-service form).
- Pairs with the Cafe niche audit template (PB Services), every cafe audit upsells "you need a real HTML menu, here is yours."
- Blackberry Eatery already in flight as Cafe v1, this could be the deliverable.
- Pricing: $99 setup + small monthly hosting, or one-off ~$199.

*Exploded from I-148 (Productisation ideas batch).*

---

### "Launch an Online Business for an Offline Brand" (P-8 / I-679)

**"Launch an Online Business for an Offline Brand", productised service.**

- For businesses that exist physically but have zero online presence, small tradies, market-stall sellers, sole operators.
- Package: brand name + landing page + GBP + 1 social + a single payment flow. Done in 1 week. $499 or $999 tier.
- Same sales motion as PapaMassive Starter (PB Services) but one-off setup, not ongoing retainer.

*Exploded from I-148 (Productisation ideas batch).*

---

### Flagship blog (P-8 / I-684)

**Flagship blog: "Industries most likely impacted by AI in 2026."**

- A flagship long-form blog. Sits at the top of the AI Proficiencies funnel (MAIA AI Consulting).
- Industry-by-industry breakdown, cafes, gyms, real estate, trades, retail, hospitality, what gets automated, amplified, or dies. Each industry is a hook into a PB service.

*Exploded from I-147. Funnel home overlaps P-17 MAIA, cross-link.*

---

### Playbook idea archive (P-12 / I-256)

**Playbook idea archive: AI use case for Cafes, Review Response & Reputation Manager, with IG/FB DM bot as the upsell.**

#### The pitch (verbatim)

> “I’ll set up an AI system that automatically responds to every Google and Facebook review, 5-star or 1-star, within minutes, in your café’s voice, so you never ignore a customer again.”

#### Why it lands with café owners

- Slammed during rushes, never respond to reviews.
- Unanswered negative reviews kill walk-in traffic.
- Google rewards active responders with better local rankings.

#### What gets built
Make.com + Claude/ChatGPT workflow that monitors Google Business Profile for new reviews and auto-drafts (or auto-sends) personalised responses matching the café’s tone.

#### Closer (verbatim)

> “Cafés that respond to reviews consistently rank higher on Google Maps. More visibility = more foot traffic. I handle it all for $X/month.”

#### Bonus upsell
AI chatbot on IG/FB DMs that auto-answers “Are you open Sunday?” / “Do you have oat milk?” type questions. Saves the owner 20+ interruptions a week.

#### Cross-card relevance (light)

- **AI Agents, AI Marketing Agent POC** (item `mpj1f455-1gll13vh`), review-request mechanic is already capability tile #4 (review requests + follow-up SMS). This is the auto-response extension.
- **AI Agents, QR-code retention + ManyChat templates** (items `mpj1qymw-1f1b01n110` + `mpj1r0aa-51nt17u1q`), cover the DM-bot upsell substrate.
- **The Wagon Gourmet Burgers (Catherine)** (card `mpj3et37-181j1g1oq2`), first cafe-ish prospect to pitch this to.
- **Sugo (Tauranga)** (card `mpj5qteg-f14ao414`), second hospitality candidate.
- **Papamoa Exclusive Directory** (item `mpj3z41h-1mo17j1415`), Cafe is named slot #2 in the directory; this playbook is the natural member benefit.
- **PB Services, Playbook backlog** (item `mpj5ws90-1h10yh1br`), sibling concept.

---

### Market intelligence report (P-12 / I-211)

**Market intelligence report, “How Top Operators Sell Productized, Custom-Built AI-Powered Web Tools to Small Businesses.”** 21-page report commissioned for PlainBlack: AU/NZ/US/UK/CA bias, deliverables $50–$5,000, 2024–2026. 18 operator profiles, pricing benchmark table, 3 funnel teardowns, 10 copyable tactics, 6 strategic gaps PB can plant a flag in.

Attached: `Productized AI Web Tools for Small Business_ Market Intelligence Report for PlainBlack.pdf`, full source.

#### Part 1, 5 patterns shaping the niche

1. **The “$5K Webflow homepage” model is being eaten from both sides.** Productized landers (Designjoy, Productize.design, fastpages.shop) crowd the mid-market. Defensible move = up (bespoke functionality: calculators, lead-gen tools, custom GPTs, AEO/GEO retrofits) or down (volume templates $5–$300, Easlo / Marie Poulin model). Middle is invisible. Greg Isenberg: “the agency model is dead… selling labour arbitrage that AI just collapsed. The agencies that survive will sell taste, strategy, skills.”
2. **“Built once, owned by client” is a positioning weapon.** Pete Boyle (Growth Models): “every system, every asset, every account, it’s yours from day one. No lock-in.” Designjoy: same idea applied to design. SaaS-sprawl fatigue.
3. **Single-page web apps (Lovable / Bolt / Cursor) have replaced PDFs as the default lead magnet.** Magnetly.co + LeadMagnetCreator.com have productised this. Clients don’t want the e-book; they want the interactive thing. *This is the opening for PlainBlack.*
4. **AEO/GEO is the new “fix your site” upsell, pricing wildly inconsistent.** Sub-$100 page bundles to $10K/mo retainers. Productized one-time AEO audit-and-fix $500–$2,500 is genuine white space, most agencies still sell AEO as monthly retainer.
5. **Cohort-priced “one thing, one fee, one week” beats subscription on conversion for first-time buyers.** One URL, one promise, one price, one button. Designjoy, fastpages.shop, Productize.design, Convert_ ($250 calculator builds). Losing steam: generic “AI strategy consulting,” $5K+ AI audit decks, pure-design retainers.

#### Operator directory (Part 2, distilled)

| Cat | Operator | What they sell | Price | Most copyable tactic |
| --- | --- | --- | --- | --- |
| A | **Magnetly** | AI lead-magnet SaaS (templates: pricing simulator, diagnostic, product finder) | SaaS sub | Hook: “Static content is dying. AI tools are taking over.” |
| A | **Convert_ / ConvertCalculator** | Calculator SaaS + done-for-you build | $250 build floor | Public price floor, signals “no proposal, no discovery call.” |
| A | **Lead Magnet Creator** | 200+ AI micro-tool templates | Freemium | Catalog approach, lists 200+ use-cases to train buyer imagination. |
| B | **Designjoy (Brett Williams)** | Unlimited design sub, solo founder | $5,995/mo std, $7,995 pro | Pause-anytime sub disguised as productized service. $1.3–1.7M ARR self-reported. |
| B | **Productize.design** | Premium landing pages, flat-fee sub | Gated | Aggressive 3× value-prop repetition on hero. |
| B | **Designow** | One-off + retainer landing pages | $1,499 / $2,499 one-off · $2,999/mo | Dual-track pricing on homepage. |
| B | **fastpages.shop** | Hand-coded landing pages, 48h | ~$120 starter | **Bundle the file with deliverable + README.** Closest mental match to PB’s HTML playbook model. |
| C | **Easlo** | Notion templates (solo) | $5–$50, bundles ~$200 | Free template → email → paid template ladder. Visual continuity free↔paid. $500K+ self-reported. |
| C | **Marie Poulin / Notion Mastery** | Templates + flagship course | Free → $5–$50 → ~$497–$700+ | Visual differentiation: free templates light theme, paid dark theme, matching buttons. 25%+ free-template opt-in. $40K/mo course business. |
| C | **Justin Welsh** | LinkedIn OS / Content OS / Creator MBA + newsletter | $150 → $300 → $500+ | **Affiliate ladder built into the product itself.** 1,400+ affiliates / $280K+. PAIPS post template. |
| C | **Tom Hirst** | WordPress dev + Pricing Freelance Projects eBook + mentorship | $39 eBook | Turn the thing you said into the thing you sell, viral X thread → book of same name. |
| D | **PodcastBloggers** | Podcast → SEO blog posts | Flat monthly (undisclosed) | “Request samples” CTA as lead magnet, output of service IS lead-gen vehicle. |
| D | **Hatchly** | On-demand graphic design w/ AI assist | Tiered subs | **Permanent coupon code in header** for first-time buyers. |
| E | **Flow Agency / Viola Eva** | Productized B2B AEO/GEO | $1,400+/mo backlinks floor | Deliberate rebrand SEO → AEO timed for early-mover (Aug 2024). |
| E | **First Page Sage** | GEO services + thought-leadership | ~$8,000+/mo | **Publish proprietary research quarterly.** Entire moat in a category they invented. |
| E | **Genevate (Brett Kleinberg)** | GEO + strategic PR hybrid | Retainer, mid-market | Bundle GEO with PR (not SEO), defensible because SEO firms can’t credibly do PR. |
| E | **Pete Boyle / Growth Models** | 90-day growth system build, handed over | High-ticket (undisclosed) | **2-min interactive AI quiz as lead magnet**, closest to what PB should build for itself. |
| E | **Ptolemay** | Custom app dev (calculator is lead-gen) | Calculator free; engagements vary | Public AI calculator as own lead magnet + sell same to clients. |

#### Part 3, Pricing sweet spots for PB expansion

| Band | Comp | What PB ships |
| --- | --- | --- |
| **$120–$300** | Easlo · fastpages-Starter | High-volume template-style HTML playbook variants. |
| **$1,500–$2,500** | Designow · AEO audits · Convert_ premium | Single bespoke web tool / mini-app. |
| **$2,500–$5,000** | One-time AEO audits | “AI-readiness retrofit” (AEO audit + playbook rebuild). |

#### Part 4, Funnel teardowns (3 strongest)
**Designjoy**, tweet / interview → lander → Stripe checkout → Trello board in ~1 hour. *Brett does the first design without asking for a brief.* 75% money-back week-one. Time-to-sale: hours.**Justin Welsh**, LinkedIn PAIPS post → free lead magnets behind email → Saturday newsletter (175K subs) → sub-$50 entry → $150–$300 mid → $500+ premium. Affiliate flywheel at course mid-point.**Pete Boyle / Growth Models**, LinkedIn content → 2-min interactive quiz producing a personalised growth report → 1-business-day personal reply → 90-day system pitch wit

Comments:

**Jay:**

> **[Cross-link, pitch lands directly on Gaps 1, 2, 5]**
>
> New card spawned: **McIndoe Media × Xplora (Brandon, Beef, Blake)**, active prospect, fishing channel content system pitch. Full pitch on item `mpj2w21i-1nzpc21g`, card id `mpj2w094-6m1k1mr15`.
>
> **Why it matters here:** the pitch is the most direct application of this report’s findings filed so far, **Gap 1** (Designjoy of AI tools, $1,500–$3,000 single-build), **Gap 2** (playbook + tool combo, nobody owns this), **Gap 5** (mini-app for a niche), plus **Tactic 5** (visible price ladder) and **Tactic 6** (first deliverable without a brief). Worth using this prospect as the first proof of the productisation thesis.

**PlainBlack:**

> [Triage P-19] Moved from P-19 → P-12 PB Services (productisation strategy research). Source PDF (I-210) merged in below.

**PlainBlack:**

> ↩ Merged from "Productized AI Web Tools for Small Business_ Market Intelligence Report for PlainBlack", originally captured by Jay on 2026-05-24, full content of Jay's item:
>
> Productized AI Web Tools for Small Business_ Market Intelligence Report for PlainBlack

---

### Productized AI Web Tools for Small Business_ Market Intelligence Report for PlainBlack (P-12 / I-210)

Productized AI Web Tools for Small Business_ Market Intelligence Report for PlainBlack

---

### Websites service line (P-12 / I-161)

**Websites service line, v2 expansion.** Supersedes the original $1k/$1.5k/$2k tier item on this card. Adds full package detail, two parallel pricing philosophies, sharper brand voice, and the radical free-off-boarding promise.

**The frame**

> "Small smart family website business that uses AI and templates. Just do websites man. Simple and fair priced. Anonymous. Low-key. Basic. Risk free."

Anti-corporate posture. Counter to every web agency that hard-sells and locks clients in. The position is built around **integrity, ease, trust, and support**, and the operating model assumes Jay stays home, keeps the client list manageable, and turns down clients that would compete with existing ones (echoes the "one client per industry" PapaMassive rule).

**Two parallel pricing philosophies, let the client choose**

| Path | Upfront | Monthly | For who |
| --- | --- | --- | --- |
| **A, Low setup + recurring** | $1,000 | $99/mo, all ongoing changes included | Clients who want "I do not want to think about it ever again" |
| **B, Higher setup + no ongoing** | $2,000+GST | $0 | Clients who want a full DIY support package, then handle it themselves |

**The flagship "No Brainer Retainer" package, $2,000 upfront + $100/mo**

**What is in the $2,000 upfront**

- "Template" Website Design & setup
- Domain & DNS setup
- Account & Asset Management (Google Drive folder with logins, resources, etc.)
- Contact Form
- **12x Blog (SEO) content**, 12 months of scheduled blogs delivered upfront
- Scheduling embed (Calendly, cross-link to the Calendly setup chore on Hub + Inbox)

**What is in the $100/mo**

- Quick straightforward changes / updates
- 1x monthly AI-generated blog content for SEO (12 scheduled in advance)
- Web hosting
- Monthly overview report (website performance, cross-link to analytics rollout item on Hub + Inbox)

**Extra costs (quoted first, always upfront)**

- Domain / Email hosting setup, forwards, DNS upgrades
- Larger jobs (substantial updates, upgrades, edits, SEO / content), written quote first
- Third-party subscriptions (Elfsight, Jotform, etc.), pass-through pricing
- Scheduling setup beyond basic embed
- Backlinks

**Additional services available, billed separately**

- Social media setup / upgrade
- Google Business Profile setup / management / analytics
- Google Ads
- Social media ads
- Web analytics management
- AEO (Answer Engine Optimisation)
- Chatbot / Custom GPT
- Automations
- Directory & Listing Audit, Setup & Management (cross-link to Papamoa.info)
- Email / DM blasts
- Email signature setup (cross-link to Gmail profile animation chore on Hub + Inbox)

**Service-vertical templates, "ready to go" packs**

Pre-built basic websites for service-based niches. Currently identified: Accountants · Tradies · Consultants. Add more as patterns emerge (cafes, salons, physios already in flight via PapaMassive).

**The 4-tier feature ladder** (alternative to A/B above, bundles instead of recurring vs one-off)

| Tier | Price | Includes |
| --- | --- | --- |
| Website | $999 | Template + domain + form + 12 blogs |
| Website + AI | $1,499 + $usage/mo | + AI tools embedded (chatbot, content gen) |
| Website + AI + CMS | $1,999 + $usage/mo | + self-serve content management |
| Website + AI + CMS + Bells & Whistles | $1,999 + $usage/mo + $TBD/mo | + "add a budget and it will be even more epic" |

**Conditions / operational rules**

- Simple domain transfer included; complex ones charged separately
- Changes are AI-driven OR a limited number of human hours per month
- Additional hours available, but most done via AI ("hey AI, change that bit to say X, or move that up")
- Website in a week, speed promise (loose; cross-link to the 24hr Website Challenge variant on this card for the harder commitment)
- Quote upfront for anything outside the inclusions, no surprise invoices

**The radical positioning: free off-boarding**

> "It is not awkward to switch to another partner. If you fire us you do not have to ask nicely for any access, codes, or whatever. We include free off-boarding costs.

> Seems weird? Well, you would pay someone else to do the work to do that, so we will even save you money even when you reject us for your sister's daughter's friend who just finished her online course."

This is a real differentiator vs every web agency that ransoms client assets. Worth marketing as its own feature: *"Easy in, easy out. Your assets, always."*

**The personal context** (file-only, not for the public site)

> "This is because Matt and Rich said bad things about me. Slanderous and I do not want to care if everyone rumours behind my back."

Read: the anonymity + low-key + free-off-boarding positioning is partly defensive against past slander from named individuals. Worth knowing as motivation; not for marketing surface. The positioning itself stands on its own merits, clients benefit either way.

**The pitch glow-up line**

> "The real magic is what your customers / clients do not see, your back-end AI-powered engine."

Pairs with the "AI Brain" framing on the Blog Generator marketing item (Marketing & Lead-Gen Ideas). Could be the homepage hero for the entire PB Websites service.

**Distribution / lead-gen**

- **LinkedIn posts (as blogs)**, repurpose every PB blog as a LinkedIn longform. Cross-link to Content engine batch + Blog production upgrade.
- The "recommend me to a friend" ask in the welcome email, turns happy clients into referrers
- "Not too hard to get a client or two per month", modest stated target. Compounds to ~24/yr at the low-end pricing = $24k–$48k/yr just from new web sales, before recurring + extras.

**Domain registrar decision (deferred, blocked on Domain Reseller upgrade)**

> "Need to suss google domain? Definitely not crazy domains."

Cross-link to the Domain Reseller upgrade chore (Hub + Inbox), same decision lives there. "Definitely not Crazy Domains" is a firm direction; "suss Google Domains" is the candidate. Resolve at the Domain Reseller item, then apply universally.

**Cross-card relevance**

**Original Websites service line item** (this card, `mpi7835y-1gnz1l8`), superseded by this v2. Comment added there pointing here.
**PapaMassive Starter / Growth / Authority** (this card), sister product. Web build = setup; PapaMassive = ongoing marketing.
**24hr Website Challenge / 30 Websites for GCs / $999 niche bundles** (this card), variations on this same service line
**Domain Reseller upgrade** (Hub + Inbox), "not Crazy Domains" decision lives there
**Calendly setup** (Hub + Inbox), scheduling embed needs Calendly live
**Analytics rollout** (Hub + Inbox), monthly performance reports rely on GA + Cloudflare Insights + Search Console
**Stripe + Web3 prereq** (Hub + Inbox),

Comments:

**Jay:**

> **[Cross-link, Online Footprint Glow-Up now its own item]**
>
> The "Full online footprint audit" listed as an Authority-tier inclusion on this PapaMassive item has been formalised as a standalone product, item `mpic67fm-313151141g` on this card.
>
> Net effect: Authority tier bundles the Glow-Up by default; the Glow-Up also sells standalone (FREE tier as lead magnet → PAID tier with ROI guarantee) to prospects who are not yet ready for full PapaMassive retainer.
>
> Both paths feed each other, every Glow-Up FREE customer is a PapaMassive lead.

**Jay:**

> **[Old service tier names worth lifting forward]**
>
> Previous PB plan (reference item `mpic911r-1g1gc8181p` on this card) had a 3-tier naming scheme that maps cleanly onto the current Websites v2 ladder:
>
> - **Start Strong**, Logo + basic style guide + email signature (entry-tier branding only)
> - **Build Bold**, Start Strong + website + domain / email help (matches current $999–$1499 web tiers)
> - **Own It**, Build Bold + custom illustrations + copywriting + extra pages (matches current $1999 Bells & Whistles tier)
>
> Recommendation: adopt these names for the current ladder. Sharper personality than "Website / Website + AI / Website + AI + CMS". Could go: Start Strong $999 · Build Bold $1499 · Own It $1999.

---

### Three new website-service offers (P-12 / I-151)

**Three new website-service offers, all extend the existing Websites service line ($1k / $1.5k / $2k tiers + $99/mo support) on this card.**

**1. 24-hour Website Challenge, "ready to deploy in 24 hours, or it is free"**

- Money-back guarantee on speed. Customer gets a usable, live-ready website inside 24 hours or pays nothing.
- Position as the "I need this yesterday" service. Premium tier despite the speed, urgency justifies the price, not undercuts it.
- Possible price points: $1,500 24hr · $2,500 12hr · $5,000 same-day
- Risk shifted from PB to PB. Use only with the productised template stack already built (BLST quote tool, audit HTML templates, niche audit templates, papamoa-previews listing template) so the speed promise is realistic.
- Pair with AI Quote Tool template productisation (this card), quoting flow → trace area → quote → "we will have your tool live in 24 hours."

**2. "30 Websites for GCs", free basic + paid extras**

- Outreach play targeted at Gold Coast (assuming GC = Gold Coast per Jay earlier "Go to GC and network. Be popular and successful").
- Free basic website for 30 GC businesses, establishes presence in a new market fast
- Monetisation: AI tools, ongoing support, ads management, blog generation = paid extras on top of the free base
- Same shape as the niche-lock motion (Marketing & Lead-Gen Ideas), give one away free per niche / per market for the content + endorsement, monetise the extras
- Cross-link: this becomes PB market-entry strategy if Jay relocates / spends time in Gold Coast

**3. Industry / Niche templated bundles, $999 w/ sites + ads**

- Pre-built template per industry, cafes, gyms, tradies, real estate, physios, salons
- $999 buys: industry-specific website (from the niche template) + initial ad spend or campaign setup
- Same productisation muscle as the AI Quote Tool template (PB Services), one template per vertical, swap rates / brand / content
- Cross-link to Niche Audit Templates (this card), audit identifies the gap, $999 bundle is the fix

**Cross-card relevance**

- **Existing Websites service line** (this card), these are 3 variations on the same product line: speed-guarantee tier, market-entry tier, niche-bundle tier
- **30 Day Build Challenge** (sec-clients), different product (Jay personal content cadence) but the "24hr challenge" naming overlap is intentional. The 30-Day-Challenge supplies the proof that PB can ship fast.
- **Productisation pipeline → /tools** (this card), every niche bundle that converts becomes a permanent listing
- **Recruitment card** Jay personal mission "Kill it in recruiting and build the Cave for fun", the "30 Websites for GCs" market entry pairs with that GC ambition

**Next:** stress-test the 24hr challenge internally before pitching, pick a stock niche template, full client cycle in 24h. If Jay can hit it, the offer is real. If not, recalibrate to 48h.

---

### Three productised workshops PlainBlack can sell as standalone offerings (P-12 / I-115)

**Three productised workshops PB can sell as standalone offerings**, all "ideation" services with clear deliverables and fixed prices. Tone is unmistakably PlainBlack.

---

**1. NameStorm, $495**

*Tagline: "Still calling it Project X? Let us fix that."*

Naming-focused ideation sprint. Great for startups with a concept but no name yet.

- Pre-call questionnaire
- 90-min Zoom or in-person session
- Rapid-fire name generation (20+ options)
- Trademark / availability tips
- Follow-up shortlist with domain ideas + tone notes

Ideal for: founders, side hustlers, business rebrands.

---

**2. The Brand Jam, $950**

*Tagline: "No fluff. Just fresh direction."*

Half-day workshop for people with a vague vision who need shape, structure, standout.

- Tone of voice profiling
- Audience segmentation
- Moodboard creation
- Brand personality mapping (archetypes etc.)
- Core message rough-draft

Can be bundled into full branding packages.

---

**3. The Idea Intervention, $1,800**

*Tagline: "For when you have got 100 tabs open in your business brain."*

Full-day high-energy ideation retreat, teams or solo founders overwhelmed with direction.

- 2-hour strategy + brainstorm (guided)
- Live Miro board ideation
- Clarify next big move: campaign / product / rebrand / restructure
- Takeaway action deck
- Optional: week-later accountability check-in

Ideal for: growing startups, micro-agencies, founders who have hit a wall.

---

**Landing page draft, "Brand Brains for Hire" (verbatim in comment)**

**Cross-sell ladder**

- NameStorm → Brand Jam → full branding package
- Brand Jam → "Build Bold" or "Own It" upgrades
- Idea Intervention → long-term retainers or creative direction gigs

**Why these matter to PB**, none of the current sec-products landers are workshop-shaped. These three give PB low-risk entry-tier offers ($495) that ladder up to high-ticket. The Idea Engine / Spitball Session item already on this card is the monthly retainer cousin of these one-off workshops.

Comments:

**Jay:**

> **[Landing page copy, "Brand Brains for Hire", verbatim]**
>
> > **Headline:** "Stuck? Swamped? Sparkless? Let us Fix That."
> > 
> > **Subhead:** At PlainBlack Creative, we do not just make things look good. We help you figure out what you are building, why it matters, and how to tell the world. Think of us like your brand best friend with a whiteboard and a wicked sense of clarity.
> > 
> > **Offer Snapshot**
> > 
> > - **NameStorm**, Stuck on a name? We will give you 20 and a whole lot more.
> > - **The Brand Jam**, Define your tone, find your people, and map your vibe.
> > - **The Idea Intervention**, One day. Zero fluff. All forward motion.
> > 
> > **Why Book a Workshop?** Because clarity is underrated. Because your Canva logo deserves better. Because it is not just about standing out, it is about sounding like someone we would want to follow.
> > 
> > **CTAs:** [Book a Free Call] [Compare Workshops]

**Jay:**

> **[Old PB plan ancestry, reference item `mpic911r-1g1gc8181p` on this card]**
>
> Previous PB plan had "Brand Strategy Workshops" as a service line, half-day + full-day options, deliverables: name brainstorm, tone of voice, target audience mapping, brand pillars.
>
> That framing already evolved into the current NameStorm $495 / Brand Jam $950 / Idea Intervention $1,800 trio on this item. Confirming continuous lineage; the trio names are sharper. No action needed.

---

### The Plain Black Box (P-19 / I-296)

**The Plain Black Box, Scaffolding Questionnaire.** Joint Ian + Jayden discovery doc to define what The Box is, how it thinks, what it ships, and where its guardrails sit. Sections 1-3 are Jay-answered. Sections 4-6 are open, pending Ian to fill, then Jay/Ian to compare side-by-side.

#### Purpose

Two-author questionnaire. Each fills it independently, then they compare. Divergent answers = surface area for the Box's identity. Convergent answers = the canonical Box voice.

#### 1. Tone & Personality *(Jay answered)*

- **One-word mantra:** True
- **Words that always describe tone:** Brutally honest, little bit tongue in cheek, supportive
- **Words that should never describe tone:** Greedy. Jargon.
- **How clients should feel afterwards:** Empowered and reinvigorated about their business prospects.

#### 2. Creative Process *(Jay answered)*

- **First question in a brainstorm:** Why (think Simon Sinek)
- **Go-to method for generating campaign ideas:** Brain storm with butcher's paper and a bottle of wine.
- **How we decide if an idea is "Plain Black quality":** Does it ring true and does it inspire further thought.
- **Typical structure for presenting ideas:** In-person conversation where we let the client almost lead the direction. Then an email proposal template or PDF.

#### 3. Content & Deliverables *(Jay answered)*

- **What The Box handles first:** Name storming, and branding ideation for startups. Then scaffolding content and marketing plans.
- **Formats/templates to standardise:** Ideation questionnaires. Proposal templates.
- **Deliverables that always need a PB human layer on top:** Proposals.

#### 4. Guardrails & Boundaries *(OPEN, pending answers)*

- What shouldn't The Box ever do?
- Where do we draw the line between "assistive" and "done-for-you"?
- How do we make sure The Box's outputs stay on-brand for clients while still feeling "Plain Black"?

#### 5. Client Replication *(OPEN, pending answers)*

- Which processes are universal enough to apply to any client?
- Which processes are uniquely Plain Black and not for export?
- Do we want clients to interact with their own Box directly, or always through us?
- What outcomes do clients think they want vs. what they actually need?

#### 6. Experience & Storytelling *(OPEN, pending answers)*

- How do we describe The Plain Black Box in one sentence?
- If it were a person, what kind of personality would it have?
- What's the client-facing metaphor we lean on most?
- How do we differentiate this from "just AI" and frame it as our secret weapon?

#### What Jay's answers reveal so far

- The Box's mantra is **True**, single-word identity, no fluff. Ladders directly into PB Voice & Style Guide ("honest, never corporate-cliche").
- Anti-jargon, anti-greed, guardrails are already half-defined in section 1 even though section 4 is empty.
- Outputs Box handles first: **name storming + branding ideation for startups**, then scaffolding content and marketing plans. This is the productisation roadmap.
- Proposals always get a human layer, no fully autonomous client-facing output. Confirms PB-as-orchestrator, Box-as-engine.
- "Empowered and reinvigorated" = the emotional outcome metric. Use this to QA Box outputs: would a client read this and feel empowered, or talked-down-to?

#### What Ian needs to fill next

- Re-answer sections 1-3 independently (don't copy Jay's). Compare for convergence/divergence.
- Fill all of sections 4-6 fresh. These are the unanswered identity questions.
- Joint review: where Ian and Jay agree = canon. Where they diverge = sharpen until consensus or codify the tension.

#### Cross-card relevance

- Credibility & Media, joins the brand-bible stack alongside Repo System Prompt, ICP, Voice & Style Guide, Visual Brand Guide, Ian Clarquinn Voice Rule, Jay voice profile.
- PB Services, The Box's productisation path (name storming → branding → scaffolding → marketing plans) overlaps the V1/V2/V3 playbook engine. The Box may eventually swallow or sit alongside the playbook engine.
- Jay Career, anti-jargon/anti-greed guardrails align with Jay's personal voice profile.
- Ian Clarquinn Voice Rule item *mpj8m74h-...*, Ian's answers here will refine that voice rule.

#### Open questions for Jay

- Has Ian seen this doc yet? If not, send it for his independent fill.
- Do you want Box outputs to ever be client-direct (their own Box instance), or always mediated through PB? Section 5 question, answering it scopes the entire commercial model.
- What's the working metaphor for The Box? Currently feels like "the engine in the workshop", is that the frame you want, or something stronger?

Next: send to Ian for independent fill of sections 1-6. Source file safe to delete (answers preserved here verbatim).

Comments:

**Jay (2026-05-24T04:11:58.776Z):**

> **[Cross-link, GTM Plan filed]**
>
> PB GTM Plan now filed as item `mpj9aucd-bl111j1ak` on PB Services. It introduces an **Idea Engine** retainer (monthly ideation + 3-5 concepts + optional content prompt library) which overlaps what The Box does. Open Q for Jay/Ian: is Idea Engine the commercial-facing name for The Box, or separate offers? Answer in section 5 of scaffolding (Client Replication).

**Jay (2026-05-24T07:41:38.110Z):**

> **[Triage answers, 24 May 2026]**
>
> *The Box doc*
>
> 1. **Has Ian seen this doc yet?** → Yes *He wrote it. Last year*
> 2. **Box outputs, client-direct or PB-mediated?** → Skip / unsure
> 3. **Working metaphor for The Box?** → Skip / unsure

---

## Pricing

### AI Playbooks (P-12 / I-195)

**AI Playbooks, pricing & positioning under review. Jay’s own framing: “THE WORST NAME, maybe the worst product.”**

> “Maybe the HTMLs are an add-on, or just part of our services.
> Maybe a monthly fee to keep them live and updated and AI’d.
> We keep saying they’re worth way more than $99.
> 
> Playbooks: $99 /mo
> Or Playbooks are the way we support our services.
> 
> Complete flip?
> Or come back to this later.
> Change Price?, To straight $100, no 99+gst etc.”

#### The forks Jay is wrestling with

| Option | Shape | Tension |
| --- | --- | --- |
| **A. Standalone product** | Playbooks: $99/mo subscription. Self-serve, white-label-able HTMLs (blog-gen, AI marketing agent POC, others) sold as a product line. | Name is weak. Price feels too low for the perceived value (“worth way more than $99”). Hard to defend as a standalone if positioning is mushy. |
| **B. Add-on to services** | Playbooks bundle into service engagements as a value-add. No standalone price. | Lower revenue ceiling, but cleaner story. Playbooks become a differentiator, not a SKU. |
| **C. Service-support layer** | “Playbooks are the way we support our services”, recurring monthly fee that keeps the HTMLs live + updated + AI-refreshed for clients on retainer. | Locks Playbooks behind the service. Strong recurring-revenue logic. Forces a different sales motion (services-first, Playbook-as-renewal-glue). |
| **D. Pricing tweak only** | Keep the product line. Move to flat **$100** (no $99+GST mental tax). | Doesn’t resolve the positioning question, just the round-number ergonomics. |
| **E. Park** | Come back later. Don’t force the decision now. | Risk: existing “Playbooks: $99/mo” messaging drifts unresolved. |

#### Loose ends to chase

- **Name**, Jay flagged it as “THE WORST”. Needs a rename if A or C wins. Brainstorm separately.
- **What’s actually in the Playbook catalogue?** Known: blog-gen.html (cross-linked), AI Marketing Agent POC (cross-linked). Catalogue the rest.
- **If $100 flat**, does that include GST or sit on top? PB price-display convention call.
- **Update-and-keep-live** economics, what does it cost to maintain N Playbooks for X clients monthly? Margin shape governs whether C is viable.

#### Cross-card relevance

- **AI Agents card**, *AI Marketing Agent, productised service POC* (item `mpj1f455-1gll13vh`) IS a Playbook. Same fork applies: sub-offer of MAIA, own service-line, or a Playbook under whatever the umbrella becomes.
- **Marketing & Lead-Gen Ideas**, *Productise blog-gen.html as a white-label product* (item `mpi5qhd1-01da1d9i`) is the original Playbook precedent. The pricing/positioning answer here governs that one too.
- **MAIA AI Consulting**, if Playbooks fold into services as support layer (option C), MAIA is the natural anchor service to bundle them under.
**Next:** defer the pricing/naming call to projects triage. Until then, hold messaging at “Playbooks: $99/mo” unchanged, don’t ship a flip without resolving the umbrella question first.

Comments:

**Jay:**

> **[Cross-link, build spec parked, awaiting this fork]**
>
> Filed the “Automations to build before launch” spec (id `mpj1nx4j-1j6o1dhd`) on this card. Full 6-chunk build (Web3Forms · Make.com lead-intake · Stripe · Make.com Stripe webhook · META Pixel · delivery email).
>
> **Why it matters here:** whether that spec ships, gets pruned, or dies entirely depends on the umbrella decision parked here. Survival table on the spec maps each fork (A–E) to what survives. Don’t start the build until A wins.

**Jay:**

> **[Cross-link, outro pillar wording depends on this fork]**
>
> New item on Marketing & Lead-Gen Ideas (id `mpj1z4pv-119q1g113`) is a 7-frame PB IG carousel. The outro frame treats *PLAYBOOKS · BRANDING SERVICES · IDEA ENGINE* as three equal pillars in the footer.
>
> **Why it matters here:** if Playbooks fork to options B / C / E (add-on / services-glue / parked), the footer wording on any republished version of this carousel needs to follow.

**Jay:**

> **[Cross-link, First-Fix pricing rhymes with this fork]**
>
> New item on this card (id `mpj2cw45-1r618u1p18`) parks the First-Fix paid diagnostic. Pricing not yet set.
>
> **Why it matters here:** the Playbooks pricing decision (A–E options) and First-Fix pricing should be made as a paired set, not independently, both are entry-point PB offers, both touch Stripe + refund / GST plumbing. Worth one decision session covering both.

**Jay:**

> **[Cross-link, market-intel report reframes this fork]**
>
> Market intelligence report filed on Credibility & Media (id `mpj2jmo7-1jp1o1741d`) reframes this pricing fork directly. Three report findings to fold in:
>
> - **Tactic 5:** Extend $99 to a ladder, “$99 / $499 / $1,499, pick your altitude.” Becomes Option F on the fork.
> - **Gap 2:** Nobody is selling “playbook + tool” bundled. $99 doc + $499–$1,499 mini-tool is a category nobody owns. Likely makes option B (services add-on) obsolete.
> - **Tactic 1:** Kill the contact form between Playbook and payment, Stripe-direct, no discovery call.
> **Why it matters here:** the umbrella fork should be re-decided with the ladder + bundle options on the table.

**Jay:**

> **[Cross-link, this framework IS what justifies any Playbook price]**
>
> New item on this card (id `mpj34ri2-h1c71e1q1e`): Plain Black Future-Proof Playbook Generation Framework, the production engine behind the Playbooks product.
>
> **Why it matters here:** the “is it worth more than $99” question collapses depending on whether the Playbook is a template (low-defensibility) or a niche-aware, decision-logic-grounded, intake-personalised artefact built through this framework (high-defensibility). If the framework is the production system, $499 / $1,499 ladder tiers become defensible, without it, the product gets compressed by AI fast.

**Jay:**

> **[Cross-link, any paid Playbook option forces hosting migration first]**
>
> New item on PB Services (id `mpj3b339-1enda519`): the PB site on GitHub Pages can’t legally process commercial transactions per ToS. Need to migrate to Cloudflare Pages or Vercel before going commercial.
>
> **Why it matters here:** Options A (standalone $99/mo) and D ($100 re-price) on this fork both involve paid checkout on the PB site, hosting migration is a hard prerequisite. Option C (services-glue) may dodge it if checkout lives elsewhere. Worth confirming current host before any pricing call ships.

**Jay:**

> **[Cross-link, this offer IS option C in concrete form]**
>
> New item on this card (id `mpj47ys3-171ghr1b18`): **No-Brainer Retainer / ChatGPMe / AI Concierge**. $200–$500+gst/wk retainer where Jay acts as the client’s outsourced AI-savvy operator, Google Ads, social, AI, chatbot, systems, marketing, replacing fragmented vendors with one flat fee + client owns the IP.
>
> **Why it matters here:** this is option C (“Playbooks are the way we support our services”) made concrete. Worth deciding whether No-Brainer Retainer collapses into this fork as the named C-option, or stands as its own thing alongside Playbooks. Doing both means two products with overlapping scope.

**Jay:**

> **[Cross-link, resolution candidate for this fork]**
>
> New item on this card (id `mpj4t6kd-81lvl1lx`): **DIY or DI2gether 4-tier funnel** (Free / Subscribe / Paid Stuff / Hire Us) effectively resolves this Playbooks pricing fork as **hybrid Option A + B** in concrete form. Playbooks live as both free content (tier 1) AND paid templates (tier 3) at different polish levels; $99 Playbook still fits.
>
> **Why it matters here:** the umbrella decision becomes “pick the ladder, not pick a single point.” If Jay endorses the 4-tier framework, this item can move to `done` with the ladder named as the resolution.

**Jay:**

> **[Cross-link, Bet B is the recommended resolution]**
>
> New synthesis item on this card (id `mpj5nrjy-u1r1e141ed`) translates the market intel report into a PB-specific gameplan and lands on **Bet B: skip the wedge, go to $1,500–$5,000 “Branded System” tier.** Math: 4 sales/mo at $2,500 = same as 100 playbooks at $99. Different lifestyle.
>
> **Why it matters here:** if Jay endorses Bet B, this Playbooks-pricing fork closes with a clear answer: *$99 stays as a wedge, on autopilot; the real revenue product is Branded System at $1,499.* Differentiator sentence ready to ship: *“The $99 playbook teaches you how to do it. The $1,499 Branded System just does it.”*

**Jay:**

> ↩ Merged from "Pre-launch automation spec for the Playbook delivery pipeline, META ad → lander → Web3Forms → Make.com → GitHub Pages → Stripe paywall → token unlock. Jay flagged ", originally captured by Jay on 2026-05-24, full content of Jay's item:
>
> Pre-launch automation spec for the Playbook delivery pipeline, META ad → lander → Web3Forms → Make.com → GitHub Pages → Stripe paywall → token unlock. Jay flagged

**Jay:**

> (via merge from "Pre-launch automation spec for the Playbook delivery pipelin")
> **[Cross-link, shared `SUBMISSION_PARKED` flag with today’s 30 Day Build]**
>
> Build Map v2 (id `mpj1tqn0-1n81fa157`, on 30 Day Build Challenge) gates today’s tool launch behind the same Web3Forms parked flag this spec describes:
>
> ```
> var SUBMISSION_PARKED = true;   // ← change to false to re-enable real submission
> ```
>
> **Why it matters here:** whichever Playbooks fork wins (sister item `mpj1jg6p-1b13l1jk3`) is what flips the flag. The 30-day build is publishing under the “ran out of time, ready in a day or 2” framing, gives some breathing room before the fork has to be called.

**Jay:**

> (via merge from "Pre-launch automation spec for the Playbook delivery pipelin")
> **[Cross-link, intake feeds the personalisation step in this pipeline]**
>
> New item on PB Services (id `mpj24iuu-kz183v1m`) parks the V3 Intake Schema. 10 structured sections, with section 10 internal-only.
>
> **Why it matters here:** chunk 2 of this automation spec (Make.com Lead intake scenario, fill `[[PLACEHOLDERS]]`) reads from a structured intake. The V3 Intake Schema is the candidate field set, map placeholders to its fields once the umbrella fork resolves.

**Jay:**

> (via merge from "Pre-launch automation spec for the Playbook delivery pipelin")
> **[Cross-link, this is the prompt logic for chunk 2 of this pipeline]**
>
> New item on this card (id `mpj34ri2-h1c71e1q1e`): the Future-Proof Playbook Generation Framework. Defines what Claude actually does to turn intake data + section requirements into a published Playbook.
>
> **Why it matters here:** chunk 2 of this automation spec (“Fill all `[[PLACEHOLDERS]]` in the correct template”) becomes a much sharper operation when run through this framework instead of straight string-substitution. Worth wiring the master prompt + QC checklist into the Make.com lead-intake scenario directly.

**Jay:**

> (via merge from "Pre-launch automation spec for the Playbook delivery pipelin")
> **[Cross-link, this spec’s “save to GitHub Pages” step needs to change target]**
>
> New item on this card (id `mpj3b339-1enda519`): hosting decision for the PB site. GitHub Pages ToS prohibits ecom / commercial transactions / commercial SaaS, PB needs to migrate to Cloudflare Pages or Vercel before any Playbook checkout goes live.
>
> **Why it matters here:** chunk 2 of this automation explicitly “saves the personalised file to GitHub Pages via GitHub API.” That target needs to flip to Cloudflare R2 / Cloudflare Pages / Supabase Storage (signed URLs) once the migration happens. Worth doing the migration call *before* any of this pipeline ships.

---

### Unsure (P-12 / I-689)

**Unsure, needs context, clarity, explanation or investigation.** Open decisions, gates and loose ends from the retired P-17 archive that aren't ready to fold into Services / Tools / Playbooks yet.

##### Strategic / decisions

1. **The hard revenue-floor anchor (ex-I-162):** $59.52/hr = $10,000/week @ 40 hrs. Do we anchor the whole AI offering to this floor (every engagement checked against it)? A business-model call, not a deliverable.
2. **Services vs Playbooks vs Tools pricing-umbrella fork:** several offers (voice agents, custom-GPT builds, the $1k packages, the "Building a Custom GPT" offer) genuinely overlap all three, the same custom-GPT build is a *Service* when bespoke, a *Playbook* when templated, a *Tool* when shipped as an Artifact. Needs the PB Services Playbooks/pricing umbrella resolved before final routing.
3. **Coupland Consulting co-brand (ex-I-174 comment):** PB's AI offering is also being built into Craig's brand as "Coupland Consulting" (sales script + $1k-week → $100k+ pricing). Are these parallel offers (different audiences) or is PB the engine and Coupland one brand-front variant? Affects how the positioning gets written.

##### Legal / investigation gates

1. **OpenAI Pro-plan ToS (ex-I-239):** selling third-party access to a Pro account / "free generations via PB GPTs" is usually restricted, confirm before any reselling or free-GPT distribution mechanic ships.
2. **UGC-avatar / synthetic-likeness legal (ex-I-239):** Meta/TikTok restrictions on AI avatars, check before building an avatar/UGC template library.

##### Clarifications / loose ends

1. **"Building a Custom GPT" blog (ex-I-207):** confirm publish status (live/draft/staged), create the demo-GPT URL, run the agreed PB-voice pass.
2. **"RTT Automation" (ex-I-145):** what does RTT stand for? (Real-Time Translation? Rapid Transformation?) Clarify before it becomes a proficiency/Playbook.
3. **"Papamoa Presence" (ex-I-201):** is that a real Jay-managed local brand or just a Claude paraphrase? Confirm before quoting in sales material.

##### Resolved (recorded, not open)

The MAIA naming-collision question (vs the P-7 "The Survivor" wellness avatar) is **closed** by Jay's decision, MAIA is only a nickname for the AI, not canon and not a separate brand/project. P-17 is being retired into PlainBlack's own Services / Tools / Playbooks; the card itself will be deleted.

---

### The PlainBlack direct-work play (P-8 / I-87)

**The PB direct-work play, turn audit/website production into recurring quick-cash revenue.**

**Productisation**

- **DIY** guide tier, low ticket, self-serve (~$120 ref. from Blackberry concept)
- **DFY** done-for-you tier, high ticket ($2000+ ref.)

**Website pricing concepts**

- **$799** for this website (one-off)
- **$999** + unlimited updates / changes within reason (retainer-ish)
- Upgrade path: charge $$$ for upgrades while playbooks scale underneath

**Audit format**

Top 2 sections should address the most obvious things they need first, Google, website. Lead with the bleeding wound, not the long list.

**Outreach motion**

- Quick website sales for locals
- Email / DM outreach with reports + websites attached (SEO / GEO / AEO style)
- PB landing pages purpose-built to convert for "make me a website" intent
- "Need a new website / recommendations", comment back with GitHub link

**Related:** see also "Job-Pitch Tool" item on this card · Stripe + Web3 prereq on Hub + Inbox card · Blackberry Eatery (real-world DIY/DFY pricing experiment).

---

### For Build-MapIe website Builds - AI quote tool idea (P-8 / I-672)

For Build-Map
Ie website Builds - AI quote tool idea:
Enter your URL, Domain host, Socials, Google etc
AI Quotes a price range

---

### Plain Black Creative (P-12 / I-297)

**Plain Black Creative, Go-To-Market Plan.** Productised offer stack + Tasmania/NZ segments + 60-day execution plan + success metrics. Source-of-truth GTM document, needs Jay validation (some content reads as draft/AI-generated, may need PB-voice rewrite before client use).

#### 1. Offers & Positioning, three productised packages

| Package | Price | What's included |
| --- | --- | --- |
| **Name & Frame** | $2.5-3.5k | Naming + positioning + tagline options; trademark/domain checks; mini-identity starter kit |
| **Brand Sprint** | $5-7k | 2-week process; logo + style kit (colour, type, usage); messaging framework; 90-day launch roadmap |
| **Idea Engine** | $1.5-2.5k / month | Monthly ideation session (hooks, concepts, social post scripts, campaign themes); 3-5 ready-to-use concepts monthly; optional content prompt library add-on |

*Positioning frame:* "fast, idea-first, strategy-led, and accessible to SME budgets (where larger Tassie/NZ agencies often price themselves out)."

#### 2. Target Segments

##### Tasmania

- Boutique tourism operators
- Regional food & beverage brands
- Community/social enterprises (grant-funded)
- Trade/contractor businesses scaling statewide

##### New Zealand

- Growth-stage SMEs priced out of tier-one shops
- Professional services needing rebrands/names
- Purpose-driven startups (with Māori partnership/localisation baked in)

#### 3. Marketing & Outreach

##### A. Website & Content (Weeks 1-3)

- Add a Packages page with clear names, outcomes, prices (ranges), and CTA
- Publish 3 short case-style blog posts:            "How a name sets the stage for growth" (lead-in for Name & Frame)
- "Why brand sprints beat brand plans" (lead-in for Brand Sprint)
- "The idea gap: why small businesses need an idea engine" (lead-in for retainers)

##### B. Social Media (60-day calendar)

Weekly rhythm:

- 1x "Idea drop" post (quick brand/creative idea for SMEs)
- 1x client story / case snippet
- 1x workshop / behind-the-scenes clip (short video, casual style)

Tone: conversational, curious, a bit cheeky (your natural voice).

Targeted hashtags: #TasmaniaBusiness #NZStartups #BrandNaming #BrandSprint

##### C. Outreach (Weeks 3-6)

- Build a list of 40 Tasmanian tourism/food operators + 40 NZ SME founders/professional services (LinkedIn + networks)
- Send short, idea-led messages: *"I've noticed your [X business] is growing, have you thought about a sprint-style brand kit to get you ready for [season/expansion]?"*
- Offer a free 20-min idea audit call → funnel into Name & Frame / Sprint

#### 4. Partnerships

- **Tasmania:** Connect with Tourism Tasmania suppliers list + small business associations
- **NZ:** Reach out to Māori creative collectives, frame partnerships around co-delivery, not tokenism. Builds trust fast and differentiates from generic agencies.

#### 5. 60-Day Priorities

| Weeks | Actions |
| --- | --- |
| 1-2 | Finalise package pages + blog posts. Draft 10 social posts to bank. Build outreach lists. |
| 3-4 | Launch social rhythm. Start outreach (20 messages/week). Run 2x free idea audits. |
| 5-8 | Convert audits into package sales (aim: 2-3 Name & Frame + 1 Sprint). Announce 1-2 case results publicly. Explore 1 cultural partnership in NZ. |

#### 6. Success Metrics (Day 60)

- 3-4 signed packages (Name & Frame / Sprint)
- First 1-2 Idea Engine retainers in place
- LinkedIn + Instagram followers: +100 (quality over volume)
- 1 partnership conversation underway (NZ side)

#### Open questions for Jay, must answer before this becomes canonical

1. **Is Tasmania actually live?** Doc treats Tas + NZ as dual primary markets. If Tas is a real expansion lane, this is the plan. If it's aspirational/old, strip Tas references and tighten to NZ.
2. **Are the prices current?** Name & Frame $2.5-3.5k, Sprint $5-7k, Idea Engine $1.5-2.5k/mo. Check against any active proposals (Blackberry, Pizza Pundits, etc.).
3. **PB voice rewrite needed.** Phrases like "strategy-led, and accessible to SME budgets" and "purpose-driven startups" are agency-cliche, directly violate Repo System Prompt anti-cliche rule. Before any of this goes on the website or in outreach, run it through PB Voice & Style Guide.
4. **Idea Engine vs The Box overlap.** Idea Engine = $1.5-2.5k/mo retainer for "ideation sessions + 3-5 concepts + optional content prompt library." That IS The Box productised. Decide: is Idea Engine the commercial name for The Box, or are they separate offers?
5. **"Free 20-min idea audit call"** is the funnel mechanic. Confirm if this is in active use. Ladder to Discovery Interview Framework on Marketing & Lead-Gen Ideas card.
6. **Māori partnership framing**, "co-delivery, not tokenism" is the right principle but the doc has no execution detail. Who's the relationship lead? What does co-delivery look like commercially?

#### Cross-card relevance

- PB Services, natural home; this is the commercial layer above the V1/V2/V3 playbook engine
- The Box scaffolding (Credibility & Media item *mpj98u53-16z161hx5*), Idea Engine = The Box productised; reconcile names
- Brand-bible stack on Credibility & Media, positioning frame ("fast, idea-first, strategy-led") must align to PB Voice & Style Guide
- Marketing & Lead-Gen Ideas, Discovery Interview Framework is the underlying mechanic for the "free 20-min idea audit"
- Active prospects (Blackberry, Pizza Pundits, MEBO, Tasman, etc.), check whether their proposals match these three package tiers or sit outside
- Credibility & Media, case-study blog posts referenced here ladder into media/PR plan

Next: Jay confirms Tas-NZ scope + Idea Engine ↔ Box reconciliation, then PB-voice rewrite pass before this hits the website/outreach. Source file safe to delete.

Comments:

**Jay:**

> **[Triage answers, 24 May 2026]**
>
> *Open questions, before canonical*
>
> 1. **Is Tasmania actually a live market?** → Captured in comment *Yes. Ian is there. Obviously*
> 2. **Are current prices accurate (Name&Frame $2.5–3.5k, Sprint $5–7k, Idea Engine $1.5–2.5k/mo)?** → Overhaul entirely
> 3. **PB-voice rewrite needed before external use?** → Yes, anti-cliche pass required
> 4. **Idea Engine vs The Box?** → Skip / unsure
> 5. **"Free 20-min idea audit call", in active use?** → Captured in comment *15 via fit filter form*
> 6. **Māori partnership "co-delivery", who leads?** → Captured in comment *WTF are you talking about?*

---

### Playbooks reframe (P-12 / I-250)

**Playbooks reframe: TLDR each section + Quick Wins toggle/filter, paired with a strategic move to a $1,499 “Branded System” tier that’s a tool, not a lesson. Direct synthesis of the market intel report’s findings into a PB-specific gameplan.**

#### Jay’s actual question (the title)

> “Playbooks reframe idea, TLDR each section & Have a Quick Wins toggle/filter?”
This is the operational ask: each playbook section gets a TLDR + a Quick Wins filter so a tired tradie at 8:30pm gets one usable win without reading the whole section. Sister UX move to the “use as tool not lesson” framework (full verbatim in comment below).

#### Jay’s honest read on the $99 playbook (verbatim)

> I have been feeling the amount of work in making $99 playbooks isn’t my ticket to freedom, would need 10,000 sold before I felt safe! Good low hanging fruit, but the difference between a higher tier service/product vs a $99 playbook has to be obvious. The playbooks are worth more than $99, currently, but in a short time this’ll be AI basic shit for business owners.

#### The gameplan emerging from the conversation (Bet B chosen)

| Bet | Shape | Verdict |
| --- | --- | --- |
| **Bet A, Playbook as lead magnet, not product** | $99 reframed as paid filter. Real revenue is $1,500–$5,000 implementation for buyers who finish section 1 and want it done. Justin Welsh / Pete Boyle pattern. | Valid but slow. |
| **Bet B, Skip the wedge, go to $1,500–$5,000** | 4 sales/mo at $2,500 = $10K/mo (same as 100 playbooks). PB is already qualified to sit in the “design-led AI tool, $1,500–$3,000, client owns the file” empty chair. McIndoe and Mint Exterior are the proof. | **This is the move.** |

#### The three bets surfaced by the original research synthesis (in priority order)

1. **Stop calling it “playbooks.”** Add a **$1,499 “Branded System”** tier. *A custom playbook plus one embedded AI tool built for that client. A quote calculator, a personality quiz, a content idea engine, whatever fits the brief.* $99 stays as entry; Branded System sits in the empty Designjoy-of-AI-tools chair.
2. **Build the quiz. Now.** The /tools Brand Spark concept becomes Pete Boyle’s “2-minute personalised growth report” mechanic. Mode A: free Brand Spark. Mode B: 5–7 question scope on every lander that recommends $99 vs $1,499 vs Free. Single engine, two outputs.
3. **Plant the AU/NZ AEO flag.** Reframe product 6 as *“AI Search Visibility System.”* Two altitudes ($99 self-serve / $1,499 done-for-you). Quarterly “State of AI Search Visibility for AU/NZ Small Business” study as the moat.

#### The differentiator sentence (verbatim, this is the keeper)

> **“The $99 playbook teaches you how to do it. The $1,499 Branded System just does it.”**
*That’s the lander headline. Five seconds to comprehend. A tired tradie at 8:30pm understands it.*

#### The gut-check question for every Branded System build (verbatim, this is the standing rule)

> “Could the client use this at 8:30pm and get a win in 10 minutes?”
*If no → it’s a playbook with extra steps. Cut, simplify, ship.*

#### The three site changes recommended (this week)

1. **Reorder /services.** Add Branded System between Brand Sprint and Idea Engine. From $1,499. One sentence: *“A custom AI tool wrapped in your brand. Built once. Yours forever.”*
2. **Change the homepage hierarchy.** Demote playbooks from equal billing with services. Hero CTA stays “Work with us.” Playbook becomes “or DIY from $99” secondary line. *Tell visitors you’re a branding studio with a $99 entry point, not a $99 product company that also does branding.*
3. **Stop building new playbooks.** 5 is plenty for a wedge. Every hour on playbook 6/7/8/9 is an hour not spent landing a Branded System client at 25× revenue.

#### What the conversation explicitly REJECTS (in PB voice)

- **No subscription tier**, no Designjoy clone. PB’s anti-retainer posture is a hook, not a handicap. Don’t blink.
- **No affiliate program yet**, works once an audience exists. PB has ~200 emails. Build audience first.
- **No coupon code in header**, Hatchly does it because they compete on price. PB doesn’t. Discounts pull the brand the wrong way.

#### Where this reframe lands the TLDR + Quick Wins toggle question
If Bet B is the chosen direction, the TLDR + Quick Wins toggle is **a low-leverage refactor of a wedge product**. The original conversation already calls this out: *“Don’t burn cycles polishing the wedge.”*

- **Low-effort version:** add a TLDR + Quick Wins toggle to existing playbooks as a one-pass UX upgrade (1–2 days work). Defensible.
- **High-effort version (rejected):** full UX refactor of all 5 playbooks per the “tool not lesson” framework. Weeks of work on the wrong tier.
- **Right move:** use the UX framework (verbatim in comment) as the design DNA for the new $1,499 Branded System tier. Build it “tool not lesson” from day one. Don’t refactor the wedge.

#### Where Jay’s recent items already align with this direction

| Item | How it converges |
| --- | --- |
| **DIY or DI2gether 4-tier funnel** (item `mpj4t6kd-81lvl1lx`) | Already declares the ladder. Branded System slots in at tier 3 / tier 4 boundary. |
| **Quote Fit Filter / Bradley Roofing** (items `mpj4m6ml-1j17161g11n` + `mpj4m4or-21j1l1o161j`) | $1,499 build offer = literally a Branded System. First proof point. |
| **$1,150 website offer** (item `mpj4ijyf-r1ku1530`) | Sits adjacent. Worth checking whether Branded System absorbs it or sits above it. |
| **No-Brainer Retainer** (item `mpj47ys3-171ghr1b18`) | Recurring complement to one-off Branded System. Same audience. |
| **McIndoe Content Command Centre pitch** (item `mpj2w21i-1nzpc21g`) | This IS a Branded System. The $3,500–$6,500 tier maps to a fuller Branded System variant. |
| **Custom GPT / Startup GPT** (items `mpj29nry-81l1p381h` + `mpj4qlsi-1o41rnq1p`) | Sits in the tier-1 free funnel routing into Branded System. |

#### Workflow note Jay surfaced (worth capturing)
The conversation also documented **how to run Claude Deep Research** for future intel:

- Bottom-left of claude.ai input → “Search and tools” → toggle **Research** on (turns blue) + Web search on.
- Server-side, agentic, runs 5–45 minutes. Hundreds of sources. Inline citations.
- Browser doesn’t matter (Safari fine). Stay on Pro/Max plan.
- Don’t add “and also research X” mid-flow, Research plans up front then executes; mid-flight steering doesn’t work.
- For each angle, run as a separate Research query (not a mega-prompt).
- Two-step workflow: Research generates intel (no brand context); paste back into context-aware chat for PB-voice synthesis.
The original deep-research prompt

Comments:

**Jay:**

> **[Source, “Tool not Lesson” UX framework, verbatim. Design DNA for the Branded System tier.]**
>
> **The Core Rule (non-negotiable)**
>
> Before we design anything: **This must feel like using a tool, not attending a lesson.**
>
> If it ever feels like:
>
> - “I should come back later and finish this”
> - “I need to focus to get through this”
> - “I’ll do this on the weekend”
>
> …it’s already broken for your ICP.
>
> **The Experience You’re Designing**
>
> Course mindset: “Learn this, then apply it” ❌
> Your model: “Apply this while you’re here” ✅
>
> **The Ideal User Session (this is your north star)**
>
> ICP: finishes work at 6pm, sits on the couch with a laptop, slightly stressed, low mental energy.
>
> What happens: 1) Lands on playbook. 2) Skims, not reads. 3) Finds something immediately useful. 4) Takes action within 5–10 minutes. 5) Feels progress. 6) Stops (and that’s fine).
>
> They do NOT complete the whole thing. They do NOT “go through modules.” They do NOT follow a journey. If they get one win, you’ve succeeded.
>
> **UX Principles**
>
> **1. Kill “progression”**, no Module 1/2/3, no progress bars, no “Continue where you left off.” That’s course DNA. Instead: each section = standalone, no required order, no sense of falling behind.
>
> **2. Front-load value aggressively**, every section starts with “Do this now:” Not explanation / theory / context. ICP isn’t here to understand marketing; they’re here to fix a problem.
>
> **3. Time-box everything**, “This takes 10 minutes” / “This takes 15 minutes” / “2-hour total fix.” Hits the “I don’t have time to learn another platform” objection.
>
> **4. Remove learning friction**, no long paragraphs, no frameworks-explained-in-depth, no diagrams-for-looking-smart. Yes: checklists, prompts, copy/paste blocks, examples.
>
> **5. Replace content with action**, every section answers “What do I physically do next?” not “Do I understand this?”
>
> **6. Make it feel disposable**, counterintuitively. Kajabi = “build a valuable asset library.” You = “use this, get the result, move on.” That builds trust.
>
> **The Structure That Works**
>
> Each section: (1) The Hook (5s), e.g. “Why your Google Ads aren’t working.” (2) The Reality Check (10s), one sentence that makes them go “yep, that’s me.” (3) The Action Block (core), Step 1, 2, 3. (4) The Shortcut (your edge), prompt, template, exact wording. (5) The Exit, “You’re done. Move to the next if you want.”
>
> **The Claude Integration (this is where you win)**
>
> Instead of: “Here’s how to write your ICP…”, give a button: **“Generate your ICP using this.”** Claude fills it, personalises it, removes thinking friction.
>
> **The Biggest UX Mistake to Avoid**
>
> Turning the playbook into something to *complete*. Your ICP doesn’t complete things. They dip in, grab value, leave, come back later. Design for that behaviour, not against it.
>
> **What It Should Feel Like (emotionally)**
>
> If nailed: “That was easy” / “That actually helped” / “I didn’t waste time” / “I can do this.”
> If missed: “I’ll come back to this” / “There’s a lot here” / &

**Jay:**

> **[Cross-link, new playbook backlog tests the “stop building $99 playbooks” constraint]**
>
> New item on this card (id `mpj5ws90-1h10yh1br`): Jay’s pasted 9 new playbook concepts (Social Media / 90-Day Campaign / Competitor Tracking / Industry-Specific / AI Back Office / Invoicing-Payroll / AI Inbox / AI DM / AI Phone Agent).
>
> **Why it matters here:** 6 of the 9 are better shaped as **Branded Systems** ($1,499) than as $99 Playbooks, aligns with the Bet B recommendation. 2 already have substantial existing items (Phone Agent on MAIA, Inbox/DM in Custom GPT extensions). Triaged through Bet B, this list becomes the Branded System catalogue backlog, not a violation of the “stop building playbooks” rule.

---

### The PlainBlack digital products framework (P-12 / I-240)

**The PB digital products framework: a 4-tier “DIY or DI2gether” funnel that resolves the Playbooks pricing fork into a clean ladder. Includes on-demand course mechanic, no-opt-in landing-page strategy, and an anti-Richard-Yu positioning angle for the social media plan tier.**

#### The 4-tier funnel (verbatim from Jay)

| Tier | What it is | Price |
| --- | --- | --- |
| **Free Stuff** | Help yourself. | $0 |
| **Subscribe** | Keep In Touch. | $0 (email opt-in) |
| **Paid Stuff** | Custom / Template. | $ |
| **Hire Us** | Personalised. | $$$ |

**The naming joke:** *“DIY or DI2gether?”*, PB-voiced. DI2 = “DIYou + Two”. Worth keeping as the funnel’s public framing.

#### How the funnel resolves the Playbooks pricing fork
The umbrella decision on Playbooks pricing (item `mpj1jg6p-1b13l1jk3`) had 5 options A–E. This funnel structure effectively chooses **a hybrid of A + B**:

- Playbooks live as *both* free content (tier 1) AND paid templates (tier 3) at different polish/personalisation levels.
- $99 Playbook fits in tier 3 (paid template).
- $1,150 website / $1,499 Quote Fit Filter / DFY social plans fit in tier 4 (Hire Us).
- No-Brainer Retainer ($200–$500/wk) sits adjacent to tier 4 as recurring Hire Us.
- The First-Fix / Spitball ($200 one-off) is the bridge between tier 2 and tier 3.

#### On-Demand Course mechanic

> “On Demand Course. Do IT. Record main points.”
Reading: Jay does the actual build / process, records the key moments, the recording becomes the course. **Documentation IS the product.** Zero double-work.

- **First on-demand course candidate:** Building a Custom GPT.
- **Substrate:** drafted on Squarespace as a landing page (SEO + click-worthy + shareable).
- **Distribution:** LinkedIn etc. Later upgraded with epic content (animations, b-roll, etc.).

#### Landing-page strategy (no-opt-in funnel)

| Audience action | What the page does |
| --- | --- |
| Like / share / comment | Pure social momentum, no friction. |
| Bookmark / email to themselves | DIY path, PB earns trust + audience without an opt-in. They’ll come back when ready. |
| Keep scrolling | End up at “CLICKHERE for a quote” CTA, soft route into tier 3 or 4. |

The mechanic Jay’s designed: **no email gate before the value lands.** Counter-cultural in marketing; aligns with the “you own the file forever” thesis from the market intel report. Trust-first.

#### First paid template: Building a Custom GPT
The Custom GPT blog (MAIA item `mpj29nry-81l1p381h`) + the Custom GPT extensions (MAIA item `mpj4qlsi-1o41rnq1p`) + this on-demand course concept = a clean first paid template offering.

- **What it is:** a structured walkthrough + reusable system-prompt scaffold + checklist for building one’s own Custom GPT.
- **Source material:** Section AI course (Prep/Prompt/Polish) + PB’s Future-Proof Playbook framework + Geoff Woods C.R.I.T. + Jay’s own builds.
- **Price floor:** $99 (matches Playbook entry), upper variant possibly $199–$299 if it includes a 1:1 review session.

#### Done-For-You Social Media Plan pricing tier

| Term | Price (NZD inc gst, inferred) |
| --- | --- |
| 1 month DFY social plan | $1,000 |
| 3 month DFY social plan | $2,000 |
| 12 month DFY social plan | $5,000 |

**Anti-Richard-Yu positioning angle** (verbatim):

> “Why you don’t need to pay $1,000–$5,000 USD to Richard Yu, target people who follow him. Save your money, DIY.”
*Richard Yu is a US social-marketing influencer charging USD prices to audiences who could DIY for half. Jay’s positioning: PB’s NZD-priced DFY plans + free DIY content beat his offer for the price-sensitive segment. Tight, defensible angle.*

#### Open decisions / loose ends

- **“DIY or DI2gether” wordmark**, ship as the public funnel-page header? Test it with a couple of people first, some readers won’t parse the wordplay instantly.
- **Squarespace as substrate**, aligns with the hosting decision (item `mpj3b339-1enda519`) only if Squarespace handles ecom legally (yes, it does). Worth confirming Stripe integration is workable.
- **Custom GPT course price**, $99 / $199 / $299 / $499? Pair the call with the Playbooks pricing fork resolution.
- **No-opt-in commitment**, Jay’s “no opt-in” preference is counter-cultural. Worth measuring whether the bookmark + scroll-to-CTA path actually converts, vs adding a subtle email capture mid-scroll.
- **Richard Yu name-drop**, tactical for targeting his followers, but worth checking the legal angle (defamation if claims are stated as fact, fine if framed as opinion or comparison).
- **“Email this to yourself” mechanic**, how exactly does that work? Mailto-link with pre-filled URL? Worth a 5-line spec so it’s actually built.
- **Content pipeline**, if “do it, record main points” is the production model, what’s the recording tool? Loom + transcript? Phone screen-record + Otter?
- **First 3 landing pages**, Custom GPT is #1. What are #2 and #3? Probably Quote Fit Filter (the build Jay’s shipping) and DFY Social Plan (so the tier 4 offer has a landing target).

#### Cross-card relevance

- **PB Services, AI Playbooks pricing** (item `mpj1jg6p-1b13l1jk3`), this funnel is the resolution. Worth merging or naming this as the chosen direction.
- **PB Services, First-Fix / Spitball** (item `mpj2cw45-1r618u1p18`), sits between tier 2 and tier 3 in this ladder.
- **PB Services, No-Brainer Retainer** (item `mpj47ys3-171ghr1b18`), tier 4 recurring variant.
- **PB Services, Quote Fit Filter** (item `mpj4m6ml-1j17161g11n`), tier 4 one-off Hire Us variant. Second landing-page candidate.
- **Credibility & Media, PB-as-Jay-actually-wants-it** (item `mpj4ijyf-r1ku1530`), the $1,150 website fits tier 4. Pair these.
- **Credibility & Media, “we did it ourselves” middle-man pivot** (item `mpj4fza6-kd1j1ip10`), the “free PB GPTs” mechanic IS tier 1.
- **MAIA, Custom GPT blog + extensions** (items `mpj29nry-81l1p381h` + `mpj4qlsi-1o41rnq1p`), the first paid template content already drafted.
- **Credibility & Media, market intel report** (item `mpj2jmo7-1jp1o1741d`), Justin Welsh DIY/DWY/DFY ladder (Pete Boyle’s “Rule of One”) is exactly this 4-tier shape, validated as a market-tested pattern.
- **Marketing & Lead-Gen Ideas, LinkedIn content brief** (item `mpj4aa7t-13c1kl1r0`), the “Save your money, DIY” anti-Yu post slots in as a candidate.
**Next:** declare the DIY-or-DI2gether 4-tier funnel as PB&rsquo

Comments:

**PlainBlack:**

> [Cross-card pointer from P-17 MAIA AI Consulting, 12 Jun 2026 · PlainBlack] Parking a decision here because MAIA's productisation parks on this exact fork. P-17 'MAIA AI Consulting' is a developed 11-item product-line archive flagged 'Need this folded into a PlainBlack Service.' It covers custom AI bots/models (primary), AI voice agents (in/out-bound + voicemail/receptionist), cold-outreach AI, AI websites/logos/ad-copy, an 'AI Proficiencies & Help' funnel, a Custom-GPT template catalogue, and a pricing ladder from a $1k 1-week audit to $100k+ builds. Decision to make in its own session: does MAIA become its own PB service line, fold under this DIY-or-DI2gether / Playbooks umbrella, or stay a standalone brand-front (cf. Coupland Consulting as MAIA via another brand)? Several P-17 items (voice product I-201, Custom-GPT blog I-207, pricing ladder I-169, specialisation thesis I-162) explicitly defer their pricing/packaging to this fork. Read first: P-17 anchor item I-112 + its triage-map comment.

---

### No-Brainer Retainer / ChatGPMe / AI Concierge (P-12 / I-230)

**No-Brainer Retainer / ChatGPMe / AI Concierge, a recurring retainer where Jay acts as the client’s outsourced AI-savvy operator.** Replaces every fragmented vendor (Google Ads manager, social media manager, occasional AI consultant) with one flat weekly fee + total IP ownership for the client.

#### The core frame (verbatim, this is the keeper)

> What if I was an AI asst? As in you use me like AI and I produce response, so you don’t have to be good at AI. **ChatGPMe.**
And the philosophy line:

> “We’re mates and we’ll look after each other.”
> 
> “I’ll provide more value overall and ya mate. Not trying to milk every invoice. Tell me what you need. Monthly. And I do it.”

#### Pricing surface

| Tier | Rate | What that buys |
| --- | --- | --- |
| **Standard** | $200+gst/wk ($1,000/mo inc gst) | Website / Google Ads / Social / AI / Chatbot / Systems / Marketing, anything remoteable. |
| **Alt (mid-band)** | $250+gst/wk | Possibly same scope; higher anchor for accounts willing to pay more. |
| **Premium** | $500+gst/wk ($2,000/mo) | Higher-touch / faster turnaround / bigger scope. |

#### Math Jay worked out

| Mix | Weekly | What it buys Jay |
| --- | --- | --- |
| 5 clients × $250+gst/wk | $1,250+gst (~$5,400/mo) | “Buys like 18 weeks of savings account.” |
| 5 × more (10 clients @ $200+gst) | $2,000+gst (~$8,600/mo) | “Now I’m good!” |
| 10 × more (20 clients) | $4,000+gst (~$17,200/mo) | “Me and Ian are golden.” |
| Alt mix | 4 clients × $500+gst = $2,000/wk | Same revenue as 5×$200 doubled, fewer accounts, more depth per account. |

#### What’s in scope (verbatim mash-up)

- Google Ads management (replaces external Google Ads manager).
- Social media management (replaces external social media manager).
- Custom GPT builds.
- Chatbots.
- Email newsletter.
- AI scraping.
- Avatars.
- Upgrade old YouTube videos (don’t re-shoot, update + upgrade with AI).
- Advice / quick tip / screening proposals + plans / emergencies / queries.
- Systems & infrastructure.
- **One-off carve-outs**: Custom GPT, Chatbots, etc, charged separately on top.

#### The positioning line

> “Basically replaces anything that can be done remotely, that you’re currently paying a person for, or wish you could. For less than [the] price [of a] full time employee, you get AI driven systems and infrastructure and you own the IP.”
*This collapses three sales arguments into one: replace fragmented vendors · cheaper than an FTE · own the IP.*

#### The Google Ads sub-pitch (worth shipping standalone)

> “Pay someone for Google Ads? AI does it for you, with your Google AI. One time set up. Monthly reports. DIY easy tweaks, via your own Gemini. (i.e. ‘change the photo to this’.)”
Could be filed alone as a Playbook (“Stop paying Google Ads management fees”) before the full retainer pitch lands.

#### Prospect list Jay named, mapped against existing PB cards

| Name Jay listed | Existing card / status |
| --- | --- |
| **Brett** | Probably *Brett Williams (Designjoy)*? Or different Brett? *Clarify before pitching.* |
| **Jimmy** | Redefined (Jimmy), card `mpi4y1vi-y12ynz15`, currently tagged `client`. |
| **Bobby** | No existing card. Who is this? |
| **Green & Grill** | Grill & Green, card `mpj0h4cl-2r1po18k`, `prospect`. |
| **Troy** | Troy Hall, card `mpi2l6rc-a1oh2bz`, `client`. |
| **MEBO** | MEBO (Glenn), card `mpj0l1m8-17vf1410c`, `client`. |
| **RRT** | No existing card. Acronym? Clarify. |
| **Serena** | No existing card. Clarify context. |
| **Mani/Kiki??** | No existing card. Two names; double question mark suggests Jay isn’t sure either. |
| **Papamoa Beach Resort?** | Probably Tasman Holiday Parks Papamoa Beach (card `mpj10wyr-1n1evat4`), or a different property. Confirm. |
| **Airconditioning fella** | No existing card. Anonymous reference. |
| **Axe throwing guy** | Battle Axe Throwing (Jayden CHCH), card `mpj0dufw-kg1r1ae1h`, `prospect`. |

**Implication:** at least 5 of the 12 names already have cards. Workable starting list. Six need clarification before reaching out.

#### The non-equity-partners framing

> “No-Brainer Retainer, non-equity partners. Don’t get quotes, look at proposals, Zoom meetings justifying the spend… Just base level, worry free, covered.”
> 
> “Now you can upgrade epically with any PlainBlack sub/package/workshop, as a mate.”
*The retainer is the floor. Bigger PB products / Playbooks / Custom GPT builds layer on top as upgrades for retainer clients.*

#### Open decisions

- **Minimum term**, Jay’s own note: *“Add minimum term for extras? Or set and forget and never get fired.”* Set-and-forget feels more on-brand than locked terms.
- **Naming**, No-Brainer Retainer / ChatGPMe / AI Concierge / something else? Probably ship as *“No-Brainer Retainer”* publicly with *“ChatGPMe”* as the internal in-joke / Easter-egg variant.
- **Scope vs Playbooks-as-services-glue (option C on the pricing fork)**, this offer IS option C in practice. Worth collapsing the two items’ thinking on the next triage.
- **How does this interact with the Papamoa Exclusive Directory** (item `mpj3z41h-1mo17j1415`)? Directory member benefits and No-Brainer Retainer scope overlap significantly. Could the directory membership = a No-Brainer Retainer at a lower price point + community / co-promotion benefits?
- **First-Fix relationship**, $200 Spitball / First-Fix becomes the qualifier in front of the $200/wk retainer. Symmetric pricing helps the upsell story.
- **Google Ads-only sub-offer**, ship as a standalone Playbook before the full retainer? “Stop paying Google Ads management fees” is a single-bullet pitch that opens conversations.
- **Solo capacity**, 5 clients @ $250/wk is one client per weekday equivalent. 10 clients doubles that. At 20, Jay needs Ian or automation. Worth pacing the ramp.
- **Brett / Bobby / RRT / Serena / Mani / Kiki / Airconditioning fella**, six unclarified names. Worth a 10-min pass to spell out who they are before any outreach.

#### Cross-card relevance
**PB Services, Playbooks pricing fork** (item `mpj1jg6p-1b13l1jk3`), this offer IS option C (services-glue) in concrete form. Worth merging the items’ thinking, or naming this as the “C” option explicitly.**PB Services, First-Fix / Spitball** (it

Comments:

**Jay:**

> **[Cross-link, combined positioning with the AI-team frame]**
>
> New item on AI Agents card (id `mpj4dtoh-131ltuvl`) introduces a “Meet the Team” AI-agent branding: **Aidan, Aimee, Aisling**, every name secretly starts with “Ai.”
>
> **Why it matters here:** ChatGPMe + Meet-the-Team combines into one sharper pitch: “Hire ChatGPMe and the Ai team. One retainer, one human supervisor, a roster of AI specialists.” The named team gives prospects a way to think about who’s doing what without Jay needing to spell out which-AI-does-which task.

---

### First-Fix (P-12 / I-209)

**First-Fix, paid diagnostic service (Zoom + follow-up) with a no-questions refund link. Day 22 build of the 30 Day Build Challenge.** Live (or in-flight) at plainblackcreative.com/first-fix (https://www.plainblackcreative.com/first-fix).

#### The mechanic

- **Book via Stripe**, client pays up front for the diagnostic.
- **Zoom + follow-up**, the diagnostic conversation, then a written / asset follow-up.
- **Refund link in the follow-up email**, one-click money back if it wasn’t valuable.
- **Black-list filter on refund abuse**, Jay’s verbatim line: *“If you don’t think the chat was valuable, just click refund. No hard feelings. If you are taking the piss, that’s ok. We have a client list for that.”*, on-brand, blunt, keeper.

#### Second-pass refinements (from Jay’s follow-up paste)

- **Price point:** **$200** for the chargeable call. Concrete number, no ladder yet.
- **Credit-against-price mechanic:** if the client engages PB after the call, the $200 comes off the service price. Open question: state this publicly on the sales page, or do it privately (“or we just do that privately”)?
- **Brief-to-take-elsewhere promise:** “Worth $200 even if we discover we aren’t the best fit, we’ll prepare a brief to take to an agency that we recommend.” Refund mechanic also covers wrong-fit cases, not just dissatisfaction.
- **Naming options widened:** First Fix · Audit · Discovery · *Spitball Sessions*. “Diagnostic/Discovery Chargeable (Spitball Sessions)” was the working title on Jay’s second pass.
- **`/wtf` demo URL:** proposed as a public-facing demo page that lives today and warms the funnel; the “book a call” button on it becomes the paid Spitball commitment.
- **Funnel branching:** client choice at the lander, (a) book the $200 Spitball / Diagnostic, or (b) skip the diagnostic and pay the whole service price up front.
- **Sales-script justification (Jay voice, cleaned):** *“Why we charge for a meeting. Everyone charges for meetings. It’s built into their costs, it just might not be you paying for it. If you don’t choose us and go elsewhere, well, that’s happened to them too, so you’ll be paying for it.”*, ship-ready.

*(Verbatim Jay-voice source preserved in the comment thread on this item.)*

#### Naming & positioning question
Jay’s note: *“ADD FIRST-FIX as service, but generalize to a diagnostic.”*

- **Option A:** Lead with “First-Fix” as the brand name, sub-line “the PB diagnostic.” Strong, ownable.
- **Option B:** Lead with “Diagnostic” as the generic category, “First-Fix” as the specific product variant. Easier for category search but loses brand grip.
- **Option C:** Use both depending on placement, “Diagnostic” in nav / services index, “First-Fix” on the standalone page + outreach.

#### Funnel question
The PB IG carousel (item `mpj1z4pv-119q1g113`, Marketing & Lead-Gen Ideas) ends with a **DM “AUDIT”** CTA for a **free 15-min teardown**. First-Fix is the natural paid step after that.

- Free DM Audit → Paid First-Fix → Engagement / retainer?
- Or: First-Fix replaces the free audit entirely (paid only, refund-guaranteed)?
- Or: they’re separate plays for different lead temperatures, free Audit for cold IG, paid First-Fix for warm inbound / referrals?

#### Site-integration TODOs

| Where | What to add |
| --- | --- |
| **Home page** | Surface First-Fix prominently, entry-point offer for new visitors. |
| **Services** | Add First-Fix to the services index, positioned as a diagnostic / entry product alongside MAIA / Playbooks / other service lines. |
| **Tools** | If First-Fix involves any client-facing form / portal, link from Tools page. (Or, alternatively, decide Tools is for Playbooks-style HTML artefacts only, and keep First-Fix in Services.) |

#### Open decisions / loose ends

- **Price point**, **now set at $200** per Jay’s second pass. Still couples to the Playbooks pricing fork (item `mpj1jg6p-1b13l1jk3`), whether the $200 sits inside a wider PB ladder ($99 Playbook / $200 Diagnostic / $499 / $1,499 mini-tool) or stands alone.
- **Stripe currency / GST**, same open question as the Playbook delivery automation (item `mpj1nx4j-1j6o1dhd`): NZD / AUD / int’l, inc / exc GST.
- **Refund operationalisation**, one-click refund flow needs Stripe + Make.com / Zapier wiring. Where does the refund link live (follow-up email template), and who’s alerted when a refund is triggered?
- **Black-list mechanism**, needs an actual list. Where does it live (Make.com data store, sheet, CRM)? Triggered by repeat-refund? Manual flag?
- **Follow-up format**, written summary, recorded Loom, PDF audit, or all three? Affects perceived value vs delivery time.
- **Diagnostic scope**, is First-Fix industry-agnostic (any business) or vertical-shaped (e.g., local service businesses only)? Affects messaging on the home + services pages.
- **Credit-against-price, public or private?** State on the sales page that the $200 comes off the service price, or honour it quietly to keep the upfront positioning clean?
- **`/wtf` demo URL**, what lives at that URL today? Static demo, sample teardown, interactive quiz? Pairs with the market-intel finding that 2-min interactive quizzes beat PDFs as lead magnets.
- **Naming choice**, First Fix / Audit / Discovery / *Spitball Sessions*. “Spitball Sessions” is the most ownable / PB-voiced of the four; “Discovery” is the most search-friendly.

#### Cross-card relevance

- **30 Day Build Challenge** (Day 22 build), today’s output. Cross-link below.
- **PB Services, AI Playbooks pricing** (item `mpj1jg6p-1b13l1jk3`), First-Fix pricing decision rhymes with Playbooks; consider as a coupled set rather than independent calls.
- **PB Services, Playbook delivery automation** (item `mpj1nx4j-1j6o1dhd`), same Stripe + Make.com plumbing pattern; the booking + refund + black-list flow could reuse infra.
- **Marketing & Lead-Gen Ideas, PB IG carousel (DM AUDIT)** (item `mpj1z4pv-119q1g113`), companion free offer; together they form the audit-funnel ladder.
- **PB Services, V3 Intake Schema** (item `mpj24iuu-kz183v1m`), the Zoom diagnostic could run on a lightweight version of the V3 intake.
- **MAIA AI Consulting, AI voicemail / receptionist** (item `mpj1w4g9-bts1p111k`), voice agent could field First-Fix pre-bookings as a phone funnel.
**Next:** price decision (pair with Playbooks fork), site integration (home / services / tools), Stripe + refund mechanic wired with Make.com, black-list data store decided. Once price + naming are set, fold First-Fix into the AI Marketing Agent POC and IG carousel CTAs as the warm-paid step.

Comments:

**Jay:**

> **[Cross-link, market-intel validates the mechanic, suggests price band]**
>
> Market intelligence report filed on Credibility & Media (id `mpj2jmo7-1jp1o1741d`). First-Fix mechanic already aligns with the report’s strongest patterns:
>
> - Refund-guarantee mirrors Designjoy’s “75% money-back week one.”
> - Tactic 1 (Stripe-direct) + Tactic 6 (first deliverable without brief, Brett designs without waiting for a written brief) directly apply.
> - Pricing benchmarks: $1,500–$2,500 bespoke-build zone if First-Fix becomes a real diagnostic + asset; $99–$499 if it stays an entry-level Zoom + follow-up.
> **Why it matters here:** price-band decision becomes clearer once the ladder question on Playbooks is settled. Match-set, don’t solo.

**Jay:**

> **[Source, Jay’s second-pass on First-Fix, verbatim from Monday paste]**
>
> *Working title Jay used at the top of this pass:* **“Diagnostic/Discovery Chargeable (Spitball Sessions)”**
>
> > ADD FIRST-FIX as service, but generalize to a diagnostic.
> > 
> > Could this be the Zoom + follow up?
> > 
> > Stripe to book, refund link on follow up email.
> > 
> > If you don’t think the chat was valuable, just click refund. no hard feelings.
> > 
> > If you are taking the piss, that’s ok. We have a client list for that.
> > 
> > Add First Fix to services, but Charge.
> > 
> > `/wtf` can be a demo, today, but each book a call is a commitment, and has a fully refundable booking fee.
> > 
> > Or skip the discovery, books a service. Book the appt, pay the whole lot.
> > 
> > First Fix/Audit/Discovery, we’ll decide, and we’ll take the $200 for the call off the price? (or we just do that provately.
> > 
> > Honestly it’s worth $200 even if we discovery that we aren;t the best fit, we’ll even prepare a brief to take to an agency that we recommend. Or just click the refund button.
> > 
> > **Why we charge for a meeting.** : Everyone charges for mettigns, it’s built into their costs, it just moght not you paying for it. If you dont; choose us and go elsewhere, well that’s happened to them too so you’ll be paying for it.
>
> **Sales-ready cleanup of the justification line (typos smoothed, rhythm preserved):**
>
> > **Why we charge for a meeting.** Everyone charges for meetings. It’s built into their costs, it just might not be you paying for it. If you don’t choose us and go elsewhere, well, that’s happened to them too, so you’ll be paying for it.

**Jay:**

> **[Cross-link, potential first-deal front door for McIndoe pitch]**
>
> New prospect filed: **McIndoe Media × Xplora** (card `mpj2w094-6m1k1mr15`, pitch on item `mpj2w21i-1nzpc21g`). Pitch has 3 tiers from $1,500 to $12,000+ NZD.
>
> **Why it matters here:** $200 Spitball Session could be the qualifier in front of the McIndoe pitch, lets Brandon try PB’s thinking on the channel strategy before committing to the $3.5K–6.5K full system. Credit-against-price mechanic rolls the $200 into the final invoice if they engage.

**Jay:**

> **[Cross-link, natural upgrade path from First-Fix to retainer]**
>
> New item on this card (id `mpj47ys3-171ghr1b18`): No-Brainer Retainer at $200+gst/wk. Symmetric pricing with the First-Fix $200 entry diagnostic.
>
> **Why it matters here:** $200 Spitball → if good fit → $200/wk retainer is a clean upgrade story. The $200 First-Fix credit-against-price mechanic could roll into the first week of the retainer. Worth pitching them together rather than separately.

---

## Playbooks

### Fold Into PlainBlack Playbooks (P-12 / I-688)

**Fold Into PlainBlack Playbooks**, repeatable templated $1k packages + the flagship Custom-GPT playbook, consolidated from the retired P-17 archive.

*Sources: ex-I-162, I-207, I-145 (content rhythm). Fold into the Playbooks Catalogue / the PB Services Playbooks-pricing umbrella. (MAIA = nickname only.)*

##### The repeatable "$1k pay-the-bills" package thesis (ex-I-162)

Pick one part of AI to be the best at (ideally agent-doable). One repeatable **$1,000-profit package**, templated + AI-tooled, finishable in <1 day, sellable 1–5×/week (1/wk = $4k/mo, 5/wk = $20k/mo). Add upsell/diversification only once the template ships repeatably. **Four focus areas, each a candidate Playbook:**

1. **Custom GPTs**, "Your business in a GPT", $999 setup + minor monthly.
2. **AIO & SEO**, niche audit + 90-day SEO sprint, $999 or $1,499.
3. **AI Agent Automation**, Make.com / n8n / Zapier + AI for one workflow; "one agent, one workflow" $999 install + retainer.
4. **Content Creation**, blog + social + UGC + email; $999/mo content engine (recurring, not one-off).

Tool-stack patterns to template: GPT+Zapier · GPT+ManyChat+AI reels · Gemini ecosystem (Gmail/Drive/Docs/Sheets) · Notion/Monday + Custom GPT for dynamic AI quotes. **First package to ship: Custom GPT** (fastest to template, most demoable), build it, sell it 3×, then expand. *The hard $59.52/hr ($10k-week) revenue-floor anchor that frames this thesis → Unsure.*

##### Flagship "Building a Custom GPT" playbook + sales asset (ex-I-207)

Published-ready PB blog/offer selling custom GPT / Gem development, using the **Prep / Prompt / Polish** framework. Hook: "It's not about having an AI. It's about having *your* AI." Body: What is a Custom GPT → How it works (**Prep**: goal/problem/data · **Prompt**: 4-layer system prompt = objective/context/task/rules · **Polish**: test/observe/refine) → Why your business needs one (accuracy, time/cost, scalability) → CTA. Service flow: Discovery Call → Custom Development (design/train/deploy/Zapier) → Refinement & Delivery. On-brand use-case examples: personal tutor, fitness coach, meal planner; plus the cheeky ones, breakup assistant, pet translator, pub-quiz master. Demo CTA points to a PB-built site GPT. **Loose ends → Unsure:** not yet published; demo-GPT URL needs creating; PB-voice pass wanted (your 24-May call: voice pass = YES; trim "competitive edge" / "dramatically increasing efficiency" cliches); pricing/packaging waits on the umbrella fork.

##### Proficiency-as-Playbook content rhythm (from ex-I-145)

Each "AI Proficiency" (Custom GPT, AI Agent, Chatbots take, AI Logos take, Templates, UGC character, Email/RSS scraping, RTT) publishes as a blog + demo and becomes a catalogue Playbook entry. One/week cadence; each finished page is also a tile in the AI Proficiencies funnel (Services bucket).

---

### Plain Black Future-Proof Playbook Generation Framework (P-12 / I-217)

**Plain Black Future-Proof Playbook Generation Framework, master instruction document for using intake data + Claude to generate high-conviction, niche-specific marketing playbooks.** 12-section SOP. The production engine behind the Playbooks product line.

Attached: `PlainBlack_Future_Proof_Playbook_Framework.docx`.

#### Core principle (verbatim)

> **Claude is the builder, not the strategist. Plain Black provides the decision logic, commercial guardrails, niche framing and upsell architecture.**
Future-proofing thesis: *“If the framework slides back into generic tool instructions, AI will compress the value fast. If it stays anchored in decision logic and niche-aware commercial thinking, Claude becomes your scale engine rather than your competitor.”*

#### 12-section table of contents

1. **What this system must achieve**, playbooks must feel written for one business, prioritise decisions over button-clicks, build in self-serve + recognition-of-PB-leverage.
2. **Non-negotiable rules for every playbook**, strategic objective before any tactic; every rec tied to intake; explicit AI-vs-human boundaries; each channel section has decision framework / strategic rules / light execution / common mistakes / KPIs / upsell triggers.
3. **Intake data → strategy mapping**, 8-row table (see below).
4. **Required structure per section**, 8 sub-headings (see below).
5. **Voice, positioning, commercial intent**, help progress without making them feel patronised; reveal complexity that signals when expert help is worth it.
6. **Channel framework example: Meta Ads**, intent choice, decisions Claude must force, strategic rules, light execution, likely friction, upsell hooks.
7. **Channel framework example: Google Ads**, high-intent vs mid-intent terms, keyword strategy, landing-page alignment as mandatory.
8. **Quality-control checklist**, 7 questions Claude must answer before finalising (see below, verbatim).
9. **Master Claude prompt template**, the production system prompt (see below, verbatim).
10. **Optional enhancement prompt blocks**, offer-sharpening, local-nuance, upsell-signal, implementation-burden.
11. **Recommended rollout process**, intake → draft → strategic review → trim commodity execution → publish with early wins + controlled friction → refine from sticking points.
12. **Final guidance**, future-proofing thesis (quoted above).

#### Section 3, Intake → strategy mapping (verbatim)

| Intake field | Why it matters | Must influence | Example use |
| --- | --- | --- | --- |
| **Primary service / offer** | Defines intent, urgency, margin | Channel priority, keyword selection, ad angle, CTA | Exterior cleaning vs repainting need different search intent + proof |
| **Geography / service area** | Shapes search volume, radius targeting, logistics | Local keywords, suburb references, travel assumptions | Hobart metro messaging differs from statewide |
| **Target customer** | Changes objections + emotional triggers | Messaging, imagery, lead form questions | Homeowners value trust; builders value reliability + responsiveness |
| **Average job value / minimum job** | Determines allowable CPL / CAC | Budget framing, lead qualification, channel suitability | Low-ticket services need tighter cost control |
| **Current assets** | Shows what can be leveraged immediately | Landing pages, creative format, proof stack | No case studies means trust must be built differently |
| **Owner capacity / team size** | Prevents over-prescribing work | Cadence, automation, execution burden | Solo operators need fewer moving parts |
| **Growth goal** | Clarifies whether aim is volume, quality, or market position | Campaign objective, reporting lens, sequencing | Pipeline fill differs from premium repositioning |
| **Seasonality / weather** | Changes timing + urgency | Campaign calendar, angles, offer timing | Exterior services depend on weather windows |

*Field set maps cleanly to the V3 Intake Schema (item `mpj24iuu-kz183v1m`), that intake is the upstream data capture, this framework is the downstream playbook generator.*

#### Section 4, Required structure for every playbook section

1. **Section objective**, what it’s trying to achieve for this client specifically.
2. **Decision framework**, force a choice between meaningful options, explain trade-offs.
3. **Strategic rules**, principles that survive platform updates.
4. **Personalised recommendations**, tied to niche / geography / audience / economics.
5. **Execution guidance**, tactical, light, platform-agnostic where possible.
6. **Common mistakes**, warnings tuned to the client’s situation.
7. **KPIs and review cadence**, business metrics, not vanity.
8. **Plain Black escalation points**, where the client will likely need help (upsell logic).

#### Section 8, Quality-control checklist (verbatim, must satisfy before finalising)

1. Does the playbook clearly sound like it was built for this exact business?
2. Are recommendations tied to business economics, not just platform capability?
3. Does every section include at least one meaningful decision with trade-offs?
4. Would the advice still hold if a platform UI changed next month?
5. Does the document include enough clarity to be useful, while leaving room for Plain Black’s higher-value services?
6. Are likely execution bottlenecks named plainly so the client can identify where support is needed?
7. Are metrics framed around business outcomes (lead quality, job value, close rate, CAC, conversion) rather than vanity alone?

#### Section 9, Master Claude prompt template (verbatim, the production system prompt)
You are creating a marketing playbook for Plain Black Creative. Build the playbook for the specific client described in the intake data below. Do not write a generic guide. Use Plain Black’s strategic approach: decisions first, execution second.

Your job is to create a playbook that:

1. reflects the client’s niche, geography, target audience, offer mix, economics, current assets and internal capacity;
2. explains what the client should do, why it matters and how to decide between options;
3. keeps platform walkthroughs light and instead emphasises commercial judgment, messaging, prioritisation and likely bottlenecks;
4. explicitly identifies where AI can help and where expert human input is still required;
5. naturally creates opportunities for Plain Black Creative to assist with strategy, creative direction, implementation, optimisation or reporting.
For each section, use this structure: Section Objective; Decision Framework; Strategic Rules; Personalised Recommendations; Execution Guidance; Common Mistakes; KPIs and Review Cadence; When to Engage Plain Black.

Tone: direct, commercially grounded, smart, specific and useful to a business owner. Avoid generic filler. Avoid bloated tool tutorials.

Intake data: [PASTE CLIENT INTAKE HERE]
Sections to generate: [PASTE REQUIRED PLAYBOOK SECTIONS HERE]</p

Comments:

**Jay:**

> **[Cross-link, consider bolting an Interview step into this framework]**
>
> New item on Jay Career (id `mpj37dev-191j1010172`) captures Geoff Woods’ **C.R.I.T.** framework: Context → Role → Interview → Task.
>
> **Why it matters here:** the Master Claude Prompt in this framework currently ingests intake data passively and goes straight to drafting. Bolting an **Interview step** before drafting, “ask me up to N sharpening questions about gaps in the intake”, would catch missing context that the V3 Intake didn’t surface, before the Playbook gets generated. Cheap improvement, high signal.

**Jay:**

> **[Duplicate file detected & skipped]**
>
> A second copy of `PlainBlack_Future_Proof_Playbook_Framework.docx` was found in `/Desktop/PlainBlack./` (the original was in `/Downloads/`). Content verified identical via SHA256 hash. **Not re-filed**, this item already holds the full extraction.
>
> Both source files now safe to delete.

**Jay:**

> **[Cross-link, V2 of this framework now filed]**
>
> The V2 Prompt Pack supersedes this V1 framework. New item: `mpj92172-z1f91c012` on PB Services. Major V2 additions:
>
> - Standalone **System Prompt** designed for Claude project instructions.
> - Full **QA / Red Team Prompt** (8-criteria audit, outputs verdict + 10 improvements + rewritten weak sections).
> - **4 refinement prompts** ready-to-paste (niche-specific / commercial / PB ascension / owner readability).
> - Channel boosters for **Meta Ads + Google Ads**.
> - Explicit **6-item Publishing Checklist**.
> - Sharpened moat statement: *“The moat is not that Claude can build a playbook. The moat is that Plain Black controls the inputs, the decision logic, the commercial framing, and the escalation design.”*
>
> V1 stays valid as the framing doc; V2 is the operational pack to paste into Claude.

---

### PlainBlack V2 Prompt Pack (P-12 / I-294)

**PlainBlack V2 Prompt Pack, successor to the Future-Proof Playbook Framework v1 (item `mpj34ri2-h1c71e1q1e`).** Adds System Prompt + QA/Red Team prompt + 4 refinement prompts + Meta & Google Ads channel boosters + publishing checklist. Source docx being deleted, full verbatim extraction.

**Purpose:** Generate tailored playbooks using intake data while preserving Plain Black strategy, tone, and upsell logic. **Use with:** Claude project, intake form output, and QA/revision workflow.

#### How to use this pack

1. Paste the System Prompt into your Claude project instructions or the first message in a dedicated project.
2. Supply the client’s intake answers in structured form using the Intake-to-Output Prompt.
3. Run the generated playbook through the QA Prompt before publishing or handing it to a client.
4. Use the refinement prompts when you want stronger niche fit, better commercial logic, or more obvious escalation opportunities.

#### 1. Non-negotiables Claude must follow

1. Every playbook must be personalised to the client’s exact niche, offer mix, service area, goals, constraints, budget reality, and level of marketing maturity.
2. Claude must prioritise decision-making, trade-offs, and strategic judgement over tool-click tutorials.
3. Execution guidance should be light and practical. The playbook should explain what to do, why it matters, when to choose each path, and what mistakes to avoid.
4. Each major section must include natural escalation points where the client is likely to stall, second-guess themselves, or need hands-on help from Plain Black.
5. Claude must write for real business owners, not marketers. Language should be clear, confident, commercially grounded, and free of generic fluff.
6. Claude must never produce a generic ‘one size fits all’ marketing guide. It must behave like a strategist briefed on this exact business.

#### 2. Required output structure for every playbook section (8 sub-elements)

| Element | Description |
| --- | --- |
| **Section objective** | What this section is trying to achieve for the client’s business. |
| **Decision framework** | Key choices the client must make, with guidance on when each option fits. |
| **Strategic rules** | Plain-language principles + non-negotiables for this channel/topic. |
| **Recommended path for this client** | Claude must state what is most suitable for this business and why. |
| **Execution guidance** | Only the minimum practical steps needed to move forward. Not a software tutorial. |
| **Common mistakes** | Errors most likely for this business type / niche / maturity level. |
| **Escalation triggers** | Where the client is likely to need Plain Black to speed things up, fix issues, or implement properly. |
| **Prompt assist block** | A short prompt the client can use with Claude for tactical help, based on the strategic direction already set. |

#### 3. SYSTEM PROMPT (verbatim, copy into Claude project instructions)

> You are Claude acting as Plain Black Creative’s senior strategist and playbook builder. Your job is to turn client intake data into a tailored, commercially useful marketing playbook that helps the client make better decisions and increases the likelihood of successful implementation by either the client or Plain Black.
> 
> You must follow these rules:
> 
> 1. Personalise everything to the client’s exact niche, service mix, geography, positioning, price point, target audience, growth goals, and operational reality.
> 2. Prioritise strategic judgement over generic tutorials. Explain what to do, why it matters, which option best fits this client, and what trade-offs apply.
> 3. Keep execution guidance practical but light. Do not write step-by-step platform training unless absolutely necessary.
> 4. Build natural escalation points into the playbook where the client may need Plain Black for strategy, implementation, creative, ad management, web updates, automation, or review.
> 5. Write in plain English for a business owner. Be specific, commercially grounded, and direct.
> 6. Avoid generic filler, obvious marketing cliches, and one-size-fits-all advice.
> 7. For every channel section, include: objective · decision framework · recommended path for this client · strategic rules · common mistakes · escalation triggers · a short tactical Claude prompt the client can use.
> 8. Where intake data is incomplete, make the most commercially reasonable assumption and clearly label it as an assumption.
> 9. Default toward local relevance, conversion logic, and realistic workload for the client.
> 10. Protect Plain Black’s commercial interests by making the playbook valuable on its own while still revealing where expert support will improve speed, confidence, and outcomes.
> The playbook should feel like it was made by a sharp strategist who understands this exact business, not by an AI generating a marketing article.

#### 4. INTAKE-TO-OUTPUT PROMPT (verbatim, generates first draft)

> Using the system rules already provided, create a tailored marketing playbook for the business below.
> 
> **Business intake data:** [PASTE STRUCTURED INTAKE HERE]
> 
> **Required outcome:**
> 
> - Build a personalised playbook for this business only.
> - Make the advice fit the business’s niche, local market, offer, and likely buyer behaviour.
> - Focus on decision-making and strategic guidance first, practical implementation second.
> - Highlight the path most likely to create traction for this business in the next 90 days.
> - Include only channels, tactics, and recommendations relevant to this client.
> - Make clear where Plain Black can accelerate results or reduce risk.
> - Do not write generic advice. If a recommendation would apply to almost any business, either personalise it further or leave it out.
> **Required playbook section order:**
> 
> 1. Business snapshot
> 2. Audience and demand summary
> 3. Positioning and messaging priorities
> 4. Offer and conversion priorities
> 5. Channel strategy overview
> 6. Meta Ads
> 7. Google Ads
> 8. Organic / content / local visibility (if relevant)
> 9. Website or landing page priorities
> 10. Measurement and review cadence
> 11. 30-day action plan
> 12. Where Plain Black support would create the biggest lift
> **Formatting:** Clear headings + short paragraphs + bullets where useful + skimmable for a busy business owner + confidence without inventing facts + flag assumptions where data is missing.

#### 5. Structured intake format template (7 fields)

| Field | What to capture |
| --- | --- |
| **Business basics** | Business name, location, service area, years in business, team size, website, social channels |
| **Niche and offers** | Primary services, secondary services, preferred jobs, jobs to avoid, average job value, margin clues |
| **Audience** | Ideal customer types, common buyer objections, seasonal demand, local considerations |
| **Positioning** | Why clients choose them, proof points, testimonials, unique process, brand tone |
| **Current marketing state** | What is already working, what has failed, content assets available, website quality, CRM/automation setup |
| **Budget and capacity** | Monthly ad budget, inte |

---

### Playbook backlog (P-12 / I-252)

**Playbook backlog, 8 concrete concepts Jay wants to build. BUT: the recent reframe (item `mpj5nrjy-u1r1e141ed`) explicitly recommended “stop building new playbooks, 5 is plenty for a wedge.”** This list needs triaging through that lens before any build starts.

#### The list (verbatim)

1. Social Media Playbook
2. 90-Day Marketing Campaign
3. Competitor Tracking AI Tool
4. Industry-Specific Playbooks (trades, NDIS, hospitality)
5. AI Back Office Playbook (automation-focused, for anyone quoting / booking / invoicing)
6. Do your invoicing / receivable / payrolls
7. AI to manage email inbox, filter, reply, fwd, notify etc
8. AI to maximize your DMs
9. AI Phone Agent Playbook (any business that misses calls)

#### Triage against the reframe (Bet B = stop building $99 playbooks, focus on $1,499 Branded System)

| # | Concept | Right shape under Bet B | Existing item this duplicates / extends |
| --- | --- | --- | --- |
| 1 | **Social Media Playbook** | Either: (a) auto-pilot $99 wedge alongside existing 5, OR (b) $1K–$5K Done-For-You social plan (already priced, item `mpj4t6kd-81lvl1lx`, the DFY social tier of the funnel). DFY is the better revenue shape per Bet B. | DIY-or-DI2gether funnel, DFY social $1K/$2K/$5K already named. |
| 2 | **90-Day Marketing Campaign** | Almost certainly a Branded System ($1,499–$2,500), not a $99 wedge. Pete Boyle’s “90-day system, hand it over, leave” positioning is the exact comparable from the market intel report. | Market intel report Funnel #3 (Pete Boyle). |
| 3 | **Competitor Tracking AI Tool** | This is a *tool*, not a playbook. Branded System territory. Sister to Quote Fit Filter, Bradley-style $1,499 build. | Sister of Quote Fit Filter (item `mpj4m6ml-1j17161g11n`). |
| 4 | **Industry-Specific Playbooks (trades / NDIS / hospitality)** | Multiplies the $99 SKU count. Directly contradicts “stop building new playbooks.” Better: industry-specific *Branded Systems* (e.g., “Trades Quote Fit Filter,” “Hospo Reservation AI,” “NDIS Provider Intake Bot”) at $1,499 each. | Maps each vertical to a Branded System sibling. |
| 5 | **AI Back Office Playbook** (quote / booking / invoicing automation) | Probably a Branded System. Touches Make.com / Zapier / Stripe automations. Sister to the Playbook delivery automation spec (item `mpj1nx4j-1j6o1dhd`). Per-client wiring = $1,499+ build. | Playbook delivery automation spec; No-Brainer Retainer ongoing variant. |
| 6 | **Invoicing / receivable / payrolls** | Aligns with the “Cancel Xero / Fire Your Accountant” LinkedIn post angle (item `mpj4aa7t-13c1kl1r0`). $500 DIY-Xero claim already floated. Could be both a $99 Playbook AND a $1,499 build, depending on complexity. | LinkedIn content brief (accounting post). |
| 7 | **AI Email Inbox Manager** | Branded System candidate. Per-client Gmail/Outlook setup + Custom GPT + automation rules = a real build, not a document. | Custom GPT extensions (item `mpj4qlsi-1o41rnq1p`), cross-platform GPT angle applies. |
| 8 | **AI DM Maximizer** | ManyChat + Custom GPT hybrid, already discussed in the Custom GPT extensions item (“hybrid is supercharged”). Branded System per-client setup. | Custom GPT extensions; ManyChat templates on AI Agents card (items `mpj1qymw-1f1b01n110` + `mpj1r0aa-51nt17u1q`). |
| 9 | **AI Phone Agent Playbook** | *Already in flight.* The voicemail/receptionist item on MAIA (item `mpj1w4g9-bts1p111k`) has the Vapi/Bland/Retell vs Twilio+ElevenLabs+Claude analysis ready. | Voicemail/receptionist item on MAIA. |

#### The honest read on this list under Bet B

- **2 of 9** (the AI Phone Agent + AI Email Inbox / DM Maximizer family) already have substantial existing items. Not net-new.
- **6 of 9** are better shaped as **Branded Systems** ($1,499) than as $99 Playbooks. Each one is “custom playbook + one embedded AI tool built for that client”, the exact Branded System spec.
- **0–1 of 9** are good $99 Playbook expansions (maybe just “DIY-Xero replacement” as a wedge; everything else is too operational for a static document).
- **The right move is reframing this list, not deferring it.** Most of these are the Branded System catalogue Jay’s building toward anyway.

#### Suggested re-shape (replace the list)

| From this list | Shipped as | Price |
| --- | --- | --- |
| 1 + 6 + 7 + 8 | Branded System catalogue, each as a per-client build with PB-voiced AI tool wrap | $1,499 each |
| 2 (90-day campaign) | Premium Branded System or Pete-Boyle-style 90-day system | $2,500–$6,500 |
| 3 (Competitor Tracking AI Tool) | Branded System tool variant (sister to Quote Fit Filter) | $1,499 |
| 4 (Industry-specific) | Branded System per vertical (Trades / NDIS / Hospitality variants) | $1,499 each, can templatise per industry |
| 5 (Back Office automation) | Branded System, per-client Make.com / Zapier / Stripe wiring | $1,499+ depending on complexity |
| 9 (Phone Agent) | Already in flight on MAIA card | $300–500 setup + $100–200/mo (existing pricing surface) |

#### Open decisions

- **Does Jay still want to build a $99 Social Media Playbook**, or fold it into the existing DFY social plan tier?
- **NDIS as a vertical**, new to PB’s named verticals. Worth confirming Jay has a path into NDIS providers (different to general SMB, regulated, slow procurement, AU-leaning).
- **Priority ordering**, which 2 of these 9 do Branded System V1 + V2? Probably AI Phone Agent (already half-built) + one of (AI Email Inbox / 90-Day Campaign / Competitor Tracking). Picking by warmest available prospect.
- **Does Jay accept the “stop building $99 playbooks” constraint** from the reframe? If yes, this list becomes Branded System backlog. If no, the reframe gets revisited.
- **Naming the catalogue**, if each of these is a Branded System variant, do they each get a distinct sub-name (“Phone Watch,” “Inbox Wrangler,” “Competitor Lens”) or just numbered tags?

#### Cross-card relevance
**PB Services, Playbooks reframe + Branded System tier** (item `mpj5nrjy-u1r1e141ed`), the framework this list needs to be triaged through. Cross-link comment filed below.**PB Services, Quote Fit Filter** (item `mpj4m6ml-1j17161g11n`), the template Branded System shape for items 3, 5, 7.**MAIA, AI voicemail receptionist** (item `mpj1w4g9-bts1p111k`), already covers item 9 (Phone Agent).**MAIA, Custom GPT extensions** (item `mpj4qlsi-1o41rnq1p`), covers items 7 + 8 (email + DM) substrate.**AI Agents, ManyChat booking + QR retention templates** (items `mpj1qymw-1f1b01n110` + `mpj1r0aa-51nt17u1q`), covers item 8 (DM Maximizer) substrate.PB Services, Playbook delivery au

---

### Playbook idea archive (P-12 / I-255)

**Playbook idea archive: AI to Answer Your Calls.** Sales-script framing + a security FAQ insert + the “AI screener” gold mechanic.

#### Bonus FAQ insert (verbatim, for existing playbook product, separate from the phone idea)

> **Is my playbook private and secure?**
> 
> Yes. Your playbook is hosted at a private, unguessable URL that is never listed, indexed, or shared with anyone other than you. There are no accounts, no logins, and no passwords to forget. Just a link that only you have. Nobody can browse to it, search for it, or stumble across it. If you want to keep it extra secure, don’t share the link.
*Jay’s note alongside: “add FAQs.” This is one to add to the playbook product pages.*

#### The AI Phone Agent pitch (verbatim)

> You don’t have a phone number!!, DO, or get AI phone.
> 
> Do an AI phone agent. 100% never miss a phone call.
> 
> **Not a Chat Bot. Not an Answer Service. Not an Indian. Not a list off press 1 for, press 2 for… Not a MONTHLY cost.**
> 
> Get calls forwarded, SMS/email notifications.
> AI gets customer details, right, every time.
> 
> So you don’t have to. So you never miss or lose a business call. So your customers can reach you when they need to. So you never get interrupted.
> 
> Replace voicemail with automation, ie AI screener: *“while your call is going through, can I ask who’s calling?”*, **THIS IS GOLD, people will want to ask how they can have one too.**

#### The gold mechanic to ship
The AI screener line is the keeper: **“While your call is going through, can I ask who’s calling?”** Functions as both pre-call qualification AND a viral hook, callers experiencing it will ask the business owner where to get one. Self-evangelising.

#### Open question / loose end

- **“Not an Indian”**, targeted at offshore call-centre stereotypes; risk of reading as racist out of context. Soften to *“Not an offshore call centre”* before anything public. Internal use only as-is.

#### Cross-card relevance (light)

- **MAIA, AI voicemail / receptionist** (item `mpj1w4g9-bts1p111k`), already has the Vapi / Bland / Retell vs Twilio+ElevenLabs+Claude build paths + pricing surface ($300–$500 setup + $100–$200/mo). This Playbook framing extends that work. **Add the AI screener line to that item’s sales-copy section.**
- **PB Services, Playbook backlog** (item `mpj5ws90-1h10yh1br`), this is concept #9 from that list (AI Phone Agent Playbook).

Comments:

**Jay:**

> **[Triage answers, 24 May 2026]**
>
> *"Not an Indian" line*
>
> 1. **Soften to "Not an offshore call centre"?** → Yes, soften

---

### Playbook idea archive (P-12 / I-258)

**Playbook idea archive: Business Startup Shortcut Playbook.** Anti-procrastination opening shape, for new founders.

#### The idea (verbatim)

> **Business Startup Shortcut Playbook** (Don’t waste time on things that don’t make you money, fast)
> 
> Logo, website, social media, Google account, brand, content strategy, admin, etc etc.
> 
> 24–48 hour playbook + the 1st 30 & 90 day game plan.

#### Shape (light)

- **The 24–48 hour core:** minimum-viable startup checklist, what to set up immediately, what to skip.
- **30-day plan:** revenue-first priorities. Get one customer before perfecting anything else.
- **90-day plan:** first scale steps once revenue is in motion.
- **The differentiator angle:** says “skip the logo perfectionism, ship the offer” in PB voice. Anti-perfection, pro-revenue.

#### Cross-card relevance (light)

- **PB Services, Playbook backlog** (item `mpj5ws90-1h10yh1br`), sibling concept.
- **MAIA, Custom GPT extensions / Startup GPT** (item `mpj4qlsi-1o41rnq1p`), the Startup GPT spec there overlaps directly. Could be the same offer in different formats (GPT for interactive, Playbook for asset-style).

---

### Playbook idea archive (P-12 / I-259)

**Playbook idea archive: Email List Playbook.**

#### The idea (verbatim)

> **Niche:** Email Marketing
> **Product:** Email List Playbook
> **Target Customer:** Small retailers, service businesses

#### Cross-card relevance (light)

- **PB Services, Playbook backlog** (item `mpj5ws90-1h10yh1br`), sibling concept.
- **Marketing & Lead-Gen Ideas, Newsletter teardown series** (item `mpj2qdzm-m1r0f52`), same email-marketing surface, different angle (critique vs build).

---

### Playbook idea archive (P-12 / I-260)

**Playbook idea archive: Google Ads Playbook for trades / home services.** Plus three sharp anti-agency sales lines.

#### The idea (verbatim)

> **Niche:** Google Ads
> **Product:** Google Ads Playbook
> **Target Customer:** Trades, home services
> 
> DIY Google Ads, Your Marketing Agency uses AI (if not, they are not good).
> Your marketing agency will hate me.
> Your marketing agency knows their time is up.

#### The keeper lines

- **“Your marketing agency uses AI, if not, they are not good.”**, defangs the “DIY isn’t professional” objection in one sentence.
- **“Your marketing agency will hate me.”**, PB voice. Earned-enemies positioning.
- **“Your marketing agency knows their time is up.”**, sits with the “Bloody hell we did it ourselves” / agency-model-is-dead thread.

#### Cross-card relevance (light)

- **PB Services, No-Brainer Retainer** (item `mpj47ys3-171ghr1b18`), Google Ads sub-pitch already drafted (“Pay someone for Google Ads? AI does it for you”). Same line of attack.
- **Credibility & Media, “we did it ourselves” middle-man pivot** (item `mpj4fza6-kd1j1ip10`), agency-model-is-dead philosophical bedrock.
- **PB Services, Playbook backlog** (item `mpj5ws90-1h10yh1br`), sibling concept.

---

### Playbook idea archive (P-12 / I-261)

**Playbook idea archive: Content System Playbook for coaches / consultants / creators.**

#### The idea (verbatim)

> **Niche:** Content Creation
> **Product:** Content System Playbook
> **Target Customer:** Coaches, consultants, creators
> 
> DIY Playbook for:
> 
> - Free tools for creating content
> - Scheduling & planning
> - What people want
> - Organic vs Paid
> - Platform breakdown / compare / use cases (FB, IG, Google, TikTok, Reddit, LinkedIn etc)
> - Images / Video / Text, what and when

#### Cross-card relevance (light)

- **PB Services, Playbook backlog** (item `mpj5ws90-1h10yh1br`), sibling concept.
- **Credibility & Media, test organic first principle** (item `mpj4v1ok-h7vqp1r`), the “Organic vs Paid” section should anchor on this principle.
- **Jay Career, AI content gen skill-up** (item `mpj3logj-1c1ji7b1h`), Jay’s own learning thread feeds the “free tools” section.
- **Marketing & Lead-Gen Ideas, LinkedIn content brief** (item `mpj4aa7t-13c1kl1r0`), same content-strategy surface.

---

### Playbook idea archive (P-12 / I-262)

**Playbook idea archive: META Ads Playbook.** Sibling of the Google Ads Playbook (item `mpj6airc-a1re191014`), same anti-agency framing, plus the organic-first principle baked into the opening.

#### The idea (verbatim)

> **DIY META Ads**, Your Marketing Agency uses AI (if not, they are not good).
> 
> Start w/Organic, test content first~! before committing $.
> 
> META Ads, Landers & Tracking.

#### Cross-card relevance (light)

- **PB Services, Google Ads Playbook (sibling)** (item `mpj6airc-a1re191014`), same anti-agency lines. Worth bundled as a paid-ads pair.
- **Credibility & Media, test organic first principle** (item `mpj4v1ok-h7vqp1r`), this Playbook’s opening literally restates the principle.
- **AI Agents, Meta ads test market + Meet the Team** (item `mpj4dtoh-131ltuvl`), Meta-specific test infrastructure overlaps.
- **PB Services, Playbook backlog** (item `mpj5ws90-1h10yh1br`), sibling concept.

---

### Playbook idea archive (P-12 / I-263)

**Playbook idea archive: Online Booking Playbook.**

#### The idea (verbatim)

> **Niche:** Booking System
> **Product:** Online Booking Playbook
> **Target Customer:** Salons, clinics, fitness studios

#### Cross-card relevance (light)

- **PB Services, Playbook backlog** (item `mpj5ws90-1h10yh1br`), sibling concept.
- **AI Agents, Basic ManyChat booking flow template** (item `mpj1r0aa-51nt17u1q`), booking-mechanic substrate already drafted.
- **MAIA, AI voicemail receptionist** (item `mpj1w4g9-bts1p111k`), phone-to-booking handoff overlaps.

---

### Playbook idea archive (P-12 / I-265)

**Playbook idea archive: “Be less shit at MLM” Playbook.** Unique angle, Jay + Ian have real credentials here (Ian wrote a book on it). Attached: `john-macdougall-social-playbook.html`.

#### The idea (verbatim)

> Playbook for being less shit at MLM.
> 
> Me and Ian are actually extremely good at this niche, Ian wrote a book.

#### Why this one is different

- **Genuine subject-matter authority**, not just “PB can do this,” but “Ian literally wrote the book.” That credential is leverage.
- **Underserved niche**, most marketing playbooks avoid MLM. Less competition.
- **PB voice fits the territory**, “less shit at MLM” framing is on-brand. Honest about the category’s reputation.

#### Open questions (light)

- **John MacDougall**, specific MLM person Jay’s building the demo HTML for? Worth confirming relationship.
- **Ian’s book**, title? Worth capturing as a credentialed reference.

#### Cross-card relevance (light)

- **PB Services, Playbook backlog** (item `mpj5ws90-1h10yh1br`), sibling concept.
**Drag-drop target:** drop `john-macdougall-social-playbook.html` onto this item.

Comments:

**Jay:**

> **[Triage answers, 24 May 2026]**
>
> *Open questions (light)*
>
> 1. **John MacDougall, MLM target Jay is building demo HTML for?** → Captured in comment *JM is example. Playbook is for everyone in MLM*
> 2. **Ian’s book title?** → Captured in comment *It’s not a fucking pyramid *

---

### Playbook idea archive (P-12 / I-268)

**Playbook idea archive: Start an online community + niche audience + monetise your passion.** Worked-example demo built (“Gromad”, community for van-lifers / nomads). Two HTML attachments.

#### The idea (verbatim)

> Start an online community, a niche audience, and monetise your passion.

#### The worked example: Gromad (van-life / nomad community)
Jay’s built a polished demo landing page showing what a community-monetisation playbook delivers. Dark / amber theme (audience-themed, not PB-themed), Bebas Neue + DM Serif + Manrope.

| Element | What’s in the demo |
| --- | --- |
| **Tagline** | “Go further. Stay longer. Owe nobody.” |
| **Hero stats** | 90 days house-to-rig · $99 one guide no agency · AU NZ US markets · $0 monthly rent owed |
| **Definition section** | “Gromad / groh·mad, noun, identity, lifestyle. A person who chose movement over mortgage.” |
| **4 pillars** | Philosophy (freedom first) · People (real community) · Tools (the guides) · Scale (global) |
| **Products** | Setup Guide $99 (most popular) · Budget Blueprint $99 (new release) · Route Planner (coming 2025) · Gromad Market (free, trusted marketplace) |
| **Community surface** | FB group + Reddit + Forum + Podcast + 4 live-post examples (Sandra W. Perth / Dave K. Christchurch / Trish + Mark Texas / Henk V. Cape Town) |
| **Podcast strip** | “Real stories. Real roads. Real freedom.”, YouTube / Spotify / Apple / RSS |
| **Manifesto** | “Stop paying rent on a life you don’t love.” |
| **Email capture** | “The weekly Gromad dispatch.” No-spam framing. |

#### The playbook concept the Gromad demo proves
This is the **community-driven product line** shape: pick a passion niche → community (FB / Reddit / Forum / Podcast) + paid guides ($99 each in PB Playbook style) + free marketplace + weekly email dispatch. PB sells either the playbook for someone to build their own, or builds it for them as a Branded System.

#### Keeper lines (ship-ready from the demo)

- “Go further. Stay longer. Owe nobody.”
- “Home is wherever you park it.”
- “Stop paying rent on a life you don’t love.”
- “Freedom over fixed costs.”

#### Cross-card relevance (light)

- **PB Services, Playbook backlog** (item `mpj5ws90-1h10yh1br`), sibling concept.
- **PB Services, DIY or DI2gether funnel** (item `mpj4t6kd-81lvl1lx`), demo uses $99 + free + community tiering that maps cleanly to the funnel.
- **Credibility & Media, podcast insight** (item `mpj4wdnw-b1e10sh1`), “person who hosts the party becomes popular” principle plays out in the Gromad podcast block.
- **Papamoa.info / Niche directories** (item `mpj3j6mh-wn6f1a17`), Gromad Market = the directory mechanic applied to van-lifer niche.
**Drag-drop targets:** drop `gromad-homepage-main.html` + `gromad-launch-playbook-main.html` onto this item.

---

### Playbook idea archive (P-12 / I-270)

**Playbook idea archive: Social Media Playbook for Bands.** Most mature productised Playbook I’ve seen filed, full demo + sales landing + template + a specific band instance (Stasch) all attached.

#### The idea (verbatim)

> **Niche:** Social Media
> **Product:** Social Media Playbook
> **Target Customer:** Bands, venues, local acts

#### The 10-section product spec (from the demo + landing HTMLs)

1. **Brand Audit & Identity System**, Linktree / Canva / ChatGPT
2. **Instagram, From Zero to Gig Machine**, Instagram / CapCut / Meta Suite
3. **TikTok, The Unexpected Goldmine**, TikTok / CapCut
4. **Facebook, Making It Actually Work**, Pages / Meta Business Suite
5. **Google & Local SEO**, Google Business Profile
6. **10-Minute Weekly Content System**, Meta Suite / ChatGPT
7. **Getting More Gigs**, Google Docs / GigSalad / ChatGPT
8. **Free AI Tools Stack**, ChatGPT / Canva / CapCut / Meta Suite
9. **90-Day Action Plan**, all tools from sections 1-8
10. **Tracking & Results**, Instagram Insights / TikTok Analytics

#### What the demo HTML implements (sophistication note)

- **Free-sample paygate**, Sections 1 + 2 fully unlocked, Section 3 partially visible with fade-out, Sections 4–10 blurred behind a lock overlay. Scroll-trigger fires a paygate modal automatically.
- **Per-section “Get Current Advice” button**, calls Claude API with web_search tool, returns fresh genre/market-specific advice. *Same “AI Live Update” mechanic Jay built into Ordermeal Escape and the Future-Proof Playbook framework.*
- **DIY accordion steps**, each section has numbered “tools to do it” expandable walkthroughs.
- **Progress tracker**, checklists per section, sidebar progress bar, “X of 10 sections” counter.
- **Personalisation form**, Web3Forms intake (band name / contact / email / city / genre / current social status / venues / goal) → Stripe checkout redirect.
- **Visual design**, mint/ink theme (PB-adjacent), DM Serif Display + DM Sans typography, polished landing-page with hero / proof-bar / problem-cards / module-grid / AI-feature / reviews / pricing card / form.

#### Pricing + offer mechanic

| **Price** | $97 / $99 one-off (some price inconsistency between files, lock the number before launch) |
| --- | --- |
| **Promise** | Personalised to band / genre / city / venues. AI Live Update built into every section. Instant delivery. |
| **Refund** | “Not happy? We’ll refund it. No questions.” |
| **Proof bar** | 10 sections / 10 min/week to maintain / $0 ongoing / $97 once |
| **Competitor anchor** | “Social media agency $500–$2,000/mo. This replaces that for one $97.” |

#### Keeper landing-page lines

- “Your band already has the music. Now get the audience.”
- “Great music. Basically invisible online.”
- “10 sections. Zero fluff. All steps.”
- “Posting occasionally on Facebook reaches about 60 people, half of whom are already at your gigs. It’s not a strategy, it’s a habit.”
- “Playbooks for people who are done winging it.” (footer)

#### Stasch variant
The `stasch-social-playbook-main.html` attachment is a specific band’s instance, presumably a cover band Jay’s built this for as a real proof point. Worth confirming the relationship + getting their permission before using as a public case study.

#### Loose ends to flag

- **Price inconsistency**, demo and landing alternate between $97 and $99 in places. Lock one number.
- **Web3Forms `YOUR_ACCESS_KEY`** placeholder still in code.
- **Stripe redirect** still hardcoded to `plainblackcreative.com/thank-you`, confirm that route exists.
- **3 testimonials** on the landing (Sarah M Auckland / James R Wellington / Tony K Melbourne), are these real bands? If placeholder, flag before launch.
- **AI Live Update endpoint** hardcodes `claude-sonnet-4-20250514` with a direct call to `api.anthropic.com` from the client, that exposes the API key. Needs to be proxied through Make.com / a server before going live (same Pro-plan ToS question as the “we did it ourselves” pivot).

#### Cross-card relevance (light)

- **PB Services, Playbook backlog** (item `mpj5ws90-1h10yh1br`), sibling concept; this is the most-built version.
- **PB Services, Future-Proof Playbook framework** (item `mpj34ri2-h1c71e1q1e`), the AI Live Update mechanic + section-structure here is the framework in concrete form.
- **PB Services, Ordermeal Escape** (item `mpj6nv1g-y101j15101n`), same Web3Forms + Stripe + personalised-playbook delivery pipeline.
- **Credibility & Media, “we did it ourselves” pivot** (item `mpj4fza6-kd1j1ip10`), the embedded Claude API call here is exactly the “PB GPTs / Pro plan generations” mechanic. Same ToS question applies.
- **PB Services, Playbooks reframe / Branded System** (item `mpj5nrjy-u1r1e141ed`), this Band Playbook fits the $99 tier; a Branded System variant could be the same Playbook with bespoke booking-CRM build on top at $1,499.
**Drag-drop targets:** drop all four HTMLs onto this item, `band-social-playbook-demo-main.html` · `band-social-playbook-landing-main.html` · `band-social-playbook-template-main.html` · `stasch-social-playbook-main.html`.

---

### Productise blog-gen (P-8 / I-97)

**Productise blog-gen.html as a white-label product.**

Strategy session w/ Claude, 1:14 AM. **Recommendation: lead with Option 2, Agency Reseller License at $499.** It's the only one of the three where "white label" is the real industry term people search for and pay for, and it dodges the AI-cost-forever trap because agencies bring their own keys to clients.

**The three options at a glance**

- **Option 1, White-Label Blog Engine ($99 end-user)** · Small biz buys, you skin + tune per client. Includes 100 posts credit. $29 top-ups. Same delivery flow as playbooks. *"Basically just another playbook in your $99 line, not really white-label."*
- **Option 2, Agency Reseller License ($499 B2B)** ★ · Agency buys once, deploys to unlimited clients under their brand, BYOK per client. Source HTML + config block per client. Higher ASP, fewer support tickets, no AI cost to PB. Each agency potentially deploys to 5–50 clients = PB tool in front of thousands with someone else's logo.
- **Option 3, Pure Source License ($199 technical)** · Unbranded HTML + prompts, no support, no updates. *"A trap. Buyer expects too much for too little."*

**The cost problem (must solve first)**

Every post burns API credits. White-label-and-host = paying Anthropic forever for a one-off fee. Three ways out:

- **BYOK** (customer pastes their Anthropic key), clean for PB, friction for non-technical buyers, fine for agencies
- **Usage credits** ($99 includes 100 posts, $29 top-up), small recurring tail, stay break-even
- **Pure file delivery** (they host, they BYOK), PB out of the loop after delivery

**What the customer is actually buying** (three stacked layers)

1. The tool itself (HTML, UI, prompt engineering already done)
2. Their branding on top (logo, colours, "Powered by Their Brand")
3. AI tuning for their business (writes like a plumber's blog, not a generic blog)

Layers 1 + 2 are easy. **Layer 3 is what makes it worth $99 instead of $9.**

**Open decision**

Claude offered two next moves, Jay to pick:

- (a) Spec out the Option 2 product page
- (b) Work through agency-tier pricing & delivery flow first

**Related**

- blog-gen.html (https://admin.plainblackcreative.com/blog-gen), the existing tool being productised
- Same productisation muscle as the "PB Direct Work" item on this card · Stripe + Web3 generic setup (Hub + Inbox) is a prereq for the credit-top-up flow

Comments:

**Jay (2026-05-23T09:39:55.561Z):**

> **[Source, Claude response verbatim, 1:14 AM]**
>
> > Right, let me actually think about this properly because "white label" gets used to mean five different things and only one or two of them fit the PlainBlack model.
> > 
> > **The thing you're actually selling**
> > 
> > When someone buys a white-label blog-gen, they're buying three things stacked:
> > 
> > 1. The tool itself (the HTML, the UI, the prompt engineering you've already done)
> > 2. Their branding on top (logo, colours, copy, "Powered by Their Brand")
> > 3. AI tuning for their business (so it writes like a plumber's blog, not a generic blog)
> > 
> > The first two are easy. The third is what makes it worth $99 instead of $9.
> > 
> > **The cost problem you have to solve first**
> > 
> > Every blog post burns API credits. If you white-label and host it yourself, you're paying Anthropic forever for a one-off $99. That maths doesn't work. Three ways out:
> > 
> > - **BYOK (bring your own key):** Customer pastes their Anthropic API key into the tool. You're done, they pay AI costs forever. Clean for you, friction for them.
> > - **Usage credits:** $99 includes 100 posts. After that, $29 tops up another 100. You stay break-even on AI, get a small recurring tail.
> > - **Pure file delivery:** You give them the HTML, they host it themselves on their own domain with their own key. You're not in the loop at all after delivery.
> > 
> > For non-technical buyers, BYOK kills the sale. For agencies and resellers, BYOK is fine.
> > 
> > **The three real product shapes**
> > 
> > **Option 1: White-Label Blog Engine ($99, end-user)** Small business buys it, you customise with their logo, brand colours, and an industry-tuned system prompt ("This blog is for a Mt Maunganui plumber who services the Bay of Plenty, tone is friendly and practical, target keywords are X, Y, Z"). Delivered as a single HTML file at their.plainblackcreative.com/[slug] or downloadable for their own hosting. Includes 100 posts of credits. Top up at $29/100 via Stripe. Same delivery flow you already have for playbooks.
> > 
> > **Option 2: Agency Reseller License ($499, B2B)** Marketing agencies buy once, get the right to deploy it for unlimited clients under their brand. They handle BYOK with their clients. They get the source HTML, install instructions, and a config block where they swap logo/colours/prompts per client. Higher ASP, fewer support tickets, no AI cost on your end. This is probably the cleanest white-label play.
> > 
> > **Option 3: Pure Source License ($199, technical buyer)** Developers and consultants buy the unbranded HTML file and full prompt engineering. They do whatever they want with it. No support, no updates, no customisation by you. Lowest effort, lowest price, smallest market.
> > 
> > **What I'd actually do**
> > 
> > Lead with Option 2 (agency reseller) as the white-label product. It's where "white label" is a real industry term people search for and pay real money for. $499 sits well above your $99 playbook tier without colliding with it. Agencies are tech-comfortable so BYOK is a non-issue. And every agency that buys it potentially deploys it for 5–50 clients, which means your tool is in front of thousands of small business owners with someone else's logo on it.
> > 
> > Option 1 is fine but it's basically just another playbook in your $99 line, not really white-label. Call that "Custom Blog Engine" and slot it into the product 6 spot maybe.
> > 
> > Option 3 is a trap. It's hard to support and the buyer expects too much for too little.
> > 
> > Want me to spec out the Option 2 product page next, or work through the agency-tier pricing and delivery flow first?

**Jay (2026-05-24T00:30:17.121Z):**

> **[Cross-link, Playbooks pricing/positioning open]**
>
> The blog-gen.html productisation play here is the original Playbook precedent. New item on PB Services (id `mpj1jg6p-1b13l1jk3`) frames Jay’s open question: are Playbooks a standalone $99/mo product, a services add-on, a service-support layer, a $100 re-price, or parked?
>
> **Why it matters here:** whatever umbrella wins governs how blog-gen ships, standalone SaaS, retainer-bundled, or service-glue.

**Jay (2026-05-24T00:33:47.027Z):**

> **[Cross-link, blog-gen is another template in the same pipeline]**
>
> Playbook delivery automation spec filed on PB Services (id `mpj1nx4j-1j6o1dhd`). The blog-gen.html productisation here uses the same Make.com lead-intake → GitHub Pages → Stripe paywall → token-unlock plumbing.
>
> **Why it matters here:** shared infra means deciding blog-gen’s shipping form (SaaS / retainer-bundled / service-glue) reuses the same fork-survival analysis.

**Jay (2026-05-24T00:38:17.658Z):**

> **[Cross-link, next iteration of the blog-gen lineage]**
>
> Build Map v2 (id `mpj1tqn0-1n81fa157`, on 30 Day Build Challenge) describes today’s build of the website-build playbook tool, spiritual successor to blog-gen.html. Future expansion path: brand variant + marketing-ideation variant → 3-tool family.
>
> **Why it matters here:** the productisation question on this item (white-label, pricing, packaging) needs to absorb the 3-tool family shape, not just blog-gen as a single product.

---

### Refinement to the niche-lock + content-engine playbooks (P-8 / I-165)

**Refinement to the niche-lock + content-engine playbooks: target businesses already trying at socials, take their existing baseline, AI-extrapolate to 10x output, and filter their inbound for them.** The model compounds: one client brings leads and referrals, and the work multiplies without effort scaling.

**The targeting shift**

Existing niche-lock thinking (this card) targets businesses that *suck visibly*, broken Google profile, no posts, etc. Free audit → fix → endorsement.

**This refinement says: also target the ones who are *already trying***, posting consistently but at small volume / low quality / no baseline analytics. Why this beats the suck-visibly target:

- They already value content. No education sale required.
- They have a voice + tone + audience already established. AI extrapolates from real baseline instead of inventing one.
- They feel the cost of effort. The 10x-output-for-no-extra-effort pitch hits directly.
- Some baseline = some signal. PB can measure improvements instead of measuring zero.

How to find them: scroll local Facebook, Instagram, LinkedIn. Look for businesses with 1–3 posts/week, modest engagement, consistent for >3 months. They are obvious. They are PB best ICP.

**The 10x production model**

> "Can AI write prompts for 10+ posts per day for X business? Create that content, reels, stories, posts, blogs, response content etc?"

Yes, and that is the whole pitch. The math:

- Client posts ~3/wk currently = baseline
- PB takes their existing content → trains an AI Brain (Blog Generator marketing item on this card) → produces 10+ pieces/day
- Client effort: zero. Client time saved: hours per week. Client output multiplier: ~25x.
- PB time: 30 min per client per day max, after the initial AI Brain setup

**What gets produced per day per client**

- Posts (FB / IG / LinkedIn)
- Stories / Reels short-form
- Blog content (cross-link Blog Generator marketing + Blog production upgrade)
- Response content, replies to comments, DMs, reviews, generated for the owner to approve
- Email + email signatures

**Counter-positioning: "Fuck ROI on ad spend"**

> "Fuck ROI on ad spend. Use AI to be a game changer for your business, your personal life and your brand exposure."

Sharp counter-position vs every agency selling ad spend optimisation. The pitch becomes: stop pouring money into ads to compensate for thin organic; let AI fix the organic upstream, then ads become amplification, not the whole channel. Same logic as the "AI for wellbeing not wage savings" thesis (niche-lock motion on this card), AI improves the leverage, not the spend.

**The inbound filter layer**

- AI filters incoming chats, DMs, comments, reviews per client
- Owner gets one daily email digest, what is genuinely worth responding to, what has been auto-replied, what is spam
- Removes the "I should check the messages" 20x/day drain
- Pairs with the AI Appointment Setting comment on MAIA service overview, same in/out funnel logic, applied to social channels instead of phone

**Compounding lead model**

> "Could be epic, customers one by one, each one brings in leads, referrals, etc."

- Client 1 happy → 2x referrals + lookalike-business inbound from their content
- Each new client doubles the visible-success surface (case studies, before-after stats, content portfolio)
- Modest start, exponential through referrals. Matches the PapaMassive "Month 1 $2-3k → Month 3 $10k+" roadmap exactly.

**Where this lands inside existing PB offers**

- This *is* the PapaMassive Growth tier (PB Services) at full strength. Refines the targeting and the production model.
- Also the Starter tier ($100/wk SMB), same playbook at lower volume.
- The AI Brain framing (Blog Generator marketing) is the technical core: client baseline → AI Brain → 10x output.
- The Custom GPT intake form (MAIA service overview) becomes the onboarding path, "tell us your baseline" → AI Brain generated → production starts.

**Cross-card relevance**

- **Niche-lock motion** (this card), this is the targeting refinement on top of it
- **Content engine batch** (this card), this is the production model + cadence
- **Blog Generator marketing campaign / "AI Brain"** (this card), same core insight (extrapolate from baseline, do not invent voice)
- **PapaMassive Growth / Authority tiers** (PB Services), productised home
- **$100/wk Papamoa SMB** (PB Services), lower-tier expression
- **MAIA Specialisation Thesis** (MAIA AI Consulting), Area 4 Content Creation $1k-profit package candidate fits perfectly
- **AI Appointment Setting script** (MAIA voice-agents comment), sister inbound-filtering layer
- **30 Day Build Challenge content commitment** (sec-clients), PB doing this on itself first builds the case study

**Next:** pick one already-trying Papamoa business (Blackberry already trying, Pizza Pundits already trying, ReDefined Jimmy already trying). Run the 10x production model on them for 14 days. Measure pre/post engagement. That is the case study + pitch deck for everyone else.

---

### Copy archive (P-8 / I-278)

**Copy archive: testimonial-style copy for the Blog Generator product. PB-voice tradie tone.**

#### The copy (verbatim, ready to use)

> “Mate, I used to sit there at night trying to figure out what to post.
> 
> Now I just chuck in a topic, hit generate, and I’ve got:
> 
> - a blog
> - a Facebook post
> - a LinkedIn post
> - and all the SEO stuff sorted
> I just copy it, tweak it, and I’m done.”

#### Where it could land

- **Blog Generator landing page testimonial** (real or placeholder), needs attribution before public use.
- **Social ad copy**, works as a 15-second narrated reel script in tradie voice.
- **Email subject + opening line**, warm-up to a Blog Generator pitch.

#### Open question

- **Attribution**, is this a real customer quote, a draft Jay wrote in tradie voice, or PB-as-the-buyer? Needs a name + permission before going public with quotes around it.

#### Cross-card relevance (light)

- **Marketing & Lead-Gen Ideas, Productise blog-gen.html** (item `mpi5qhd1-01da1d9i`), the source product this copy sells.
- **Credibility & Media, voice profile** (item `mpj40s1k-11t1kdb1c`), tradie-voice variant of the brand.
- **30 Day Build Challenge, Build Map v2** (item `mpj1tqn0-1n81fa157`), Blog Generator is in that lineage.

Comments:

**Jay (2026-05-24T07:53:11.685Z):**

> **[Triage answers, 24 May 2026]**
>
> *Tradie quote*
>
> 1. **Attribution for the quote?** → Captured in comment *What quote?*

---

### SOP: "How to AI output and post content (P-8 / I-685)

**SOP: "How to AI output and post content, 20+ per day."**

- Daily content production at scale, how Jay produces 20+ assets/day across channels using AI.
- Documented as an SOP. Becomes both a Tentacles workflow AND a PB consulting deliverable (clients want this SOP).
- Cross-link to Content/UGC (Tentacles sub-brand) item.

*Exploded from I-147 (Content engine ideas batch).*

---

## Tools

### Fold Into PlainBlack Tools (P-12 / I-687)

**Fold Into PlainBlack Tools**, productised/shippable AI tools + the mechanics for shipping them cheaply, consolidated from the retired P-17 archive.

*Sources: ex-I-239, I-174, I-128, plus the intake-GPT & quote-GPT comments. (MAIA = nickname only.)*

##### Startup GPT, PB's front-of-house tool (ex-I-239)

A site-resident GPT that works out where a visitor sits on the DIY→paid spectrum and routes them (free content / paid Playbook $99–$1,499 / first-fix / retainer / book-a-call). Structure the prompt with **C.R.I.T.** (Context / Role / Interview / Task). It's the funnel entry for everything else, so ship it in parallel. Could be one of PB's Ai-named agents.

##### Niche-GPT template catalogue (ex-I-239)

- Sellable GPT templates, two lanes: **(a) Industry GPTs** ("Roofer-GPT", "Cafe-GPT") sold one-to-many at the $49–$299 band (scale); **(b) Brand GPTs** (one client, branded) one-to-one at the $1,499–$2,999 build band (price higher).
- Build a BIG catalogue of niche use-cases (200+ trains buyers' imaginations). V1 shortlist: 5–10 tied to PB's vertical mix (roofing / hospo / trades / dental).
- One system prompt + knowledge files ports to ChatGPT GPTs / Gemini Gems / Copilot Agents. Embedding: public link/iframe (fast, off-brand) vs API + chat widget (brand-consistent, more work). Hybrid with ManyChat: GPT = brain, ManyChat = channel handler.
- Adjacent product ideas: affiliate UGC template library (PayPerOutput), reusable AI-avatar library (brand enters dataset → branded UGC). *UGC-avatar legal + OpenAI Pro-plan ToS → Unsure.*

##### Claude Artifacts delivery mechanic (ex-I-174), changes the cost model for every tool

- Artifacts can embed Claude API calls; "Publish" → shareable link. When an end-user interacts, usage counts against **their** Claude account, not PB's. Free users can use shared artifacts (need a free Claude account).
- **Impact:** a $999 GPT delivery goes from API-costs-forever to ~100% margin; delivery drops from a multi-week hosted-widget build to minutes (describe → Publish → send link). Free users become real top-of-funnel.
- **Constraints:** can't force model choice for free users; 5-hour usage caps; users see Claude.ai's UI not PB's (convenience vs brand); link-only sharing (no per-user auth); stateless (no persistent data). Fine for marketing tools, not confidential client workflows.
- **Decision matrix:** fast + zero-cost + Claude-comfortable → Artifact; OpenAI/ChatGPT audience → Custom GPT; full branding + auth + persistence → custom widget on PB infra.
- **Cheapest first test:** ship the Playbook Recommender quiz as an Artifact, link from PB homepage + LinkedIn, measure free-Claude signups + downstream conversion.

##### Matrix-style terminal chatbot UI (ex-I-128)

Green-on-black phosphor / DOS aesthetic for demo bots, counter-positions against pastel "friendly assistant" widgets. Typewriter effect, status framing ("> CROSS-REFERENCING PB CATALOGUE… ACCESS GRANTED"), ASCII logo, scanlines. Signals technical competence; matches PB's anti-corporate voice. Apply to: intake-bot first contact, cold-outreach demo, V5 landing hero, voice-agent visualiser. Risks: can alienate non-tech (60yo cafe owner), easy to over-cute, needs an accessibility / reduced-motion toggle. Test on 3 audiences; ship with a "friendly version" toggle. (No image is attached, the Matrix still only ever lived in the original Monday paste, described in text.)

##### Conversational intake GPT (ex-I-112 comment)

Replace the static contact form with a GPT that conversationally extracts what the prospect needs, self-demonstrates the product, branches per vertical (cafe gets cafe questions), feeds the niche-audit templates, and inherits V5 referral context (asks fewer questions). Build fast as a ChatGPT GPT, migrate to a hosted Claude-API widget later if it earns the spend.

##### Dynamic-pricing quote GPT (ex-I-162)

A GPT that calculates a quote from (a) what the business would pay an employee to do the task and (b) what the AI replacement actually costs PB to deliver, not a flat fee, not an hourly rate. Pairs with the intake GPT.

##### Voice-agent demo as a sales tool (ex-I-201)

Build a 1-vertical Vapi demo (cafe or plumber) and let it sell: "the demo does most of the selling." (The voice-agent *service* wrapper lives in the Services bucket.)

---

### Concept: An AI tool where you paste a Seek (or any job-listing) URL and it produces a (P-8 / I-88)

**Concept:** An AI tool where you paste a Seek (or any job-listing) URL and it produces a ready-to-send HTML email pitch: "don't hire, AI/I can do this for free / cheaper / better."

**Why**

- Job listings are an explicit signal of buying intent for a function
- Most of the work in the listing can be done by Claude/AI for free or near-free
- Outreach today is manual, making it one-click would unlock volume

**Loose spec**

- Input: Seek / Trade Me Jobs / LinkedIn listing URL
- Claude reads the listing, extracts the role, responsibilities, "must-haves"
- Output: HTML email body offering to do the same work for a fixed price or as a productised playbook
- Optional: auto-attach a relevant PB playbook lander

**Sales script:** "Don't HIRE, AI can do that for FREE (or for this one-time fee)."

**Status:** idea only, no build yet. Lives under Lead-Gen Ideas until it earns its own sec-tools card.

---

### Question (P-8 / I-100)

**Question:** Can our AI run a Google search in an incognito browser to see SERP results for anything, find where clients are ranking, work out how to lift them?

**Short answer: yes, today.** We already have Claude-in-Chrome + a connected browser session in this very Inbox triage flow. Open an incognito window, navigate to `google.co.nz/search?q=…`, scrape the rendered SERP, extract rank positions. Same muscle as the Job-Pitch Tool idea on this card, "Claude does browser work to find leads."

**Use cases this unlocks**

- **Client rank tracking**, for every PB client, weekly SERP check on their target keywords (e.g. "cafe Papamoa" for Blackberry, "pizza Papamoa" for Pundits). Log positions over time; alert on drops.
- **Competitor mapping**, for a target keyword, capture top 10 results, who's there, what their meta titles say, what schema they use.
- **Audit input**, every Blackberry/Pizza Pundits-style report could open with a live SERP screenshot instead of generic claims.
- **Discovery for outreach**, search "best [X] [town]" → top 10 result URLs become a prospect list for the spec-site outreach play.

**Caveats / things to design around**

- Incognito ≠ neutral, Google still personalises by IP / geo / browser fingerprint. For client-grade rank data, may need geo-spoofing or a SERP API (SerpAPI, DataForSEO) as a fallback.
- Volume → CAPTCHA. Fine for a few queries per session, not for scraping 1000s.
- Mobile vs desktop SERPs differ, capture both.
- If we build it into a tool, log raw HTML alongside parsed positions so we can re-parse later when Google changes the layout.

**Adjacent ideas already on this card**

- Job-Pitch Tool, same "Claude in browser, finds leads, drafts pitch" pattern
- PB Direct Work, "find clients" was already a stated need; this is the mechanism

**Next:** if Jay wants to test it once, point me at a client + keyword and I'll run it via the existing browser session right now. Otherwise this stays parked.

---

### Idea: PlainBlack designs original website icons (P-8 / I-249)

**Idea: PB designs original website icons. Distribute as free use / opt-in download / custom-per-client. Free tier becomes a lead-magnet; custom tier is a paid product.**

> “Website Icons: Create original icons for free use / via opt-in / download, Custom for each client.”

#### The 3 layers Jay implied

| Layer | Mechanic | Funnel role |
| --- | --- | --- |
| **Free use** | Open library of PB-made icons, attribution required (carries the green dot / PB watermark per item `mpj57klk-4s21k1b2`). | Tier 1 in the DIY-or-DI2gether funnel, brand exposure + portfolio distribution. |
| **Opt-in download** | Email gate for a curated pack or higher-resolution / attribution-free set. | Tier 2, subscribe-to-keep-in-touch + lead capture. |
| **Custom for each client** | Icon set built around a specific client’s brand, matched stroke / colour / vibe. | Tier 3 / 4, paid product or bundled into website / Quote Fit Filter / Content Command Centre builds. |

#### Why this works

- **Icons travel.** Whoever uses the free set ships PB’s aesthetic into their own site. Compounding portfolio without compounding work.
- **Visual continuity** with the existing PB carousel / Bradley mockup / Quote Fit Filter design language, dark / mint / clean / a bit irreverent.
- **Easy to generate at volume** with AI tools (Midjourney / Ideogram / SVG generators). One Jay-curated style + AI-assisted output = a library in a weekend.
- **Pairs naturally with the “website” product line**, every $1,150 PB website gets a custom-icon-set bundled or upsold.

#### Open decisions

- **License model**, CC-BY for free use? Royalty-free with attribution? Need a clear licence file in the download.
- **Format**, SVG (scalable, dev-friendly), PNG (universal, less flexible), or both? SVG default.
- **Style anchor**, the existing carousel / mockup icons (clock / map / clipboard / mug / etc.) already set a style. Worth declaring “PB icon style” as a one-page spec before generating volume.
- **Distribution surface**, new page at `plainblackcreative.com/icons`? Or a section of the existing tools page? Fits the same Squarespace landing-page approach.
- **Custom pricing**, per-icon / per-set / bundled-with-website? Probably bundled-with-website by default, à la carte at $X per icon for one-off custom requests.
- **AI-generation legal**, if Midjourney / Ideogram outputs are sold, double-check the platform commercial-use clauses are clear. Most allow it on paid plans.

#### Cross-card relevance

- **PB Services, DIY or DI2gether funnel** (item `mpj4t6kd-81lvl1lx`), the 3-layer mechanic maps onto tiers 1, 2, and 3/4 of the funnel.
- **Credibility & Media, PB watermark rule** (item `mpj57klk-4s21k1b2`), free icons carry the green dot in their footer attribution. Same payment-is-attribution mechanic.
- **Credibility & Media, PB-as-Jay-actually-wants-it** (item `mpj4ijyf-r1ku1530`), $1,150 website offer + bundled custom-icon-set = sharper offer than either alone.
- **Credibility & Media, “we did it ourselves” middle-man pivot** (item `mpj4fza6-kd1j1ip10`), free icons join the “PB hands you Pro-tier work for free” basket.
- **Marketing & Lead-Gen Ideas, IG carousel** (item `mpj1z4pv-119q1g113`), icons used in the carousel already preview the visual library this would publish.
- **Papamoa Exclusive Directory** (item `mpj3z41h-1mo17j1415`), each member could get a custom icon set as part of membership.
**Next:** declare the “PB icon style” one-page spec (lifted from the existing carousel / mockup language), generate a starter library of 24–48 icons, ship at `/icons` as a tier-1 free download with attribution + tier-2 opt-in for the cleaner pack.

---

### Two paired tools at one URL (P-8 / I-492)

**Two paired tools at one URL, exposing how agencies sell. Originally pencilled as a Week 4 build during the 30-Day Challenge planning. Cut before Day 22 started because it was more polemic than utility.**

##### Tool 1, Quote Decoder
Paste an agency proposal. Get the plain-English translation with specific bullshit deliverables called out by name. Example outputs: "monthly check-in call" → "30 minutes of you updating us about your business". "quarterly strategy review" → "1 PowerPoint slide and a screen-share".

##### Tool 2, Versus Table
Live comparison table. **PB column** updates dynamically based on what the user actually needs. **Everyone Else column** stays frozen regardless of input.

| Row | PB (dynamic) | Everyone Else (frozen) |
| --- | --- | --- |
| Monthly Retainer | (varies by need) | $2,500-$5,000 forever |
| Increase Ad Spend | (varies) | Always "yes, more" |
| Monthly Report | (real numbers, plain English) | 17-page PDF, 3 useful lines |
| Bonus | (based on what helps) | Free Zoom Call |

**Cross-card relevance:** Pairs with the Voice Fingerprint (I-491) as the "serious vs. cheeky" sides of the same anti-agency thesis. Could ship as a single landing page or two separate tools.

**Next:** Reconsider once we have either (a) a clear sales hook into the productised AI service line or (b) a specific moment in the year where the anti-agency angle would land hardest (start of FY?).

---

### GPT-that-quotes-building-custom-GPTs (meta) (P-8 / I-678)

**GPT-that-quotes-building-custom-GPTs (meta).**

- A Custom GPT whose job is to quote what it would cost to build a custom GPT for a specific use case.
- Self-demonstrating, the prospect interacts with the thing they would be buying.
- Outputs scope + price + delivery timeline from prospect inputs.
- Sits inside the MAIA AI Proficiencies funnel as the "Custom GPT" proficiency entry point.

*Exploded from I-148. Overlaps the P-17 MAIA custom-GPT cluster (I-207 "Building a Custom GPT" offer, I-239 Startup-GPT spec, I-622), cross-link for funnel placement.*

---

### Playbook idea archive (P-12 / I-253)

**Playbook idea archive: Ad Efficiency Playbook.** Umbrella with 6 sub-tool concepts + a detailed spec for the recommended first build (AI Ad Copy Generator + Scoring Tool). Attached: `ad-copy-generator.html`.

#### The opening principle (verbatim, reinforces an existing PB principle)

> TEST ORGANIC 1st, don’t spend money until organic content has proved it’s not shit.
*Same principle filed on Credibility & Media (item `mpj4v1ok-h7vqp1r`), reinforced again here.*

#### The 6 tool ideas under the umbrella (verbatim)

1. **AI Creative Testing & Rotation Tools**, auto-generates dozens of ad copy/headline variations, auto-rotates and pauses underperformers on CTR/ROAS thresholds. *“Set and forget creative optimization.”*
2. **AI Ad Copy Generator with Performance Scoring**, input product/audience/goal, output 20+ ad variations ranked by predicted performance. Built on Claude/GPT trained on AIDA, PAS, etc. Easy to build, easy to sell.
3. **Audience Intelligence Dashboard**, pulls Meta/Google Ads API data, surfaces audience segments bleeding money vs printing it. *“Find your hidden goldmine audience.”*
4. **Ad Budget Allocation Optimizer**, connects Google + Meta, recommends or auto-shifts budget to best-performing campaigns. *“Stop wasting budget on losing ads automatically.”*
5. **Landing Page Analyzer + Suggestions**, analyses landing page against ad creative, AI-generated improvement suggestions. *“Your ads aren’t the problem.”*
6. **Ad Performance Anomaly Alerts**, 24/7 campaign monitor, instant alerts with AI-diagnosis when something breaks or spikes. *“Insurance.”*
**Source recommendation:** AI Ad Copy Generator + Scoring OR Anomaly Alert are simplest to ship first, React + Claude API.

#### Detailed spec: AI Ad Copy Generator + Scoring Tool (verbatim)
**What it is:** standalone web app (or downloadable HTML) where a business owner inputs product details, target audience, and campaign goal, and instantly gets 15–20 ad variations for Google or Meta, each scored on predicted performance.

| Feature | Spec |
| --- | --- |
| Input form | Product/service, audience, goal (traffic, leads, sales), platform (Google or Meta), tone (professional, bold, playful) |
| AI generation | 15–20 ad variations using AIDA, PAS, hook-based formulas |
| Performance scoring | Each ad gets a score 1–100 based on clarity, emotional pull, CTA strength, character-count compliance |
| Platform formatting | Google (30-char headlines, 90-char descriptions) or Meta (primary text, headline, description) |
| Export | Copy to clipboard or download as CSV ready for Ads Manager |
| Tech | React artifact or single HTML file · Claude API (claude-sonnet-4) backend · no sub, buyer gets the tool file or hosted link |
| Price | $47–$97 one-time on Gumroad / Payhip |
| Positioning | “Never stare at a blank ad account again” |
| Upsell | Done-for-you run-it-for-them service |

**Why it sells:** every business running ads has felt the pain of writing copy. Removes it in < 60 seconds. Scoring makes it feel like a professional tool, not a chatbot wrapper.

#### Cross-card relevance (light)

- **Credibility & Media, test organic first principle** (item `mpj4v1ok-h7vqp1r`), reinforced here.
- **PB Services, Playbook backlog** (item `mpj5ws90-1h10yh1br`), this is one of the catalogue ideas.
- **PB Services, Quote Fit Filter** (item `mpj4m6ml-1j17161g11n`), similar single-HTML tool shape.
**Drag-drop target:** drop `ad-copy-generator.html` onto this item.

---

### New PlainBlack product line (P-12 / I-236)

**New PB product line: Quote Fit Filter / No-Wasted-Quotes Checker tool builds for trade businesses.** $1,499 NZD per custom build. First proof-of-concept: Bradley Roofing co-branded landing page mockup. Generic version parked for a later session.

Mockup image attached separately (drag-drop). URL slug: `plainblackcreative.com/tools/quote-filter`.

#### The energy line (verbatim, PB voice, this is the keeper)

> “**We stop your website handing you shit leads.**”
> 
> That is the energy.

#### The product in one paragraph
A 3–6 question filter that lives on a trade business’s website. Triages enquiries into **Good Fit** (contact CTA shown), **Maybe Fit** (ask for details first), or **Not Quote-Ready** (contact CTA hidden, redirected to maintenance checklist / price guide / “come back when ready” copy). Built per-client around their actual job types, minimum job values, red-flag lead rules, and quote process. *Inverse of a lead generator: this is a lead filter.*

#### Bradley Roofing demo (the mockup)

- **Headline:** “Stop sending every roofing enquiry straight to the inbox.”
- **Sub:** “Some roof leads are worth quoting. Some need more detail. Some are just unpaid admin with a phone number attached.”
- **6-question checker:** job type, customer stage, budget, urgency, photos/details ready, location.
- **3 result paths:** Good Fit (Request a roofing quote) / Maybe Fit (Send details first) / Not Quote-Ready (View roof quote prep checklist, contact CTA hidden).
- **“The worst lead is not the one that says no”**, 6-tile cost-of-bad-leads section: paid lead cost gone, admin time, quote time, follow-up time, evening time, still no job.
- **Bradley Roofing testimonial (mockup quote):** “Every hour we save on the wrong leads is an hour we can put back into real jobs for good customers.”

#### $1,499 NZD build offer (the productised version)

| Includes |
| --- |
| Client’s job types and service categories |
| Client’s minimum viable job values |
| Client’s red-flag lead rules |
| Good fit / Maybe fit / Bad fit result paths |
| Contact CTA hidden for poor-fit leads |
| Copy matched to the client’s tone and trade |
| Install-ready single-page tool for client’s website |

**Frame:** “Built for $1,499 NZD. No retainer. No bloated CRM. Just a smarter front door.”

#### The campaign sentence (from the GPT critique, ship this)

> “If you’re quoting 10 jobs a week and half were never serious, your website isn’t generating leads. It’s generating unpaid admin.”

#### Strategic challenges the GPT critique surfaced (summary, full verbatim in comment below)

1. **Brutal verdict:** demand exists, but for the *wasted-quote problem*, not for “a tool.” Sell the pain, not the widget.
2. **Decision-engine layer:** output isn’t just Good/Maybe/Bad, include “why it’s worth quoting,” “what to ask before booking,” “whether to show the CTA.” Turns toy into mini decision engine.
3. **3 questions may be too generic.** Better trio: trade/job type → job-shape (small repair / standard / major / not-sure) → customer stage (ready / comparing / budget-checking / exploring). Budget is a blunt instrument alone.
4. **Demo shouldn’t pretend to be universal.** Add: *“Demo filter. Paid version is calibrated to your actual services, minimums, red flags, quote process.”*
5. **$1,499 deliverable needs concrete scope.** Bullet list above.
6. **Dramatise the CTA hiding**, make absence visible in the demo, not just a polite bad-fit message.
7. **Segmentation:** write for the *angry moment*, not “tradies.”
8. **Blog as sales asset**, title: *“Why more leads are making tradies poorer.”* Not announcement-style.
9. **Week-1 metrics**, measure qualified intent, not raw submissions (tool’s job is to suppress some). Target: 200 plays / 40+ completed checks / 10+ “want one built” clicks / 3+ conversations / 1 paid build.
10. **Suggested public label:** “No-Wasted-Quotes Checker.”

#### What to cut today / what to add

| CUT | ADD |
| --- | --- |
| Too many trade categories | One tight section under the tool: “The real problem is not lead volume. It is quote quality.” |
| Fancy animation | Three-path output reinforced with reasoning, not just labels |
| Complex scoring | Hidden CTA on bad-fit visibly shown |
| Financing copy / heavy footer | Paid offer block with the 7-item scope |
| Backend / email capture before result / “AI” language | GA4 + one screen recording for socials |

#### The 5 questions the GPT says answer-before-build

1. What exact quote-wasting moment will a tradie recognise in 3 seconds?
2. What does the paid $1,499 version include that the free demo clearly doesn’t?
3. What bad-fit outcome replaces the contact CTA?
4. What proof do you have (anecdotal counts) that quoting waste is expensive?
5. What is the one sentence that makes a tradie say, “Yep, that’s me”?

#### Jay’s framing notes

- **Generic version: parked.** “Save the quote-fit-filter tool Generic Version for another time?” Bradley-specific ships first, generic follows once the format proves.
- **URL:** `plainblackcreative.com/tools/quote-filter`.
- **Generic demo can use roofing as the form demo**, the same Bradley UI shell, but framed as a public sample.
- **Check the GPT image for UI upgrade**, (referring to the mockup image attached separately; UI patterns to lift from there).

#### Open decisions / loose ends

- **Bradley Roofing relationship status**, paid client, agreed pilot, or speculative mockup? Affects whether the campaign can ship with their name attached.
- **Public product name**, “Quote Fit Filter” / “No-Wasted-Quotes Checker” / “Lead Repellent” / “Roof Quote Fit Checker” (trade-specific). Probably: *“No-Wasted-Quotes Checker”* publicly, *“Quote Fit Filter”* internally.
- **$1,499 fits the market-intel band** ($1,500–$2,500 bespoke build), defensible. Sits cleanly alongside the McIndoe Content Command Centre and the website offer ($1,150).
- **Generic demo**, ship same week as Bradley, or staged later? GPT critique suggests today; Jay’s framing parks it.
- **Distribution**, LinkedIn (Ian post) + Facebook (Jay post) drafts are written by the GPT critique. Worth shipping both alongside the launch.
- **Generalisation timing**, this fits Gap 1 + Gap 2 + Gap 5 of the market intel report. Worth using as the lead proof of the productisation thesis.

#### Cross-card relevance
**Bradley Roofing** (new card `mpj4m4or-21j1l1o161j`), first proof prospect.**Roofking** (card `mphz04mn-1j010dx14`, `client`), sec

Comments:

**Jay:**

> **[Source, Quote Fit Filter GPT critique, verbatim from Jay’s paste]**
>
> You’re close, but the current plan has one major strategic risk: **You’re calling it a product, but right now it could land as a clever free tool with a weak buying bridge.**
>
> The idea is good. The inversion is strong. “Lead repellent” is memorable. It fits PlainBlack’s ICP because the right owner wants control, speed, and fewer wasted decisions, not another marketing toy. That matches the refined ICP’s core pattern: they are capable operators who are stuck, time-poor, skeptical, and want a practical way to get results without wasting time or control.
>
> **The brutal verdict, Demand: yes, but not for the “tool”**
>
> There is demand for: “I’m sick of tyre-kickers.” / “I’m wasting nights quoting jobs that go nowhere.” / “I need better-fit enquiries, not more enquiries.”
>
> There is weaker demand for: “I want a no-wasted-quotes tool on my website.”
>
> That matters. Tradies do not wake up wanting a qualification widget. They wake up pissed off because someone asked for a $40k job, gave no real budget, ghosted them, then came back three weeks later saying “can you do it for $18k cash?”
>
> So every social post, blog intro, and landing section needs to sell the wasted quote problem, not the tool.
>
> Strongest public label: **No-Wasted-Quotes Checker**. Strongest sales promise: **Stop quoting jobs you should have filtered out first.**
>
> **The biggest flaw, underweighting the decision engine.** Right now the tool risks becoming three dropdowns and a cute output. The Future-Proof Framework says PlainBlack’s moat is decision logic, trade-offs, commercial judgment, and clear escalation paths, not generic execution. So the tool should not just output Good fit / Borderline / Not a fit. It should output: Why this lead is worth quoting / What to ask before booking the quote / What to say to avoid wasting time / Whether to show the contact CTA. Turns it from a toy into a mini decision engine.
>
> **Challenge 1, Three questions may be too generic.** Job type / Budget / Urgency is fast but may miss what predicts quote quality. Bad-fit pattern is usually: unclear scope / unrealistic budget / no urgency / wrong service area / shopping for free advice / insurance-landlord-body-corp complexity / “just wondering” / mismatch between job type and minimum viable job value.
>
> Better three-question version: (1) What trade/job type is this?, Roofing, plumbing, electrical, HVAC, builder, deck/fence, landscaping. (2) What best describes the job?, Small repair / Standard job / Major replacement / Not sure yet. (3) Where are they at?, Ready to book a quote / Comparing options / Budget checking / Just exploring.
>
> **Challenge 2, The public demo should not pretend to be universal.** Frame: “A sample version of the filter we build for trade businesses. Your real version would use your job types, minimums, service area, red flags, and preferred quote rules.” This protects credibility and makes the $1,499 offer logical.
>
> **Challenge 3, $1,499 needs a clearer deliverable.** Stronger offer block includes: Your job types and service categories / Your minimum viable job values / Your red-flag lead rules / Good fit, maybe fit, and bad fit result paths / Contact CTA hidden for poor-fit leads / Copy matched to your tone and trade / Install-ready single-page tool for your website. Built for $1,499 NZD. No retainer. No bloated CRM. Just a smarter front door. CTA: *Get my quote filter built.*
>
> **Challenge 4, The CTA hiding is the product, so dramatise it.** Do not jus

---

### Productisation pipeline for the 30-day-challenge builds (P-12 / I-131)

**Productisation pipeline for the 30-day-challenge builds**, when a custom demo proves itself on a real client site, abstract it into a generic PB tool with per-industry variants, then update the originating blog post to link to the live tool.

**The flow**

1. **30-day build**, Jay builds something custom for a real client / 30-day-challenge slot (e.g. BLST quote tool, Blackberry audit, Pizza Pundits proposal)
2. **Validate live**, the custom thing actually works on a real site, converts, or proves the pattern
3. **Abstract into a generic tool**, strip the client-specific bits, pull the config out into `CONFIG.surfaces`-style knobs, brand-palette swappable. Same exercise as the AI Quote Tool template productisation work on PB Services.
4. **Industry demos**, preload the generic tool with industry-specific demo data (cafe demo, gym demo, tradie demo, retail demo). Visitors land on the tool and see it pre-configured for their world.
5. **Update the blog**, the originating blog post (which described the custom build) gets its link updated to point to the live generic tool. The blog becomes the case study; the tool becomes the lead-magnet.
6. **List in `/tools`**, the generic tool earns a permanent home on the PB site, joins Build Map / Voice Twin / Customer Translator / etc.

**Why this matters**

- Every 30-day build currently produces a one-off artefact that mostly dies after the challenge ends. This pipeline converts ephemeral builds into a permanent compounding tool library.
- The blog → tool link gives every blog post an action button beyond "read more"
- Each new tool added increases the chance an inbound visitor finds something useful, increasing trust + conversion across the whole PB site
- Compounds the 30 Day Build Challenge into a long-term asset, not just a content burst

**Candidate first promotions**

- **BLST quote tool** → generic "satellite-trace quote" tool with cafe / lawn / solar / roofing / waterblast demos. Already specced (PB Services AI Quote Tool item). Highest-priority promotion candidate.
- **Blackberry / Pizza Pundits audit HTML** → generic "niche audit" tool with cafe / pizza / gym / tradie demos. Tied to the Niche Audit Templates item on PB Services.
- **Digital coffee card** (Marketing & Lead-Gen Ideas), once built for Blackberry, abstract into a tool any cafe can sign up for

**Operational checklist for each promotion**

- Pull config out of the custom build into knobs
- Pick 3–5 industry demos that exercise the variation
- Add a "Powered by PB" branded landing wrapper around the tool
- Update the originating blog post link
- Add to `/tools` index
- Cross-post on socials with a "we built this for X, now anyone can use it" framing

**Cross-card relevance**

- **AI Quote Tool template productisation** (this card), same pipeline, narrower vertical
- **Niche Audit Templates** (this card), same pipeline, audit-shaped
- **Blog production upgrade** (Hub + Inbox), pairs with this: blogs become permanent case studies pointing at live tools
- **30 Day Build Challenge** card (now sec-clients), this pipeline is what gives the challenge a long tail beyond the 30 days

---

### The BLST quote tool is a prototype of a reusable PlainBlack product (P-12 / I-124)

**The BLST quote tool is a prototype of a reusable PB product**, a templated "satellite-trace → instant quote" tool for any tradie service where the job size is mostly measurable from above.

If BLST works in production, the same single-file HTML + config-driven rate card unlocks an entire product line: one template, one half-day per vertical to reskin + retune rates + relaunch.

**Verticals this pattern fits (anything area-priced from above)**

- **Lawnmowing**, lawn area + edges = quote. Next planned vertical (see Papamoa Lawns card).
- **Solar**, roof area + pitch + aspect = panel count + install quote. Jay flagged for after Lawns.
- **Roofing**, roof area = quote. Note: existing PB client Bradley Roofing (sec-clients-list [done]) could host the v1 if relationship is still warm.
- **Waterblasting**, already BLST (prototype)
- **Driveway sealing / re-sealing**, driveway area
- **Fencing**, perimeter trace (line, not area), would need a different geometry calc
- **Paving / concreting**, area trace
- **Pool cleaning**, pool surface area
- **Tree work**, partial fit (tree count from satellite, but height matters)

**The PB-side business model**

- **License the tool** per-vertical to existing tradies in each niche (one per niche per region, same lock-in pattern as the niche-audit play)
- **Build & operate** for a tradie as a custom delivery (one-off fee + monthly hosting/lead-routing)
- **Run it ourselves** as a lead-gen aggregator (Papamoa Lawns model, see below) and farm work out

**What needs abstracting from the BLST prototype to make it a template**

- `CONFIG.surfaces` → per-vertical config (lawns / roof tiles / solar bays / etc.)
- `CONFIG.rates` + `CONFIG.suburbAverages` → per-vertical, per-region
- Brand palette + logo path → per-client
- The trace canvas + shoelace area calc is fully reusable as-is
- Demo mode + seeded addresses → useful for any vertical demo
- Outcome copy (Karl voice) → per-client
- Lead endpoint → wire to PB lead-routing infra (does not exist yet, TODO across all of these)

**Cross-card relevance**

- BLST card holds the working prototype
- **Papamoa Lawns** (new card) is the next vertical and the first "PB runs it as aggregator" experiment
- Niche Audit Templates (this card), same productisation muscle (one template, swap variables, deliver fast)
- MAIA AI Consulting voice agents, quote tool catches the lead, voice agent books the job, full automation chain
- Stripe + Web3 prereq (Hub + Inbox), required for the "Lock in this price →" early-bird auto-pay flow

**Next:** get the BLST prototype into production (API key, deployment, real lead endpoint). If conversion rate is OK, reskin for Papamoa Lawns within a week.

---

## Digital Footprint Audit

### Reusable PlainBlack Discovery Interview Framework (P-8 / I-191)

**Reusable PB Discovery Interview Framework, 15-minute pulse-check Jay uses with high-value local prospects.** First used with Heide @ Tasman Holiday Parks; designed to surface real-data signals about marketing channel value, AI sentiment, business confidence, and where PB can fit.

**The structure (15 minutes total)**

| Section | Time | Purpose |
| --- | --- | --- |
| 1. Opening | 2 min | Context-set, lower defences, frame as research not pitch |
| 2. Marketing Value Matrix | 6 min | 1–10 ratings on SEO / Directories / Local Print / Social. Then in-house vs outsource per channel. |
| 3. AI Sentiment Check | 3 min | Novelty / Not Relevant / Will be huge / Extremely Important right now? Use cases? Time-and-resource gap? |
| 4. Confidence & Outlook | 2 min | Business growth 1–10 next 12mo + role confidence (strategic vs bogged-down) |
| 5. Non-Obvious Insights | 2 min | Hyper-local referral dependency · friction points · talent-vs-tooling trade-off ($5k a month = staff or services?) |
| 6. Papamoa.info close (time-dependent) |, | Listing no-brainer questions, payment model preference |

**Verbatim opening**

> "Thanks for the time. I'm currently pulse-checking the Papamoa business landscape to understand what high-level brands actually value when it comes to growth and third-party services. I want to see where the line sits between in-house DIY and where you see real ROI from external expertise. Your perspective as a major local player is the gold standard for this."

**Verbatim Marketing Value Matrix**

Rate 1–10 (1 = Waste, 10 = Essential revenue driver):

- SEO / Search
- Online Directories
- Local Print / Radio
- Social Media

Follow-up per high-score item: *"Are you handling this in-house, or do you feel it is better left to specialised agencies?"*

**Verbatim AI Sentiment**

- Which describes your view on AI: *Novelty* · *Not Relevant* · *Will be huge (but not yet)* · *Extremely Important right now*?
- Are you or your staff currently using it for things like guest comms / marketing copy / data analysis?
- Do you feel you have time + resource to implement AI, or is it just noise right now?

**Verbatim Confidence & Outlook**

- Business confidence 1–10 for next 12 months
- Role confidence, same focus / more strategic / more bogged in ops

**Verbatim Non-Obvious Insights**

- **Hyper-local referral loop:** How much revenue feels dependent on Papamoa ecosystem (local referrals, local events) vs broad digital reach? If the local community forgot you existed tomorrow, would your occupancy actually drop?
- **Friction point:** What is the one recurring weekly task that feels like it should be automated by now, but is not?
- **Talent vs Tooling trade-off:** If I gave you $5k a month to grow the business, would you spend it on a new part-time staff member, or a suite of high-end marketing / tech services?

**Verbatim Papamoa.info close (time-dependent)**

- What would make a paid subscription to Social Media & Online Footprint Management a no-brainer?
- What would make a paid listing in Papamoa.info a no-brainer?
- What payment model makes sense, Monthly / One-Off / Annual / Performance-based?

**Verbatim Follow-Up Email Template**

> Subject: Great meeting you / Insights from [Business Name]
> 
> Hi [GM Name],
> 
> Thank you for carving out 15 minutes for me this morning. I know how busy [business] gets, so I truly appreciate your candor regarding the Papamoa business landscape.
> 
> Your perspective on [mention one specific thing she said, e.g., the shifting value of local radio vs. SEO] was particularly insightful and has given me a lot to think about regarding how local brands are balancing in-house talent with external tools.
> 
> It is clear that your focus on [mention her 12-month goal or a specific pain point she shared] is what keeps [business] at the top of the local market.
> 
> I'll be sure to share any high-level trends I find from my other conversations in the area if you'd find that useful.
> 
> Best regards, [Your Name] · [Your Phone Number]

**Why this framework is valuable beyond any one prospect**

- 15 minutes is short enough to get the meeting; long enough to extract real signal
- The 1–10 rating questions produce comparable data across prospects, Jay builds a Papamoa marketing-channel benchmark over time
- The "talent vs tooling" $5k question reveals their actual mental model in one sentence
- The "non-obvious" friction question often surfaces an automation Jay can build + sell next week
- The follow-up email frames Jay as a researcher / trend-spotter not a salesperson, generates trust + creates a reason for the next conversation

**How to deploy across PB outreach**

- Use with every "warm" prospect Jay meets in person (Tasman → BLST → Battle Axe → Redefined → Tom Rutherford office → Heide etc)
- Capture findings as comments on the relevant prospect card
- Aggregate ratings across N prospects = real Papamoa-marketing-landscape data (publishable as a PB blog: "What 20 Papamoa Businesses Actually Rate Their Marketing Channels")
- That blog → media outreach hook for the Credibility & Media plan

**Cross-card relevance**

- **Tasman Holiday Parks** (new card), first real case using this framework, see Heide's responses captured there
- **Niche-lock motion + bad-ad-rebuild + spec-site-outreach** (this card), sister outreach motions. This framework is the WARM-meeting variant; the others are COLD-outreach.
- **Online Footprint Glow-Up** (PB Services), pairs naturally; Glow-Up is the deliverable that follows a Discovery Interview
- **Credibility & Media**, aggregated findings = a flagship blog → media-pitch material

**Next:** use this framework on the next 5 in-person prospect meetings. Track responses in card items. After 5, see whether the aggregate data is publishable.

Comments:

**Jay (2026-05-24T00:46:38.588Z):**

> **[Cross-link, sister tool, deeper post-conversation brief]**
>
> New item on PB Services (id `mpj24iuu-kz183v1m`) parks the **Plain Black V3 Intake Schema & Client Brief Template**, the 10-section structured brief that follows when your 15-min Discovery Interview returns a yes-let’s-go.
>
> **Why it matters here:** together they form a 2-stage discovery funnel. First-touch (this framework) → full brief (V3 intake) → Playbooks / service delivery. Worth tightening field naming between the two so the same answers flow forward.

---

### Multi-pass website / copy audit tool (P-8 / I-491)

**Multi-pass website / copy audit tool. Originally pencilled as a Week 4 (Day 26 or 27) build during the 30-Day Build Challenge planning. Cut before Day 22 started because it was more product than tool, too big for a one-day build.**

Four passes side by side on one URL:

1. **Voice Fingerprint**, radial chart of jargon, hedge words, and generic phrases pulled from the input copy.
2. **Slop Detector**, flags keyword-stuffed copy and obvious AI tells.
3. **Technical Audit**, alt tags, H1 structure, schema, Lighthouse score.
4. **Hypocrisy Check**, runs the same audit on the agency's own client sites. Receipt-style output.
Worker: paste a URL or copy, get the four-panel report. Free tier on PB site, paid tier for bulk runs.

**Cross-card relevance:** Lives in the same product family as the Filler Score (already shipped Day 19) and the Brand Spark / Customer Translator tools. Could ship as the "serious sibling" to Filler Score.

**Next:** Reconsider for a future build day once we have the pattern for multi-pass tooling locked in. Day 27 Local Trust Builder showed dark-page interview format works for 6+ input tools.

---

### Playbook idea archive (P-12 / I-264)

**Playbook idea archive: Website & Footprint Audit + Revamp Playbook.** Bundles SEO + AEO audit with a socials glow-up.

#### The idea (verbatim)

> **Website & Footprint Audit & Revamp Playbook**
> 
> SEO, AEO Audit & Upgrade
> Website & Socials Glow Up
> 
> **Niche:** Website & SEO
> **Product:** Website Revamp Playbook
> **Target Customer:** Any small business

#### Cross-card relevance (light)

- **Credibility & Media, AEO research** (item `mpj1lfs0-m2mg1le`), AEO Audit content lives here. Playbook substrate.
- **Credibility & Media, OG fallback audit TODO** (item `mpj31sua-3haz1bc`), sister audit-surface for share-cards.
- **PB Services, Playbooks reframe** (item `mpj5nrjy-u1r1e141ed`), the reframe proposed turning product 6 into “AI Search Visibility System” ($99 self-serve / $1,499 DFY). Same play; this Playbook is the $99 tier of that.
- **PB Services, Playbook backlog** (item `mpj5ws90-1h10yh1br`), sibling concept.

---

### "Online Footprint Glow-Up" (P-12 / I-167)

**"Online Footprint Glow-Up", productised audit-to-fix service covering every place a business does or should appear online. AI-driven discovery, human-shaped delivery, free-to-paid ladder.**

**Coverage scope**, every layer of presence, not just the obvious ones:

| Layer | What gets audited + fixed |
| --- | --- |
| **Google / SEO** | Indexing, meta, schema, sitemap, page-speed, ranking position for target queries, broken links |
| **AIO / GEO** | Visibility in ChatGPT / Claude / Gemini / Perplexity / Google AI Overviews. llms.txt, FAQPage schema, deep-content pages (cross-link SAO item on Marketing & Lead-Gen Ideas). |
| **Socials** | FB / IG / TikTok / LinkedIn / YouTube presence + posting cadence + bio + pinned content + engagement health |
| **Google Business Profile / Maps** | Verification, categories, photos, hours, posts, Q&A, reviews + replies (cross-link $100/wk Papamoa SMB on this card) |
| **Online directories** | TripAdvisor, BOPtourism, papamoa.info, tauranganz.info, NZ-specific lists, industry-vertical directories (cross-link Papamoa.info expansion item) |
| **Backlinks** | Inbound link profile, who is referencing the business, where the gaps are, who SHOULD be linking but is not |

**The discovery layer, AI scrapes for opportunities**

- AI sweeps the web, find every existing appearance of the business (good + bad + broken)
- Find competitors, where they appear that the client does not
- Find the audience, where the target customers actually hang out (Reddit threads, FB groups, NZ-specific forums)
- **META Ad Library search**, what competitors are currently spending on (cross-link "bad-ad rebuild" outreach motion in the prospects batch on Marketing & Lead-Gen Ideas)
- **Google Ads search**, what queries competitors bid on, which the client should

**The deliverable**

A single report containing:

- Current state per layer (score + screenshots + objective data)
- Gaps + missed opportunities (ranked by impact × effort)
- Competitor benchmark side-by-side
- Step-by-step DIY fix recommendations
- "Or pay PB to do it" with quoted price per fix

**Pricing ladder**

| Tier | What customer gets | Price |
| --- | --- | --- |
| **FREE** | Auto-generated audit report, every layer scored, top 10 fixes called out, DIY steps included. Captures email for downstream nurture sequence (cross-link Papamoa.info email sequence). | $0 |
| **PAID, ROI locked in** | PB executes the fixes. Guarantee on ROI (specific commitment TBD, could be "x% organic traffic lift in 90 days" or "money back if no measurable improvement"). Higher-value delivery, deeper analysis, AI agent does most of the labour. | TBD, likely $999–$2,999 depending on scope |

**The DIY-vs-DFY positioning (same voice family as Websites v2 on this card)**

> "You can follow the steps to DIY or you can Pay ME (so you can do you)."

Pairs with the wider PB voice: "we are not gatekeeping your fixes". Same DNA as the free-off-boarding promise on Websites v2 and the "Take control yourself" path on the website Repo System Prompt.

**Why this becomes a core PB lead-gen engine**

- FREE tier is the lead magnet, captures the email + the business context, feeds the PapaMassive sales sequence
- PAID tier is the immediate revenue. $1k–$3k per converted lead.
- The audit report itself becomes evergreen content (cross-link to niche audit templates + "audit pages with low SEO" sub-product)
- Most other agencies sell one layer (just SEO, just socials, just GBP). The "everywhere" pitch is differentiation.

**How this differs from existing PB items on this card**

- **Niche Audit Templates**, niche-shaped (cafe template, gym template, tradie template). Online Footprint Glow-Up is layer-shaped (Google template, socials template, backlinks template). Same audit muscle, different cross-section.
- **PapaMassive Authority tier**, "Full online footprint audit" is already listed as an Authority-tier inclusion. This item formalises that line as a standalone product the Authority tier bundles in.
- **Build Map diagnostic**, Build Map asks "what do you need". Glow-Up answers "where you are missing". Pair them: Build Map routes the prospect to Glow-Up as the diagnostic.
- **SAO** (Marketing & Lead-Gen Ideas), Glow-Up includes SAO as one of its layers
- **Google Ecosystem Supercharge** (Marketing & Lead-Gen Ideas), Glow-Up includes the Google-ecosystem layer plus all the others

**Cross-card relevance**

- **PapaMassive** (this card), Authority tier already includes this. Standalone version sells to non-PapaMassive prospects.
- **Niche audit templates** (this card), sister product, different axis
- **Notice-and-Post leverage** (Marketing & Lead-Gen Ideas), Glow-Up audit findings ARE the "notice" half of that pattern; the offer to fix is the "post" half
- **Papamoa.info expansion**, the directory-listings layer maps to selling Papamoa.info listings as a fix
- **$100/wk Papamoa SMB service**, Glow-Up findings naturally upsell into the ongoing weekly service
- **AI Quote Tool template productisation**, Glow-Up could use the same trace-input → AI-output template pattern (audit URL in → report out)
- **Analytics rollout** (Hub + Inbox), Glow-Up uses GA / Search Console / Clarity / Meta Ad Library / Google Ad search, most of which need PB own analytics rollout to be complete first

**Next:** v1 the FREE tier as an HTML+API tool, paste a URL, get a layer-by-layer audit. Use Blackberry / Pizza Pundits / ReDefined existing audit HTMLs as the template skeleton. Deploy at `tools.plainblackcreative.com/glow-up` or similar. Capture email + business context. Pipe leads into the PapaMassive funnel.

---

### Productised audit template per niche (P-12 / I-120)

**Productised audit template per niche, Cafes, Tradies, Gyms, Burgers, Pizza, etc. Same checklist shape, niche-specific scoring rubric.**

This is the deliverable that powers the niche-lock motion (see Marketing & Lead-Gen Ideas card). Without templates, every audit is a custom artefact and the work does not scale. With templates, PB does one cafe audit and then runs the next ten in a fraction of the time.

**Standard audit format (every niche)**

- **Output:** screenshot report, emailed PDF and/or web page
- **Structure:** Before / After visuals + Strength / Risk ratings per category
- **Categories scored:** Google (GBP + organic) · Website · AI readiness · Socials · Backlinks · Niche-specific directories

**Niche-specific overlays**

- **Cafes**, TripAdvisor presence + reviews · Google Reviews velocity · Bay of Plenty tourism directories (bayofplentynz.com, papamoa.info) · Instagram food photography quality · menu HTML vs PDF · opening hours schema. *Reference cases: Blackberry Eatery (already audited)*
- **Pizza / Fast Food**, Delivery platform coverage (Uber Eats, DoorDash, Delivereasy, OrderMeal) · ordering-platform listing quality · review responses · GBP photo freshness. *Reference cases: The Pizza Pundits (already audited)*
- **Tradies**, Google "near me" ranking · GBP service categories · before/after photo gallery · 0800 vs mobile number consistency · backlink presence on local trades directories
- **Gyms**, Reels presence + frequency · class-schedule visibility · Google Reviews count vs comparable gyms · membership-purchase flow on site · trial offer prominence. *Reference cases: ReDefined (audit pending)*
- **Burgers / Casual Dining**, same as Pizza but with menu-as-image vs menu-as-text scoring; specials surfacing on socials

**Reference comparisons to include in every cafe/restaurant audit**

- Ponies Plus (?), TODO clarify if Jay meant a specific business or a typo
- Blackberry Eatery, established baseline (4.5★, ~38 TripAdvisor reviews, top-3 organic for "cafe Papamoa")
- TripAdvisor, BOP Tourism, papamoa.info, the three NZ directories every cafe should be on

**Adjacent: "audit pages with low SEO & upgrade"**

A cheaper sub-product: skip the full niche audit, just score one page on one site, deliver the upgrade recommendations. Low ticket, fast deliverable, lead magnet for the larger audit. Could be the $99 entry-tier sibling of the $500 Game Plan from MAIA AI Consulting.

**Template implementation**

- One HTML template per niche (Astro component or standalone, like the existing Blackberry + Pizza Pundits audit HTMLs)
- Variables for biz name, location, owner contact, scoring inputs
- AI fills in the variables from a structured intake, see custom-GPT-intake-form note on MAIA AI Consulting
- Output: HTML + PDF (for email) + permalink (for "show this to a OneMusic inspector"-style scenarios)

**Cross-card relevance**

- Niche-lock motion (Marketing & Lead-Gen Ideas) is what these templates enable at scale
- Notice-and-Post leverage (Marketing & Lead-Gen Ideas), same audit, free distribution path
- $100/wk Papamoa SMB service (this card), the recurring tail after the audit converts
- Blog Gen (Hub) + AI Music for NZ Retailers, same productisation muscle (templated AI-powered deliverable + flat-fee)

**Next:** pick a niche, take the Blackberry or Pizza Pundits HTML, abstract the scoring rubric out into a template, run one more business through it to validate. If that takes < 1 hour, the template works.

---

## Messaging, positioning & brand story

### Core positioning that anchors this whole play (P-8 / I-119)

**Core positioning that anchors this whole play:**

> "How can you use AI to improve productivity and performance? **Not save wages.** Pay them the same, reduce hours, increase wellbeing."

This is the brand-level answer to "is AI going to replace my staff?", and the pitch that lets PB sell into businesses where the owner cares about their team. It also separates PB from every other AI consultancy whose pitch is implicitly "fire people, save money."

---

**The niche-lock motion**

Pick *one* business per niche. Offer them PB work **free** in return for content rights + endorsement. Use the resulting case study to run targeted ads at every other business in that niche. Stay exclusive to one per niche so you are never the "we work with both your competitors" agency.

**The mechanic**

1. Find a business that sucks in some visible way (cafe with broken Google profile, gym with no reels, pizza shop with the wrong website link on TripAdvisor)
2. Pimp it for free, fix the broken stuff, ship the upgrade, document everything
3. Record what was done, screen captures, before/after, the actual deliverables
4. Get the review / endorsement / testimonial
5. Run targeted ads at every other business in that niche showing the before/after
6. Convert until you lock in 1 paying client per niche
7. Stay exclusive, once you have the cafe, you do not take another cafe in the same patch

**Initial target list (per niche)**

| Niche | Target | Card status |
| --- | --- | --- |
| Cafe | Blackberry Eatery | ✅ existing card · audit + redesign already produced |
| Pizza | The Pizza Pundits | ✅ existing card · audit + proposal already produced |
| Burgers | The Wagon | ❌ no card yet · flag if Jay decides to approach |
| Gym | Lawrence? (uncertain) | ❌ no card · clarify which Lawrence gym (Papamoa? Tauranga?). ReDefined Jimmy already in flight as the premium-gym candidate. |

**Decision parked:** stay broad across niches, or go all-in on **food & drink** only? Food & drink advantages: dense Papamoa coverage, similar audit playbook reuses, customers all know each other. Disadvantages: ceiling on revenue per client.

**Voice agent reinforcement** (already on MAIA AI Consulting card):

> "Definitely sell AI phone agents, if they do not answer, I am calling the next."

Read: the phone-agent pitch is "miss a call, lose the next customer to your competitor." That works particularly well for food / trades / gyms, same niches as the audit templates.

**Cross-card relevance**

- Niche-audit templates (new item on PB Services) is the productised version of step 1–3 above
- Notice-and-Post leverage (this card) is the version where the audit is free even without endorsement, "post about it anyway"
- $100/wk Papamoa SMB service (PB Services) is the recurring-revenue tail once a niche client converts
- MAIA AI Consulting voice agents are the upsell after the audit gets you in the door

**Next:** pick one niche, pick one business, run the play end-to-end once. Blackberry or Pundits is already prepped, fire the cannon.

Comments:

**Jay (2026-05-23T10:25:41.440Z):**

> **[Clarification, "Lawrence" = Absolute Weights and Fitness]**
>
> - Business: absoluteweightsandfitness.co.nz (https://www.absoluteweightsandfitness.co.nz/)
> - Location: 29 Reynolds Place, Papamoa (same patch as everything else)
> - Type: hybrid 24/7 strength + group classes (ZUU, Partner WOD) + sauna · "supportive, non-intimidating community" positioning · results-focused not wellness-focused
> - Lawrence not named publicly on the homepage, likely owner/operator behind the scenes
> - Site quality: modern Squarespace, real gym photography, mobile-responsive, clean CTAs. **Not "lame"** in the way Jimmy described ReDefined.
>
> **Sub-niche distinction (resolves earlier ambiguity)**
>
> ReDefined and Absolute Weights are *both gyms* but serve different customers, premium wellness (yoga / pilates / recovery) vs traditional strength/fitness. Under a strict one-per-niche rule they conflict; under a sub-niche reading they are distinct. Defensible to lock both since the customer bases barely overlap.
>
> **Status:** not yet approached. URL captured. No card yet, see open question for Jay before card creation.

---

### Marketing campaign for the PlainBlack Blog Generator (P-8 / I-159)

**Marketing campaign for the PB Blog Generator, lead with "AI Brain is the difference", not "AI generates blogs".**

**The positioning insight**

Every AI blog tool says "generate blogs with AI." That is not differentiated. The actual differentiator is the **AI Brain**, the per-business voice + facts + context that makes the output sound like the client, not like ChatGPT default.

The pitch becomes: *"It is not an AI-word-slop generator. We help you build your AI brain to sound like you, think like you, and know the facts."*

**The selling points**

- **Your voice**, not generic AI tone
- **Real value content**, facts about your business, not hallucinated filler
- **Saves time**, minutes per post, not hours
- **Saves brain**, no "what should I post tonight?" decision fatigue
- **Posts + blog**, one input becomes multiple outputs
- **Content + SEO**, SEO baked in, not retrofitted

**Verbatim ad copy (Jay)**

> "Mate, I used to sit there at night trying to figure out what to post.

> Now I just chuck in a topic, hit generate, and I have got:

> , a blog, a Facebook post, a LinkedIn post, and all the SEO stuff sorted

> I just copy it, tweak it, and I am done."

Conversational, NZ vernacular, leads with the pain (night-time decision fatigue), shows the output as a concrete list, ends with the user effort acknowledged ("copy it, tweak it"). Ready to run as a Facebook ad or organic LinkedIn post with minimal edits.

**Where this campaign lives**

- **PB site Blog Generator product page**, replace any current copy with this positioning
- **Facebook / Instagram ad pack**, run the verbatim ad copy as the headline
- **LinkedIn posts**, same copy, slightly more buttoned-up but keep the "mate" if Jay personal account
- **30-day challenge content**, the Blog Generator IS one of the demo tools featured during the 30 days (cross-link to 30-day commitment on 30 Day Build Challenge card)
- **White-label Blog Generator agency pack** (this card, existing item), same positioning applies when reselling to agencies

**"AI Brain" as a brand asset**

If the AI Brain framing works, it becomes a reusable PB concept, not just for Blog Generator but for any productised PB AI tool. Every PB tool has an AI Brain underneath that gets tuned per client. Pairs naturally with:

- MAIA AI Consulting AI Proficiencies funnel
- The Custom GPT intake form (MAIA)
- Niche audit templates (PB Services), each industry has its own AI Brain

**Cross-card relevance**

- **White-label Blog Generator item** (this card), same product, agency-side sale
- **Content engine batch** (this card), Blog Generator is the engine that powers that content engine
- **30 Day Build Challenge commitment** (sec-clients card), Blog Generator is being demonstrated through the 30 days
- **Blog production upgrade** (Hub + Inbox), every blog must ship as a 5-asset release; Blog Generator can produce all 5 from one input
- **Tagline batch** (PB Services), "We made ourselves a playbook, we made it a tool you can use too" sits here

**Next:** update Blog Generator product page copy this week. Launch the ad as the first ad in the 30-day challenge. Measure conversion.

---

### PlainBlack Instagram carousel (P-8 / I-202)

**PlainBlack Instagram carousel: “Your ad campaign didn’t work. Here’s why.”** 7-frame, 1080×1350. Designed as a stop-the-scroll lead-gen asset that funnels to a free 15-min teardown via DM “AUDIT”.

Image attached separately, the laid-out 7-up still needs to be sliced into 7 individual 1080×1350 frames before publishing.

#### Carousel script (verbatim from the design)

| Frame | Headline | Body / fix-it |
| --- | --- | --- |
| **01 / 07, Cover** | Your ad campaign didn’t work. *Here’s why.* | “Most ads fail for the same 4 reasons. Fix these and you’ll stop wasting money.” · SWIPE → |
| **02 / 07, Reason 01** | The ad had *no job.* | “People didn’t know what you wanted them to do, so they did nothing.” **Fix it:** One clear action. One simple message. · Sticky note: “One job. Do it well.” · Visual: clipboard with AD JOB checklist (Awareness / Leads / Sales / Calls / Bookings) all crossed out except “Confusing everyone”. |
| **03 / 07, Reason 02** | The page *broke* the promise. | “Your ad said one thing. Your landing page said something else.” Headline pull-out: “Great ads. Confusing pages.” **Fix it:** Match the message. Keep the promise. · Sticky note: “Don’t send them to a different story.” |
| **04 / 07, Reason 03** | The message was built for *you,* not them. | “It talked about you. Your audience doesn’t care about you. They care about their problem.” **Fix it:** Talk about their world. Their problem. Their win. · Visual: notepad, YOU FOCUSED ON (services / team / process / experience / passion) crossed out vs THEY CARE ABOUT (problem / goals / outcome / time / money) ticked · “Flip the script.” |
| **05 / 07, Reason 04** | The audience was *borrowed,* not bought. | “Wrong people. Wrong place. Even the best ad won’t save a bad audience.” **Fix it:** Right people. Right place. Right intent. · Sticky notes: “Wrong people burn cash.” / “Target better. Spend less.” |
| **06 / 07, CTA** | Not sure which one *killed* yours? | FREE 15-MIN TEARDOWN. “Send us the ad, the landing page, and what you spent. **We’ll tell you where the money leaked.**” **Button:** DM “AUDIT”. Hand-script note: “No pitch. No fog machine.” |
| **07 / 07, Outro** | PlainBlack. | Tagline: “Strategy. Ideas. Execution. *Make it make sense.*” Service-pillar footer: PLAYBOOKS · BRANDING SERVICES · IDEA ENGINE. Designed to stop the scroll. **Useful. Blunt. Clear. PlainBlack.** |

#### Jay’s shorthand version (one refinement worth keeping)

> You did an ad campaign. It didn’t work. Scroll for reasons why.
> 
> The ad sucked, **test your content organically first, if it gets traction, spend on it.**
> Your landing page sucks. …
> Your message is off.
> Your audience was wrong.
**New thinking** in Jay’s draft vs the polished version: the “test organically first, then spend” refinement to Reason 01. Worth folding into the fix-it block for frame 02 if there’s a v2 of the carousel.

#### Format spec

- **Channel:** Instagram carousel.
- **Dimensions:** 1080 × 1350 per frame (4:5 portrait).
- **Frames:** 7 (cover · 4 reasons · CTA · outro).
- **Brand:** PlainBlack, dark surface, mint accents, white serif headlines, mono notes, P-logo prop in every frame.
- **Aesthetic:** handwritten sticky notes, props (mug, clipboard, map, notepad, laptop), single mint-glow light source per frame, consistent set-build “workshop” feel.

#### CTA mechanic

- Reader DMs the word *“AUDIT”* to PB’s IG.
- PB responds with intake (send the ad + landing page + spend).
- PB delivers a 15-min teardown showing where money leaked.
- No pitch on the call. The teardown earns the next conversation.

#### Tasks before publish

- Slice the laid-out 7-up image into 7 individual 1080×1350 frames (image-editor task).
- Stage caption + alt text for each frame.
- Wire the DM “AUDIT” keyword in ManyChat to the intake flow.
- Confirm the teardown delivery format (Loom? PDF? Inline DM?). Defaults to Loom video for stop-the-scroll teardown.
- Decide whether to fold Jay’s “test organically first” refinement into the published copy or save for v2.

#### Cross-card relevance

- **Credibility & Media**, this carousel is the executable expression of the visibility / authority play already parked there. Sister of the AEO research.
- **AI Agents, Personal AI assistant** (item `mpj1f2qk-1l1521fvv`), the “IG carousel publishing” future idea on Jay’s personal-assistant plan is the autopublisher version of this manual workflow.
- **PB Services, AI Playbooks pricing** (item `mpj1jg6p-1b13l1jk3`), the outro footer (PLAYBOOKS · BRANDING SERVICES · IDEA ENGINE) treats Playbooks as one of three pillars; if the umbrella decision changes (services-glue / parked), this footer wording needs to follow.
- **AI Agents, Basic ManyChat booking flow** (item `mpj1r0aa-51nt17u1q`), same ManyChat plumbing handles the DM “AUDIT” keyword intake.
**Next:** slice the image, set up the DM “AUDIT” keyword flow, draft captions + alt text, schedule for publish. Once item ID is in hand, Jay drag-drops the laid-out image (and the sliced frames, once ready) onto this item via the inbox UI.

Comments:

**Jay (2026-05-24T00:53:10.662Z):**

> **[Cross-link, paid follow-on to the DM “AUDIT” CTA]**
>
> New item on PB Services (id `mpj2cw45-1r618u1p18`) parks **First-Fix**, paid Zoom-plus-follow-up diagnostic with no-questions refund + black-list-for-piss-takers. Day 22 of the 30 Day Build Challenge, live at plainblackcreative.com/first-fix (https://www.plainblackcreative.com/first-fix).
>
> **Why it matters here:** First-Fix is the natural paid step after the free DM-AUDIT teardown this carousel funnels into. Open funnel question on the First-Fix item: keep both (free + paid for different temperatures) or collapse to just the paid offer with refund guarantee. Decision affects what comes next after the AUDIT keyword triggers.

**Jay (2026-05-24T00:58:27.973Z):**

> **[Cross-link, report says upgrade the AUDIT path to a quiz, not a DM]**
>
> Market intelligence report on Credibility & Media (id `mpj2jmo7-1jp1o1741d`) puts this carousel in a sharper light:
>
> - **Tactic 4:** 2-min interactive AI quiz beats PDF / static lead magnet on conversion.
> - **Funnel #3 (Pete Boyle / Growth Models)** is the canonical template: “Get a personalised growth report… takes 2 minutes, no login required.”
> - **Pattern 3:** single-page web apps have replaced PDFs as the default lead magnet across the niche.
> **Why it matters here:** swap DM “AUDIT” for a public 2-minute quiz URL that produces a personalised teardown. Same intent, much higher conversion + cleaner data capture.

**Jay (2026-05-24T01:03:38.691Z):**

> **[Cross-link, sibling teardown content series, different surface]**
>
> New item on this card (id `mpj2qdzm-m1r0f52`): newsletter teardown content series. Same Open / Judge / Rip / Fix mechanic as this carousel’s “send us the ad, we’ll tell you where the money leaked” CTA, applied to bad email instead of bad ads.
>
> **Why it matters here:** if the carousel proves the teardown-CTA pattern works for ads, the newsletter version is a near-zero-cost second surface to run it on. Format-portability validates the playbook itself.

---

### Strategic principle Jay’s locking in (P-8 / I-241)

**Strategic principle Jay’s locking in: test organic first. Don’t spend on paid until the message works without paid.** Applies both to PB’s own marketing AND to the message PB recommends to clients.

> “Test organic first! Don’t waste (Strategy) for US and our message to everyone.”

#### The principle, unpacked

- **Test organic first**, if it doesn’t move organically, paid won’t fix it. Paid amplifies signal; it doesn’t create it.
- **Don’t waste (strategy)**, the budget burn isn’t just dollars, it’s strategic clarity. Paid amplifying a weak message reinforces the wrong thing.
- **For US**, PB’s own marketing: posts before promoted posts, content before content ads.
- **Message to everyone**, PB tells clients the same: if the organic post didn’t land, don’t pay to boost it.

#### Resolutions this lands on earlier items

| Item it touches | What this principle says |
| --- | --- |
| **AI Agents, Meta ads test market + Meet-the-Team** (item `mpj4dtoh-131ltuvl`) | The $200–$500 Meta test is allowed only AFTER organic posts prove the message. Don’t lead with paid. |
| **Credibility & Media, PB-as-Jay-actually-wants-it** (item `mpj4ijyf-r1ku1530`), “Hit up my network, never advertise” | This principle is the softened version: *“test organically first.”* Compatible with the never-advertise instinct, advertising is allowed, but only as amplification of proven organic. |
| **Marketing & Lead-Gen Ideas, IG carousel (DM AUDIT)** (item `mpj1z4pv-119q1g113`) | Jay’s shorthand refinement, *“test your content organically first, if it gets traction spend on it’*, is now the standing PB principle. Fold into the carousel’s “Reason 01” (The ad had no job) on a v2 of the carousel. |
| **Marketing & Lead-Gen Ideas, LinkedIn content brief** (item `mpj4aa7t-13c1kl1r0`) | Confirms: the 2–5 organic LinkedIn posts run FIRST. Anything that lands gets considered for paid amplification later, never both at once. |
| **PB Services, DIY or DI2gether funnel** (item `mpj4t6kd-81lvl1lx`) | Aligns with the no-opt-in landing strategy, organic-first lives at the top of the funnel. |

#### Operational implications

- **Sequence:** draft → post organically → measure engagement → *only then* boost or run paid variants.
- **Threshold:** what counts as “proven organic”? Need a concrete metric (e.g., ≥ X impressions, ≥ Y engagement rate, ≥ Z saves) before paid is approved.
- **Client framing:** “If your organic post didn’t land, the ad won’t either.” Ship as a one-liner for sales conversations and the LinkedIn content brief.

#### Cross-card relevance

- **This card, positioning + pricing draft** (item `mpj3hmos-w9383z`) and **voice profile** (item `mpj40s1k-11t1kdb1c`), this principle joins the voice/strategy library.
- **Credibility & Media, market intel report** (item `mpj2jmo7-1jp1o1741d`), aligns with Tactic 6 (first deliverable without a brief) and the broader “sell taste / strategy” thesis, both bet on signal-before-spend.
**Next:** define the “proven organic” threshold (one metric, one number). Fold the principle into the IG carousel v2 Reason-01 fix-it block. Use as the standing answer when prospects ask “should I run ads?”

Comments:

**PlainBlack (2026-06-12T04:57:34.109Z):**

> [Triage P-19] Moved from P-19 Credibility & Media → P-8 Marketing & Lead-Gen Ideas during workspace re-sort.

---

### Blog idea archive (P-8 / I-272)

**Blog idea archive: “Why web developers promote themselves on your site” (and what PB does instead).**

#### The idea (verbatim)

> Why Web developers promote themselves on your site?
> 
> And what we do instead, - Add discount to build plan
> - Add contact form dropdown/link: *“Who made your awesome website?”* → notifies us, 10% credit/bonus eg for the website owner

#### The blog angle
Standard agency move: stick “Made by [Agency]” in the footer. Free ad on client’s site, no upside for the client. PB’s inversion: **the credit becomes a referral mechanic the client benefits from.**

#### The 10% credit mechanic

- PB adds a dropdown option on the client’s contact form: *“Who made your awesome website?”*
- Visitor picks that → PB gets notified.
- If PB lands the new lead as a build, the original client gets 10% credit / bonus.
- Client gets paid for being a portfolio piece. Standard agency move costs them nothing AND gets them paid.

#### Cross-card relevance (light)

- **Credibility & Media, PB watermark rule** (item `mpj57klk-4s21k1b2`), the icon-only / pulsing / accent-coloured watermark IS the standard PB footer. This blog explains the click-destination logic + the 10% credit pay-off the watermark unlocks.
- **Credibility & Media, “green dot is payment enough” positioning** (item `mpj3hmos-w9383z`), companion thinking; the 10% credit is the upgrade on top of the watermark-as-payment posture.
- **Marketing & Lead-Gen Ideas, LinkedIn content brief** (item `mpj4aa7t-13c1kl1r0`), slot as a candidate post.

---

### Blog idea archive (P-8 / I-277)

**Blog idea archive: Part 1 of an anti-system / pro-personal-cashflow / AI-enabled-escape series. Big PB-voice manifesto piece.**

#### The idea (verbatim, do NOT clean for tone)

> FML Life Sucks, war, AI, pandemics… USA is wild, and we’re all sucked in… the thing is, we’re Aussies and Kiwis. Fuck those cuunts.
> 
> Let’s look after each other, and our residents. Just governments doing deals for themselves, they’re not free-trading so they can ‘keep prices down at the groceries, or the pump’.
> 
> So you take your future into your own hands, and all of a sudden…
> 
> **This blog is for everyone who is capable and worthy of cashflow.** And is frustrated, exhausted, stressed, scared, depressed, traumatized.
> 
> You have Instagram just like influencers. They have new cars all the time, you have a monthly lease and an overdraft.
> 
> Not buy this program, coaching, human pyramid. What can YOU do from home, part time, from a computer, which gives you enough to ‘retire’. Stay at home a bit more with your laptop.
> 
> If you’re a builder, build. If you’re a mechanic, you do you. **Part 1, this is for the people at wit’s end.** You need to take $1000/wk profit asap. You’re fucked. Running out of time, running out of cash, going backwards. Fucking winter power bills again.
> 
> How unfortunately, due to rising industry costs… wtf. Bro. You ARE in a rising industry. I just work part time and my partner busts their ass. And YOU need to raise your prices?
> 
> **Shareholder BULLSHIT.** All need that money to make more money. **I just need to make money.**
> 
> So I built shit with AI, **if you have Imagination, (and patience) you can do anything.**

#### The keeper lines

- “This blog is for everyone who is capable and worthy of cashflow.” (Audience-definition opener.)
- “Not buy this program, coaching, human pyramid.” (Anti-guru.)
- “If you’re a builder, build. If you’re a mechanic, you do you.” (Respect the trade.)
- “All need that money to make more money. I just need to make money.” (Bone-deep PB voice.)
- “If you have Imagination, (and patience) you can do anything.” (Closer.)

#### Sensitivities, before this lands anywhere public

- **“Fuck those cuunts”** aimed at the USA, lands in NZ / AU contexts as “cunt” is term-of-endearment-or-rivalry, but Americans reading it will read it literally as hostile. Risk: alienates US prospects + makes the post unshareable in any cross-Pacific context. Could soften to “we’re Aussies and Kiwis, we look after our own” without losing the heart.
- **Anti-government tone** + **anti-shareholder tone**, PB-voice native, but actively political. Some prospects (esp. corporate / fleet-style clients) will read “this person is too combative.” Worth deciding which audience the post is for before deciding which version goes out.
- **“Part 1”** framing, implies a series. Worth committing to at least Part 2 + 3 (the “what to actually do” sequel) before publishing Part 1, so the rant has a destination.

#### Cross-card relevance (light)

- **Credibility & Media, voice profile** (item `mpj40s1k-11t1kdb1c`), rant + empathy + Sinek-Gary-Vee citations + irreverent aside. Textbook Jay-voice profile.
- **Jay Career, Starter manifesto** (item `mpj3ughu-01515141q18`) + **PB-as-Jay-actually-wants-it manifesto** (item `mpj4ijyf-r1ku1530`), sister manifesto-grade content.
- **Credibility & Media, “we did it ourselves” middle-man pivot** (item `mpj4fza6-kd1j1ip10`), aligned with the “just need to make money / built shit with AI” thesis.
- **PB Services, Branded System / DIY-or-DI2gether** (items `mpj5nrjy-u1r1e141ed` + `mpj4t6kd-81lvl1lx`), this rant funnels naturally to the DIY tier-1 free entry.

---

### Blog/social post archive (P-8 / I-279)

**Blog/social post archive: “I don’t need it” objection psychology. Ready-to-post social copy + a teaser for a 2-part blog series.**

#### The copy (verbatim, ship-ready)

> Has a customer ever said “I don’t need it” and you knew they absolutely did?
> 
> They’re not lying. They’re protecting a story. Maybe they got quoted too much once. Maybe they got burned. Maybe admitting they need it means admitting they should have bought it two years ago. Most of the time, “I don’t need it” is just a defence mechanism with a really good cover story.
> 
> Your job isn’t to argue them out of it. It’s to make the next step small enough that the story doesn’t have to defend itself. Low-risk. Specific. Obviously different from whatever burned them last time.
> 
> Full breakdown on the blog, Part 1 of 2. Link in bio.
> 
> #SmallBusiness #Marketing #Sales #CustomerPsychology #PlainBlack

#### The keeper insight

> “They’re not lying. They’re protecting a story.”
*Whole post is built around this reframe. Empathy + accuracy, classic PB voice.*

#### Note on existing blog
The PB site already has a published post titled *“When customer says don’t need it, they do”* at `/blog/when-customer-says-dont-need-it-they-do` (seen in the sitemap during the OG audit). This social copy could be:

- (a) the social-promo teaser for that existing post,
- (b) a refreshed version of it,
- (c) the Part 1 of a new 2-part series (this post promises Part 1 of 2, existing blog might already BE Part 1, or this is fresh).
**Worth a 30-second check on the published post before re-publishing.**

#### Cross-card relevance (light)

- **Credibility & Media, voice profile** (item `mpj40s1k-11t1kdb1c`), textbook Jay-voice: rant + empathy.
- **Marketing & Lead-Gen Ideas, LinkedIn content brief** (item `mpj4aa7t-13c1kl1r0`), candidate post.
- **PB Services, First-Fix / Spitball** (item `mpj2cw45-1r618u1p18`), “make the next step small enough that the story doesn’t have to defend itself” is literally the First-Fix mechanic.

---

### We build campaign - doc attached (P-8 / I-668)

We build campaign - doc attached

[from doc]
WE BUILD. YOU GROW.

Built for small businesses that are good at the work, but tired of being invisible.

The campaign should be built around one core belief:

Small business owners do not need more marketing noise.They need the right thing built properly, handed over clearly, and made useful enough to keep working without dependency.

That fits PlainBlack’s actual ethos: no lock-ins, no mystery, practical creative work, and giving owners control rather than trapping them in agency dependence. 

Strategic foundation

The big Schwartz lesson here is simple: don’t try to create desire from nothing. Channel what already exists. Your market already wants clarity, control, leads, credibility, less wasted time, and less dependency. The campaign needs to focus that existing desire onto PlainBlack’s mechanism: we build the useful thing that lets you move again. Schwartz’s framework is very clear that advertising works by directing existing hopes, fears, and desires toward the product, not inventing them out of thin air. 

The Sinek-shaped bit is the belief system: small businesses deserve power back in their hands.

The Ogilvy-shaped bit is clarity and proof: say what you do, make the benefit obvious, show the mechanism, avoid cleverness that hides the sale.

The Todd Sampson-shaped bit is behavioural friction: owners are overloaded, decision-fatigued, risk-aware, and stuck. So the campaign must make the next decision feel safe and obvious.

The Vaynerchuk-shaped bit is distribution: don’t make one big precious campaign asset and wait for applause like a Victorian poet with a LinkedIn account. Make the idea native to each platform, repeat it in different shapes, and document the builds.

The enemy

Every good campaign needs an enemy.

Not competitors by name. Not “other agencies.” Too obvious. Too needy.

The enemy is:

Marketing that keeps small business owners stuck.

That includes:

Agency fog.DIY overwhelm.Course graveyards.Generic AI sludge.Pretty websites that do nothing.Retainers with no clear handover.Advice that sounds smart but gives no first move.

This matches the ICP beautifully: the PlainBlack buyer has often been burned by agencies, overwhelmed by courses, frustrated by DIY, and now wants a practical way to get results without wasting time, money, or control. 

Core campaign message

The tight version:

You run the business.We build the bits that help it grow.

The sharper PlainBlack version:

You do not need another marketing lecture.You need the right thing built properly.

The commercial version:

Brand, website, campaign, content system, or playbook.We build the useful thing.You use it to grow.

The anti-agency version:

No handcuffs. No fog machine. No mystery retainer.We build it so you can actually use it.

Campaign pillars

1. Build the thing that fixes the stuck point

This is the diagnostic pillar.

Most owners don’t know whether they need a better website, clearer offer, stronger brand, better content, better proof, or just a decent campaign. So we make the first move obvious.

Key line:Stop guessing what to fix first.

This naturally leads to the Build Map.

2. Build once, use properly

This is the independence pillar.

PlainBlack should not sound like “hire us forever.” The point is that a good build gives the owner more capability, not more dependence.

Key line:Built to work without us hovering over it like a weird little marketing ghost.

This connects directly to PlainBlack’s value of putting power in the client’s hands. 

3. Build for reality, not theory

This is the small-business-life pillar.

The campaign should constantly show that PlainBlack understands the owner’s actual world: late admin, quiet lead patches, bad-fit enquiries, Facebook group chaos, quote requests, competitors getting visible, the website embarrassment, the “I know I should post but I’m cooked” feeling.

Key line:Built for the owner who has work at 7am and marketing guilt at 9pm.

This is where the campaign becomes human.

4. Build the useful bits, not the theatre

This is the anti-fluff pillar.

A brand should help people remember you.A website should explain the offer.A campaign should give people a reason to care.A playbook should tell you what to do next.

Key line:If it does not help the business move, it is decoration wearing a lanyard.

The campaign mechanism: The Build Map

This is the conversion tool.

Do not just run “We Build. You Grow.” into “book a call.” That is too abrupt. People need a low-pressure first step, especially given your ICP’s distrust of agencies and retainers. 

Create:

The Build Map

A simple PlainBlack diagnostic that tells you what your business needs built first.

Not a score.Not a fake “audit.”Not a lead magnet that says “you scored 72%” like a haunted BuzzFeed quiz.

A useful verdict.

Possible verdicts:

Build the Offer

People do not understand what you sell, who it is for, or why it matters.

Build the Website

The business is credible, but the page is leaking trust, clarity, or enquiries.

Build the Brand

You are better than you look. Dangerous place to be.

Build the Campaign

You need a reason for people to pay attention now.

Build the Proof

People need stronger evidence before they trust you.

Build the System

You have ideas, but no repeatable way to keep showing up.

Build the Playbook

You want control, not a monthly invoice with interpretive dance metrics.

This fits the PlainBlack addendum well: it creates a memorable artefact people can keep, screenshot, share, print, or send to a partner. 

Offer ladder inside the campaign

The campaign should quietly map to existing PlainBlack services.

Customer state

Campaign message

Offer

“I don’t know what’s broken.”

Stop guessing what to fix first.

Build Map

“I want to do it myself.”

We’ll show you what to build.

AI Playbooks

“My name/brand is weak.”

Build something people remember.

Name & Frame

“I need the whole thing sorted.”

Brand, website, message, roadmap. Built properly.

Brand Sprint

“I need ongoing ideas.”

Keep the marketing brain switched on.

Idea Engine

That keeps the campaign commercially grounded instead of just sounding nice.

Master message hierarchy

Campaign headline

We Build. You Grow.

Subhead options

Brand, website, campaign, content system, or playbook. We build the useful thing so you can get back to growing the business.

For small businesses that are good at the work, but tired of being invisible.

No mystery. No lock-in. No agency fog machine. Just the right thing built properly.

Short proof line

Built to hand over. Built to use. Built to move the business.

CTA

Run the Build Map.orFind what needs building first.

Rollout structure

I’d run this in three phases.

Phase 1: Plant the flag

Goal: make the belief clear.

Duration: 1 week.

Content themes:

Post 1: ManifestoIntroduce “We Build. You Grow.”

Post 2: The owner realitySmall business owners are drowning in advice, not short on effort.

Post 3: The enemyAgency fog, DIY overwhelm, course graveyards, AI sludge.

Post 4: The PlainBlack differenceWe build things owners can actually use.

Post 5: Soft CTANot sure what needs building first? Build Map coming.

Example flag post

We Build. You Grow.

That is probably the cleanest way to explain PlainBlack.

Most small business owners are not short on advice.

They have been told to post more, fix their SEO, make reels, build a brand, use AI, start email marketing, optimise their funnel, and probably sacrifice a printer cartridge under a full moon for the algorithm.

Helpful.

What they usually need is much simpler.

The right thing built properly.

A website that explains the offer.A brand people remember.A campaign people notice.A playbook that shows what to do first.A content system that does not require becoming a LinkedIn goblin.

That is our lane.

We build the useful bit.You grow the business.

No mystery.No lock-in.No agency fog machine hissing quietly in the corner.

Start with the thing that actually needs fixing.

Phase 2: Show the builds

Goal: prove the mechanism.

Duration: 2 weeks.

This should be the engine of the campaign.

Use a recurring post format:

We Built: [thing]

The stuck point:The build:The growth unlock:Owner now can:

Examples:

Website build

We Built: A clearer website

The stuck point: people were landing, looking around, and leaving because the offer was too vague.

The build: sharper homepage, clearer service structure, proof in the right places, obvious next step.

The growth unlock: less explaining, better enquiries, more trust before the call.

Owner now can: send people to the site without apologising for it first.

Brand build

We Built: A brand people could remember

The stuck point: the business was good, but looked like every other operator in the category.

The build: positioning, visual system, language, website direction.

The growth unlock: credibility caught up with capability.

Owner now can: show up consistently without reinventing the business every time they post.

Playbook build

We Built: A DIY marketing playbook

The stuck point: the owner wanted control, not another monthly invoice.

The build: step-by-step actions, prompts, checklists, free tools, practical sequence.

The growth unlock: marketing became something they could actually do in 1–2 hours a week.

Owner now can: stop staring at a blank content box like it owes them money.

Phase 3: Launch the Build Map

Goal: convert attention into action.

Duration: 1 week initial push, then evergreen.

Launch it as:

The Build Map

Find what your business needs built first.

Copy angle:

You might not need a new logo.You might not need ads.You might not need to post more.You might need a clearer offer, better proof, a cleaner website, or a campaign people can actually notice.

The Build Map gives you a plain-language verdict.

No fake score.No corporate waffle.No “book a call to unlock your results” nonsense.

Just the useful bit, circled.

CTA: Run the Build Map.

Content formats by platform

Facebook

Use more founder voice and local small-business reality.

Best formats:

Founder rants.Client build stories.Before/after explanations.Build Map invitation.Occasional memes or rough notes.

Tone can be more conversational and blunt.

LinkedIn

Use more strategic interpretation.

Best formats:

Founder POV.Market problem breakdowns.Agency model critique.Build philosophy.Case-style “what we built and why” posts.

This is where people who know the underlying theory will recognise the bones.

Instagram

Use visual proof and punchy concepts.

Best formats:

Carousel: “5 signs you’re building the wrong thing.”Reels: “What we’d build first for this business.”Static tiles: “We Build. You Grow.”Behind-the-scenes desks, mockups, notebook shots.

Website

Create a campaign landing page.

Structure:

Hero: We Build. You Grow. 

Problem: owners are overwhelmed, invisible, and unsure what to fix first. 

Mechanism: PlainBlack builds the thing that removes the stuck point. 

Build categories. 

Build Map CTA. 

Service pathways. 

Proof / examples. 

Low-pressure call CTA. 

Visual system

The visual direction should feel like small-business repair bench meets dark strategy room.

Use:

Dark cinematic desk.Notebook sketches.Website wireframes.Sticky notes.Quote sheets.Coffee rings.Mint-green circles around the useful bit.A half-built brand system.A laptop showing a local business page.PlainBlack logomark as a subtle signal.

Avoid:

Corporate “growth” arrows.Generic laptop hands.Smiling agency people around a boardroom table.AI robot nonsense.Purple gradient SaaS soup.Anything that looks like a Canva template had a baby with a webinar funnel.

This aligns with PlainBlack’s visual rules: dark cinematic strategy, practical intelligence, small-business grit, and mint-green clarity as the signal. 

Campaign assets to create

You need:

Landing page: /we-build-you-grow or /build-map 

Build Map diagnostic 

Hero image set 

10–15 social tiles 

5 founder posts 

5 build breakdown posts 

1 pinned Facebook post 

1 pinned LinkedIn post 

Email to existing contacts 

Google Business Profile post 

Short reel scripts 

Website homepage strip 

CTA buttons across services: “Find what needs building first” 

The campaign’s “famous lines”

These are the lines I’d keep repeating until people are sick of them. Then repeat them a bit more, because that is roughly when they start working.

We Build. You Grow.

Stop guessing what to fix first.

The useful bit, circled.

Built to hand over. Built to use.

Good businesses should not stay invisible because marketing got weird.

You are not bad at business. You are probably trying to make marketing decisions with half the information missing.

Marketing should make sense before it costs more money.

We build the thing that gets you unstuck.

Suggested 4-week rollout calendar

Week 1: Flag

Monday: Manifesto postTuesday: Visual tile, We Build. You Grow.Wednesday: Founder post, owners drowning in adviceThursday: Reel, “You might not need ads first”Friday: Build Map teaser

Week 2: Diagnosis

Monday: “Stop guessing what to fix first”Tuesday: Carousel, 6 things your business might need builtWednesday: Founder rant, courses, retainers, and AI sludgeThursday: Build Map waitlist/soft launchFriday: Example verdict post, Build the Website

Week 3: Proof

Monday: We Built: WebsiteTuesday: We Built: BrandWednesday: We Built: CampaignThursday: We Built: PlaybookFriday: Behind-the-scenes build desk / Jay chaos content

Week 4: Conversion

Monday: Build Map liveTuesday: Post explaining verdictsWednesday: Case-style postThursday: FAQ postFriday: Direct CTA, “Run the Build Map”

The straight truth

This campaign should not try to make PlainBlack look bigger than it is.

That would be a mistake.

The strength is the opposite: two sharp operators building useful things without the agency pantomime.

The more human, practical, and artifact-driven this campaign feels, the better it will work.

The whole thing should feel like:

“We looked at your business, found the stuck point, built the useful thing, and handed it back without turning the process into a religious ceremony.”

That is PlainBlack.

That is recognisable strategy without cosplay.

And it gives you a proper campaign platform, not just a nice sentence wearing business shoes.

Comments:

**PlainBlack (2026-06-12T04:20:32.241Z):**

> [Moved P-12 PB Services -> P-8 Marketing & Lead-Gen Ideas, 2026-06-12] This is a self-marketing campaign ('We Build. You Grow.') built around the Build Map diagnostic and an offer ladder, so it belongs with marketing/lead-gen, not the product catalogue. Doc still attached.

Attachments:

```
WE BUILD. YOU GROW.

Built for small businesses that are good at the work, but tired of being invisible.

The campaign should be built around one core belief:

Small business owners do not need more marketing noise.They need the right thing built properly, handed over clearly, and made useful enough to keep working without dependency.

That fits PlainBlack’s actual ethos: no lock-ins, no mystery, practical creative work, and giving owners control rather than trapping them in agency dependence. 

Strategic foundation

The big Schwartz lesson here is simple: don’t try to create desire from nothing. Channel what already exists. Your market already wants clarity, control, leads, credibility, less wasted time, and less dependency. The campaign needs to focus that existing desire onto PlainBlack’s mechanism: we build the useful thing that lets you move again. Schwartz’s framework is very clear that advertising works by directing existing hopes, fears, and desires toward the product, not inventing them out of thin air. 

The Sinek-shaped bit is the belief system: small businesses deserve power back in their hands.

The Ogilvy-shaped bit is clarity and proof: say what you do, make the benefit obvious, show the mechanism, avoid cleverness that hides the sale.

The Todd Sampson-shaped bit is behavioural friction: owners are overloaded, decision-fatigued, risk-aware, and stuck. So the campaign must make the next decision feel safe and obvious.

The Vaynerchuk-shaped bit is distribution: don’t make one big precious campaign asset and wait for applause like a Victorian poet with a LinkedIn account. Make the idea native to each platform, repeat it in different shapes, and document the builds.

The enemy

Every good campaign needs an enemy.

Not competitors by name. Not “other agencies.” Too obvious. Too needy.

The enemy is:

Marketing that keeps small business owners stuck.

That includes:

Agency fog.DIY overwhelm.Course graveyards.Generic AI sludge.Pretty websites that do nothing.Retainers with no clear handover.Advice that sounds smart but gives no first move.

This matches the ICP beautifully: the PlainBlack buyer has often been burned by agencies, overwhelmed by courses, frustrated by DIY, and now wants a practical way to get results without wasting time, money, or control. 

Core campaign message

The tight version:

You run the business.We build the bits that help it grow.

The sharper PlainBlack version:

You do not need another marketing lecture.You need the right thing built properly.

The commercial version:

Brand, website, campaign, content system, or playbook.We build the useful thing.You use it to grow.

The anti-agency version:

No handcuffs. No fog machine. No mystery retainer.We build it so you can actually use it.

Campaign pillars

1. Build the thing that fixes the stuck point

This is the diagnostic pillar.

Most owners don’t know whether they need a better website, clearer offer, stronger brand, better content, better proof, or just a de
```

---

### Positioning thread + a productisation mechanic (P-12 / I-234)

**Positioning thread + a productisation mechanic: PB built the AI that ate PB’s own services. The honest acknowledgement IS the content angle. The pivot is becoming the “middle-man AI tools” for small businesses and side-hustles, distributing Pro-plan generations through PB-branded GPTs.**

#### Verbatim brain-dump

> **PlainBlack challenges with AI**
> 
> Bloody hell, we did it ourselves ffs.
> 
> Guess we’re not charging $900 for a logo anymore.
> “$5k for a website anymore.”
> 
> Cancel Xero. Fire Your Accountant.
> 
> Affiliate.
> 
> **EASY TARGET:** Small Business. Side Hustles. Middle Man AI tools, we’ll help you with your generations.
> 
> Use Plain Black GPTs for Free and we provide Pro plan generations.
> 
> Content: Services we have lost the market for. Dropping like flies, AI.

#### The keeper lines (ship-ready)

- **“Bloody hell, we did it ourselves ffs.”**, honest opener, defangs any defensive prospect reaction.
- **“Dropping like flies, AI.”**, punchy series name (or post tagline).
- **“Cancel Xero. Fire Your Accountant.”**, provocative pair of headlines.
- **“Middle-man AI tools.”**, positioning crystal for the pivot.

#### Services PB has lost the market for (the “dropping like flies” list)

| Old offer | What killed it | PB’s new role |
| --- | --- | --- |
| **$900 logo** | Midjourney / DALL-E / Ideogram | Brand guidance + curation, not pixels. |
| **$5K website** | Lovable / Bolt / Cursor / Webflow templates | Strategy + integration, not page-build labour. |
| **Xero subscription / accounting setup** | Custom GPT + spreadsheet for ~$500 per the LinkedIn brief | Help build the DIY-Xero alternative; not resell Xero. |
| **Bookkeeper / junior accountant** | AI categorisation + receipt OCR | Set up the workflow, hand over the IP. |

#### The new model: middle-man AI tools
Jay’s instinct: PB sits between the AI tools (ChatGPT Pro / Claude Pro / Gemini Pro / Midjourney etc.) and small-business + side-hustle audiences who don’t want a $20/mo subscription per tool.

| Mechanic | What it actually does |
| --- | --- |
| **Use PB GPTs for free** | PB-branded custom GPTs available without sign-up. |
| **PB provides the Pro-plan generations** | PB’s paid ChatGPT / Claude subscription does the actual work behind the GPT, user gets a Pro-tier result on a free interaction. |
| **The trade** | User gets generations they couldn’t afford a sub for; PB gets brand exposure, watermark / green-dot attribution, lead capture, upsell to retainer / Playbook / agent service. |

#### Open decisions / loose ends

- **Pro-plan ToS**, OpenAI / Anthropic ToS usually restricts proxying paid API access to third parties without commercial terms. Worth pinning the legal box before the “free generations” mechanic ships publicly.
- **Cost ceiling**, how much does PB eat in API tokens to give free generations away? Caps + rate limits + green-dot attribution requirement compress the burn.
- **Lead-capture trade**, what does the user give PB in exchange for the free generations? Email, social follow, optional newsletter signup? Don’t over-ask but capture something.
- **Naming**, if Meet-the-Team (item `mpj4dtoh-131ltuvl`) ships, the free GPTs are PB-team-branded: “Talk to Aimee, she does social.” Joins the joke instead of being a separate brand.
- **“Affiliate”**, Jay’s one-word note. AI-tool affiliate referrals (Claude / ChatGPT / Lovable / Notion AI)? Domain reseller affiliate? Worth clarifying which.
- **Cannibalisation**, if PB gives generations away free, what stops a side-hustler from churning out logos / sites / copy without ever buying a PB service? Probably: PB’s offer becomes “use the tool free, or pay us to actually configure your business around it,” i.e. the retainer / Playbook upsell.
- **Voice**, “Bloody hell we did it ourselves” is funny and self-aware but only lands once. The series can’t mope; needs to pivot to “here’s what comes next.”

#### Cross-card relevance

- **Marketing & Lead-Gen Ideas, LinkedIn content brief** (item `mpj4aa7t-13c1kl1r0`), “Cancel Xero / Fire Your Accountant” lands the accounting post directly. “Services we have lost the market for / Dropping like flies, AI” is a recurring series candidate.
- **MAIA, Custom GPT blog** (item `mpj29nry-81l1p381h`), free PB GPTs + Pro-plan generations is a concrete way to ship the Custom GPT productisation as a free-tier marketing channel.
- **AI Agents, Meet the Team** (item `mpj4dtoh-131ltuvl`), the team becomes the public-facing free-GPT roster. Aimee / Aidan / Aisling are the things people talk to.
- **PB Services, No-Brainer Retainer** (item `mpj47ys3-171ghr1b18`), same SMB / side-hustle audience. Free GPTs → retainer is the upgrade ladder.
- **Credibility & Media, market intel report** (item `mpj2jmo7-1jp1o1741d`), Greg Isenberg quote (“agency model is dead… survivors sell taste, strategy, skills”) is the philosophical bedrock for this whole pivot. PB is acknowledging it earlier than peers.
- **Credibility & Media, voice profile** (item `mpj40s1k-11t1kdb1c`), “Bloody hell, we did it ourselves” is the rant + self-deprecating combo Jay’s voice profile literally describes.
**Next:** ship the “Bloody hell, we did it ourselves” LinkedIn post as the lead-in to the “Dropping like flies, AI” series. Pin the Pro-plan ToS / cost question before announcing the free-generation mechanic publicly. Wire the free GPT roster to the Meet-The-Team naming if it ships.

Comments:

**PlainBlack:**

> [Triage P-19] Moved from P-19 Credibility & Media → P-12 PB Services during workspace re-sort (positioning/pricing belongs with the services strategy).

---

### Sales-conversation positioning + pricing draft (P-12 / I-222)

**Sales-conversation positioning + pricing draft, Jay’s thinking-out-loud on how to introduce himself to a prospect, how to talk about commitment / budget, and where the “green dot” (PB watermark) does the work of payment for free engagements.**

#### The verbatim brain-dump

> **How much do you care/think you need:**
> 
> I Do AI & bespoke marketing, but I’m helping locals help other locals.
> 
> Nice guy, tech nerd so SEO etc is great, but not strong in some areas I can help with.
> 
> Hi I’m Jayden, I sold The Cave to help others, I’m working with advertisings, providers etc and focusing on helping businesses and Brands w/SEO, AIO, AI Tools, Social Media.
> 
> **How much?**
> AI Functions, $x p/m, Usage based. Set a budget.
> 
> Subscription coming one day, you get everything awesome I learn as I go.
> 
> Otherwise, what you see is what you get free.
> 
> Forms, DNS, Google etc, $0–...?
> 
> Honestly if you don’t want to spend anything, I’ll make it work too.
> 
> The ‘green dot’ is payment enough (PB watermark).

#### The sharp ideas worth keeping

| Idea | What it’s actually doing |
| --- | --- |
| **“I’m helping locals help other locals.”** | Positioning anchor. Tight, NZ-grounded, sidesteps both “agency” and “influencer” framings. Worth carving in stone. |
| **“Sold The Cave to help others.”** | Origin-story line, gives Jay credibility (built & exited a business) + permission to position as a helper now. Strong if true and current. |
| **“How much do you care / think you need?”** | Conversation-opener with a prospect: the budget falls out of the answer, not the other way around. Inverts the usual price-list pitch. |
| **Usage-based AI functions, set a budget.** | Honest framing: AI cost is variable; let the client cap it. Lowers commitment friction. |
| **“Subscription coming one day”** | Forward-promise hook for the eventual Playbook-on-subscription tier, pre-frames it for prospects today. |
| **“What you see is what you get free.”** | De-risks the initial engagement. No invoices for things you didn’t agree to. |
| **“The green dot is payment enough.”** | *This is the keeper.* PB watermark on the deliverable = the price for free work. Builds attribution + portfolio while costing the client nothing. |

#### The service mix Jay names

- SEO
- AIO (AI Optimisation, sister of AEO; check if Jay means AEO or a distinct concept)
- AI Tools
- Social Media

#### Sales-conversation flow this implies

1. **Open** with “how much do you care / think you need?”, let the prospect self-rank commitment.
2. **Intro**: “Hi, I’m Jayden. I sold The Cave to help others. Now I work with advertisers, providers, etc., on SEO, AIO, AI tools, social media, basically helping locals help other locals.”
3. **Price floor**: zero. “If you don’t want to spend anything, I’ll make it work too, the green dot is payment enough.”
4. **Variable layer**: AI functions usage-based, with a budget cap the client sets.
5. **Future hook**: subscription coming, you get everything PB learns as it ships.

#### Open questions / loose ends

- **“I sold The Cave”**, this contradicts the existing **The Cave** card (id `mpj0qndz-x1a1h1k1r1m`) which is tagged `prospect`. Three possible reads:Jay genuinely sold a business called The Cave previously; the existing card is for re-engagement with whoever owns it now.
- The line is a positioning hook rather than a literal claim, needs softening.
- The Cave card’s tag is wrong / stale.
- **AIO vs AEO**, is “AIO” AI Optimisation (a distinct concept), or a typo / nickname for AEO (Answer Engine Optimisation, item `mpj1lfs0-m2mg1le`)? Pick one and use it consistently.
- **“Nice guy, tech nerd”** framing, useful self-aware honesty, or under-selling? PB voice is usually more direct than “nice guy.” Possibly a typo for self-deprecating-but-true.
- **Free-tier risk**, “I’ll make it work for $0” trains some prospects to never pay. Worth pairing with a clear ceiling (“happy to do X for free as long as the green dot stays”).
- **Green-dot mechanic**, what does it actually look like on a deliverable? Logo + URL? Specific PB branding spec? Worth nailing down so it’s defensible if a client wants it removed.
- **“Working with advertisings, providers etc”**, the “etc.” here probably wants concrete examples to land. Who specifically?

#### Cross-card relevance

- **The Cave** (card `mpj0qndz-x1a1h1k1r1m`), needs reconciling with the “I sold The Cave” line.
- **PB Services, AI Playbooks pricing** (item `mpj1jg6p-1b13l1jk3`), the “subscription coming one day” promise hooks into whichever Playbooks fork wins. Worth aligning the sales script with the pricing decision.
- **PB Services, First-Fix / Spitball** (item `mpj2cw45-1r618u1p18`), the $200 paid diagnostic is the formal alternative to the “how much do you care?” opener. Both are entry-conversation devices, one paid, one free.
- **Credibility & Media, AEO** (item `mpj1lfs0-m2mg1le`), resolve AIO vs AEO so the service mix is internally consistent.
- **Credibility & Media, market intel report** (item `mpj2jmo7-1jp1o1741d`), Tactic 5 (publish the price floor publicly, tiny) aligns with the “$0 if you want” floor. The green-dot mechanic is the unique PB twist.
- **Jay Career** (card), the self-intro / origin-story phrasing belongs in Jay’s personal narrative toolkit too.
**Next:** reconcile the “sold The Cave” line against the existing card before any version of this intro goes public. Decide AIO vs AEO. Then sharpen the keeper lines (“helping locals help other locals” + “green dot is payment enough”) into copy that can land on the PB site / About page / outbound intros.

Comments:

**Jay:**

> **[Triage answers, 24 May 2026]**
>
> *Positioning draft*
>
> 1. **"I sold The Cave", which read is right?** → Sold genuinely; The Cave card is re-engagement
> 2. **AIO vs AEO?** → Typo / nickname for AEO, use AEO consistently
> 3. **"Nice guy, tech nerd" framing?** → Skip / unsure
> 4. **Free-tier "$0" risk, paid floor needed?** → Yes, add a paid floor

**PlainBlack:**

> [Triage P-19] Moved from P-19 Credibility & Media → P-12 PB Services during workspace re-sort (positioning/pricing belongs with the services strategy).

---

### Reference (P-12 / I-168)

**Reference: PlainBlack previous relaunch plan**, saved for the bits that overlay current strategy. Filed as historical context, not a current directive.

The plan predates the current PB ecosystem (Hub, Inbox, MAIA, PapaMassive, Niche Audits, BLST, AI Music, etc.) and is mostly superseded. Three things in it are still useful:

1. **Service tier names**, "Start Strong / Build Bold / Own It", punchy, clear progression. Worth grafting onto current Websites v2 + Ideation Workshops naming.
2. **The launch playbook**, pre-launch / launch-week / post-launch-momentum checklist. Templatable for any PB product launch, including the 30 Day Build Challenge content commitment.
3. **Brand voice + taglines**, startup-first tone, Aussie/Kiwi charm. Pairs with the existing PB voice family.

---

**Old service tiers (worth lifting forward)**

| Tier | Inclusion |
| --- | --- |
| Start Strong | Logo, basic style guide, email signature |
| Build Bold | Start Strong + website + domain / email help |
| Own It | Build Bold + custom illustrations, copywriting, extra pages |

These names mostly map to current Websites v2 / Brand Sprint work but with sharper personality. Recommend lifting the NAMES at minimum; the inclusions may need updating to current AI-tooled reality.

**Old homepage copy (still usable as a framework)**

Hero: *"Big Ideas Start Simple. We Make Sure They Look Good Doing It."*

Sub: *"Branding, logo design, and websites for startups and small businesses across Australia, New Zealand, and wherever good ideas live."*

Section: *"You have got the spark. We will give it a brand."*

Closer: *"You bring the dream, we will bring the black t-shirt."*

All four lines pass the website Repo System Prompt voice check (direct, human, honest, slightly rebellious, plainspoken). Candidates for the current PB homepage refresh.

**Old launch playbook (templatable for any PB launch)**

- **Pre-launch (2–3 weeks out):** finalise tiers + pricing · refresh case studies (3–6) · booking system live · lead magnet PDF · soft-launch email to past clients · 3–5 launch blog posts · welcome email sequence · launch graphics + story video · 5 launch-week social posts · test forms/links/mobile · install GA + meta descriptions · email system live
- **Launch week (Day 1–7):** site live · announcement email Day 1 · follow-up Day 3–4 · 7-day limited bonus offer · launch day post · carousel/reel of new services · testimonial graphics · BTS "how we built our own brand" · workshop teaser
- **Post-launch momentum (Week 2–6):** 2–3x/wk posts · weekly blog or LinkedIn article · client FAQs added · DM 5–10 past clients for referrals · contact startup coaches / accountants for referral-partner pitch · 3–5 coworking spaces for workshop slots · optional FB/IG/LinkedIn/Google ads to lead magnet

Reuse this checklist as the launch SOP for: Websites v2 No Brainer Retainer · PapaMassive · AI Music for NZ Retailers · MAIA AI Proficiencies · Online Footprint Glow-Up · AI Hiring & Onboarding System · etc. Cross-link to 30 Day Build Challenge content commitment for the daily content cadence.

**Old email teasers preserved verbatim as comments below**, voice references for future launches.

**Cross-card relevance**

- **Websites v2 No Brainer Retainer** (this card), could relabel its tiers using Start Strong / Build Bold / Own It
- **Ideation Workshops** (this card, NameStorm / Brand Jam / Idea Intervention), old plan also had "Brand Strategy Workshops" as a service line. Naming + structure already evolved.
- **Tagline batch** (this card), comment added with the old taglines
- **30 Day Build Challenge content commitment** (sec-clients), old launch checklist is the operational template for the 30 days
- **Content engine batch + Tentacles** (Marketing & Lead-Gen Ideas), old email teasers as voice references
- **Repo System Prompt** (sec-external tile), old plan tone passes the system-prompt voice check; safe to lift

**Next:** nothing urgent, reference material. When the next PB launch (any of: Websites v2 / PapaMassive / Glow-Up / MAIA Proficiencies) is being scoped, pull the launch checklist from this item as the starting point.

Comments:

**Jay:**

> **[Old launch teaser email 1, verbatim]**
>
> > Subject: We have had a glow-up (but still wear black)
> > 
> > Hey [First Name],
> > 
> > Big news from Plain Black HQ. We have been quietly working behind the scenes on something new, a total brand refresh and a bold new direction.
> > 
> > Same cheeky attitude. Same obsession with great design. But now? We are all in on helping startups and small businesses look as good as they dream they are.
> > 
> > New packages. New workshops. New website. All designed to take you from "Is this a thing?" to "Hell yeah it is a brand."
> > 
> > We are going live in [X days]. Keep your eyes peeled, and your inbox open.
> > 
> > Cheers, [Your Name] · Plain Black Creative · Branding for Bold Ideas

**Jay:**

> **[Old launch teaser email 2, verbatim]**
>
> > Subject: This one is for the underdogs with big ideas
> > 
> > Launching a business is chaos. Branding it? Should not be.
> > 
> > We have built new packages for startups and small biz legends who are ready to get noticed, and not look like they DIY-ed it with Canva and panic.
> > 
> > Here is a sneak peek of what is coming:
> > 
> > - Logo & identity packages (simple to stunning)
> > - Websites built with strategy baked in
> > - Brand naming & workshops that actually help you figure it out
> > - Support that feels human, not corporate
> > 
> > We are launching in a few days. Hit reply if you want early access. We might even throw in a little bonus for ya.

**Jay:**

> **[Old launch social posts, verbatim]**
>
> > **POST 1, Carousel: "The Black is Back (And Bolder Than Ever)"**
> > 
> > Slide 1: We have had a makeover (but do not worry, we still wear black)
> > 
> > Slide 2: New site · New startup-friendly packages · New workshops for brands that have not even got a name yet
> > 
> > Slide 3: We are now officially focused on helping startups and small businesses build brands that feel like them, not a boring template.
> > 
> > Slide 4: Launching [DATE]. Want early access? Hit the link in bio.
>
> > **POST 2, Static / Reel caption**
> > 
> > We have rebranded the branding studio. Because if we are gonna help startups look good, we figured we should look the part too.
> > 
> > Launching soon: Tiered branding packages for new businesses · Squarespace websites that do not look DIY · Brand workshops for the "we have got an idea but no name yet" crowd.
> > 
> > The black is back, and it is bold, strategic, and full of sass. Launching [DATE]. #branding #australianstartups #webdesign #brandlaunch #plainblackcreative
>
> > **POST 3, Reel idea**
> > 
> > Visual: fast-cut shots of workspace, scribbled notes, typing, website mockups, coffee, zoom-in on logo sketches.
> > 
> > Text on screen: "Startup idea → Real brand. This is what we do now." Final frame: "Plain Black Creative, Launching Soon" + website URL.

---

### Tagline / brand-voice candidates + SEO content experiments + brand-signature mark (P-12 / I-146)

**Tagline / brand-voice candidates + SEO content experiments + brand-signature mark, all the positioning fragments from this brain dump grouped together.**

**Tagline / headline candidates**

- **"AI hype > Real Value"**, counter-positioning vs vapourware AI agencies
- **"AI, Toys, Tactics, Shortcuts, Independence, and No BS"**, about-page voice, long-form
- **"Find answers, not opinions #fuckgoogle"**, AI-search positioning, sharp
- **"Make Better Slop"**, funny + honest about the AI-content reality

All sit alongside the existing PB voice "Just good cunts, plain black" + "If you have heard of it, you can have it" (Jay Career card). Run them through the design self-check from the website Repo System Prompt before any go live.

**SEO content experiments (paired, run together)**

- **"Experiment, How We Ranked No 1 on Google for the word 'Cunt'"**, a real SEO write-up. Educational + on-brand + searchable. Almost certainly does rank because the competition for that exact query is minimal.
- **"Piss-take SEO landing page"**, companion piece. A page that is ALL keyword-stuffed SEO copy, completely unreadable to humans, deliberately designed to crawl for organic traffic. The point is to show what Google rewards vs what humans need. Could be a teaching exhibit on the PB blog or a Plain-Black-website easter egg.

Both pieces are content + provocation simultaneously. They demonstrate Jay AI proficiency + sit dead-centre on PB voice.

**Brand signature mark, the "green dot"**

> "green dot, subtle fibonacci + glow, THAT is our 'made by PlainBlack'"

A small subtle green dot (likely at #00c853 per the website Repo System Prompt) placed using Fibonacci spacing on every PB-built page, with a soft glow. Discoverable easter egg that signs every output as "made by PB". Matches the Repo System Prompt direction: *"monogram details as discoverable easter eggs."*

**Cross-card relevance**

- **PB voice / "good cunts" item** (this card), same voice family
- **Jay Career AI proficiency item**, "If you have heard of it, you can have it" is the related personal headline
- **Niche audit templates** (this card), the SEO experiments could BE niche audit demos for clients ("here is what your competitor site looks like to Google vs you")
- **Website Repo System Prompt** (sec-external tile), green dot fits the easter-egg monogram philosophy already documented

**Next:** ship the Fibonacci green-dot snippet first (small, instantly visible across the next 10 PB outputs). Write the "How we ranked for Cunt" experiment after the dot is live so it can demonstrate the dot in the wild.

Comments:

**Jay:**

> **[More tagline + ad-copy + marketing-stunt candidates from a later brain dump]**
>
> **New tagline candidates**
>
> - **"You are scrolling… should not you be posting?"**, ad headline for PapaMassive Starter tier. Hits the exact moment of self-aware procrastination.
> - **"What can you do with AI coming…? Have an imagination!"**, open-ended pitch that flips the AI-anxiety conversation. Pairs with Jay #1 Priority "If you have heard of it, you can have it."
> - **"The funnel IS generosity."**, counter-positioning. Most "funnel" pitches are sleazy. This reframes the funnel as the act of giving (free audit, free post, free tool) that earns the customer relationship. Quote on the PB about page.
>
> **Ad campaign: "Save $, do not join the Chamber. We will do everything they (should) do."**
>
> - Direct shot at Chamber of Commerce membership fees ($300–$1,000+/yr in NZ for marginal value)
> - Position PB as the practical alternative, real audits, real introductions, real content, lower cost
> - Risk: alienates Chamber members. Probably also generates strong PR if executed sharp.
> - Best as a single bold ad run in Papamoa-area channels, not as ongoing positioning
>
> **Marketing stunt: "Raccoon stole the codebook"**
>
> - Premise: "The raccoon stole the codebook to the site, all playbooks emailed are the full unlocked versions until we fix it, go get it quick (from Ian, not the raccoon)"
> - One-off marketing stunt, 24-48 hour window where every paid playbook is delivered free
> - Drives signups, captures emails, creates urgency, leans on the existing raccoon brand asset (404 game on papamoa-previews/404.html, see 404 game tweak item on Hub + Inbox)
> - Best timing: right after the 404 game tweak ships (raccoon-to-bin + machine-gun + donut power-ups). The stunt extends the same character into the marketing world.
> - Pair with cross-channel hype: Tentacles socials + LinkedIn + Email blast + Reddit/HN if Jay is feeling brave

**Jay:**

> **[More tagline candidates from the 30-day content brain dump]**
>
> - **"We made ourselves a playbook. We made it a tool you can use too."**, describes the entire PB productisation pattern in one line. Could be the lead headline on the PB homepage.
> - **"Make stuff we would use, can do for you too."**, eat-our-own-dogfood positioning. About-page / culture line.
> - **"My mate did not think he needed a website. Challenge accepted."**, story hook for the 30-day challenge launch post (POST 1 on the 30 Day Build Challenge card). Could also be a recurring "challenge accepted" series, every post starts with a similar setup.
> - **"It is not an AI-word-slop generator."**, counter-positioning for Blog Generator. Honest, slightly aggressive, on-brand. Pairs with the AI Brain framing.
>
> All four sit comfortably alongside the existing "Just good cunts, plain black" / "If you have heard of it, you can have it" / "Make Better Slop" voice family. Run them through the website Repo System Prompt design self-check before any goes live.

**Jay:**

> **[More candidate lines from the Websites v2 dump]**
>
> - **"The real magic is what your customers / clients do not see, your back-end AI-powered engine."**, pitch glow-up. Pairs with the "AI Brain" framing on the Blog Generator marketing campaign (Marketing & Lead-Gen Ideas). Candidate homepage hero for the Websites service.
> - **"Easy in, easy out. Your assets, always."**, captures the free-off-boarding promise as a feature, not a footnote.
> - **"Small smart family website business that uses AI and templates."**, about-page voice. Anti-corporate, honest, scoped.
> - **"Just do websites man. Simple and fair priced."**, internal mantra; might leak into copy somewhere appropriate.
>
> All sit in the same voice family as the existing PB voice items (good cunts, plain black) + the recent additions ("we made ourselves a playbook", "challenge accepted", "not an AI-word-slop generator").

**Jay:**

> **[Old PlainBlack taglines from previous relaunch plan, reference item `mpic911r-1g1gc8181p` on this card]**
>
> - "Big Ideas Start Simple. We Make Sure They Look Good Doing It."
> - "Where big ideas get their first black t-shirt."
> - "We Brand Bold Beginnings."
> - "You bring the dream, we will bring the black t-shirt."
> - "Branding for Bold Ideas."
> - "You have got the spark. We will give it a brand."
>
> All sit in the same voice family as the current PB voice items. The "black t-shirt" running joke is a discoverable easter-egg motif worth keeping alive (pairs with the green-dot Fibonacci signature already on this card).

**Jay:**

> **[More positioning lines from the GEO / Carwyn directories pitch]**
>
> - **"AI Feeders, not just directories."**, repositioning a directory listing as infrastructure for AI answer engines
> - **"The Trust Bridge."**, what a 2005-aged domain provides that new sites cannot buy
> - **"A moat your competitors cannot build themselves."**, the sales hook for Gold / Spotlight packages
> - **"AI-Ready" badge**, visible signal on Gold + Spotlight listings (Carwyn directories), and a candidate trust mark PB could license / earn on PB sites too
> - **"GEO, Generative Engine Optimisation."**, the industry term Jay is now using (resolves the earlier SAO flag on Marketing & Lead-Gen Ideas)
>
> The "AI Feeders" + "Trust Bridge" pair sit well alongside the broader PB voice family.

---

### PlainBlack brand voice + entry-level package + service-catalogue gaps to fill (P-12 / I-116)

**PB brand voice + entry-level package + service-catalogue gaps to fill**, meta-item capturing the smaller bits from the same brain dump.

**PB voice line (file verbatim)**

> "Not consultants, not contractors, marketers, not gurus not experts. Just good cunts. Plain Black."

This is the unfiltered PB tagline. Probably too raw for client landing pages but exactly right for LinkedIn / about / culture / hiring copy. Pair with the "Unfuck your business" workshop framing below.

**Workshops umbrella, "Unfuck your business"**

- A fresh perspective helps
- AI makes it affordable
- The "good cunts" voice differentiates from polished consultancies

**Entry-level package, $2,000 Business Startup** (flag "most popular")

- AI integration audit & setup
- Outcome: longer weekends · more days off · set-and-forget daily processes
- Pricing anchor that ladders up from the $495 NameStorm / $950 Brand Jam workshops to bigger engagements

**Service catalogue gaps** (placeholders Jay flagged that are not yet specced)

- **Branding & Logo**, partly covered by NameStorm + Brand Jam workshops; needs a standalone logo-only offer
- **SEO**, referenced everywhere (Blackberry / Pizza Pundits audits) but no standalone PB SEO service product
- **Social media**, partly covered by $100/wk SMB service; could be standalone
- **Marketing & Advertising**, broad placeholder; needs scoping
- **What We Do / What We Don’t Do**, Jay flagged the need for a service-boundary doc. Important: without it, scope creep on every engagement.

**Next:** for each catalogue gap, write a one-paragraph definition + indicative price + which existing card it might attach to. Treat as a future PB Services item.

Comments:

**Jay:**

> **[Old PB plan also had "Brand Strategy Workshops" as a service line, reference item `mpic911r-1g1gc8181p` on this card]**
>
> Old framing: half-day and full-day options · deliverables included name brainstorm, tone of voice, target audience mapping, brand pillars.
>
> That structure already evolved into the current NameStorm / Brand Jam / Idea Intervention trio on this item. No action needed, just confirming the workshop line has continuous ancestry. The trio names are sharper than the old "Brand Strategy Workshop" label.

---

### Two positioning ideas that change PlainBlack's shape (P-12 / I-105)

**Two positioning ideas that change PB's shape, file together because they reinforce each other.**

---

**1. The Aggregator / Network Model**

Rather than being a salesperson for one brand, PB represents *all* the brands/solutions a small business might need. PB gets paid either way, the companies/brands save on employee, transaction and advertising/marketing costs.

**The pitch:** "Let's talk about what you need. I'll talk to some people and get back to you with proposals, offers, and pricing."

**Workflow**

1. All PB does initially is ask questions
2. Then AI crawls for solutions
3. Email back: "yes I've got these solutions" + book follow-up to walk through prices/options

**The network PB can already plug into**

- PlainBlack itself (sites, playbooks, AI tools)
- Epic Events
- Kory, Beef etc, Jay's personal network (no commission, just sharing + recommending)
- Dotinfomarketing
- Facebook Group
- UGC creators / locals
- Apps
- Devs (ARVI, etc)
- Hardware

**Revenue model:** PB gets paid when the client buys things PB doesn't offer (commission/affiliate), or when PB does it better itself (fills a gap).

---

**2. The "Notice and Post" Leverage Model**

PB will always notice the broken things (TripAdvisor wrong, Google wrong, missing this on FB, button broken, mobile bad, no alt tags, not listed here, no number here). Pricing menu:

- **Monthly subscription**, PB does it on retainer
- **Burst payment**, PB does all the heavy lifting in week 1, paid in the back, then exits
- **DIY**, PB sends audit + recommendations as email/PDF, client decides what to do

**The hook:** *"Only thing I need in return is let me make content of what I find and my suggestions. So I can post about them."*

Free audit → either pay PB to fix, OR PB posts publicly about what's broken. Asymmetric: PB wins either way (revenue or content). Client wins either way (gets fixes or gets free publicity even if it's "look what we fixed").

---

**3. Intro / Access Pricing**

- Free / cheap / fast pathway, bot chat, AI-generated plan (custom GPT model so it's not the same as the client doing it themselves)
- **$199** intro chat (zoom, for non-local)
- **$499** in-person (Papamoa / Tauranga)
- After plan walk-through → fully automated 24/7 personalised support system, integrated with all their apps, unlimited
- Face-to-face meetings recorded with **avatars for privacy** → shareable takeaways/summaries become content → drives more customers

**The PB tagline that ties it all together**

> Everything you need · Nothing you don't · No bias · No bullshit · AI does the work · I just write the prompts

---

**Adjacent on this card**: $100/wk SMB service is the productised version of the Notice-and-Post pattern. Aggregator model is the higher-level positioning that lets PB sell the $100/wk + intro chats + everything else without committing to a single product identity.

---

### PlainBlack Voice & Style Guide (P-19 / I-293)

**PlainBlack Voice & Style Guide, the canonical brand-level voice bible. 19 sections.** Sister to the Jay voice profile (item `mpj40s1k-11t1kdb1c`), Ian Clarquinn voice rule (item `mpj8ocjw-qk5tk1g`), Repo System Prompt (item `mpj8h3rq-1e1oa01q11`), Visual Brand Guide (item `mpj8t6yn-1k0f1prb`), and ICP (item `mpj8kghv-91krzih`). Source docx being deleted, verbatim extraction.

#### 1. The One-Line Voice (verbatim)

> PlainBlack sounds like **a smart, funny mate who understands small business, hates marketing bullshit, inspires you to think bigger with your business, and then makes big ideas simple.**

#### 2. Brand Voice Summary
Sounds like the smart, funny mate at the pub who understands small business and can explain marketing in a way that finally clicks. Blunt without cruel. Confident without smug. Funny without performance. Can swear when the sentence earns it. Charismatic, slightly intense, genuinely excited by good business ideas.

**Does NOT sound like:** guru · webinar host · corporate agency · LinkedIn growth goblin · American SaaS founder explaining “scale” near a whiteboard. Does not use jargon as decoration. Does not polish the life out of the message. Does not talk down. Does not compete through scarcity, fear, or fake urgency.

Never sounds uninformed, incompetent, smug, condescending, overproduced, or *like it learned marketing exclusively from a 1950s advertising quote recycled by someone in chinos.*

#### 3. The Desired Reader Reaction (verbatim)

> After reading PlainBlack copy, people should feel like they finally understand something that other people made confusing.
> 
> **Ideal reaction:** *“Shit. That makes sense. Why did nobody explain it like that before?”*
> 
> PlainBlack copy should create relief, clarity, momentum, and trust. It should make people feel like someone has their back, not like someone is trying to sell them a 12-month retainer through interpretive marketing fog.

#### 4. The 9 Core Voice Principles (verbatim)

1. **Plain language first.**
2. **Strategy before decoration**, do not make things sound pretty unless they are also useful.
3. **Respect the reader’s intelligence**, not stupid, stuck. The difference matters.
4. **Say the uncomfortable thing**, if the truth is useful, say it plainly.
5. **Make marketing feel less mysterious**, remove confusion, don’t create more.
6. **Humour earns attention, but clarity earns trust**, the joke never replaces the point.
7. **Business owners are people first**, not leads, avatars, segments, or sources of income.
8. **Help before selling**.
9. **Do not hold the knowledge ransom.**

#### 5. Audience Reality (the SMB ICP at voice level)
**Primarily speaks to SMB owners who are:** good at what they do but hard to find online / burned by agencies or freelancers / overwhelmed by courses, tools, marketing advice / curious about AI but not interested in becoming an AI prompt goblin / time-poor, practical, allergic to vague advice / looking for a clear next move, not a 90-page strategy scroll.

**They want:** clarity · control · proof · plain language · practical steps · low-risk entry points · someone who tells them what actually matters · help that respects their time and money · advice they can understand without joining a marketing cult.

**They do NOT want:** jargon · bloated retainers · hidden complexity · courses disguised as help · patronising advice · generic AI sludge · to be treated like a lead/avatar/wallet with legs · to be made to feel stupid for asking normal questions.

**Most important audience rule (verbatim):** *People above all. People own businesses. People buy. People get confused, stretched, burned, excited, tired, ambitious, and stuck.*

#### 6. Tone Spectrum

| CAN BE | SHOULD AVOID |
| --- | --- |
| Direct · dry · funny · honest · practical · slightly irreverent · strategic · generous · passionate · informed · protective of small business owners · obsessed with making the idea clear | Cruel · smug · try-hard · corporate · guru-like · webinar-ish · overly polished · childish · performatively rebellious · vague · condescending · competitive in a scarcity-driven way · clever at the expense of useful |

#### 7. Writing Rules + default rhythm
**Use:** short sentences where they help · concrete nouns · commercial logic · real SMB-life examples · simple explanations · sharp contrasts · useful metaphors · active voice · plain CTAs · humour that opens the door then a serious point that earns the room · big idea first, practical explanation second · people-first language.

**Avoid:** bloated marketing jargon · abstract business fluff · unexplained acronyms · empty hype · performative profanity · vague transformation promises · passive voice that hides accountability · sounding like every other agency · default advice like “just increase your budget” · dead-hand thinking like “we’ve always done it this way.”

**Default sentence rhythm:**

1. Start with something funny, blunt, or recognisably true.
2. Shift quickly into the serious commercial point.
3. Explain the big idea simply.
4. Give the reader a practical next move.
*Good PB writing should feel like someone has taken a messy business problem, removed the fake complexity, and handed it back with the useful bits circled.*

#### 8. PlainBlack Sentence Style

| Good examples (verbatim) | Bad examples (verbatim) |
| --- | --- |
| Marketing without the agency bullshit. Strategy first. Execution second. Most marketing fails before the ads even start. Built to protect your time, not just collect leads. More leads are not always better. Especially if you are paying for them. The goal is not to get more enquiries. The goal is to get more of the right enquiries. If your website collects every lead, it also collects every tyre-kicker with a Wi-Fi connection and a dream. Small business owners do not need more platforms. They need a clearer first move. AI can write the ad. It cannot decide whether the ad should exist. If the report needs a decoder ring, the strategy has already gone sideways. | Unlock your brand’s full potential with our holistic digital growth solutions. We help businesses leverage omnichannel strategies to maximise scalable engagement. Just increase your budget. We’ve always done it this way. In today’s fast-paced digital landscape, your business needs a cutting-edge partner. Our bespoke methodology empowers brands to elevate their market presence. Let’s take your business to the next level. |

**The sentence test (verbatim):** *“Would a tired small business owner understand this after a long day, and would they believe a real person wrote it?”* If not, rewrite before it joins the long, grey parade of marketing sludge.

#### 9. Headlines
**Should be:** specific · punchy · slightly uncomfortable when useful · outco

---

### PlainBlack Visual Brand Guide for AI Asset Creation (P-19 / I-292)

**PlainBlack Visual Brand Guide for AI Asset Creation. 24-section canonical visual bible.** Sister to Repo System Prompt (item `mpj8h3rq-1e1oa01q11`), that one is web/voice + visual basics; this is the full visual-creation rulebook for AI-generated assets / social / blog heroes / presentations / campaigns. Source docx being deleted, verbatim extraction with structural condensing only.

#### 1. Core Visual Position (verbatim)

> **Dark cinematic strategy. Practical intelligence. Small-business grit. Mint-green clarity cutting through the mess.**
> 
> The visual job is simple: *Make PlainBlack look like the place where messy business problems become clear, useful, and actionable.* Not cute. Not corporate. Not beige. Not “AI startup with a gradient and a dream.”
The brand should feel: premium but not corporate · dark but not gloomy · clever but not smug · cinematic but not fantasy · practical but not boring · local, human, grounded · strange enough to be remembered · clear enough to be trusted.

#### 2. Visual Personality, what PlainBlack looks like
**Should look like:** late-night strategy room · workshop bench with marketing plan · detective board for business clarity · black notebook full of useful ideas · small-business owner finally seeing the next move · cinematic film still about fixing complexity · field manual for owners sick of being sold fog · premium dark stationery / tools / screens / notes / proof objects · AU/NZ practical grit with sharper creative edge.

**Should NOT look like:** generic SaaS branding · bright startup gradients · smiling stock-photo teams · sterile agency case-study templates · fake futuristic AI dashboards · shiny corporate boardrooms · over-polished motivational posters · Canva-template marketing graphics · personal-brand-guru assets · American webinar funnel visuals · empty dark-mode tech aesthetic with no commercial idea.

**Test:** *If it could be used by any agency after changing the logo, it is too generic.*

#### 3. Colour System (verbatim hex codes)

##### PlainBlack Black
`#000000` · `#050505` · `#080A09` · `#0B0D0C` · `#101211`, rich, textured, cinematic. Avoid flat grey-black unless deliberate web background.

##### PlainBlack White
`#FFFFFF` · `#F5F3EF` · `#EDEBE6`, slightly warm in cinematic scenes, not cold corporate white.

##### PlainBlack Mint / Signal Green (the core accent)
`#00C96B` · `#00D46A` · `#16D982` · `#35E89B` · `#5FE3AE`, use sparingly and intentionally. Should guide the eye, not flood the asset.

##### Secondary palette (environmental support only)
Warm tungsten desk-lamp amber · aged paper beige · dark graphite grey · worn metal · coffee brown · charcoal concrete · deep bottle green shadows · soft screen glow.

##### The Colour Ratio Rule (critical)

| % | Layer |
| --- | --- |
| 75–85% | black / charcoal / shadow |
| 10–20% | warm practical environment |
| 3–7% | mint-green signal |
| (reserved) | white for wordmark and key copy |

**The mint is not decoration. It is the clue, the system, the mark, the action point, or the thing that matters.**

**Avoid:** neon rainbow · bright corporate blue · purple SaaS gradients · pastel wellness · flat green backgrounds · too much mint at once · highlighter green · red (unless deliberately showing danger/urgency/broken system).

#### 4. Logo Rules
Two main identity assets: **Wordmark** (PlainBlack + mint circular logomark) and **Logomark** (the mint circular swirl/fingerprint/signal icon).

**Wordmark placements:** top left · lower left · centre-left on clean dark field · as subtle in-scene object (notebook, mug, sign, screen, business card, wall).

**Wordmark colour:** white on dark, black on light, mint logomark retained where possible. Don’t recolour into random palette.

**Clear space:** at least the height of the mint logomark on all sides. *“Do not cram the logo against the edge like it owes rent.”*

**Do not:** stretch / squash / rotate / add drop shadows / place over busy texture without dark overlay / rebuild in another font / separate wordmark from mint mark unintentionally / **put the logo on objects that imply PlainBlack is the villain, scammer, broken product, or problem being criticised**.

> **That last one matters.** If the image is calling out bad marketing, the PlainBlack mark belongs around the edges as the observer, not on the snake-oil bottle.

#### 5. Logomark Rules (the easter-egg signal)
Logomark feels like: **signal · clarity · fingerprint · focus · proof · useful clue · quiet signature.**

Does NOT feel like: random decorative blob · background wallpaper · cheap sticker everywhere · the main subject (unless asset calls for it).

##### Easter egg rule (verbatim)
Use 1–5 hidden brand details depending on complexity:

- Simple social tile: 1–2 details
- Blog hero: 2–4 details
- Complex cinematic scene: 3–5 details
- Logo-led brand asset: no easter eggs needed
**The first read should be the idea. The second read should reward attention.**

**Good easter-egg places:** notebook corner / laptop sticker / small background sign / mug / phone screen / tape measure / pin on board / chalk mark / book spine / shop window reflection / card on desk / moon or light projection / signage / tool chest label / checklist tick colour.

**Bad places:** on a scammer’s product / villain’s shirt / broken object being criticised / large and glowing for no reason / repeated so much it becomes visual acne.

#### 6. Typography Direction (condensed)

- **Primary (major brand moments):** bold, confident, high-contrast serif or editorial. PB wordmark itself is high-contrast serif. Use for campaign headers, hero assets, brand statements, high-impact socials, presentation covers.
- **Secondary (practical / functional):** clean sans-serif. Modern, clear, calm, readable, not overly techy. UI labels, section headings, captions.
- **Handwritten / marker:** only when scene-appropriate (whiteboards, notebooks, sticky notes, chalkboards, workshop plans, checklists, scribbled strategy notes). Adds human texture + small-business realism.
**Hierarchy:** 1 dominant headline + 1 supporting line + optional small labels + logo. *Do not turn every image into a ransom note of competing messages.*

**Use:** uppercase for short labels · generous letter spacing for small all-caps · bold weight · short phrases · clear line breaks · high contrast.

**Avoid:** long paragraphs in images · tiny illegible text · *fake handwritten text that looks like a serial killer planned a webinar* · too many fonts · bubbly rounded fonts · futuristic sci-fi fonts · default Canva script · warped text without reason.

#### 7. Image Style
**Core:** dark

---

### Ian Clarquinn Voice Rule (P-19 / I-291)

**Ian Clarquinn Voice Rule, the canonical PB Founder Voice Guide for Ian. Sister doc to Jay’s voice profile (`mpj40s1k-11t1kdb1c`), the Repo System Prompt brand bible (`mpj8h3rq-1e1oa01q11`), and the PB ICP (`mpj8kghv-91krzih`).** Source docx being deleted, full verbatim extraction.

**Name reveal:** Ian’s canonical full name is **Ian Clarquinn**. Explains the “Clarquy” nickname from the 30-day-build memo (item `mpj7dj1x-1e6z191p8`), Clarquinn + ??? = Clarquy.

#### The core idea (verbatim)

> Ian’s voice should not sound like generic brand copy, polished LinkedIn commentary, or “AI doing cheeky marketing.” It should sound like Ian: a big-picture, slightly off-kilter, commercially sharp founder who gets genuinely fired up when small business owners are sold confusion, but never forgets that the owner is not the idiot in the room.
> 
> **Ian is not angry at small business owners. Ian is angry on behalf of them.**
> 
> PlainBlack’s broader voice is clear, direct, commercially grounded, useful, human, generous, and allergic to marketing bullshit. Ian’s voice is the more personal, rant-prone, lateral, quote-pulling version of that. It still needs to be useful. The rant must land somewhere. Otherwise it is just a man yelling at a cloud with a Canva subscription.

#### Core Ian voice (one-line)
Ian sounds like **a slightly unhinged but commercially useful pub philosopher** who understands sales psychology, remembers obscure references from nowhere, spots marketing manipulation quickly, and can explain the problem in plain English.

#### What Ian is likely to do (verbatim)

- Go off on a rant about small businesses getting ripped off
- Explain why the owner is not stupid, just stuck
- Quote or loosely reference Simon Sinek, Gary Vee, Monty Python, old movies, Sale of the Century, or random childhood memories
- Use the hand-brain model or simple psychology to explain why sales tactics work
- Pull oddly specific references from thin air
- Take the piss out of himself before anyone else can
- Spot the mechanism behind a sales pitch, funnel, webinar, or agency offer
- Turn a serious point into something memorable with a strange metaphor
- Land the point in a way that gives business owners more clarity and control
**The Ian gestalt:** someone who has watched the pitch, spotted the trick, remembered a quote from 1997, and is now pointing at the whole thing saying: *“Surely we’re not all pretending this is normal?”*

#### Ian’s role inside PB
Ian is **the pattern spotter.** He sees the wider game: sales psychology, manipulation, hidden complexity, inflated value stack, fake urgency, the quiet way small business owners are made to feel stupid for asking normal questions.

Ian’s job is to **make the confusing thing obvious**. Reader should feel: *“Ah. That’s why that felt off.”*

#### Ian’s emotional position
**Protective, not superior.** Blunt, sweary, dry, sarcastic, impatient with the industry. But never punches down at the business owner.

| The target IS | The target is NOT |
| --- | --- |
| Confusion · agency theatre · bloated retainers · fake urgency · sales scripts dressed as strategy · overcomplicated marketing · guru nonsense · AI hype · vague reporting · people using jargon because the plain version would reveal there is no real idea underneath | The small business owner · the client · the person who got burned · the person who bought the wrong thing · the person who does not understand marketing yet · the person trying to build something decent with limited time, money, and headspace |

**PlainBlack humour should reveal the truth, not replace it.** The joke should point at the broken system, not the person trying to survive it.

#### Ian’s default rhythm
**Observation → rant spark → weird reference → useful explanation → throwaway landing**

1. Spot the thing.
2. Say why it bothers him.
3. Use a strange metaphor, old quote, psychology model, or memory.
4. Explain the real mechanism simply.
5. Land with a useful, slightly sideways line.
*Avoid perfect LinkedIn structure. Avoid tidy moral endings. Avoid “this is the bit people miss” unless the next line sounds unmistakably human.*

#### The 4 Ian voice markers (verbatim examples)

##### 1. Protective rant energy

> That’s the bit that does my head in.
> 
> The owner doesn’t know what they don’t know. Fair enough. Nobody comes out of the womb understanding attribution models. That would be a horrifying baby.
> 
> Instead of making it clearer, half the industry turns the fog machine on and sends an invoice.

##### 2. Psychology made simple

> Once someone flips into threat mode, they’re not comparing options calmly. They’re trying to get out of discomfort. That’s where fake urgency works. Not because people are stupid. Because brains are squishy little panic machines wearing shoes.

##### 3. Quote-collage brain

> Sinek has been saying for years that people buy the why. Gary bangs on about attention and care. Monty Python gave us the Ministry of Silly Walks. Somehow modern marketing looked at all three and decided the answer was a seven-email nurture sequence called The Authority Ladder.

##### 4. Self-deprecating intelligence + Side-quest metaphors

> I say this as someone who was apparently trying to win Sale of the Century at nine while sitting with my grandmother, so yes, the wiring was questionable early.
> 
> AI can make ten versions of the wrong thing very quickly. That’s useful in the same way putting a turbo on a shopping trolley is useful. Fun for three seconds, then a small insurance event.
**Shared-anecdote flag:** the Sale-of-the-Century-at-9-with-grandmother line also appears in Jay’s voice profile (item `mpj40s1k-11t1kdb1c`). Either it’s a shared reference, the docs were drafted together, or one credit’s misplaced. Worth a quick check with Jay/Ian before either gets cited publicly.

#### Ian should sound like this (verbatim sample copy, ship-ready)

> I reckon this is where small business owners get stitched up.
> 
> They don’t know what they don’t know. Fair enough. Nobody starts a plumbing business because they secretly want to become fluent in conversion tracking and funnel leakage.
> 
> Then some agency wanders in, says “strategy” twelve times, shows them a dashboard, and suddenly the owner feels like the only way out is to keep paying for the fog machine.
> 
> **That’s not strategy. That’s the Ministry of Silly Walks with a payment plan.**

> I don’t think AI replaces good marketers. **I think it exposes lazy ones.**
> 
> Which is inconvenient, obviously. Nobody likes finding out the robot can do their “bespoke strategic ideation” before the kettle boils.
> 
> But the real issue for small business owners is this: they already don’t know which bit of marketing matters first. AI can make ten versions of the wrong thing very quickly. The thinking still matters. The tool just makes the thinking louder.
People love saying “just post more” like that solves anything. **That’s like telling someone who’s lost in Bunnings to walk faster.** More movement

---

### THE PlainBlack Repo System Prompt (P-19 / I-289)

**THE PlainBlack Repo System Prompt, canonical brand & voice bible.** Standing instruction for Claude inside the PB website repo. The doc memory has been referencing all session (memory note: `plain-black-website/docs/REPO_SYSTEM_PROMPT.md`). Source docx being deleted, full verbatim extraction below.

#### System framing (verbatim)

> You are building and editing the PlainBlack website.
> 
> PlainBlack is not a generic creative agency, SaaS product, or corporate consultancy. It is a sharp, plainspoken brand for founders and small business owners who feel overlooked, overwhelmed, or tired of being sold complicated marketing nonsense.
> 
> The website must feel premium, dark, controlled, cinematic, and direct.
> 
> The core positioning is: **Branding that fights for the underdog.**
> 
> The site should make the visitor feel: *These people get it. They can bring order to the mess.*

#### Non-Negotiable Brand Rules (verbatim, 8 rules)

1. **Never use the word Creative under the PlainBlack logo in client-facing outputs.**
2. Avoid agency clichés and jargon.
3. Do not make the site feel like a SaaS dashboard, startup template, or pricing-table UI.
4. Do not use white rounded cards unless explicitly instructed.
5. Prioritise negative space, restraint, and strong hierarchy.
6. Use the PlainBlack monogram and logo treatments as subtle brand details, not loud decorations.
7. Write like a real person speaking plainly to a smart but overwhelmed business owner.
**Critical contradiction flag:** rule #1 (“never use ‘Creative’ under the logo”) is broken in multiple currently-filed assets, IG carousel uses “PLAINBLACK CREATIVE” in footers, Ordermeal landing uses it in header, Band Playbook landing uses it. Worth a sweep + correction across all client-facing surfaces.

#### Visual Style (verbatim)

- Dark, cinematic, minimalist
- Deep black and charcoal backgrounds
- Moody directional lighting
- Textured surfaces, not flat colour blocks
- Premium editorial feel
- Left-aligned content
- Asymmetrical layouts
- Strong negative space
- Subtle green accents only
- Monogram details as discoverable easter eggs
*Should feel like high-end editorial / product photography, not a web template.*

#### Colour System (exact hex / tokens)

| Role | Value |
| --- | --- |
| Black | `#050505` |
| Charcoal | `#0c0c0c`, `#111111` |
| Off-white | `#f5f3ef` |
| Muted text | `rgba(245, 243, 239, 0.72)` |
| Soft text | `rgba(245, 243, 239, 0.48)` |
| Divider lines | `rgba(245, 243, 239, 0.14)` |
| Accent green | `#00c853` or existing project green token |

**Green is an accent, not a main colour.** Use it for dots, thin lines, small labels, and selective emphasis only.

#### Typography Rules

| Layer | Rules |
| --- | --- |
| **Headlines** | Bold, uppercase sans-serif for punchy brand statements. Short stacked lines. Strong line-height. Avoid long sentence headlines where possible. |
| **Editorial / emotional** | Serif italic may be used sparingly for human emphasis. Do not overuse decorative styling. |
| **Body copy** | Clean sans-serif. Short paragraphs. Clear, direct, conversational. No bloated explanations. |

**Good headline rhythm:** *“STOP WINGING IT. START MOVING WITH INTENT.”*

**Avoid:** *“We provide integrated brand-led digital solutions for ambitious businesses.”*

#### Layout Rules
**Default section structure:**

- Left side: message, headline, subtext, CTA
- Right side: visual weight, image, negative space, or object detail
**Use:** large section padding, wide breathing room, thin divider lines, minimal UI elements, asymmetry.

**Avoid:** centred everything, busy grids, heavy cards, overloaded sections, UI-kit styling.

*If a section feels slightly too empty, it is probably closer to correct.*

#### Component Rules

##### Toggle Sections
Must feel like a **decision moment**, not an app feature. Use language like:

- **Handled for you**
- **Take control yourself**
Both toggle states must share the same layout structure. Only the content changes. Do not make each toggle state feel like a separate design.

##### Pricing / Offer Blocks
Avoid white pricing cards and rounded UI boxes. Use stacked text blocks, thin dividers, strong spacing. Price visible but not dominant. **The message comes first. The price supports the decision.**

##### Buttons
Minimal and confident. Simple fills or outlines. Subtle hover states. No exaggerated effects.

##### Image Sections
Place text over dark/empty zones only. Use dark gradient overlays for readability. Do not cover important image details. Let the image create mood, not clutter.

**Example overlay (verbatim CSS):**

```
.section-bg {  background:    linear-gradient(90deg, rgba(5,5,5,0.88) 0%, rgba(5,5,5,0.65) 42%, rgba(5,5,5,0.22) 75%, transparent 100%),    url('/assets/path-to-image.webp') right center / cover no-repeat;}
```

#### Copywriting Rules, the PB voice
The PlainBlack voice is: **Direct · Human · Honest · Slightly rebellious · Plainspoken · Helpful, not performative.**

Write for someone who is **smart but stuck**. They have probably tried: random posting / website tweaks / logo changes / advice from too many sources / agencies or freelancers who overcomplicated things.

**Make them feel seen without making them feel stupid.**

##### Good lines (verbatim, ship-ready)

- “You are not bad at marketing. You are guessing.”
- “The problem is not effort. It is direction.”
- “No fluff. No lock-ins. Just a clear way forward.”
- “We back the founders the big agencies ignore.”

##### Avoid (the no-fly list)

- Transform your brand ecosystem
- Growth-driven solutions
- Unlock your potential
- Elevate your digital presence
- Bespoke end-to-end creative services

#### Offer Positioning (verbatim, THE binary)
PlainBlack offers **two broad paths:**

| Path | For who |
| --- | --- |
| **Handled for you** | For people who want PlainBlack to build the brand, website, or strategy with them. |
| **Take control yourself** | For people who want a guided AI-powered playbook instead of hiring an agency. |

**These should feel like two valid paths to the same outcome: clarity, confidence, and control.**

**NOT:** premium service vs cheap DIY.

*Cross-reference: the DIY-or-DI2gether 4-tier funnel (item `mpj4t6kd-81lvl1lx`) is the concrete implementation of this binary.*

#### Design Self-Check Before Finishing (verbatim 10 questions)
Does this feel premium or generic?Does this feel like PlainBlack, or like a template?Is there enough negative space?Is the message clear within 3 seconds?Does anything feel like SaaS UI?Are we using green too much?Could 20% of this section be removed and make it stronger?Does the copy sound like a real

---

## Segments

### Operational campaign (P-8 / I-136)

**Operational campaign: sweep SEEK / TradeMe / LinkedIn / Facebook job listings → build a landing page per listing at `hire.plainblackcreative.com` → outreach pitch: "do you really need to hire? Here is what we can do for you for less."**

This is the manual / scaled version of the Job-Pitch Tool concept already on this card, same insight (job listings = explicit buying signal for a function), different mechanism (per-listing landing page on a public subdomain, not just an email pitch).

**The sources to sweep**

- **SEEK NZ**, nz.seek.com (https://nz.seek.com/). Most volume + most structured listings.
- **TradeMe Jobs**, NZ-specific, often missed by recruiters because it is smaller
- **LinkedIn Jobs**, best for marketing / digital / professional roles (PB target zone)
- **Facebook Jobs / groups**, local SMB hiring posts (Papamoa community groups, Bay of Plenty business groups)

**Why LinkedIn + Facebook specifically matter**

Both let PB drop a *public link* in the comments or DMs, meaning the per-listing landing page (e.g. `hire.plainblackcreative.com/social-media-manager-papamoa-acme`) goes straight to the hirer with one click. SEEK + TradeMe are emails only, slower path.

**The landing page shape (per listing)**

Each page is a tailored response to the specific listing:

- **Hi, intro**, "Hi [hirer], here is what I noticed you are hiring for"
- **This is what I can do for you**, specific to the role being advertised, AI-tooled where possible
- **Do you really need this listing?**, gentle challenge, not aggressive
- **Pricing**, clear, transparent, deliberately under typical salary cost. Not a CTA-driven catalogue. Just "literally get close to your employee, for less $$"

**Tone calibration:** the goal is "interested conversation" not "sales push". Anything CTA-heavy will read as scammy. Match the tone of the listing itself.

**Build path**

1. Stand up `hire.plainblackcreative.com` subdomain (Cloudflare Pages or Astro on plain-black-website repo)
2. Build one base landing-page template, variables for hirer name + role + listing URL + specific PB response + price
3. Manual first round: 5–10 listings, hand-fill the template, post to LinkedIn / FB comments + DM
4. Once the conversion shape is known, plug in the Job-Pitch Tool to auto-generate the page from a pasted listing URL
5. Then it is a daily run, Claude scrapes, drafts, Jay reviews, ships

**Which roles to target first** (highest AI-replaceability + highest PB capability match)

- Social media manager / coordinator
- Content writer / copywriter
- Marketing assistant / coordinator
- Customer service / inbound chat
- Personal / virtual assistant
- Data entry
- SEO specialist (junior)
- Junior designer (Canva-shaped work)

Avoid roles that genuinely need a body in the room (trades, hospo, retail, healthcare).

**The pitch behind the pitch**

Same brand position as the rest of PB AI work: *"AI does not save you wages, it improves productivity. But if you were going to hire someone to do X, and X is mostly an AI task, we can do it for less and you keep the headcount budget for something more human."* Pairs with the "AI for wellbeing not wage savings" thesis on the niche-lock motion item.

**Risks**

- Direct pitch on a public job listing can be perceived as poaching the listing or trolling, calibrate hard
- SEEK Terms may prohibit scraping at scale, manual + LinkedIn/FB-friendly path stays safer
- Subdomain naming, `hire.plainblackcreative.com` works; alternative `donthire.plainblackcreative.com` is sharper but more confrontational

**Cross-card relevance**

- **Job-Pitch Tool** (this card), the automation that converts this manual play into volume
- **AI Agent application play** (Recruitment card), sibling: this pitches the work, that places the agent. Same buying signal, different sales motion.
- **Recruitment playbook** (Recruitment card), LinkedIn content strategy ("how to keep AI your tool not your replacement") is exactly the warm content that turns this cold pitch into inbound
- **MAIA AI Consulting / $100/wk SMB service** (PB Services), the actual services PB sells through these landing pages
- **Niche-lock motion** (this card), winning one client per niche; this is the cross-cutting acquisition channel for them

**Next:** stand up `hire.plainblackcreative.com` with one template + run a manual sweep on SEEK Bay-of-Plenty for social-media-manager listings. Pitch 5 by hand. See response rate. If >0 reply, build the tool on top.

---

### Playbook idea archive (P-12 / I-266)

**Playbook idea archive: Research-and-Counter strategy, identify AI/agent SaaS companies (e.g. GoHighLevel at $97/mo+), then sell one-off DIY playbooks to their audiences.** Sibling of the anti-Richard-Yu positioning Jay floated earlier.

#### The idea (verbatim)

> Research other AI & Agent sites, socials etc and create playbooks.
> 
> Ie gohighlevel.com (https://www.gohighlevel.com), Ads targeting GoHighLevel (example, do what I see ads for, and that cost $97/mo+).
> 
> Before you pay every month, pay once, DIY.
> 
> Target audiences that follow AI SAAS cos, sell the one off cost DIY playbooks that those Agencies are selling for $99/mo.

#### The mechanic

- **Identify a paid SaaS competitor** (GoHighLevel as the named example).
- **Run ads / content targeted at their follower / customer base.**
- **Sell a one-off DIY Playbook** that delivers ~80% of what the SaaS does for ≈ the price of one monthly sub.
- **The hook:** *“Before you pay every month, pay once, DIY.”*

#### Cross-card relevance (light)

- **PB Services, DIY or DI2gether funnel** (item `mpj4t6kd-81lvl1lx`), this is the “Why you don’t need to pay $1K–$5K USD to Richard Yu” play applied to SaaS instead of an influencer. Same logic, different opponent.
- **Credibility & Media, “we did it ourselves” middle-man pivot** (item `mpj4fza6-kd1j1ip10`), same philosophy: PB sits between paid tooling and price-sensitive buyers.
- **PB Services, Playbook backlog** (item `mpj5ws90-1h10yh1br`), sibling concept.

---

### PlainBlack Ideal Customer Profile (refined) (P-19 / I-290)

**PlainBlack Ideal Customer Profile (refined). Last updated April 2026.** Sister anchor doc to the Repo System Prompt (item `mpj8h3rq-1e1oa01q11`), that one is the visual/voice bible, this one is the audience bible. Source docx being deleted, full verbatim extraction.

**Purpose (verbatim):** Define who PlainBlack is selling to in a way that directly informs decisions across ads, offers, pricing, and product development.

#### The one-line version (verbatim)

> A small business owner (32–52) running a 1–15 person operation in Australia or New Zealand, 1–7 years into business, who has been burned by agencies, overwhelmed by courses, and frustrated by DIY, and now wants a clear, practical way to get results without wasting time, money, or control.
> 
> **They are not stupid. They are stuck. The difference matters.**

#### The two modes (same person, different moment)

| Mode | Profile | Mindset |
| --- | --- | --- |
| **1. The Controller (Playbook Buyer)** | Burned by agencies / freelancers. Skeptical of anything that feels like a “course”. Wants control over their marketing. Budget-conscious but not cheap. Needs proof before committing. | *“I’ll do it myself… if someone just shows me what actually works.”* |
| **2. The Delegator (Service Buyer)** | Time-poor and mentally stretched. Knows this is too important to get wrong. Will pay for speed and clarity. Wants a partner, not another vendor. | *“I just need someone to handle this properly.”* |

*Cross-reference: maps directly to the brand bible’s “Handled for you / Take control yourself” offer-positioning binary, and to the DIY-or-DI2gether 4-tier funnel.*

#### Business profile (decision zones)

| Field | Value |
| --- | --- |
| **Stage** | 1–7 years in business. Past survival, not yet at scale. |
| **Team size** | 1–15 people (most commonly 2–8). |

##### Revenue bands (used for decision-making)

| Band | Tension | Dominant offer |
| --- | --- | --- |
| **$150k–$400k** | Survival tension | Marketing is inconsistent. Playbooks dominate. |
| **$400k–$1M** | Growth tension | Actively trying to improve visibility. Mixed buying behaviour. |
| **$1M–$2M** | Scaling tension | Time becomes the constraint. Services dominate. |

##### Industry mix

- Trades (HVAC, plumbing, electrical, roofing)
- Hospitality (cafes, restaurants, tourism)
- Retail (single-location or small footprint)
- Professional services (accountants, consultants, allied health)
- Hybrid trades/creative (photographers, dog groomers, mechanics)
**Core pattern:** They are good at what they do but invisible to the people who should be hiring them.

#### Geography

- **Primary:** Australia & New Zealand (core trust signal)
- **Secondary:** United States (primarily playbooks)
- **Tertiary:** UK, Canada, Ireland (playbook spillover)
*The brand is intentionally regional. International is a bonus, not the focus.*

#### Tech & AI relationship

- Comfortable with basic tech (email, social, spreadsheets)
- Overwhelmed by platforms and tools
- Curious about AI but unsure how to use it practically
**Key truth:** *They don’t want to learn AI. They want AI to make their marketing easier and faster.*

#### The world they live in (verbatim, the night-time / couch ICP detail)

- Workday runs 7am–4pm (on tools, in service, or with clients)
- Admin and quoting happens late afternoon
- Marketing is attempted at night, inconsistently
**They have:** a basic website that doesn’t convert · inconsistent posting habits · weak search visibility.

**They’ve been told to:** “Do SEO” / “Post more content” / “Build a brand”, none of it came with a clear starting point.

#### What they’ve already tried

- Agency retainers ($3k+/month) with unclear results
- Online courses they didn’t finish
- Freelancers who overpromised
- AI tools that produced generic content
- DIY attempts that didn’t stick
**Key insight:** *By the time they find PlainBlack, they don’t lack options, they lack trust.*

#### The 3 traps they’re stuck in (and which one PB targets)

1. **Paying too much**, “I paid and got nothing clear in return.”
2. **Too much information**, “Everyone says something different.”
3. **Doing nothing**, “So I just keep working harder instead.”
**PlainBlack exists to break trap 3.**

#### Buying triggers (moment of action)
*They don’t buy randomly. They buy when something shifts.*

- 2–4 weeks of reduced leads or bookings
- Losing work to a visible competitor
- Cancelling an agency and needing a new approach
- Rebranding, pivoting, or expanding services
- A partner/spouse pushing for change
- A specific opportunity (tender, feature, contract)
**Core truth:** *They are not buying a brand. They are buying change within 30 days.*

#### What makes them say YES (7)

- Clear, specific outcomes (“this is what you’ll get”)
- Low-risk entry (free preview or short call)
- No lock-in or long-term commitment
- Plain language, no jargon
- Local voice (AU/NZ credibility)
- Proof from similar businesses
- Less work, not more

#### What makes them say NO (6)

- Anything that feels like a course
- Retainers without clear scope
- Overcomplicated forms
- Hidden costs or upsells
- Corporate or generic visuals
- Marketing jargon

#### How they talk (verbatim phrases, use as ad / lander hooks)

- “I’m not bad at what I do. I just can’t get found.”
- “I tried an agency and got nothing out of it.”
- “I just need someone to tell me what to do first.”
- “I don’t have time to learn another platform.”
- “What’s the simplest way to do this properly?”

#### What they are NOT (the disqualifier list)

- Pre-launch founders
- Enterprise / corporate teams
- Agencies looking to white-label
- Price-only shoppers
- Hobbyists without real stakes
- People unwilling to accept honest feedback

#### Product alignment (driven by ICP emotional state)

| Emotional state | Right offer |
| --- | --- |
| **Clarity** (not yet trusting anyone) | Playbooks ($99) |
| **Confidence** (ready to move) | Name & Frame / Brand Sprint |
| **Momentum** (need consistency) | Idea Engine |

#### The missing opportunity (future product), verbatim

> A **low-cost diagnostic product** that answers: *“What should I do first?”*
> 
> Purpose: Bridge between playbooks and services. Build trust quickly. Increase conversion into higher tiers.
This is exactly what First-Fix / Spitball Sessi

---

## Site & Build Map changes

### Search all HTMLs to import to Hub (P-4 / I-153)

**Search all HTMLs to import to Hub, Ideas surface scan**

- Across ~/Desktop/GitHub/ repos (especially papamoa-previews, plain-black-website, plainblack-admin, plainblack-client) there are hundreds of standalone HTML files (deliverables, mockups, ideas, drafts) that never got surfaced into the Hub as cards or items
- Sweep all HTMLs, identify which contain real ideas / drafts / proposals worth preserving
- Either: convert each into an item (with attachment), promote to a card (if substantial), or archive (if superseded)
- Cross-link to the Repo audit work already on this card, same exercise, narrower scope (HTML drafts only)
- Strong candidate for the Repo Upkeep Agent (MAIA AI Consulting), the agent walks repos, scans HTML headers + first paragraphs, proposes Hub destinations

**Cross-card relevance**

- **Repo audit + cleanup item** (this card), overlapping scope, sister chore
- **Repo Upkeep Agent idea** (MAIA AI Consulting), both chores are exactly what the agent should automate
- **PB Services card items**, the Services bucket needs a clean view by the end of this exercise; PapaMassive + AI Music + AI Hiring + PB Reno Company + Websites all need single-line summaries
- **Productisation pipeline** (PB Services), the /tools bucket gets its permanent listings from this sort

**Next:** sort exercise first (no code, just an inventory in a Google Doc / Notion). Then site nav change. Then HTML sweep (potentially via Repo Upkeep Agent v0).

*Split from this item on 2026-05-26. Sibling half (Playbooks vs Services vs Free Tools) moved to PlainBlack Website card as item mpls21px-1h1o17873.*

Comments:

**Jay (2026-05-27T04:28:42.053Z):**

> **[Partially addressed, 2026-05-27 via I-298]**
>
> Repo→Hub sweep ran as part of closing I-298. Output:
>
> **Section A, repo links added to existing cards (8):** C-8 mcindoe-cms, C-10 taca (site + apex redirect), C-11 marshall-method, C-13 bradley-roofing, C-17 project-blst, P-4 hub-inbox, P-5 papamoa-info, P-23 plainblack-website. C-15 fitnesse got a file:// folder link to `fitnesse-research/`.Section B, new cards minted (4)

**PlainBlack (2026-06-11T08:13:18.616Z):**

> P-4 close-out audit: PARKED into the idea-mining package. The repo-to-Hub sweep half shipped via I-298 (2026-05-27 comment). Remaining: a per-file idea-mining pass over standalone HTMLs across papamoa-previews, plain-black-website, plainblack-client and plainblack-admin.

---

### Two new tool ideas to live on the PlainBlack site (P-8 / I-152)

**Two new tool ideas to live on the PB site, both make the site itself a conversion engine, not just a brochure.**

**1. "What playbooks are for me?", interactive recommender**

- Short quiz / chatbot on the PB site. Asks the visitor 4–6 questions about their business + pain. Recommends 1–3 matching PB playbooks / services / tools.
- Lowers the "I do not know what I need" friction. Same insight as the Build Map diagnostic frame (PB Services), but specifically scoped to existing PB playbooks + free tools.
- Output: a personalised "your kit" landing page with the recommendation set. Capture the email at the end. Push to relevant follow-up sequence.
- Build path: Custom GPT (fastest) or hosted Claude-API widget. Cross-link to Custom GPT intake form comment on MAIA service overview.

**2. "Why Isn't This Working?", client-side version**

- The existing "Why Isn't This Working?" PB tool (sec-tools tile, plainblackcreative.com/tools/...) is currently PB-internal-facing.
- Build a *customer-facing* version, visitor pastes their site URL, the tool runs a quick scan + tells them what is broken (SEO basics, social presence gaps, AI-readiness, GBP issues etc).
- Same pattern as the niche audit templates (PB Services) but as a self-serve free tool that captures leads.
- Jay observation: "Built ours, then do a demo for how a business could use this themselves." The tool itself is the case study.

**Why both belong on the PB homepage**

Either tool gives a visitor a tangible interaction in the first 30 seconds. The current PB homepage describes services; these tools *demonstrate* them. Same muscle as the V5 dynamic-personalisation landing page experiment (MAIA AI Consulting), the page does something specific to the visitor.

**Cross-card relevance**

- **Build Map diagnostic** (PB Services), the playbook recommender is a vertical slice of that broader diagnostic
- **"Why Isn't This Working?"** existing sec-tools card, needs a URL + page update if this customer-facing version ships
- **Niche audit templates** (PB Services), customer-facing audit tool reuses the templated audit logic
- **AI Proficiencies funnel** (MAIA AI Consulting), both tools sit naturally at the top of that funnel as proficiency entry points
- **30-day-demo → generic /tools pipeline** (PB Services), both qualify for permanent /tools homes once shipped

**Next:** playbook recommender is the faster build (one Custom GPT, 1–2 hours). Ship it first as a banner on the PB homepage. Measure visitor-to-quiz completion rate before investing in the second tool.

---

### Item 1Title (P-8 / I-516)

Item 1
Title: Instrument brief completion rate by section

Body:

Brief quality only matters if owners finish all 10 sections. Right now we have no signal on where people bail. Add lightweight telemetry, could be as simple as a worker endpoint that logs which section number was last touched on a given local-storage draft ID, fired on each blur. Then look at the curve once we have ~20 attempts. Hypothesis: there's a cliff somewhere around section 4-5 (the bottleneck/tried double whammy). Without this, we'll keep tuning prompt quality and ignore the real failure mode, which is non-completion.

Suggested project/client: PlainBlack website / briefs tool.

Item 2

Title: Decide policy for the budget gap in briefs

Body:

"Tight budget" is the most consistent gap in finished briefs. The clarifier asks for a number, owners decline, and the agency receiving the brief still can't quote without it. No prompt change fixes this, it's owner psychology. Three options to pick between: (a) leave as-is and accept that smart agencies will phase-propose; (b) make the budget question a soft-required field with a "range is fine: under $1k / $1-5k / $5k+" picker; (c) explicitly tell the user in the section copy that without a budget shape, quotes will come back generic, and let them choose. Worth a 10-minute call to decide which.

Suggested project/client: PlainBlack website / briefs tool.

Comments:

**PlainBlack (2026-06-12T04:02:38.105Z):**

> Moved from P-23 (PlainBlack Website) to P-8 (Marketing & Lead-Gen Ideas) on 2026-06-12: this is briefs-tool product work (completion-rate telemetry + budget-gap policy), not general website work.

---

### Package-design reference (P-12 / I-246)

**Package-design reference: should PB define its packages like ServiceSaver and like the JustDigitalMarketing “Launch” proposal that was sent to The Cave?** Two concrete comp examples to lift structural ideas from.

#### The two references

- **ServiceSaver NZ:** servicesaver.co.nz (https://www.servicesaver.co.nz/)
- **JDM proposal to The Cave (PDF attached):** `THE_CAVE-_JDM_Google_Ads_Launch_Proposal.pdf`, 11-page deck, Launch package $189/wk + $499 (was $599) setup, June 2024 dated.

#### JDM “Launch” package structure (extracted from PDF)

| Field | JDM Launch package |
| --- | --- |
| **Audience** | “Small to medium businesses who would like to start advertising with one channel, but want flexibility to switch between Google and Meta.” |
| **Recurring** | **$189/wk inc GST** (~$820/mo). No lock-in contracts. |
| **Setup fee** | $599 normal, **$499 discounted** (offer expired 15 Jun 2024). |
| **What’s in** | 1 channel (flexible) · up to 3 campaigns · dashboard & reporting · conversion tracking · 1 high-converting landing page · up to 3 static ad creatives (one-off) · dedicated marketing manager · no lock-in contracts. |
| **Brand framing** | “Australia’s best marketing talent” / Premier Google Partner / 18+ years / 5,000+ clients AU+NZ / 50+ industry awards / proprietary AI tools + reporting app. |

#### What’s actually useful from JDM’s structure

- **Weekly billing** ($189/wk) instead of monthly, same trick the No-Brainer Retainer uses ($200–$500/wk). Lower-friction price anchor.
- **One-off setup fee + recurring**, clean separation between “getting started” and “running.” PB’s First-Fix ($200) + retainer model already mirrors this.
- **“No lock-in” repeated 3 times**, psychological anchor against agency baggage. Pause-anytime equivalent.
- **Inclusion list as a checklist**, 8 bullets with green ticks. Easy mental tally for the buyer.
- **Personalised note from a “Digital Strategist”**, “Your Digital Strategist has selected this package based on your strategies requirements…”, makes the offer feel bespoke even when it’s templated.
- **Limited-time setup discount** ($599 → $499 before deadline), classic urgency mechanic.
- **Tier ladder hinted but not shown**, “If there are any inclusions you would like from another package above, please let your Strategist know!” suggests at least Launch / Growth / Scale tiers.

#### What’s NOT useful (the avoidable patterns)

- **Award-flexing**, the 50+ awards / Premier Google Partner page reads as agency-self-importance. PB voice would skip this entirely.
- **“Team of top-tier digital marketers + cutting-edge technology” copy**, generic agency-speak that PB’s manifesto explicitly avoids.
- **“Australia’s best marketing talent”**, superlative that’s impossible to verify. PB position is “just good, kind and honest” (Jay manifesto).
- **5,000 clients managed**, scale boast PB doesn’t have. Don’t fake what you don’t have; PB’s differentiator is the opposite (one operator, focused).

#### How this informs PB packages

- **Reuse the structural skeleton**: weekly price + setup fee + named package + 6–8 inclusion bullets + “no lock-in” line + tier-ladder hint.
- **Reject the voice + flex**: PB voice is anti-agency, anti-superlative. Use the structural skeleton with PB’s manifesto voice on top.
- **Map to PB’s actual ladder**, the 4-tier DIY-or-DI2gether funnel (item `mpj4t6kd-81lvl1lx`) plus the No-Brainer Retainer tiers (item `mpj47ys3-171ghr1b18`) already define the price points; this PDF gives the layout.
- **Compare price points**: JDM Launch ($189/wk = ~$820/mo) vs PB No-Brainer Retainer ($200/wk = ~$870/mo). Roughly the same band, PB sits in a familiar price range to anyone who’s seen JDM’s offers.

#### Open questions / loose ends

- **Pull up ServiceSaver before deciding**, the second comp Jay flagged. Worth comparing the two side-by-side before committing to a structure.
- **The Cave context**, this PDF is JDM’s proposal sent TO The Cave. Combined with Jay’s “I sold The Cave” line (item `mpj3hmos-w9383z`), the relationship layer needs clarifying. Was The Cave Jay’s business that JDM pitched? Or is Jay using this proposal as comparison intel because The Cave’s a current prospect?
- **Tier names**, JDM’s “Launch” implies Growth / Scale above it. PB’s tier-names probably want a non-corporate flavour. DIY-or-DI2gether’s tiers (Free / Subscribe / Paid Stuff / Hire Us) are already named, might map directly.
- **Page format**, JDM’s PDF is 11 pages. PB’s would probably be a Squarespace landing page per the digital-products thinking, not a PDF.
- **Inclusion-list specificity**, JDM’s list is concrete (“up to 3 campaigns,” “1 landing page,” “up to 3 static ad creatives”). PB’s current offer specs are mostly capability lists, not count lists. Worth tightening to counts so prospects know what they get.

#### Cross-card relevance

- **PB Services, DIY or DI2gether funnel** (item `mpj4t6kd-81lvl1lx`), this PDF’s layout language could fill the Paid Stuff / Hire Us tier pages.
- **PB Services, No-Brainer Retainer** (item `mpj47ys3-171ghr1b18`), price-point comp ($189/wk JDM vs $200/wk PB).
- **PB Services, AI Playbooks pricing** (item `mpj1jg6p-1b13l1jk3`), the “list inclusions as a checklist” pattern is exactly what the pricing-fork resolution needs.
- **PB Services, Quote Fit Filter** (item `mpj4m6ml-1j17161g11n`), $1,499 build offer already uses the 7-item inclusion checklist (the GPT critique made that explicit).
- **The Cave** (card `mpj0qndz-x1a1h1k1r1m`), relationship context for this PDF; cross-link comment below.
- **Credibility & Media, market intel report** (item `mpj2jmo7-1jp1o1741d`), ServiceSaver could be worth adding to the operator profile list as a NZ comparable.
**Next:** open ServiceSaver, lift one or two structural ideas to compare with JDM’s, then draft PB’s Squarespace tier pages using the structural skeleton (weekly price + setup fee + named tier + 6–8 inclusion bullets + “no lock-in” line) with PB-voice on top. Resolve the “I sold The Cave” question before referencing JDM’s proposal externally.

Comments:

**Jay:**

> **[Triage answers, 24 May 2026]**
>
> *JDM proposal comp*
>
> 1. **Pull up ServiceSaver before deciding tier structure?** → Yes, compare first
> 2. **The Cave context, was it Jay’s business JDM pitched, or current prospect?** → Jay’s prior business
> 3. **Adopt DIY-or-DI2gether tier names (Free / Subscribe / Paid Stuff / Hire Us)?** → No, invent PB tier names
> 4. **Page format for PB tier page?** → Captured in comment *You definitely know what website we use*
> 5. **Tighten capability lists into count lists ("up to 3 campaigns")?** → Skip / unsure

---

### Build Map diagnostic (P-12 / I-103)

**Build Map diagnostic, entry-point copy.**

Build Map is the "what do I actually need?" front door. Jay's spec for the diagnostic frame:

**Two doors**

```
[ I NEED HELP ]            [ I WANT SOMETHING BETTER ]
```

**Followed by:** "How's business?", single question, slider/spectrum from *shit / desperate* through to *great / scale it*.

**Why this matters**

- Stops PB selling someone the wrong product because they said "I need a website" when actually they need leads / a tidy-up / a strategy reset
- The two-door + one-spectrum frame routes people honestly: "I need help" + "desperate" goes to different next-step than "I want better" + "scaling"
- Becomes the canonical entry to every other PB service

**Routing logic to design (rough)**

- NEED HELP × shit/desperate → Diagnostic + free audit + cheapest paid path (DIY playbook / $100/wk SMB service)
- NEED HELP × ok-ish → Foundations Audit & Upgrade
- WANT BETTER × ok → Website Glow Up / Idea Engine
- WANT BETTER × scaling → Brand Sprint / Jarvis Deployment / custom dev tools

**Related:** Build Map already exists as a sec-tools card (plainblackcreative.com/build-map (https://www.plainblackcreative.com/build-map)), this item documents the diagnostic copy/UX to build into it.

---

### Refresh of the service catalogue (P-12 / I-102)

**Refresh of the service catalogue, names, promotions, what gets a landing page next.**

**Renames being considered**

- **Idea Engine → Spitball Session**, "strategy, but with more fun & imagination". Less corporate, more PB voice.

**Products to promote / give their own landing page**

- **Foundations Audit & Upgrade**, sits next to the existing playbook landers (sec-products: 90-Day Job Pipeline, AI Agents, Google Reviews, etc.)
- **Website Glow Ups**, "got a site? working fine? just a bit dated? Glow ups and tech/toy upgrades, just set your budget"
- **Jarvis Deployment**, for AI-tool installs at clients
- **"The Usual"**, a default-bundle option for "just do what you'd normally do"

**Section to add to the catalogue**

> Services > AI + Imagination = Almost Limitless Custom Dev Tools

**Existing service list (canonical, for reference)**

1. **Build Map**, "what do I actually need?" starting point. Diagnostic/custom-scope pathway before selling someone the wrong thing.
2. **Name & Frame**, brand naming, tagline, positioning direction, domain/trademark sanity checks, starter brand kit.
3. **Brand Sprint**, full brand foundations: logo, style kit, messaging framework, website, 90-day roadmap.
4. **Website Design & Development**, included in Brand Sprint, strong enough to stand alone when scoped via Build Map. Blog generator, CMS, AI, custom tools = add-ons.
5. **Messaging / Positioning Frameworks**, explain what you do without sounding like every other beige little agency brochure.
6. **Idea Engine** (→ Spitball Session?), monthly creative support: campaign ideas, content hooks, social scripts, trend sparks, marketing direction, no bloated retainer.
7. **AI Playbooks**, DIY low-cost personalised playbooks, "without drowning in module-three-lesson-seven nonsense."
8. **AI-enabled Templates & Prompt Libraries**, practical AI assets so owners don't have to become "prompt goblins."
9. **Business / Marketing Diagnostic**, emerging product: low-cost "what should I fix first?" bridge between playbooks and bigger service work.

**Cross-cutting upgrade items often bundled**: website SEO · AI · Google Business Profile · socials · Google reviews · website upgrade.

**Decision parked**: should website rebuilds always be one of two paths, (a) full Brand Sprint, or (b) Glow Up + Jarvis bolt-ons? Either way, blog-gen / CMS / AI tools live as add-ons, not as the headline.

---

### services (P-23 / I-670)

**services.html: replace duplicate inline sections with summary cards**

Brand Sprint, Name & Frame and Idea Engine now have full dedicated pages, but services.html still carries the long inline sections (around lines 350, 387, 425). Replace each with a short summary card linking to its dedicated page, or delete the duplicate.

*Split out of I-517 (P1) on 2026-06-12. Re-verified still outstanding in the 2026-06-11 close-out audit.*

---

### Sort Playbooks vs Services vs Free Tools (PlainBlack site IA) (P-23 / I-355)

**Sort Playbooks vs Services vs Free Tools (PB site IA)**

- Current PB site mixes paid services, free tools, and downloadable playbooks without clear separation. Visitor cannot tell what is free vs what costs.
- Three distinct buckets on the PB site / blogs:
- **Free Tools**, Build Map, Voice Twin, Customer Translator, Scam Checker, Why Isn't This Working? (existing sec-tools tiles)
- **Playbooks**, AI-driven low-cost DIY guides (existing sec-products landers: Marketing Playbook, 90-Day Job Pipeline, Roofing AI, AI Agents and Automations, AI-Powered Google Reviews)
- **Services**, done-with-you / done-for-you human-touched engagements (PB Services card items)

Visually distinguish on the PB site nav, three columns or three sections, not one undifferentiated mass
Naming consistency check, every item under each bucket follows the same naming template

---

*Split from Hub + Inbox item `mpibh6e0-jj316zw` on 2026-05-26. Sibling half (HTML import scan) stays on Hub.*

Comments:

**PlainBlack (2026-06-12T03:59:08.767Z):**

> Nav-IA decision folded in from I-517 close-out (2026-06-12): /first-fix, /brand-sprint, /name-frame, /idea-engine and /wtf are live but only reachable by direct link. Decide whether and where they sit in the site nav - same IA question as this Playbooks vs Services vs Free Tools sort, handle together.

---

## Appendix A. Borderline, Jay to call

Each item below is arguable. None were silently included or excluded. Classification reason is given at the end of each entry.

### End-of-session audit (2026-05-24) (P-4 / I-178)

**End-of-session audit (2026-05-24), scan of all sec-clients + sec-clients-list cards, flagging architectural issues to clean up. Sorted by priority.**

**State of the system right now**

- Cards in `sec-clients`: **45** · in `sec-clients-list`: 5
- Items total: **180** · unlinked items: **15**
- Urgent items open: **1** (the NZ register "Removed" status, see card Hub + Inbox)

---

**Priority 1, Open urgent that blocks everything downstream**

The NZ Companies register shows *PlainBlack Creative Limited* as **Removed**. Item `mpicf337-w21ewfb` on this card. Until that is resolved:

- The entire Credibility & Media plan is blocked
- Any new client contract has an unclear invoicing entity
- Any media outreach hits this in their due-diligence step

10 minutes on companiesoffice.govt.nz when Jay wakes. Highest single-item leverage in the whole system.

---

**Priority 2, Overloaded item buckets**

| Card | Items | Concern |
| --- | --- | --- |
| Marketing & Lead-Gen Ideas | **23** | Catch-all "parked ideas" bucket. Finding anything specific is hard. Strongest candidate for splitting. |
| Hub + Inbox | 20 | Platform housekeeping. Coherent scope, but a "Now" vs "Backlog" split would help. |
| PB Services | 17 | Productisation thinking. Acceptable for now. |
| Papamoa.info | 13 | Includes both the Jay-as-sales-manager work + earlier PB-builds-directory speculation. Could split: Carwyn sales work vs PB-side strategy. |
| Ecom (pre-existing) | 11 | Untouched in migration. Worth a onc |

Comments:

**Jay (2026-05-28T10:22:19.021Z):**

> **[Status update, 2026-05-28]** Since this audit (2026-05-24) here is what has shifted:
>
> **Priority 1 (NZ register Removed):** Resolved. PB now operates as Epic Events Limited t/a "PlainBlack Creative NZ". Originating urgent (mpicf337) and resolution note (mpkiouj9) both archived.**Priority 3 (tag taxonomy):** Replaced by the 2026-05-26 walkthrough taxonomy. `client/prospect/demo` retired; section now conveys client-vs-proj

**PlainBlack (2026-06-11T08:13:20.485Z):**

> P-4 close-out audit: PARKED into the hub-content-org package. The verifier confirmed the concerns have worsened since this was written: P-8 now 46 open, P-12 now 47, unlinked items 40. Package scope: split P-8, consolidate P-12 offers, triage the unlinked backlog, demo-card cleanup.

_Borderline reason: Primarily Hub content-org ops, but the audit explicitly references 'PB Services card items' with 17 productisation items (PapaMassive, AI Music, AI Hiring, PB Reno Company, Websites needing single-line summaries) and the NZ company registration resolution which unblocks client contracts and media. The note that P-8 has 47 items referencing 'consolidate P-12 offers' is directly adjacent to the services overhaul._

---

### TODO: upgrade the Website Page Performance Dashboard so it's good enough Jay never needs (P-4 / I-243)

**TODO: upgrade the Website Page Performance Dashboard so it’s good enough Jay never needs to open Google Analytics again.**

> “Website Page Performance Dashboard, Upgrade styling/UI + What else, so I never need Google Analytics?”

#### The two threads

- **Styling / UI upgrade**, whatever it looks like today, needs a pass to PB visual identity (dark / mint, JetBrains Mono labels, Syne headlines, the carousel / Bradley mockup family).
- **Feature parity with GA**, what does Jay actually use GA for today? Each one needs to live in the dashboard or it’ll keep getting opened.

#### What “never need GA” probably means
Inferred from typical PB-site use:

- Page views per page over time (with sortable rolling 7d / 28d / 90d).
- Source breakdown (organic / direct / social / referrer-by-domain).
- Bounce / engagement signals per page.
- Top pages by traffic / by conversion / by drop-off.
- Live / today-so-far counter.
- Event tracking (CTA clicks, “email this to yourself,” bookmark, scroll-to-CTA, Stripe pageview).
- OG-share count or proxy (link clicks from social).

#### Open questions / context Jay needs to confirm
**Where does the dashboard live today?** URL? Is it inside the PB admin (admin.plainblackcreative.com), inside Hub, a separate Looker page, something Jay built recently?**Data source**, GA4 API, server logs, Cloudflare analytics, custom Make.com sheet, or something bespoke?**One dashboard or per-site?** Just plainblackcreative.com, or does it cover Papamoa.info, BuddyShift, Bradley landing page, McIndoe future site, etc.?**Refresh cadence**, real-time, hourly, daily?**What does Jay actually open GA for?** Pin those 3&n

Comments:

**Jay (2026-05-24T07:29:15.904Z):**

> **[Triage answers, 24 May 2026]**
>
> *Analytics dashboard*
>
> **Where does the dashboard live today?**
> → Inside PB admin**Data source?**
> → Skip / unsure**One dashboard or per-site?**
> → Captured in comment
> *This white-labels and scales***Refresh cadence?**
> → Skip / unsure**The 3–5 specific things Jay actually opens GA for?**
> → Captured in

**PlainBlack (2026-06-11T08:13:22.056Z):**

> P-4 close-out audit: PARKED into the analytics-dashboard package. The dashboard is website-overview.html (708 lines) running on demo data; the smallest real slice is deploying the worker/analytics GraphQL proxy, then a PB restyle. White-label later.

**PlainBlack (2026-06-11T10:32:29.755Z):**

> **[Extracted from I-160 before deletion, 2026-06-11]** The multi-layer analytics plan, privacy-conservative and visible from Hub:
>
> Cloudflare Web Analytics (cookieless aggregate): partial, roll to all admin HTMLs + public siteGA4 (G-GP1WQCC0DY, behavioural/funnel): on blog-gen.html (commit 103284c); the other 10 admin pages uncoveredGoogle Search Console: verify ownership for plainblackcreative.com + admin subdomain, submit sitemapBing Webmast

**PlainBlack (2026-06-11T11:35:09.158Z):**

> **[2026-06-11] Bing Webmaster Tools DONE.** Account created via Google SSO (jkbrownnz), all 3 GSC sites imported (plainblackcreative.com, thecave.nz, www.tacalakes.co.nz), sitemap submitted and processing. Also verified: GSC domain-verified, Clarity installed on the public site, GA4 live. Remaining from the analytics plan: Meta Pixel + LinkedIn tag (before first paid ad), UTM convention, consent banner, sec-analytics tiles for Bing/Meta/LinkedIn/CF.

_Borderline reason: Analytics dashboard is internal tooling, but it is framed as a white-label scalable product ('this white-labels and scales' Jay comment) and touches the SEO/audit service angle (Search Console, GA4, Bing Webmaster, Meta Pixel before first paid ad). The audit/SEO capabilities are directly relevant to Digital Footprint Audit service definition._

---

### Hub news feeds (P-4 / I-660)

**Hub news feeds, Claude-read: The Rundown AI, TL;DR and similar.**

Jay gets these daily newsletters and the content is good, but there is no time to read them and they should NOT live in the personal email inbox. Triaged with Jay 2026-06-11; what he actually wants:

- Feeds like these land in the Hub, not the inbox (the Gmail rules thread on I-354 already says newsletters deliver silently to folders).
- Claude reads each issue and surfaces only the useful bits: news, tools and ideas PB could implement in its workflows, each with a one-line why-it-matters-to-us.
- Output is a short digest surface in the Hub; anything actionable can be promoted to a real item or card with one click.

Comments:

**PlainBlack (2026-06-11T11:08:08.518Z):**

> **[Cross-links]** Sister idea: I-192 (personal AI agent, a daily TL;DR digest pipeline "so the phone gets quieter") on the AI Agents card covers the personal side; this item is the Hub-side implementation. Also pairs with I-354 (newsletter Gmail rules) and I-488 ai-triage-v2 (same read-and-surface muscle). No roadmap package yet; natural fit alongside or after gmail-v2-send since the feeds arrive through the synced mailbox.

_Borderline reason: Primarily Hub-ops (newsletter ingestion pipeline), but the Claude-read digest of AI tools/news directly feeds PB capability-scouting which informs AI-services productisation. The comment explicitly calls out 'tools and ideas PB could implement in its workflows' as the output goal._

---

### Content & UGC strategy (P-8 / I-117)

**Content & UGC strategy, leverage every channel, build content engines now so PB does not need staff for a year.**

**The thesis** (Jay)

> "Content & AI but also content. And UGC. We just need to be content creators and leverage all our channels. We will need staff in a year."

**Reference**

- Gary Vee, YouTube video (https://www.youtube.com/watch?v=szvcdKdFjBU) on documenting vs creating, leveraging all channels
- Search The Cave on IG + FB, existing PB-adjacent content channel with content already in it

**The AI loop**

The AI algorithm will show the social proof + validate what people want. So: produce volume → measure what algorithm rewards → double down. AI does the production cost lift.

**Practical channels to weaponise**

- LinkedIn (Jay personal + PB), for the AI-jobs carousel content (cross-link: Recruitment card item)
- Instagram + TikTok, UGC-style PB-tools-in-action shorts
- YouTube, long-form walk-throughs of MAIA / playbooks / audits
- FB, local Papamoa community angle
- Blog (PB website), SEO + lead-magnet

**Cross-card relevance**

- Spec-Site Outreach & Notice-and-Post leverage on this card both already assume content production as a downstream output ("I post about them anyway")
- The Recruitment card LinkedIn carousel strategy is a specific instance of this
- Arthritis NZ card relies on content production for credibility
- Hayden Kelly amplification needs content too

**What this is NOT**, a playbook. It is a service muscle PB needs to build internally before pitching it to clients. Internal capability first, then sell it.

**Next:** pick one channel + one cadence + one content format. Stop trying to do all of them. The "AI algorithm validates" only works if there is consistent output.

Comments:

**Jay (2026-05-23T11:56:10.361Z):**

> **[Sub-brand idea, "Tentacles"]**
>
> Working name for the PB social-content arm, TikTok & IG, 100% AI-driven (agents). Sister to PB main brand: PB = the consulting / service face; Tentacles = the always-on social-content arm that reaches everywhere.
>
> **What Tentacles does**
>
> - Daily AI-trends-and-tricks content (see Jay Career #1 Priority item, daily AI learning habit feeds this directly)
> - UGC character work, recurring AI avatars / voices (HeyGen Ian already in scope on blog production upgrade item)
> - Repurposes every PB blog into TikTok + IG Reels formats
> - Tests proficiency content (Custom GPT walkthroughs, AI agent demos) in short-form
>
> **Why a sub-brand vs PB-direct posting**
>
> - Lets PB stay premium / consultative while Tentacles can be louder, weirder, more meme-y
> - Different content tone risk-isolated from the main brand
> - Tentacles is allowed to fail at high volume; PB is not
> - If Tentacles takes off, can be packaged as a service ("we will run your business Tentacles arm")
>
> **Open questions**
>
> - "Tentacles" as a name, keep, or workshop? Memorable but easily mis-read. Alternatives: PB Wires / PB Outpost / PB Static / PB Frequency.
> - How many tentacles (channels)? Start with TikTok + IG, add YouTube Shorts + LinkedIn later.
> - Who fronts it on-camera? AI avatars (HeyGen), Ian, Jay, or all three?
>
> Cross-link: this is the distribution arm for the PB AI Proficiencies & Help proficiency content (MAIA AI Consulting card) and Jay daily AI learnings (Jay Career card).

_Borderline reason: Content-engine strategy for PB own marketing (Tentacles sub-brand), no direct service definition but informs messaging and AI tools positioning_

---

### Idea: a survey tool with a built-in timer that auto-submits / auto-closes when the (P-8 / I-143)

**Idea: a survey tool with a built-in timer that auto-submits / auto-closes when the promised time runs out.** "Just a minute of your time" stops being a lie.

**The insight**

Every survey says "just a minute" or "2 minutes of your time." Almost every survey takes 5–15 minutes. Respondents learn not to trust the promise, click rates drop, the next survey lies harder, click rates drop more.

A survey tool that *enforces* the time promise inverts the trust curve. Respondents trust the timer → click through → and the data is honest because incomplete responses (auto-submitted at timer end) are themselves a signal.

**Mechanics**

- Survey author sets the time budget upfront ("60 seconds", "2 minutes")
- Respondent sees a visible countdown timer the whole time
- When time hits zero: form auto-submits whatever was answered
- Author gets two segments of data: completers + partial-completers (with which questions ran out the clock)
- Bonus: question-level timing data shows which questions are slow, feedback for the next survey

**Why this is interesting beyond a one-off tool**

- Truthful UX is becoming a competitive differentiator (cookie banners, GDPR forms, "we promise" buttons that lie are exhausting)
- Reuses the same productisation muscle as the rest of the PB tool catalogue, one config-driven HTML survey, swap variables per client
- Could be a free PB tool that drives sign-ups for paid services (similar to Build Map / Voice Twin sec-tools tiles)
- Audit-style use: PB collects customer feedback from clients faster and more honestly than typical NPS chains

**Where it could fit in the PB tool catalogue**

- Free tool at `tools.plainblackcreative.com/just-a-minute`, joins Daily Distillery / Voice Twin / Why Isn't This Working? / Build Map
- Or pricing it: $19 one-off survey, $9/mo unlimited (low ticket, high volume)
- Or bundled into the niche audit templates, collect 60s of client feedback before the audit call

**Cross-card relevance**

- Sits alongside Job-Pitch Tool / Legacy Pages / Digital Coffee Card / Fiverr-alt / AI Reno Tool / Custom GPT intake / SERP scraper (this card) as parked product concepts
- Productisation pipeline (PB Services), 30-day-build candidate. Probably a single weekend build.
- Could be the lead-magnet capture tool for the AI Hiring system (Recruitment card), quick "what is the hiring pain" survey

**Next:** if quick weekend build slot opens, knock out a v1 with one config (question list, time budget) and ship it as a free PB tool tile. See if anyone uses it.

_Borderline reason: Survey micro-tool concept, could be a PB tool/playbook component but no direct service, pricing, or positioning angle for the overhaul_

---

### Content campaign (P-8 / I-166)

**Content campaign, build FREE websites for other website designers, post before/after with objective metrics (Lighthouse, SEO, Core Web Vitals).** Audience = designers, not end clients. Goal = peer respect + white-label inbound + recruiting pipeline.

**Why target designers, not businesses**

- Designers respect objective numbers. Lighthouse score going from 47 → 96 is undeniable.
- Designers refer the clients they can not / will not handle. Each respected designer is a referral pipe.
- Designers are the natural buyer for the white-label all PB tools (#) agency pack (Productisation batch on this card), show them what the tools do on their own work first, then sell them the licence.
- Designers gossip + share. Designer-to-designer content travels in a closed loop PB has not penetrated yet.

**The format per post**

- "Before", designer original site + Lighthouse scores + a couple of SEO/AEO gaps highlighted
- "What we changed", the 3–5 concrete AI-tooled changes PB made
- "After", same Lighthouse scores, same SEO checks, same Core Web Vitals. Side-by-side.
- Time spent, show that AI tools cut a 40hr human job to ~4hrs PB time. The provocation IS the pitch.
- Designer credit, name + link them. They are not the target of the burn; they are the case study. Their permission upfront, glowing testimonial at the back.

**Where it lives in the content stack**

- **LinkedIn**, primary channel. Designers live there.
- **YouTube**, "AI-and-I make things better" channel (content engine batch on this card), the long-form before/after walkthrough belongs there
- **Tentacles socials**, short-form clips of the score jumps
- **PB blog**, long-form write-up per build, with embedded comparison
- **30 Day Build Challenge** (sec-clients), could be the format for half the 30 days

**The recruiting backside**

If a designer sees the speed + quality and asks "how do I work with you", PB has two answers:

1. **White-label license**, agency pack, they use PB tools on their own clients (cross-link to white-label items on this card)
2. **Sub-contract**, PB takes some of their overflow work, AI-tools the build, they keep the client relationship

Both routes monetise the same content campaign.

**The selection criteria for which designers to feature**

- Their site is genuinely Lighthouse-poor (otherwise the before/after is small)
- They are not direct PB competition in the same Papamoa patch (cross-link to "one client per industry" rule)
- They are confident enough to consent to being publicly featured (kill the petty ones up front)
- Their portfolio shows they have clients PB could not / would not take, different niches, different price points

**Risks to design through**

- Could look like a flex / put-down if Jay tone is wrong. Calibrate hard, the designer is the partner, not the target.
- Some designers will feel competitive rather than collaborative. Filter for the ones who already publicly share work and discuss craft.
- Lighthouse and SEO scores fluctuate. Always include the date + viewport + connection profile to keep the comparison honest.
- If PB free build is followed by the designer reverting it, the before/after evidence becomes the only proof. Capture screenshots + lighthouse reports at the moment of comparison.

**Cross-card relevance**

- **White-label all PB tools + white-label Blog Generator** (this card), designer audience matches; this content campaign is the lead-gen for those products
- **Niche-lock motion + bad-ad-rebuild outreach** (this card), same shape (free fix → content → conversion), different audience
- **"Already trying" 10x production model** (this card), designers ARE already trying; they fit the targeting refinement
- **Content engine batch + Tentacles + 30 Day Build Challenge content commitment**, distribution stack
- **Recruitment AI Agent + AI Hiring system** (Recruitment), designer overflow → PB sub-contracting work IS a recruitment play with extra steps
- **Websites v2 No Brainer Retainer** (PB Services), the service being demonstrated, just at zero-cost case-study tier

**Next:** identify 5 NZ-based designers with consent-worthy sites + share-worthy public presence. Pick the one whose Lighthouse is most obviously poor + who has the warmest receptiveness. Build their site free. Post the before/after with their name + link + quote. See what designer-to-designer DMs that triggers.

_Borderline reason: Campaign to build free sites for designers as proof/credibility, services angle (Website group capability) but primarily a lead-gen/credibility play_

---

### Newsletter teardown content series (P-8 / I-213)

**Newsletter teardown content series, PB opens, judges, rips, and fixes (or offers alternatives to) other people’s email newsletters.** Same teardown-CTA mechanic as the IG carousel (“DM the ad, we’ll tell you where the money leaked”) applied to a different bad-marketing surface.

> Why isn’t this just a post? Why should I care? If you’re OCD/InboxZero obsessed like me. noreply@...you’re a fucking cunt.
> 
> Open them, judge them, rip them and make them better or offer alternative.
> 
> The Marriot ones! I’ve unsubscribed 10x ya fucks.

#### The thesis (Jay’s critique pattern)

| Sin | The PB question |
| --- | --- |
| **Could be a post** | “Why isn’t this just a post?”, if it adds nothing inbox-specific, it shouldn’t be in inbox. |
| **No reader-side value** | “Why should I care?”, the basic value-prop test most senders fail. |
| **noreply@ sender** | Jay-voice gold: *“noreply@…you’re a fucking cunt.”*, the asymmetry of asking for attention while blocking reply is on-brand to call out. |
| **Won’t honour unsubscribe** | *“The Marriot ones! I’ve unsubscribed 10x ya fucks.”*, named target. Worth a real Marriott teardown to ship the series with stakes. |

#### The format

- **Open**, screenshot or render the newsletter as-received.
- **Judge**, PB voice scoring against the 4-sin checklist + anything else that lands.
- **Rip**, mark up what’s broken, what’s lazy, what’s borrowed.
- **Fix**, rewrite a better version, or offer the alternative (“this should have been a post” / “this should have been silence”).

#### Audience signal
Jay self-identifies as “OCD / InboxZero obsessed”, that’s the audience tell. The series targets readers who feel email volume as a cost, not a service. Strong overlap with the “burn it down, keep what matters” energy already in PB voice.

#### Format / channel options

- **Blog series**, each teardown a post. Stacks for SEO + AEO long-tail (“Marriott newsletter review” etc.).
- **IG carousel teardown**, reuses the 7-frame stop-the-scroll format from the “Your ad campaign didn’t work” carousel.
- **Newsletter ITSELF**, meta-play: send a PB newsletter that tears down other newsletters. Risk-of-hypocrisy is the whole joke.
- **X / LinkedIn thread**, quick wins on each one, low production cost.
- **Submit-yours mechanic**, readers send their inbox stinkers, PB picks one a week. Same DM-AUDIT funnel pattern.

#### Open questions

- Named targets, safe to call out Marriott (and others) publicly, or anonymise to dodge legal noise?
- Cadence, weekly column, monthly bigger teardown, or sporadic when something pisses Jay off?
- Series name, “Just a Post?” / “noreply@” / “Unsubscribed Again” / “The Inbox Audit” / something Jay-voiced.
- Does this become a PB service offer too, “your newsletter audited” as a paid First-Fix variant for email-marketing-heavy clients?
- Tone calibration, the verbatim language above is on-brand for organic socials / blog, but needs softening for paid ads / formal client outreach.

#### Cross-card relevance

- **Marketing & Lead-Gen Ideas, IG carousel (DM AUDIT)** (item `mpj1z4pv-119q1g113`), same teardown-CTA mechanic, different surface. Sibling content format.
- **PB Services, First-Fix / Spitball Sessions** (item `mpj2cw45-1r618u1p18`), “your newsletter audited” could be a productised variant of First-Fix for email-heavy clients.
- **Credibility & Media, market intel report** (item `mpj2jmo7-1jp1o1741d`), Tactic 4 (interactive quiz lead magnet) + Gap 4 (publish proprietary research) suggest the “submit yours” mechanic could be wrapped into a quarterly “State of NZ Newsletters” teardown report.
- **30 Day Build Challenge**, one day’s build could be the first published teardown (Marriott as the named opener).
**Next:** pick a series name, pick the format (carousel vs blog vs meta-newsletter), draft the Marriott teardown as the opener, named stakes from day one beats anonymous theory. If it ships, fold into either the content engine or a First-Fix-style paid variant.

Comments:

**Jay (2026-05-24T01:32:55.544Z):**

> **[Cross-link, sibling PB-voice call-out content]**
>
> New item on this card (id `mpj3s0dw-1j1hxl1li`): “Business owners who pretend to care” call-out content seed, prompted by Loretta (Mitre10 Papamoa) ghosting Jay’s brain-pick request while running a community survey campaign.
>
> **Why it matters here:** same Open / Judge / Rip / Fix structure from your newsletter teardowns, applied to live business owners. Format-portability validates the broader PB-voice public-critique posture. Series candidate.

**Jay (2026-05-24T07:56:59.330Z):**

> **[Triage answers, 24 May 2026]**
>
> *Newsletter-teardown series*
>
> 1. **Named targets (Marriott etc.), call out publicly?** → Mix per teardown
> 2. **Cadence?** → Sporadic, when something pisses Jay off
> 3. **Series name?** → Skip / unsure
> 4. **Become a paid First-Fix variant ("your newsletter audited")?** → Skip / unsure
> 5. **Tone calibration, softer for paid ads / formal outreach?** → Yes, soften for those channels

_Borderline reason: Content series for PB positioning/voice, indirect services angle; could reinforce messaging segments but no direct service definition_

---

### Branded and Custom Invoice generator (P-8 / I-22)

Branded and Custom Invoice generator
Consolidating, GST, receivable etc 
Payroll
"NADA"

Comments:

**Jay (2026-05-21T08:45:55.853Z):**

> Ideas?

**Ian (2026-05-21T08:47:17.828Z):**

> Fully personalised, not generic, why do what everyone else is doing and why pay for all the funtions you don't use?

_Borderline reason: Productised invoice/payroll tool idea, not a core PB service but fits tools-strategy and AI-tools productisation angle_

---

### PlainBlack-voice call-out content (P-8 / I-225)

**PB-voice call-out content: “Business owners who pretend to care.” Seed example is Loretta (owner, Mitre10 Papamoa). Sibling content surface to the Newsletter Teardown series.**

#### The Loretta situation (verbatim context)

> I asked her for a small favour (let me pick her brain), she said she was too busy (fair enough), then I asked if I could ask her marketing person, never replied. Now she’s all over social media asking the community to take time to support her survey thing to remove the toll on the road that goes to where she’s moving her business to a brand new huge location.
> 
> So I want to call out business owners who pretend to care, or are unaware of their hypocrisy.
> 
> Post example about shitty customer service ruins any marketing.

#### The drafted post (verbatim)

> Hi Loretta
> 
> I’ve spent over $10k at Mitre10 Papamoa.
> I’ve filled out 20+ surveys.
> I’m friendly to all the staff.
> I could get it all cheaper at Bunnings.
> No reply seems you’re not interested in me, or my business.
*The structure is strong, five factual lines, no insult, no characterisation of intent. The implied argument lands without overreaching.*

#### The broader play this seeds
A recurring content thread, **“Business owners who pretend to care”**, that uses PB’s own customer-side stories to demonstrate the principle: *shitty customer service ruins any marketing.*

- Each post = one factual receipts-driven micro-essay about a named (or anonymised) business owner.
- Voice is consistent with the Newsletter Teardown play and the IG carousel CTAs, PB earns the right to advise by showing PB notices.
- Mechanic: customers vote with attention. Owners who don’t reply lose. Survey-mongers who don’t reciprocate lose harder.

#### Sensitivities, before any of this goes public

| Risk | Mitigation |
| --- | --- |
| **Defamation**, calling out a named business owner. | Stick to *factual* claims about Jay’s own experience (spend / surveys / no reply). Don’t characterise her intent (“she’s a hypocrite”), let the reader infer. |
| **Owner vs brand distinction**. | Mitre10 the brand is a franchise; Loretta personally owns the Papamoa store. Be precise about which one the post is about, especially if the brand’s national legal team gets twitchy. |
| **Local pile-on going wrong**. | Small community. Loretta has loyal staff/customers who’ll defend her. Anticipate counter-narratives (“she’s busy moving the business”). |
| **Reputational blowback on PB**. | Some prospects will love it (alignment with blunt PB voice); others will quietly cross PB off the list as “risky to engage”. Worth being clear-eyed about which segment matters more. |
| **Loretta might reply after the post**. | Have a private follow-up ready. “If you’d like to talk now, here’s how.” Closes the loop honestly. |

#### Open decisions

- **Channel**, LinkedIn (most reach for business owners), Facebook (most reach for the Papamoa community), X (least local but PB-voice native), Google Review on Mitre10 Papamoa (most permanent)?
- **Named or anonymised**, “Hi Loretta” specific vs “Hi [Papamoa business owner I won’t name]” deniable. Named lands harder, anonymised reduces risk.
- **Series framing**, one-off, or kick off the recurring “business owners who pretend to care” series with this as #1?
- **Mitre10 vs Loretta personally**, precise distinction in the post copy.
- **Timing**, Loretta’s currently mid-campaign (toll survey). Posting now is most contextually relevant but also most adversarial. After the campaign would land cooler.
- **Tom Rutherford MP overlap**, tolls / Papamoa roading are political. Tom Rutherford prospect card may have crossover. Worth a sanity check on whether this post awkwardly intersects PB’s relationship with him.

#### Cross-card relevance

- **Marketing & Lead-Gen Ideas, Newsletter teardown series** (item `mpj2qdzm-m1r0f52`), sibling PB-voice public critique. Different surface (real business owners vs corporate emails), same logic.
- **Credibility & Media, positioning + pricing draft** (item `mpj3hmos-w9383z`), “helping locals help other locals” positioning sits awkwardly with calling out a local by name; needs squaring.
- **Papamoa.info, Catherine BOPNZ** (item `mpj21sbt-j1d1oizw`), resolves the earlier needs-clarification flag on Loretta. See cross-link comment.
- **Tom Rutherford MP** (card `mpj0smjn-10bt1bw11`, `prospect`), Papamoa roading / tolls is his lane. Worth a tap to make sure this post doesn’t friendly-fire.
- **Hospitality prospect family**, this post could be received as “PB calls out local owners who ignore him” by Blackberry / Pizza Pundits / Aunty’s / Grill & Green. Worth thinking about how prospects feel reading it.
**Next:** sit with the post for 24 hours before posting. If it still feels right, post on the channel that lands the hardest (likely Facebook for community reach) with the named version. Have a private follow-up message to Loretta ready in case she replies. Decide whether this kicks off a series or stays one-off.

_Borderline reason: Brand-voice content targeting audience segment, relevant to messaging tone and segments (burned-by-agency) but primarily a content piece_

---

### Strategic insight (P-8 / I-242)

**Strategic insight: PB should host a podcast because hosting elevates the host.** Visibility move via convening other people’s audiences, not Jay’s monologue.

> “We need to do a podcast, because the person who hosts the party becomes popular.”

#### Why it’s a good principle

- **Guests bring their audiences.** Each episode hands PB a curated chunk of someone else’s reach.
- **Host position = authority by association.** Jay doesn’t need to prove he’s the smartest; the guests carry the credibility, PB curates the room.
- **Content-engine compounding.** Each episode = one long-form + several shorts + a blog + LinkedIn / IG quotes. Maps directly onto the “100x $100 videos” manifesto from item `mpj4ijyf-r1ku1530`.
- **Network surface.** “Want to come on the podcast?” is the warmest cold outreach there is.

#### Open decisions before this becomes anything

- **Niche / theme**, AI & small business / local Tauranga business stories / “business owners who pretend to care” / something Jay-Ian-flavoured? Tight theme beats broad.
- **Host configuration**, Jay solo, Jay + Ian, or Jay + a rotating co-host? Ian co-host already alluded to in the manifesto.
- **Format**, long-form interview (Joe Rogan-style), short tight conversation (10–20 min, easier sell to guests), or a hybrid?
- **Cadence**, weekly is the standard, monthly is sustainable for a solo operator. Probably start fortnightly.
- **Production substrate**, this is where the McIndoe pitch overlaps: Brandon does this for a living. Could PB and McIndoe collaborate (PB hosts; Brandon edits)?
- **First 3 guests**, warm names from PB’s existing prospect / client pool: Brandon (McIndoe), Carwyn (Papamoa.info), Tom Rutherford MP, one of the trades clients?
- **Voice calibration**, Jay’s voice profile (item `mpj40s1k-11t1kdb1c`) translates well to audio (rant + empathy + Sinek/Gary Vee citations + Monty Python). Test once before committing to format.

#### Cross-card relevance

- **McIndoe Media × Xplora pitch** (item `mpj2w21i-1nzpc21g`), Brandon already does podcast-ish long-form for a living. Co-production / production-support is a natural overlap.
- **Credibility & Media, market intel report** (item `mpj2jmo7-1jp1o1741d`), Gap 4 (publish proprietary research) and the “sell taste, strategy, skills” thesis. Podcast hosting IS the proprietary-content moat for a small operator.
- **Credibility & Media, test organic first principle** (item `mpj4v1ok-h7vqp1r`), podcast is the most organic content surface there is. Plays into the principle.
- **Marketing & Lead-Gen Ideas, LinkedIn content brief** (item `mpj4aa7t-13c1kl1r0`), each episode feeds the content roster (short clips + quote tiles + writeups).
- **Jay Career, manifesto (Ed-as-a-sparky)** (item `mpj4ijyf-r1ku1530`), tension: podcast is heavier production than “10 hours a week.” Worth squaring before committing.
**Next:** pick a niche / theme (one sentence), decide solo vs co-host, talk to Brandon about whether a co-production / production-support arrangement fits the McIndoe relationship. Record one pilot episode before investing in branding, format, schedule.

Comments:

**PlainBlack (2026-06-12T04:57:31.230Z):**

> [Triage P-19] Moved from P-19 Credibility & Media → P-8 Marketing & Lead-Gen Ideas during workspace re-sort.

_Borderline reason: Podcast as credibility/visibility channel, no direct service definition but could inform messaging and segment reach_

---

### Blog idea archive (P-8 / I-273)

**Blog idea archive: “Can you even grow on socials if you don’t reel?”** Honest take on social growth without video, plus how to video if you don’t want to.

#### The idea (verbatim)

> **BLOG: Can you even grow on socials if you don’t reel?**, in this phase of civilization, how to succeed if you really don’t want to video (and how to video if you don’t want to video)
> 
> Doesn’t matter how good your product is, if no-one knows about it, you have no business.
> 
> If guru advice is to post consistently for 30 days, and you don’t get the results, what do you do?
> 
> Is anyone killing it on social media organically without videos?

#### The angles the post sets up

- **Axiom:** “Doesn’t matter how good your product is, if no-one knows about it, you have no business.” Opens the post.
- **The video question:** can you actually grow without it, or is it the price of entry now?
- **The 30-day fallacy:** guru advice to post-consistently-for-30-days frequently doesn’t work; what do you actually do when it doesn’t?
- **The case-study question:** is anyone actually killing it organically without video? Probably some, worth finding 2-3 named examples to anchor the post.
- **The faceless-video escape hatch:** “how to video if you don’t want to video”, AI-generated voiceovers, screen-recordings, B-roll-only edits, the whole faceless-content playbook.

#### Cross-card relevance (light)

- **Jay Career, AI content gen skill-up (faceless video focus)** (item `mpj3logj-1c1ji7b1h`), Jay’s own learning thread on faceless TikTok. Writing this post forces him to test his own thesis.
- **Credibility & Media, test organic first principle** (item `mpj4v1ok-h7vqp1r`), the “30 days didn’t work, now what” question lands directly here.
- **Marketing & Lead-Gen Ideas, LinkedIn content brief** (item `mpj4aa7t-13c1kl1r0`), candidate post for the brief.
- **Marketing & Lead-Gen Ideas, Newsletter teardown / call-out series**, same PB-voice anti-guru posture.

_Borderline reason: Content/social blog idea, audience-building angle but no direct service, pricing, or playbook connection to current overhaul_

---

### We’ve been doing website since before Debbie did Dallas (P-8 / I-456)

We’ve been doing website since before Debbie did Dallas

_Borderline reason: Single copy line for PB website-experience positioning, arguable as messaging asset for website service group but minimal content_

---

### 30 Day Challenge Links to salvage (P-8 / I-567)

30 Day Challenge Links to salvage:

Tracker https://admin.plainblackcreative.com/challenge-tracker

Public Page https://www.plainblackcreative.com/challenge

Back Half doc https://www.plainblackcreative.com/30-day-back-half-poc.html

Comments:

**Jay (2026-06-07T06:00:13.192Z):**

> * 404 game tweak (raccoon + bin + machine gun) ship + post (Hub + Inbox housekeeping)* Suno demo for Grill & Green + ReDefined (AI Music for NZ Retailers)* BLST quote tool live launch + case study post (BLST card)* "How we ranked #1 on Google for 'Cunt'" SEO experiment write-up (PB Services Tagline item)* Custom GPT intake form ship (MAIA AI Consulting)* Matrix-style chatbot UI demo (MAIA)* One Niche Audit Template per week (PB Services)* Email-to-info@ migration post-mortem (housekeeping)* Calendly setup walkthrough (housekeeping)Cross-card relevance* Existing post-slot challenge item on this card, that one slot just opened up, this challenge supplies it* Content engine batch (Marketing & Lead-Gen Ideas), this is the operational instance of that strategy* Jay Career #1 Priority daily AI learning, feeds straight into 30-day content* Tentacles / Content+UGC (Marketing & Lead-Gen Ideas), distribution arm* Blog Generator marketing campaign (Marketing & Lead-Gen Ideas, new item), sister item, this challenge IS the marketing for Blog Generator* Blog production upgrade (Hub + Inbox), every post must follow the 5-asset release formatRundown AI or Stanley Henry ideas?

**Jay (2026-06-07T06:00:55.781Z):**

> Day 23, The Voice Signature Mural Pull a cafe's last 200 Google reviews via API. Run them through a typographic generator. Output a Voice Signature Mural: a poster made of the actual words customers use about the cafe, weighted by frequency. Then print it as a 2m vinyl, shoot a 30-second video installing it on the cafe's wall, post the whole thing.Day 24, The Slow Week Engine Input the trade and location. The tool pulls the live 14-day MetService forecast. Detects dry windows. Generates a Slow Week Special campaign for those windows: SMS to past customers, Google Business Profile post, Facebook post, and a one-page landing page we host on a free subdomain, publishable in two clicks.Day 25, The Calendar That Shakes A draggable month grid that fills itself. Each cell is a real post: hook, draft caption, image direction, CTA, business goal, difficulty rating, and one line that says 'this post exists because…' so the user learns the strategy as they read. Hit 'shake the calendar' to re-roll only the slots they don't like. One-click handoff to Day 10's blog generator turns any cell into a finished PB-voice draft.Day 26, The Voice Fingerprint Paste a URL or copy. The tool runs four passes side by side. 1. The Voice Fingerprint: radial chart of jargon, hedge words, generic phrases. 2. The Slop Detector: flags keyword-stuffed copy. 3. The Technical Audit: alt tags, H1, schema, Lighthouse. 4. The Hypocrisy Check: same audit on the agency's own client sites.Day 27, The Agency Audit Two tools, one URL, every other agency exposed. Tool 1 (Quote Decoder): paste an agency proposal, get the translation, with specific bullshit deliverables called out by name. Tool 2 (Versus Table): the PlainBlack column updates dynamically with what the user actually needs; the Everyone Else column stays frozen no matter what the user inputs (Monthly Retainer / Increase Ad Spend / Monthly Report / Bonus: Free Zoom Call).Day 29, The Founder Script Three inputs: your business, what you did this week, what you want viewers to do next. The tool generates a 60- to 90-second script in your voice (pulled from your Voice Twin from Day 17), with stage directions, b-roll suggestions, and a recommended hook in the first three seconds. Five script variants per generation. Output: a teleprompter-ready script page at plainblackcreative.com/scripts/[slug] (or JSON payload ready for the Day 30 build).

**PlainBlack (2026-06-11T08:13:30.687Z):**

> P-4 close-out audit: confirmed live BUILD (challenge-salvage package). Cross-link: the shipped-html inventory (see closed I-655) so salvage candidates get triaged once, not twice.

_Borderline reason: Challenge salvage list with tool ideas in comments (Day 23-27 specs), tools themselves are RELEVANT but this item is primarily an ops/tracking reference_

---

### QR-code flow for car yards (P-8 / I-677)

**QR-code flow for car yards.**

- Niche-specific tool, QR on every car windscreen. Scan → car-specific page (specs, price, finance calculator, "book a test drive", "ask a question" AI chat).
- Solves the "salesperson is busy" problem. Same template per car, swap data per VIN.
- One car-yard partner = a full lot of variation to demo. High-impact case study.

*Exploded from I-148 (Productisation ideas batch).*

_Borderline reason: Niche tool for car yards, specific implementation concept; could be a service variant but no connection to the locked overhaul structure_

---

### SEO at scale via AI (P-8 / I-681)

**SEO at scale via AI.**

> "AI write wikis and reviews and everywhere free to get attn"

- Use AI to seed reviews + wiki-style entries + comments wherever PB shows up, Reddit, GitHub README links, comparison sites, niche directories.
- Tactical, low-cost, high-leverage. Risk: looks spammy if overdone, calibrate volume.

*Exploded from I-147 (Content engine ideas batch).*

_Borderline reason: AI-scale SEO content seeding tactic, relevant to SEO service capabilities but primarily a PB self-marketing ops tactic_

---

### Google Business posts (P-8 / I-683)

**Google Business posts, for PB's own account.**

- Treat PB's GBP like a client GBP, weekly posts of what PB is shipping, demoing, learning.
- Reinforces the $100/wk SMB pitch, "we eat our own dogfood."

*Exploded from I-147 (Content engine ideas batch).*

_Borderline reason: "Eat own dogfood" GBP strategy, reinforces $100/wk SMB pitch, relevant to messaging and audit/GBP service but primarily content ops_

---

### "How good is your new website mate?!?" (P-8 / I-84)

"How good is your new website mate?!?"

make websites for random's & email /DM them

Me LinkedIn "how good is ….'s new site?"

Find a site. Podcast YouTube. AI and I make it better. Post. They get the site and happy. Also, a YT library of content? People will search for their website hoping you done one for them, or someone tags you in one the saw

That is it though. Show people better websites. Charge $5k cos they're so better, and you can have them to yourselves. Or $1000/mo and I give a shit. I'll drop relevant updates i find when working on someone else's new one. I'll notice fixes before you do. I'm fiddly. Or $5k because it's this awesome site right here, and because migration sucks. Like carrying a big cake you spend ages on, and it might fall on the way to the table.

_Borderline reason: Cold-outreach lead-gen tactic for websites, not a service definition but touches website service capability and messaging angle_

---

### PapaMassive / Papamoa Presence (P-12 / I-140)

**PapaMassive / Papamoa Presence, the productised local marketing-service arm for Papamoa SMBs.** This is the formal evolution of the $100/wk Papamoa SMB service item already on this card, same value prop, sharper brand, full tier ladder, real assets produced.

**Brand naming, decision parked**

Three candidates Jay is weighing:

- **PapaMassive**, bold, memorable, dual-meaning (Papamoa + massive results). Risk: slightly aggressive.
- **PapaMarketing**, descriptive, safe, lower brand differentiation
- **PapaMomentum**, momentum framing, also safe-ish
- **Papamoa Presence**, current placeholder, more conservative. Domain reserved: `papamoapresence.co.nz`

Brand kit already aligned around **Teal #065858 + Gold #F59E0B**, Fraunces serif + DM Sans body.

**Tagline (across all brand candidates)**

> "You could do all this yourself. But you are busy running a business. I use AI to deliver what agencies charge $3k for, at a price that actually makes sense. And I only work with one business per industry, so you get my full commitment."

**The "one client per industry" positioning**

Zero conflict of interest. Jay can genuinely promote the cafe client without offending a competitor. Creates real scarcity: *"I only have one spot open for a Papamoa cafe right now."* Anchors the niche-lock motion from Marketing & Lead-Gen Ideas card into a single visible product.

**Three service tiers**

| Tier | Weekly $ | ~Monthly | Includes |
| --- | --- | --- | --- |
| Starter, Visibility | $100 +GST/wk | ~$433 | Social media management · Google review management · Maps optimisation · Directory listings · Monthly results report |
| **Growth, Most Popular** | $175 +GST/wk | ~$758 | Everything in Starter + more platforms + content · Local deals/promotions · Community management · Monthly strategy call · AI content creation |
| Authority, Full Partner | $275 +GST/wk | ~$1,192 | Everything in Growth + Full online footprint audit · Process audit + AI tools · Branding + IT consulting · Ad management · Business owner support |

*Pricing-by-week not by-month is deliberate, "$100 per week" lands more accessibly with local SMBs than "$433 per month".*

**Path to $10k/mo (3-month roadmap)**

- **Month 1, Launch ($2–3k):** Land 3–4 Starter clients via Papamoa FB groups + community pages + letterbox drops with QR. Deliver excellent early results. Capture testimonials immediately. (Target mix: 4× $433 + 1× $758 = ~$2.5k)
- **Month 2, Upgrade + Expand ($5–6k):** Upgrade 2 Starters to Growth. Add 2–3 new clients from referrals + case studies. Pitch Authority to one premium business (physio, real estate, cafe).
- **Month 3, Scale ($10k+):** 10 retainer clients across tiers. Word-of-mouth active. Add one-off audit + project fees. Introduce process consulting upsell to existing clients.

**Assets already built (live in `~/Downloads/`)**

- **Strategy overview HTML**, `papamassive-overview.html`, internal positioning doc
- **Landing page HTML**, `papamoa_presence_landing.html`, full single-page site, hero + pain points + how it works + 3 tiers + testimonials + CTA. Drop-in ready.
- **Price sheet PDF**, teal+gold A4, all three tiers
- **Ad content pack**, 4× Facebook ads, IG captions, Google Search ads
- **Monthly results report PDF**, sample using fictional "Driftwood Cafe" client (attached to this item in follow-up call)
- **Ad mockups HTML**, FB feed + IG story formats
- **AdForge AI tool**, separate Gumroad product, ad copy generator

**Getting clients without cold calling** (top tactics)

- Papamoa Facebook groups
- Free footprint audit as lead magnet
- Letterbox drops + QR code
- PB own Google Business Profile
- Community pages + local events
- Boosted Facebook + Instagram ads
- Testimonials + case studies
- Cross-promotion via client networks

**Target industries, Papamoa (priority order)**

1. Cafe / restaurant (review-sensitive, time-poor, Blackberry Eatery already in flight)
2. Hair / beauty salon (visual, Instagram-native, Barber Tom Papamoa already a card)
3. Physio / health clinic (reputation-sensitive, Recharge Physio + Precision Chiropractic already cards)
4. Real estate agent
5. Tradie / plumber (Bradley Roofing precedent)
6. Gym / personal trainer (ReDefined + Absolute Weights already cards)
7. Accountant / bookkeeper
8. Childcare / tutor
9. Retail / boutique
10. Vet / pet services

**What still needs building**

- Brand decision (PapaMassive / PapaMarketing / Papamoa Presence)
- Client onboarding doc, what we need from them, what they get week one
- Free audit template, the lead magnet, structured footprint audit PDF (overlap with Niche Audit Templates item on this card)
- Delivery SOPs, week-by-week process per tier using AI tools
- PB own Google Business Profile, set up as Papamoa local marketing expert
- Lead magnet landing page, "Get your free audit" page for QR-code traffic

**Cross-card relevance**

- **Existing $100/wk Papamoa SMB item** (this card, item id `mpi69q63-119lhc6`), this item supersedes the $100/wk pricing with a 3-tier ladder. Comment added there pointing here.
- **Papamoa.info expansion** (Papamoa.info card), sister product. Listings = one-off + lifetime. Marketing = recurring. Many clients want both.
- **Niche audit templates** (this card), the free audit lead magnet uses those templates per industry
- **Productisation pipeline** (this card), once one tier works, abstract the delivery SOP into a per-industry playbook
- **AI Music for NZ Retailers**, same shape: productised $99-$275/wk flat fee for Papamoa SMBs
- **Domain Reseller + Stripe + Web3 prereqs** (Hub + Inbox), required infrastructure to bill the weekly tiers cleanly

**Next:** pick brand name. Stand up the lead-magnet "free audit" page. Letterbox-drop 200 Papamoa SMBs with the QR code. Aim for 3 Starter signups in week 1.

_Borderline reason: PapaMassive/Papamoa Presence local marketing service, 3-tier ladder ($100-$275/wk), footprint audit as lead magnet, one-client-per-industry positioning; very relevant to audit and segments but primarily a local-market sub-brand, not core PB services architecture._

---

### Playbook idea archive (P-12 / I-254)

**Playbook idea archive: AI for PTs & Nutritionists.** Attached: `fitnesse-3qb69x-2.html` (likely lifted from the existing Fitnesse demo card).

#### The idea (verbatim)

> AI for PTs & Nutritionists
> 
> Tammi w/Gate for Nutrition & workouts. Plus free tools for accountability. Also supplements, w/affiliate links.

#### Components flagged

- **Gated nutrition + workouts**, paid tier behind login. Tammi as named candidate user/contact.
- **Free accountability tools**, lead-magnet tier (tier-1 in the DIY-or-DI2gether funnel).
- **Supplement affiliate links**, passive revenue layer (ties to the “Affiliate” note Jay floated on the “we did it ourselves” pivot item).

#### Open questions (light)

- **Who’s Tammi?** Existing contact / PT / nutritionist Jay knows? Worth capturing context separately.
- **“w/Gate”**, paywall gate, or specific tool / platform named Gate?

#### Cross-card relevance (light)

- **Fitnesse** (card `mphl6hxy-ey19181el`, `demo`), existing demo that the attached HTML is sourced from. Possibly the substrate for this playbook.
- **Credibility & Media, “we did it ourselves” pivot** (item `mpj4fza6-kd1j1ip10`), the “Affiliate” thread Jay parked there meets supplement affiliate revenue here.
- **PB Services, Playbook backlog** (item `mpj5ws90-1h10yh1br`), sibling idea in the catalogue.
**Drag-drop target:** drop `fitnesse-3qb69x-2.html` onto this item.

Comments:

**Jay:**

> **[Triage answers, 24 May 2026]**
>
> *Open questions (light)*
>
> 1. **Who is Tammi?** → Captured in comment *Daughter*
> 2. **"w/Gate", what does it mean?** → Unsure *Need context*

_Borderline reason: AI for PTs+Nutritionists playbook with Tammi gate + affiliate links, niche-specific and partially personal (Tammi = daughter); relevant as playbooks/AI-services but has client-brand overlap angle._

---

### Verbatim outreach artefacts (P-19 / I-172)

**Verbatim outreach artefacts produced during the credibility strategy session, all drafts ready to ship, parked here for when the "Removed" status fix lands.**

**What is preserved as comments below**

1. Neutral Wikipedia-style summary (the "holding shape" for the eventual article, no goblin language)
2. External bio for media / podcasts (the version used to earn sources)
3. Full cold-pitch outreach email template (ready to send to local journalists / podcast hosts / chamber editors)
4. Hit-list table: target type × pitch angle

**How to use**

- The Wikipedia summary stays UNPUBLISHED until 5–8 independent sources exist
- The bio gets dropped into LinkedIn, podcast intake forms, speaker-application forms
- The email template gets personalised per target, fill the [Name] + [link] placeholders, tweak the local angle
- The hit-list is the priority queue for outreach

**Tone calibration note**

None of these artefacts use the standard PB voice ("good cunts" / "no fluff" / "Make Better Slop"). The credibility work demands a quieter register because journalists / Wikipedia editors / chambers expect it. The full PB voice stays on PB-owned channels.

**Cross-card relevance**

- **Strategic Overview** (this card), the why behind these artefacts
- **Tagline batch** (PB Services), for contrast, see how the public PB voice changes when speaking to media vs to clients
- **Repo System Prompt** (sec-external tile), the website voice rules apply to PB-owned surfaces; media outreach gets the quieter register documented here

Comments:

**Jay (2026-05-23T12:47:07.594Z):**

> **[Artefact 1, Neutral Wikipedia-style summary, verbatim. DO NOT PUBLISH until 5–8 independent sources exist.]**
>
> > PlainBlack Creative, also known as PlainBlack, is a small-business branding, digital strategy, and creative studio operating across Australia and New Zealand. The business was founded by Jayden Brown and Ian Clarquinn and works with startups and small businesses on brand identity, websites, marketing strategy, and AI-assisted business tools.
> > 
> > PlainBlack offers hands-on services including naming, brand development, website design, and monthly creative support, alongside self-serve AI playbooks designed to help business owners manage aspects of their own marketing. The company positions its work around small-business independence, plain-language strategy, and reducing reliance on long-term agency retainers.
>
> *That is the tone Wikipedia would require, no "marketing without the agency bullshit", no "lateral invention studio", no "subscription goblin". The goblin waits outside.*

**Jay (2026-05-23T12:47:08.957Z):**

> **[Artefact 2, External bio for media / podcasts, verbatim]**
>
> > PlainBlack is an Australia / New Zealand creative studio helping small businesses make better brand, website, and marketing decisions without getting trapped in agency dependency. Founded by Jayden Brown and Ian Clarquinn, PlainBlack builds strategy-first brands, practical websites, and AI-powered playbooks for business owners who want clearer next steps, not another mysterious retainer. Their current 30-day build challenge documents the creation of practical small-business tools designed to solve real problems in public.
>
> *Drop this in: LinkedIn company About, podcast intake forms, speaker bios, chamber-feature submissions, awards-entry forms.*

**Jay (2026-05-23T12:47:10.202Z):**

> **[Artefact 3, Cold-pitch outreach email template, verbatim. Personalise [Name] + [link] per target.]**
>
> > Hi [Name],
> > 
> > I'm reaching out with a local small-business story that might be a fit.
> > 
> > PlainBlack is an AU/NZ creative studio run by Jayden Brown in New Zealand and Ian Clarquinn in Tasmania. We work with small businesses that are good at what they do, but stuck when it comes to websites, marketing, AI, and knowing what to fix first.
> > 
> > This month, we're building 30 practical small-business tools in 30 days.
> > 
> > Not generic AI toys. Actual tools for real business problems: quote screeners for tradies, menu clarity tools for restaurants, fit-checkers for photographers, review murals for cafes, and small digital systems that help owners stop wasting time on bad-fit enquiries, vague marketing advice, and expensive confusion.
> > 
> > The point is simple: small business owners do not need more mystery. They need useful things they can understand, test, keep, share, and actually use.
> > 
> > We'd be happy to chat about:
> > 
> > - why small businesses are getting burned by unclear agency models
> > - how practical AI tools can help without turning owners into prompt goblins
> > - what we're learning from building in public every day
> > - why "generosity is the funnel" has become our working philosophy
> > 
> > Here's the challenge page: [insert link]
> > 
> > Happy to send screenshots, founder photos, examples, or jump on a quick call.
> > 
> > Cheers,
> > [Name]
> > PlainBlack

**Jay (2026-05-23T12:47:11.581Z):**

> **[Artefact 4, Target hit list, verbatim with cross-links]**
>
> | Target type | Pitch angle |
> | --- | --- |
> | Local newspaper / regional business desk | "AU/NZ founders build 30 tools in 30 days to help small businesses stop wasting money on unclear marketing." |
> | Chamber of commerce | "Member spotlight: PlainBlack's 30-day small business tool challenge." |
> | Small business podcast | "Why agency dependency is broken, and what small owners can do instead." |
> | AI newsletter | "Practical AI tools for trades, cafes, photographers, and small operators, not generic content generators." |
> | Client websites | "The tool PlainBlack built for us, and the problem it solved." (Cross-link to in-flight client builds: Blackberry / Pizza Pundits / ReDefined / BLST) |
> | Local community clubs | "PlainBlack GivesBack: creative sponsorship model supporting local clubs and causes." (Cross-link to existing GivesBack tile on sec-website) |
> | Design / branding blogs | "PlainBlack's Name & Frame method: brand directions as business futures, not logo options." (Strongest angle of the lot, Name & Frame is genuinely interesting, not "we made a logo") |
>
> *Sequence: chamber + local newspaper first (easiest yeses, warm-up). Then podcasts. Then design blogs (highest-payoff). Hold the AI newsletters until 2–3 tools have shipped publicly.*

_Borderline reason: Primarily PR/media chore artefacts; however the media bio contains a concise service description ('strategy-first brands, practical websites, AI-powered playbooks') and the hit-list flags 'Name & Frame method' as the strongest pitch angle = a services naming/positioning signal._

---

### Jay's self-articulated voice profile (P-19 / I-228)

**Jay’s self-articulated voice profile.** Companion to the Starter manifesto (Jay Career) and the “Hi I’m Jayden” positioning draft (this card). Together they form the bones of PB-voice-as-Jay-voice.

#### The voice profile (verbatim)

> I’m likely to go off on a rant about how businesses are getting ripped, while also understanding that people don’t know what they don’t know.
> 
> I’m likely to quote Simon Sinek and Gary Vee.
> 
> I’m likely to explain the psychology of sales with the hand brain model.
> 
> All while quoting obscure Monty Python or random movie quotes.
> 
> A bit of an eidetic memory where I can pull random text or quotes from thin air and not remember how I learnt it.
> 
> Was winning Sale of the Century at 9 years old while watching with my grandmother.

#### What this gives any voice-derived artefact (PB blog, About page, custom GPT, sales scripts)

| Trait | How it shows up |
| --- | --- |
| **Righteous rant + empathy** | Calls out the rip-off but doesn’t blame the victim. Both notes in the same paragraph, *“they’re getting ripped, AND they don’t know what they don’t know.”* |
| **Permission to cite Simon Sinek & Gary Vee** | Mainstream business references, ground the rant in stuff readers recognise. |
| **Hand-brain model for sales psychology** | Jay’s go-to teaching device. Worth one explicit section / Custom GPT prompt that captures how he uses it. |
| **Monty Python / movie quotes** | Permission to be irreverent in serious paragraphs. Tonal pressure-release. |
| **Eidetic-memory quote-dropping** | Surface quotes without academic-citation theatre. *“Heard somewhere” is the citation.* |
| **Sale of the Century at 9** | Origin-story credential. Pattern-recognition + recall as a lifelong trait, not a learned skill. Great About-page hook. |

#### Open questions

- **Hand-brain model**, Jay’s own coinage, or a named framework (Dan Siegel’s hand model of the brain)? Worth pinning down so it can be cited / quoted consistently.
- **Where this lands publicly**, About page paragraph, voice section of any client Custom GPT, intro to PB-voiced content series? Probably all three eventually.
- **Quote-bank**, the eidetic-memory trait would be powered by a personal collection of Sinek / Gary Vee / Monty Python lines Jay actually uses. Worth starting an archive.

#### Cross-card relevance

- **This card, positioning + pricing draft** (item `mpj3hmos-w9383z`), sister voice-work piece. “Helping locals help other locals” positioning + this voice profile = two halves of the same About-page section.
- **Jay Career, Starter manifesto** (item `mpj3ughu-01515141q18`), psychology underneath the voice. Together: voice (this) + psychology (Starter) + positioning (helping locals) = full About-page.
- **MAIA, Custom GPT blog** (item `mpj29nry-81l1p381h`), voice profile becomes the Role + Context layers of any PB-voiced Custom GPT.
- **PB Services, Future-Proof Playbook framework** (item `mpj34ri2-h1c71e1q1e`), tone instructions in the master Claude prompt can reference this voice profile directly.
- **Marketing & Lead-Gen Ideas, Newsletter teardown / Loretta call-out**, both rely on this voice landing right. Voice profile = the calibration sheet for all PB-voice content.
**Next:** stitch this with the Starter manifesto + the positioning draft into a single About-page section when one of them is up. Resolve the hand-brain-model source before quoting it publicly.

Comments:

**Jay (2026-05-24T07:44:48.031Z):**

> **[Triage answers, 24 May 2026]**
>
> *Hand-brain model*
>
> 1. **Is "hand-brain model" Jay’s own coinage or Dan Siegel’s?** → Dan Siegel’s framework, cite him
> 2. **Where does this land publicly?** → Captured in comment *What context?*
> 3. **Start a Sinek / Gary Vee / Monty Python quote-bank?** → Yes

_Borderline reason: Jay's personal voice (rant+empathy, Sinek/Gary Vee, hand-brain model, Monty Python) governs PB brand tone but is primarily About-page material; Dan Siegel hand-brain model confirmed in comment as cite-able teaching device. Less directly applicable to service architecture than Ian's voice rule (I-291)._

---

### The PlainBlack watermark rule (P-19 / I-247)

**The PB watermark rule, codified: icon-only in client site footers, pulsing, accent-colour-matched to the client’s site. The “green dot” is the easter egg, one on every PB-touched page. This IS the PB signature.**

#### The rules (verbatim)

> **Our watermark in the footer of client sites, PlainBlack icon only, pulsing, colour matches client site accent color.**
> 
> Logo on site footers like TACA, different landing page depending on where icon was seen.
> 
> **Green dot as an easter egg, there’s always one on every page. Our watermark.**

#### The mechanic, unpacked

| Element | Rule | Why |
| --- | --- | --- |
| **Form** | Icon only (not full logo) in client site footer. | Quiet, doesn’t compete with the client’s brand. Lives in the chrome, not the content. |
| **Animation** | Pulsing. | Just enough motion to be noticed once and remembered. |
| **Colour** | Matches the client site’s accent colour. | Chameleon. Feels native to the client’s brand, not bolted on. |
| **Click destination** | Different PB landing page depending on where the icon was seen. | Per-client / per-vertical funnels. The icon doubles as a referral tracker; visitors land on the page that’s relevant to where they discovered PB. |
| **Exception: TACA-style** | Full PB logo (not just icon) on select client footers. | For clients where the relationship is open-credited, like TACA / Chelsea Jensen, where the “you somehow knew exactly what I wanted” quote already exists. |
| **Easter egg** | The green dot is on every PB-touched page. | Internal joke + external signature. Once a viewer learns to spot it, they spot it everywhere. Builds the “PB did this” pattern recognition. |

#### Why this is load-bearing for the business model

- **The watermark IS the payment** for free work, the “green dot is payment enough” positioning (item `mpj3hmos-w9383z`) literally only works if the watermark mechanic is consistent.
- **Compounding portfolio.** Every PB site running the icon = one always-on micro-billboard. 10 sites → 10 doorways back to PB.
- **Per-site referral funnels.** Click-destination switching means PB can A/B different value props by source vertical. Tradies see one landing page, hospo sees another.
- **Hides the plumbing.** Icon-only respects the client’s brand; full logo only for partner-grade relationships.

#### Open decisions / loose ends

- **Icon spec**, what’s the canonical PB icon glyph (SVG path)? Need it locked so it pulses + recolours cleanly across all client sites.
- **Default green**, if a client site has no accent colour or a clashing one, what’s the fallback green? Probably the PB mint `#3ecf8e` family seen in carousels and mockups.
- **Pulse implementation**, CSS `@keyframes` animation embedded with the icon? Worth a one-snippet code drop so it’s copy-paste for every install.
- **Click-tracking**, per-source landing pages need UTM-tagging or a tiny redirect handler at `plainblackcreative.com/from/`. Where does the routing logic live?
- **Contract clause**, does the watermark stay even after a client engagement ends? Worth a one-line in the client agreement: “PB watermark stays as long as PB-built infra is in use.”
- **TACA-style trigger**, when does a client get the full-logo treatment vs icon-only? Probably: when the client gives explicit endorsement, the relationship is publicly known, or they’re a partner-tier engagement.
- **Documenting it**, if this is THE PB signature mechanic, it deserves a one-page internal spec + a public “here’s how we sign our work” page on the PB site. Some prospects will love the transparency.

#### Cross-card relevance

- **Credibility & Media, positioning + pricing draft** (item `mpj3hmos-w9383z`), “the green dot is payment enough” positioning ONLY works if this mechanic is locked. This item is the operational spec for that pricing posture.
- **Credibility & Media, PB-as-Jay-actually-wants-it** (item `mpj4ijyf-r1ku1530`), the “Chelsea Jensen / TACA” testimonial is the TACA full-logo exception. Worth confirming TACA already runs the full-logo treatment.
- **Credibility & Media, OG fallback audit TODO** (item `mpj31sua-3haz1bc`), per-page OG images + the watermark icon both live in the same brand-asset workflow.
- **Credibility & Media, market intel report** (item `mpj2jmo7-1jp1o1741d`), Tactic 7 (bundle the file + README, “you own it forever”) + Gap 6 (“I own the file” positioning): the watermark is the visible signature on top of the “you own it” promise. Same posture, dual signal.
- **PB Services, client playbook hosting** (item `mpj50ly4-d1f21fak`), every client playbook page gets the green dot too. Watermark spec applies there.
- **Bradley Roofing** (card `mpj4m4or-21j1l1o161j`), the mockup co-brands “Bradley Roofing × PlainBlack” in the hero, but if PB ships the live tool, decide: icon-only (PB’s standard), or full co-brand (Bradley as TACA-style partner)?
- **Marketing & Lead-Gen Ideas, PB IG carousel** (item `mpj1z4pv-119q1g113`), the P-logo in every carousel frame is already exercising this principle on a different surface.
**Next:** lock the SVG icon + pulse CSS snippet so it’s install-ready. Spec the per-source click-routing (`plainblackcreative.com/from/<slug>`) so the referral-funnel mechanic actually works. Add the one-line watermark clause to the client agreement. Decide Bradley icon-only or TACA-style before the Quote Fit Filter launches.

_Borderline reason: Brand identity mechanic with indirect services angle: per-source click routing enables segmented landing pages, and 'green dot is payment enough' is a pricing posture for free/low-cost work. Not service definitions but touches site-changes and pricing._

---

### Riff the Raccoon (P-19 / I-288)

**Riff the Raccoon, full worldbuilding pitch for a PB content universe. Successor to the “Donuts & Raccoons / Name our Mascot” idea (item `mpj2n5hg-16l1q1bqj`).** Source docx being deleted, full extraction below.

#### The thesis (verbatim opener)

> Yes. This has legs. Not just “raccoon mascot does marketing things,” because that becomes cute brand wallpaper and then we’re one step away from a plush toy and a LinkedIn post that says “meet our cheeky little helper,” at which point someone should legally intervene.
> 
> The raccoon needs a job, a world, an enemy, and a reason people care what happens next.
> 
> The raccoon is not stealing from businesses. He is stealing back the attention that got taken from them by noise, jargon, bad agencies, fake urgency, slop content, bloated retainers, and “post more” advice that helps approximately no one.

#### Working titles

- **The Raccoon Who Stole Attention Back**
- **PlainBlack: Attention Thief**
- **The Clarity Job**

#### The protagonist, Riff
**Name pick:** *Riff*. Full name: **Riff Blackpaw**. (Other names considered: Milo Static / Bandit / Clarity Raccoon, Clarity Raccoon kept as nickname only.)

**Who he is:** a small, nocturnal, morally flexible raccoon with one rule:

> **“Never steal from honest businesses. Only steal back what confusion took from them.”**
He breaks into the machinery of bad marketing and returns with: stolen attention · buried customer truth · plain-language offers · hidden proof · useful positioning · the thing the business owner should have been told before they paid anyone.

*He is not magical. He is observant. That matters.*

#### The world
The city is called **The Attention Economy**, but nobody says that out loud unless trying to sell a webinar. Dark, rainy, over-signposted city.

Every alley has another promise: *SCALE FAST / POST MORE / AI WILL FIX THIS / LIMITED SPOTS / BOOK A STRATEGY CALL / UNLOCK YOUR POTENTIAL* (which should be treated as a criminal offence).

**Lower streets:** small businesses, mechanics, cafés, trades, salons, dog groomers, accountants, tourism operators. Real people. Real bills. Real talent. Invisible windows.

##### The 4 towers (above)

| District | What lives there |
| --- | --- |
| **Perceived Value District** | Everything costs $9,999 because someone added “proprietary framework” to a PDF. |
| **Slop Factory** | AI produces 400 posts an hour, all beginning with “In today’s fast-paced digital landscape.” |
| **Retainer Hotel** | You can check out any time you like, but the contract auto-renews. |
| **Funnel Cathedral** | Built entirely from fake scarcity, bonus stacks, and the bones of abandoned course students. |

#### The main enemy
**Victor Vague**, smooth consultant in a long coat, always surrounded by fog, charts, and meaningless phrases. Never lies directly. Does something worse: makes simple things sound complicated enough to charge for.

**Catchphrase:** *“It depends.”* (Sometimes true. In his mouth, means: “Please enter the retainer corridor.”)

#### The deeper conflict
Riff wants to help business owners. But business owners often don’t trust help anymore. That’s the emotional engine.

So Riff cannot just show up and say “I can fix this.” He has to prove it. Every episode = one real business owner with a real stuck point + one useful piece of clarity returned.

*Secret teaching layer: audience learns how to think about their own business without enrolling in Marketing TAFE after dark.*

#### Three-layer narrative format (per frame)

1. **First read:** cool cinematic comic panel. Raccoon doing something interesting.
2. **Second read:** hidden jokes, logos, references, signs, signals of the bigger world.
3. **Third read:** a useful business lesson hiding inside the story.
*Matches the PlainBlack world: visually rich, dark cinematic, mint as the signal, easter eggs rewarding attention rather than hijacking the message.*

#### Season 1 arc, “The Missing Attention”
**Premise:** small businesses across the city are losing attention. Not because they’re bad. Because their message is buried under noise, fake expertise, AI slop, vague websites, bad offers, and agencies selling “growth” without explaining what’s broken.

Riff starts finding small green signals hidden around the city. Each signal leads to a business whose real value has been covered up.

#### The 10 pilot frames (full verbatim breakdown)

| # | Frame | Caption / lesson |
| --- | --- | --- |
| 1 | **The Poster / Cover**, Title: “They Stole Attention. We Gave It Back.” Noir, satire, hidden details, anti-slop, pro-small-business. | “In a city built on noise, one raccoon had the common decency to steal from the right people.” |
| 2 | **The Mechanic No One Can Find**, Riff on the rooftop of a small mechanic shop. Across the road: “PREMIUM AUTO SOLUTIONS” glowing. Honest mechanic’s sign just says “Repairs.” Hidden: receipt showing “best customer reviews in town”, tiny PB mark on a toolbox, pigeon with a “post more” flyer. | “The mechanic wasn’t losing because he was worse. He was losing because nobody could tell why he was better.” *Lesson: being good is not the same as being easy to choose.* |
| 3 | **The Offer Heist**, Riff breaks into mechanic’s website like a tiny masked burglar. Inside: dusty boxes labelled Quality Service / Reliable Repairs / Friendly Team / Competitive Prices. Hidden glowing card: *“Same-day honest verdict: keep it, fix it, flip it, or scrap it.”* | “Most websites don’t need more words. They need the right bloody sentence.” *Lesson: generic claims hide the actual reason people should care.* |
| 4 | **The Funnel Cathedral**, Riff sneaks through a cathedral-like webinar room. Guru preaching from a lectern made of bonus stacks. Attendees hypnotised by countdown timers. Stained glass: OBJECTION HANDLING / VALUE STACK / FAKE URGENCY / ONLY 3 SPOTS LEFT FOREVER. | “If the offer dies when the countdown timer disappears, it probably wasn’t confidence. It was theatre with a stopwatch.” *Lesson: urgency is not strategy.* |
| 5 | **The Café After Closing**, Owner alone after close, empty content calendar. Riff on the counter, stealing a muffin and reading customer reviews. Reviews mention things owner never talks about: “quiet corner”, “remembers my order”, “best gluten-free cabinet”, “safe place after school drop-off.” | “The café owner thought she needed content ideas. She actually needed to notice what people already loved. Annoying how often the answer is sitting in the reviews eating a croissant.” *Lesson: your customers often already know your positioning. You just have to listen.* |
| 6 | **The Slop Factory**, Robots on conveyor belts pumping beige posts. Each starts “In today’s fast |  |

Comments:

**PlainBlack (2026-06-12T04:57:11.720Z):**

> ↩ Merged from "Mascot / icon / brand thinking parked: “Donuts & Raccoons” concept, paired with a “Name Our Mascot” competition as the launch mechanic. Donuts & Raccoons, Mascot/Icon/Br", originally captured by Jay on 2026-05-24, full content of Jay's item:
>
> Mascot / icon / brand thinking parked: “Donuts & Raccoons” concept, paired with a “Name Our Mascot” competition as the launch mechanic. Donuts & Raccoons, Mascot/Icon/Br

**Jay (2026-05-24T03:39:56.560Z):**

> (via merge from "Mascot / icon / brand thinking parked: “Donuts & Racco")
> **[Cross-link, elaborated successor filed]**
>
> The mascot concept has crystallised as **Riff the Raccoon** (full name Riff Blackpaw). Full worldbuilding doc filed on this card (id `mpj8bdyq-cjx1a1mt`): named protagonist + 4-district city (Attention Economy) + main villain Victor Vague + 10-frame pilot arc “The Missing Attention” + supporting cast (Jay the Crow, Dot, the Owner, Slop Bots) + recurring signs/objects + business-value mapping.
>
> **Most of this card’s open questions are now answered** (whose mascot = PB-internal storytelling character; single vs duo = single protagonist + cast; competition mechanic = changed to 10-frame pilot release; visual style = noir / dark cinematic / mint signal). The “Donuts” half of “Donuts & Raccoons” survives as a recurring object (donut box / half-eaten donut).

**Jay (2026-05-24T07:48:44.293Z):**

> (via merge from "Mascot / icon / brand thinking parked: “Donuts & Racco")
> **[Triage answers, 24 May 2026]**
>
> *Donut + raccoon mascot*
>
> 1. **Whose mascot?** → PB-internal house mascot
> 2. **Why donuts + raccoons?** → Captured in comment *ChatGPT being a dumbass kept talking about Raccoons, so we just owned it.  Donuts because of a local donut truck business copying PlainBlack trying to compete so we just owned it*
> 3. **Single mascot or duo?** → Captured in comment *The Raccoon have a donut fetish*
> 4. **Competition mechanic?** → Skip / unsure
> 5. **Visual style, quick mock first?** → Captured in comment *Have already. I can provide*

**PlainBlack (2026-06-12T04:57:13.587Z):**

> [Triage P-19] Merged I-212 (Donuts & Raccoons / Name-our-Mascot seed) into this Riff worldbuild. Origin story + competition mechanic are preserved in the copied comments above; the visual-mock image remains on the now-closed I-212.

_Borderline reason: Primarily brand/mascot content; however the 4-district satire world (Retainer Hotel, Slop Factory, Funnel Cathedral, Perceived Value District) encodes PB's anti-agency positioning and could power services page narrative framing. No service definitions or pricing._

---

### Bug: /first-fix ?fix=other leaves the text input hidden (P-23 / I-669)

**Bug: /first-fix ?fix=other leaves the text input hidden**

In first-fix.html (~lines 1168-1175), applyUrlParams sets radio.checked = true but never fires the change event that init() binds to. Landing on ?fix=other shows the option selected but no input box. Same risk for any future option that toggles UI.

**Fix:** dispatch a change event after setting checked.

*Split out of I-517 (P0) on 2026-06-12. Re-verified still outstanding in the 2026-06-11 close-out audit.*

_Borderline reason: /first-fix is a live tool on the site (tools strategy is in scope for the overhaul), and a broken URL-param entry-point affects segment routing; however this is a pure JS bug fix with no services-definition, pricing, or IA angle._

---

### Our Work (P-23 / I-671)

**Our Work: make each client card click through to a dedicated case-study page**

On the website Our Work section, every client card should link to its own case-study page. Pairs with the 30-day-demo to /tools pipeline: every clickable card doubles as a permanent case study.

*Extracted from I-150 (via I-517 comment) on 2026-06-12.*

_Borderline reason: Work cards are listed as 'fair game downstream' in the services overhaul brief, and case-study pages support the services showcase / proof layer; however the item itself is a portfolio/content feature with no direct service-definition, pricing, or IA decision angle._

---

### Specific prospect leads + niche targets from the brain dump (P-8 / I-149)

**Specific prospect leads + niche targets from the brain dump.** Following the existing pattern, flag here, no card until Jay actively approaches.

Individual prospects: Limitless Tyres (Jay note: "suck at socials, need help"; PapaMassive Starter or Growth tier likely fit); Ora McSweeney, Property Manager at Harcourts (Jay note: "see what I can build for her"; candidate for AI Hiring & Onboarding system, weekly social on listings, automated owner-update emails, tenant-comms automation).

Niche markets to consider entering: VR places in NZ (Jay has unfair advantage via Cave Corporation 2018-2024 background); restaurants (interactive menus + content); car yards (QR flow).

Outreach play: "Look for FB ads that suck, make better ones, DM people, say I am available." Fourth motion added to the trio: bad-ad rebuild (see weak Meta ad, produce a better version, DM the advertiser with the comparison). Daily Facebook Ad Library sweep of "Papamoa" + NZ regions = a continuous stream of bad ads to rebuild as outreach material.

Comments:

**Jay (2026-05-24):**

> **[The Cave moved from "niche flag" to active prospect]** The VR-places-in-NZ niche-market note on this item is now active. The Cave (Jay co-founded 2018-2024, multi-site VR + sim-racing) is getting an anonymous / alias-fronted pitch with $2k+gst/yr hosting + $1k/mo retainer + a flagship new-booking-system project. Pairs with Battle Axe Throwing (sec-clients) as the second entertainment-venue prospect with the same unfair-advantage angle. Land both = multi-site experience-venue niche locked across NZ.

_Borderline reason: Prospect-to-tier mapping is segment-relevant (Limitless Tyres and Ora McSweeney mapped to PapaMassive Starter or Growth tiers with pricing cross-links, The Cave moved to active prospect with explicit pricing); however the item itself is a lead-gen and prospect-tracking chore, not a service definition or playbook._

---

### PlainBlack Creative Bradley Roofing, lead-qualifier page (P-12 / I-281)

**PlainBlack Creative Bradley Roofing, lead-qualifier page.** Stop sending every roofing enquiry straight to the inbox.

Bradley Roofing does proper roofing work across the Bay of Plenty. The shipped HTML page is a Roof Quote Fit Checker: a 6-question qualifier that routes enquiries into Good Fit (quote CTA shown), Maybe Fit (details first), or Not Quote-Ready (contact CTA hidden). Built around Bradley Roofing's services, Bay of Plenty region, and real quote-readiness signals. The filter logic checks job type, customer stage, budget range, urgency, photo/detail readiness, and job location.

_Borderline reason: Live shipped Branded System proof-of-concept directly demonstrating the productised AI tool-as-service mechanic (quote-readiness checker as a lead-qualifier tool); directly relevant to the tools strategy and the $1,499 build offer mechanic referenced in multiple RELEVANT items; however no abstract service definition, pricing decision, or segment strategy is present in the item itself._

---

## Appendix B. Exclusions index

Every off-topic item, logged so nothing disappears unaccounted.

- I-354 (P-4): Gmail Tooling -- Hub platform feature (Gmail API send/reply integration, inbox rules for newsletters/clients), internal tooling build, no services definition or pricing angle.
- I-487 (P-4): Import jkbrownnz Gmail items into PlainBlack inbox or hub items -- Personal Gmail migration to PB inbox, ops/admin errand, explicitly moved to P-8 in comments; no services angle.
- I-488 (P-4): Tasks to complete -- Hub platform engineering tasks (PDF text extraction worker, triage UI action buttons, AI triage prompts), internal tooling, no services definition or pricing angle.
- I-673 (P-4): Upload/Download Docs need work -- Hub file handling (PDF/image/docx/md download UX + OCR checkbox default), pure platform ops, no services angle.
- I-122 (P-8): A Fiverr-alternative marketplace where the value is in the work -- New platform/marketplace concept, too far from PB service architecture; no pricing/service/playbook angle for current overhaul
- I-126 (P-8): Digital coffee loyalty card for cafes -- Niche loyalty-card product idea for cafes, client-facing tool build, not a PB service definition or playbook candidate
- I-134 (P-8): An "AI Bunnings" -- Retail/home-design AI concept, not a PB service; no pricing, segment, or playbook relevance to current overhaul
- I-173 (P-8): Idea: AI + Blockchain for legal documents -- AI + blockchain legal docs concept, speculative, no connection to current PB service overhaul structure
- I-2 (P-8): Idea on AI and the future -- Raw speculative blog idea about open-share AI with no services or pricing angle
- I-231 (P-8): LinkedIn content brief -- Geographic LinkedIn content sprint, generic lead-gen ops, no service definition or pricing angle
- I-275 (P-8): Blog idea archive -- Personal productivity blog idea, no services or positioning angle for the overhaul
- I-276 (P-8): Blog idea archive -- Tangential linguistics blog idea, no services, pricing, or messaging relevance
- I-680 (P-8): "AI-and-I make things better" -- YouTube channel concept for PB content, no direct service, pricing, or overhaul relevance
- I-682 (P-8): LinkedIn daily rhythm -- Personal brand LinkedIn posting rhythm, Jay Career content, not PB service definition
- I-69 (P-8): Substack -- Bare platform note (Substack); no service definition, pricing, or positioning angle
- I-135 (P-12): Potential PlainBlack service line -- Lifestyle Reno Company potential service line, physical renovation with AI before/afters; no current services angle, highly speculative, no pricing or segment overlap.
- I-171 (P-19): Strategic verdict -- Pure Wikipedia/credibility strategy roadmap; Media Room mention is incidental; no service definitions, pricing, playbook specs, or segment decisions. Cross-links to services are tangential (PB eating own dogfood).
- I-130 (P-23): Blog system needs a fix + redo + upgrade pass + a real distribution motion -- Blog ops/distribution/style upgrade chore; no services-definition, pricing, playbook-positioning, or IA angle, the mention of blog-gen and five-asset release is a content/marketing motion, not services architecture.
- I-216 (P-23): TODO: audit the PlainBlack site for pages using the OG fallback image -- Site-wide OG image audit/replacement is a brand/credibility chore; no services-definition, pricing, playbook, or IA angle.
- I-274 (P-23): Feature idea archive -- Blog UX/accessibility feature with no services-definition, pricing, playbook, tools-strategy, or IA angle; pure site polish.
