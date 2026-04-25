# PlainBlack · Build Spec
**Last updated:** April 2026
**Applies to:** All landers, playbook templates, and any new HTML output

---

## Brand kit (master override)

All visual outputs use this kit without exception.

### Logos

**Universal rule (no exceptions):**
- **Light_logo.png** (white text, transparent bg) → on ALL dark/black backgrounds, including sticky headers AND lander footers.
- **Dark_logo.png** (black text, transparent bg) → on ALL light/white backgrounds, including main marketing site pages where footers are white.

**Always base64 embedded in playbooks and landers.** Never filename reference only in delivered HTML.

Base64 source files in repo: `assets/LOGO_LIGHT_BASE64.txt`, `assets/LOGO_DARK_BASE64.txt`
Base64 source files in project: `/mnt/project/LOGO_LIGHT_BASE64.txt`, `/mnt/project/LOGO_DARK_BASE64.txt`

**Anti-underline CSS — required on every `<a>` wrapping a logo:**
```css
a:has(img) { display: inline-flex; line-height: 0; }
img { display: block; border: none; }
```

**Light_logo bug:** Clean version is 1568x234px RGBA. If 252px tall or shows an underline, the file has a baked-in 12px white bar at rows 235-251. Strip and re-crop from `/mnt/project/Light_logo.png` using Pillow.

### CSS tokens (every file)

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

### Accent colour

- **PlainBlack landers and marketing:** Mint (`#3ecf8e`) always.
- **Customer playbooks:** Use client's own brand colour as `--accent` and `--accent-dark`.
- **No client brand colour?** Use niche-appropriate fallback:

| Hex | Name | Best for |
|---|---|---|
| `#3ecf8e` | PlainBlack Mint | Default, music, entertainment |
| `#d4820a` | Warm Amber | Hospitality, food, cafes |
| `#2563a8` | Steel Blue | Trades, construction, roofing |
| `#0d9488` | Soft Teal | Wellness, health, fitness |
| `#6d28d9` | Deep Violet | Retail, e-commerce, fashion |
| `#1e3a5f` | Charcoal Navy | Professional services, legal, finance |

**Accent in CSS must always be a hardcoded hex value. Never `--accent: [[PLACEHOLDER]];`**

### Font import (every file)

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Figtree:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet">
```

Body rule:
```css
body { font-family: 'Figtree', sans-serif; font-synthesis: none; font-size: 15px; line-height: 1.65; }
```

### GA4 snippet (every file, every time)

Insert in `<head>` after Google Fonts link, before any `<style>` blocks:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-GP1WQCC0DY"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-GP1WQCC0DY');
</script>
```

### Price component

Use `.price` for dedicated pricing blocks only. Never for inline prose prices (write as plain text: `$99`).

```html
<span class="price price--sm"><span class="price__currency">$</span>99</span>
```

