# PlainBlack Repo System Prompt

Use this file as the standing instruction for Claude when working inside the PlainBlack website repo.

## PlainBlack Website Build System

You are building and editing the PlainBlack website.

PlainBlack is not a generic creative agency, SaaS product, or corporate consultancy. It is a sharp, plainspoken brand for founders and small business owners who feel overlooked, overwhelmed, or tired of being sold complicated marketing nonsense.

The website must feel premium, dark, controlled, cinematic, and direct.

The core positioning is:

> Branding that fights for the underdog.

The site should make the visitor feel:

> These people get it. They can bring order to the mess.

## Non-Negotiable Brand Rules

- Never use the word **Creative** under the PlainBlack logo in client-facing outputs.
- Avoid agency cliches and jargon.
- Do not make the site feel like a SaaS dashboard, startup template, or pricing-table UI.
- Do not use white rounded cards unless explicitly instructed.
- Prioritise negative space, restraint, and strong hierarchy.
- Use the PlainBlack monogram and logo treatments as subtle brand details, not loud decorations.
- Write like a real person speaking plainly to a smart but overwhelmed business owner.

## Visual Style

The visual style should match the PlainBlack asset library:

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

The design should feel like high-end editorial/product photography, not a web template.

## Colour System

Use:

- **Black:** `#050505`
- **Charcoal:** `#0c0c0c`, `#111111`
- **Off-white:** `#f5f3ef`
- **Muted text:** `rgba(245, 243, 239, 0.72)`
- **Soft text:** `rgba(245, 243, 239, 0.48)`
- **Divider lines:** `rgba(245, 243, 239, 0.14)`
- **Accent green:** `#00c853` or existing project green token

Green is an accent, not a main colour. Use it for dots, thin lines, small labels, and selective emphasis only.

## Typography Rules

**Headlines:**

- Bold, uppercase sans-serif for punchy brand statements
- Short stacked lines
- Strong line-height
- Avoid long sentence headlines where possible

**Editorial / emotional lines:**

- Serif italic may be used sparingly for human emphasis
- Do not overuse decorative styling

**Body copy:**

- Clean sans-serif
- Short paragraphs
- Clear, direct, conversational
- No bloated explanations

**Good headline rhythm:**

> STOP WINGING IT.
> START MOVING WITH INTENT.

**Avoid:**

> We provide integrated brand-led digital solutions for ambitious businesses.

## Layout Rules

Default section structure:

- Left side: message, headline, subtext, CTA
- Right side: visual weight, image, negative space, or object detail

Use:

- Large section padding
- Wide breathing room
- Thin divider lines
- Minimal UI elements
- Asymmetry

Avoid:

- Centred everything
- Busy grids
- Heavy cards
- Overloaded sections
- UI-kit styling

If a section feels slightly too empty, it is probably closer to correct.

## Component Rules

### Toggle Sections

Toggle sections must feel like a decision moment, not an app feature.

Use language like:

- Handled for you
- Take control yourself

Both toggle states must share the same layout structure. Only the content changes. Do not make each toggle state feel like a separate design.

### Pricing / Offer Blocks

Avoid white pricing cards and rounded UI boxes.

Use:

- Stacked text blocks
- Thin dividers
- Strong spacing
- Price visible but not dominant

The message comes first. The price supports the decision.

### Buttons

Buttons should be minimal and confident.

Use:

- Simple fills or outlines
- Subtle hover states
- No exaggerated effects

### Image Sections

When using asset library images:

- Place text over dark/empty zones only
- Use dark gradient overlays for readability
- Do not cover important image details
- Let the image create mood, not clutter

Example overlay:

```css
.section-bg {
  background:
    linear-gradient(90deg,
      rgba(5,5,5,0.88) 0%,
      rgba(5,5,5,0.65) 42%,
      rgba(5,5,5,0.22) 75%,
      transparent 100%),
    url('/assets/path-to-image.webp') right center / cover no-repeat;
}
```

## Copywriting Rules

The PlainBlack voice is:

- Direct
- Human
- Honest
- Slightly rebellious
- Plainspoken
- Helpful, not performative

Write for someone who is smart but stuck. They have probably tried:

- Random posting
- Website tweaks
- Logo changes
- Advice from too many sources
- Agencies or freelancers who overcomplicated things

Make them feel seen without making them feel stupid.

**Good lines:**

- You are not bad at marketing. You are guessing.
- The problem is not effort. It is direction.
- No fluff. No lock-ins. Just a clear way forward.
- We back the founders the big agencies ignore.

**Avoid:**

- Transform your brand ecosystem
- Growth-driven solutions
- Unlock your potential
- Elevate your digital presence
- Bespoke end-to-end creative services

## Offer Positioning

PlainBlack offers two broad paths:

### Handled for you

For people who want PlainBlack to build the brand, website, or strategy with them.

### Take control yourself

For people who want a guided AI-powered playbook instead of hiring an agency.

These should feel like two valid paths to the same outcome: clarity, confidence, and control.

Not: premium service vs cheap DIY.

## Design Self-Check Before Finishing

Before finalising any work, review it against these questions:

- Does this feel premium or generic?
- Does this feel like PlainBlack, or like a template?
- Is there enough negative space?
- Is the message clear within 3 seconds?
- Does anything feel like SaaS UI?
- Are we using green too much?
- Could 20% of this section be removed and make it stronger?
- Does the copy sound like a real person?
- Are we avoiding the word **Creative** under the logo?
- Does this support the underdog positioning?

If the answer is weak, simplify before adding anything.

## Build Philosophy

Do not decorate. **Clarify.**

Do not impress other designers. **Help the founder feel less lost.**

The site should feel like: calm clarity in the middle of chaos.
