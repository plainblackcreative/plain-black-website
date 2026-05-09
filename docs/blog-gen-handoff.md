# Blog-Gen Handoff (for the next Claude session)

Read this file end-to-end before touching `admin/blog-gen.html`. It captures the design state, locked next-pass specs, and codebase conventions established in the May 8-9 2026 session.

---

## Status snapshot

`admin/blog-gen.html` is a 4k-line static admin tool deployed to `admin.plainblackcreative.com` (Cloudflare Pages, SPA fallback). The public blog is at `www.plainblackcreative.com/blog` (GitHub Pages). Library JSON lives at `docs/blog-library.json`.

**12 PRs landed this session (107-118).** Don't re-propose these; they're done:

- 4-state lifecycle: Draft / Published / Archived / Deleted
- Recover button on tombstones (pulls from git history)
- `recoverPost` handles >1MB assets via `raw.githubusercontent.com` (Contents API truncates content for files >1MB)
- Delete probes parallelized (was ~30s of dialog freeze)
- Image ext override row killed (importer reads from disk now)
- Mark FB/LI Posted buttons killed
- Source URL replaces Post Type toggle (`postType` derived from URL presence)
- FB/LI prompts sharpened for platform distinctness
- Tone: dropped Punchy, added Cheeky/Parody
- 30-Day Challenge decoupled from category; 8 posts migrated to PlainBlack
- Admin logo fix (CF Pages SPA fallback was eating `/assets/Light_logo.png`)
- Archive/Restore stepped progress indicators on the button
- FB/LI preview cards fall back to on-disk hero via `getSocialPreviewImageSrc`
- "Save as Draft" rename on the publish-tab checkbox

Run `git log --oneline -20` for exact commits. PR descriptions are detailed; `gh pr view <n>` for design rationale.

---

## State model (the 4 statuses)

| Status | File at `/blog/{slug}.html` | noindex meta | On `/blog` grid | In sitemap | Shareable URL |
|---|---|---|---|---|---|
| Draft | Yes | Yes | No | No | Yes |
| Published | Yes | No | Yes | Yes | Yes |
| Archived | Yes (stays put) | Yes | No | No | Yes |
| Deleted | No | n/a | No | No | 404 |

### Library row buttons by status

- **Draft** → Go Live, Edit, Discard
- **Published** → Edit, Archive, Delete, View, FB Post, LI Post
- **Archived** → Restore (one-click), Delete, View, FB Post, LI Post
- **Deleted (tombstone)** → Recover only

### Lifecycle functions

- `archiveFromLib(slug)` — adds noindex to existing file, status flip, regen grid + sitemap. File stays put.
- `restorePost(slug)` — strips noindex, status flip, regen grid + sitemap. Replaces old 2-step Unarchive+Go Live.
- `deletePost(slug)` — removes file + asset siblings, leaves library tombstone (slug + title + date + category + fbPost + linkedinPost + deletedAt).
- `discardDraft(slug)` — removes library entry entirely, no tombstone (drafts never had a public slug to reserve).
- `recoverPost(slug)` — pulls post + assets from parent commit of the delete, rebuilds library entry as Published.
- `goLive(slug)` — Draft → Published. Strips noindex, regen grid + sitemap.

`unarchiveFromLib` is a no-op stub kept for backwards compatibility; toast tells user to use Restore.

---

## Codebase conventions

### Body editing model
- `raw-input` (left column textarea) is the **canonical body source**. User types markdown-ish + custom markers (`[IMAGE N]`, `[CALLOUT: ...]`, `[INK CALLOUT: head | text]`).
- `html-output` is an internal hidden buffer holding the latest rendered HTML. Read by publish path. Edited surgically via the collapsible "Quick HTML edit" in the Publish tab. **NOT a primary editing surface.**
- The HTML tab in the right-column tabs is dead (Phase 2B removed it). Do not bring it back.
- `htmlBodyToMarkdownish(html)` converts AI-generated bodyHTML back to the markdown-ish form for raw-input.
- `extractBodyHTMLFromPost(fullHtml)` strips the back-link and tag-block from a post's full HTML to get just the body chunk.

### GitHub API helpers
All in `admin/blog-gen.html` near the lifecycle functions:
- `ghFetchFile(path, ref?)` — Contents API. Optional `ref` for a specific commit. Returns `null` on 404. **Truncates content for files >1MB.**
- `ghFetchBytesAtRef(path, ref)` — fetches via `raw.githubusercontent.com` (no size limit), returns `{base64, size}`. Use for binary content recovery.
- `ghPutFile(path, content, sha, message)` — base64-encodes and PUTs. `sha` null for new files.
- `ghDeleteFile(path, sha, message)`.
- `ghDecode(base64)` / `ghEncode(text)` — wrap btoa/atob with UTF-8 handling.

### noindex meta
- `injectNoindexMeta(html)` / `removeNoindexMeta(html)` — round-trip clean. Used by Draft publish, Archive, Restore, Go Live.
- Inserted right after `<meta charset="...">`. Inert if already present.

### Other globals worth knowing
- `library` (array) — every post's metadata. New entries get `format: 'v2'`. Old imported entries lack this; use as a hint for migration.
- `images` (array) — fresh-upload state for the current generation session. Stable `_id` per entry; alt text changes don't blow away typed values.
- `editingExistingSlug` — null if drafting fresh, set after first publish or after `loadPostForEditing`.
- `generatedSlug` / `generatedTitle` / `generatedFBText` / `generatedLIText` / `generatedExcerpt` / `generatedHTML` — last-generation outputs.
- `getSocialPreviewImageSrc(slug)` — the right way to resolve the FB/LI card hero. Prefers in-memory upload, falls back to library entry's `imageExt`.
- `slugifyTitle(title)` — client-side mirror of Claude's slug derivation.

