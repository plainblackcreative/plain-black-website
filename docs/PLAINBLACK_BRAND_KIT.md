# PlainBlack Creative — Brand Kit (Master Override)

All visual outputs must use this brand kit without exception. No substitutions, no overrides unless explicitly stated per client.

---

## Logos

- **Dark logo** (black text, use on white or light backgrounds): `/mnt/project/Dark_logo.png`
- **Light logo** (white text, use on dark backgrounds): `/mnt/project/Light_logo.png`

Both files are proper transparent PNGs (RGBA, alpha channel active). If project files show as JPEG on inspection, they are stale, request fresh uploads.

**Rules:**
- Always reference the actual logo files. Never use text, placeholder, or generated substitutes.
- Dark logo is default for all pages since backgrounds are white.
- Light logo is used only if a dark header bar or dark UI element requires it.
- For the live site: reference by relative path (`assets/Light_logo.png`).
- For playbooks: embed as base64 (playbooks must be fully self-contained single-file HTML).

---

## Backgrounds

- **All pages, playbooks, landing pages, marketing pages, everything:** White (`#ffffff`) always.
- No dark or ink-coloured page backgrounds on any customer-facing or marketing output. No exceptions.
- The sticky header and AI update button use ink backgrounds as UI chrome elements, not page backgrounds.

---

## Colour Palette

| Token | Hex | Usage |
|---|---|---|
| `--white` | `#ffffff` | Page backgrounds, card fills |
| `--ink` | `#0e1a14` | Primary text, headers, dark UI chrome |
| `--ink-mid` | `#2a3d32` | Secondary text |
| `--ink-soft` | `#4a6358` | Captions, labels, muted text |
| `--mint` | `#3ecf8e` | PlainBlack accent: CTAs, highlights, interactive elements |
| `--mint-dark` | `#27a870` | Hover states, active states |
| `--mint-pale` | `#d6f5e8` | Callout backgrounds, soft highlights |
| `--mint-glow` | `rgba(62,207,142,0.12)` | Section highlights, hover fills |
| `--border` | `#cce8d8` | Card borders, dividers, input borders |
| `--paper` | `#f5fbf7` | Alternate row fills, sidebar backgrounds |
| `--paper-2` | `#edf7f2` | Nested card fills, checklist item backgrounds |

---

## Accent Colour Rules

- **PlainBlack landing pages and marketing materials:** Mint (`#3ecf8e`) always.
- **Customer playbooks:** Pull accent colour(s) from the client's own brand (website, logo, existing materials). Match as closely as possible. Mint is the fallback only if no clear client brand colour can be identified.
- All other brand kit rules (white background, typography, spacing, logo usage) apply to customer playbooks regardless of their accent colour.
- In playbook templates, swap `--accent` and `--accent-dark` variables per client; keep the rest of the palette intact.

---

## Typography

| Role | Font | Source | Notes |
|---|---|---|---|
| Headlines (display) | Playfair Display | Google Fonts | Serif, used at large sizes for hero and section titles; supports italic for editorial accent |
| Editorial / accent | Playfair Display italic | Google Fonts | Italic style of the same family, used for subheadings and `.serif` spans |
| Body / UI | Figtree | Google Fonts | Clean sans-serif, 15px base, 1.65 line height |

**Import:**

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Figtree:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet">
```

**Mandatory body rule** to prevent Safari from synthesising fake bold italic weights:

```css
body { font-synthesis: none; }
```

Always load via Google Fonts. Never substitute system fonts or fallbacks as primary choices.

---

## Spacing and Layout

- Max content width: 1200px, centred (playbooks and most marketing pages)
- Wide content max-width: 1920px (full-width marketing hero sections only)
- Sidebar width (playbooks): 260px fixed
- Section cards: white background, 1px `--border` border, 16px border radius
- Body font size: 15px, line height 1.65
- Generous whitespace, clear visual hierarchy, no cramped layouts

---

## Component Defaults

| Component | Style |
|---|---|
| CTA buttons | Mint background, ink or white text, 8px border radius, no pill shapes |
| Callout boxes | `--mint-pale` background, 3px left border in `--mint` |
| Progress bar | 3px height, mint fill |
| Checkboxes | Mint accent |
| Completion banner | Mint gradient |
| AI update button | Ink background (`--ink`), white text, 10px/18px padding |
| Checklist items | `--paper-2` background, 12px/14px padding, mint checkbox |
| Sticky header | Ink background, 64px height, 3px mint progress bar underneath |
| Price display | Playfair Display italic 700, `$` floated top-left at 0.4em, optional Figtree USD suffix in corner |

---

## Price Component

Use the `.price` component for any price display on landing pages, service tiles, or playbook pricing blocks. It renders as Playfair italic numerals with a small `$` floated up-left, optionally followed by a small caps "USD" suffix.

**Markup:**

```html
<!-- Default -->
<span class="price"><span class="price__currency">$</span>99</span>

<!-- With USD suffix -->
<span class="price"><span class="price__currency">$</span>99<span class="price__suffix">USD</span></span>

<!-- On dark backgrounds (accent-coloured) -->
<span class="price price--light"><span class="price__currency">$</span>99</span>

<!-- Size variants -->
<span class="price price--sm">...</span>
<span class="price price--lg">...</span>
```

Do not hand-roll price displays elsewhere. Use `.price` so every price across the site and playbooks reads consistently.

---

## Tone and Voice

- Direct, no-fluff, confident
- "You" language throughout, address the reader directly
- No em dashes (use commas, semicolons, or periods instead)
- No generic AI voice or filler phrases
- No upsell blocks at the end of playbooks, the product is fully self-contained
- Reads like an experienced operator sitting next to you, not a content document

---

## Rules Summary

- White backgrounds on all pages, always
- Real logo files only, never text substitutes or generated replacements
- Live site references logos by path; playbooks embed logos as base64
- Mint is the accent for PlainBlack-owned pages; customer playbooks use the client's own brand colours
- Figtree + Playfair Display, always loaded from Google Fonts with italic 700 variant included
- `font-synthesis: none` on body (Safari fix for italic rendering)
- No dark page backgrounds anywhere
- No em dashes anywhere
- Use `.price` component for all price displays

---

## Master Stylesheet Reference

The live site loads a single master stylesheet at `plain-black-website/assets/style.css`. All tokens, typography, header, footer, buttons, section patterns, price component, CTA banner, and fade-up animations live there. Individual pages only add their own page-specific styles inline.

Playbooks do not link to this stylesheet (they are single self-contained HTML files), but use the same tokens and component styles pasted into their inline `<style>` block, sourced from the playbook template.
