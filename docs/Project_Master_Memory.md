# PlainBlack · Project Master Memory

---

## WHAT THIS IS

PlainBlack (plainblackcreative.com) builds and sells one-off, AI-powered digital playbooks to small business owners via META ads. Products are personalised, interactive HTML files. Not PDFs. Not courses. Living documents that customers pay once to access, with embedded Claude AI that keeps them current. They replace the need for expensive agencies, marketers, designers, and content creators.

Each product is niched to an industry or use case. There is no umbrella product name. The product type is simply what it is: a playbook.

**The core promise:** Stop paying agencies $2,000 to $5,000 a month to do things you could do yourself in a couple of hours a week, if someone just showed you exactly how. PlainBlack playbooks do that. Step by step. Tool by tool. In plain language. With AI that keeps the content current so it never goes stale.

**Standard price point: $99 flat across NZ, Australia, and the US.** Stripe handles currency conversion at checkout, so AU/NZ customers effectively get a soft discount versus US customers.

**The math:** ~18 sales/week covers costs and profit. At $30/day ad spend, that's achievable with the right creative.

---

## BRAND NAME

Always refer to the brand as **PlainBlack**. Never "PlainBlack Creative," "Plain Black," or any other variation in product copy, landing pages, playbook content, or conversation. The full legal name is PlainBlack Creative but the working brand name everywhere is PlainBlack.

PlainBlack is founded by Ian Clarquinn and Jayden Brown. The business provides clients with agency-level creative marketing solutions at honest, transparent pricing. The positioning reflects the gap between DIY price and inflated agency price, without underestimating business owners' intelligence, but respecting their time.

---

## WHAT WE SELL

A personalised, interactive HTML playbook that replaces the need for agencies, consultants, and hours of outdated YouTube tutorials. One payment. No subscriptions. No ongoing help after delivery.

Every playbook is built for one specific business, in one specific niche, with that owner's name, location, services, and challenges baked in throughout. It is not a template they fill in. It arrives ready to use.

**What a playbook is not:** Not a course. Not a PDF. Not a guide you read once. Not a template the owner fills in themselves. Not something that requires us to do anything after delivery. It is a living system, personalised to one business, that tells the owner exactly what to do, when, and how, with AI standing by to keep it current.

**Positioning in one line:** Agency-level results. DIY price. Done in under 2 hours.

---

## THE PROBLEM WE SOLVE

Small business owners are stuck in one of three traps:

1. **Paying too much** for agencies or consultants who guard the mystery and keep them dependent
2. **Drowning in information** from courses, YouTube videos, and blog posts that contradict each other and go out of date fast
3. **Doing nothing** because every option feels too technical, too expensive, or too time-consuming

A PlainBlack playbook cuts through all three. It is not education. It is a system. You follow it, you get the result.

---

## THE FILTER FOR EVERY PRODUCT DECISION

Does this section, this tool, this step, or this feature make a business owner feel capable and in control?

If yes: it belongs. If it creates confusion, dependency, or ongoing cost: it does not.

---

## NON-NEGOTIABLE PRODUCT RULES (Every Playbook, Every Build)

**Free tools only at launch.** No paid subscriptions as requirements. Every tool referenced must be free, reliable, and genuinely useful. Paid options can be flagged as optional, never prerequisites.

**Always current.** Every section has a "Check for Updates" AI button. One click scrapes the web for fresh, relevant information for that specific section. The playbook can never go stale.

**Minimal setup time.** Getting started should take under 30 minutes. If a section requires significant setup, break it into the smallest possible steps with clear checkpoints.

**Minimal weekly time.** Each playbook should be maintainable in 1 to 2 hours per week once set up. If a strategy requires more, it does not belong in the product.

**Click or copy-paste only.** Every action step is a direct link, a copy-paste snippet, or a numbered instruction. No "figure it out" moments.

**Exact and personalised.** Every playbook references the owner's actual business, services, location, and goals. Not "your business name here." Their business name, throughout.

**Light style, always.** White background. Clean typography. No dark themes in customer-facing products. No exceptions.

