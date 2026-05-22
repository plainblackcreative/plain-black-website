// PlainBlack Hub cards — Cloudflare Worker
// Stores cards + activity in Workers KV.
// Auth: bearer token (set as CARDS_TOKEN secret).
//
// KV layout (single-blob — both reads and writes hit one key):
//   cards:all        → JSON array of Card objects (newest first)
//   activity:all     → JSON array of ActivityEntry objects (newest first, capped at 200)
//
// Legacy keys (auto-migrated on first read, then left in place but unused):
//   index:cards      → JSON array of card ids
//   index:activity   → JSON array of activity ids
//   card:<id>        → JSON Card
//   activity:<id>    → JSON ActivityEntry
//
// Endpoints:
//   GET    /health                         → { ok: true }                 (open)
//   GET    /cards[?status=&assignee=&project_id=&type=&limit=]
//                                          → { cards: [...] }
//   POST   /cards                          body: partial Card → { card }
//   GET    /cards/:id                      → { card }
//   PUT    /cards/:id                      body: partial Card → { card }
//   DELETE /cards/:id                      → { ok: true }                 (soft delete → status="archived")
//   GET    /activity[?limit=20]            → { activity: [...] }

const CARDS_KEY = 'cards:all';
const ACTIVITY_KEY = 'activity:all';
const LEGACY_INDEX_CARDS = 'index:cards';
const LEGACY_INDEX_ACTIVITY = 'index:activity';

const ACTIVITY_CAP = 200;
const MAX_BODY_BYTES = 64 * 1024;

const CARD_TYPES = new Set(['task', 'idea', 'chat', 'note', 'script', 'crm', 'inbox']);
const CARD_STATUSES = new Set(['backlog', 'priority', 'working', 'blocked', 'done', 'published', 'archived']);
const WHO_VALUES = new Set(['j', 'i']);

export default {
  async fetch(request, env) {
    const cors = corsHeaders(request, env);

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: cors });
    }

    const url = new URL(request.url);
    const path = url.pathname.replace(/\/+$/, '') || '/';

    if (path === '/health') {
      return json({ ok: true }, 200, cors);
    }

    const auth = (request.headers.get('Authorization') || '').replace(/^Bearer\s+/i, '');
    if (!env.CARDS_TOKEN || auth !== env.CARDS_TOKEN) {
      return json({ error: 'unauthorized' }, 401, cors);
    }

    try {
      if (path === '/cards' && request.method === 'GET')   return listCards(url, env, cors);
      if (path === '/cards' && request.method === 'POST')  return createCard(request, env, cors);
      if (path === '/activity' && request.method === 'GET') return listActivity(url, env, cors);

      const cardMatch = path.match(/^\/cards\/([A-Za-z0-9_\-]+)$/);
      if (cardMatch) {
        const id = cardMatch[1];
        if (request.method === 'GET')    return getCard(id, env, cors);
        if (request.method === 'PUT')    return updateCard(id, request, env, cors);
        if (request.method === 'DELETE') return deleteCard(id, request, env, cors);
      }

      return json({ error: 'not found' }, 404, cors);
    } catch (err) {
      return json({ error: 'server error', detail: String(err && err.message || err) }, 500, cors);
    }
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// CORS
// ─────────────────────────────────────────────────────────────────────────────

function corsHeaders(request, env) {
  const allowedOrigins = (env.ALLOWED_ORIGINS || '*').split(',').map(s => s.trim());
  const origin = request.headers.get('Origin') || '';
  const allowOrigin =
    allowedOrigins.includes('*') ? '*' :
    allowedOrigins.includes(origin) ? origin : allowedOrigins[0];
  return {
    'Access-Control-Allow-Origin': allowOrigin,
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400',
    'Vary': 'Origin'
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Storage — single-blob reads/writes for cards and activity.
//
// Reads collapse to 1 KV op regardless of how many cards exist. Writes rewrite
// the whole blob, which is fine at personal-Hub scale (cards << 1000, value
// size << 25MB KV cap). If you ever push past a few thousand cards, split body
// out into its own key or move to a Durable Object.
// ─────────────────────────────────────────────────────────────────────────────

async function readAllCards(env) {
  const raw = await env.PB_CARDS_KV.get(CARDS_KEY);
  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    } catch {}
    return [];
  }
  return migrateCards(env);
}

