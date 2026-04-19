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

Always **PlainBlack**. Never "PlainBlack Creative", "Plain Black", or any other variation. In copy, playbooks, landers, conversation, code comments, everywhere. Full legal name is PlainBlack Creative Limited but the working brand name is PlainBlack only.

---

## The problem we solve

Small business owners are stuck in one of three traps:

1. **Paying too much** for agencies who guard the mystery and keep them dependent
2. **Drowning in information** from courses, YouTube, and blog posts that contradict each other and go out of date
3. **Doing nothing** because every option feels too technical, too expensive, or too time-consuming

A PlainBlack playbook cuts through all three. It is not education. It is a system. You follow it, you get the result.

**The filter for every product decision:** Does this make a business owner feel capable and in control? If yes: it belongs. If it creates confusion, dependency, or ongoing cost: it does not.

---

## The 5 launch products

All files in `playbooks/ready/`. All built, audited, and live as of April 2026. Products 6-9 deferred until the first 5 generate revenue.

| # | Product | Repo path | Niche | Accent |
|---|---|---|---|---|
| 1 | 90-Day Job Pipeline | `ready/90-day-job-pipeline/` | Residential trades (HVAC, plumbing, roofing, electrical) AU/NZ/US | Steel Blue `#2563a8` |
| 2 | AI-Powered Google Reviews | `ready/google-reviews/` | Hospitality, trades, retail, professional services | Mint `#3ecf8e` |
| 3 | Roofing AI Playbook | `ready/roofing-ai/` | Roofing contractors AU/NZ/US | Steel Blue `#2563a8` |
| 4 | Marketing Playbook | `ready/marketing/` | META + Google Ads, all small business | Mint `#3ecf8e` |
| 5 | AI Agents, Automations & Tools | `ready/ai-agents/` | All small business | Mint `#3ecf8e` |

**Deferred (products 6-9, do not build until first 5 generating revenue):**

| # | Product | Niche |
|---|---|---|
| 6 | Website & SEO Upgrade | All small business |
| 7 | AI Back Office Playbook | Anyone quoting, booking, invoicing |
| 8 | AI Phone Agent Playbook | Any business that misses calls |
| 9 | Website & Branding Revamp | All small business |

---

## The funnel (end to end)

```
META Ad
  → Lander (GitHub Pages — plainblackcreative.com)
    → Lead form (Web3Forms → Gmail)
      → Make.com scenario 1: fills [[PLACEHOLDERS]], saves personalised
        file to GitHub, generates token, emails customer
        → Customer opens playbook URL (?access=TOKEN)
          → Sections 1-2 visible free (personalised preview)
          → Section 3 teaser (partial blur, first ~3 lines visible)
          → Sections 4-10 locked (title + padlock only)
            → Paywall lightbox fires on scroll past section 2
              → Customer pays $99 via Stripe (inside playbook)
                → Stripe webhook → Make.com scenario 2: marks token paid
                  → Playbook re-validates, unlocks sections 3-10
                    → Customer bookmarks URL. Product delivered. No further work.
```

### Three deploy-time placeholder swaps (every lander)

| Placeholder | Replace with |
|---|---|
| `YOUR_ACCESS_KEY` | Web3Forms access key |
| `PIXEL_ID` | META Pixel ID |
| `[[STRIPE_PAYMENT_LINK]]` | Stripe payment link (inside template, not lander) |

---

## Make.com automation

### Scenario 1: Lead intake
**Trigger:** New email arrives in Gmail from Web3Forms

1. Parse form fields: business name, owner name, email, city/suburb, niche/service
2. Generate unique token (random string, 32 chars)
3. Store token in Make.com data store: key = customer email, value = `{ token, status: "pending", product, timestamp }`
4. Clone correct template file from GitHub repo
5. Find/replace all `[[PLACEHOLDERS]]` with parsed field values
6. Save personalised file to GitHub Pages: `playbooks/customers/[business-slug]-[random-suffix]/index.html`
7. Send delivery email to customer

### Scenario 2: Stripe webhook
**Trigger:** Stripe `checkout.session.completed` webhook

1. Extract customer email from Stripe event
2. Look up token in Make.com data store by email
3. Update token status: `pending` → `paid`
4. (Optional) Send confirmation email: "You're in. Bookmark this link."

### Make.com data store structure

```
Key: customer@email.com
Value: {
  token: "abc123xyz...",
  status: "pending" | "paid",
  product: "90-day-job-pipeline",
  business_name: "...",
  playbook_url: "https://plainblackcreative.github.io/playbooks/customers/...",
  created_at: "2026-04-18T..."
}
```

### Delivery email template

```
Subject: Your [PRODUCT NAME] playbook is ready

Hi [OWNER_NAME],

Your personalised playbook is ready. Here's your private link:

[PLAYBOOK URL]

Sections 1 and 2 are open now. Take a look. If it's what you need,
pay inside the playbook to unlock the full system.

Important: bookmark the full link above. It's the only way back in.
No account, no login, no password.

— PlainBlack
```

---

## Unlock mechanism (token validation)

Token appended to the playbook URL as `?access=TOKEN`

- Make.com generates a unique token per customer on form submission
- Token stored in Make.com data store keyed by customer email
- Playbook JS reads token from URL on load, validates against Make.com endpoint

**Token states:**
- `paid` → unlock sections 3-10
- `pending` → preview mode (sections 1-2 only, paywall fires on scroll)
- missing/invalid → redirect to lander

