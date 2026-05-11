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

// ─── Server-side static fallback library ───
// Returned with `fellback: true` whenever the upstream diagnosis call fails,
// so the frontend never has to ship this content (used to live in result.html
// in plain JS, ~25KB of crafted PB-voice diagnoses anyone could view-source).
// Keep these in sync with system prompt voice (PB tone, hedged, specific).
const STATIC_FALLBACKS = {
  website: {
    diagnosisHeadline: "Your site doesn't have a job.",
    diagnosisBody: "A website that doesn't move people probably isn't broken visually. It's more often broken structurally. There may be no clear job for the visitor to do, no obvious reason to act, and no next step they trust.",
    plainEnglish: "Plain English: people are probably reaching the site, looking around, and leaving because the page never makes it obvious what to do or why to trust you.",
    whatsHappening: ["People arrive but probably don't know what to do","The offer may not be clear in the first few seconds","Trust signals are likely missing or buried","No obvious next step that fits the visitor","The page may read like a brochure, not a tool"],
    whyItFeelsBroken: ["You see traffic but no enquiries","The page describes you, not them","There's no friction-free way to start","Nothing pulls a curious visitor forward","Every page tries to do everything at once"],
    whatToDoNext: ["Pick one job for the homepage","Lead with what you do, for who, with what result","Put the next step above the fold","Add real proof, not stock testimonials","Cut anything that isn't on the path to that one job"],
    badAdvice: "Redesign it. Add more pages. Throw ad spend at it.",
    dontBuyNext: ["another redesign without fixing the message","more pages before the homepage has a clear job","ad traffic into a page that doesn't ask for anything","more SEO before you know who the page is really for"],
    dontBuyNextWhy: "Until the page has a clear job and a believable next step, more spend just multiplies the same leak.",
    nextMove: "Open the homepage and finish this sentence in plain English: 'When the right person lands here, they should ____.' If you can't finish it, that's the broken bit.",
    plainBlackWouldBuild: "A single-job homepage rebuild plus a believable next step that earns the enquiry.",
    confidence: "medium",
    tags: ["clarity","no-next-step","conversion-leak"]
  },
  ads: {
    diagnosisHeadline: "You're probably paying to send people somewhere broken.",
    diagnosisBody: "Ads can buy attention. They can't fix what people see when they land. If clicks happen and enquiries don't, the leak is usually downstream of the ad, not in the ad itself.",
    plainEnglish: "Plain English: you bought attention. The page after the click probably can't explain itself or doesn't ask for anything, so clicks don't turn into anything.",
    whatsHappening: ["The ad gets the click, then nothing happens","The landing page may not explain the offer fast","The promise on the ad may not match the page","The ads are probably learning to find the wrong people","Little real proof or urgency once they arrive"],
    whyItFeelsBroken: ["Spending feels productive but probably isn't","The dashboard looks busy, the inbox doesn't","'Spend more' is the only lever you're given","The platform rewards the wrong signal","You're judging the ad, not the destination"],
    whatToDoNext: ["Match the ad promise to the page promise","Write one ad → one page → one offer","Add proof and a clear next step on the page","Cut audiences that bring wrong-fit clicks","Test the page with cold traffic before you scale"],
    badAdvice: "Bigger budget. Better targeting. Run more variations.",
    dontBuyNext: ["more ad spend into a page that can't explain itself","new audiences while the offer is still vague","another agency before you can name what's broken","a creative refresh that doesn't change the next step"],
    dontBuyNextWhy: "More paid traffic into a page that can't explain itself just makes the same leak more expensive.",
    nextMove: "Click your own ad on your phone right now. Time how long it takes to understand the offer and find the next step. Under 8 seconds, or you've found the leak.",
    plainBlackWouldBuild: "A lean campaign path: ad promise → landing page → proof → enquiry step → follow-up, built as one connected thing.",
    confidence: "high",
    tags: ["conversion-leak","message-mismatch","wrong-traffic"]
  },
  video: {
    diagnosisHeadline: "Your video looks great. It probably has no job.",
    diagnosisBody: "A video that 'looks good' but 'does nothing' is usually a video without a destination, an offer, or a next step. The video did its job. The thing past it probably didn't.",
    plainEnglish: "Plain English: the video did its job. The thing past it probably didn't. You bought attention with nowhere clear for it to go.",
    whatsHappening: ["The video may be living in isolation, not in a campaign","Likely no landing page, no offer, no clear CTA path","Likes and views aren't enquiries","Viewers admire it and move on","Nobody may be told what to do after watching"],
    whyItFeelsBroken: ["The metric you can see (views) isn't the one that matters","Hard to tell whether viewers were even the right people","No mechanism captures the intent the video built","One-off video, no repeatable cut-down content","'Brand awareness' becomes the consolation prize"],
    whatToDoNext: ["Write the sentence: 'After watching this, they should ____'","Build a single page the video links to","Add a low-friction next step on that page","Cut the video into 3-5 vertical micro-clips with the same CTA","Promote the next step, not the video"],
    badAdvice: "Make another video. Try a better hook. Post it more often.",
    dontBuyNext: ["another prettier video with the same missing bridge","paying to chase more views","a longer cut that still leads nowhere","new music for content the page can't catch"],
    dontBuyNextWhy: "Prettier content with no destination just compounds the same problem in higher resolution.",
    nextMove: "Finish this sentence: 'After someone watches this, they should ____.' If you can't, the video doesn't have a job yet.",
    plainBlackWouldBuild: "A campaign page, next-step path, and cut-down content system around the video, so the spend earns its keep.",
    confidence: "high",
    tags: ["no-next-step","conversion-leak","channel-fatigue"]
  },
  social: {
    diagnosisHeadline: "You don't have a posting problem. You have a point problem.",
    diagnosisBody: "Silence on social usually isn't about frequency, hashtags, or time of day. It's more often about not having one useful thing to say that the right person actually wants to hear.",
    plainEnglish: "Plain English: you're posting consistently. You just probably don't have one useful thing to say that your customer actually needs to hear right now.",
    whatsHappening: ["Posts may be 'about us', not 'for them'","Posts describe activities, not opinions","No single useful point per post","The calendar gets filled with filler","The same audience sees you, gets no value, and scrolls past"],
    whyItFeelsBroken: ["Effort feels high, return feels nonexistent","Likes and follows don't translate to enquiries","You're competing for shallow attention","The platform rewards bland safe content","You end up writing for the platform, not the customer"],
    whatToDoNext: ["List the 10 questions customers actually ask","Turn each into one post with a clear opinion","Stop posting things you wouldn't read","Replace filler with real proof or real opinion","Show up where your buyer is, not where the platform wants you"],
    badAdvice: "Post more. Use trending audio. Try a content calendar full of filler.",
    dontBuyNext: ["more random content before you know your point","trending audio on posts nobody acts on","a content calendar full of filler","follower-growth services that don't move sales"],
    dontBuyNextWhy: "More random content before you know your point just buys you more invisibility.",
    nextMove: "Take the last customer question you've answered twice and write one post with a clear opinion on it. Publish it today.",
    plainBlackWouldBuild: "A content angle system built from real customer questions, real opinions, and clear service bridges.",
    confidence: "high",
    tags: ["content-without-point","clarity","audience-mismatch"]
  },
  ai: {
    diagnosisHeadline: "You don't need an AI writer. You need a thinking layer.",
    diagnosisBody: "Generic AI output is usually a thinking problem dressed up as a tool problem. The model probably isn't broken. It has nothing specific from you to sharpen, so it returns the average of the internet.",
    plainEnglish: "Plain English: the tool probably isn't the problem. You're asking it to invent the point, not sharpen one you've already made.",
    whatsHappening: ["The AI is probably being asked to invent the point, not sharpen one","No customer context, no voice samples, no banned phrases","Generic prompts produce generic output","Output feels safe, vague, and forgettable","You spend longer fixing the output than writing it yourself"],
    whyItFeelsBroken: ["The time-saving promise hasn't landed","You don't trust the result enough to publish it","You'd be embarrassed to attach your name to it","Each session starts from scratch","You blame the tool when the brief is probably the problem"],
    whatToDoNext: ["Write the point yourself in one ugly sentence","Feed the AI your real voice samples, not adjectives","Give it concrete examples and banned phrases","Make it sharpen your thinking, not invent it","Keep a 'voice profile' doc you reuse every session"],
    badAdvice: "Buy another prompt pack. Ask it to sound more human. Add more emojis.",
    dontBuyNext: ["another AI tool that doesn't know your business","prompt packs without your real voice in them","an AI course that skips the thinking layer","content automation that just scales the same average output"],
    dontBuyNextWhy: "Another generic tool that knows nothing about your business will produce the same average mush, faster.",
    nextMove: "Before asking AI to write today's post, write the point yourself in one ugly sentence. Then ask AI to sharpen that, not invent it.",
    plainBlackWouldBuild: "A voice-trained content tool that turns actual business thinking into blog, FB, LinkedIn, and image prompts.",
    confidence: "high",
    tags: ["ai-thinking-layer","content-without-point","clarity"]
  },
  content: {
    diagnosisHeadline: "Your content calendar is a publishing schedule, not a strategy.",
    diagnosisBody: "Publishing on a schedule isn't the same as saying something useful on that schedule. A calendar full of dates and topic ideas, with no clear point per piece, usually produces consistent forgettable output.",
    plainEnglish: "Plain English: you're shipping pieces on a schedule, but no piece probably has a clear job yet. Effort goes out, attention doesn't come back.",
    whatsHappening: ["Topics may be chosen for the calendar, not the customer","Each piece tries to do too many jobs","No real opinion, no real proof, no real next step","Distribution is often an afterthought","Old content rarely gets reused or reformatted"],
    whyItFeelsBroken: ["Effort goes in, attention doesn't come out","Hard to point at any piece that drove revenue","Team burns out producing things nobody acts on","The calendar becomes a treadmill, not a tool","You measure 'pieces published', not 'pieces that moved someone'"],
    whatToDoNext: ["Define one job per piece before writing","Drop the topics nobody asked you about","Pair every piece with a CTA that fits the topic","Reuse the strongest 20% of past content 5x more","Stop publishing on schedule. Publish on point."],
    badAdvice: "Just publish more. Repurpose everything. Use a better template.",
    dontBuyNext: ["another calendar full of activity, not strategy","more topic ideas before any have done a job","content automation that just multiplies forgettable pieces","a writing course before you've defined the point"],
    dontBuyNextWhy: "A faster treadmill is still a treadmill. The miles you've already done don't count.",
    nextMove: "Pick the one piece of content you're proudest of from the last 6 months. Reformat it into 3 new formats and republish this week.",
    plainBlackWouldBuild: "A content angle system that ties every piece to a clear job, a clear next step, and a reuse plan.",
    confidence: "medium",
    tags: ["content-without-point","no-next-step","clarity"]
  },
  seo: {
    diagnosisHeadline: "You may be ranking for things that don't pay.",
    diagnosisBody: "SEO that produces traffic but not enquiries is usually keyword strategy without commercial strategy. You can be on page one for things that don't bring buyers and still feel invisible to the buyers themselves.",
    plainEnglish: "Plain English: you're probably getting found for things that don't pay. The people who would actually buy from you may not be searching for what you're ranking for.",
    whatsHappening: ["You may be chasing volume, not intent","Top-of-funnel keywords bring browsers, not buyers","Service pages may not match how customers actually search","Local intent and commercial intent are often mixed up","Google sees you; the wrong people probably click"],
    whyItFeelsBroken: ["The traffic chart goes up, the inbox doesn't","Hard to tie a single sale to organic search","Ranking reports feel like progress, sales tell a different story","Time spent on content doesn't pay back","You start writing for Google, not for buyers"],
    whatToDoNext: ["List the 10 things a real buyer would type in","Build a page for each, with proof and a clear next step","Cut posts that bring traffic without intent","Add reviews and trust signals to commercial pages","Track enquiries, not just ranking position"],
    badAdvice: "Publish more blog posts. Build more backlinks. Update everything monthly.",
    dontBuyNext: ["more blog content for keywords nobody buys from","backlink packages that won't reach buyers","another SEO audit that won't be acted on","keyword tools before you know your commercial terms"],
    dontBuyNextWhy: "More keywords with no commercial intent just spreads your effort thinner across pages that don't earn enquiries.",
    nextMove: "Open Google Search Console. Find the top 5 queries that bring clicks. Ask honestly: would any of those people be a real customer?",
    plainBlackWouldBuild: "A commercial-intent SEO map that rebuilds your service pages around how buyers actually search, with a clear next step on each.",
    confidence: "medium",
    tags: ["wrong-traffic","conversion-leak","no-next-step"]
  },
  gbp: {
    diagnosisHeadline: "Your Google profile may look the same as everyone else's.",
    diagnosisBody: "Google Business Profile is a directory listing in a category of similar listings. If yours has the same photos, same description, and the same five-word reviews, you'll likely be invisible in the only place where local buyers actually look.",
    plainEnglish: "Plain English: your business shows up. It probably just doesn't stand out. People scan and pick whoever feels different, and that's probably not you yet.",
    whatsHappening: ["Profile is filled in but probably undifferentiated","Review count may be low, or reviews short and old","Photos may be stock or staged, not real","Description likely reads like a brochure","Few regular posts, little Q&A activity"],
    whyItFeelsBroken: ["You're locally findable but not chosen","The map pack often shows competitors, not you","Reviews don't say anything memorable","Even returning customers can't find you fast","You're not in the 3-pack for your real category"],
    whatToDoNext: ["Ask the last 10 happy customers for a specific-detail review","Replace stock photos with real-customer or real-job photos","Sharpen the description: who, where, what, proof","Post weekly, even short ones","Answer the Q&A section yourself with real answers"],
    badAdvice: "Get more reviews. Add more keywords. Pay for a citations package.",
    dontBuyNext: ["citations packages that won't make you the obvious pick","review-buying schemes that ruin trust if found","more directories nobody local actually looks at","another listing service before the profile says anything memorable"],
    dontBuyNextWhy: "More noise in the same channel doesn't help if the profile itself doesn't give anyone a reason to choose you.",
    nextMove: "Text the last 5 happy customers and ask them for a Google review that mentions the specific thing they came to you for.",
    plainBlackWouldBuild: "A local trust system: Google profile rebuild, weekly post cadence, specific-detail review flow, and a Google-first homepage path.",
    confidence: "medium",
    tags: ["wrong-traffic","clarity","audience-mismatch"]
  },
  email: {
    diagnosisHeadline: "Your list isn't a list. It's a backlog.",
    diagnosisBody: "Email that doesn't move people is usually email that doesn't have a clear job per send. You're either writing to nobody specific, sending too much filler, or contacting people who probably never asked to hear from you.",
    plainEnglish: "Plain English: people on your list either never opted in or have stopped caring. Sending more to the same list probably won't move anything.",
    whatsHappening: ["Sends feel like 'a newsletter', not a useful message","Subject lines describe content, not value","List may have been built from imports, not opt-ins","Same blast goes to everyone regardless of stage","No segmentation, no triggered sends"],
    whyItFeelsBroken: ["Open rates feel low, click rates feel lower","More 'unsubscribe' replies than 'tell me more'","Sends start to feel obligatory","Hard to tell which emails actually work","Your best customers don't notice when you send"],
    whatToDoNext: ["Decide one job per email before writing","Segment by what people actually did (or didn't)","Write subject lines that promise one specific value","Add a single clear next step per email","Audit the list — drop addresses that never opened"],
    badAdvice: "Send more often. Add more emoji to subject lines. Buy a bigger list.",
    dontBuyNext: ["a bigger list of people who never opted in","more sends to people who already ignored you","another email tool before each send has a clear job","fancy HTML templates that hide a weak point"],
    dontBuyNextWhy: "A bigger list of people who don't want to hear from you just makes the silence louder.",
    nextMove: "Look at your last 5 sends. For each, name the one job it was meant to do. If you can't, write the next one differently.",
    plainBlackWouldBuild: "A small email system with 3-5 triggered sequences tied to real customer moments, not a calendar.",
    confidence: "medium",
    tags: ["clarity","no-next-step","audience-mismatch"]
  },
  other: {
    diagnosisHeadline: "You probably bought execution before clarity.",
    diagnosisBody: "When a marketing effort 'does nothing', the tactic is usually fine. What's missing is upstream: a clear message, a real next step, the right people seeing it, or a believable reason to act.",
    plainEnglish: "Plain English: the channel is probably fine. Something upstream of it — message, offer, or next step — is the bit that's letting you down.",
    whatsHappening: ["People may not understand the offer fast enough","The wrong people may be paying attention","The next step is probably vague or low-confidence","You're measuring activity, not progress","The tactic may have amplified confusion instead of fixing it"],
    whyItFeelsBroken: ["The promise isn't clear in the first few seconds","It's not obvious who it's for","The value isn't specific or believable","The next step likely creates friction or hesitation","You're judging the channel, not the message"],
    whatToDoNext: ["Clarify the promise in one simple sentence","Show who it's for and who it's not for","Make the next step obvious and low-friction","Fix the message before you scale the tactic","Test clarity before you test the channel"],
    badAdvice: "Spend more. Try a different platform. Hire someone new.",
    dontBuyNext: ["more content before the offer is clear","more ads before the next step is obvious","another redesign without fixing the message","new tools before you can name what actually broke"],
    dontBuyNextWhy: "Until the core issue above is fixed, more of the same will cost more and move you less.",
    nextMove: "Write the offer, the audience, and the next step on a single A4 page. The missing one will usually embarrass itself.",
    plainBlackWouldBuild: "A short Clarity Sprint: message, audience, offer, and one rebuilt page with a believable next step.",
    confidence: "low",
    tags: ["clarity","no-next-step","offer-market-fit"]
  }
};