async function writeAllCards(env, cards) {
  await env.PB_CARDS_KV.put(CARDS_KEY, JSON.stringify(cards));
}

async function migrateCards(env) {
  const indexRaw = await env.PB_CARDS_KV.get(LEGACY_INDEX_CARDS);
  let ids = [];
  if (indexRaw) {
    try {
      const parsed = JSON.parse(indexRaw);
      if (Array.isArray(parsed)) ids = parsed;
    } catch {}
  }
  const results = await Promise.all(
    ids.map(async (id) => {
      const raw = await env.PB_CARDS_KV.get('card:' + id);
      if (!raw) return null;
      try { return JSON.parse(raw); } catch { return null; }
    })
  );
  const cards = results.filter(Boolean);
  await env.PB_CARDS_KV.put(CARDS_KEY, JSON.stringify(cards));
  return cards;
}

async function readAllActivity(env) {
  const raw = await env.PB_CARDS_KV.get(ACTIVITY_KEY);
  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    } catch {}
    return [];
  }
  return migrateActivity(env);
}

async function writeAllActivity(env, activity) {
  await env.PB_CARDS_KV.put(ACTIVITY_KEY, JSON.stringify(activity));
}

async function migrateActivity(env) {
  const indexRaw = await env.PB_CARDS_KV.get(LEGACY_INDEX_ACTIVITY);
  let ids = [];
  if (indexRaw) {
    try {
      const parsed = JSON.parse(indexRaw);
      if (Array.isArray(parsed)) ids = parsed;
    } catch {}
  }
  const results = await Promise.all(
    ids.slice(0, ACTIVITY_CAP).map(async (id) => {
      const raw = await env.PB_CARDS_KV.get('activity:' + id);
      if (!raw) return null;
      try { return JSON.parse(raw); } catch { return null; }
    })
  );
  const activity = results.filter(Boolean);
  await env.PB_CARDS_KV.put(ACTIVITY_KEY, JSON.stringify(activity));
  return activity;
}

// ─────────────────────────────────────────────────────────────────────────────
// Card CRUD
// ─────────────────────────────────────────────────────────────────────────────

async function listCards(url, env, cors) {
  const cards = await readAllCards(env);
  const filterStatus = url.searchParams.get('status');
  const filterAssignee = url.searchParams.get('assignee');
  const filterProject = url.searchParams.get('project_id');
  const filterType = url.searchParams.get('type');
  const limit = clampInt(url.searchParams.get('limit'), 1, 500, 500);

  const out = [];
  for (const card of cards) {
    if (filterStatus && card.status !== filterStatus) continue;
    if (filterType && card.type !== filterType) continue;
    if (filterProject && card.project_id !== filterProject) continue;
    if (filterAssignee) {
      const a = Array.isArray(card.assignee) ? card.assignee : [card.assignee];
      if (!a.includes(filterAssignee)) continue;
    }
    out.push(card);
    if (out.length >= limit) break;
  }
  return json({ cards: out }, 200, cors);
}

async function getCard(id, env, cors) {
  const cards = await readAllCards(env);
  const card = cards.find(c => c.id === id);
  if (!card) return json({ error: 'not found' }, 404, cors);
  return json({ card }, 200, cors);
}

async function createCard(request, env, cors) {
  const body = await readJson(request);
  if (!body) return json({ error: 'invalid json' }, 400, cors);

  const now = new Date().toISOString();
  const id = body.id || newId('card');
  const card = sanitiseCard({
    id,
    type: body.type || 'inbox',
    status: body.status || 'backlog',
    title: (body.title || '').toString().slice(0, 280).trim(),
    body: (body.body || '').toString().slice(0, 8000),
    project_id: body.project_id || null,
    project_name: body.project_name || null,
    assignee: normaliseAssignee(body.assignee),
    tags: Array.isArray(body.tags) ? body.tags.slice(0, 12).map(t => String(t).slice(0, 32)) : [],
    created_at: now,
    updated_at: now,
    created_by: WHO_VALUES.has(body.created_by) ? body.created_by : 'j'
  });

  if (!card.title) return json({ error: 'title required' }, 400, cors);

  const cards = await readAllCards(env);
  // De-dup if caller re-creates with an existing id, and put the new card first.
  const next = [card, ...cards.filter(c => c.id !== card.id)];
  await writeAllCards(env, next);

  await appendActivity(env, {
    who: card.created_by,
    action: 'added',
    card_id: card.id,
    card_title: card.title,
    status_from: null,
    status_to: card.status,
    card_type: card.type
  });

  return json({ card }, 200, cors);
}

