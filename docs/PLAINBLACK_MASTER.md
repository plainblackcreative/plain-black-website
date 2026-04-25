# PlainBlack · Master Reference
**Last updated:** April 2026
**Replaces:** Project_Master_Memory.md, PLAINBLACK_BRAND_KIT.md, previous PLAINBLACK_MASTER.md

---

## What PlainBlack is

PlainBlack (plainblackcreative.com) builds and sells one-off, AI-powered, personalised HTML playbooks to small business owners via META ads. Products are single self-contained HTML files. Not PDFs. Not courses. Living systems that customers pay once to own, with embedded Claude AI that keeps every section current on demand.

Founded by Ian Clarquinn and Jayden Brown.

**The core promise:** Stop paying agencies $2,000 to $5,000 a month to do things you could do yourself with the right system. PlainBlack playbooks are that system. Step by step. Tool by tool. In plain language. With AI that keeps the content current.

**Standard price:** $99 in local currency. US: $99 USD. NZ: $99 NZD. AU: $99 AUD. All other countries: $99 USD. Stripe handles currency. No discounts, no free tiers, no founding offers. $99 is already cheap.

**The math:** ~18 sales/week covers costs and profit. At $30/day ad spend, that's achievable with the right creative.

---

## Brand name rule

Brand name in customer-facing copy is **PlainBlack** only. Flag any instance of "PlainBlack Creative", "Plain Black", "plainblack creative", etc in headlines, body, FAQs, emails, buttons, meta tags, browser titles, or social share copy.

Legal entity name **PlainBlack Creative Limited** is permitted in copyright footers, Terms & Conditions, Privacy Policy, refund policy contractual text, and other legally-binding small print. Copyright line format: `© 2026 PlainBlack Creative Limited.`

---

## The problem we solve

Small business owners are stuck in one of three traps:

1. **Paying too much** for agencies who guard the mystery and keep them dependent
2. **Drowning in information** from courses, YouTube, and blog posts that contradict each other and go out of date
3. **Doing nothing** because every option feels too technical, too expensive, or too time-consuming

A PlainBlack playbook cuts through all three. It is not education. It is a system. You follow it, you get the result.

**The filter for every product decision:** Does this make a business owner feel capable and in control? If yes: it belongs. If it creates confusion, dependency, or ongoing cost: it does not.

---

## The 6 launch products

All files in `playbooks/ready/`. All built, audited, and live as of April 2026. Products 7-10 deferred until the first 6 generate revenue.

| # | Product | Repo path | Niche | Accent |
|---|---|---|---|---|
| 1 | 90-Day Job Pipeline | `ready/90-day-job-pipeline/` | Residential trades (HVAC, plumbing, roofing, electrical) AU/NZ/US | Steel Blue `#2563a8` |
| 2 | AI-Powered Google Reviews | `ready/google-reviews/` | Hospitality, trades, retail, professional services | Mint `#3ecf8e` |
| 3 | Roofing AI Playbook | `ready/roofing-ai/` | Roofing contractors AU/NZ/US | Steel Blue `#2563a8` |
| 4 | Marketing Foundations Playbook | `ready/marketing-foundations/` | Audience + strategy, upstream of paid ads, all small business | Mint `#3ecf8e` |
| 5 | Marketing Playbook | `ready/marketing/` | META + Google Ads, all small business | Mint `#3ecf8e` |
| 6 | AI Agents, Automations & Tools | `ready/ai-agents/` | All small business | Mint `#3ecf8e` |

**Deferred (products 7-10, do not build until first 6 generating revenue):**

| # | Product | Niche |
|---|---|---|
| 7 | Website & SEO Upgrade | All small business |
| 8 | AI Back Office Playbook | Anyone quoting, booking, invoicing |
| 9 | AI Phone Agent Playbook | Any business that misses calls |
| 10 | Website & Branding Revamp | All small business |

---

## Hosting and URL structure

