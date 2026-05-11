// PlainBlack triage worker — "Why Isn't This Working?"
// Cloudflare Worker proxying to Anthropic. Holds ANTHROPIC_API_KEY as a secret.
// Browser POSTs the diagnostic payload, worker returns a structured JSON diagnosis.
//
// Phase 1 scanning: if a scanUrl is provided, runs PageSpeed Insights (Lighthouse)
// + a lightweight HTML scrape in parallel and folds the findings into the prompt
// so the diagnosis is data-grounded, not just self-report-grounded.

const ANTHROPIC_URL = 'https://api.anthropic.com/v1/messages';
const DEFAULT_MODEL = 'claude-haiku-4-5';
const MAX_TOKENS    = 1600;
const RL_LIMIT_PER_HOUR = 10;
const MAX_FREEFORM_CHARS = 1500;
const PSI_ENDPOINT = 'https://www.googleapis.com/pagespeedonline/v5/runPagespeed';
const HTML_FETCH_TIMEOUT_MS = 8000;
const HTML_MAX_BYTES = 1_500_000;

// ─── Human-readable expansions for the chip codes the frontend sends ───
const CHANNELS = {
  website:  'Their website',
  ads:      'A paid ad campaign (Meta / Google / etc.)',
  video:    'A brand or marketing video',
  social:   'Organic social media posting',
  ai:       'An AI tool for content / marketing',
  content:  'A content calendar / content plan',
  seo:      'SEO work',
  gbp:      'Google Business Profile / Google Reviews',
  email:    'Email or newsletter marketing',
  other:    'Some other marketing channel'
};
const OUTCOMES = {
  'nothing-changed':         'Nothing changed after the effort',
  'looks-good-no-enquiries': 'It looks good but produces no enquiries',
  'views-no-action':         'Plenty of views, but no action',
  'dont-get-what-we-do':     "People still don't understand what they do",
  'told-spend-more':         'They\'re being told to "spend more on ads"',
  'explain-everything':      'They still have to explain everything in person',
  'promising-then-died':     'It felt promising at first, then died',
  'wrong-people':            'The wrong people are showing up'
};
const SOURCES = {
  agency:    'Paid an agency to do it',
  freelancer:'Paid a freelancer',
  tool:      'Used a tool / software',
  diy:       'Did it themselves',
  'in-house':'Their team did it in-house',
  organic:   'Organic effort, no money spent'
};
const TRIED = {
  'spent-more':         'Spent more money on it',
  'changed-messaging':  'Changed the messaging',
  'different-platform': 'Tried a different platform',
  'asked-advice':       'Asked for advice',
  'rebuilt':            'Rebuilt or redesigned it',
  'course-tool':        'Bought a course or another tool',
  'waited':             'Just waited it out',
  'not-yet':            "Hasn't tried fixing it yet"
};

