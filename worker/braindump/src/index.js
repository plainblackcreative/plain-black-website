// PlainBlack braindump — Cloudflare Worker
// Stores items (notes / urls / photos / emails) in KV, runs weekly LLM triage,
// pulls Gmail labels in, tracks replies, and computes week-over-week analytics.

import * as gmail from './gmail.js';

const ANTHROPIC_URL = 'https://api.anthropic.com/v1/messages';
const DEFAULT_MODEL = 'claude-haiku-4-5';
const MAX_BODY_BYTES = 5 * 1024 * 1024; // 5 MB (for an image POST)
const MAX_TEXT_BYTES = 8 * 1024;
const MAX_IMAGE_BYTES = 4 * 1024 * 1024; // 4 MB per image (already client-downscaled)
const MAX_TRIAGE_ITEMS = 80;             // how many open items we feed to the LLM
const TRIAGE_MAX_TOKENS = 4000;

export default {
  async fetch(request, env) {
    const allowedOrigins = (env.ALLOWED_ORIGINS || '*').split(',').map(s => s.trim());
    const origin = request.headers.get('Origin') || '';
    const allowOrigin =
      allowedOrigins.includes('*') ? '*' :
      allowedOrigins.includes(origin) ? origin : allowedOrigins[0];

    const cors = {
      'Access-Control-Allow-Origin': allowOrigin,
      'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400',
      'Vary': 'Origin'
    };

    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });

    const url = new URL(request.url);
    const path = url.pathname.replace(/\/+$/, '') || '/';

    if (path === '/health') return json({ ok: true }, 200, cors);

    // Bearer auth
    const token = (request.headers.get('Authorization') || '').replace(/^Bearer\s+/i, '');
    if (!env.BRAINDUMP_TOKEN || token !== env.BRAINDUMP_TOKEN) {
      return json({ error: 'unauthorized' }, 401, cors);
    }

    try {
      // /items
      if (path === '/items' && request.method === 'GET')  return await listItems(env, cors);
      if (path === '/items' && request.method === 'POST') return await createItem(request, env, cors);

      // /items/:id  and  /items/:id/image
      const itemMatch = path.match(/^\/items\/([A-Za-z0-9_-]+)(?:\/(image))?$/);
      if (itemMatch) {
        const id = itemMatch[1];
        const sub = itemMatch[2];
        if (sub === 'image' && request.method === 'GET') return await getImage(id, env, cors);
        if (request.method === 'PATCH')                  return await updateItem(id, request, env, cors);
        if (request.method === 'DELETE')                 return await deleteItem(id, env, cors);
      }

      // /triage, /digest, /analytics
      if (path === '/triage'    && request.method === 'POST') return await runTriage(env, cors);
      if (path === '/digest'    && request.method === 'GET')  return await getDigest(env, cors);
      if (path === '/analytics' && request.method === 'GET')  return await getAnalytics(env, cors);

      // /gmail endpoints
      if (path === '/sync-gmail'    && request.method === 'POST') return await syncGmail(env, cors);
      if (path === '/check-replies' && request.method === 'POST') return await checkReplies(env, cors);
    } catch (err) {
      console.error('worker error:', err && err.stack || err);
      return json({ error: 'server_error', detail: String(err && err.message || err) }, 500, cors);
    }

    return json({ error: 'not_found' }, 404, cors);
  }
};

/* ---------- items ---------- */

async function listItems(env, cors) {
  const idx = await readIndex(env);
  const items = [];
  for (const entry of idx) {
    const raw = await env.BRAINDUMP_KV.get('item:' + entry.id);
    if (raw) items.push(JSON.parse(raw));
  }
  return json({ items }, 200, cors);
}

