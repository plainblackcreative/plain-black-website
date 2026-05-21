# pb-cms, tiny CMS API for plainblackcreative.com

A Cloudflare Worker that lets Ian (or anyone with Google access via Cloudflare
Access) edit blog posts and marked-up regions on landing pages, straight from
a browser, no Claude, no local checkout. Every save is one commit to `main` via
the GitHub Contents API. Cloudflare Pages picks the push up and redeploys.

**This worker is API-only.** The CMS UI lives in the `plainblack-admin` repo
(deployed at `admin.plainblackcreative.com`). The admin app loads the HTML/JS
and calls `/api/*` on this worker.

## What it does

- **Blog posts:** list, create, edit. Rich-text body editor, all the metadata
  (title, description, category, date, tags, og:image) as form fields.
- **Landing pages:** edits any block on a whitelisted page that has
  `data-cms-editable="some-id"` attached. Layout markup stays untouched.
  Ian only sees the regions you've opted in.
- **Images:** drag-drop upload to `/assets/uploads/<date>-<slug>.<ext>`,
  committed straight to the repo. Insert anywhere in a post body, or use as the
  og:image for a post.

## How it commits

Every save → `PUT /repos/plainblackcreative/plain-black-website/contents/<path>`
on the GitHub Contents API → one commit on `main`, signed
`pb-cms <cms@plainblackcreative.com>`. Cloudflare Pages auto-deploys from `main`.

No PR. No staging branch. The "automatically commit, push, merge" in the brief.

## One-time setup

### 1. GitHub access (you don't need a new PAT)

pb-cms never sees the GitHub PAT. All commits go through pb-braindump's
`/github/proxy` endpoint, which already holds the single
`GITHUB_PUBLISH_TOKEN` for the whole admin system. pb-cms authenticates to
that proxy with the same `BRAINDUMP_TOKEN` bearer the rest of the admin
tools use.

### 2. Set worker secrets

From `worker/cms/`:

```bash
# Same value as pb-braindump's BRAINDUMP_TOKEN. Grab it from
# admin.plainblackcreative.com -> DevTools -> Local Storage ->
# `pb-braindump-token`, or from wherever you originally stashed it.
npx wrangler secret put BRAINDUMP_TOKEN

# Optional shared-bearer fallback (only if you set ALLOW_SHARED_TOKEN="true"):
npx wrangler secret put CMS_SHARED_TOKEN
```

### 3. Deploy

```bash
cd worker/cms
npx wrangler deploy
```

The `routes` block in `wrangler.toml` wires up
`admin.plainblackcreative.com/cms-api/*` -> `pb-cms` on deploy, so there's
nothing to click in the dashboard.

### 4. Auth model

`admin.plainblackcreative.com` is already gated by Cloudflare Access (Google
IdP). The Worker route inherits that policy, so every request to
`/cms-api/*` arrives with `Cf-Access-Authenticated-User-Email` set. The
worker checks that email against `ALLOWED_EMAILS` in `wrangler.toml`. The
admin UI (`cms.html` in `plainblack-admin`) just calls `/cms-api/api/*`
with `credentials: 'include'`, no Authorization header needed from the
browser.

If `Cf-Access-Authenticated-User-Email` is missing on a request, the worker
returns 401 (or accepts a `Bearer` token if you've enabled the shared-token
fallback).

### 5. Add Ian's email to the allowlist

`worker/cms/wrangler.toml`:

```toml
ALLOWED_EMAILS = "ian@plainblackcreative.com,jayden@plainblackcreative.com"
```

Adjust and `npx wrangler deploy` again.

## How Ian uses it

1. Open `https://admin.plainblackcreative.com/cms` (the page lives in
   `plainblack-admin`).
2. Google sign-in via Cloudflare Access.
3. **Blog posts** → click any post to edit; **+ New post** to create one.
4. **Landing pages** → pick a page, edit any block. Each block shows its
   `data-cms-editable` id and the tag name (`<p>`, `<h2>`, etc.).
5. **Image upload** → drag-drop. Path is returned so it can be pasted into any
   `<img src="…">`.
6. Click **Save & publish**. Within ~30–60s Cloudflare Pages has redeployed and
   the change is live.

## Opting a new region into the CMS

Add `data-cms-editable="some-stable-id"` to any element on a whitelisted page:

```html
<h2 class="section-title" data-cms-editable="home-faq-title">Got questions?</h2>
```

Rules:
- The id must be unique on that page.
- The wrapper tag must not contain another element with the same tag name
  nested inside (e.g. don't put a `<p>` inside a `<p data-cms-editable>`).
  Inline tags (`<span>`, `<a>`, `<strong>`, `<em>`, `<br>`) are fine.

Whitelisted pages live in `src/pages.js` → `PAGES`.

## Local dev

```bash
cd worker/cms
npx wrangler dev
# then open http://localhost:8787
```

For local dev you'll want to enable `ALLOW_SHARED_TOKEN="true"` and pass an
`Authorization: Bearer <token>` header (the UI doesn't add one, easiest to
test the API with `curl`, or temporarily relax the auth check). Cloudflare
Access doesn't run in `wrangler dev`.

## What it intentionally doesn't do

- **No staging / PR flow.** Edits go straight to `main`. That's the spec.
- **No history / undo inside the CMS.** Git history is the history. If Ian
  publishes something wrong, revert the commit in GitHub.
- **No delete-post.** Deleting blog posts from the CMS would be one click away
  from disaster. Do it manually (git rm + commit) when needed.
- **No layout editing.** Only marked regions are exposed. Layout stays in the
  source.

## Files

```
worker/cms/                  (this repo, API only)
  wrangler.toml              # config, ALLOWED_EMAILS, ALLOWED_ORIGINS, secrets list
  package.json
  src/
    index.js                 # entry, routing, auth, image upload
    github.js                # tiny Contents API wrapper
    blog.js                  # parse / write blog post HTML, new-post template
    pages.js                 # whitelist + editable-region extract / replace

plainblack-admin/cms.html    (other repo, UI)
                             # single-file admin UI; calls /cms-api/* (or
                             # cms.plainblackcreative.com) on this worker
```