const SYSTEM_PROMPT = `You are the PlainBlack marketing triage tool called "Why Isn't This Working?".

A small business owner has told you what they tried, what happened, what they've already done to fix it, and (optionally) what they were hoping for. They may have ALSO provided a URL we scanned — if so, you'll see real Lighthouse scores and page data labelled SCAN. Use the scan data to make the diagnosis specific and undeniable. Cite numbers from it where it sharpens the point.

Your job is to identify the most likely BROKEN BIT before they spend more money fixing the wrong thing.

You are not doing a full audit. You are triaging. You are identifying the most likely SHAPE of the problem and the first useful next move.

VOICE
- Plainspoken, sharp, useful, commercially grounded, slightly irreverent when it sharpens the point.
- No corporate language. No agency mush. No motivational fluff.
- Banned words and phrases: "unlock", "elevate", "leverage", "digital landscape", "growth partner", "tailored solution", "high-converting", "synergy", "best-in-class", "innovative", "cutting-edge", "game-changer".
- Never say "post consistently" or "boost engagement" without naming the mechanism.
- The business owner is NEVER the punchline. Bad marketing advice, vague websites, broken funnels, generic content, and AI slop CAN be the punchline.
- Use "probably" / "likely" / "usually" where appropriate when reasoning from self-report. When citing the SCAN data, you can be direct ("Your LCP is 4.2s. Half your visitors are gone before the page paints.").

OUTPUT RULES
- Return JSON ONLY. No prose before or after. No markdown code fences. No commentary.
- Keep every text field tight. No section over 45 words (lists count each item, not the whole list).
- Do NOT invent facts about the business that you don't have evidence for (no fake revenue, ad spend, customer counts, locations, or industries).
- WHEN SCAN DATA IS PRESENT: cite specific numbers, missing elements, or scores. That's the whole point.
- If the input is vague AND no scan was provided, name the SHAPE of the issue honestly.
- Lists must be concrete and useful. No generic platitudes.
- Match the diagnosis to the actual channel + source + outcome they described.

CONTRACT (return EXACTLY this shape)
{
  "diagnosisHeadline": "Short, blunt one-line diagnosis (under 9 words). Title case-ish, sentence-shaped. Example: 'You bought execution before clarity.'",
  "diagnosisBody": "1-2 sentences (max 40 words) explaining the likely shape of the problem in plain language. Reference what they actually did, not the abstract category. If scan data is present, ground at least one claim in a real number from it.",
  "whatsHappening": ["3-5 short bullets, each under 14 words, describing the pattern under the symptom. Cite scan data where relevant."],
  "whyItFeelsBroken": ["3-5 short bullets, each under 14 words, explaining why the effort doesn't move the needle for THEM."],
  "whatToDoNext": ["3-5 short, concrete actions, each under 14 words. Verbs first. Specific, not generic. If scan data is present, the top 2 actions should fix the worst scan findings."],
  "badAdvice": "One line naming the lazy default advice they'll hear if they don't fix this first. Under 18 words.",
  "dontBuyNext": ["3-4 SHORT items (1-4 words each) — things they should NOT buy until the core issue is fixed. Example: 'more content', 'more ads', 'another redesign'."],
  "dontBuyNextWhy": "One sentence (max 22 words) explaining why more of the same costs more and moves them less.",
  "nextMove": "1-2 sentences (max 40 words) — one concrete first action they can take in the next 48 hours. If scan data is present, make this point at the single biggest finding.",
  "plainBlackWouldBuild": "1 sentence (max 25 words) describing what PlainBlack would build for them around this fix (without hard-selling).",
  "confidence": "low | medium | high — your honest read. If scan data is present, confidence should be at least 'medium'.",
  "tags": ["2-5 short kebab-case tags from this set ONLY: clarity, offer-market-fit, wrong-traffic, no-next-step, message-mismatch, conversion-leak, audience-mismatch, attribution-issue, ai-thinking-layer, content-without-point, channel-fatigue, performance-issue, accessibility-issue, seo-issue"]
}

Return ONLY that JSON. Nothing else.`;

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

    // Per-IP rate limit (rolling 1h window)
    const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
    const rlKey = 'rl:triage:' + ip;
    let used = 0;
    if (env.TRIAGE_KV) {
      const recent = await env.TRIAGE_KV.get(rlKey);
      used = recent ? Number(recent) : 0;
      if (used >= RL_LIMIT_PER_HOUR) {
        return json({ error: 'rate_limited', retry_after: 3600 }, 429, cors);
      }
    }

    let body;
    try { body = await request.json(); }
    catch { return json({ error: 'invalid_json' }, 400, cors); }

    // ─── Validate + normalise payload ───
    const channel = String(body.channel || '').trim();
    if (!channel || !CHANNELS[channel]) return json({ error: 'invalid_channel' }, 400, cors);

    const outcomes = Array.isArray(body.outcomes) ? body.outcomes.filter(o => OUTCOMES[o]) : [];
    if (outcomes.length === 0) return json({ error: 'missing_outcomes' }, 400, cors);

    const sources = Array.isArray(body.sources) ? body.sources.filter(s => SOURCES[s]) : [];
    const tried = Array.isArray(body.tried) ? body.tried.filter(t => TRIED[t]) : [];
    const freeform = String(body.freeform || '').slice(0, MAX_FREEFORM_CHARS).trim();
    const scanUrl = sanitizeUrl(body.scanUrl);

    // ─── If scanUrl provided, run Lighthouse + page scrape in parallel ───
    let scanSummary = '';
    let scanReport = null;
    if (scanUrl) {
      const [psiResult, pageResult] = await Promise.allSettled([
        runPageSpeed(scanUrl, env.PAGESPEED_API_KEY),
        scrapePage(scanUrl)
      ]);
      const psi  = psiResult.status === 'fulfilled' ? psiResult.value : null;
      const page = pageResult.status === 'fulfilled' ? pageResult.value : null;
      scanReport = { scanUrl, lighthouse: psi, page };
      scanSummary = formatScanForPrompt(scanUrl, psi, page);
    }

    // ─── Compose the human-readable triage report for Claude ───
    const userMessage = [
      `CHANNEL — ${CHANNELS[channel]}`,
      `WHAT HAPPENED — ${outcomes.map(o => OUTCOMES[o]).join('; ')}`,
      sources.length ? `HOW IT GOT MADE — ${sources.map(s => SOURCES[s]).join('; ')}` : 'HOW IT GOT MADE — not specified',
      tried.length   ? `WHAT THEY\'VE ALREADY TRIED — ${tried.map(t => TRIED[t]).join('; ')}` : "WHAT THEY'VE ALREADY TRIED — nothing yet",
      freeform ? `IN THEIR OWN WORDS — ${freeform}` : 'IN THEIR OWN WORDS — (no extra context provided)',
      scanSummary ? `\n${scanSummary}` : ''
    ].filter(Boolean).join('\n');

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
          messages: [{ role: 'user', content: userMessage }]
        })
      });

      if (!r.ok) {
        const errText = await r.text();
        return json({ error: 'upstream_error', status: r.status, detail: errText.slice(0, 200) }, 502, cors);
      }

      const data = await r.json();
      const raw = (data && data.content && data.content[0] && data.content[0].text) || '';

      const parsed = safeParse(raw);
      if (!parsed) return json({ error: 'parse_failed', raw: raw.slice(0, 400) }, 502, cors);

      // Echo the scan back so the frontend can show what it found
      if (scanReport) parsed.scan = scanReport;

      // Bump rate limit only after a successful + valid response
      if (env.TRIAGE_KV) {
        await env.TRIAGE_KV.put(rlKey, String(used + 1), { expirationTtl: 3600 });
      }

      return json(parsed, 200, cors);
    } catch (e) {
      return json({ error: 'fetch_failed', detail: String(e).slice(0, 200) }, 502, cors);
    }
  }
};

