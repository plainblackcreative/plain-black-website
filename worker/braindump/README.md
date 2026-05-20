# PlainBlack braindump — Cloudflare Worker

Backs the **Inbox Hero** tool in the admin Hub. Captures notes, URLs, photos,
and Gmail-labelled emails into Cloudflare KV; runs an optional LLM triage pass
that returns a prioritized list and writes a weekly analytics snapshot.

Auth: single shared **bearer token** (`BRAINDUMP_TOKEN`), same pattern as
`worker/scratchpad`. LLM triage uses `ANTHROPIC_API_KEY` (same key the bot
worker uses) held server-side.

---

## One-time deploy

```bash
cd worker/braindump
npx wrangler login
npm install

# 1. Create the KV namespace
npx wrangler kv namespace create BRAINDUMP_KV
#   → copy the printed `id` into wrangler.toml (replace REPLACE_WITH_...)

# 2. Bearer token (long random string, you'll paste it once per device)
#    Generate: openssl rand -base64 32
npx wrangler secret put BRAINDUMP_TOKEN

# 3. Anthropic API key (same key used by worker/bot)
npx wrangler secret put ANTHROPIC_API_KEY

# 4. Deploy
npx wrangler deploy
#   → returns:  https://pb-braindump.YOUR-SUBDOMAIN.workers.dev
```

## Wire the inbox UI

Open `https://admin.plainblackcreative.com/inbox` in your browser. First visit
prompts for:

1. **Worker URL** — `https://pb-braindump.…workers.dev`
2. **Token** — the secret you put into Cloudflare above

Both saved per device in localStorage (`pb-braindump-url`, `pb-braindump-token`).

## Endpoints

```
GET   /health           → { ok: true }                      (open)
GET   /items            → { items: [...] }
POST  /items            → { ok, id }       body: { type, content, tags?, effort?, imageDataUrl? }
PATCH /items/:id        → { ok }           body: partial item
DELETE /items/:id       → { ok }
GET   /items/:id/image  → image bytes (jpeg)                 (auth required)

POST  /triage           → { ok, week, ranked: [...] }
GET   /digest           → { week, ranked: [...] }            most recent snapshot
GET   /analytics        → { weeks: [{ week, added, done, carriedIn, archived, openAtEnd, topTags }] }

POST  /sync-gmail       → { ok, imported, skipped, items }   pull messages labelled GMAIL_LABEL
POST  /check-replies    → { ok, checked, replied }           mark items repliedAt once you've responded
```

All non-`/health` routes require `Authorization: Bearer <BRAINDUMP_TOKEN>`.

---

## Gmail integration (optional)

Pulls emails labelled `brain-dump` into the inbox as triagable items, and
tracks which ones you've replied to.

### One-time setup

**1. Enable the Gmail API + create an OAuth client (Web application type)**

- Pick the Google Cloud project you want this to live in. If you're in a Workspace org, sign into Cloud Console as that org's account first — it must be the *same* project that holds the OAuth client below, otherwise the worker will get `gmail_labels_failed_403` at runtime.
- Enable the API: <https://console.cloud.google.com/apis/library/gmail.googleapis.com> → **Enable**
- Configure the OAuth consent screen if you haven't already: User Type **Internal** for Workspace orgs (no test users, no verification), **External** for personal Gmail accounts (add your address under Test users). Leave in Testing mode — do not Publish.
- <https://console.cloud.google.com/apis/credentials> → **Create credentials → OAuth client ID** → Application type **Web application** → name it (e.g. *"PlainBlack braindump (web)"*)
- Under **Authorized redirect URIs**, click **Add URI** and paste exactly: `https://developers.google.com/oauthplayground`
- Create → copy the **Client ID** and **Client secret**, or click **Download JSON**

> ⚠️ Common gotcha: a **Desktop app** type only accepts `http://localhost` as a redirect URI, so the OAuth Playground flow below fails with `redirect_uri_mismatch`. Always use **Web application**.

**2. Get a refresh token (easiest path: Google OAuth Playground)**

- Open <https://developers.google.com/oauthplayground>
- Top-right gear → **Use your own OAuth credentials** → paste your Client ID + Client secret. Confirm **Access type** is set to `Offline` (required to mint a refresh token).
- Step 1: type `https://www.googleapis.com/auth/gmail.modify` into "Input your own scopes" at the bottom → **Authorize APIs** → sign in as the Google account whose Gmail you want synced
- On the consent screen click **Allow** (it says "Read, compose, and send emails…")
- Step 2: **Exchange authorization code for tokens** → copy the **Refresh token** (starts with `1//`)

**3. Set the three secrets**

```bash
cd worker/braindump
npx wrangler secret put GMAIL_CLIENT_ID       # paste client id
npx wrangler secret put GMAIL_CLIENT_SECRET   # paste client secret
npx wrangler secret put GMAIL_REFRESH_TOKEN   # paste refresh token
npx wrangler deploy
```

**4. Create the Gmail label**

In Gmail web: **Settings → Labels → Create new label** → name it `brain-dump` (lowercase, hyphen — must match `GMAIL_LABEL` var, default `brain-dump`).

### Daily flow

- When you read an email you want triaged Monday, **apply the `brain-dump` label** (`l` then type, or a filter).
- In the inbox UI, click **✉ sync gmail**. The Worker imports any newly labelled mail as items, then *removes the label* so they don't re-import on the next sync.
- Once you've replied to one, click **↩ check replies** (or it'll fire automatically alongside the Monday triage if you wire it up). Items get a green *✓ replied &lt;date&gt;* badge.
- During Monday triage, unreplied email items get pushed toward **do-now** / **quick-win** automatically.

### Notes

- Scope `gmail.modify` is used so the Worker can strip the `brain-dump` label after import. Read-only would re-import the same mail every sync.
- Access tokens are cached in KV for 50 min to keep refresh-token usage minimal.
- The body is stripped down to the "above the fold" reply (quoted history and signatures are trimmed) before being stored — saves space and gives the LLM cleaner input during triage.
- Reply detection looks for any message in the thread tagged with Gmail's system `SENT` label after the original message's `internalDate`.

## Data layout in KV

- `item:<id>` — JSON of the item (without image bytes)
- `img:<id>`  — raw JPEG bytes (only if the item has a photo)
- `index:items` — array of `{ id, createdAt }` for fast list (kept sorted desc)
- `snapshot:<YYYY-WW>` — JSON of a weekly snapshot (ranked items + counts)
- `index:snapshots` — array of week keys, newest first

## Cost / limits

Cloudflare free tier covers this easily. Triage uses Claude Haiku — at the
volumes a personal inbox produces, you're looking at fractions of a cent per
Monday run.
