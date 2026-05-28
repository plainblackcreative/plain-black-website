// PlainBlack briefs worker — backs the "Get A Brief, Not A Quote" tool.
// Stores intake answers in KV, paraphrases sections via Claude Haiku, serves
// briefs by slug for the public render page.
//
// Endpoints
//   GET  /health                       -> {ok:true}
//   POST /paraphrase  {section, input} -> {ok, paraphrase, flag?}
//   POST /save        {sections, slug?}-> {ok, slug}
//   GET  /:slug                        -> {ok, sections, createdAt, updatedAt}

const ANTHROPIC_URL   = 'https://api.anthropic.com/v1/messages';
const ANTHROPIC_MODEL = 'claude-haiku-4-5';
const PARAPHRASE_MAX_TOKENS = 240;
const INPUT_MAX_CHARS = 2200;          // per-section field cap on save
const RL_LIMIT_PER_HOUR = 80;          // mostly defence against paraphrase abuse
const SLUG_LENGTH = 10;

// ─── 10-section schema (V3, authored from the back-half-poc plan + PB voice) ───
const SECTIONS = [
  { id: 'business',    title: 'About the business',
    paraphraseGuidance: "Strip jargon. Reflect back what they actually sell in plain English, in one sentence. Name the specific thing. If they wrote agency-speak, mirror the cleaner version without inventing facts." },
  { id: 'customer',    title: 'The customer',
    paraphraseGuidance: "Name the customer back specifically (industry, role, size, geography). If the answer was 'anyone' or 'everyone', flag that as too broad to act on and ask what kind of customer pays best." },
  { id: 'offer',       title: 'The offer',
    paraphraseGuidance: "Reflect the offer back as the concrete deliverable (a roof, a website, a meal, a course), not the outcome. If they only described outcomes, ask what the actual thing they deliver is." },
  { id: 'bottleneck',  title: 'The bottleneck',
    paraphraseGuidance: "Identify the SHAPE of the bottleneck: demand, conversion, delivery, retention, or operations. Mirror in plain language. Avoid generic 'marketing' framing." },
  { id: 'tried',       title: "What you've tried",
    paraphraseGuidance: "List the failed attempts back without judgement. Pull out a pattern if one exists. Do not propose fixes here." },
  { id: 'worked',      title: "What's worked",
    paraphraseGuidance: "Identify the working channel or mechanism. Reflect back the seed of the strategy. If they don't know why it worked, name that gap explicitly." },
  { id: 'horizon',     title: 'The next 6 months',
    paraphraseGuidance: "Frame the timeline-bound goal in concrete terms. If the goal is vague, name the vagueness gently and ask what survival or success looks like specifically." },
  { id: 'constraint',  title: 'The constraint',
    paraphraseGuidance: "Surface the constraints back as they are. Constraints are useful, not embarrassing. If they said 'no constraints', flag that as unlikely and ask about budget, time, team." },
  { id: 'done',        title: 'What done looks like in 90 days',
    paraphraseGuidance: "Operationalise the goal. If they gave numbers, reflect them. If they gave vibes, name the vibe and ask what would let them know they were winning." },
  { id: 'proof',       title: 'The proof',
    paraphraseGuidance: "Define what counts as evidence. Reflect their answer back as the litmus test for the engagement. If they said 'we'll know when we see it', ask what they would screenshot." }
];

const SECTION_INDEX = Object.fromEntries(SECTIONS.map(s => [s.id, s]));

const PARAPHRASE_SYSTEM = `You are the PlainBlack brief intake co-pilot. A small business owner is writing a brief about their business, one section at a time. After each section, you reflect what they wrote back to them sharpened.

VOICE
- Plain English. Smart-mate-on-a-Tuesday tone. No agency-speak.
- Banned words (HARD ban, do not use): transform, elevate, leverage, unlock, solutions, seamless, holistic, robust, innovative, comprehensive, synergy, ecosystem, take your business to the next level, growth partner, drive results, engage your audience, in today's digital landscape, world-class, best-in-class, thought leadership, omnichannel, optimise, optimize, optimization, optimisation, actionable, insights (as a buzzword).
- No em dashes. Standard contractions ok.
- Never invent facts. If a number, name, or detail isn't in the input, don't add it.
- Two-beat punches over long paragraphs. Short. Then shorter. Then earned breath.

JOB
- Read the user's input for this section.
- Mirror it back in one to three sentences, max 60 words total.
- If their input was vague, generic, or used banned phrases, sharpen the mirror AND flag the gap honestly (e.g. "You said 'anyone'. That's too broad to act on — who pays best?").
- Section-specific guidance is provided below in SECTION_FOCUS — follow it.
- Never propose solutions or strategy. Just mirror and surface gaps.

OUTPUT FORMAT (JSON only, no prose, no markdown fences)
{
  "paraphrase": "1-3 sentences, max 60 words. Plain mirror in their words sharpened.",
  "flag": "OPTIONAL. If the input was vague/generic/missing something important, one short sentence naming the gap (under 18 words). Omit or set empty string if the input was specific enough."
}`;