**Both paths covered.** Where ad spend is relevant, cover both a paid track (META ads, Google Ads) and an organic-only track (SEO, Google Business Profile, social). Owners who cannot or will not spend on ads still get a complete path forward.

**Wide market.** Every niche must have enough businesses to build a real audience. No hyper-specific segments that cap the market at a few hundred buyers.

**Obvious value on sight.** From the landing page to the first section, it must be immediately clear that this saves time, saves money, and removes the need for outside help.

---

## THE PRODUCT FORMAT

Each product is a **single self-contained HTML file** with:

- Sticky header with PlainBlack logo (embedded as base64), 64px height, 3px mint progress bar underneath
- Sidebar navigation (260px fixed) with section checkboxes, progress stats, localStorage persistence
- Main content area: 10 sections, each with full section anatomy (see below)
- Mobile responsive with collapsible sidebar overlay
- Completion banner when all sections are marked done
- DIY-friendly language with clear action steps, not theory

### Section Anatomy (Every Section Must Have All of These)

```
Callout (mint-glow background, 3px mint left border), goal or key principle
Content grid (2 columns), two content cards with arrow lists
Callout-warn (amber/gold background), sanity check or common mistake
DIY accordion, numbered step-by-step, collapsible
Checklist, interactive tick items with localStorage persistence
AI update button + dark response box
```

### AI Update Button ("Check for Updates")

- On press: shows "AI scraping the web..." animation with three pulsing dots in the dark response box
- If updated content found: displays in dark response box, button changes to "Updated [timestamp]" with mint-dark background
- If nothing has changed: displays "No Update. Content is Correct." in dark response box with mint italic text, button resets to "Check for Updates"
- API: `claude-sonnet-4-5`, `web_search_20250305` tool enabled, max 1000 tokens, 250 word response limit

```javascript
// AI Update pattern
const res = await fetch('https://api.anthropic.com/v1/messages', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    model: 'claude-sonnet-4-5',
    max_tokens: 1000,
    system: SYSTEM_PROMPT,
    tools: [{ type: 'web_search_20250305', name: 'web_search' }],
    messages: [{ role: 'user', content: UPDATE_PROMPT }]
  })
});
// If response text is 'NO_UPDATE': show "No Update. Content is Correct."
// Otherwise: show text, stamp button with timestamp
```

### Persistence (localStorage)

```javascript
function saveState() {
  const state = {};
  // section done states + checkbox states
  localStorage.setItem(PLAYBOOK_ID, JSON.stringify(state));
}
function loadState() {
  const state = JSON.parse(localStorage.getItem(PLAYBOOK_ID));
  // restore section badges, nav ticks, checkboxes, progress bar
}
```

### Paywall/Preview Gate

