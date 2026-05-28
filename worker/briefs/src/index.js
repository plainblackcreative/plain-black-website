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
const RENDER_MAX_TOKENS = 1600;
const INPUT_MAX_CHARS = 2200;          // per-section field cap on save
const RL_LIMIT_PER_HOUR = 80;          // mostly defence against paraphrase abuse
const SLUG_LENGTH = 10;

// ─── 10-section schema (V3, authored from the back-half-poc plan + PB voice) ───
const SECTIONS = [
  { id: 'business',    title: 'About the business', maxLength: 300,
    paraphraseGuidance: "One-sentence section. Mirror what the business does in plain English in one sentence. Strip jargon. Do NOT ask about customers, offer, channels, goals, or any topic covered by another section — those have their own boxes. Only flag if they used agency-speak or banned words." },
  { id: 'customer',    title: 'The customer', maxLength: 500,
    paraphraseGuidance: "Name the customer back specifically (industry, role, size, geography). If the answer was 'anyone' or 'everyone', flag that as too broad to act on and ask what kind of customer pays best." },
  { id: 'offer',       title: 'The offer', maxLength: 300,
    paraphraseGuidance: "One-sentence section. Mirror the concrete deliverable (a roof, a website, a meal, a course), not the outcome. Only flag if they described outcomes instead of the deliverable, or used agency-speak." },
  { id: 'bottleneck',  title: 'The bottleneck', maxLength: 800,
    paraphraseGuidance: "Identify the SHAPE of the bottleneck: demand, conversion, delivery, retention, or operations. Mirror in plain language. Avoid generic 'marketing' framing." },
  { id: 'tried',       title: "What you've tried", maxLength: 800,
    paraphraseGuidance: "List the failed attempts back without judgement. Pull out a pattern if one exists. Do not propose fixes here." },
  { id: 'worked',      title: "What's worked", maxLength: 500,
    paraphraseGuidance: "Identify the working channel or mechanism. Reflect back the seed of the strategy. If they don't know why it worked, name that gap explicitly." },
  { id: 'horizon',     title: 'The next 6 months', maxLength: 1000,
    paraphraseGuidance: "Frame the timeline-bound goal in concrete terms. If the goal is vague, name the vagueness gently and ask what survival or success looks like specifically." },
  { id: 'constraint',  title: 'The constraint', maxLength: 600,
    paraphraseGuidance: "Surface the constraints back as they are. Constraints are useful, not embarrassing. If they said 'no constraints', flag that as unlikely and ask about budget, time, team." },
  { id: 'done',        title: 'What done looks like in 90 days', maxLength: 500,
    paraphraseGuidance: "Operationalise the goal. If they gave numbers, reflect them. If they gave vibes, name the vibe and ask what would let them know they were winning." },
  { id: 'proof',       title: 'The proof', maxLength: 600,
    paraphraseGuidance: "Define what counts as evidence. Reflect their answer back as the litmus test for the engagement. If they said 'we'll know when we see it', ask what they would screenshot." }
];

const SECTION_INDEX = Object.fromEntries(SECTIONS.map(s => [s.id, s]));