**Stripe success URL must append `?purchase=complete`:**
`https://plainblackcreative.github.io/playbooks/customers/[slug]/?access=TOKEN&purchase=complete`

**API proxy:** `https://plainblack-api-proxy.jkbrownnz.workers.dev`

---

## Tech stack

| Tool | Role |
|---|---|
| GitHub Pages | Hosts all landers, templates, customer playbooks |
| Web3Forms | Free form handling, routes leads to Gmail |
| Gmail | Receives Web3Forms leads, triggers Make.com |
| Make.com | Automation: lead intake, personalisation, delivery, Stripe webhook |
| Stripe | $99 one-off payment inside playbook |
| META Ads | Traffic. $30/day starting budget. 72-hour no-touch rule. |
| Claude API (via Cloudflare proxy) | Powers AI update buttons in every playbook section |
| Cloudflare Workers | API proxy at plainblack-api-proxy.jkbrownnz.workers.dev |
| VS Code + Claude | Primary build environment |

No backend servers. No databases. No accounts. Everything client-side or via Make.com.

---

## Repo structure (current)

```
plainblackcreative.github.io (custom domain: plainblackcreative.com)

assets/
  style.css              <- master stylesheet (live site only, not used in playbooks)
  Light_logo.png         <- white text, transparent bg (for dark backgrounds)
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
  customers/             <- Make.com writes personalised files here
  future/                <- products 6-9, not started

clients/                 <- legacy one-off client work
blog/                    <- published blog posts
```

---

## Launch sequence (per product)

1. Build template (JS-rendered SECTIONS array, all `[[PLACEHOLDERS]]`, brand kit compliant)
2. Build demo client version (all placeholders filled, hosted on GitHub Pages)
3. Build landing page (two deploy-time placeholders: `YOUR_ACCESS_KEY`, `PIXEL_ID`)
4. Lock price ($99)
5. Build 3 META ad creatives in Canva
6. Set up Web3Forms + Gmail filter + Make.com scenario 1
7. Set up Stripe payment link with `?purchase=complete` success redirect
8. Set up Make.com scenario 2 (Stripe webhook)
9. Install META Pixel on lander (bare `PIXEL_ID` placeholder)
10. Verify domain in META Business Manager
11. Launch campaign ($30/day, 72-hour no-touch rule)

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

## Deferred features (do not build until first 5 products generating revenue)

- **Need a hand? support button:** Floating bottom-right on unlocked playbooks. Web3Forms lightbox (name, email/phone, playbook URL auto-filled, message, screenshot upload).
- **Playbook AI Assistant (Pro tier):** Replaces support form with AI chat. Scope-aware, surfaces upsells outside current playbook scope. Needs subscription pricing to support API costs.
- **DFY Anchor Strategy:** $1,500-$3,000 done-for-you ad, retarget non-buyers with $99 playbook.
- **White Label (DIYAIPLAYBOOKS.COM):** Strip PlainBlack branding, license to agencies. Revisit after first 20-30 direct sales.
- **Footer removal from 90-Day template:** Template accidentally has a footer. Templates never have footers.
- **Mark Complete button consistency pass:** Audit all templates for uniform pattern.
- **`?purchase=complete` Stripe fallback consistency pass:** Audit all templates.

---

## Hard rules (never break)

- **Brand name:** PlainBlack only. No variations.
- **Price:** $99 in local currency (USD for US, NZD for NZ, AUD for AU). All other countries: $99 USD. No exceptions, no discounts.
- **Em dashes:** Never. Use commas, semicolons, or periods.
- **Backgrounds:** White (`#ffffff`) everywhere on customer-facing output. Ink only on sticky header/footer chrome.
- **Fonts:** Playfair Display + Figtree only. `font-synthesis: none` on body. No other fonts.
- **Logos:** Base64 embedded in playbooks and landers. Path reference on live site only. Light_logo on dark bg. Dark_logo on light/white bg. Never text substitutes.
- **Logo anti-underline:** Every `<a>` wrapping a logo must have `a:has(img){display:inline-flex;line-height:0;} img{display:block;border:none;}`
- **Light_logo bug:** Clean version is 1568x234px RGBA. If 252px tall or shows underline, the file has a baked-in 12px white bar at rows 235-251. Strip and re-crop from `/mnt/project/Light_logo.png` using Pillow.
- **No footer on playbook templates.** Landing pages have footers. Templates never do.
- **GA4:** `G-GP1WQCC0DY`. After Google Fonts link. Before style block. Include `<!-- Google Analytics -->` comment.
- **AI model:** `claude-sonnet-4-5` only. No dated variants (no `claude-sonnet-4-5-20250514`).
- **API proxy:** Always use `plainblack-api-proxy.jkbrownnz.workers.dev`. Never call `api.anthropic.com` directly from playbooks.
- **Border token:** `--border: #cce8d8;` exactly.
- **Accent in CSS:** Hardcoded hex only. Never `--accent: [[PLACEHOLDER]];`
- **Pixel placeholder:** Bare `PIXEL_ID` in landers and templates. Not `[[PIXEL_ID]]`.
- **Refund policy (locked wording):** "You see Sections 1 and 2 free. By the time you pay, you know what you're getting. All sales are final. Access or delivery issues? Email us and we'll sort it out."
- **No ongoing work after delivery.** Product is fully self-contained.
- **No subscriptions.** One-off payments only.
- **Landing page language:** "our system" not "we" for delivery framing.