### Tombstones
- `status: 'deleted'` library entries are tombstones. They block slug reuse, surface a "Recover" button, but render no other actions.
- The slug-collision dialog at generate-time has a separate path for tombstones with explicit "this URL was deleted, you'd be resurrecting it" warning.

### Legacy category injection
`loadPostForEditing` injects any unknown post category into the dropdown as a `(legacy)` option for that edit session. Stops silent rewrites. Currently inert (we cleaned the only legacy value, "30-Day Challenge"), but stays in code as defensive.

---

## Pass 2 — locked spec

**Edit-load restructure: every AI-generated field gets a home on the LEFT column.**

When clicking Edit on a library entry:
- Title → existing input on left (already there)
- Body → auto-Pull-draft on load. The Pull-draft button becomes implicit.
- **Excerpt** → NEW visible field on left
- Facebook post → NEW editable textarea on left
- LinkedIn post → NEW editable textarea on left
- Image alt text → existing per-image card on left
- Image prompts → existing on left

**Right-column changes:**
- Publish tab DIES. Date / Featured / QA / Quick HTML edit move into a collapsible **"Publish settings"** below the preview iframe in the Preview tab.
- FB and LinkedIn tabs become **read-only social card previews** that mirror the left-column field values live (`oninput` binding).
- Library tab unchanged.

**Why Pass 2 alone creates a regression worth knowing about:** without Pass 3's per-field checkboxes, clicking Update Preview rewrites all the AI-generated fields in preserve mode, including the editable FB/LI/Excerpt fields. The user would lose their hand-edits. This is why Pass 2 and Pass 3 should ship together.

---

## Pass 3 — locked spec

**Per-field regenerate checkboxes + 3-button action strip.**

### Action strip
Replaces the single Generate / Update Preview button. Lives at the top of the left panel header (NOT the page header).

| Button | Lights up when | Does |
|---|---|---|
| **Save** | Form is dirty | Commits current state to file. **No LLM call.** Status preserved. |
| **Regenerate** | Form is dirty AND a Body or Title or Tone or Category or Source URL change is staged | Re-runs Claude on **only the ticked fields**, then commits |
| **Publish** | Status is Draft AND state is saved | Status flip Draft → Published, regen grid + sitemap |

### Per-field checkbox model
Every AI-generated field gets a `☐ Regenerate this` checkbox. **All unticked on edit-load** (preserve everything by default). User ticks what they want refreshed before clicking Regenerate.

Fields with checkboxes:
- Title
- Body
- Excerpt
- Facebook post
- LinkedIn post
- Tags
- Alt text per image
- Image prompts

The existing "I've already written this..." checkbox **dies** in Pass 3 — Body's per-field checkbox replaces it (untick = preserve verbatim, same intent).

### What changes for the publish flow
- The `pub-draft` checkbox dies. Save-as-Draft becomes the default first state for any new post; Publish promotes it.
- The `pub-featured` checkbox stays.

### State-aware enable rules

```
Save:       enabled if any field is dirty since last commit
Regenerate: enabled if any LLM-relevant field is dirty (Title/Body/Tone/Category/SourceURL)
            AND at least one regenerate checkbox is ticked
Publish:    enabled if status === 'draft' AND form is clean (saved)
            disabled when status === 'published' (already live)
```

---

## Constraints and gotchas

1. **No em dashes anywhere in user-facing copy.** PB voice rule. Use commas, semicolons, periods, parens. Already swept; keep clean.
2. **`admin/` is on Cloudflare Pages with SPA fallback.** `/assets/*` paths resolve to the SPA fallback HTML, not the actual asset. Reference `https://www.plainblackcreative.com/assets/...` (absolute www URL) for any admin-loaded asset. The two `<img>` tags for the admin logo already do this (PR #107).
3. **`www/` is on GitHub Pages.** Real 404s, no SPA fallback. Inbound link rot is real after Archive/Delete.
4. **GitHub Contents API truncates files >1MB.** Use `ghFetchBytesAtRef` for binary content. The `raw.githubusercontent.com/{repo}/{ref}/{path}` URL has no size limit.
5. **Live image preview in `<iframe>`** is fed by `html-output` via `srcdoc`. Editing `html-output` directly fires `onEditorInput` → debounced `updatePreview`. Don't break this binding.
6. **Slug is locked forever once a post is first published.** Slug renaming is not supported by design (would create redirect machinery + inbound link complexity). To "rename" a published post, generate a new one with a new slug.
7. **PR auto-merge workflow.** Per memory: after `gh pr create`, immediately `gh pr merge --squash --delete-branch`. User trusts agent for small/medium PRs; pause on risky/large changes.
8. **Verify hosting per repo.** This repo splits per-subdomain. Curl `server:` header before assuming GitHub Pages vs Cloudflare Pages behavior.

---

## Next steps for the new session

1. Read this file (you're doing it).
2. `git log --oneline -20` to see the PR landscape.
3. Read `admin/blog-gen.html` thoroughly. It's 4k lines; skim the section comments first.
4. Confirm with the user that Pass 2 + Pass 3 spec above is still what they want before writing code.
5. Implement Pass 2 + Pass 3 as **one combined PR** (Pass 2 alone is a regression as noted).
6. Verify in `Claude Preview` (local static server via `.claude/launch.json`).
7. Commit + open PR + merge per the workflow.

Estimated work: 5-7 hours of focused effort. Multiple subsystems touched. Test frequently.

Good luck.