async function createItem(request, env, cors) {
  const body = await safeJson(request);
  if (!body) return json({ error: 'invalid_json' }, 400, cors);

  const type = ['note', 'url', 'photo', 'reading'].includes(body.type) ? body.type : 'note';
  const content = String(body.content || '').slice(0, MAX_TEXT_BYTES).trim();
  const tags = Array.isArray(body.tags)
    ? body.tags.map(t => String(t).slice(0, 32)).filter(Boolean).slice(0, 8)
    : [];
  const effort = [5, 15, 60].includes(Number(body.effort)) ? Number(body.effort) : null;

  // Image (optional). Comes in as a data URL (data:image/jpeg;base64,...).
  let hasImage = false;
  let imageBytes = null;
  if (typeof body.imageDataUrl === 'string' && body.imageDataUrl.startsWith('data:image/')) {
    const m = body.imageDataUrl.match(/^data:image\/(\w+);base64,(.+)$/);
    if (m) {
      const bytes = base64ToBytes(m[2]);
      if (bytes.length > MAX_IMAGE_BYTES) {
        return json({ error: 'image_too_large' }, 413, cors);
      }
      imageBytes = bytes;
      hasImage = true;
    }
  }

  if (!content && !hasImage) {
    return json({ error: 'empty_item' }, 400, cors);
  }

  const id = newId();
  const now = new Date().toISOString();
  const item = {
    id,
    type: hasImage && type === 'note' ? 'photo' : type,
    content,
    tags,
    effort,
    hasImage,
    status: 'open',
    createdAt: now,
    weekAdded: isoWeek(new Date(now)),
    doneAt: null,
    archivedAt: null,
    carryCount: 0,
    priority: null,
    triageNote: null,
    triagedAt: null,
    // email fields — populated by syncGmail, null for normal items
    source: null,
    gmailMsgId: null,
    gmailThreadId: null,
    from: null,
    subject: null,
    repliedAt: null
  };

  if (hasImage) {
    await env.BRAINDUMP_KV.put('img:' + id, imageBytes, {
      metadata: { contentType: 'image/jpeg' }
    });
    // OCR pass — read whiteboard/note contents so they're searchable & visible
    // in the inbox immediately, not just at Monday triage.
    const extracted = await ocrImage(imageBytes, env);
    if (extracted) {
      item.ocrText = extracted;
      item.content = item.content
        ? item.content + '\n\n[from photo]\n' + extracted
        : extracted;
    }
  }

  await env.BRAINDUMP_KV.put('item:' + id, JSON.stringify(item));

  const idx = await readIndex(env);
  idx.unshift({ id, createdAt: now });
  await writeIndex(env, idx);

  return json({ ok: true, id, item }, 200, cors);
}

async function ocrImage(imageBytes, env) {
  if (!env.ANTHROPIC_API_KEY) return '';
  try {
    const r = await fetch(ANTHROPIC_URL, {
      method: 'POST',
      headers: {
        'x-api-key': env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        model: env.MODEL || DEFAULT_MODEL,
        max_tokens: 800,
        messages: [{
          role: 'user',
          content: [
            {
              type: 'image',
              source: { type: 'base64', media_type: 'image/jpeg', data: bytesToBase64(imageBytes) }
            },
            {
              type: 'text',
              text: 'This is a photo a user dumped into their personal brain-dump inbox — whiteboard, notebook, sticky note, screenshot, sketch, etc. Extract the readable content as plain text. Preserve bullet structure for lists; preserve names, dates, numbers, URLs verbatim. No headers, no preamble, no "I see…" — just the content. If the image is mostly unreadable, give one short factual sentence describing what it is. Max ~400 words.'
            }
          ]
        }]
      })
    });
    if (!r.ok) return '';
    const data = await r.json();
    const text = (data.content || []).filter(c => c.type === 'text').map(c => c.text).join('').trim();
    return text;
  } catch {
    return '';
  }
}

async function updateItem(id, request, env, cors) {
  const raw = await env.BRAINDUMP_KV.get('item:' + id);
  if (!raw) return json({ error: 'not_found' }, 404, cors);

  const body = await safeJson(request);
  if (!body) return json({ error: 'invalid_json' }, 400, cors);

  const item = JSON.parse(raw);
  const allowed = ['status', 'tags', 'effort', 'content', 'priority', 'triageNote'];
  for (const k of allowed) {
    if (body[k] !== undefined) item[k] = body[k];
  }
  const now = new Date().toISOString();
  if (body.status === 'done' && !item.doneAt)           item.doneAt = now;
  if (body.status === 'archived' && !item.archivedAt)   item.archivedAt = now;
  if (body.status === 'open') { item.doneAt = null; item.archivedAt = null; }

  await env.BRAINDUMP_KV.put('item:' + id, JSON.stringify(item));
  return json({ ok: true, item }, 200, cors);
}

