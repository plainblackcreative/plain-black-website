# PlainBlack Hub cards — Cloudflare Worker

Backs the new Hub's Today / Board / Library views. Stores cards + an
activity feed in **Cloudflare KV**, gated by a **bearer token** (single
shared secret, set in Cloudflare, paste once into each browser).

No third-party services. No keys in the repo.

---

## One-time deploy

```bash
cd worker/cards
npx wrangler login                    # opens browser
npm install                            # installs wrangler

# 1. Create the KV namespace
npx wrangler kv namespace create PB_CARDS_KV
#   → copy the printed `id` into wrangler.toml (replace REPLACE_WITH_KV_ID)

# 2. Set the shared secret (the bearer token)
#    Use a long random string. Generate with:
#       openssl rand -base64 32
npx wrangler secret put CARDS_TOKEN
#   → paste the secret when prompted

# 3. Deploy
npx wrangler deploy
#   → returns a URL like:
#       https://pb-cards.YOUR-SUBDOMAIN.workers.dev
```

## Wire the Hub up

Open the new Hub (`/admin/hub.html`) in your browser. On first load it'll
prompt for:

1. **Worker URL** — the `https://pb-cards.…workers.dev` URL above.
2. **Token** — the same secret you put into Cloudflare in step 2.
3. **Who are you?** — pick Jayden or Ian. Stored per device.

Both saved to `localStorage` per device. Each person (you + Ian) does this
once on each device they use.

To rotate the token: re-run `wrangler secret put CARDS_TOKEN`, then clear
`pb-cards-token` localStorage on each device (or re-paste when prompted).

## Endpoints

```
GET    /health                         → { ok: true }                       (open)
GET    /cards[?status=&assignee=&project_id=&type=&limit=]
                                       → { cards: [...] }
POST   /cards                          body: partial Card → { card }
GET    /cards/:id                      → { card }
PUT    /cards/:id                      body: partial Card → { card }
DELETE /cards/:id                      → { ok: true }   (soft delete → status="archived")
GET    /activity[?limit=20]            → { activity: [...] }
```

All non-`/health` routes require `Authorization: Bearer <CARDS_TOKEN>`.

## Card schema

```js
{
  id: "card-<base36>-<rand>",
  type: "task" | "idea" | "chat" | "note" | "script" | "crm" | "inbox",
  status: "backlog" | "priority" | "working" | "blocked" | "done" | "published" | "archived",
  title: string,             // <= 280 chars, required
  body:  string,             // <= 8000 chars
  project_id:   string|null, // optional, matches REGISTRY slug
  project_name: string|null,
  assignee: string[],        // ["j"], ["i"], or ["j","i"]. Pass "both" on write, normalised to array.
  tags: string[],            // <= 12 tags, each <= 32 chars
  created_at: ISO,
  updated_at: ISO,
  created_by: "j" | "i"
}
```

## Activity schema

Auto-appended on every create / update / delete. Last 200 retained.

```js
{
  id: "act-<base36>-<rand>",
  who: "j" | "i",
  action: "added" | "moved" | "updated" | "archived",
  card_id: string,
  card_title: string,
  card_type: string,
  status_from: string | null,
  status_to:   string,
  timestamp: ISO
}
```

Pass `_actor: "j"|"i"` in the body of PUT/DELETE to attribute the action
to whoever is logged in on that device (vs. the original creator).

## Cost / limits

Cloudflare Workers free tier: 100,000 requests/day, 10ms CPU per request.
KV free tier: 100,000 reads + 1,000 writes per day, 1GB storage.

Hub realistically writes a few dozen times per day. Plenty of headroom.
