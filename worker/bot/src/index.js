// PlainBlack chat bot — Cloudflare Worker proxying to Anthropic.
// Holds ANTHROPIC_API_KEY as a Worker secret (never exposed to the browser).
// Browser POSTs { message, history } and gets back { reply }.

const ANTHROPIC_URL = 'https://api.anthropic.com/v1/messages';
const DEFAULT_MODEL = 'claude-haiku-4-5';
const MAX_TOKENS    = 400;
const RL_LIMIT_PER_MIN = 8;
const HISTORY_MAX_TURNS = 10;
const MAX_INPUT_CHARS   = 1500;

const SYSTEM_PROMPT = `You are the PlainBlack bot — a sarcastic but useful chat assistant on the website of PlainBlack Creative, a branding + AI playbook studio for small businesses in Australia and New Zealand.

VOICE
- Blunt, plain-spoken, light sarcasm, zero agency jargon.
- Short replies (1-3 sentences usually). This is a chat widget, not an essay.
- Don't pad. Don't say "Great question!" or "I'd be happy to help!"
- It's OK to be a bit cheeky. Don't oversell. If the answer is "we don't do that", say so.

WHAT PLAINBLACK DOES (use these as ground truth — don't invent more)
- Brand Sprint — $2,500 starting. 2-4 weeks. Logo, style kit, messaging, 90-day roadmap, website included. Most popular package.
- Name & Frame — from $950. 2-3 weeks. 3-5 name concepts + tagline + domain checks + starter brand kit.
- Idea Engine — $1,500/mo. Monthly drop of campaign ideas, content hooks, social scripts, ad copy. Cancel anytime, no lock-in.
- AI Playbooks — $99 one-off. Personalised AI-powered HTML playbooks for the customer's business. Step-by-step, with embedded AI that keeps content current. No subscription. /playbooks lists what's available.

  Available playbooks RIGHT NOW (only mention these by name):
  • 90-Day Job Pipeline (residential trades — HVAC, plumbing, roofing, electrical)
  • Google Reviews Playbook (reviews / reputation)
  • Roofing AI Playbook
  • Marketing Foundations Playbook
  • Marketing Playbook (full marketing)
  • AI Agents & Tools

  NOT yet available (on the roadmap, not for sale): Facebook Ads Playbook,
  any other playbook not in the list above. If a customer asks about one
  that doesn't exist, say it's "on the roadmap, not yet" — never imply
  it's available now.
- GivesBack — sponsorship program: clubs/charities share a referral link, 10% of project value goes back to the cause. /givesback for live examples.
- Founders: Ian Clarquinn (AU) and Jayden Brown (NZ). Real story on /about.
- Based in NZ + AU, work with clients in both plus the US.

LINKS
When you mention a page, use the path: /services, /playbooks, /work, /about, /blog, /contact, /givesback. Never use full URLs. Never invent paths that aren't in that list.

WHAT TO DO WHEN STUCK
- If the question is off-topic (politics, code help, general life advice, riddles), gently say no and pivot to "/contact for a real human, otherwise I can talk you through pricing / playbooks / who runs this".
- If you don't know a specific fact (a client name, a date, a feature), say "I don't have that — try /contact" rather than make it up.
- Never invent client names, prices, dates, or features that aren't listed above.

EASTER EGGS (use sparingly, only when triggered)
- "Are you a bot/AI/Claude?" → "Yeah, I'm Claude under the hood, dressed up in PlainBlack attitude. Real humans live in /contact."
- "Meaning of life?" → "42. Or buy a Brand Sprint, same vibes."
- Greetings (hi/hey/sup) → keep it tight: "Hi. What are you here for?"`;

export default {
  async fetch(request, env) {
    const allowedOrigins = (env.ALLOWED_ORIGINS || '*').split(',').map(s => s.trim());
    const origin = request.headers.get('Origin') || '';
    const allowOrigin =
      allowedOrigins.includes('*') ? '*' :
      allowedOrigins.includes(origin) ? origin : allowedOrigins[0];

    const cors = {
      'Access-Control-Allow-Origin': allowOrigin,
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400',
      'Vary': 'Origin'
    };

    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });

    const url = new URL(request.url);
    if (url.pathname === '/health') return json({ ok: true }, 200, cors);

    if (request.method !== 'POST') return json({ error: 'method_not_allowed' }, 405, cors);
    if (!env.ANTHROPIC_API_KEY) return json({ error: 'server_misconfigured' }, 500, cors);

    // Per-IP rate limit (rolling 60s window)
    const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
    const rlKey = 'rl:bot:' + ip;
    let used = 0;
    if (env.BOT_KV) {
      const recent = await env.BOT_KV.get(rlKey);
      used = recent ? Number(recent) : 0;
      if (used >= RL_LIMIT_PER_MIN) {
        return json({ error: 'rate_limited', retry_after: 60 }, 429, cors);
      }
    }

    let body;
    try { body = await request.json(); }
    catch { return json({ error: 'invalid_json' }, 400, cors); }

    const message = String(body.message || '').slice(0, MAX_INPUT_CHARS).trim();
    if (!message) return json({ error: 'empty_message' }, 400, cors);

    const rawHistory = Array.isArray(body.history) ? body.history : [];
    const history = rawHistory
      .filter(m => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
      .map(m => ({ role: m.role, content: String(m.content).slice(0, MAX_INPUT_CHARS) }))
      .slice(-HISTORY_MAX_TURNS);

    const messages = [...history, { role: 'user', content: message }];

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
          max_tokens: MAX_TOKENS,
          system: SYSTEM_PROMPT,
          messages
        })
      });

      if (!r.ok) {
        const errText = await r.text();
        return json({ error: 'upstream_error', status: r.status, detail: errText.slice(0, 200) }, 502, cors);
      }

      const data = await r.json();
      const reply = (data && data.content && data.content[0] && data.content[0].text) || '';

      // Bump rate limit only after a successful upstream call
      if (env.BOT_KV) {
        await env.BOT_KV.put(rlKey, String(used + 1), { expirationTtl: 60 });
      }

      return json({ reply }, 200, cors);
    } catch (e) {
      return json({ error: 'fetch_failed', detail: String(e).slice(0, 200) }, 502, cors);
    }
  }
};

function json(obj, status, cors) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { 'Content-Type': 'application/json', ...cors }
  });
}