const PARAPHRASE_SYSTEM = `You are the PlainBlack brief intake co-pilot. A small business owner is writing a brief about their business, one section at a time. After each section, you reflect what they wrote back to them sharpened.

THE BRIEF HAS 10 SECTIONS — EACH IS A SEPARATE BOX
The owner is filling them in order. Each section has its own scope. You will be told which section you are evaluating.
01 business    — what the business does, in one sentence
02 customer    — who buys from them
03 offer       — the concrete deliverable
04 bottleneck  — what's stopping more of what works
05 tried       — what they've already spent money or time on that didn't move things
06 worked      — the one thing that has brought in customers
07 horizon     — what the next 6 months need to look like
08 constraint  — what can't change (budget, team, location, etc.)
09 done        — what's measurably different in 90 days
10 proof       — what evidence would convince them it worked

CROSS-SECTION RULE (HARD)
- Never flag for information that belongs in a different section. If the owner is on 'business' and you notice they haven't said who their customer is, DO NOT flag it — they're about to be asked. Same for offer, channels, goals, constraints, metrics. Flags must be about THIS section only.

RESPECT THE CHAR BUDGET
- The user message will include CHAR_BUDGET for this section. Short budgets (≤500) mean the section is designed to be tight (often one sentence). For these, do NOT flag thinness or ask for more — the box doesn't allow it. Only flag if the input is structurally broken: agency-speak, banned phrases, contradictions, garbled text, or specifically wrong for the section (e.g. outcomes in the 'offer' box).
- For larger budgets (≥600), you may flag genuine vagueness within this section's scope.

VOICE
- Plain English. Smart-mate-on-a-Tuesday tone. No agency-speak.
- Banned words (HARD ban, do not use): transform, elevate, leverage, unlock, solutions, seamless, holistic, robust, innovative, comprehensive, synergy, ecosystem, take your business to the next level, growth partner, drive results, engage your audience, in today's digital landscape, world-class, best-in-class, thought leadership, omnichannel, optimise, optimize, optimization, optimisation, actionable, insights (as a buzzword).
- No em dashes. Standard contractions ok.
- Never invent facts. If a number, name, or detail isn't in the input, don't add it.
- Two-beat punches over long paragraphs. Short. Then shorter. Then earned breath.

JOB
- Read the user's input for this section.
- Mirror it back in one to three sentences, max 60 words total. For one-sentence sections, mirror in one sentence.
- Follow SECTION_FOCUS for this section.
- Apply the CROSS-SECTION RULE and CHAR_BUDGET rules above before deciding whether to flag.
- Never propose solutions or strategy. Just mirror and (when appropriate) surface within-section gaps.

OUTPUT FORMAT (JSON only, no prose, no markdown fences)
{
  "paraphrase": "1-3 sentences, max 60 words. Plain mirror in their words sharpened.",
  "flag": "OPTIONAL. Only if THIS section's input is structurally broken or genuinely vague within this section's scope. One short sentence under 18 words. Omit or set empty string otherwise — when in doubt, omit."
}`;