export default {
  async fetch(request, env) {
    const allowedOrigins = (env.ALLOWED_ORIGINS || '*').split(',').map(s => s.trim());
    const origin = request.headers.get('Origin') || '';
    const allowOrigin =
      allowedOrigins.includes('*') ? '*' :
      allowedOrigins.includes(origin) ? origin : allowedOrigins[0];

    const cors = {
      'Access-Control-Allow-Origin': allowOrigin,
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400',
      'Vary': 'Origin'
    };

    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });

    const url = new URL(request.url);
    const path = url.pathname.replace(/\/+$/, '') || '/';

    if (path === '/health') return json({ ok: true }, 200, cors);

    // Rate limit (per-IP, rolling 1h)
    const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
    const rlKey = 'rl:briefs:' + ip;
    if (env.BRIEFS_KV) {
      const used = Number(await env.BRIEFS_KV.get(rlKey)) || 0;
      if (used >= RL_LIMIT_PER_HOUR) {
        return json({ ok: false, error: 'rate_limited' }, 429, cors);
      }
      // We bump the counter ONLY on paraphrase + save (not on GET reads)
    }

    if (path === '/paraphrase' && request.method === 'POST') {
      return paraphrase(request, env, cors);
    }
    if (path === '/save' && request.method === 'POST') {
      return saveBrief(request, env, cors);
    }
    if (request.method === 'GET' && /^\/[A-Za-z0-9_-]{6,16}$/.test(path)) {
      return getBrief(path.slice(1), env, cors);
    }

    return json({ ok: false, error: 'not_found' }, 404, cors);
  }
};

async function paraphrase(request, env, cors) {
  if (!env.ANTHROPIC_API_KEY) return json({ ok: false, error: 'server_misconfigured' }, 500, cors);
  let body;
  try { body = await request.json(); } catch { return json({ ok: false, error: 'bad_json' }, 400, cors); }
  const sectionId = String(body && body.section || '').trim();
  const input = String(body && body.input || '').slice(0, INPUT_MAX_CHARS).trim();
  if (!sectionId || !SECTION_INDEX[sectionId]) return json({ ok: false, error: 'bad_section' }, 400, cors);
  if (input.length < 8) return json({ ok: false, error: 'input_too_short' }, 400, cors);

  const def = SECTION_INDEX[sectionId];
  const userMessage = `SECTION: ${def.title}\nSECTION_FOCUS: ${def.paraphraseGuidance}\n\nUSER INPUT:\n${input}`;

  try {
    const r = await fetch(ANTHROPIC_URL, {
      method: 'POST',
      headers: {
        'x-api-key': env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        model: env.MODEL || ANTHROPIC_MODEL,
        max_tokens: PARAPHRASE_MAX_TOKENS,
        system: PARAPHRASE_SYSTEM,
        messages: [{ role: 'user', content: userMessage }]
      })
    });
    if (!r.ok) return json({ ok: false, error: 'upstream_error' }, 502, cors);
    const data = await r.json();
    const raw = (data && data.content && data.content[0] && data.content[0].text) || '';
    const parsed = safeParse(raw);
    if (!parsed || typeof parsed.paraphrase !== 'string') return json({ ok: false, error: 'parse_error' }, 502, cors);

    // Bump rate limiter only on success
    if (env.BRIEFS_KV) {
      const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
      const rlKey = 'rl:briefs:' + ip;
      const used = Number(await env.BRIEFS_KV.get(rlKey)) || 0;
      await env.BRIEFS_KV.put(rlKey, String(used + 1), { expirationTtl: 3600 });
    }

    return json({
      ok: true,
      paraphrase: parsed.paraphrase.trim().slice(0, 400),
      flag: typeof parsed.flag === 'string' ? parsed.flag.trim().slice(0, 180) : ''
    }, 200, cors);
  } catch {
    return json({ ok: false, error: 'fetch_failed' }, 502, cors);
  }
}