// ═══════════════════════════════════════════════════════════════════════════
// Scan helpers
// ═══════════════════════════════════════════════════════════════════════════

function sanitizeUrl(input){
  if (!input) return null;
  let s = String(input).trim();
  if (!s) return null;
  if (!/^https?:\/\//i.test(s)) s = 'https://' + s;
  try {
    const u = new URL(s);
    if (u.protocol !== 'http:' && u.protocol !== 'https:') return null;
    // Block localhost / loopback / private suffixes (defence-in-depth; the public APIs reject these too)
    const host = u.hostname.toLowerCase();
    if (host === 'localhost' || host.endsWith('.localhost')) return null;
    if (host.startsWith('127.') || host.startsWith('10.') || host.startsWith('192.168.') || host === '::1') return null;
    if (host === '0.0.0.0') return null;
    return u.toString();
  } catch { return null; }
}

async function runPageSpeed(scanUrl, apiKey){
  const params = new URLSearchParams({
    url: scanUrl,
    strategy: 'mobile'
  });
  // Multiple category params, not a single comma-joined value
  for (const cat of ['performance', 'accessibility', 'seo', 'best-practices']) {
    params.append('category', cat);
  }
  if (apiKey) params.set('key', apiKey);

  const psiUrl = `${PSI_ENDPOINT}?${params.toString()}`;
  const r = await fetch(psiUrl);
  if (!r.ok) throw new Error('psi_http_' + r.status);
  const data = await r.json();

  const cat = (data.lighthouseResult && data.lighthouseResult.categories) || {};
  const audits = (data.lighthouseResult && data.lighthouseResult.audits) || {};

  const pct = (c) => (c && typeof c.score === 'number') ? Math.round(c.score * 100) : null;
  const scores = {
    performance:   pct(cat.performance),
    accessibility: pct(cat.accessibility),
    seo:           pct(cat.seo),
    bestPractices: pct(cat['best-practices'])
  };

  const metric = (id) => {
    const a = audits[id];
    if (!a) return null;
    return { display: a.displayValue || null, numeric: a.numericValue || null };
  };

  const metrics = {
    lcp: metric('largest-contentful-paint'),
    cls: metric('cumulative-layout-shift'),
    fcp: metric('first-contentful-paint'),
    tbt: metric('total-blocking-time'),
    si:  metric('speed-index'),
    tti: metric('interactive')
  };

  // Pull the top opportunities by potential time saving
  const opportunities = Object.values(audits)
    .filter(a => a && a.details && a.details.type === 'opportunity' && typeof a.numericValue === 'number' && a.numericValue > 100)
    .sort((a, b) => (b.numericValue || 0) - (a.numericValue || 0))
    .slice(0, 5)
    .map(a => ({
      id: a.id,
      title: a.title,
      saving: a.displayValue || ((a.numericValue / 1000).toFixed(1) + 's')
    }));

  // Failing audits that aren't opportunities (best-practices / a11y / seo failures)
  const failedAudits = Object.values(audits)
    .filter(a => a && typeof a.score === 'number' && a.score < 0.9 && (!a.details || a.details.type !== 'opportunity'))
    .slice(0, 6)
    .map(a => ({ id: a.id, title: a.title, score: Math.round((a.score || 0) * 100) }));

  return { scores, metrics, opportunities, failedAudits };
}

async function scrapePage(scanUrl){
  // Fetch with a hard timeout + size cap
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), HTML_FETCH_TIMEOUT_MS);
  let r;
  try {
    r = await fetch(scanUrl, {
      method: 'GET',
      redirect: 'follow',
      signal: controller.signal,
      headers: {
        'User-Agent': 'PlainBlack-Triage/1.0 (+https://www.plainblackcreative.com)',
        'Accept': 'text/html,application/xhtml+xml'
      }
    });
  } finally { clearTimeout(timeoutId); }

  if (!r.ok) throw new Error('scrape_http_' + r.status);
  const ct = (r.headers.get('content-type') || '').toLowerCase();
  if (!ct.includes('text/html')) throw new Error('scrape_not_html');

  // Read with a size cap so we don't OOM the worker on weird responses
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

  return extractPageSignals(html, r.url || scanUrl);
}