- **Live site:** `plainblackcreative.com` (custom domain)
- **GitHub repo:** `plainblackcreative.github.io` (cloned to Jayden's desktop)
- **Customer playbook URLs:** `https://client.plainblackcreative.com/playbooks/[slug].html` (served from private `plainblack-client` repo via Cloudflare Pages)
- **Private client repo:** `plainblackcreative/plainblack-client`, separate from the public marketing site repo `plainblackcreative/plain-black-website`
- **Lander display copy:** reference playbooks as `plainblackcreative.com/your-playbook` for marketing/display purposes only. Real delivered URLs follow the `client.plainblackcreative.com/playbooks/[slug].html` path above.

---

## The funnel (end to end)

```
META Ad
  → Lander (plainblackcreative.com)
    → Lead form (Web3Forms → Gmail)
      → Gmail notifies Jayden/Ian of new lead
        → Generator (admin/generator.html) builds two HTML files:
          locked version + unlocked version, both with unguessable slugs
          → Generator publishes both files to GitHub (single commit + push)
            → Generator drafts Email 1 (locked URL) and Email 2 (unlocked URL)
              as copy-pasteable text blocks
              → Jayden/Ian manually sends Email 1 from Gmail
                → Customer opens locked URL
                  → Sections 1-2 fully visible, AI buttons functional
                  → Sections 3-10 shown as teaser cards with preview bullets
                    → Unlock CTAs link to Stripe Payment Link (currency-matched)
                      → Customer pays $99 via Stripe
                        → Stripe redirects to /thanks.html
                          → Jayden/Ian manually sends Email 2 (unlocked URL)
                            → Customer bookmarks unlocked URL. Product delivered.
                              No further work.
```

### Deploy-time placeholder swaps (every lander)

| Placeholder | Replace with |
|---|---|
| `PIXEL_ID` | META Pixel ID |

Web3Forms access key `c1c0af3e-f468-4f4f-823a-5453b1820d37` is hardcoded across all landers, the 404 page, and main-site forms. One Web3Forms account, one key, used everywhere. No deploy-time placeholder, no rotation policy. If the key ever needs to rotate, find-and-replace across the repo.

---

## Delivery flow (current — manual)

### Intake

**Trigger:** New lead email arrives in Gmail from Web3Forms

1. Jayden or Ian notified of new lead
2. Opens admin/generator.html (hub URL)
3. Selects correct template, pastes customer data
4. Clicks Generate → produces two HTML files (locked + unlocked) with unguessable slugs
5. Reviews both files in incognito
6. Clicks Publish → generator commits both files to repo and pushes to main
7. Copies Email 1 draft from generator UI → sends from Gmail

### Post-payment

**Trigger:** Stripe payment notification (email or dashboard check)

1. Customer pays $99 via Stripe
2. Stripe redirects customer to `/thanks.html` (GA4 + Pixel events fire there)
3. Jayden or Ian sees Stripe payment notification
4. Opens generator history panel → finds customer
5. Copies Email 2 draft → sends unlocked URL from Gmail

### Email drafts (produced by generator at generation time)

**Email 1 (at lead intake, locked URL):**

```
Subject: Your [Product Name] is ready

Hi [Owner First Name],

Your personalised [Product Name] is ready. We've built it specifically
for [Business Name] in [City].

Sections 1 and 2 are yours to explore right now. Take a look, get a feel
for the system:

[locked URL]

When you're ready for the full playbook (all 10 sections with your full
strategy, budget allocation, and launch plan), unlock for $99 right from
the playbook itself.

Save this email. Your link is private to you.

Any questions, just reply.

Jayden & Ian
PlainBlack
```

**Email 2 (post-payment, unlocked URL):**

```
Subject: Your [Product Name] is unlocked

Hi [Owner First Name],

Thanks for your purchase. Here's your full [Product Name], now fully unlocked:

[unlocked URL]

Bookmark this link. It's yours. Save this email, add it to a folder, or add
the link to your notes so you can find it later.

The playbook has live AI update buttons built into every section. Use them
whenever you want to refresh the content with the latest information from
across the web. There's no time limit.

If you have any issues, just reply to this email.

Jayden & Ian
PlainBlack
```

---

## Access control

URL-based access. No tokens, no backend validation, no localStorage state.

Each paid customer generation produces two HTML files with different unguessable random slugs:

- **Locked file:** sent via Email 1 at lead intake. Customer sees sections 1-2 fully, sections 3-10 as teaser cards with unlock CTAs.
- **Unlocked file:** sent via Email 2 after Stripe payment confirmation. Customer sees all 10 sections fully rendered.

Customer only ever receives the unlocked URL after paying. The locked URL continues to work indefinitely but only shows the preview state. Access is a function of which URL the customer knows, not which state the file is in.

### Stripe redirect

All 3 Stripe Payment Links (NZD, AUD, USD) redirect to `https://plainblackcreative.com/thanks.html` after successful payment. GA4 `purchase_complete` and META Pixel `Purchase` events fire on `/thanks.html`. No payment handler exists in the locked playbook.

### API proxy

All AI update calls go through `https://plainblack-api-proxy.jkbrownnz.workers.dev`. Never call `api.anthropic.com` directly.

---

## Tech stack

| Tool | Role |
|---|---|
| GitHub Pages | Hosts the public marketing site and lander pages at plainblackcreative.com |
| Cloudflare Pages | Hosts customer playbooks at client.plainblackcreative.com from the private plainblackcreative/plainblack-client repo. Also hosts the admin generator at admin.plainblackcreative.com from the public repo's /admin/ folder. |
| Web3Forms | Free form handling, routes leads to Gmail |
| Gmail | Receives Web3Forms leads. Jayden and Ian read leads here and run the generator manually. |
| Stripe | $99 one-off payment inside playbook |
| META Ads | Traffic. $30/day starting budget. 72-hour no-touch rule. |
| Claude API (via Cloudflare proxy) | Powers AI update buttons in every playbook section |
| Cloudflare Workers | API proxy at plainblack-api-proxy.jkbrownnz.workers.dev |
| VS Code + Claude | Primary build environment (has local repo read/write access) |

No backend servers. No databases. No accounts. Everything is client-side, with delivery handled manually by Jayden and Ian.

---

## Repo structure (current)

```
plainblackcreative.github.io (custom domain: plainblackcreative.com)

assets/
  style.css              <- master stylesheet (live site only, not used in playbooks)
  Light_logo.png         <- white text, transparent bg (for dark/black backgrounds)
  Dark_logo.png          <- black text, transparent bg (for light/white backgrounds)
  LOGO_LIGHT_BASE64.txt  <- base64 payload of Light_logo for HTML embedding
  LOGO_DARK_BASE64.txt   <- base64 payload of Dark_logo for HTML embedding
  favicon.webp           <- green PlainBlack favicon
  js/blog-images.js
  blog/                  <- blog post images
  branding/              <- client brand assets
  profile-pics/          <- team photos

docs/                    <- internal tools, not public
  PLAINBLACK_MASTER.md          <- this file
  PLAINBLACK_BUILD_SPEC.md      <- technical build spec
  blog-gen.html
  plainblack-hub.html
  blog-library.json
  outreach-kit.html
  tracking-plan.html
  dashboard.html
  working-archive.html

playbooks/
  ready/                 <- production-ready pairs (lander + template)
    90-day-job-pipeline/
      90-day-job-pipeline-LANDING.html
      90-day-job-pipeline-TEMPLATE.html
    google-reviews/
      ai-powered-google-reviews-LANDING.html
      ai-powered-google-reviews-TEMPLATE.html
    roofing-ai/
      roofing-ai-LANDING.html
      roofing-ai-TEMPLATE.html
    marketing/
      marketing-LANDING.html
      marketing-TEMPLATE.html
    ai-agents/
      ai-agents-LANDING.html
      ai-agents-TEMPLATE.html
  future/                <- products 6-9, not started

clients/                 <- legacy one-off client work
blog/                    <- published blog posts
```

**Private client repo (separate):**

```
plainblackcreative/plainblack-client

playbooks/               <- Generator writes locked + unlocked files here (two per customer, unguessable slugs)
custom/                  <- custom client work, one folder per project
archive/                 <- retired work no longer served
README.md
```

Served at: `client.plainblackcreative.com` via Cloudflare Pages.

---

## Launch sequence (per product)

1. Build template (JS-rendered SECTIONS array, all `[[PLACEHOLDERS]]`, brand kit compliant, teaser metadata block present for generator)
2. Build demo client version (all placeholders filled, hosted on GitHub Pages)
3. Build landing page (one deploy-time placeholder: `PIXEL_ID`. Web3Forms key is hardcoded site-wide)
4. Lock price ($99 in local currency per region)
5. Build 3 META ad creatives in Canva
6. Set up Web3Forms + Gmail filter for lead notifications
7. Confirm 3 Stripe Payment Links configured (NZD, AUD, USD) with `/thanks.html` redirect
8. Install META Pixel on lander (bare `PIXEL_ID` placeholder)
9. Verify domain in META Business Manager
10. Launch campaign ($30/day, 72-hour no-touch rule)

---

## Strategic positioning

This is not a document business. It is a productised service disguised as a document. Generic playbooks are forgettable. Personalised playbooks are sticky, valuable, and hard to replace.

**Key differentiators:**
- **Removed agency dependency.** Most agencies protect the mystery. PlainBlack does the opposite: "Here's how to do it yourself properly."
- **Personalised.** Template backend, customised front-end. This is the lever for scaling.
- **Solving a real pain.** People are ready to spend but don't trust themselves. PlainBlack steps in with: "You can do this. Here's how." That's not marketing. That's leadership.

**Positioning in one line:** Agency-level results. DIY price. Done in under 2 hours.

---

## Success metrics

| Metric | Target |
|---|---|
| Lander to lead form submit | 4%+ |
| Lead form to paid | 15%+ |
| Overall lander to paid | 0.6%+ |
| Ad CTR | 1.5%+ |
| Sales/day at $30/day spend | 3+ |
| Playbook completion rate | 40%+ |
| Mobile Lighthouse score | 90+ |

---

## Deferred features (do not build until first 6 products generating revenue)

- **Need a hand? support button:** Floating bottom-right on unlocked playbooks. Web3Forms lightbox (name, email/phone, playbook URL auto-filled, message, screenshot upload).
- **Playbook AI Assistant (Pro tier):** Replaces support form with AI chat. Scope-aware, surfaces upsells outside current playbook scope. Needs subscription pricing to support API costs.
- **DFY Anchor Strategy:** $1,500-$3,000 done-for-you ad, retarget non-buyers with $99 playbook.
- **White Label (DIYAIPLAYBOOKS.COM):** Strip PlainBlack branding, license to agencies. Revisit after first 20-30 direct sales.
- **Mark Complete button consistency pass:** Audit all templates for uniform pattern.

---

## Hard rules (never break)

- **Brand name:** PlainBlack only. No variations.
- **Price:** $99 in local currency. US: $99 USD. NZ: $99 NZD. AU: $99 AUD. Other countries: $99 USD. Stripe handles currency. No exceptions, no discounts.
- **Em dashes:** Never. Use commas, semicolons, or periods.
- **Backgrounds:** White (`#ffffff`) everywhere on customer-facing output. Ink only on sticky header/footer chrome.
- **Fonts:** Playfair Display + Figtree only. `font-synthesis: none` on body. No other fonts.
- **Logos (universal rule):** Light_logo on dark/black backgrounds. Dark_logo on light/white backgrounds. Base64 embedded in playbooks and landers. Path reference on live site only. Never text substitutes.
- **Logo anti-underline:** Every `<a>` wrapping a logo must have `a:has(img){display:inline-flex;line-height:0;} img{display:block;border:none;}`
- **Light_logo bug:** Clean version is 1568x234px RGBA. If 252px tall or shows underline, the file has a baked-in 12px white bar at rows 235-251. Strip and re-crop from `/mnt/project/Light_logo.png` using Pillow.
- **No footer on playbook templates.** Landing pages have footers. Templates never do.
- **GA4:** `G-GP1WQCC0DY`. After Google Fonts link. Before style block. Include `<!-- Google Analytics -->` comment.
- **AI model:** `claude-sonnet-4-5` only. No dated variants.
- **API proxy:** Always use `plainblack-api-proxy.jkbrownnz.workers.dev`. Never call `api.anthropic.com` directly from playbooks.
- **Border token:** `--border: #cce8d8;` exactly.
- **Accent in template CSS:** Always `[[ACCENT_COLOUR_HEX]]` and `[[ACCENT_COLOUR_DARK_HEX]]` placeholders, substituted by the generator at delivery time. Templates must never hardcode the accent hex. Generator-supplied defaults: `#3ecf8e` (mint, used by Marketing and Foundations); other products supply their own per-product hex via the `TEMPLATES` entry in `admin/generator.html`. Lander pages (static, not generator-passed) DO hardcode the accent hex; the placeholder rule applies only to playbook templates.
- **Pixel placeholder:** Bare `PIXEL_ID` in landers and templates. Not `[[PIXEL_ID]]`.
- **Asset paths:** Leading slash always (`/assets/filename`). Never relative paths.
- **Refund policy (locked wording):** "You see Sections 1 and 2 free. By the time you pay, you know what you're getting. All sales are final. Access or delivery issues? Email us and we'll sort it out."
- **No ongoing work after delivery.** Product is fully self-contained.
- **No subscriptions.** One-off payments only.
- **Landing page language:** "our system" not "we" for delivery framing.

---

## Working arrangement with Claude (chat preference)

Jayden works in two Claude surfaces: **this chat (claude.ai)** for planning, spec work, copy, and strategy; **VS Code Claude** for repo reads/writes. This chat does not have access to the local repo. When Jayden asks to find, read, fix, or edit files in the repo, this chat writes the exact prompt for Jayden to paste into VS Code Claude, then Jayden pastes results back here. Relay pattern, not direct access.