Every customer playbook is delivered in paywalled state. Sections 1-2 visible as preview (already personalised with the customer's business details). Sections 3-10 locked behind paywall lightbox. Scrolling past section 2 fires the paywall. Stripe payment happens inside the playbook, not on the landing page. See the full **Unlock Mechanism** section below for the token flow.

---

## DESIGN SYSTEM

**All design decisions defer to the Brand Kit (`docs/PLAINBLACK_BRAND_KIT.md`). That file is the master override.**

### Key Rules

- **Backgrounds:** White (`#ffffff`) on all pages, always. No dark page backgrounds on any customer-facing output.
- **Accent:** Mint (`#3ecf8e`) for PlainBlack-owned pages and marketing. Customer playbooks use the client's own brand colours as accent. Niche-appropriate fallback used only if no clear client brand colour exists.
- **Fonts:** Playfair Display (display headlines + italic editorial accent) + Figtree (body/UI, 15px, 1.65 line-height). Always loaded from Google Fonts with italic 700 variant. Body must have `font-synthesis: none` (Safari italic fix).
- **Logo:** Embed as base64 from project files. `Light_logo.png` on dark backgrounds (headers). `Dark_logo.png` on light/white backgrounds. Never substitute text or reference by filename only in delivered HTML.
- **Header:** Ink background, 64px height, 3px mint progress bar underneath.
- **Sidebar:** 260px fixed width, white background, 1px border, 14px border radius.
- **Section cards:** White background, 1px `--border` border, 16px border radius.
- **CTA buttons:** Mint background, ink or white text, 8px border radius. No pill shapes.
- **AI update button:** Ink background, white text, 10px/18px padding.
- **Mark Complete button:** Mint background, white text, 8px border radius.
- **Progress bar:** 3px height, mint fill.
- **Completion banner:** Mint gradient.
- **Prices:** Use the `.price` component (Playfair italic 700 numerals, `$` floated top-left) for dedicated pricing blocks only. Never wrap inline prose prices in `.price`, write them as plain text: `$99`, `$3,500`, etc.
- **No em dashes anywhere.** Use commas, semicolons, or periods.

### Font Import

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Figtree:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet">
```

### CSS Tokens

```css
--mint:       #3ecf8e;
--mint-dark:  #27a870;
--mint-pale:  #d6f5e8;
--mint-glow:  rgba(62,207,142,0.12);
--ink:        #0e1a14;
--ink-mid:    #2a3d32;
--ink-soft:   #4a6358;
--paper:      #f5fbf7;
--paper-2:    #edf7f2;
--border:     #cce8d8;
--white:      #ffffff;
--shadow:     0 2px 16px rgba(14,26,20,0.07);
--radius:     16px;
```

### Accent Colour Fallbacks (Customer Playbooks)

When a customer has no identifiable brand colour, pick from these niche-appropriate fallbacks instead of defaulting to mint:

| Hex | Name | Best for |
|---|---|---|
| `#3ecf8e` | PlainBlack Mint | Default, music, entertainment |
| `#d4820a` | Warm Amber | Hospitality, food, cafes |
| `#2563a8` | Steel Blue | Trades, construction, roofing |
| `#0d9488` | Soft Teal | Wellness, health, fitness |
| `#6d28d9` | Deep Violet | Retail, e-commerce, fashion |
| `#1e3a5f` | Charcoal Navy | Professional services, legal, finance |

All other brand kit rules (white background, typography, spacing, logo usage) apply regardless of accent choice.

---

## PRODUCT LIBRARY

The 9 live playbooks (locked lineup):

| # | Playbook | Niche | Status |
|---|---|---|---|
| 1 | 90-Day Job Pipeline | Residential trades (HVAC, plumbing, roofing, electrical) | Placeholder exists, rebuild required |
| 2 | Google Reviews Playbook | Hospitality, trades, retail, professional services | Placeholder exists, rebuild required |
| 3 | Roofing AI Playbook | Roofing contractors | Placeholder exists, rebuild required |
| 4 | Marketing Playbook | META + Google Ads, all small business | Placeholder exists, rebuild required |
| 5 | AI Agents, Automations & Tools | All small business | Placeholder exists, rebuild required |
| 6 | Website & Branding Revamp | All small business | Placeholder exists, rebuild required |
| 7 | Website, SEO & AEO Upgrade | All small business | Placeholder exists, rebuild required |
| 8 | AI Back Office Playbook | Anyone quoting, booking, invoicing | Not yet built |
| 9 | AI Phone Agent Playbook | Any business that misses calls | Not yet built |

**All $99 flat, one-off. Stripe handles currency conversion at checkout.**

**Status note:** Every existing file in `playbooks/` is a placeholder, outdated, or irrelevant. The lineup is locked structurally; the actual playbook content and landing pages require a full build pass.

**Defunct / archived:**
- "AI Takeover Playbook", merged into Marketing Playbook scope, separate product no longer planned

**Parked for later (not in top 9):**
- Digital Footprint Audit & Playbook
- Social Media Playbook
- 90-Day Marketing Campaign
- Content Creation System
- Industry-specific niche playbooks (NDIS, specific trades)

---

## THE FUNNEL (Fully Automated, Zero Ongoing Work)

1. **META Ad**: Static or short video creative targeting small business owners. AU/NZ primary, broad small business secondary. Pixel installed for retargeting.
2. **playbooks.html**: 9 playbook cards on the main site. CTA click routes to that playbook's dedicated landing page.
3. **Playbook Landing Page**: One per playbook. GitHub Pages hosted. Sells the specific playbook. Clear value prop.
4. **Lead Capture Form**: Web3Forms routes to Gmail. Fields: business name, owner name, email, location, industry. Form is FREE (no payment here). Fewer fields means less drop-off.
5. **Delivery Email**: Make.com generates the personalised playbook, stores a token keyed by email in the Make.com data store, and emails the customer their private playbook URL with the token appended: `?access=TOKEN`
6. **Customer Opens Their Playbook**: Personalised HTML file on GitHub Pages. Sections 1-2 are visible as a preview (try-before-you-buy). All content is already personalised with their business name, location, services.
7. **Paywall Trigger**: When the customer scrolls past section 2, a paywall lightbox fires. Stripe payment happens HERE, inside the playbook, not on the landing page.
8. **Stripe Success**: Payment webhook hits Make.com. Make.com validates the payment, marks the token as paid in the data store. Success redirect returns the customer to their playbook URL with paid status. Fires Purchase pixel event.
9. **Full Unlock**: Playbook re-checks the token status, unlocks sections 3-10. Customer has a fully personalised, fully unlocked playbook. No account, no login, no password.
10. **Permanent Access**: The bookmarked URL with token is the product. Revisiting on any device re-validates the token and re-unlocks automatically.

### Three Landing Page Placeholders (Every Build)

| Placeholder | Replace With | Time |
|---|---|---|
| `YOUR_ACCESS_KEY` | Web3Forms access key | 2 min |
| `YOUR_STRIPE_LINK` | Stripe payment link (inside the playbook, not the landing page) | 10 min |
| `PIXEL_ID` | META Pixel ID | 5 min |

---

## UNLOCK MECHANISM (Paywall / Access Token)

**Access token is appended to the playbook URL as `?access=TOKEN`**

- Make.com generates a unique token per customer when the form is submitted
- Token stored in Make.com data store keyed by customer email
- Token status: `pending` before payment, `paid` after Stripe webhook fires
- Playbook JavaScript reads token from URL on load, validates status against a Make.com endpoint
- Valid + paid → unlock sections 3-10
- Valid + pending → preview mode (sections 1-2 only, paywall lightbox on scroll)
- Invalid / missing → redirect to the playbook's landing page

**Customer recovery instructions (in delivery email):**

1. Bookmark the full URL including the `?access=TOKEN` parameter, not just the base URL
2. Save to Notes, Gmail, Google Drive, or a password manager as backup
3. If they clear cookies/cache or switch devices: just revisit the bookmarked URL, the token in the URL re-unlocks automatically
4. "The link is the product. No account, no login, no password to recover."

**Admin access (deferred decision):** Need a way to access any client's playbook without them for support, audits, debugging. Two options on the table: (a) master CRM sheet logging every client URL + token, or (b) admin override token that unlocks any playbook. Decision parked, revisit when building the unlock mechanism itself.

---

## PLAYBOOK BUILD STANDARDS

### Writing Rules

- Direct, no-fluff, second-person ("you", not "one")
- No em dashes. Use commas, semicolons, or periods.
- No generic AI voice. Every sentence should feel specific to this business.
- Sanity checkpoints at key stages: "If your screen doesn't look like this, stop."
- Specific beats vague: name the tool, give the time estimate, state the cost.
- No upsell blocks at the end of playbooks. Product is fully self-contained.
- Tone: reads like an experienced operator sitting next to the owner.

### Placeholder Convention (Templates)

`[[DOUBLE_BRACKETS_CAPS_UNDERSCORE]]`

- Placeholders appear in: HTML content, CSS comment block at top of TEMPLATE, JS `SYSTEM_PROMPT`, JS `PLAYBOOK_ID`, per-section AI prompts.
- CSS comment block at the top of every TEMPLATE file lists every placeholder with an example value.
- Common to all niches: `[[BUSINESS_NAME]]`, `[[BUSINESS_SLUG]]`, `[[OWNER_NAME]]`, `[[CITY]]`, `[[REGION]]`, `[[COUNTRY]]`, `[[MONTH_YEAR]]`
- Niche-specific placeholders defined per project.

**Zero placeholders check** required before any customer file is delivered. Run `grep -c '\[\['` before output. A file with `[[PLACEHOLDER]]` strings is never a finished deliverable.

### Four-File Structure Per Product

1. Full customer playbook (all placeholders filled, specific to one business)
2. Landing page (three placeholder swaps before going live)
3. Gated demo (Sections 1-2 open, 3-10 locked)
4. Blank template with `[[PLACEHOLDERS]]` for future customer builds

---

## TOOL PILL COLOUR SYSTEM

Every playbook section header shows "tool pills" indicating which tools the section uses and whether they're free. Pills use a consistent colour system across all niches, so the same tool always looks the same.

**Core pill classes:**

```css
.tool-pill      { font-size: 10px; font-weight: 600; padding: 2px 8px; border-radius: 4px; letter-spacing: 0.04em; }
.tool-instagram { background: #fce4ec; color: #c2185b; }
.tool-tiktok    { background: #e8eaf6; color: #3949ab; }
.tool-facebook  { background: #e3f2fd; color: #1565c0; }
.tool-google    { background: #fff3e0; color: #e65100; }
.tool-ai        { background: var(--mint-pale); color: var(--mint-dark); }
.tool-canva     { background: #fce4ec; color: #ad1457; }
.tool-free      { background: #f0f0f0; color: #555; }
.tool-notion    { background: #f0f0f0; color: #333; }
.tool-stripe    { background: #ede9fe; color: #5b21b6; }
.tool-zapier    { background: #fff3e0; color: #c05621; }
```

Add new classes as new tools appear across niches. Keep the pattern: soft tinted background, darker text in the same hue, matching brand colour where possible.

---

## CRITICAL SUCCESS FACTORS

1. **System, not a guide.** Checklists, sequences, decision trees. If it doesn't feel like a system, it won't convert.
2. **Reduce fear.** Answer: what to start with, what NOT to do, when to stop. If it doesn't reduce risk, they'll still hire an agency.
3. **Quick win in the first 3-5 minutes.** First section must feel immediately doable.
4. **Sounds like PlainBlack.** Not a ChatGPT doc. Experienced operator sitting next to you saying "don't do that dumb thing."
5. **Framing matters.** "Agency-level results. DIY price. Done in under 2 hours."
6. **Sanity checkpoints.** "If your screen doesn't look like this, stop."
7. **Common mistakes section.** Builds trust fast.

**The big question:** Does this make a business owner feel confident enough to take action without us? If yes, $99 is a steal. If no, it's just interesting info.

---

## LAUNCH SEQUENCE (Per Product)

1. Build playbook (generic version, brand kit compliant, zero em dashes, logo embedded)
2. Build demo client version (real business, all placeholders filled, hosted on GitHub Pages)
3. Build gated demo (Sections 1-2 open, 3-10 locked)
4. Build landing page (three placeholder swaps before going live)
5. Lock price ($99 unless stated otherwise)
6. Build 3 META ad creatives in Canva
7. Set up Web3Forms + Gmail filter + delivery email template
8. Set up Stripe payment link with success redirect to playbook URL (not a thank-you page)
9. Install META Pixel on landing page and inside the playbook (for Purchase event)
10. Verify domain in META Business Manager
11. Launch campaign ($30/day, 72-hour no-touch rule)

**Success metrics:**
- Landing page conversion: 3-5%
- Ad CTR: 1.5%+
- Target: 3+ sales/day at $30/day ad spend

---

## STRATEGIC POSITIONING

This is not a document business. It is a productised service disguised as a document. Generic playbooks are forgettable. Personalised playbooks are sticky, valuable, and hard to replace.

**Key differentiators:**
- **Removed agency dependency.** Most agencies protect the mystery and keep clients reliant. PlainBlack does the opposite: "Here's how to do it yourself properly."
- **Personalised.** Template backend, customised front-end. This is the lever for scaling.
- **Solving a real pain.** People are ready to spend but don't trust themselves. PlainBlack steps in with: "You can do this. Here's how." That's not marketing. That's leadership.

---

## DEFERRED FEATURES

Features scoped but not yet built. Full context in `docs/working-archive.html`.

- **Need a hand? support button**: Floating bottom-right button on unlocked playbooks only. Opens a Web3Forms-backed support request lightbox (name, email/phone, playbook URL auto-filled, message, screenshot upload). Dedicated support key. Build after the 9-playbook template locks.
- **Playbook AI Assistant (Pro tier)**: Replaces the Need a hand? form with an AI chat interface. Scope-aware, surfaces upsells when questions fall outside the current playbook. Deferred until subscription/Pro pricing exists to support per-session API costs.
- **DFY Anchor Strategy**: Price anchor ad sequence. Run a $1,500-$3,000 done-for-you ad, retarget non-buyers with the $99 playbook offer. Deferred until core funnel proven.
- **White Label (DIYAIPLAYBOOKS.COM)**: Strip PlainBlack branding, license to agencies/freelancers as a resellable tool. Archived until first 20-30 direct sales validate the core product.

---

## CONSTRAINTS & RULES

- No ongoing work after setup. Everything automated.
- No subscriptions. One-off payments only.
- No backend servers. Everything client-side (HTML + JS + API calls). Make.com handles data store for tokens and Stripe webhook routing.
- Standard price: $99 flat across NZ, AU, US. Only deviate if explicitly instructed.
- No em dashes anywhere. Use commas, semicolons, or periods.
- Landing page language: "our system" not "we" for delivery framing.
- Delivery framing: products are delivered instantly after form submission (paywalled), fully unlocked on payment.
- Brand name: always "PlainBlack" in all output.

---

## SITE SPECS

- Max content width: 1200px (playbooks), 1920px (marketing pages)
- Marketing site: plainblackcreative.com (GitHub Pages)
- Live site stylesheet: `assets/style.css` (master shared styles)
- Customer deliverables: GitHub Pages under the `plainblackcreative` GitHub account
- Internal tools: `docs/` folder, not linked from public site

---

## REPO STRUCTURE (Current State)

```
plain-black-website/
  index.html, about.html, contact.html, services.html, playbooks.html,
  work.html, privacy.html, givesback.html, 404.html, blog.html   ← live pages

  assets/
    style.css              ← master stylesheet for live site
    Light_logo.png, Dark_logo.png, favicon.webp
    blog/                  ← blog post images
    branding/              ← client brand images
    profile-pics/          ← team photos
    js/blog-images.js

  blog/                    ← 22 published posts + archive/

  docs/                    ← internal tools (private, not linked from public site)
    blog-gen.html          ← blog post generator
    plainblack-hub.html    ← internal project dashboard
    blog-library.json      ← blog post metadata registry
    outreach-kit.html      ← outreach templates (email/DM/hooks/ad copy)
    tracking-plan.html     ← META Pixel + CRM setup guide
    dashboard.html         ← live analytics dashboard (dark theme intentional)
    working-archive.html   ← deferred projects, strategic ideas
    PLAINBLACK_BRAND_KIT.md
    Project_Master_Memory.md

  playbooks/               ← all files are placeholders, rebuild required
    ready/                 ← graduates go here when production-ready
    90day-pipeline/, ai-powered-google-reviews/, ai-takeover/ (defunct),
    client-playbooks/, marketing/, mlm-masterclass/, ordermeal-escape/,
    roofing-ai/, team-coach/

  clients/                 ← client-specific playbooks, overlaps with playbooks/, needs audit

  hire-us/, mint-playbook/, news/   ← SEO redirects from old Squarespace site, don't touch

  CNAME, README.md, _config.yml, gitignore.txt
```