async function deleteItem(id, env, cors) {
  await env.BRAINDUMP_KV.delete('item:' + id);
  await env.BRAINDUMP_KV.delete('img:' + id);
  const idx = await readIndex(env);
  const next = idx.filter(e => e.id !== id);
  if (next.length !== idx.length) await writeIndex(env, next);
  return json({ ok: true }, 200, cors);
}

async function getImage(id, env, cors) {
  const { value, metadata } = await env.BRAINDUMP_KV.getWithMetadata('img:' + id, 'arrayBuffer');
  if (!value) return json({ error: 'not_found' }, 404, cors);
  return new Response(value, {
    status: 200,
    headers: {
      ...cors,
      'Content-Type': (metadata && metadata.contentType) || 'image/jpeg',
      'Cache-Control': 'private, max-age=86400'
    }
  });
}

/* ---------- triage ---------- */

async function runTriage(env, cors) {
  if (!env.ANTHROPIC_API_KEY) return json({ error: 'server_misconfigured' }, 500, cors);

  const idx = await readIndex(env);
  const open = [];
  for (const entry of idx) {
    const raw = await env.BRAINDUMP_KV.get('item:' + entry.id);
    if (!raw) continue;
    const it = JSON.parse(raw);
    if (it.status === 'open') open.push(it);
    if (open.length >= MAX_TRIAGE_ITEMS) break;
  }

  if (open.length === 0) {
    return json({ ok: true, week: isoWeek(new Date()), ranked: [], reasoning: 'No open items.' }, 200, cors);
  }

  // Bump carryCount for items added in earlier weeks
  const thisWeek = isoWeek(new Date());
  for (const it of open) {
    if (it.weekAdded !== thisWeek) {
      it.carryCount = (it.carryCount || 0) + 1;
      // auto-archive items that have sat untouched 3+ weeks
      if (it.carryCount >= 3) {
        it.status = 'archived';
        it.archivedAt = new Date().toISOString();
        await env.BRAINDUMP_KV.put('item:' + it.id, JSON.stringify(it));
      } else {
        await env.BRAINDUMP_KV.put('item:' + it.id, JSON.stringify(it));
      }
    }
  }
  const stillOpen = open.filter(it => it.status === 'open');

  // Build the LLM input. Photos go in as multimodal content blocks.
  const userBlocks = [];
  const summary = stillOpen.map((it, i) => {
    const base = {
      n: i + 1,
      id: it.id,
      type: it.type,
      content: it.content,
      tags: it.tags,
      effort: it.effort,
      carryCount: it.carryCount,
      age_days: daysSince(it.createdAt)
    };
    if (it.source === 'gmail') {
      base.source = 'gmail';
      base.subject = it.subject;
      base.from = it.from;
      base.needs_reply = !it.repliedAt;
      base.replied = !!it.repliedAt;
    }
    return base;
  });
  userBlocks.push({
    type: 'text',
    text:
`You are triaging my personal weekly brain-dump. Return a STRICT JSON object (no prose, no markdown) with this shape:

{
  "ranked": [
    { "id": "<id>", "priority": <1..N>, "reason": "<one short sentence>", "bucket": "do-now" | "deep-work" | "quick-win" | "reading" | "defer" }
  ],
  "narrative": "<2-3 sentence summary of the week ahead, plain text>"
}

Rules:
- priority 1 = the single most important thing to do Monday morning.
- A good Monday list opens with 1-2 "do-now" items, then a deep-work block, mixed with quick-wins.
- "reading" items should not crowd out action items — group them at the bottom.
- Items with high carryCount (have been carried 1-2 weeks already) deserve a hard look: either elevate them or mark "defer" with a brief reason.
- Items tagged urgent/today/asap should be near the top.
- Email items (source: "gmail") with needs_reply: true should usually surface near the top with bucket "do-now" or "quick-win" — overdue replies cost more than they look. If already replied, deprioritize unless content suggests another action.
- DO NOT invent ids. Use only ids present in the list below.
- Return JSON only — no markdown fences.

ITEMS:
${JSON.stringify(summary, null, 2)}
`
  });

  // Attach any photo items as image blocks so the LLM can see them.
  for (const it of stillOpen) {
    if (it.hasImage) {
      const bytes = await env.BRAINDUMP_KV.get('img:' + it.id, 'arrayBuffer');
      if (bytes) {
        userBlocks.push({
          type: 'image',
          source: { type: 'base64', media_type: 'image/jpeg', data: bytesToBase64(new Uint8Array(bytes)) }
        });
        userBlocks.push({ type: 'text', text: `(image above belongs to item id: ${it.id})` });
      }
    }
  }

  const r = await fetch(ANTHROPIC_URL, {
    method: 'POST',
    headers: {
      'x-api-key': env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      model: env.MODEL || DEFAULT_MODEL,
      max_tokens: TRIAGE_MAX_TOKENS,
      messages: [{ role: 'user', content: userBlocks }]
    })
  });

  if (!r.ok) {
    const detail = await r.text();
    return json({ error: 'anthropic_error', status: r.status, detail }, 502, cors);
  }
  const data = await r.json();
  const text = (data.content || []).filter(c => c.type === 'text').map(c => c.text).join('').trim();

  let parsed;
  try {
    parsed = JSON.parse(stripFences(text));
  } catch {
    return json({ error: 'triage_unparsable', raw: text }, 502, cors);
  }
  if (!parsed || !Array.isArray(parsed.ranked)) {
    return json({ error: 'triage_bad_shape', raw: text }, 502, cors);
  }

  // Write priority + reason back onto items
  const triagedAt = new Date().toISOString();
  const validIds = new Set(stillOpen.map(it => it.id));
  const ranked = parsed.ranked.filter(r => validIds.has(r.id));
  for (const r of ranked) {
    const raw = await env.BRAINDUMP_KV.get('item:' + r.id);
    if (!raw) continue;
    const it = JSON.parse(raw);
    it.priority = Number(r.priority) || null;
    it.triageNote = String(r.reason || '');
    it.triageBucket = String(r.bucket || '');
    it.triagedAt = triagedAt;
    await env.BRAINDUMP_KV.put('item:' + it.id, JSON.stringify(it));
  }

  // Snapshot the week
  const week = isoWeek(new Date());
  const snapshot = await buildSnapshot(env, week, ranked, parsed.narrative || '');
  await env.BRAINDUMP_KV.put('snapshot:' + week, JSON.stringify(snapshot));
  const snapIdx = await readSnapshotIndex(env);
  if (!snapIdx.includes(week)) {
    snapIdx.unshift(week);
    await env.BRAINDUMP_KV.put('index:snapshots', JSON.stringify(snapIdx));
  }

  return json({ ok: true, week, ranked, narrative: parsed.narrative || '', snapshot }, 200, cors);
}