### Tool pill CSS

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
.tool-make      { background: #e8f4fd; color: #1a6fa8; }
```

---

## Lander spec (11 sections, every lander)

| # | Section | Notes |
|---|---|---|
| 1 | Hero | Real hardcoded copy. Trust stack above fold. No `[[PLACEHOLDERS]]`. |
| 2 | Proof bar | Tool logo pills, sales counter, testimonial snippet |
| 3 | Pain section | Name the pain bluntly before offering a solution |
| 4 | What you get | 10 module cards, one per playbook section |
| 5 | AI feature | "Always current" hook. Check for Updates mechanic explained. |
| 6 | How it works | 3-step flow: form free, preview, pay $99 inside |
| 7 | Price | $99 block. No anchoring. No strikethrough. |
| 8 | FAQ | 9 questions in locked order (see below) |
| 9 | Lead form | 6 required + 1 optional fields (see below) |
| 10 | Final CTA | Mint button to `#form` |
| 11 | Footer | Dark ink bg. Light_logo (white text). Applies to ALL lander footers. |

### Mandatory conversion elements (every lander)

- **GA4 snippet:** `G-GP1WQCC0DY` — after Google Fonts link, before style block
- **META Pixel:** bare `PIXEL_ID` placeholder + noscript fallback
- **Sticky mobile CTA bar:** fixed bottom, mint bg, "Get the Playbook" → `#form`, hidden on desktop
- **Exit intent overlay:** desktop = mouseleave from top edge (`clientY <= 0`); mobile = 45-second timer; sessionStorage key `pb_exit_shown` shared across all landers (fires once per session across all 5 landers). JS always wrapped in `DOMContentLoaded` so overlay HTML exists before script runs. No form, just headline + two buttons ("Get the free preview" → form anchor, "See all playbooks" → plainblackcreative.com/playbooks) + dismiss link.
- **Mobile responsive:** breakpoints at 900px and 640px

### Lead form: 6 required + 1 optional fields

**Required:**

1. Business name
2. Owner first name
3. Email
4. City/suburb
5. Primary service
6. Country

**Optional:**

7. Website

**Explicit exclusions (never add these to any lander):**

- Phone
- Industry dropdown
- Team size
- Budget

**Field label lock:** the label for field 5 is `Primary service`. Accept no drift to `Trade type`, `Type of business`, `Service type`, or any other variation across landers.

### CTA wording (locked)

Single locked CTA string applies to every call-to-action across all 5 landers:

> Get the Playbook

Title case. No prices (`$99`), no dollar figures, no `my playbook`, no `free preview`, no `Get Your`. One string, every placement: hero CTA, sticky mobile CTA, primary form submit button, nav CTA, mid-page CTAs, final-section CTAs.

One exception: exit-intent overlay has two buttons. Button 1 (leads to form) uses `Get the Playbook`. Button 2 (leads to `/playbooks`) uses `See all playbooks`.

The form-card heading above the form fields is not a CTA but must also read `Get the Playbook.` (with period) for consistency.

### FAQ: 9 questions in this exact order

1. How is this different from a course or PDF?
2. What if I'm not technical?
3. How long does setup take?
4. Is this one-time or ongoing?
5. Is my playbook private?
6. What's the refund policy?
7. How does the AI update work exactly?
8. What if I need help?
9. Who is PlainBlack?

**Q5 locked answer:**

> Your playbook is hosted at a private, unguessable URL that is never listed, indexed, or shared with anyone other than you. No accounts, no logins, no passwords. Just a link only you have.

**Refund answer (item 5 — use exactly):**
"You see Sections 1 and 2 free. By the time you pay, you know what you're getting. All sales are final. Access or delivery issues? Email us and we'll sort it out."

### Lander placeholders (only these two remain unfilled at deploy time)

- `YOUR_ACCESS_KEY` — Web3Forms access key
- `PIXEL_ID` — META Pixel ID

Zero `[[` double-bracket placeholders in any lander. Run `grep -c '\[\['` before delivering — must return 0.

### Standard nav (all 5 landers, uniform)

```html
<header class="site-header">
  <div class="container">
    <a href="https://plainblackcreative.com" class="site-header__logo" style="display:inline-flex;line-height:0;">
      <img src="data:image/png;base64,[LIGHT_LOGO_BASE64]" alt="PlainBlack" style="display:block;border:none;height:28px;width:auto;">
    </a>
    <nav class="site-header__nav">
      <a href="https://plainblackcreative.com">Home</a>
      <a href="https://plainblackcreative.com/playbooks">Playbooks</a>
      <a href="https://plainblackcreative.com/services">Services</a>
      <a href="https://plainblackcreative.com/work">Work</a>
      <a href="https://plainblackcreative.com/about">About</a>
      <a href="https://plainblackcreative.com/blog">Blog</a>
    </nav>
    <a href="#form" class="site-header__cta">Get the Playbook</a>
    <button class="hamburger" onclick="document.querySelector('.lander-mobile-nav').classList.toggle('open');this.classList.toggle('active')" aria-label="Menu">
      <span></span><span></span><span></span>
    </button>
  </div>
</header>
<nav class="lander-mobile-nav">
  <a href="https://plainblackcreative.com">Home</a>
  <a href="https://plainblackcreative.com/playbooks">Playbooks</a>
  <a href="https://plainblackcreative.com/services">Services</a>
  <a href="https://plainblackcreative.com/work">Work</a>
  <a href="https://plainblackcreative.com/about">About</a>
  <a href="https://plainblackcreative.com/blog">Blog</a>
  <a href="#form" onclick="document.querySelector('.lander-mobile-nav').classList.remove('open')">Get the Playbook</a>
</nav>
```

Note: `#form` anchor varies per lander: 90-day = `#form`, google-reviews = `#lead-form`, roofing-ai = `#get-yours`, marketing = `#form`, ai-agents = `#form`.

### Standard footer (all 5 landers, uniform)

3-column dark ink footer with Light_logo (white text). Full AU/NZ contact details. Privacy Policy link in bottom bar. For display copy on landers, reference playbook URLs as `plainblackcreative.com/your-playbook` (marketing phrasing only). Real delivered client playbook URLs follow `client.plainblackcreative.com/playbooks/[slug].html` (served from the private `plainblack-client` repo via Cloudflare Pages).

---

## Template spec (playbook)

### Architecture

JS-rendered from a `SECTIONS` data array. Never hardcoded section HTML. Edit the data array, not the markup.

```javascript
const SECTIONS = [
  {
    id: 's01',
    num: '01',
    free: true,               // true = sections 1-2 (preview); false = sections 3-10 (locked)
    title: '...',
    subtitle: '...',
    pills: [['tool-google','Google'],['tool-free','Free']],
    intro: '...',
    callouts: [
      { type: 'goal', title: 'Goal', text: '...' },
      { type: 'warning', title: 'Common mistake', text: '...' }
    ],
    grid: {
      left:  { title: '...', items: ['...'] },
      right: { title: '...', items: ['...'] }
    },
    mistakes: [{ title: '...', text: '...' }],
    diy: {
      title: '...',
      steps: [{ num: 1, content: '...' }],
      sanityCheck: '...'
    },
    checklist: ['Item 1', 'Item 2'],
    aiPrompt: '...'
  },
  // ... 9 more sections
];
```

### Paywall architecture

Templates in `playbooks/ready/` are clean, unlocked source files. They contain no paywall JavaScript, no access-model constants, no locked-section DOM, and no Stripe CTA substitutions at the template layer.

Paywall is injected by the generator at delivery time. Each paid customer receives two HTML files:

- `[random-hash-1].html` — locked version (sections 1-2 fully rendered, sections 3-10 as teaser cards with preview bullets + unlock CTAs, AI buttons on sections 1-2 fully functional)
- `[random-hash-2].html` — unlocked version (full playbook, all AI buttons functional, noindex meta, customer personalisation throughout)

Neither filename contains the words `locked` or `unlocked`. Access control is URL-based. No localStorage check, no backend validation, no paywall overlay at runtime.

Email 1 (manual, at lead intake) ships the locked URL.
Email 2 (manual, pre-drafted, sent after Stripe success) ships the unlocked URL.

Stripe redirects to `/thanks.html`. No `?purchase=complete` handler in the locked playbook. No success banner in the playbook. All payment confirmation happens on `/thanks.html`.

See the "Paywall specification (full)" section near the end of this spec for the complete generator-side implementation details.

### Init sequence

There is no single canonical init sequence. Each template wires its own at the bottom of its `<script>` block, calling some combination of `loadState()`, `renderNav()`, `renderSections()`, `renderAll()`, `bindMobileToggle()`, `updateProgress()`, `applyOptionalSections()`. Most templates use `document.addEventListener('DOMContentLoaded', ...)`; google-reviews uses an immediately-invoked `(function init(){ loadState(); })()`.

No `checkPurchaseComplete()` or `validateAccess()` functions exist in any template. The current paywall architecture is URL-based and does not require client-side validation. See "Paywall specification" later in this spec for details.

### Section anatomy (every section must have all of these)

- Section header: number, title, subtitle, status badge, mark-complete button
- Tool pills
- Callout: Goal (mint-glow bg, 3px left mint border)
- Content grid: 2 cards (What to fix / What moves the needle)
- Callout: Warning, Info, or Danger
- DIY accordion: numbered steps, collapsible
- Mistakes grid: 2-4 items, red-pale bg
- Checklist: 5-7 items, localStorage-persisted
- AI update box: ink bg, "Check for Updates" button
- Section footer: collapse + next-section link

### AI update button

```javascript
const response = await fetch('https://plainblack-api-proxy.jkbrownnz.workers.dev', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    model: 'claude-sonnet-4-5',
    max_tokens: 1000,
    tools: [{ type: 'web_search_20250305', name: 'web_search' }],
    system: SYSTEM_PROMPT,
    messages: [{ role: 'user', content: s.aiPrompt }]
  })
});

// NO_UPDATE handling — must render as italic Playfair, not raw text
if (responseText.trim() === 'NO_UPDATE') {
  responseArea.innerHTML = '<em style="font-family:\'Playfair Display\',serif;font-style:italic;color:var(--ink-soft);">No Update. Content is Correct.</em>';
  btn.textContent = 'Up to date';
} else {
  responseArea.textContent = responseText;
  btn.textContent = 'Updated ' + new Date().toLocaleDateString();
}
```

### Template placeholder convention

`[[UPPER_SNAKE_CASE]]` throughout the SECTIONS data array.

Universal across all 5 templates (5/5): `[[BUSINESS_NAME]]`, `[[OWNER_NAME]]`, `[[CITY]]`, `[[COUNTRY]]`, `[[MONTH_YEAR]]`, `[[ACCENT_COLOUR_HEX]]`, `[[ACCENT_COLOUR_DARK_HEX]]`. Near-universal (4/5): `[[REGION]]`, `[[OWNER_EMAIL]]`, `[[HERO_OUTCOME_HEADLINE]]`, `[[BUSINESS_SLUG]]`. `[[STRIPE_PAYMENT_LINK]]` is **not** a template placeholder. It is injected by `buildLockedHtml()` into the paywall modal at generation time.

CSS comment block at the top of every template file lists every placeholder with an example value.

**Zero placeholders check** before any customer file is delivered: `grep -c '\[\['` — must return 0.

### Template must NOT have

- A footer (no footer on playbooks, ever)
- Hardcoded section HTML (all sections rendered from SECTIONS array)
- `--accent: [[PLACEHOLDER]];` in CSS (hardcoded hex only)
- `[[PIXEL_ID]]` double-bracket pixel (bare `PIXEL_ID` only)
- Any `claude-sonnet-4-5-20250514` or other dated model variant (use `claude-sonnet-4-5` only)
- Direct calls to `api.anthropic.com` (use the Cloudflare proxy only)

---

## Writing rules (every output)

- Direct, no-fluff, second-person ("you", not "one")
- No em dashes. Use commas, semicolons, or periods.
- No generic AI voice. Every sentence should feel specific to this business.
- Sanity checkpoints at key stages: "If your screen doesn't look like this, stop."
- Specific beats vague: name the tool, give the time estimate, state the cost.
- No upsell blocks at the end of playbooks. Product is fully self-contained.
- Tone: reads like an experienced operator sitting next to the owner.

---

## Pre-delivery checklist

### Lander
- [ ] GA4 snippet present and correct (`G-GP1WQCC0DY`)
- [ ] META Pixel with bare `PIXEL_ID` placeholder + noscript fallback
- [ ] Sticky mobile CTA bar (hidden desktop, visible mobile)
- [ ] Exit intent overlay (`pb_exit_shown` sessionStorage key, DOMContentLoaded wrapped)
- [ ] Proof bar (Section 2)
- [ ] AI feature section (Section 5)
- [ ] How it works (Section 6)
- [ ] 9 FAQ questions in correct order with locked privacy + refund wording
- [ ] 6 required + 1 optional form fields (Business name, Owner first name, Email, City/suburb, Primary service, Country required; Website optional)
- [ ] Trust stack above fold
- [ ] Logo anti-underline CSS
- [ ] Light_logo in header (dark ink bg) AND Light_logo in footer (dark ink bg)
- [ ] No `[[` double-bracket placeholders anywhere
- [ ] Only `YOUR_ACCESS_KEY` and `PIXEL_ID` unfilled
- [ ] No em dashes
- [ ] Mobile responsive at 900px and 640px
- [ ] favicon.webp linked (`/assets/favicon.webp`)
- [ ] All asset paths use leading slash (`/assets/...`)

### Template
- [ ] GA4 snippet present (`G-GP1WQCC0DY`)
- [ ] SECTIONS array architecture (not hardcoded HTML)
- [ ] 10 sections (1-2 free, 3 teaser, 4-10 locked)
- [ ] API proxy URL correct: `plainblack-api-proxy.jkbrownnz.workers.dev`
- [ ] `NO_UPDATE` renders as italic Playfair, not raw text
- [ ] Model: `claude-sonnet-4-5` (no dated variants)
- [ ] Logo anti-underline CSS
- [ ] Light_logo in header (dark ink bg)
- [ ] No footer
- [ ] `--border: #cce8d8;` present
- [ ] Accent as hardcoded hex, never `[[PLACEHOLDER]]`
- [ ] Bare `PIXEL_ID` not `[[PIXEL_ID]]`
- [ ] All `[[PLACEHOLDERS]]` present throughout SECTIONS data
- [ ] No em dashes
- [ ] favicon.webp linked

---

## Logo placement summary

- **Sticky header (lander + template):** dark ink bg → Light_logo
- **Lander footer:** dark ink bg → Light_logo
- **Main marketing site pages (index.html and similar):** white footer bg → Dark_logo
- **Playbook template footer:** does not exist. Templates never have footers.

---

## Paywall specification (full)

This section is the complete generator-side specification for producing the two-file paywall output per customer. The earlier "Paywall architecture" section is the overview; this is the implementation contract.

### Architecture overview

Templates at `playbooks/ready/[product]/[product]-TEMPLATE.html` are clean, unlocked source files. They contain no paywall code.

The generator takes a template + customer data + product context and outputs TWO client files per generation:

1. `playbooks/[random-hash-A].html`: LOCKED VERSION (teaser, sent at lead intake)
2. `playbooks/[random-hash-B].html`: UNLOCKED VERSION (full playbook, sent after payment)

Both files go to the same folder. Neither slug contains "locked" or "unlocked" text. Both slugs use the generator's existing random hash suffix pattern.

Email 1 (manual) sends the locked URL at lead intake.
Email 2 (manual, pre-drafted at generation time) sends the unlocked URL after Stripe payment confirmation.

No Make.com. No backend validation. No per-customer Stripe links. No localStorage for payment state. URL-based access control.

**Hosting:** Customer playbook files live in the private repo `plainblackcreative/plainblack-client`, served via Cloudflare Pages at `client.plainblackcreative.com/playbooks/[slug].html`. Templates remain in the public repo at `playbooks/ready/` for anonymous read access by the generator.

### Locked version specification

**Head:**
- All standard playbook head content (title, meta, fonts, GA4 snippet)
- Add: `<meta name="robots" content="noindex, nofollow">`
- Add: `<link rel="canonical" href="">`

**Header (sticky):**
- Standard playbook header, unchanged
- Progress bar shows progress out of 10 total sections (caps at 20% when sections 1-2 marked complete)
- Floating "Unlock Full Playbook" CTA button added to sticky header, desktop and mobile
- Clicking CTA opens paywall modal

**Sidebar nav:**
- All 10 sections listed, all clickable
- Clicking sections 3-10 scrolls to their teaser card position
- Stats panel unchanged

**Sections 1-2:**
- Fully rendered, fully functional
- Action blocks, checklists, callouts: interactive
- Mark Section Complete: present and functional
- AI Live Update button: FULLY FUNCTIONAL. No limiting, no disabling. Matches unlocked experience.

**Sections 3-10 (teaser cards):**
- Section content replaced entirely with teaser markup (not hidden, not blurred, replaced at render time)
- Teaser card contains:
  - Section number badge (03, 04, etc.)
  - Section title (from template metadata)
  - One-line teaser description (from template metadata)
  - 3 bullet preview points (from template metadata)
  - Inline unlock CTA button: "Unlock for $99"
- Mark Section Complete button: HIDDEN on teaser cards
- No AI buttons on teaser cards

**Paywall modal:**
- Accessible from: sticky header Unlock CTA, sidebar CTA, inline teaser card CTAs
- Contains: "Unlock [Product Name]" headline, 3-4 bullet points of full-value benefits, price display ($99 in customer's currency), primary CTA "Unlock for $99" linking to correct Stripe Payment Link, close button

**Stripe CTAs:**
- All unlock CTAs in locked playbook link to one of 3 Stripe Payment Links based on customer country
- Stripe redirects to `plainblackcreative.com/thanks.html` after successful payment
- NO JS handler for `?purchase=complete` in locked playbook
- NO success banner, no CTA disabling, no localStorage writes
- Customer leaves locked playbook when they click Stripe CTA, sees thanks.html, waits for Email 2

**Footer:**
- No footer (per universal rule — templates and their generated variants never have footers)

### Unlocked version specification

- Template with all placeholders substituted
- No paywall code anywhere
- All 10 sections fully rendered
- All AI update buttons fully functional
- All interactive elements functional
- Progress bar out of 10 sections, full 0-100% range
- Add: `<meta name="robots" content="noindex, nofollow">` in head
- Add: `<link rel="canonical" href="">` in head
- Customer personalisation (business name, owner name) throughout serves as watermark
- No footer

### Template metadata requirement

Each of the 5 templates needs a metadata block for teaser generation. Format:

```html
<script type="application/json" id="playbook-metadata">
{
  "product_name": "90-Day Job Pipeline",
  "currency_default": "USD",
  "sections": [
    {"number": "01", "title": "...", "in_free_preview": true},
    {"number": "02", "title": "...", "in_free_preview": true},
    {"number": "03", "title": "...", "in_free_preview": false, "teaser_line": "...", "preview_bullets": ["...", "...", "..."]}
  ]
}
</script>
```

The generator reads this metadata to render teaser cards. Metadata lives in the template file as a `<script>` tag at the top of the body. Written once per template. Reused for every future customer generation of that template.

### Thanks page — plainblackcreative.com/thanks.html

Built once as a static page. Not per-customer. All 3 Stripe Payment Links redirect here.

**Structure:**
- Standard PlainBlack site chrome (sticky header with Dark_logo base64, sticky footer with Light_logo base64)
- White background body
- Centered success card (bg `#f5fbf7`, border `1px solid #cce8d8`)
- Playfair heading, Figtree body

**Copy:**

> Payment received! Thank you.
>
> Your full playbook is being prepared. Delivery times can vary. Most customers receive their unlocked version within 10 minutes to a few hours.
>
> If it hasn't arrived within 24 hours, please check your spam or junk folder first. If it still hasn't appeared, contact us and we'll sort it out.
>
> The PlainBlack Team

**CTAs:**
- Primary: "Back to Homepage" → `plainblackcreative.com`
- Secondary: "Contact us" → contact page URL

**JS:**
- Fires GA4 event: `purchase_complete`
- Fires META Pixel event: `Purchase` (placeholder PIXEL_ID)
- No localStorage, no URL param handling, no form, no dynamic content

### Email drafts (copy-pasteable, produced by generator at generation time)

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

### Repo-wide

`/robots.txt` at repo root must contain:

```
User-agent: *
Disallow: /admin/
```

### Stripe configuration (already complete)

3 Stripe Payment Links configured, one per currency:
- NZD link → $99 NZD → redirects to `plainblackcreative.com/thanks.html`
- AUD link → $99 AUD → redirects to `plainblackcreative.com/thanks.html`
- USD link → $99 USD → redirects to `plainblackcreative.com/thanks.html`

Generator selects correct link based on customer country at generation time. Stripe handles currency conversion at checkout.

### Out of scope by design (permanent current architecture)

The following are deliberate architecture decisions, not deferred features. The generator will not be extended to support them. Manual delivery and URL-based access are the permanent shape of the system unless a future business decision explicitly changes course.

- Make.com automation for Email 1 intake and Email 2 post-payment
- Per-customer Stripe Payment Links
- Backend token validation
- localStorage payment state
- `?purchase=complete` handler in playbooks

### Verification steps

Generate a test customer for each of 5 products. For each:

1. Confirm 2 files created in the private `plainblack-client` repo at `playbooks/` with unguessable slugs
2. Confirm neither slug contains "locked" or "unlocked"
3. Confirm locked file has all features above
4. Confirm unlocked file has all features above
5. Confirm both files have noindex meta
6. Confirm Stripe CTA in locked file links to correct currency payment link
7. Confirm `thanks.html` renders correctly when visited directly
8. Confirm `robots.txt` has correct Disallow lines
9. Confirm Email 1 and Email 2 drafts contain correct URLs and personalisation
10. Spot-check in incognito: locked URL should never leak unlocked content; unlocked URL should never show paywall