function extractPageSignals(html, finalUrl){
  // Tiny regex-based extraction. HTMLRewriter could be cleaner but adds complexity
  // and for a one-page scrape regex is fine.
  const lower = html.toLowerCase();

  const get = (re) => { const m = html.match(re); return m ? m[1].trim() : null; };
  const getAttr = (tag, attr) => {
    const re = new RegExp(`<${tag}[^>]*\\s${attr}\\s*=\\s*["']([^"']+)["'][^>]*>`, 'i');
    return get(re);
  };

  const title = get(/<title[^>]*>([\s\S]*?)<\/title>/i);
  const metaDescMatch = html.match(/<meta[^>]+name\s*=\s*["']description["'][^>]*content\s*=\s*["']([^"']+)["'][^>]*>/i)
                    || html.match(/<meta[^>]+content\s*=\s*["']([^"']+)["'][^>]*name\s*=\s*["']description["'][^>]*>/i);
  const metaDescription = metaDescMatch ? metaDescMatch[1].trim() : null;

  const ogTitle = getAttr('meta[^>]*property\\s*=\\s*["\']og:title["\']', 'content');
  const canonical = getAttr('link[^>]*rel\\s*=\\s*["\']canonical["\']', 'href');

  // H1 count + first H1 text
  const h1Matches = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/gi) || [];
  const h1Count = h1Matches.length;
  const firstH1 = h1Matches[0]
    ? h1Matches[0].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim().slice(0, 200)
    : null;

  // Word count (rough — strip tags and entities, then count)
  const visibleText = html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-z]+;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  const wordCount = visibleText ? visibleText.split(/\s+/).length : 0;

  // Form presence
  const hasForm = /<form\b/i.test(html);

  // CTA detection — find link/button text that looks transactional
  const ctaWords = /\b(get|book|start|try|join|buy|order|request|contact|call|schedule|sign\s?up|find\s?out|learn\s?more|see\s?more|download)\b/i;
  const linkTextMatches = [];
  const linkRe = /<a\b[^>]*>([\s\S]*?)<\/a>/gi;
  let lm;
  while ((lm = linkRe.exec(html)) !== null && linkTextMatches.length < 200) {
    const text = lm[1].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
    if (text && text.length < 80) linkTextMatches.push(text);
  }
  const buttonTextMatches = [];
  const btnRe = /<button\b[^>]*>([\s\S]*?)<\/button>/gi;
  while ((lm = btnRe.exec(html)) !== null && buttonTextMatches.length < 100) {
    const text = lm[1].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
    if (text && text.length < 80) buttonTextMatches.push(text);
  }
  const allActionish = [...linkTextMatches, ...buttonTextMatches].filter(t => ctaWords.test(t));
  // Dedupe + cap
  const ctaTexts = Array.from(new Set(allActionish)).slice(0, 8);

  // Mobile viewport meta
  const hasMobileMeta = /<meta[^>]+name\s*=\s*["']viewport["']/i.test(html);

  // Basic tracking detection
  const trackers = [];
  if (/googletagmanager\.com\/gtm\.js/i.test(html)) trackers.push('GTM');
  if (/google-analytics\.com\/analytics\.js|gtag\(['"]config['"]/i.test(html)) trackers.push('GA');
  if (/connect\.facebook\.net\/[^"']*\/fbevents\.js|fbq\(['"]init['"]/i.test(html)) trackers.push('Meta Pixel');
  if (/static\.hotjar\.com/i.test(html)) trackers.push('Hotjar');
  if (/clarity\.ms\/tag/i.test(html)) trackers.push('Clarity');
  if (/snap\.licdn\.com\/li\.lms-analytics/i.test(html)) trackers.push('LinkedIn Insight');

  return {
    finalUrl,
    title:           title || null,
    titleLength:     title ? title.length : 0,
    metaDescription: metaDescription || null,
    metaDescriptionLength: metaDescription ? metaDescription.length : 0,
    ogTitle:         ogTitle || null,
    canonical:       canonical || null,
    h1Count,
    firstH1,
    wordCount,
    hasForm,
    hasMobileMeta,
    ctaTexts,
    trackers
  };
}

function formatScanForPrompt(scanUrl, lh, page){
  const lines = [`\nSCAN — ${scanUrl}`];
  if (lh) {
    const s = lh.scores;
    lines.push(`- Lighthouse (mobile): Perf ${fmt(s.performance)}, A11y ${fmt(s.accessibility)}, SEO ${fmt(s.seo)}, Best Practices ${fmt(s.bestPractices)}`);
    const m = lh.metrics;
    const metricsLine = [];
    if (m.lcp?.display) metricsLine.push(`LCP ${m.lcp.display}`);
    if (m.cls?.display) metricsLine.push(`CLS ${m.cls.display}`);
    if (m.fcp?.display) metricsLine.push(`FCP ${m.fcp.display}`);
    if (m.tbt?.display) metricsLine.push(`TBT ${m.tbt.display}`);
    if (metricsLine.length) lines.push(`- Core metrics: ${metricsLine.join(', ')}`);
    if (lh.opportunities?.length) {
      lines.push(`- Top opportunities to fix:`);
      lh.opportunities.forEach(o => lines.push(`  • ${o.title} (saves ${o.saving})`));
    }
    if (lh.failedAudits?.length) {
      lines.push(`- Notable failed audits: ${lh.failedAudits.slice(0, 4).map(a => a.title).join(' | ')}`);
    }
  } else {
    lines.push(`- Lighthouse: scan failed`);
  }
  if (page) {
    lines.push(`- Page title: ${page.title ? `"${page.title}" (${page.titleLength} chars)` : 'MISSING'}`);
    lines.push(`- Meta description: ${page.metaDescription ? `"${truncate(page.metaDescription, 160)}" (${page.metaDescriptionLength} chars)` : 'MISSING'}`);
    lines.push(`- H1: ${page.h1Count === 0 ? 'MISSING' : (page.h1Count > 1 ? `MULTIPLE (${page.h1Count}) — first: "${truncate(page.firstH1 || '', 120)}"` : `"${truncate(page.firstH1 || '', 120)}"`)}`);
    lines.push(`- Word count: ${page.wordCount}`);
    lines.push(`- Form present on page: ${page.hasForm ? 'yes' : 'no'}`);
    lines.push(`- Mobile viewport meta: ${page.hasMobileMeta ? 'yes' : 'NO (mobile users will see desktop layout)'}`);
    lines.push(`- CTAs detected: ${page.ctaTexts.length ? page.ctaTexts.slice(0, 6).map(t => `"${t}"`).join(', ') : 'NONE found'}`);
    lines.push(`- Tracking installed: ${page.trackers.length ? page.trackers.join(', ') : 'none detected'}`);
  } else {
    lines.push(`- Page scrape: failed`);
  }
  return lines.join('\n');
}

function fmt(n){ return n === null || n === undefined ? '?' : String(n); }
function truncate(s, n){ return s.length > n ? s.slice(0, n - 1) + '…' : s; }

// ═══════════════════════════════════════════════════════════════════════════
// Plumbing
// ═══════════════════════════════════════════════════════════════════════════

function json(obj, status, cors) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { 'Content-Type': 'application/json', ...cors }
  });
}

function safeParse(text) {
  if (!text) return null;
  const cleaned = text
    .trim()
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/```\s*$/i, '')
    .trim();
  try { return JSON.parse(cleaned); }
  catch { /* fall through */ }
  const m = cleaned.match(/\{[\s\S]*\}/);
  if (!m) return null;
  try { return JSON.parse(m[0]); }
  catch { return null; }
}