async function updateCard(id, request, env, cors) {
  const cards = await readAllCards(env);
  const idx = cards.findIndex(c => c.id === id);
  if (idx === -1) return json({ error: 'not found' }, 404, cors);
  const existing = cards[idx];

  const body = await readJson(request);
  if (!body) return json({ error: 'invalid json' }, 400, cors);

  const updated = sanitiseCard({
    ...existing,
    ...body,
    id: existing.id,
    created_at: existing.created_at,
    created_by: existing.created_by,
    assignee: body.assignee !== undefined ? normaliseAssignee(body.assignee) : existing.assignee,
    tags: Array.isArray(body.tags) ? body.tags.slice(0, 12).map(t => String(t).slice(0, 32)) : existing.tags,
    updated_at: new Date().toISOString()
  });

  cards[idx] = updated;
  await writeAllCards(env, cards);

  const who = WHO_VALUES.has(body._actor) ? body._actor : updated.created_by;
  const statusChanged = existing.status !== updated.status;
  await appendActivity(env, {
    who,
    action: statusChanged ? 'moved' : 'updated',
    card_id: updated.id,
    card_title: updated.title,
    status_from: existing.status,
    status_to: updated.status,
    card_type: updated.type
  });

  return json({ card: updated }, 200, cors);
}

async function deleteCard(id, request, env, cors) {
  const cards = await readAllCards(env);
  const idx = cards.findIndex(c => c.id === id);
  if (idx === -1) return json({ error: 'not found' }, 404, cors);
  const existing = cards[idx];
  // Build the archived copy without mutating `existing`, so the activity entry
  // below can still record the original status as `status_from`.
  cards[idx] = {
    ...existing,
    status: 'archived',
    updated_at: new Date().toISOString()
  };
  await writeAllCards(env, cards);

  let actor = 'j';
  try {
    const body = await readJson(request);
    if (body && WHO_VALUES.has(body._actor)) actor = body._actor;
  } catch {}
  await appendActivity(env, {
    who: actor,
    action: 'archived',
    card_id: id,
    card_title: existing.title,
    status_from: existing.status,
    status_to: 'archived',
    card_type: existing.type
  });

  return json({ ok: true }, 200, cors);
}

// ─────────────────────────────────────────────────────────────────────────────
// Activity
// ─────────────────────────────────────────────────────────────────────────────

async function listActivity(url, env, cors) {
  const limit = clampInt(url.searchParams.get('limit'), 1, 100, 20);
  const activity = await readAllActivity(env);
  return json({ activity: activity.slice(0, limit) }, 200, cors);
}

async function appendActivity(env, partial) {
  const entry = {
    id: newId('act'),
    timestamp: new Date().toISOString(),
    ...partial
  };
  const activity = await readAllActivity(env);
  const next = [entry, ...activity].slice(0, ACTIVITY_CAP);
  await writeAllActivity(env, next);
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function sanitiseCard(c) {
  if (!CARD_TYPES.has(c.type)) c.type = 'inbox';
  if (!CARD_STATUSES.has(c.status)) c.status = 'backlog';
  return c;
}

function normaliseAssignee(raw) {
  if (Array.isArray(raw)) return raw.filter(v => WHO_VALUES.has(v));
  if (raw === 'both') return ['j', 'i'];
  if (WHO_VALUES.has(raw)) return [raw];
  return [];
}

function newId(prefix) {
  return prefix + '-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 7);
}

function clampInt(raw, min, max, fallback) {
  const n = parseInt(raw, 10);
  if (!Number.isFinite(n)) return fallback;
  return Math.max(min, Math.min(max, n));
}

async function readJson(request) {
  try {
    const text = await request.text();
    if (text.length > MAX_BODY_BYTES) return null;
    return JSON.parse(text);
  } catch { return null; }
}

function json(obj, status, cors) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { 'Content-Type': 'application/json', ...cors }
  });
}
