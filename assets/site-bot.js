/* PlainBlack site bot — self-injecting chat widget.
   Real LLM via the pb-bot Cloudflare Worker (Claude Haiku, system
   prompt baked into the Worker). Static keyword KB stays as a
   fallback when the Worker is unreachable, rate-limited, or down.
   Loaded sitewide via <script defer src="/assets/site-bot.js">. */
(function(){
  if (window.__pbBotLoaded) return;
  window.__pbBotLoaded = true;

  /* MATRIX TERMINAL THEME — green-on-black, monospace, falling katakana behind. */
  var MATRIX_GREEN  = '#3ecf8e';
  var MATRIX_DIM    = '#27a870';
  var MATRIX_FAINT  = 'rgba(62,207,142,0.45)';
  var TERM_BG       = '#000000';
  var TERM_TEXT     = 'rgba(220,255,232,0.92)';

  var css = ""
    + ".pb-bot-btn{position:fixed;bottom:24px;right:24px;width:56px;height:56px;border-radius:50%;background:#000;border:1.5px solid rgba(62,207,142,0.55);color:" + MATRIX_GREEN + ";display:flex;align-items:center;justify-content:center;cursor:pointer;z-index:1200;box-shadow:0 8px 24px rgba(0,0,0,0.6), 0 0 0 0 rgba(62,207,142,0);transition:transform .25s, box-shadow .35s;animation:pb-bot-pulse 4s ease-in-out infinite}"
    + ".pb-bot-btn:hover{transform:scale(1.08);box-shadow:0 12px 32px rgba(0,0,0,0.6), 0 0 0 6px rgba(62,207,142,0.22), 0 0 24px rgba(62,207,142,0.4)}"
    + ".pb-bot-btn svg{width:24px;height:24px;filter:drop-shadow(0 0 6px rgba(62,207,142,0.6))}"
    + "@keyframes pb-bot-pulse{0%,100%{box-shadow:0 8px 24px rgba(0,0,0,0.6), 0 0 0 0 rgba(62,207,142,0)}50%{box-shadow:0 8px 24px rgba(0,0,0,0.6), 0 0 0 8px rgba(62,207,142,0.22)}}"
    /* Panel: black with mint border + glow + matrix rain in background. */
    + ".pb-bot-panel{position:fixed;bottom:96px;right:24px;width:min(420px, calc(100vw - 32px));height:min(580px, calc(100vh - 140px));background:" + TERM_BG + ";border:1px solid rgba(62,207,142,0.45);border-radius:8px;display:none;flex-direction:column;z-index:1199;box-shadow:0 24px 64px rgba(0,0,0,0.8), 0 0 24px rgba(62,207,142,0.18), inset 0 0 60px rgba(62,207,142,0.04);font-family:'DM Mono',ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;overflow:hidden}"
    + ".pb-bot-panel.open{display:flex;animation:pb-bot-in .25s ease-out}"
    + "@keyframes pb-bot-in{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}"
    /* Matrix canvas behind everything in panel */
    + ".pb-bot-rain{position:absolute;inset:0;width:100%;height:100%;opacity:0.16;pointer-events:none;z-index:0}"
    /* Subtle scanlines overlay */
    + ".pb-bot-scan{position:absolute;inset:0;pointer-events:none;z-index:1;background:repeating-linear-gradient(180deg, transparent 0, transparent 2px, rgba(0,0,0,0.18) 2px, rgba(0,0,0,0.18) 3px)}"
    + ".pb-bot-head, .pb-bot-body, .pb-chips, .pb-bot-input{position:relative;z-index:2}"
    + ".pb-bot-head{padding:10px 14px;background:rgba(0,0,0,0.85);border-bottom:1px solid rgba(62,207,142,0.35);display:flex;align-items:center;gap:10px}"
    + ".pb-bot-head__title{color:" + MATRIX_GREEN + ";font-weight:700;font-size:0.85rem;letter-spacing:0.1em;line-height:1.2;text-transform:uppercase;text-shadow:0 0 8px rgba(62,207,142,0.45)}"
    + ".pb-bot-head__sub{font-size:0.62rem;color:" + MATRIX_FAINT + ";letter-spacing:0.14em;text-transform:uppercase;margin-top:2px;display:flex;align-items:center;gap:6px}"
    + ".pb-bot-head__live{width:6px;height:6px;border-radius:50%;background:" + MATRIX_GREEN + ";animation:pulse 1.4s ease-in-out infinite;display:inline-block;box-shadow:0 0 6px " + MATRIX_GREEN + "}"
    + ".pb-bot-close{background:none;border:1px solid rgba(62,207,142,0.35);color:" + MATRIX_GREEN + ";width:26px;height:26px;border-radius:4px;cursor:pointer;font-size:0.95rem;line-height:1;padding:0;font-family:inherit}"
    + ".pb-bot-close:hover{background:rgba(62,207,142,0.15);border-color:" + MATRIX_GREEN + "}"
    + ".pb-bot-body{flex:1;overflow-y:auto;padding:14px;display:flex;flex-direction:column;gap:10px;scrollbar-width:thin;scrollbar-color:" + MATRIX_FAINT + " transparent}"
    + ".pb-bot-body::-webkit-scrollbar{width:6px}"
    + ".pb-bot-body::-webkit-scrollbar-thumb{background:rgba(62,207,142,0.3);border-radius:3px}"
    + ".pb-msg{max-width:92%;padding:8px 12px;border-radius:4px;font-size:0.82rem;line-height:1.55;animation:pb-msg-in .2s ease-out}"
    + "@keyframes pb-msg-in{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:translateY(0)}}"
    /* Bot reply: terminal output, mint-tinted text, monospace */
    + ".pb-msg--bot{background:rgba(0,20,8,0.65);border:1px solid rgba(62,207,142,0.25);color:" + TERM_TEXT + ";align-self:flex-start;text-shadow:0 0 1px rgba(62,207,142,0.2)}"
    /* User message: shell-prompt prefixed */
    + ".pb-msg--user{background:transparent;color:" + MATRIX_GREEN + ";align-self:flex-end;border:none;padding:6px 0 6px 12px;text-shadow:0 0 6px rgba(62,207,142,0.3)}"
    + ".pb-msg--user::before{content:'> ';color:" + MATRIX_DIM + ";font-weight:700}"
    /* Markdown bits inside bot replies */
    + ".pb-msg strong{color:" + MATRIX_GREEN + ";font-weight:700;text-shadow:0 0 4px rgba(62,207,142,0.45)}"
    + ".pb-msg em{color:rgba(62,207,142,0.85);font-style:italic}"
    + ".pb-msg code{font-family:inherit;background:rgba(62,207,142,0.15);color:" + MATRIX_GREEN + ";padding:1px 6px;border-radius:3px;border:1px solid rgba(62,207,142,0.3)}"
    + ".pb-msg a{color:" + MATRIX_GREEN + ";text-decoration:underline;text-decoration-color:rgba(62,207,142,0.5);text-underline-offset:2px}"
    + ".pb-msg a:hover{text-shadow:0 0 6px rgba(62,207,142,0.6)}"
    /* Typing indicator: blinking caret */
    + ".pb-msg--typing{display:inline-flex;gap:3px;align-items:center;padding:10px 14px;color:" + MATRIX_GREEN + "}"
    + ".pb-typing-dot{width:8px;height:14px;background:" + MATRIX_GREEN + ";animation:pb-typing 1s steps(2) infinite;box-shadow:0 0 8px rgba(62,207,142,0.6)}"
    + ".pb-typing-dot:nth-child(2){animation-delay:0.2s;opacity:0.7}"
    + ".pb-typing-dot:nth-child(3){animation-delay:0.4s;opacity:0.4}"
    + "@keyframes pb-typing{0%,100%{opacity:1}50%{opacity:0.15}}"
    /* Quick-reply chips */
    + ".pb-chips{display:flex;flex-wrap:wrap;gap:5px;padding:5px 14px}"
    + ".pb-chip{font-size:0.7rem;font-family:inherit;padding:4px 10px;border-radius:3px;background:transparent;color:" + MATRIX_GREEN + ";border:1px solid rgba(62,207,142,0.4);cursor:pointer;transition:all .15s;letter-spacing:0.04em}"
    + ".pb-chip:hover{background:rgba(62,207,142,0.15);box-shadow:0 0 8px rgba(62,207,142,0.3)}"
    + ".pb-chip::before{content:'[ ';color:" + MATRIX_DIM + "}"
    + ".pb-chip::after{content:' ]';color:" + MATRIX_DIM + "}"
    /* Input row: shell prompt feel */
    + ".pb-bot-input{display:flex;gap:8px;padding:10px 14px;border-top:1px solid rgba(62,207,142,0.35);background:rgba(0,0,0,0.85);align-items:center}"
    + ".pb-bot-input::before{content:'pb@bot:~$';color:" + MATRIX_DIM + ";font-size:0.75rem;font-family:inherit;flex-shrink:0;text-shadow:0 0 4px rgba(62,207,142,0.3)}"
    + ".pb-bot-input input{flex:1;background:transparent;border:none;border-bottom:1px solid rgba(62,207,142,0.2);padding:6px 4px;font-family:inherit;font-size:0.82rem;color:" + MATRIX_GREEN + ";outline:none;min-width:0;caret-color:" + MATRIX_GREEN + "}"
    + ".pb-bot-input input::placeholder{color:rgba(62,207,142,0.35);font-style:italic}"
    + ".pb-bot-input input:focus{border-bottom-color:" + MATRIX_GREEN + ";box-shadow:0 1px 0 0 " + MATRIX_GREEN + "}"
    + ".pb-bot-input button{background:transparent;color:" + MATRIX_GREEN + ";border:1px solid rgba(62,207,142,0.5);border-radius:3px;padding:5px 12px;font-family:inherit;font-weight:700;font-size:0.7rem;cursor:pointer;letter-spacing:0.1em;text-transform:uppercase}"
    + ".pb-bot-input button:hover{background:" + MATRIX_GREEN + ";color:#000;box-shadow:0 0 12px rgba(62,207,142,0.5)}"
    + "@media (prefers-reduced-motion:reduce){.pb-bot-btn{animation:none}.pb-bot-rain{display:none}}"
  ;

  var style = document.createElement("style");
  style.textContent = css;
  document.head.appendChild(style);

  // Knowledge base — keyword regex → reply + suggested chips
  var KB = [
    { match: /(price|pricing|cost|how much|expensive|cheap)/i,
      reply: "Brand Sprint $2,500. Name & Frame from $950. Idea Engine $1,500/mo. AI Playbooks $99 once. Full breakdown on /services. No retainers you can't cancel, no surprise invoices.",
      chips: ["Brand Sprint", "AI Playbooks", "Book a call"] },
    { match: /(brand sprint|sprint package|2[ ,]500)/i,
      reply: "Two weeks. One bold brand. Logo, style kit, messaging, 90-day roadmap, website included. $2,500 starting. Most agencies stretch this into 6 months and triple the price. We don't.",
      chips: ["See pricing", "Book a call", "See work"] },
    { match: /(name.{0,5}frame|naming|tagline)/i,
      reply: "Name & Frame from $950. 3-5 name concepts with rationale, a tagline that doesn't read like a generic AI prompt, domain checks, starter brand kit. Done in 2-3 weeks.",
      chips: ["Pricing", "Book a call"] },
    { match: /(idea engine|monthly|retainer|content engine)/i,
      reply: "Idea Engine. $1,500/mo. Fresh campaign ideas, content hooks, social scripts, ad copy delivered every month. Cancel anytime. No 6-month lock-ins.",
      chips: ["Pricing", "Book a call"] },
    { match: /(playbook|ai playbook|99 dollar|99\$|do it yourself|diy)/i,
      reply: "AI Playbooks. $99 once. A personalised, AI-powered HTML playbook for your business. No subscriptions, no agency. Step-by-step, with embedded AI that keeps it current. /playbooks for the list.",
      chips: ["Browse playbooks", "What's inside?"] },
    { match: /(what.{0,5}inside|whats? included|deliverables)/i,
      reply: "Interactive checklists, AI 'check for updates' buttons that scrape fresh info, step-by-step DIY instructions, sanity checkpoints, free tools only. /playbooks has the full breakdown.",
      chips: ["Browse playbooks"] },
    { match: /(website|web design|web build|web dev)/i,
      reply: "Comes baked into Brand Sprint. Standalone, get in touch and we'll quote — no template-driven Squarespace clones. Every site is hand-built and yours forever.",
      chips: ["Brand Sprint", "Contact"] },
    { match: /(contact|get in touch|talk to|book.{0,5}call|hire|email)/i,
      reply: "/contact has the form, the offices (NZ + AU), and direct email for Ian and Jayden. We don't do pushy sales. Tell us what you're trying to do, we'll be honest about whether we're a fit.",
      chips: ["Pricing", "Who runs this?"] },
    { match: /(who.{0,5}(run|own|behind)|founder|ian|jayden|team)/i,
      reply: "Ian Clarquinn (AU) and Jayden Brown (NZ) run PlainBlack. Idea-obsessed, allergic to agency jargon. Full story on /about.",
      chips: ["About", "Contact"] },
    { match: /(where|location|country|based|nz|new zealand|aus|australia)/i,
      reply: "New Zealand and Australia. We work with clients across both, plus the US when the time zones cooperate. Bullshit we work with no time zones for.",
      chips: ["Contact"] },
    { match: /(givesback|gives back|charity|club|cause|sponsor|fundrais|p&c|p and c)/i,
      reply: "PlainBlack GivesBack. Your club shares a custom referral link. When someone they refer becomes a client, 10% of project value goes back to your cause — automatic, no admin. /givesback to see live examples and register a club.",
      chips: ["See examples", "Register club"] },
    { match: /(blog|article|post|read)/i,
      reply: "/blog has 40+ posts. Honest takes on marketing, branding, AI, and small-business pain. No 'thought leadership' fluff.",
      chips: ["Read blog"] },
    { match: /(work|portfolio|case stud|brands? you.?ve|done before|examples?)/i,
      reply: "/work has the brands we've built — Mint Exterior, Joining the Dodts, Tech Steps, Genr8 Electrical, more. Real small businesses, not SaaS unicorns.",
      chips: ["See work", "Contact"] },
    { match: /(google review|reputation|reviews)/i,
      reply: "Google Reviews Playbook. $99 one-off. Sets up a reputation system that actually gets your customers to leave 5-star reviews. Tradies and roofers love it.",
      chips: ["Browse playbooks"] },
    { match: /(roofer|trade|tradie|hvac|electrician|plumber|builder)/i,
      reply: "Big chunk of our playbooks are built for trades. 90-Day Job Pipeline, Roofing AI, Google Reviews. /playbooks — filter by your niche.",
      chips: ["Browse playbooks"] },
    { match: /(refund|guarantee|money back)/i,
      reply: "If a playbook doesn't deliver, email us. We fix it or refund. Small print is for cowards.",
      chips: ["Contact"] },
    { match: /(time|how long|turnaround|when.{0,5}(done|deliver|ready))/i,
      reply: "Name & Frame: 2-3 weeks. Brand Sprint: 2-4 weeks. AI Playbook: in your inbox within 24 hours. Idea Engine: monthly. We don't drag work out to bill more.",
      chips: ["Book a call"] },
    { match: /(ai|claude|gpt|chatbot|are you (a |)(bot|ai|robot|human))/i,
      reply: "Honest answer: I'm a fancy keyword matcher with attitude. The real AI lives inside the playbooks. Want a proper conversation? /contact and a human shows up.",
      chips: ["Pricing", "Contact"] },
    { match: /^(hi|hey|hello|sup|yo|hola|gday|g'day)/i,
      reply: "Hi. I'm the PlainBlack bot. What are you here for?",
      chips: ["Pricing", "AI Playbooks", "Book a call"] },
    { match: /(thanks|thank you|cheers|ta\b|appreciate)/i,
      reply: "All good. Hit /contact when you're ready to actually do something with this.",
      chips: ["Contact"] },
    { match: /(meaning of life|42|joke|funny|tell.{0,5}joke)/i,
      reply: "42. Or buy a Brand Sprint. Either way, same vibes.",
      chips: ["Pricing"] },
    { match: /(swear|fuck|shit|bullshit|bs)/i,
      reply: "Same energy. /contact if you want to vent at a real human.",
      chips: ["Contact"] },
    { match: /(competitor|other agencies|why you|why plain ?black|differen)/i,
      reply: "Most agencies bill you for confusion. We bill once and explain everything. We back the founders the big agencies ignore — that's the whole pitch.",
      chips: ["About", "Pricing"] },
    { match: /(retainer|monthly fee|lock.?in|contract)/i,
      reply: "We don't lock you in. Idea Engine is month-to-month. Branding is one-and-done. Playbooks are yours forever. The trust trade.",
      chips: ["Pricing", "Contact"] }
  ];

  function pickReply(text){
    for (var i = 0; i < KB.length; i++) {
      if (KB[i].match.test(text)) return KB[i];
    }
    return {
      reply: "Not sure I caught that. I'm a chatbot, not a wizard. Drop the real question at /contact and a human will get back to you. Or try one of these:",
      chips: ["Pricing", "AI Playbooks", "Who runs this?", "Book a call"]
    };
  }

  // ── LLM via Worker ───────────────────────────────────────────────
  // Hardcoded URL — bot Worker has no client-side secret, public POST.
  // Override per-device for testing via localStorage 'pb-bot-url'.
  var BOT_URL = (function(){
    try { return localStorage.getItem('pb-bot-url') || 'https://pb-bot.jkbrownnz.workers.dev'; }
    catch (_) { return 'https://pb-bot.jkbrownnz.workers.dev'; }
  })();
  var convo = []; // [{role:'user'|'assistant', content:'...'}], sent as history

  async function askLLM(userText){
    try {
      var r = await fetch(BOT_URL + '/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userText, history: convo })
      });
      if (r.status === 429) return { reply: null, error: 'rate_limited' };
      if (!r.ok)             return { reply: null, error: 'http_' + r.status };
      var data = await r.json();
      if (!data || !data.reply) return { reply: null, error: 'empty' };
      return { reply: data.reply, error: null };
    } catch (e) {
      return { reply: null, error: 'fetch_failed' };
    }
  }

  // Suggested follow-up chips chosen from keyword KB based on the
  // last user message — gives the LLM responses some click-targets.
  function chipsForText(text){
    for (var i = 0; i < KB.length; i++) {
      if (KB[i].match.test(text) && Array.isArray(KB[i].chips)) return KB[i].chips;
    }
    return ["Pricing", "AI Playbooks", "Contact"];
  }

  // Build DOM
  var btn = document.createElement("button");
  btn.className = "pb-bot-btn";
  btn.setAttribute("aria-label", "Open chat");
  btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10z"/><circle cx="9" cy="10" r="0.6" fill="currentColor"/><circle cx="13" cy="10" r="0.6" fill="currentColor"/><circle cx="17" cy="10" r="0.6" fill="currentColor"/></svg>';

  var panel = document.createElement("div");
  panel.className = "pb-bot-panel";
  panel.setAttribute("role", "dialog");
  panel.setAttribute("aria-label", "PlainBlack chat");
  panel.innerHTML = ''
    + '<canvas class="pb-bot-rain" id="pb-bot-rain" aria-hidden="true"></canvas>'
    + '<div class="pb-bot-scan" aria-hidden="true"></div>'
    + '<div class="pb-bot-head">'
    +   '<div style="flex:1">'
    +     '<div class="pb-bot-head__title">ASK_PLAINBLACK</div>'
    +     '<div class="pb-bot-head__sub" title="Powered by Claude"><span class="pb-bot-head__live"></span><span id="pb-bot-tagline">Sarcastic, mostly helpful</span></div>'
    +   '</div>'
    +   '<button class="pb-bot-close" aria-label="Close chat">&times;</button>'
    + '</div>'
    + '<div class="pb-bot-body" id="pb-bot-body"></div>'
    + '<div class="pb-chips" id="pb-bot-chips"></div>'
    + '<form class="pb-bot-input" id="pb-bot-form">'
    +   '<input type="text" id="pb-bot-input" placeholder="type your question..." autocomplete="off" spellcheck="false">'
    +   '<button type="submit" aria-label="Send">Send</button>'
    + '</form>';

  document.body.appendChild(btn);
  document.body.appendChild(panel);

  var body = panel.querySelector("#pb-bot-body");
  var chipsEl = panel.querySelector("#pb-bot-chips");
  var form = panel.querySelector("#pb-bot-form");
  var input = panel.querySelector("#pb-bot-input");

  // Minimal, safe markdown -> HTML for chat replies.
  // Order matters: escape first, then code spans, then bold, then italic,
  // then markdown links, then auto-link bare /paths, then newlines.
  function escapeHtml(s){
    return String(s).replace(/[&<>"']/g, function(c){
      return { '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c];
    });
  }
  function md(text){
    var s = escapeHtml(text);
    s = s.replace(/`([^`\n]+)`/g, '<code>$1</code>');
    s = s.replace(/\*\*([^*\n]+)\*\*/g, '<strong>$1</strong>');
    s = s.replace(/(^|[^\*\w])\*([^*\n]+)\*(?!\*)/g, '$1<em>$2</em>');
    s = s.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
    // Auto-link bare /paths only if not already inside an <a ...>...</a>
    s = s.replace(/(^|[\s(])(\/[a-z][a-z0-9\-]*)(?=[\s.,!?)]|$)/g, '$1<a href="$2">$2</a>');
    s = s.replace(/\n/g, '<br>');
    return s;
  }

  function addMsg(text, who){
    var m = document.createElement("div");
    m.className = "pb-msg pb-msg--" + who;
    m.innerHTML = md(text);
    body.appendChild(m);
    body.scrollTop = body.scrollHeight;
  }
  function setChips(list){
    chipsEl.innerHTML = "";
    if (!list || !list.length) return;
    list.forEach(function(label){
      var c = document.createElement("button");
      c.type = "button";
      c.className = "pb-chip";
      c.textContent = label;
      c.addEventListener("click", function(){ sendMessage(label); });
      chipsEl.appendChild(c);
    });
  }
  function addTyping(){
    var t = document.createElement("div");
    t.className = "pb-msg pb-msg--bot pb-msg--typing";
    t.innerHTML = '<span class="pb-typing-dot"></span><span class="pb-typing-dot"></span><span class="pb-typing-dot"></span>';
    body.appendChild(t);
    body.scrollTop = body.scrollHeight;
    return t;
  }
  async function sendMessage(text){
    if (!text) return;
    addMsg(text, "user");
    convo.push({ role: 'user', content: text });
    setChips([]);

    var typing = addTyping();
    var llm = await askLLM(text);
    typing.remove();

    if (llm.reply) {
      addMsg(llm.reply, "bot");
      convo.push({ role: 'assistant', content: llm.reply });
      setChips(chipsForText(text));
      // Trim conversation history to last 20 turns to keep payloads small
      if (convo.length > 20) convo = convo.slice(-20);
    } else {
      // Worker unreachable / rate-limited / down — fall back to keyword KB
      var fallback = pickReply(text);
      var prefix = '';
      if (llm.error === 'rate_limited') {
        prefix = "(Hit my rate limit, falling back to canned reply.) ";
      } else if (llm.error === 'fetch_failed') {
        prefix = "(I'm offline right now, falling back to canned reply.) ";
      }
      addMsg(prefix + fallback.reply, "bot");
      setChips(fallback.chips || []);
    }
  }

  var TAGLINES = [
    "Sarcastic, mostly helpful",
    "Real Claude, fake patience",
    "Plain talk, no agency-speak",
    "Mostly helpful, occasionally cheeky",
    "Brain on, filter off",
    "Blunt by design"
  ];
  function pickTagline(){
    var el = panel.querySelector('#pb-bot-tagline');
    if (el) el.textContent = TAGLINES[Math.floor(Math.random() * TAGLINES.length)];
  }

  // ── MATRIX RAIN inside the panel ─────────────────────────────────
  var rainCanvas = panel.querySelector('#pb-bot-rain');
  var rainCtx = null, rainTimer = null, rainCols = 0, rainDrops = [];
  var KATAKANA = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ$/<>{}[]=*+-#@!?';
  function sizeRain(){
    if (!rainCanvas) return;
    var rect = rainCanvas.getBoundingClientRect();
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    rainCanvas.width  = Math.floor(rect.width * dpr);
    rainCanvas.height = Math.floor(rect.height * dpr);
    rainCtx = rainCanvas.getContext('2d');
    rainCtx.scale(dpr, dpr);
    rainCols = Math.floor(rect.width / 14);
    rainDrops = [];
    for (var i = 0; i < rainCols; i++) rainDrops.push(Math.random() * rect.height);
  }
  function drawRain(){
    if (!rainCtx) return;
    var rect = rainCanvas.getBoundingClientRect();
    rainCtx.fillStyle = 'rgba(0,0,0,0.10)';
    rainCtx.fillRect(0, 0, rect.width, rect.height);
    rainCtx.fillStyle = '#3ecf8e';
    rainCtx.font = '13px DM Mono, ui-monospace, monospace';
    for (var i = 0; i < rainDrops.length; i++) {
      var ch = KATAKANA[Math.floor(Math.random() * KATAKANA.length)];
      rainCtx.fillText(ch, i * 14, rainDrops[i]);
      if (rainDrops[i] > rect.height && Math.random() > 0.972) rainDrops[i] = 0;
      rainDrops[i] += 14;
    }
  }
  function startRain(){
    if (rainTimer) return;
    sizeRain();
    rainTimer = setInterval(drawRain, 70);
  }
  function stopRain(){
    if (rainTimer) { clearInterval(rainTimer); rainTimer = null; }
  }
  // Resize the canvas when the panel resizes (drawer responsive on small screens)
  if (window.ResizeObserver && rainCanvas) {
    new ResizeObserver(function(){ if (rainTimer) sizeRain(); }).observe(panel);
  }

  var greeted = false;
  function openPanel(){
    panel.classList.add("open");
    pickTagline();
    startRain();
    if (!greeted) {
      greeted = true;
      addMsg("Welcome to **pb-bot v1.0**. Real Claude under the hood, dressed in PlainBlack attitude. What are you here for?", "bot");
      setChips(["Pricing", "AI Playbooks", "Who runs this?", "GivesBack"]);
    }
    setTimeout(function(){ input.focus(); }, 100);
  }
  function closePanel(){
    panel.classList.remove("open");
    stopRain();
  }

  btn.addEventListener("click", function(){
    panel.classList.contains("open") ? closePanel() : openPanel();
  });
  panel.querySelector(".pb-bot-close").addEventListener("click", closePanel);
  form.addEventListener("submit", function(e){
    e.preventDefault();
    var v = input.value.trim();
    if (!v) return;
    input.value = "";
    sendMessage(v);
  });
  document.addEventListener("keydown", function(e){
    if (e.key === "Escape" && panel.classList.contains("open")) closePanel();
  });
})();