async function buildSnapshot(env, week, ranked, narrative) {
  const idx = await readIndex(env);
  let added = 0, done = 0, carriedIn = 0, archived = 0, openAtEnd = 0;
  const tagCounts = {};
  let effortSum = 0, effortN = 0;

  for (const entry of idx) {
    const raw = await env.BRAINDUMP_KV.get('item:' + entry.id);
    if (!raw) continue;
    const it = JSON.parse(raw);
    if (it.weekAdded === week)                              added++;
    if (it.status === 'done' && isoWeek(new Date(it.doneAt)) === week) done++;
    if (it.status === 'open' && it.weekAdded !== week)      carriedIn++;
    if (it.status === 'archived' && it.archivedAt && isoWeek(new Date(it.archivedAt)) === week) archived++;
    if (it.status === 'open')                               openAtEnd++;
    if (typeof it.effort === 'number')                      { effortSum += it.effort; effortN++; }
    for (const t of (it.tags || [])) tagCounts[t] = (tagCounts[t] || 0) + 1;
  }
  const topTags = Object.entries(tagCounts).sort((a, b) => b[1] - a[1]).slice(0, 6);

  return {
    week,
    snapshotAt: new Date().toISOString(),
    added, done, carriedIn, archived, openAtEnd,
    avgEffort: effortN ? Math.round(effortSum / effortN) : null,
    topTags,
    narrative,
    ranked: ranked.map(r => ({ id: r.id, priority: r.priority, reason: r.reason, bucket: r.bucket }))
  };
}

