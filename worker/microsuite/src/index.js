// pb-microsuite — single worker, six endpoints for Days 22-27 of the 30-day
// build challenge. Shared Anthropic key, shared rate limiter, per-tool prompts.

const ANTHROPIC_URL   = 'https://api.anthropic.com/v1/messages';
const ANTHROPIC_MODEL = 'claude-haiku-4-5';
const MAX_TOKENS      = 1200;
const INPUT_MAX_CHARS = 4000;
const RL_LIMIT_PER_HOUR = 60;
const ANTHROPIC_TIMEOUT_MS = 12000;

// ─── Shared voice rules baked into every system prompt ───────────────
const VOICE_RULES = `VOICE
- Plain English, sharp, useful, slightly opinionated where the input warrants it. Smart-mate-on-a-Tuesday energy, not LinkedIn coach.
- Banned (HARD ban, do not use anywhere): transform, elevate, leverage, unlock, solutions, seamless, holistic, robust, innovative, comprehensive, synergy, ecosystem, take your business to the next level, growth partner, drive results, engage your audience, in today's digital landscape, world-class, best-in-class, thought leadership, omnichannel, optimise, optimize, optimization, optimisation, actionable, insights (as a buzzword noun), move the needle, moves the needle, moving the needle, deep dive, low-hanging fruit, value-add, stakeholders, synergies, supercharge, ROI-driven.
- No em dashes anywhere. Standard contractions are fine ("we're", "don't", "it's").
- Never invent facts the input doesn't contain. If a number, name, or detail isn't in the answers, do not add it. Use qualitative shape if necessary ("budget is tight", "the mechanism is unclear") instead of made-up specifics.
- Two-beat structure for punches. Short, then shorter, then a longer line that earns the breath.
- Direct, anti-corporate, slightly Aussie/Kiwi. Address the reader as "you", not "users", not "the business owner".
- The reader is a small business owner. Not a founder. Not an enterprise leader. A small business owner — trades, hospo, services, retail.`;

// ─── Tool registry. Each tool: system prompt + user-message builder + a
//    validator that confirms the returned JSON has the right shape.
const TOOLS = {

  // ─── Day 22 — The Do This Today Card ─────────────────────────────
  today: {
    system: `You are PlainBlack's morning action coach. A small business owner has just opened the page at 7am. They've told you their cash situation, the thing pissing them off most right now, and the next material event coming up. Your job: return ONE card with five specific actions, designed to be screenshotted and held to during the day.

${VOICE_RULES}

THE CARD HAS FIVE FIELDS. Each is one sentence (max 22 words). All five must read like they belong on the same card — same voice, same energy.

1. todaysHighestImpactMove — the ONE thing that, if done today, makes the most difference given their inputs. Be specific. If their cash situation is tight, the move is revenue-focused. If a material event is coming, the move serves that event.

2. theThingToStopDoing — the activity they're probably doing today that's not helping. Honest. Not generic ("stop scrolling LinkedIn"); pull from their actual inputs ("Stop refreshing the inbox waiting for replies — chase the 3 you haven't sent yet").

3. theUncomfortableTruth — the thing they don't want to hear about their situation. ONE sentence. Land it, then move on. Don't moralise. ("The 'biggest annoyance' is annoying because you've been avoiding it for three weeks.")

4. theTwentyMinuteVersion — what to do RIGHT NOW if they only have 20 minutes. A concrete, finishable task. Verb first. ("Open the spreadsheet. List every unpaid invoice. Send the chase email to the oldest three.")

5. theTwoHourVersion — the same job done properly. A 2-hour block that closes the loop. ("Block 2-4pm. Call the three slowest payers. Have your bank balance and last invoice open. Don't end the call without a date.")

The five fields should be CONSISTENT — the 20-min and 2-hour are versions of the same action, not different actions. The "thing to stop doing" should free up the time for the "20-min version".

OUTPUT — JSON only, no markdown fences, no preamble:
{
  "todaysHighestImpactMove": "string",
  "theThingToStopDoing": "string",
  "theUncomfortableTruth": "string",
  "theTwentyMinuteVersion": "string",
  "theTwoHourVersion": "string"
}`,
    userMessage: (body) => {
      const cash = String(body.cash || '').trim();
      const annoyance = String(body.annoyance || '').slice(0, 800).trim();
      const event = String(body.event || '').slice(0, 800).trim();
      return [
        `CASH SITUATION: ${cash || '(not given)'}`,
        '',
        `BIGGEST ANNOYANCE RIGHT NOW:`,
        annoyance || '(not given)',
        '',
        `NEXT MATERIAL EVENT:`,
        event || '(not given)'
      ].join('\n');
    },
    validate: (parsed) => {
      if (!parsed || typeof parsed !== 'object') return null;
      const keys = ['todaysHighestImpactMove', 'theThingToStopDoing', 'theUncomfortableTruth', 'theTwentyMinuteVersion', 'theTwoHourVersion'];
      const out = {};
      for (const k of keys) {
        if (typeof parsed[k] !== 'string' || !parsed[k].trim()) return null;
        out[k] = parsed[k].trim().slice(0, 300);
      }
      return out;
    }
  }

  // Days 23-27 endpoints get added here as they ship.
};

