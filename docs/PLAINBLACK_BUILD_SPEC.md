# PlainBlack · Build Spec
**Last updated:** April 2026
**Applies to:** All landers, playbook templates, and any new HTML output

---

## Brand kit (master override)

All visual outputs use this kit without exception.

### Logos

| Usage | File | Notes |
|---|---|---|
| Sticky header (dark ink bg) | `Light_logo.png` — white text, transparent bg | Dark background |
| Footer on landers (dark ink bg) | `Light_logo.png` — white text, transparent bg | Dark background — same as header |
| No footer on templates | N/A | Templates have no footer |

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
| 8 | FAQ | 8 questions in locked order (see below) |
| 9 | Lead form | 5 fields max (see below) |
| 10 | Final CTA | Mint button to `#form` |
| 11 | Footer | Light_logo (white text) on dark ink bg header. Dark_logo (black text) on white footer bg. |

### Mandatory conversion elements (every lander)

- **GA4 snippet:** `G-GP1WQCC0DY` — after Google Fonts link, before style block
- **META Pixel:** bare `PIXEL_ID` placeholder + noscript fallback
- **Sticky mobile CTA bar:** fixed bottom, mint bg, "Get my playbook — $99" → `#form`, hidden on desktop
- **Exit intent overlay:** desktop = mouseleave from top edge (`clientY <= 0`); mobile = 45-second timer; sessionStorage key `pb_exit_shown` shared across all landers (fires once per session across all 5 landers). No form, just headline + two buttons ("Get the free preview" → form anchor, "See all playbooks" → plainblackcreative.com/playbooks) + dismiss link.
- **Mobile responsive:** breakpoints at 900px and 640px

### Lead form: 5 fields, no more

1. Business name (required)
2. Owner first name (required)
3. Email (required)
4. City/suburb (required)
5. Primary service or niche (required)

No phone field. No industry dropdown. No team size. No budget field.

### FAQ: 8 questions in this exact order

1. How is this different from a course or PDF?
2. What if I'm not technical?
3. How long does setup take?
4. Is this one-time or ongoing?
5. What's the refund policy?
6. How does the AI update work exactly?
7. What if I need help?
8. Who is PlainBlack?

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

3-column dark footer. Dark_logo.png NOT used in footer — Light_logo on dark ink background. Full AU/NZ contact details. Privacy Policy link in bottom bar.

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

### Paywall structure

- Sections 1-2: `free: true` — fully visible as preview
- Section 3: teaser card — header visible, first ~3 lines of intro visible, blur/fade overlay, locked CTA
- Sections 4-10: fully locked — title and padlock only

### DOMContentLoaded order (critical — never change this sequence)

```javascript
document.addEventListener('DOMContentLoaded', function() {
  checkPurchaseComplete(); // FIRST — checks ?purchase=complete param
  validateAccess();        // SECOND — validates token status
  renderAll();
  loadState();
  renderNav();
});
```

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

Common to all niches: `[[BUSINESS_NAME]]`, `[[OWNER_FIRST_NAME]]`, `[[CITY]]`, `[[REGION]]`, `[[COUNTRY]]`, `[[MONTH_YEAR]]`, `[[ACCESS_TOKEN_ENDPOINT]]`, `[[STRIPE_PAYMENT_LINK]]`, `[[PLAYBOOK_ID]]`

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
- [ ] 8 FAQ questions in correct order with locked refund wording
- [ ] 5-field lead form (no phone, no dropdown extras)
- [ ] Trust stack above fold
- [ ] Logo anti-underline CSS
- [ ] Light_logo in header (dark bg), Light_logo in footer (dark bg) — NOT Dark_logo in footer
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
- [ ] `checkPurchaseComplete()` fires before `validateAccess()`
- [ ] Stripe success URL comment notes `?purchase=complete` requirement
- [ ] API proxy URL correct: `plainblack-api-proxy.jkbrownnz.workers.dev`
- [ ] `NO_UPDATE` renders as italic Playfair, not raw text
- [ ] Model: `claude-sonnet-4-5` (no dated variants)
- [ ] Logo anti-underline CSS
- [ ] Light_logo in header (dark bg)
- [ ] No footer
- [ ] `--border: #cce8d8;` present
- [ ] Accent as hardcoded hex, never `[[PLACEHOLDER]]`
- [ ] Bare `PIXEL_ID` not `[[PIXEL_ID]]`
- [ ] All `[[PLACEHOLDERS]]` present throughout SECTIONS data
- [ ] No em dashes
- [ ] favicon.webp linked

---

## Lander footer note

**Both header and footer use Light_logo (white text) on dark ink background.** The footer on landers is dark ink, matching the header. Dark_logo is only used on the main marketing site pages (index.html etc) where the footer is white. This is a frequent source of confusion: lander footers are dark, not white.