async function getDigest(env, cors) {
  const idx = await readSnapshotIndex(env);
  if (idx.length === 0) return json({ week: null, ranked: [], narrative: '' }, 200, cors);
  const raw = await env.BRAINDUMP_KV.get('snapshot:' + idx[0]);
  if (!raw) return json({ week: null, ranked: [], narrative: '' }, 200, cors);
  return json(JSON.parse(raw), 200, cors);
}

async function getAnalytics(env, cors) {
  const idx = await readSnapshotIndex(env);
  const weeks = [];
  for (const w of idx.slice(0, 26)) {
    const raw = await env.BRAINDUMP_KV.get('snapshot:' + w);
    if (raw) {
      const s = JSON.parse(raw);
      weeks.push({
        week: s.week,
        snapshotAt: s.snapshotAt,
        added: s.added, done: s.done,
        carriedIn: s.carriedIn, archived: s.archived,
        openAtEnd: s.openAtEnd,
        avgEffort: s.avgEffort,
        topTags: s.topTags,
        narrative: s.narrative
      });
    }
  }
  return json({ weeks }, 200, cors);
}

/* ---------- gmail sync ---------- */

async function syncGmail(env, cors) {
  if (!env.GMAIL_CLIENT_ID || !env.GMAIL_CLIENT_SECRET || !env.GMAIL_REFRESH_TOKEN) {
    return json({ error: 'gmail_not_configured' }, 500, cors);
  }
  const labelName = env.GMAIL_LABEL || 'brain-dump';
  const labelId = await gmail.getLabelId(env, labelName);
  if (!labelId) return json({ error: 'gmail_label_missing', label: labelName }, 400, cors);

  const stubs = await gmail.listMessagesByLabel(env, labelId, 25);
  if (stubs.length === 0) return json({ ok: true, imported: 0, skipped: 0, items: [] }, 200, cors);

  let imported = 0, skipped = 0;
  const newItems = [];

  for (const stub of stubs) {
    // Idempotency: skip if we've already imported this msgId
    const seen = await env.BRAINDUMP_KV.get('gmail:msg:' + stub.id);
    if (seen) { skipped++; continue; }

    const msg = await gmail.getMessage(env, stub.id);
    const subject = gmail.header(msg, 'Subject') || '(no subject)';
    const from    = gmail.header(msg, 'From') || '';
    const dateHdr = gmail.header(msg, 'Date') || '';
    const body    = gmail.topReply(gmail.extractPlainBody(msg));

    const id = newId();
    const now = new Date().toISOString();
    const content = body
      ? body.length > 1200 ? body.slice(0, 1200) + '…' : body
      : (msg.snippet || '').slice(0, 600);

    const item = {
      id,
      type: 'email',
      content,
      tags: ['email'],
      effort: null,
      hasImage: false,
      status: 'open',
      createdAt: now,
      weekAdded: isoWeek(new Date(now)),
      doneAt: null,
      archivedAt: null,
      carryCount: 0,
      priority: null,
      triageNote: null,
      triagedAt: null,
      source: 'gmail',
      gmailMsgId: stub.id,
      gmailThreadId: msg.threadId,
      from,
      subject,
      emailDate: dateHdr,
      repliedAt: null
    };

    await env.BRAINDUMP_KV.put('item:' + id, JSON.stringify(item));
    await env.BRAINDUMP_KV.put('gmail:msg:' + stub.id, id);
    newItems.push(item);
    imported++;

    // Remove the label so the same email doesn't re-import next sync
    try { await gmail.removeLabel(env, stub.id, labelId); } catch (e) { /* non-fatal */ }
  }

  if (newItems.length > 0) {
    const idx = await readIndex(env);
    for (const it of newItems) idx.unshift({ id: it.id, createdAt: it.createdAt });
    await writeIndex(env, idx);
  }

  return json({ ok: true, imported, skipped, items: newItems }, 200, cors);
}

