# Spec updates needed

Edits the user needs to apply manually to `/mnt/project/PLAINBLACK_BUILD_SPEC.md` and `/mnt/project/PLAINBLACK_MASTER.md`. These files are in the user's project config area, not the repo, so Chat 3 can't touch them directly.

All edits below reflect decisions made while applying Chat 3 fixes to the repo. Numbers match the "Spec updates file" section of the Chat 3 brief.

---

## 1. BUILD_SPEC — FAQ section (lines 155–163 in old spec)

**Before (old locked order, 8 questions):**
```
1. How is this different from a course or PDF?
2. What if I'm not technical?
3. How long does setup take?
4. Is this one-time or ongoing?
5. What's the refund policy?
6. How does the AI update work exactly?
7. What if I need help?
8. Who is PlainBlack?
```

**After (new locked order, 9 questions):**
```
1. How is this different from a course or PDF?
2. What if I'm not technical?
3. How long does setup take?
4. Is this one-time or ongoing?
5. Is my playbook private?
6. What's the refund policy?
7. How does the AI update work exactly?
8. What if I need help?
9. Who is PlainBlack?
```

**New Q5 answer (locked wording):**
> Your playbook is hosted at a private, unguessable URL that is never listed, indexed, or shared with anyone other than you. No accounts, no logins, no passwords. Just a link only you have.

---

## 2. BUILD_SPEC — form fields (lines 145–150 in old spec)

**Replace the current "5 fields, no more" rule with:**

```
6 required + 1 optional lead form fields:

Required:
1. Business name
2. Owner first name
3. Email
4. City/suburb
5. Primary service
6. Country

Optional:
7. Website

Explicit exclusions (never add these to any lander):
- Phone
- Industry dropdown
- Team size
- Budget
```

Note: the form-label for field 5 is `Primary service`. Accept no drift to `Trade type`, `Type of business`, `Service type`, etc.

---

## 3. BUILD_SPEC — new section on CTA wording (add immediately after the form-fields section)

**Add:**

```
### CTA wording (locked)

Single locked CTA string applies to every call-to-action across all 5 landers:

  Get the Playbook

Title case. No prices (`$99`), no dollar figures, no `my playbook`, no `free preview`, no `Get Your`. One string, every placement: hero CTA, sticky mobile CTA, primary form submit button, nav CTA, mid-page CTAs, final-section CTAs.

One exception:
- Exit-intent overlay has two buttons. Button 1 (leads to form) uses `Get the Playbook`. Button 2 (leads to `/playbooks`) uses `See all playbooks`.

The form-card heading above the form fields is not a CTA but must also read `Get the Playbook.` (with period) for consistency.
```

---

## 4. MASTER — brand name rule (lines 22–23 in old spec)

**Before:**
> Brand name: `PlainBlack` only. Flag any instance of `PlainBlack Creative`, `Plain Black`, `plainblack creative`, etc in customer-facing copy.

**After:**
> Brand name in customer-facing copy is `PlainBlack` only. Flag any instance of `PlainBlack Creative`, `Plain Black`, `plainblack creative`, etc in headlines, body, FAQs, emails, buttons, meta tags, browser titles, or social share copy.
>
> Legal entity name `PlainBlack Creative Limited` is permitted in copyright footers, Terms & Conditions, Privacy Policy, refund policy contractual text, and other legally-binding small print. Copyright line format: `© 2026 PlainBlack Creative Limited.`

---

## 5. BUILD_SPEC — paywall architecture (replace existing "Paywall structure" section around lines 254–268)

**Before (old text referencing per-template const PAID / ACCESS_TOKEN_ENDPOINT):** remove entirely.

**After:**

```
### Paywall architecture

Templates in `playbooks/ready/*/` are clean, unlocked source files. They contain no paywall JavaScript, no access-model constants, no locked-section DOM, and no Stripe CTA substitutions at the template layer.

Paywall is injected by the generator at delivery time. Each paid customer receives two HTML files:
- `[random-hash-1].html` — locked version (sections 1–2 fully rendered, sections 3–10 as teaser cards with preview bullets + Stripe CTAs, AI buttons disabled/greyed)
- `[random-hash-2].html` — unlocked version (full playbook, all AI buttons functional, noindex meta, customer watermark)

Neither filename contains the words `locked` or `unlocked`. Access control is URL-based. No localStorage check, no backend validation, no paywall overlay at runtime.

Email 1 (manual, at intake) ships the locked URL.
Email 2 (manual, pre-drafted, sent after Stripe success) ships the unlocked URL.

Stripe redirects to `/thanks.html`. No in-playbook success handler exists.

See Chat 1 of the PlainBlack planning thread for the full paywall specification.
```

---

## 6. BUILD_SPEC — pre-delivery checklist updates

Find the pre-delivery checklist section (exact line number varies by version of spec). Apply these two edits:

**Line to remove:**
> 5-field lead form (no phone, no dropdown extras)

**Replacement line:**
> 6 required + 1 optional form fields (Business name, Owner first name, Email, City/suburb, Primary service, Country required; Website optional)

**Line to update:**
> 8 FAQ questions in correct order with locked refund wording

**Replacement:**
> 9 FAQ questions in correct order with locked privacy + refund wording

---

## Nothing else needs to change in the spec for this pass

The rest of the spec (brand tokens, GA4 ID, API proxy URL, model name, exit-intent rules, logo rules, footer rules, em-dash ban, noindex on templates, etc.) is unchanged by Chat 3's fixes.