export default {
  async fetch(request, env) {
    const allowedOrigins = (env.ALLOWED_ORIGINS || '*').split(',').map(s => s.trim());
    const origin = request.headers.get('Origin') || '';
    const allowOrigin =
      allowedOrigins.includes('*') ? '*' :
      allowedOrigins.includes(origin) ? origin : allowedOrigins[0];

    const cors = {
      'Access-Control-Allow-Origin': allowOrigin,
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400',
      'Vary': 'Origin'
    };

    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });

    const url = new URL(request.url);
    const path = url.pathname.replace(/\/+$/, '') || '/';

    if (path === '/health') return json({ ok: true }, 200, cors);
    if (request.method !== 'POST') return json({ ok: false, error: 'method_not_allowed' }, 405, cors);

    const toolName = path.slice(1);
    const tool = TOOLS[toolName];
    if (!tool) return json({ ok: false, error: 'unknown_tool' }, 404, cors);

    if (!env.ANTHROPIC_API_KEY) return json({ ok: false, error: 'server_misconfigured' }, 500, cors);

    // Per-IP rate limit (rolling 1h, endpoint-agnostic)
    const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
    const rlKey = 'rl:microsuite:' + ip;
    if (env.MICRO_KV) {
      const used = Number(await env.MICRO_KV.get(rlKey)) || 0;
      if (used >= RL_LIMIT_PER_HOUR) {
        return json({ ok: false, error: 'rate_limited', retry_after: 3600 }, 429, cors);
      }
    }

    let body;
    try { body = await request.json(); }
    catch { return json({ ok: false, error: 'bad_json' }, 400, cors); }

    // Total input size check
    const totalChars = JSON.stringify(body || {}).length;
    if (totalChars > INPUT_MAX_CHARS) {
      return json({ ok: false, error: 'input_too_long' }, 413, cors);
    }

    const userMessage = tool.userMessage(body);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), ANTHROPIC_TIMEOUT_MS);
      let r;
      try {
        r = await fetch(ANTHROPIC_URL, {
          method: 'POST',
          headers: {
            'x-api-key': env.ANTHROPIC_API_KEY,
            'anthropic-version': '2023-06-01',
            'content-type': 'application/json'
          },
          signal: controller.signal,
          body: JSON.stringify({
            model: env.MODEL || ANTHROPIC_MODEL,
            max_tokens: MAX_TOKENS,
            system: tool.system,
            messages: [{ role: 'user', content: userMessage }]
          })
        });
      } finally { clearTimeout(timeoutId); }

      if (!r.ok) return json({ ok: false, error: 'upstream_error', status: r.status }, 502, cors);

      const data = await r.json();
      const raw = (data && data.content && data.content[0] && data.content[0].text) || '';
      const parsed = safeParse(raw);
      const validated = parsed ? tool.validate(parsed) : null;
      if (!validated) return json({ ok: false, error: 'parse_error' }, 502, cors);

      // Bump rate counter only on successful response
      if (env.MICRO_KV) {
        const used = Number(await env.MICRO_KV.get(rlKey)) || 0;
        await env.MICRO_KV.put(rlKey, String(used + 1), { expirationTtl: 3600 });
      }

      return json({ ok: true, ...validated }, 200, cors);
    } catch (e) {
      const aborted = e && e.name === 'AbortError';
      return json({ ok: false, error: aborted ? 'timeout' : 'fetch_failed' }, 502, cors);
    }
  }
};

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