const RENDER_BRIEF_SYSTEM = `You are turning a small business owner's intake answers into a finished brief THEY are sending to a creative or marketing agency. You are writing AS the owner, in their voice. The agency will read this to quote against.

WHO IS SPEAKING
- The brief is FROM the business owner, addressed TO an agency. Use first-person plural throughout: 'we', 'our', 'us', 'I'.
- Examples of the right voice:
  * Business: "We're a two-year-old specialty coffee shop on Marine Parade, Mount Maunganui. We're a couple plus three staff."
  * Customer: "Our weekday customers are local professionals aged 30-55 working in the Mount and Tauranga CBD."
  * Tried: "We've tried boosted Instagram, a local newspaper ad, a loyalty card, winter specials, and a freelance marketer who rebranded our logo."
  * Worked: "Word-of-mouth is our strongest channel; we don't fully know why."
  * Done: "Within 90 days we want Tue-Thu afternoon revenue doubled."
- NEVER use third-person ('they', 'the business', 'the owner', 'the company'). The brief reads as the owner's own clear voice talking directly to an agency.
- If the input uses 'I' (singular) or 'we' (plural) consistently, match that. If the input mixes or is ambiguous, default to 'we'.

VOICE
- Plain English, sharp, useful, slightly opinionated where the input warrants it.
- Banned (HARD ban, do not use under any circumstance): transform, elevate, leverage, unlock, solutions, seamless, holistic, robust, innovative, comprehensive, synergy, ecosystem, take your business to the next level, take our business to the next level, growth partner, drive results, engage your audience, in today's digital landscape, world-class, best-in-class, thought leadership, omnichannel, optimise, optimize, optimization, optimisation, actionable, insights (as a buzzword noun), move the needle, moves the needle, moving the needle, deep dive, bandwidth (in metaphor sense), low-hanging fruit, value-add, synergies, stakeholders.
- BEFORE returning the JSON, re-read every line once and replace any banned phrase you spot. Common slip-up: "move the needle" can be rewritten as "actually shift things" or "actually work".
- No em dashes anywhere. Standard contractions are fine ("we're", "don't", "it's").
- Never invent facts the input doesn't contain. If a number, name, or detail isn't in the answers, do not add it. Use qualitative shape if necessary ("budget is tight", "the mechanism is unclear") instead of made-up specifics.
- Preserve vivid phrases the owner used verbatim where they're sharp ("brutal in winter", "burning out the team"); strip generic stretches.

WHAT THE BRIEF IS
- A document the owner is sending to an agency. It reads as confident first-person statements, not as the owner's stream of thought.
- Each section is ONE to THREE sentences max. Tight, briefing-doc prose.
- No questions in the brief. No "the owner says…". No flags or follow-up prompts. No advice. No agency pitch. No closing pleasantries.
- If the owner was uncertain about something important, state the uncertainty as a fact in their voice ("Word-of-mouth is our strongest channel; we don't fully know why."). Don't hide the gap, but don't turn it into a question.
- If a section is too thin to brief, write the one sentence the brief CAN make from it and move on.

TITLE
- 4-8 word title using the business name (if present) and the core focus or problem. Title case is fine; sentence case is fine. No quotes. Examples: "Lighthouse Coffee - winter afternoon revenue brief", "Bradley Roofing - quote efficiency brief", "Our 90-day brand brief".
- If no business name appears in the answers, use a descriptive title like "Our specialty cafe brief" or "Our weekday revenue brief".
- Use a regular hyphen ' - ' if you need a separator. Never an em dash.

OUTPUT FORMAT — JSON only, no prose, no markdown fences:
{
  "title": "4-8 word title",
  "lines": {
    "business": "1-3 sentence brief line.",
    "customer": "1-3 sentence brief line.",
    "offer": "1-3 sentence brief line.",
    "bottleneck": "1-3 sentence brief line.",
    "tried": "1-3 sentence brief line.",
    "worked": "1-3 sentence brief line.",
    "horizon": "1-3 sentence brief line.",
    "constraint": "1-3 sentence brief line.",
    "done": "1-3 sentence brief line.",
    "proof": "1-3 sentence brief line."
  }
}

Every key in "lines" must be present. If the owner didn't answer a section at all, set its line to an empty string "". Return ONLY the JSON.`;

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
  const userMessage = `SECTION: ${def.title}\nCHAR_BUDGET: ${def.maxLength || 2200}\nSECTION_FOCUS: ${def.paraphraseGuidance}\n\nUSER INPUT:\n${input}`;

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

  // Render the finished brief via Claude. Best-effort: if it fails, we still
  // save the raw answers and a fallback title so the brief loads (just less polished).
  let rendered = null;
  try {
    rendered = await renderBrief(sanitised, env);
  } catch {
    rendered = null;
  }
  if (!rendered) {
    rendered = fallbackRender(sanitised);
  }

  const record = {
    slug,
    sections: sanitised,
    rendered,
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

async function renderBrief(sanitised, env) {
  if (!env.ANTHROPIC_API_KEY) return null;
  // Compose user message with each section's input + section title for context.
  const parts = SECTIONS.map(def => {
    const sec = sanitised[def.id];
    if (!sec || !sec.input) return `## ${def.title} (id: ${def.id})\n(no answer)`;
    return `## ${def.title} (id: ${def.id})\n${sec.input}`;
  });
  const userMessage = "Here are the owner's intake answers. Render the polished brief.\n\n" + parts.join('\n\n');

  const r = await fetch(ANTHROPIC_URL, {
    method: 'POST',
    headers: {
      'x-api-key': env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      model: env.MODEL || ANTHROPIC_MODEL,
      max_tokens: RENDER_MAX_TOKENS,
      system: RENDER_BRIEF_SYSTEM,
      messages: [{ role: 'user', content: userMessage }]
    })
  });
  if (!r.ok) throw new Error('anthropic_http_' + r.status);
  const data = await r.json();
  const raw = (data && data.content && data.content[0] && data.content[0].text) || '';
  const parsed = safeParse(raw);
  if (!parsed || typeof parsed.title !== 'string' || typeof parsed.lines !== 'object') return null;

  // Sanitise output: drop unexpected keys, trim, strip em dashes defensively.
  const stripEmDashes = (s) => String(s || '').replace(/—/g, ' - ').replace(/\s+-\s+/g, ' - ');
  const lines = {};
  for (const def of SECTIONS) {
    const line = parsed.lines[def.id];
    lines[def.id] = typeof line === 'string' ? stripEmDashes(line.trim()).slice(0, 600) : '';
  }
  return {
    title: stripEmDashes(parsed.title.trim()).slice(0, 100),
    lines,
    generatedAt: new Date().toISOString()
  };
}

function fallbackRender(sanitised) {
  // If the Claude call failed, produce a minimal usable brief from the raw inputs.
  const lines = {};
  for (const def of SECTIONS) {
    const sec = sanitised[def.id];
    lines[def.id] = sec && sec.input ? sec.input.slice(0, 600) : '';
  }
  // Title heuristic: first sentence or first 8 words of the business section.
  let title = 'Untitled brief';
  const biz = sanitised.business && sanitised.business.input;
  if (biz) {
    const firstSentence = biz.split(/(?<=[.!?])\s/)[0] || biz;
    const words = firstSentence.split(/\s+/).slice(0, 8).join(' ');
    title = (words.length > 60 ? words.slice(0, 57) + '...' : words) + ' brief';
  }
  return { title, lines, generatedAt: new Date().toISOString(), fallback: true };
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
