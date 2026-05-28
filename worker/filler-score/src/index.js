// PlainBlack filler-score worker — scrapes a target URL and returns the
// visible text so the /filler-score page can run its banned-phrase analysis
// client-side. No Anthropic dependency. No data storage beyond rate-limit KV.
//
// POST /scan  { url } -> { ok: true, finalUrl, title, h1s, h2s, bodyText, wordCount }
//                       { ok: false, error: 'rate_limited' | 'bad_url' | 'fetch_failed' | 'not_html' }

const HTML_FETCH_TIMEOUT_MS = 8000;
const HTML_MAX_BYTES = 1_500_000;
const BODY_TEXT_MAX_CHARS = 8000; // first ~1200 words is plenty for above-the-fold analysis
const RL_LIMIT_PER_HOUR = 60;
const ANTHROPIC_URL = 'https://api.anthropic.com/v1/messages';
const ANTHROPIC_MODEL = 'claude-haiku-4-5';
const ANTHROPIC_MAX_TOKENS = 220;

const READER_PROMPT = `You are a stranger who just landed on a website and gave it 10 seconds. You do NOT recognise the brand. Pretend you've never heard of them.

Read the title, headline, and excerpt below. Answer ONE question:
"What does this business do, who is it specifically for, and what makes them different? In plain English, in one sentence."

Rules:
- Judge the PAGE TEXT only. Do not give credit for famous brand recognition.
- If the page is sharp and specific, your sentence is sharp and specific. If the page is vague, your sentence reflects that — leave gaps the page leaves.
- Never invent specifics the page doesn't claim.
- "anyone", "businesses", "teams", "everyone", "all sizes" do NOT count as a named audience.

OUTPUT FORMAT — return JSON only, no preamble:
{
  "takeaway": "One sentence, max 28 words. No agency-speak. No transform, elevate, leverage, unlock, solutions, seamless, holistic, robust, innovative, comprehensive, synergy, ecosystem, take your business to the next level. Plain language only.",
  "clarity": "one of: sharp | fine | vague | mush"
}

clarity scale — be strict, most homepages score 'fine' or 'vague':
- sharp = all three are SPECIFICALLY named on the page: WHAT they sell, WHO it's for (a named industry, role, size band, or geography — not "businesses"), and ONE concrete hook (price, feature, proof point, or differentiator with detail)
- fine = WHAT is specifically named + EITHER who-for OR a concrete hook, but not both
- vague = WHAT is generic but identifiable (e.g. "CRM platform", "marketing agency"), audience and hook are missing or generic
- mush = even WHAT is generic ("solutions", "platform", "experiences", "growth"), or the page is pure agency-speak with no concrete offer

Return ONLY the JSON. No explanation.`;

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
    if (request.method !== 'POST') return json({ ok: false, error: 'method_not_allowed' }, 405, cors);
    if (url.pathname !== '/scan') return json({ ok: false, error: 'not_found' }, 404, cors);

    // Per-IP rate limit (rolling 1h window) — defence against scrape abuse.
    const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
    const rlKey = 'rl:filler:' + ip;
    let used = 0;
    if (env.FILLER_KV) {
      const recent = await env.FILLER_KV.get(rlKey);
      used = recent ? Number(recent) : 0;
      if (used >= RL_LIMIT_PER_HOUR) {
        return json({ ok: false, error: 'rate_limited', retry_after: 3600 }, 429, cors);
      }
    }

    let body;
    try { body = await request.json(); }
    catch { return json({ ok: false, error: 'bad_json' }, 400, cors); }

    const targetUrl = sanitizeUrl(body && body.url);
    if (!targetUrl) return json({ ok: false, error: 'bad_url' }, 400, cors);

    let scrape;
    try {
      scrape = await scrapePage(targetUrl);
    } catch (e) {
      return json({ ok: false, error: 'fetch_failed', detail: String(e && e.message || e) }, 502, cors);
    }
    if (!scrape) return json({ ok: false, error: 'not_html' }, 415, cors);

    // Reader takeaway (LLM). Best-effort — if it fails, we still return the scrape.
    let reader = null;
    if (env.ANTHROPIC_API_KEY) {
      try {
        reader = await fetchReaderTakeaway(scrape, env);
      } catch (e) {
        // Swallow; the scrape result is still useful on its own.
        reader = null;
      }
    }

    if (env.FILLER_KV) {
      await env.FILLER_KV.put(rlKey, String(used + 1), { expirationTtl: 3600 });
    }

    return json({ ok: true, ...scrape, reader }, 200, cors);
  }
};

async function fetchReaderTakeaway(scrape, env) {
  const title = scrape.title || '';
  const h1 = (scrape.h1s && scrape.h1s[0]) || '';
  const h2s = (scrape.h2s || []).slice(0, 5).join(' / ');
  const body = (scrape.bodyText || '').slice(0, 2500); // keep prompt cheap
  const userMessage = [
    `Title: ${title || '(none)'}`,
    `H1: ${h1 || '(none)'}`,
    h2s ? `H2s: ${h2s}` : '',
    `Body excerpt:`,
    body || '(empty)'
  ].filter(Boolean).join('\n');

  const r = await fetch(ANTHROPIC_URL, {
    method: 'POST',
    headers: {
      'x-api-key': env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      model: env.MODEL || ANTHROPIC_MODEL,
      max_tokens: ANTHROPIC_MAX_TOKENS,
      system: READER_PROMPT,
      messages: [{ role: 'user', content: userMessage }]
    })
  });
  if (!r.ok) throw new Error('anthropic_http_' + r.status);
  const data = await r.json();
  const raw = (data && data.content && data.content[0] && data.content[0].text) || '';
  const parsed = safeParseReader(raw);
  if (!parsed) return null;
  return {
    takeaway: typeof parsed.takeaway === 'string' ? parsed.takeaway.trim() : null,
    clarity: ['sharp','fine','vague','mush'].includes(parsed.clarity) ? parsed.clarity : null
  };
}

