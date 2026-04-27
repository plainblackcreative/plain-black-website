/* PlainBlack site bot — self-injecting chat widget.
   Static keyword-matched responses in brand voice. No backend.
   Loaded sitewide via <script defer src="/assets/site-bot.js">. */
(function(){
  if (window.__pbBotLoaded) return;
  window.__pbBotLoaded = true;

  var css = ""
    + ".pb-bot-btn{position:fixed;bottom:24px;right:24px;width:56px;height:56px;border-radius:50%;background:#050505;border:1.5px solid rgba(62,207,142,0.4);color:#3ecf8e;display:flex;align-items:center;justify-content:center;cursor:pointer;z-index:1200;box-shadow:0 8px 24px rgba(0,0,0,0.4);transition:transform .25s, box-shadow .35s;animation:pb-bot-pulse 4s ease-in-out infinite}"
    + ".pb-bot-btn:hover{transform:scale(1.08);box-shadow:0 12px 32px rgba(0,0,0,0.5), 0 0 0 6px rgba(62,207,142,0.18)}"
    + ".pb-bot-btn svg{width:24px;height:24px}"
    + "@keyframes pb-bot-pulse{0%,100%{box-shadow:0 8px 24px rgba(0,0,0,0.4), 0 0 0 0 rgba(62,207,142,0)}50%{box-shadow:0 8px 24px rgba(0,0,0,0.4), 0 0 0 8px rgba(62,207,142,0.18)}}"
    + ".pb-bot-panel{position:fixed;bottom:96px;right:24px;width:min(380px, calc(100vw - 32px));height:min(560px, calc(100vh - 140px));background:#0a0a0a;border:1px solid rgba(245,243,239,0.12);border-radius:16px;display:none;flex-direction:column;z-index:1199;box-shadow:0 24px 64px rgba(0,0,0,0.6);font-family:'Figtree',sans-serif;overflow:hidden}"
    + ".pb-bot-panel.open{display:flex;animation:pb-bot-in .25s ease-out}"
    + "@keyframes pb-bot-in{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}"
    + ".pb-bot-head{padding:14px 16px;background:rgba(20,20,20,0.7);border-bottom:1px solid rgba(245,243,239,0.08);display:flex;align-items:center;gap:12px}"
    + ".pb-bot-head__title{font-family:'Playfair Display',serif;font-weight:700;color:#f5f3ef;font-size:1.05rem;line-height:1.2}"
    + ".pb-bot-head__sub{font-size:0.68rem;color:rgba(245,243,239,0.55);letter-spacing:0.1em;text-transform:uppercase;margin-top:3px;display:flex;align-items:center;gap:6px}"
    + ".pb-bot-head__live{width:6px;height:6px;border-radius:50%;background:#3ecf8e;animation:pulse 2s ease-in-out infinite;display:inline-block}"
    + ".pb-bot-close{background:none;border:none;color:#f5f3ef;width:30px;height:30px;border-radius:50%;cursor:pointer;font-size:1.4rem;line-height:1;padding:0}"
    + ".pb-bot-close:hover{background:rgba(245,243,239,0.08)}"
    + ".pb-bot-body{flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:10px;scrollbar-width:thin;scrollbar-color:rgba(245,243,239,0.2) transparent}"
    + ".pb-msg{max-width:85%;padding:10px 14px;border-radius:14px;font-size:0.88rem;line-height:1.5;color:#f5f3ef;animation:pb-msg-in .2s ease-out}"
    + "@keyframes pb-msg-in{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:translateY(0)}}"
    + ".pb-msg--bot{background:rgba(20,20,20,0.95);border:1px solid rgba(245,243,239,0.08);align-self:flex-start;border-top-left-radius:4px}"
    + ".pb-msg--user{background:#3ecf8e;color:#050505;align-self:flex-end;border-top-right-radius:4px}"
    + ".pb-msg a{color:inherit;text-decoration:underline}"
    + ".pb-chips{display:flex;flex-wrap:wrap;gap:6px;padding:6px 16px}"
    + ".pb-chip{font-size:0.72rem;font-family:'Figtree',sans-serif;padding:6px 12px;border-radius:20px;background:transparent;color:#3ecf8e;border:1px solid rgba(62,207,142,0.4);cursor:pointer;transition:all .15s}"
    + ".pb-chip:hover{background:#3ecf8e;color:#050505}"
    + ".pb-bot-input{display:flex;gap:8px;padding:12px 14px;border-top:1px solid rgba(245,243,239,0.08);background:rgba(0,0,0,0.4)}"
    + ".pb-bot-input input{flex:1;background:rgba(20,20,20,0.85);border:1px solid rgba(245,243,239,0.12);border-radius:8px;padding:10px 14px;font-family:'Figtree',sans-serif;font-size:0.88rem;color:#f5f3ef;outline:none;min-width:0}"
    + ".pb-bot-input input::placeholder{color:rgba(245,243,239,0.35)}"
    + ".pb-bot-input input:focus{border-color:#3ecf8e}"
    + ".pb-bot-input button{background:#3ecf8e;color:#050505;border:none;border-radius:8px;padding:0 16px;font-family:'Figtree',sans-serif;font-weight:700;font-size:0.85rem;cursor:pointer}"
    + ".pb-bot-input button:hover{background:#27a870}"
    + "@media (prefers-reduced-motion:reduce){.pb-bot-btn{animation:none}}"
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
    + '<div class="pb-bot-head">'
    +   '<div style="flex:1">'
    +     '<div class="pb-bot-head__title">Ask PlainBlack</div>'
    +     '<div class="pb-bot-head__sub"><span class="pb-bot-head__live"></span>Online &middot; sarcastic, mostly helpful</div>'
    +   '</div>'
    +   '<button class="pb-bot-close" aria-label="Close chat">&times;</button>'
    + '</div>'
    + '<div class="pb-bot-body" id="pb-bot-body"></div>'
    + '<div class="pb-chips" id="pb-bot-chips"></div>'
    + '<form class="pb-bot-input" id="pb-bot-form">'
    +   '<input type="text" id="pb-bot-input" placeholder="Type your question..." autocomplete="off">'
    +   '<button type="submit" aria-label="Send">Send</button>'
    + '</form>';

  document.body.appendChild(btn);
  document.body.appendChild(panel);

  var body = panel.querySelector("#pb-bot-body");
  var chipsEl = panel.querySelector("#pb-bot-chips");
  var form = panel.querySelector("#pb-bot-form");
  var input = panel.querySelector("#pb-bot-input");

  function addMsg(text, who){
    var m = document.createElement("div");
    m.className = "pb-msg pb-msg--" + who;
    m.innerHTML = String(text).replace(/(\/[a-z\-]+)/g, '<a href="$1">$1</a>');
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
  function sendMessage(text){
    if (!text) return;
    addMsg(text, "user");
    setChips([]);
    setTimeout(function(){
      var r = pickReply(text);
      addMsg(r.reply, "bot");
      setChips(r.chips || []);
    }, 350);
  }

  var greeted = false;
  function openPanel(){
    panel.classList.add("open");
    if (!greeted) {
      greeted = true;
      addMsg("Hi. I'm the PlainBlack bot. Quick answers, light sarcasm, no upsell.", "bot");
      setChips(["Pricing", "AI Playbooks", "Who runs this?", "GivesBack"]);
    }
    setTimeout(function(){ input.focus(); }, 100);
  }
  function closePanel(){ panel.classList.remove("open"); }

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
