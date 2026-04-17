# PlainBlack - Project Master Memory

---

## WHAT THIS IS

PlainBlack (plainblackcreative.com) builds and sells one-off, AI-powered digital playbooks to small business owners via META ads. Products are personalised, interactive HTML files. Not PDFs. Not courses. Living documents that customers pay once to access, with embedded Claude AI that keeps them current. They replace the need for expensive agencies, marketers, designers, and content creators.

Each product is niched to an industry or use case. There is no umbrella product name. The product type is simply what it is: a playbook.

**The core promise:** Stop paying agencies $2,000 to $5,000 a month to do things you could do yourself in a couple of hours a week, if someone just showed you exactly how. PlainBlack playbooks do that. Step by step. Tool by tool. In plain language. With AI that keeps the content current so it never goes stale.

**Standard price point: $99 USD across all playbooks unless explicitly stated otherwise.**

**The math:** ~18 sales/week covers costs and profit. At $30/day USD ad spend, that's achievable with the right creative.

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
Callout (mint-glow background, 3px mint left border) — goal or key principle
Content grid (2 columns) — two content cards with arrow lists
Callout-warn (amber/gold background) — sanity check or common mistake
DIY accordion — numbered step-by-step, collapsible
Checklist — interactive tick items with localStorage persistence
AI update button + dark response box
```

### AI Update Button ("Check for Updates")

- On press: shows "AI scraping the web..." animation with three pulsing dots in the dark response box
- If updated content found: displays in dark response box, button changes to "Updated [timestamp]" with mint-dark background
- If nothing has changed: displays "No Update. Content is Correct." in dark response box with mint italic text, button resets to "Check for Updates"
- API: `claude-sonnet-4-20250514`, `web_search_20250305` tool enabled, max 1000 tokens, 250 word response limit

```javascript
// AI Update pattern
const res = await fetch('https://api.anthropic.com/v1/messages', {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify({
model: 'claude-sonnet-4-20250514',
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

### Paywall/Preview Gate (Demo Files)

Sections 1-2 open, Sections 3-10 locked behind paygate. Locked sections blurred with overlay. Unlock via URL param or localStorage token after payment confirmation.

---

## DESIGN SYSTEM

**All design decisions defer to the Brand Kit. That file is the master override.**

### Key Rules

- **Backgrounds:** White (`#ffffff`) on all pages, always. No dark page backgrounds on any customer-facing output.
- **Accent:** Mint (`#3ecf8e`) for PlainBlack-owned pages and marketing. Customer playbooks use the client's own brand colours as accent. Mint is the fallback only if no clear client brand colour exists.
- **Fonts:** Figtree (body/UI, 15px, 1.65 line-height) + Playfair Display (display headlines and italic editorial accent). Always loaded from Google Fonts with the 1,700 italic variant included to prevent Safari synthesis. Body must have `font-synthesis: none`.
- **Logo:** Live site references by path (`assets/Light_logo.png`). Playbooks embed as base64 from project files. `Light_logo.png` on dark backgrounds (headers). `Dark_logo.png` on light/white backgrounds. Never substitute text or reference by filename only in delivered HTML.
- **Header:** Ink background, 64px height, 3px mint progress bar underneath.
- **Sidebar:** 260px fixed width, white background, 1px border, 14px border radius.
- **Section cards:** White background, 1px `--border` border, 16px border radius.
- **CTA buttons:** Mint background, ink or white text, 8px border radius. No pill shapes.
- **AI update button:** Ink background, white text, 10px/18px padding.
- **Mark Complete button:** Mint background, white text, 8px border radius.
- **Progress bar:** 3px height, mint fill.
- **Completion banner:** Mint gradient.
- **Prices:** Use the `.price` component (Playfair italic 700 numerals, `$` floated top-left). Never hand-roll price styles.
- **No em dashes anywhere.** Use commas, semicolons, or periods.

### Master Stylesheet

Live site loads `plain-black-website/assets/style.css` which holds all shared tokens and components. Pages only carry their page-specific CSS inline. Playbooks remain single self-contained HTML files, so they use an inline `<style>` block sourced from the playbook template.

### Font Imports

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

---

## PRODUCT LIBRARY

| Product | Status | Price |
|---|---|---|
| AI-Powered Google Reviews Playbook | Built (generic + niche versions) | $99 USD |
| Marketing Playbook (META + Google Ads) | Built | $99 USD |
| AI Agents, Automations & Tools | Built | $99 USD |
| Website & Branding Revamp | Example built | $99 USD |
| Website, SEO & AEO Upgrade | Example built | $99 USD |
| Digital Footprint Audit & Playbook | Planned | $99 USD |
| Social Media Playbook | Planned | $99 USD |
| 90-Day Marketing Campaign | Planned | $99 USD |
| Content Creation System | Planned | $99 USD |
| Industry-Specific Playbooks (trades, NDIS, hospitality, etc.) | In progress | $99 USD |

---

## THE FUNNEL (Fully Automated, Zero Ongoing Work)

1. **META Ad** — Static or short video creative targeting small business owners. AU/NZ primary, broad small business secondary. Pixel installed for retargeting.
2. **Landing Page** — GitHub Pages or Squarespace. Sections 1-2 of demo visible free, rest gated. Clear value prop. Squarespace nav hidden via CSS injection.
3. **Lead Capture Form** — Web3Forms routes to Gmail. Fields: business name, owner name, email, location, industry (optional). Fewer fields means less drop-off.
4. **Payment** — Stripe one-off payment link. $99 USD. No subscriptions. Success redirect fires Purchase pixel event.
5. **Delivery** — Gmail autoresponder sends playbook URL. Semi-manual for first 20-30 sales. Automate after funnel is proven.
6. **Access** — Playbooks hosted on GitHub Pages under PlainBlack's account. Private, unguessable URLs. No logins or accounts needed.

### Three Landing Page Placeholders (Every Build)

| Placeholder | Replace With | Time |
|---|---|---|
| `YOUR_ACCESS_KEY` | Web3Forms access key | 2 min |
| `YOUR_STRIPE_LINK` | Stripe payment link | 10 min |
| `PIXEL_ID` | META Pixel ID | 5 min |

### Squarespace Nav Hide

```html
<style>
header, #header, .header, nav, .Nav, .Header { display: none !important; }
footer, #footer, .footer, .Footer { display: none !important; }
</style>
```

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

Zero placeholders check required before any customer file is delivered. Run `grep -c '\[\['` before output.

### Four-File Structure Per Product

1. Full customer playbook (all placeholders filled, specific to one business)
2. Landing page (three placeholder swaps before going live)
3. Gated demo (Sections 1-2 open, 3-10 locked)
4. Blank template with `[[PLACEHOLDERS]]` for future customer builds

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
5. Lock price ($99 USD unless stated otherwise)
6. Build 3 META ad creatives in Canva
7. Set up Web3Forms + Gmail filter + delivery email template
8. Set up Stripe payment link with success redirect to thank-you page
9. Install META Pixel on landing page and thank-you page
10. Verify domain in META Business Manager
11. Launch campaign ($30/day USD, 72-hour no-touch rule)

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

## CONSTRAINTS & RULES

- No ongoing work after setup. Everything automated.
- No subscriptions. One-off payments only.
- No backend servers. Everything client-side (HTML + JS + API calls).
- Standard price: $99 USD. Only deviate if explicitly instructed.
- No em dashes anywhere. Use commas, semicolons, or periods.
- All pricing in USD.
- Landing page language: "our system" not "we" for delivery framing.
- Delivery framing: products are delivered instantly.
- Brand name: always "PlainBlack" in all output.

---

## SITE SPECS

- Max content width: 1200px (playbooks), 1920px (marketing pages)
- Currency: USD
- Marketing site: plainblackcreative.com (Squarespace / GitHub Pages hybrid)
- Live site stylesheet: `plain-black-website/assets/style.css` (master shared styles)
- Customer deliverables: GitHub Pages under PlainBlack's GitHub account