async function checkReplies(env, cors) {
  if (!env.GMAIL_CLIENT_ID || !env.GMAIL_CLIENT_SECRET || !env.GMAIL_REFRESH_TOKEN) {
    return json({ error: 'gmail_not_configured' }, 500, cors);
  }
  const idx = await readIndex(env);
  const pending = [];
  for (const entry of idx) {
    const raw = await env.BRAINDUMP_KV.get('item:' + entry.id);
    if (!raw) continue;
    const it = JSON.parse(raw);
    if (it.source === 'gmail' && it.gmailThreadId && !it.repliedAt && it.status === 'open') {
      pending.push(it);
    }
  }
  if (pending.length === 0) return json({ ok: true, checked: 0, replied: 0 }, 200, cors);

  let replied = 0;
  const sentLabelId = await gmail.getLabelId(env, 'SENT'); // system label, may be null
  for (const it of pending) {
    try {
      const thread = await gmail.getThread(env, it.gmailThreadId);
      const messages = thread.messages || [];
      // A reply-from-me = a thread message whose labelIds includes "SENT" and whose
      // internalDate is after the original message's internalDate.
      const originalIdx = messages.findIndex(m => m.id === it.gmailMsgId);
      const lookAfter = originalIdx >= 0
        ? Number(messages[originalIdx].internalDate || 0)
        : new Date(it.createdAt).getTime();
      const reply = messages.find(m =>
        (m.labelIds || []).includes('SENT') &&
        Number(m.internalDate || 0) > lookAfter
      );
      if (reply) {
        it.repliedAt = new Date(Number(reply.internalDate || Date.now())).toISOString();
        await env.BRAINDUMP_KV.put('item:' + it.id, JSON.stringify(it));
        replied++;
      }
    } catch (e) {
      // Skip on per-item failure, don't fail the whole sweep
    }
  }
  return json({ ok: true, checked: pending.length, replied }, 200, cors);
}

/* ---------- helpers ---------- */

async function readIndex(env) {
  const raw = await env.BRAINDUMP_KV.get('index:items');
  return raw ? JSON.parse(raw) : [];
}
async function writeIndex(env, idx) {
  await env.BRAINDUMP_KV.put('index:items', JSON.stringify(idx));
}
async function readSnapshotIndex(env) {
  const raw = await env.BRAINDUMP_KV.get('index:snapshots');
  return raw ? JSON.parse(raw) : [];
}

function newId() {
  // Short URL-safe id, sorts roughly by time.
  const t = Date.now().toString(36);
  const r = crypto.getRandomValues(new Uint8Array(6));
  let s = '';
  for (const b of r) s += (b & 0x3f).toString(36);
  return t + '-' + s;
}

function isoWeek(d) {
  // YYYY-Www (ISO 8601 week)
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const dayNum = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  const week = Math.ceil((((date - yearStart) / 86400000) + 1) / 7);
  return date.getUTCFullYear() + '-W' + String(week).padStart(2, '0');
}

function daysSince(iso) {
  return Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);
}

function stripFences(s) {
  return s.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/, '').trim();
}

async function safeJson(request) {
  try {
    const text = await request.text();
    if (text.length > MAX_BODY_BYTES) return null;
    return JSON.parse(text);
  } catch { return null; }
}

function base64ToBytes(b64) {
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}
function bytesToBase64(bytes) {
  let bin = '';
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin);
}

function json(obj, status, cors) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { 'Content-Type': 'application/json', ...cors }
  });
}