async function saveBrief(request, env, cors) {
  let body;
  try { body = await request.json(); } catch { return json({ ok: false, error: 'bad_json' }, 400, cors); }
  const sections = body && typeof body.sections === 'object' ? body.sections : null;
  if (!sections) return json({ ok: false, error: 'bad_payload' }, 400, cors);

  // Validate + sanitise sections
  const sanitised = {};
  let charTotal = 0;
  for (const def of SECTIONS) {
    const raw = sections[def.id];
    if (raw && typeof raw.input === 'string') {
      const input = raw.input.slice(0, INPUT_MAX_CHARS).trim();
      const paraphrase = (typeof raw.paraphrase === 'string') ? raw.paraphrase.slice(0, 400).trim() : '';
      const flag = (typeof raw.flag === 'string') ? raw.flag.slice(0, 180).trim() : '';
      if (input) {
        sanitised[def.id] = { input, paraphrase, flag };
        charTotal += input.length;
      }
    }
  }
  if (Object.keys(sanitised).length < 3) return json({ ok: false, error: 'too_short' }, 400, cors);
  if (charTotal > 25_000) return json({ ok: false, error: 'too_long' }, 413, cors);

  // Slug: reuse if provided + exists; else generate fresh.
  let slug = String(body.slug || '').trim();
  if (slug && !/^[A-Za-z0-9_-]{6,16}$/.test(slug)) slug = '';
  let existing = null;
  if (slug) {
    const cur = await env.BRIEFS_KV.get('brief:' + slug);
    if (cur) existing = JSON.parse(cur);
  }
  if (!slug) slug = randomSlug();

  // Optional headline metadata
  const meta = {
    headline: (body.headline && String(body.headline).trim().slice(0, 80)) || '',
    submittedBy: (body.submittedBy && String(body.submittedBy).trim().slice(0, 60)) || ''
  };

  const record = {
    slug,
    sections: sanitised,
    headline: meta.headline,
    submittedBy: meta.submittedBy,
    createdAt: existing ? existing.createdAt : new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  await env.BRIEFS_KV.put('brief:' + slug, JSON.stringify(record), { expirationTtl: 60 * 60 * 24 * 365 });

  // Bump rate limit
  const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
  const rlKey = 'rl:briefs:' + ip;
  const used = Number(await env.BRIEFS_KV.get(rlKey)) || 0;
  await env.BRIEFS_KV.put(rlKey, String(used + 1), { expirationTtl: 3600 });

  return json({ ok: true, slug }, 200, cors);
}

async function getBrief(slug, env, cors) {
  if (!env.BRIEFS_KV) return json({ ok: false, error: 'server_misconfigured' }, 500, cors);
  const raw = await env.BRIEFS_KV.get('brief:' + slug);
  if (!raw) return json({ ok: false, error: 'not_found' }, 404, cors);
  try {
    const record = JSON.parse(raw);
    return json({ ok: true, ...record, schema: SECTIONS }, 200, cors);
  } catch {
    return json({ ok: false, error: 'parse_error' }, 500, cors);
  }
}

function randomSlug() {
  // URL-safe random slug of SLUG_LENGTH characters (62-char alphabet)
  const alpha = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
  const buf = new Uint8Array(SLUG_LENGTH);
  crypto.getRandomValues(buf);
  let out = '';
  for (let i = 0; i < SLUG_LENGTH; i++) out += alpha[buf[i] % alpha.length];
  return out;
}

function safeParse(text) {
  if (!text) return null;
  const cleaned = text.trim().replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/i, '').trim();
  try { return JSON.parse(cleaned); } catch {}
  const m = cleaned.match(/\{[\s\S]*\}/);
  if (!m) return null;
  try { return JSON.parse(m[0]); } catch { return null; }
}

function json(obj, status, cors) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { 'Content-Type': 'application/json', ...cors }
  });
}