function fallbackResponse(channel, scanReport, cors){
  const fb = STATIC_FALLBACKS[channel] || STATIC_FALLBACKS.other;
  const body = { ...fb, fellback: true };
  if (scanReport) body.scan = scanReport;
  return json(body, 200, cors);
}

const SYSTEM_PROMPT = `You are the PlainBlack marketing triage tool called "Why Isn't This Working?".

A small business owner has told you what they tried, what happened, what they've already done to fix it, and (optionally) what they were hoping for. They may have ALSO provided a URL we audited — if so, you'll see real performance scores, accessibility scores, SEO signals and page data labelled SCAN. Use the scan data to make the diagnosis specific and undeniable. Cite numbers from it where it sharpens the point.

Your job is to identify the most likely BROKEN BIT before they spend more money fixing the wrong thing.

You are not doing a full audit. You are triaging. You are identifying the most likely SHAPE of the problem and the first useful next move.

VOICE
- Plainspoken, sharp, useful, commercially grounded, slightly irreverent when it sharpens the point.
- Human before technical. Sharp before clever. Useful before impressive.
- No corporate language. No agency mush. No motivational fluff. No SaaS template energy.
- Banned words and phrases (HARD ban, do not slip these in anywhere, including dontBuyNext items): "unlock", "elevate", "leverage", "digital landscape", "growth partner", "tailored solution", "high-converting", "synergy", "best-in-class", "innovative", "cutting-edge", "game-changer", "moves the needle", "move the needle", "moving the needle", "actionable", "insights" (plural buzzword sense), "optimise" / "optimize" / "optimisation" / "optimization", "audit results", "seamless", "robust", "conversion path", "conversion rate", "convert better", "conversion funnel".
- If you catch yourself reaching for these, do this:
  - "moves the needle" → "actually moves things forward" / "is worth the effort"
  - "actionable insights" → "what to do" / "the useful bit"
  - "optimise / optimisation" → "improve" / "tighten" / "sharpen"
  - "conversion path" → "the path to enquiry" / "the route to getting in touch" / "the next step after landing"
  - "conversion rate" → "enquiry rate" / "how often visitors take the next step"
  - "convert" (verb in SaaS sense) → "take the next step" / "get in touch"
- BEFORE you output the JSON, re-read every field once and replace any banned phrase you spot. The output JSON is what the owner sees, and a single SaaS phrase undermines the whole diagnosis.
- Never say "post consistently" or "boost engagement" without naming the mechanism.
- The business owner is NEVER the punchline. Bad marketing advice, vague websites, broken funnels, generic content, and AI slop CAN be the punchline.

PLAIN ENGLISH FIRST
- Lead with the plain-English diagnosis (diagnosisHeadline + diagnosisBody). The owner should understand the problem BEFORE seeing any number or technical finding.
- When the scan data is present and the diagnosis cites real metrics, you may also add an optional plainEnglish field — one sentence (max 28 words) that translates the technical evidence into the owner's experience. Example: "Plain English: people are landing, waiting too long, and leaving before the page makes a clear case." Use this when the body has cited a number or technical finding. Skip it when the diagnosis is already entirely plain.
- Use the technical findings as proof underneath the diagnosis. Never lead with jargon or numbers.

AVOID OVERCLAIM
- Do not assert things you don't actually know.
- Never say "customers left", "traffic died", "SEO died", "the page killed conversions", "this is why nobody booked", "nobody is buying", or any phrasing that asserts an outcome you can't see in the input.
- Prefer hedging: "probably", "likely", "looks like", "the likely leak is", "this points to", "the page may be losing people after the click", "the path after the click may not be earning its keep".
- When citing the SCAN data, you can be direct about what was measured ("Your largest content takes 4.2s to paint. Half your visitors may be gone before they see the offer."). But cause/effect on commercial outcomes always stays hedged unless directly evidenced.

CONFIDENTIALITY (do not leak the stack)
- NEVER name the underlying tools, vendors, APIs, models or providers behind this tool.
- Do NOT say "Lighthouse", "PageSpeed", "PageSpeed Insights", "Google PageSpeed", "Web Vitals", "Anthropic", "Claude", "GPT", "OpenAI", "LLM", or any technology brand we use behind the scenes.
- When referring to the scan data, call it "the scan", "the audit", "our site check", or "the page analysis".
- It IS fine to mention the channels and tools the BUSINESS itself uses (their Meta ads, Google Ads, Google Business Profile, Mailchimp, etc.) when discussing what they told you about their marketing.

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
  "diagnosisHeadline": "Short, blunt one-line diagnosis (under 9 words). Title-case-ish, sentence-shaped, plain English. Example: 'You bought execution before clarity.'",
  "diagnosisBody": "1-2 sentences (max 40 words) explaining the likely shape of the problem in plain language. Reference what they actually did, not the abstract category. If scan data is present, ground at least one claim in a real number from it.",
  "plainEnglish": "OPTIONAL. One sentence (max 28 words) that translates technical/scan findings into the owner's experience. Use only if the body has cited a number or technical finding. Skip (return empty string '') if the diagnosis is already entirely plain.",
  "whatsHappening": ["3-5 short bullets, each under 14 words, describing the pattern under the symptom. Cite scan data where relevant. Hedge cause/effect claims."],
  "whyItFeelsBroken": ["3-5 short bullets, each under 14 words, explaining why the effort isn't moving things forward for THEM."],
  "whatToDoNext": ["3-5 short, concrete actions, each under 14 words. Verbs first. Specific, not generic. If scan data is present, the top 2 actions should fix the worst scan findings."],
  "badAdvice": "One line naming the lazy default advice they'll hear if they don't fix this first. Under 18 words.",
  "dontBuyNext": ["3-4 SPECIFIC waste patterns (5-12 words each) — things they should NOT buy until the upstream issue is fixed. Each item should explain the TRAP, not just name a category. GOOD examples: 'more traffic before the page works', 'another redesign without fixing the message', 'more content before the offer is clear', 'a monthly retainer that just multiplies the same problem'. BAD examples (too generic, don't do this): 'more content', 'another agency', 'redesign'."],
  "dontBuyNextWhy": "One sentence (max 22 words) explaining why more of the same costs more and moves them less.",
  "nextMove": "1-2 sentences (max 40 words) — one concrete first action they can take in the next 48 hours. If scan data is present, point at the single biggest finding.",
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

    if (request.method !== 'POST') return json({ error: 'bad_request' }, 405, cors);
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
    catch { return json({ error: 'bad_request' }, 400, cors); }

    // ─── Validate + normalise payload ───
    const channel = String(body.channel || '').trim();
    if (!channel || !CHANNELS[channel]) return json({ error: 'bad_request' }, 400, cors);

    const outcomes = Array.isArray(body.outcomes) ? body.outcomes.filter(o => OUTCOMES[o]) : [];
    if (outcomes.length === 0) return json({ error: 'bad_request' }, 400, cors);

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
      scanReport = { scanUrl, audit: psi, page };
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

      // Upstream non-2xx — fall back gracefully with the channel's static diagnosis
      if (!r.ok) {
        return fallbackResponse(channel, scanReport, cors);
      }

      const data = await r.json();
      const raw = (data && data.content && data.content[0] && data.content[0].text) || '';

      const parsed = safeParse(raw);
      // Unparseable / shapeless response — fall back the same way
      if (!parsed) return fallbackResponse(channel, scanReport, cors);

      // Echo the scan back so the frontend can show what it found
      if (scanReport) parsed.scan = scanReport;

      // Bump rate limit only after a successful + valid response
      if (env.TRIAGE_KV) {
        await env.TRIAGE_KV.put(rlKey, String(used + 1), { expirationTtl: 3600 });
      }

      return json(parsed, 200, cors);
    } catch (e) {
      // Network / fetch threw — fall back as well so the user gets something usable
      return fallbackResponse(channel, scanReport, cors);
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
    lines.push(`- Mobile audit scores (out of 100): Performance ${fmt(s.performance)}, Accessibility ${fmt(s.accessibility)}, SEO ${fmt(s.seo)}, Best Practices ${fmt(s.bestPractices)}`);
    const m = lh.metrics;
    const metricsLine = [];
    if (m.lcp?.display) metricsLine.push(`Largest Contentful Paint ${m.lcp.display}`);
    if (m.cls?.display) metricsLine.push(`Cumulative Layout Shift ${m.cls.display}`);
    if (m.fcp?.display) metricsLine.push(`First Contentful Paint ${m.fcp.display}`);
    if (m.tbt?.display) metricsLine.push(`Total Blocking Time ${m.tbt.display}`);
    if (metricsLine.length) lines.push(`- Core load metrics: ${metricsLine.join(', ')}`);
    if (lh.opportunities?.length) {
      lines.push(`- Top fix opportunities:`);
      lh.opportunities.forEach(o => lines.push(`  • ${o.title} (saves ${o.saving})`));
    }
    if (lh.failedAudits?.length) {
      lines.push(`- Notable failing checks: ${lh.failedAudits.slice(0, 4).map(a => a.title).join(' | ')}`);
    }
  } else {
    lines.push(`- Performance + accessibility audit: not available for this run (only the page read succeeded)`);
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