function safeParseReader(text) {
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

function sanitizeUrl(input) {
  if (!input) return null;
  let s = String(input).trim();
  if (!s) return null;
  if (!/^https?:\/\//i.test(s)) s = 'https://' + s;
  try {
    const u = new URL(s);
    if (u.protocol !== 'http:' && u.protocol !== 'https:') return null;
    const host = u.hostname.toLowerCase();
    if (host === 'localhost' || host.endsWith('.localhost')) return null;
    if (host.startsWith('127.') || host.startsWith('10.') || host.startsWith('192.168.') || host === '::1' || host === '0.0.0.0') return null;
    return u.toString();
  } catch { return null; }
}

async function scrapePage(scanUrl) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), HTML_FETCH_TIMEOUT_MS);
  let r;
  try {
    r = await fetch(scanUrl, {
      method: 'GET',
      redirect: 'follow',
      signal: controller.signal,
      headers: {
        'User-Agent': 'PlainBlack-FillerScore/1.0 (+https://www.plainblackcreative.com/filler-score)',
        'Accept': 'text/html,application/xhtml+xml'
      }
    });
  } finally { clearTimeout(timeoutId); }

  if (!r.ok) throw new Error('http_' + r.status);
  const ct = (r.headers.get('content-type') || '').toLowerCase();
  if (!ct.includes('text/html')) return null;

  const reader = r.body.getReader();
  let received = 0;
  const chunks = [];
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    received += value.length;
    if (received > HTML_MAX_BYTES) break;
    chunks.push(value);
  }
  const buf = new Uint8Array(received);
  let offset = 0;
  for (const c of chunks) { buf.set(c, offset); offset += c.length; }
  const html = new TextDecoder('utf-8', { fatal: false }).decode(buf);
  return extract(html, r.url || scanUrl);
}

function extract(html, finalUrl) {
  const get = (re) => { const m = html.match(re); return m ? m[1].trim() : null; };

  const rawTitle = get(/<title[^>]*>([\s\S]*?)<\/title>/i);
  const title = rawTitle ? decodeEntities(rawTitle).replace(/\s+/g, ' ').trim() : null;

  const h1s = matchAll(html, /<h1\b[^>]*>([\s\S]*?)<\/h1>/gi).map(textOnly).filter(Boolean).slice(0, 5);
  const h2s = matchAll(html, /<h2\b[^>]*>([\s\S]*?)<\/h2>/gi).map(textOnly).filter(Boolean).slice(0, 15);

  // Visible body text extraction.
  // Strategy: if the page has a <main> element, score JUST that (semantic HTML5).
  // Otherwise fall back to <body> with chrome stripped.
  // We deliberately do NOT strip <header> — many sites wrap the hero block in
  // <header class="hero-..."> and that headline + subhead is exactly what we need.
  // We DO strip <nav> and <footer>.
  let source = html;
  const mainMatch = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i);
  if (mainMatch && mainMatch[1].length > 200) {
    source = mainMatch[1];
  }
  let cleaned = source
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, ' ')
    .replace(/<nav\b[\s\S]*?<\/nav>/gi, ' ')
    .replace(/<footer\b[\s\S]*?<\/footer>/gi, ' ')
    // Strip <header> blocks that contain a <nav> — those are site navs.
    // Keep <header> blocks that are hero containers (no nav inside).
    .replace(/<header\b[\s\S]*?<\/header>/gi, (m) => /<nav\b/i.test(m) ? ' ' : m);

  // Convert block tags to newlines so word/sentence boundaries survive
  cleaned = cleaned
    .replace(/<(?:p|div|section|li|h[1-6]|br|tr|td)\b[^>]*>/gi, '\n')
    .replace(/<\/(?:p|div|section|li|h[1-6]|tr|td)>/gi, '\n')
    .replace(/<[^>]+>/g, ' ');

  cleaned = decodeEntities(cleaned)
    .replace(/[ \t\f\v]+/g, ' ')
    .replace(/\n\s*\n+/g, '\n\n')
    .trim();

  const bodyText = cleaned.slice(0, BODY_TEXT_MAX_CHARS);
  const wordCount = bodyText ? bodyText.split(/\s+/).filter(Boolean).length : 0;

  return { finalUrl, title, h1s, h2s, bodyText, wordCount };
}

function textOnly(html) {
  return decodeEntities(html.replace(/<[^>]+>/g, ' '))
    .replace(/\s+/g, ' ')
    .trim();
}

function matchAll(s, re) {
  const out = [];
  let m;
  while ((m = re.exec(s)) !== null) {
    out.push(m[1]);
    if (out.length > 50) break;
  }
  return out;
}

function decodeEntities(s) {
  if (!s) return '';
  return s
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&nbsp;/gi, ' ')
    .replace(/&mdash;/gi, '—')
    .replace(/&ndash;/gi, '–')
    .replace(/&hellip;/gi, '…')
    .replace(/&rsquo;|&lsquo;/gi, "'")
    .replace(/&ldquo;|&rdquo;/gi, '"')
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&[a-z]+;/gi, ' ');
}
