// pb-microsuite — single worker, six endpoints for Days 22-27 of the 30-day
// build challenge. Shared Anthropic key, shared rate limiter, per-tool prompts.

const ANTHROPIC_URL   = 'https://api.anthropic.com/v1/messages';
const ANTHROPIC_MODEL = 'claude-haiku-4-5';
const MAX_TOKENS      = 1800;
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
  },

  // ─── Day 23 — The Polite Exit Generator ──────────────────────────
  exit: {
    system: `You are PlainBlack's polite-exit drafter. A small business owner needs to end a relationship: a client, an agency, a SaaS subscription, or a partnership. They've told you which, what the situation is, what pushback they expect, and what tone they want. Your job: hand back THREE artefacts they can copy-paste straight into Gmail or a calendar app.

${VOICE_RULES}

THE FOUR TONES
The owner picks one. Honour it precisely.
- "clean" = Clean and firm. Short, no hedging, no apology, no sentiment. Two paragraphs max. Ends with a clear cancellation/effective date if relevant. The professional equivalent of closing a door without slamming it.
- "friendly" = Friendly but final. Warm opener (one line), genuine thanks, then the clear decision and the timeline. No reopening the door, no "let's stay in touch" if the owner didn't say so.
- "billing" = "I need this gone before it starts billing me again." Urgent-but-civil. Names the renewal/billing risk explicitly. Asks for written confirmation of cancellation. Practical, not hostile.
- "nuclear" = Nuclear, but still legally boring. No insults, no personal jabs. Lawyer-safe language. States what's ending, on what date, that obligations are met or not. Polite chill that makes clear there's no further conversation to have.

THE FOUR RELATIONSHIP TYPES
Adjust the framing and the legal/practical specifics for each.
- "client" = an owner ending a client engagement (not the other way around). The owner is the supplier; the client is the buyer. Common reasons: scope creep, bad-fit, payment slowness, draining the team.
- "agency" = an owner ending an agency they hired. The owner is the buyer; the agency is the supplier. Common reasons: not delivering, retainer drift, no measurable outcome, lock-in tactics.
- "saas" = an owner cancelling a software subscription. May involve auto-renewal, billing cycles, contract terms. Often a date-sensitive cancellation window matters.
- "partnership" = an owner ending a co-marketing, referral, or joint-venture-style partnership. Less contractually rigid, more relational. Often needs more care with mutual contacts.

NEVER invent facts the input doesn't contain. No dates, no dollar amounts, no names of people or companies that weren't given. If the input is vague about a date, use placeholder language like "[insert date]" so the owner fills it in. Do not say "as discussed" if no prior discussion was mentioned.

THE THREE ARTEFACTS
1. exitEmail — the email the owner sends today. Subject line + body. Include the subject line on the first line in the format "Subject: <line>" then a blank line then the body. 50-180 words of body. Greeting fits the tone. Sign-off is "[Your name]" so the owner pastes their name.

2. followUpEmail — the email the owner sends IF the other party pushes back. Same Subject:/body format. Anticipate the kind of pushback the owner described. If they didn't describe any, anticipate the standard one for that relationship type and tone. 50-150 words. Don't reopen the original decision; restate it once and clarify the practical next step.

3. calendarReminder — a short 1-3 line reminder note for the owner's calendar, with a one-line title and a one-line body. Format as "Title: <line>" then a blank line then the body. If the relationship is a SaaS subscription, lock the reminder a few days BEFORE the next billing cycle (use "[insert renewal date - 5 days]" if no date given). If it's a client/agency/partnership, lock the reminder to the agreed end date or 2 weeks out as a "check it stuck" prompt.

OUTPUT — JSON only, no markdown fences, no preamble:
{
  "exitEmail": "string (Subject: ...\\n\\nBody...)",
  "followUpEmail": "string (Subject: ...\\n\\nBody...)",
  "calendarReminder": "string (Title: ...\\n\\nBody...)"
}`,
    userMessage: (body) => {
      const TYPE_LABEL = {
        client: 'CLIENT (the owner is ending a client engagement)',
        agency: 'AGENCY (the owner is firing an agency they hired)',
        saas: 'SaaS SUBSCRIPTION (the owner is cancelling a software subscription)',
        partnership: 'PARTNERSHIP (the owner is ending a co-marketing or referral partnership)'
      };
      const TONE_LABEL = {
        clean: 'CLEAN AND FIRM',
        friendly: 'FRIENDLY BUT FINAL',
        billing: '"I NEED THIS GONE BEFORE IT STARTS BILLING ME AGAIN" (urgent-but-civil)',
        nuclear: 'NUCLEAR, BUT STILL LEGALLY BORING'
      };
      const rel = String(body.relationshipType || '').trim();
      const tone = String(body.tone || '').trim();
      const situation = String(body.situation || '').slice(0, 1200).trim();
      const pushback = String(body.pushback || '').slice(0, 800).trim();
      return [
        `RELATIONSHIP TYPE: ${TYPE_LABEL[rel] || '(missing or invalid)'}`,
        `TONE: ${TONE_LABEL[tone] || '(missing or invalid)'}`,
        '',
        'THE SITUATION (in the owner\'s words):',
        situation || '(not given)',
        '',
        pushback ? 'EXPECTED PUSHBACK FROM THE OTHER SIDE:' : 'EXPECTED PUSHBACK: (not specified — use the standard one for this relationship + tone)',
        pushback || ''
      ].filter(Boolean).join('\n');
    },
    validate: (parsed) => {
      if (!parsed || typeof parsed !== 'object') return null;
      const keys = ['exitEmail', 'followUpEmail', 'calendarReminder'];
      const out = {};
      for (const k of keys) {
        if (typeof parsed[k] !== 'string' || !parsed[k].trim()) return null;
        // Cap each artefact at a reasonable size and strip stray em dashes defensively.
        out[k] = parsed[k].trim().replace(/—/g, ' - ').slice(0, 2000);
      }
      return out;
    }
  },

  // ─── Day 24 — The Contact Form Bouncer ───────────────────────────
  bouncer: {
    system: `You are PlainBlack's Contact Form Bouncer drafter. A small business owner is tired of contact-form spam, time-wasters, price shoppers, and the wrong-fit leads who consume hours of quoting time and never buy. They want a short pre-qualifier sitting BEFORE their main contact form. Three questions, four answers each. Friendly enough that real customers fly through. Sharp enough that bad-fit leads either self-select out or get redirected to something useful instead of clogging the inbox.

${VOICE_RULES}

THE TONE OF THE FILTER ITSELF
- The bouncer is the friendly one at the door, not the angry one. Customers should not feel judged.
- Question phrasing is conversational. "What's your situation?" not "Please indicate which option best describes...".
- Bad-fit answers get redirected to a useful next step (a free resource, a link, a different kind of help), NOT just shut down. Friction with kindness.
- Never insult the customer. Never imply they're cheap. Never suggest "you can't afford us".

THE THREE QUESTIONS
Each question is conversational, short (under 70 chars). Each has FOUR multi-choice answers (under 60 chars each), scored 0-3 where 3 = perfect fit and 0 = clearest mismatch.

- Question 1 covers STAGE OR READINESS — what they're trying to do, how far along they are. ("Where are you at with this?")
- Question 2 covers SCALE OR SCOPE — budget, timeline, team size, project size, whichever variable matches the bad-lead pattern the owner described.
- Question 3 covers a SPECIFIC bad-fit pattern the owner described. If they said they're sick of tyre-kickers, ask the question that catches tyre-kickers. If they said price shoppers, ask the question that catches price shoppers. If they said wrong-industry leads, ask the question that catches industry.

For each option give:
- text: the answer label (under 60 chars). Plain language, no jargon.
- score: 0, 1, 2, or 3.
- redirect: ONE short sentence. ALWAYS PRESENT for score 0 and score 1 options — points the bad-fit lead at a useful next step ("Sounds like you need [free thing], try [generic url type]" or "We're probably not the right fit, try a [different service type]"). Optional for score 2 (a soft "if you go with us, here's what to expect" line). Empty string for score 3 (perfect fit, no redirect needed).

Do not invent specific URLs, brand names, or competitor names. Use placeholder phrasing like "search for [thing]" or "look for a [type of provider]". The owner will swap in their own links if they want.

THE COPY-PASTE HTML
A semantic HTML form block the owner can drop into any form builder (Webflow, WordPress, Squarespace, Carrd, plain HTML). Rules:
- Pure HTML. No CSS classes, no frameworks, no JS.
- Each question is a <fieldset> with <legend>, four <label>+<input type="radio"> pairs.
- Each radio's name is "q1" / "q2" / "q3"; values are "0" / "1" / "2" / "3".
- Wrap everything in <form id="bouncer">.
- Include a brief introductory <p> at the top in friendly tone.
- Do NOT include the actual contact form fields — this is just the bouncer that decides whether to reveal them.
- Include a final submit button labeled "Continue" (the owner can wire it up to reveal the real form).
- Keep total under 2000 chars.

OUTPUT — JSON only, no markdown fences, no preamble:
{
  "summary": "One short sentence: what this filter is built to catch.",
  "questions": [
    {
      "text": "Question text",
      "options": [
        { "text": "Option text", "score": 3, "redirect": "" },
        { "text": "Option text", "score": 2, "redirect": "" },
        { "text": "Option text", "score": 1, "redirect": "Short redirect line" },
        { "text": "Option text", "score": 0, "redirect": "Short redirect line" }
      ]
    },
    { "text": "...", "options": [...4 same shape] },
    { "text": "...", "options": [...4 same shape] }
  ],
  "html": "<form id=\\"bouncer\\">...</form>"
}

EXACTLY three questions. EXACTLY four options per question. EXACTLY one option per question scoring 3 (perfect fit). At least one option per question scoring 0 or 1 with a non-empty redirect line. Return ONLY the JSON.`,
    userMessage: (body) => {
      const business = String(body.business || '').slice(0, 1500).trim();
      const badLeadType = String(body.badLeadType || '').slice(0, 1500).trim();
      return [
        'BUSINESS (what they do, who their good customers are):',
        business || '(not given)',
        '',
        'THE WRONG-FIT LEADS THEY KEEP GETTING (what they want to filter out):',
        badLeadType || '(not given)'
      ].join('\n');
    },
    validate: (parsed) => {
      if (!parsed || typeof parsed !== 'object') return null;
      if (typeof parsed.summary !== 'string' || !parsed.summary.trim()) return null;
      if (!Array.isArray(parsed.questions) || parsed.questions.length !== 3) return null;
      // Defensive em-dash strip — the brand voice doc bans them but the model slips.
      const cleanDash = (s) => String(s || '').replace(/—/g, ' - ').replace(/–/g, '-').replace(/\s{2,}/g, ' ').trim();
      const outQuestions = [];
      for (const q of parsed.questions) {
        if (!q || typeof q.text !== 'string' || !Array.isArray(q.options) || q.options.length !== 4) return null;
        const outOptions = [];
        for (const o of q.options) {
          if (!o || typeof o.text !== 'string' || typeof o.score !== 'number') return null;
          const score = Math.max(0, Math.min(3, Math.round(o.score)));
          outOptions.push({
            text: cleanDash(o.text).slice(0, 120),
            score,
            redirect: cleanDash(typeof o.redirect === 'string' ? o.redirect : '').slice(0, 200)
          });
        }
        outQuestions.push({ text: cleanDash(q.text).slice(0, 200), options: outOptions });
      }
      const html = typeof parsed.html === 'string' ? cleanDash(parsed.html).slice(0, 4000) : '';
      if (!html.toLowerCase().includes('<form')) return null;
      return {
        summary: cleanDash(parsed.summary).slice(0, 240),
        questions: outQuestions,
        html
      };
    }
  }

  // Days 25-27 endpoints get added here as they ship.
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
