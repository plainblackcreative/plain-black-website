/* ==========================================================================
   The hub engine, 15 Oct 2026: the games for the 404 page mod (hub-404.js).
   Jay, 15 Oct 2026: "pick which game you want on your site ... we just put
   them all in". One file, so the dashboard's preview and a client's own 404
   page run exactly the same game.

   ENGINE FILE: the same bytes for every client with the hub (see hub.js).
   No client's name, words or data belong here. It only defines
   window.PB404Games; it fetches and sends nothing itself (a leaderboard is
   whatever opt.scores the page passes in).

     PB404Games.list               [{ id, name, blurb }]
     PB404Games.mount(el, id, opt) draws game `id` into `el`, returns
                                   { destroy() }. opt: { accent: '#hex', skin,
                                   scores, home, fullscreen }.
       scores      the leaderboard: { get(board) -> Promise<[{ name, score, at }]>,
                   put(board, name, score) -> Promise<{ scores } | { error }> }.
                   Without it, this browser's. pb-404.js gives the website's.
       home        { href: '/', label } for the win screen's way home.
       fullscreen  the win screen and confetti take the whole window (a 404
                   page); otherwise they stay inside `el` (the dashboard).
     Each list entry has skins [{ id, name }]: the same game dressed for a
     client (a drone, a fairy, a water blaster). PlainBlack picks the skin.

   The games:
     block-out  Block Out (new, Jay's): dots and boxes against the computer.
                Draw one line a turn; close off a square and it is yours and
                you go again. Most squares wins.
     catch      Catch and bin: PlainBlack's own 404 game ("Bad ideas got
                loose"), as it was on the site: drag them to the bin, faster
                and faster, twenty to win, and do not bin the trojan. A
                leaderboard, fastest time first. Skins: gremlins (default),
                bad ideas.
     fly        Fly and spray (from Vantage Drones' 404 page): fly over the
                field and clear it. Skins: spray drone and weeds, fairy and
                fairy dust on wilting flowers, water blaster and moss.

   Each game stays inside `el` (no page-wide cursor, no listeners left after
   destroy). Text and lines take the colour of the page around them; the
   accent is the client's brand colour. Catch and bin's leaderboard is
   opt.scores; Block Out and Fly keep a best in this browser. Classes are g4-*.
   ========================================================================== */
(function () {
  'use strict';
  if (window.PB404Games) return;

  var CSS = [
    '.g4{--g4-accent:#16585e;position:relative;font:inherit;color:inherit;max-width:560px;margin:0 auto;-webkit-user-select:none;user-select:none}',
    '.g4-top{display:flex;justify-content:space-between;align-items:center;gap:10px;margin:0 0 8px;font-size:13px;font-weight:700;letter-spacing:.04em}',
    '.g4-top .g4-dim{opacity:.6;font-weight:600}',
    '.g4-btn{font:inherit;font-size:13px;font-weight:700;border:1px solid var(--g4-accent);background:transparent;color:inherit;border-radius:999px;padding:5px 14px;cursor:pointer}',
    '.g4-btn:hover{background:var(--g4-accent);color:#fff}',
    '.g4-box{position:relative;border:1px solid color-mix(in srgb,currentColor 18%,transparent);border-radius:14px;background:color-mix(in srgb,var(--g4-accent) 6%,transparent);overflow:hidden;touch-action:none}',
    '.g4-msg{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) scale(.8);opacity:0;pointer-events:none;transition:opacity .25s,transform .25s;text-align:center;',
    'background:var(--g4-panel,#fff);color:var(--g4-panel-ink,#222);border:2px solid var(--g4-accent);border-radius:14px;padding:14px 22px;min-width:180px;z-index:20;box-shadow:0 8px 30px rgba(0,0,0,.18)}',
    '.g4-msg.show{opacity:1;transform:translate(-50%,-50%) scale(1);pointer-events:auto}',
    '.g4-msg b{display:block;font-size:20px;margin-bottom:2px}',
    '.g4-msg span{display:block;font-size:13px;opacity:.75}',
    '.g4-msg .g4-btn{margin-top:10px}',
    /* Block Out */
    '.g4-bo svg{display:block;width:100%;height:auto}',
    '.g4-bo .g4-box{max-width:560px;margin:0 auto}',
    '.g4-bo .g4-dot{fill:currentColor;pointer-events:none}',
    '.g4-bo .g4-edge{stroke:color-mix(in srgb,currentColor 12%,transparent);stroke-width:5;stroke-linecap:round;pointer-events:none}',
    '.g4-bo .g4-edge.on{stroke:currentColor}',
    '.g4-bo .g4-edge.me{stroke:var(--g4-accent)}',
    '.g4-bo .g4-edge.last{stroke-width:7}',
    '.g4-bo .g4-hit{stroke:transparent;stroke-width:26;stroke-linecap:round;cursor:pointer;outline:none}',
    '.g4-bo .g4-hit:hover+.g4-edge,.g4-bo .g4-hit:focus-visible+.g4-edge{stroke:color-mix(in srgb,var(--g4-accent) 55%,transparent)}',
    '.g4-bo.wait .g4-hit{cursor:default}',
    '.g4-bo .g4-sq{fill:transparent;transition:fill .3s;pointer-events:none}',
    '.g4-bo .g4-sq.me{fill:color-mix(in srgb,var(--g4-accent) 70%,transparent)}',
    '.g4-bo .g4-sq.cpu{fill:color-mix(in srgb,currentColor 22%,transparent)}',
    '.g4-bo .g4-sqt{font-size:13px;font-weight:800;text-anchor:middle;dominant-baseline:central;fill:#fff;pointer-events:none}',
    '.g4-bo .g4-sqt.cpu{fill:currentColor;opacity:.7}',
    '.g4-bo.big .g4-edge{stroke-width:3.5}',
    '.g4-bo.big .g4-edge.last{stroke-width:5}',
    '.g4-bo.big .g4-hit{stroke-width:16}',
    '.g4-sizes{display:inline-flex;flex-wrap:wrap;gap:6px}',
    '.g4-btn.g4-size{border-color:color-mix(in srgb,currentColor 25%,transparent)}',
    '.g4-btn.g4-size.on{border-color:var(--g4-accent);background:var(--g4-accent);color:#fff}',
    '.g4-score{display:flex;gap:14px}',
    '.g4-score i{font-style:normal;display:inline-flex;align-items:center;gap:6px}',
    '.g4-score i:before{content:"";width:10px;height:10px;border-radius:3px;background:var(--g4-accent)}',
    '.g4-score i.cpu:before{background:color-mix(in srgb,currentColor 40%,transparent)}',
    '.g4-score i.turn{text-decoration:underline;text-underline-offset:4px;text-decoration-thickness:2px}',
    /* Catch and bin: PlainBlack's own 404 game, its look kept */
    '.g4c{--g4-hot:#f59e0b;--g4-danger:#ef4444;max-width:500px;color:var(--g4-ink,inherit)}',
    '.g4c-status{display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;font-size:var(--fs-label,1em);font-weight:700;letter-spacing:.08em;text-transform:uppercase}',
    '.g4c-label{color:color-mix(in srgb,currentColor 35%,transparent);transition:color .3s}',
    '.g4c-label.g4c-hot{color:var(--g4-hot)}',
    '.g4c-label.g4c-danger{color:var(--g4-danger)}',
    '.g4c-timer{color:var(--g4-accent);font-variant-numeric:tabular-nums;min-width:40px;text-align:right}',
    '.g4c-timer.g4c-stopped{color:color-mix(in srgb,currentColor 30%,transparent)}',
    '.g4c-arena{position:relative;width:100%;height:240px;background:linear-gradient(160deg,color-mix(in srgb,var(--g4-accent) 6%,transparent) 0%,color-mix(in srgb,var(--g4-page,#fff) 80%,transparent) 100%);border:1px solid color-mix(in srgb,var(--g4-accent) 18%,transparent);border-radius:16px;overflow:hidden;cursor:crosshair;-webkit-user-select:none;user-select:none;touch-action:none}',
    '.g4c-arena::after{content:"";position:absolute;inset:0;background:radial-gradient(ellipse at 20% 80%,color-mix(in srgb,var(--g4-accent) 4%,transparent) 0%,transparent 60%);pointer-events:none}',
    '.g4c-pb{position:absolute;top:8px;left:10px;right:76px;height:3px;background:color-mix(in srgb,currentColor 7%,transparent);border-radius:2px;overflow:hidden;z-index:5}',
    '.g4c-pb i{display:block;height:100%;width:0;background:var(--g4-accent);border-radius:2px;transition:width .3s ease,background .3s ease}',
    '.g4c-pb i.g4c-hot{background:var(--g4-hot)}',
    '.g4c-pb i.g4c-danger{background:var(--g4-danger)}',
    '.g4c-score{position:absolute;top:6px;right:10px;font-size:var(--fs-label,1em);font-weight:700;color:color-mix(in srgb,currentColor 30%,transparent);z-index:5}',
    '.g4c-score span{color:var(--g4-accent)}',
    '.g4c-speed{position:absolute;top:20px;left:10px;font-size:var(--fs-label,1em);font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:color-mix(in srgb,currentColor 20%,transparent);z-index:5;transition:color .3s}',
    '.g4c-speed.g4c-hot{color:color-mix(in srgb,var(--g4-hot) 70%,transparent)}',
    '.g4c-speed.g4c-danger{color:color-mix(in srgb,var(--g4-danger) 80%,transparent)}',
    '.g4c-flash{position:absolute;inset:0;border-radius:16px;opacity:0;pointer-events:none;transition:opacity .15s}',
    '.g4c-flash.g4c-good{background:color-mix(in srgb,var(--g4-accent) 18%,transparent)}',
    '.g4c-hint{position:absolute;top:10px;left:50%;transform:translateX(-50%);background:color-mix(in srgb,var(--g4-page,#fff) 85%,transparent);border:1px solid color-mix(in srgb,var(--g4-accent) 25%,transparent);border-radius:20px;padding:5px 14px;font-size:var(--fs-small,1em);font-weight:600;color:color-mix(in srgb,currentColor 45%,transparent);pointer-events:none;white-space:nowrap;z-index:30;transition:opacity .5s}',
    '.g4c-hint.g4c-hide{opacity:0}',
    '.g4c-popup{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%) scale(.7);background:var(--g4-panel,linear-gradient(135deg,color-mix(in srgb,var(--g4-page,#fff) 86%,currentColor),var(--g4-page,#fff)));border:1.5px solid var(--g4-accent);border-radius:14px;padding:18px 26px;text-align:center;z-index:20;opacity:0;pointer-events:none;transition:transform .3s cubic-bezier(.2,1.4,.6,1),opacity .3s ease;min-width:170px}',
    '.g4c-popup.g4c-show{transform:translate(-50%,-50%) scale(1);opacity:1}',
    '.g4c-popup.g4c-bad{border-color:var(--g4-danger)}',
    '.g4c-pe{font-size:1.8rem;margin-bottom:4px}',
    '.g4c-pt{font-family:var(--g4-title-font,inherit);font-weight:700;font-size:1.4rem;letter-spacing:0}',
    '.g4c-ps{font-size:var(--fs-small,1em);color:color-mix(in srgb,currentColor 45%,transparent);margin-top:2px}',
    '.g4c-bin{position:absolute;bottom:12px;right:16px;width:44px;height:52px;z-index:5;transform-origin:bottom center;transition:transform .15s,filter .15s;cursor:default}',
    '.g4c-bin .g4c-lid{fill:color-mix(in srgb,currentColor 12%,var(--g4-page,#fff))}',
    '.g4c-bin .g4c-can{fill:color-mix(in srgb,currentColor 5%,var(--g4-page,#fff))}',
    '.g4c-bin .g4c-rib{stroke:color-mix(in srgb,var(--g4-accent) 15%,transparent)}',
    '.g4c-bin .g4c-rim{fill:color-mix(in srgb,var(--g4-accent) 8%,transparent)}',
    '.g4c-bin.g4c-active{transform:scale(1.15);filter:drop-shadow(0 0 10px color-mix(in srgb,var(--g4-accent) 70%,transparent))}',
    '.g4c-bin.g4c-shaking{animation:g4c-shake .1s ease-in-out infinite}',
    '.g4c-bin.g4c-tip{animation:g4c-tip .8s ease-in both}',
    '@keyframes g4c-shake{0%,100%{transform:rotate(0)}25%{transform:rotate(-7deg) scale(1.05)}75%{transform:rotate(7deg) scale(1.05)}}',
    '@keyframes g4c-tip{0%{transform:rotate(0) translateY(0)}40%{transform:rotate(-28deg)}100%{transform:rotate(-95deg) translateY(56px);opacity:0}}',
    '.g4c-idea,.g4c-trojan{position:absolute;width:52px;height:52px;cursor:grab;touch-action:none;z-index:10;transform:translate(-50%,-50%)}',
    '.g4c-idea svg,.g4c-trojan svg{pointer-events:none}',
    '.g4c-idea{animation:g4c-wiggle .45s ease-in-out infinite alternate}',
    '.g4c-idea:active,.g4c-trojan:active{cursor:grabbing}',
    '.g4c-idea.g4c-caught{animation:none;cursor:grabbing;filter:drop-shadow(0 0 12px color-mix(in srgb,var(--g4-accent) 90%,transparent))}',
    '.g4c-idea.g4c-yeeted,.g4c-trojan.g4c-yeeted{animation:none;opacity:0;transform:translate(-50%,-50%) scale(.3) rotate(540deg);pointer-events:none}',
    '.g4c-idea.g4c-hidden,.g4c-trojan.g4c-hidden{display:none}',
    '.g4c-idea.g4c-dead{animation:g4c-rollout var(--rd,1.5s) ease-in both;pointer-events:none}',
    '@keyframes g4c-wiggle{from{transform:translate(-50%,-50%) rotate(-5deg) scale(1)}to{transform:translate(-50%,-50%) rotate(5deg) scale(1.06)}}',
    '@keyframes g4c-rollout{0%{opacity:1;transform:translate(-50%,-50%) rotate(0) scale(1)}100%{opacity:0;transform:translate(calc(-50% + var(--rx,110px)),calc(-50% + 180px)) rotate(900deg) scale(.3)}}',
    '.g4c-trojan{z-index:11;animation:g4c-float 1.1s ease-in-out infinite alternate;filter:drop-shadow(0 0 10px rgba(245,158,11,.7))}',
    '.g4c-trojan.g4c-caught{animation:none;filter:drop-shadow(0 0 16px rgba(245,158,11,1))}',
    '@keyframes g4c-float{from{transform:translate(-50%,-60%) rotate(-7deg) scale(1)}to{transform:translate(-50%,-42%) rotate(7deg) scale(1.09)}}',
    '.g4c-spill{position:absolute;inset:0;border-radius:16px;background:color-mix(in srgb,var(--g4-danger) 25%,transparent);opacity:0;pointer-events:none;transition:opacity .15s}',
    '.g4c-spill.g4c-show{opacity:1}',
    '.g4c-lb{width:100%;margin-top:16px}',
    '.g4c-lb-in{background:color-mix(in srgb,currentColor 3%,transparent);border:1px solid color-mix(in srgb,var(--g4-accent) 10%,transparent);border-radius:12px;padding:14px 16px}',
    '.g4c-lb-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:10px}',
    '.g4c-lb-title{font-size:var(--fs-label,1em);font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--g4-accent)}',
    '.g4c-lb-sub{font-size:var(--fs-label,1em);color:color-mix(in srgb,currentColor 20%,transparent);text-transform:uppercase;letter-spacing:.06em}',
    '.g4c-table{width:100%;border-collapse:collapse}',
    '.g4c-table tr{border-bottom:1px solid color-mix(in srgb,currentColor 5%,transparent)}',
    '.g4c-table tr:last-child{border-bottom:none}',
    '.g4c-table tr.g4c-new{background:color-mix(in srgb,var(--g4-accent) 8%,transparent)}',
    '.g4c-table td{padding:5px 4px;font-size:var(--fs-label,1em);color:color-mix(in srgb,currentColor 40%,transparent)}',
    '.g4c-table .g4c-rank{width:26px;font-weight:700;color:color-mix(in srgb,currentColor 20%,transparent);text-align:center}',
    '.g4c-table tr:nth-child(1) .g4c-rank{color:#FFD600}',
    '.g4c-table tr:nth-child(2) .g4c-rank{color:#B0BEC5}',
    '.g4c-table tr:nth-child(3) .g4c-rank{color:#CD7F32}',
    '.g4c-table .g4c-name{font-weight:700;color:var(--g4-ink,currentColor);letter-spacing:.1em;text-transform:uppercase}',
    '.g4c-table .g4c-time{text-align:right;font-weight:700;color:var(--g4-accent);font-variant-numeric:tabular-nums}',
    '.g4c-table .g4c-date{text-align:right;font-size:var(--fs-caption,1em);color:color-mix(in srgb,currentColor 18%,transparent);padding-left:6px}',
    '.g4c-table .g4c-empty{text-align:center;color:color-mix(in srgb,currentColor 20%,transparent);padding:10px 0;font-size:var(--fs-small,1em)}',
    '.g4c-win{position:absolute;inset:0;z-index:40;display:flex;flex-direction:column;align-items:center;justify-content:flex-start;background:transparent;pointer-events:none;visibility:hidden;transition:background .5s,visibility 0s .5s;overflow-y:auto;padding:16px;border-radius:16px}',
    '.g4c-win.g4c-full{position:fixed;z-index:1000;padding:40px 16px;border-radius:0}',
    '.g4c-win.g4c-show{background:color-mix(in srgb,var(--g4-page,#fff) 97%,transparent);pointer-events:auto;visibility:visible;transition:background .5s,visibility 0s}',
    '.g4c-win-in{text-align:center;max-width:400px;width:100%;padding:24px;opacity:0;transform:translateY(24px);transition:opacity .5s .3s,transform .5s .3s;margin:auto}',
    '.g4c-win.g4c-show .g4c-win-in{opacity:1;transform:translateY(0)}',
    '.g4c-win-emoji{font-size:3rem;margin-bottom:12px}',
    '.g4c-win .g4c-win-title{font-family:var(--g4-title-font,inherit);font-weight:700;font-size:clamp(2.4rem,7vw,3.2rem);color:var(--g4-ink,currentColor);letter-spacing:0;line-height:1.05;margin:0 0 6px}',
    '.g4c-win:not(.g4c-full) .g4c-win-title{font-size:clamp(1.8rem,5vw,2.4rem)}',
    '.g4c-win-title span{color:var(--g4-accent);font-style:normal}',
    '.g4c-win-sub{font-size:var(--fs-body,1em);color:color-mix(in srgb,currentColor 45%,transparent);margin:0 0 4px}',
    '.g4c-win-time{font-size:var(--fs-small,1em);color:color-mix(in srgb,currentColor 30%,transparent);margin:0 0 24px}',
    '.g4c-win-time strong{color:var(--g4-accent);font-size:15px}',
    '.g4c-init{margin-bottom:20px}',
    '.g4c-init-label{font-size:var(--fs-label,1em);font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:color-mix(in srgb,currentColor 35%,transparent);margin-bottom:10px}',
    '.g4c-init-row{display:flex;align-items:center;justify-content:center;gap:10px}',
    '.g4c-init-input{width:80px;padding:10px;background:color-mix(in srgb,currentColor 7%,transparent);border:1.5px solid color-mix(in srgb,var(--g4-accent) 40%,transparent);border-radius:8px;color:var(--g4-ink,currentColor);font:inherit;font-size:20px;font-weight:700;text-align:center;text-transform:uppercase;letter-spacing:.2em;outline:none;transition:border-color .15s}',
    '.g4c-init-input:focus{border-color:var(--g4-accent)}',
    '.g4c-init-input.g4c-bad{border-color:var(--g4-danger)}',
    '.g4c-init-input::placeholder{color:color-mix(in srgb,currentColor 18%,transparent);font-size:var(--fs-body,1em)}',
    '.g4c-init-btn{padding:10px 20px;background:var(--g4-accent);color:var(--g4-page,#fff);font:inherit;font-size:var(--fs-button,1em);font-weight:700;border:none;border-radius:8px;cursor:pointer;transition:filter .15s}',
    '.g4c-init-btn:hover{filter:brightness(.85)}',
    '.g4c-init-btn:disabled{opacity:.5;cursor:wait}',
    '.g4c-win-lb{margin:0 auto 20px;width:100%;max-width:320px}',
    '.g4c-win-lb-title{font-size:var(--fs-label,1em);font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--g4-accent);margin-bottom:10px;text-align:center}',
    '.g4c-win-btns{display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin-top:20px}',
    '.g4c-btn{display:inline-flex;align-items:center;gap:6px;padding:10px 20px;border-radius:8px;font:inherit;font-size:var(--fs-button,1em);font-weight:700;text-decoration:none;transition:all .15s;white-space:nowrap;border:none;cursor:pointer}',
    '.g4c-primary{background:var(--g4-accent);color:var(--g4-page,#fff)}',
    '.g4c-primary:hover{filter:brightness(.85)}',
    '.g4c-ghost{background:color-mix(in srgb,currentColor 6%,transparent);color:color-mix(in srgb,currentColor 60%,transparent);border:1px solid color-mix(in srgb,currentColor 10%,transparent)}',
    '.g4c-ghost:hover{background:color-mix(in srgb,currentColor 10%,transparent);color:var(--g4-ink,currentColor)}',
    '.g4c-pulse{animation:g4c-pulse 1.4s ease-in-out infinite}',
    '@keyframes g4c-pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.04)}}',
    '.g4c-confetti{position:absolute;inset:0;pointer-events:none;z-index:45}',
    '.g4c-confetti.g4c-full{position:fixed;z-index:999}',
    '@media (max-width:480px){.g4c-arena{height:200px}.g4c-idea,.g4c-trojan{width:44px;height:44px}}',
    '@media (prefers-reduced-motion:reduce){.g4c-idea,.g4c-trojan,.g4c-pulse,.g4c-bin.g4c-shaking{animation:none}}',
    /* Fly the drone */
    '.g4-sp .g4-box{height:260px;cursor:none;background:color-mix(in srgb,#6f9258 14%,transparent);outline:none}',
    '.g4-sp .g4-box:focus-visible{box-shadow:0 0 0 3px var(--g4-accent)}',
    '.g4-drone{position:absolute;left:0;top:0;width:48px;height:48px;pointer-events:none;z-index:10;transition:filter .15s}',
    '.g4-drone.spraying{filter:drop-shadow(0 0 6px var(--g4-accent))}',
    '.g4-drone .g4-rot{transform-box:fill-box;transform-origin:center;animation:g4spin .12s linear infinite}',
    '@keyframes g4spin{to{transform:rotate(360deg)}}',
    '.g4-weed{position:absolute;width:30px;height:34px;transform:translate(-50%,-80%) scale(0);transition:transform .35s cubic-bezier(.2,1.5,.5,1),opacity .3s;pointer-events:none}',
    '.g4-weed.grown{transform:translate(-50%,-80%) scale(1)}',
    '.g4-weed.cleared{transform:translate(-50%,-80%) scale(.4) rotate(40deg);opacity:0}',
    '.g4-mist{position:absolute;width:120px;height:120px;margin:-60px 0 0 -60px;border-radius:50%;pointer-events:none;z-index:9;',
    'background:radial-gradient(circle,color-mix(in srgb,var(--g4-accent) 45%,transparent) 0%,transparent 70%);animation:g4mist .55s ease-out forwards}',
    '@keyframes g4mist{from{transform:scale(.3);opacity:1}to{transform:scale(1.1);opacity:0}}',
    '.g4-sp .g4-hint{top:auto;bottom:10px}',
    '@media (prefers-reduced-motion:reduce){.g4-drone .g4-rot{animation:none}}'
  ].join('\n');

  function addCss() {
    if (document.getElementById('g4-css')) return;
    var s = document.createElement('style');
    s.id = 'g4-css';
    s.textContent = CSS;
    document.head.appendChild(s);
  }
  function best(key, v) {
    try {
      if (v === undefined) return parseInt(localStorage.getItem('g4-' + key) || '0', 10) || 0;
      localStorage.setItem('g4-' + key, String(v));
    } catch (e) { return 0; }
  }
  /* The colour behind the game: the first ancestor with a background, else white. The catch game's panels use it. */
  function pageColour(el) {
    for (var n = el; n && n.nodeType === 1; n = n.parentElement) {
      var c = getComputedStyle(n).backgroundColor;
      if (c && c !== 'transparent' && !/rgba\([^)]*,\s*0\)$/.test(c)) return c;
    }
    return '#fff';
  }
  var NS = 'http://www.w3.org/2000/svg';
  function svgEl(tag, attrs) {
    var e = document.createElementNS(NS, tag);
    for (var k in attrs) e.setAttribute(k, attrs[k]);
    return e;
  }
  /* A message box over the game, with an optional button. */
  function makeMsg(box) {
    var m = document.createElement('div');
    m.className = 'g4-msg';
    box.appendChild(m);
    return {
      show: function (title, sub, button, onClick) {
        m.innerHTML = '<b></b><span></span>';
        m.querySelector('b').textContent = title;
        m.querySelector('span').textContent = sub || '';
        if (button) {
          var b = document.createElement('button');
          b.type = 'button'; b.className = 'g4-btn'; b.textContent = button;
          b.addEventListener('click', onClick);
          m.appendChild(b);
        }
        m.classList.add('show');
      },
      hide: function () { m.classList.remove('show'); }
    };
  }

  /* ---------------------------------------------------------------- Block Out
     N x N squares (8 x 8 or 16 x 16, the player picks: Jay, 15 Oct 2026), (N+1) x (N+1) dots. Lines: h[r][c] (r 0..N, c 0..N-1) and v[r][c] (r 0..N-1, c 0..N).
     The computer: take a square when it can; else a line that gives nothing away; else the line that
     gives the fewest squares away (it plays out the run the other side would take). */
  function blockOut(root) {
    /* Two boards (Jay, 15 Oct 2026): 8 x 8, or 16 x 16 ("fit four squares into a square"). Same size on screen. */
    var SIZES = [8, 16], N = SIZES.indexOf(best('blockout-n')) !== -1 ? best('blockout-n') : 8, PAD = 18, GAP, IN, SIZE = PAD * 2 + 480;
    var h, v, owner, turn, score, lastEdge, over, timer = null;
    root.classList.add('g4-bo');
    root.innerHTML = '<div class="g4-top"><span class="g4-score"><i class="me">You <b data-g4="me">0</b></i><i class="cpu">Computer <b data-g4="cpu">0</b></i></span>' +
      '<span class="g4-dim" data-g4="status"></span></div><div class="g4-box"></div>' +
      '<div class="g4-top" style="margin:8px 0 0"><span class="g4-dim">Draw a line between two dots. Close a square and go again.</span>' +
      '<span class="g4-sizes" role="group" aria-label="Board size">' + SIZES.map(function (n) { return '<button type="button" class="g4-btn g4-size" data-n="' + n + '">' + n + ' × ' + n + '</button>'; }).join('') +
      '<button type="button" class="g4-btn" data-g4="new">New game</button></span></div>';
    var box = root.querySelector('.g4-box'), msg = makeMsg(box);
    var svg = svgEl('svg', { viewBox: '0 0 ' + SIZE + ' ' + SIZE, role: 'img', 'aria-label': 'Block Out board' });
    box.insertBefore(svg, box.firstChild);
    var q = function (k) { return root.querySelector('[data-g4="' + k + '"]'); };

    function key(t, r, c) { return t + r + '-' + c; }
    function sides(r, c) { return (h[r][c] ? 1 : 0) + (h[r + 1][c] ? 1 : 0) + (v[r][c] ? 1 : 0) + (v[r][c + 1] ? 1 : 0); }
    function allEdges() {
      var out = [], r, c;
      for (r = 0; r <= N; r++) for (c = 0; c < N; c++) if (!h[r][c]) out.push(['h', r, c]);
      for (r = 0; r < N; r++) for (c = 0; c <= N; c++) if (!v[r][c]) out.push(['v', r, c]);
      return out;
    }
    /* The squares a line touches. */
    function touches(e) {
      var t = e[0], r = e[1], c = e[2], out = [];
      if (t === 'h') { if (r > 0) out.push([r - 1, c]); if (r < N) out.push([r, c]); }
      else { if (c > 0) out.push([r, c - 1]); if (c < N) out.push([r, c]); }
      return out;
    }
    function set(e, val) { (e[0] === 'h' ? h : v)[e[1]][e[2]] = val; }
    /* How many squares this line would close. */
    function closes(e) {
      set(e, 1);
      var n = touches(e).filter(function (s) { return sides(s[0], s[1]) === 4; }).length;
      set(e, 0);
      return n;
    }
    /* Squares the other side could then take in a row, playing greedily. Undoes everything. */
    function giveaway(e) {
      var taken = [e], n = 0, more = true;
      set(e, 1);
      while (more) {
        more = false;
        var list = allEdges();
        for (var i = 0; i < list.length; i++) {
          var k = closes(list[i]);
          if (k) { n += k; set(list[i], 1); taken.push(list[i]); more = true; break; }
        }
      }
      taken.forEach(function (x) { set(x, 0); });
      return n;
    }
    function cpuPick() {
      var list = allEdges(), i;
      for (i = 0; i < list.length; i++) if (closes(list[i])) return list[i];
      var safe = list.filter(function (e) { return touches(e).every(function (s) { return sides(s[0], s[1]) < 2; }); });
      if (safe.length) return safe[Math.floor(Math.random() * safe.length)];
      var bestE = null, bestN = Infinity;
      list.forEach(function (e) { var n = giveaway(e); if (n < bestN || (n === bestN && Math.random() < 0.3)) { bestN = n; bestE = e; } });
      return bestE;
    }
    function play(e, who) {
      set(e, who);
      lastEdge = key(e[0], e[1], e[2]);
      var got = 0;
      touches(e).forEach(function (s) { if (sides(s[0], s[1]) === 4 && !owner[s[0]][s[1]]) { owner[s[0]][s[1]] = who; got++; } });
      score[who] += got;
      if (score[1] + score[2] === N * N) { over = true; draw(); finish(); return; }
      if (!got) turn = who === 1 ? 2 : 1;
      draw();
      if (turn === 2) { timer = setTimeout(function () { timer = null; if (!over) play(cpuPick(), 2); }, 450); }
    }
    function finish() {
      var me = score[1], cpu = score[2];
      if (me > cpu) { best('blockout-wins', best('blockout-wins') + 1); }
      var wins = best('blockout-wins');
      msg.show(me > cpu ? 'You win!' : me < cpu ? 'Computer wins' : 'A draw', me + ' to ' + cpu + (wins ? ' · You have won ' + wins + (wins === 1 ? ' game' : ' games') : ''), 'Play again', reset);
    }
    function draw() {
      while (svg.firstChild) svg.removeChild(svg.firstChild);
      var r, c, x, y;
      for (r = 0; r < N; r++) for (c = 0; c < N; c++) {
        x = PAD + c * GAP; y = PAD + r * GAP;
        var o = owner[r][c];
        svg.appendChild(svgEl('rect', { x: x + IN / 2, y: y + IN / 2, width: GAP - IN, height: GAP - IN, rx: IN * 0.75, 'class': 'g4-sq' + (o === 1 ? ' me' : o === 2 ? ' cpu' : '') }));
        if (o && N <= 8) { var t = svgEl('text', { x: x + GAP / 2, y: y + GAP / 2, 'class': 'g4-sqt' + (o === 2 ? ' cpu' : '') }); t.textContent = o === 1 ? 'You' : 'CPU'; svg.appendChild(t); }
      }
      function edge(t, r, c, x1, y1, x2, y2) {
        var val = (t === 'h' ? h : v)[r][c], k = key(t, r, c);
        if (!val && !over) {
          var hit = svgEl('line', { x1: x1, y1: y1, x2: x2, y2: y2, 'class': 'g4-hit', tabindex: turn === 1 ? '0' : '-1', role: 'button',
            'aria-label': (t === 'h' ? 'Line across, row ' : 'Line down, row ') + (r + 1) + ', column ' + (c + 1), 'data-e': t + ',' + r + ',' + c });
          svg.appendChild(hit);
        }
        svg.appendChild(svgEl('line', { x1: x1, y1: y1, x2: x2, y2: y2, 'class': 'g4-edge' + (val ? ' on' : '') + (val === 1 ? ' me' : '') + (k === lastEdge ? ' last' : '') }));
      }
      for (r = 0; r <= N; r++) for (c = 0; c < N; c++) edge('h', r, c, PAD + c * GAP + IN, PAD + r * GAP, PAD + (c + 1) * GAP - IN, PAD + r * GAP);
      for (r = 0; r < N; r++) for (c = 0; c <= N; c++) edge('v', r, c, PAD + c * GAP, PAD + r * GAP + IN, PAD + c * GAP, PAD + (r + 1) * GAP - IN);
      for (r = 0; r <= N; r++) for (c = 0; c <= N; c++) svg.appendChild(svgEl('circle', { cx: PAD + c * GAP, cy: PAD + r * GAP, r: N > 8 ? 3.5 : 5, 'class': 'g4-dot' }));
      q('me').textContent = score[1]; q('cpu').textContent = score[2];
      root.querySelector('.g4-score .me').classList.toggle('turn', turn === 1 && !over);
      root.querySelector('.g4-score .cpu').classList.toggle('turn', turn === 2 && !over);
      q('status').textContent = over ? 'Game over' : turn === 1 ? 'Your turn' : 'Computer’s turn…';
      root.classList.toggle('wait', turn !== 1 || over);
    }
    function reset() {
      if (timer) { clearTimeout(timer); timer = null; }
      h = []; v = []; owner = [];
      for (var r = 0; r <= N; r++) { h.push(new Array(N).fill(0)); v.push(new Array(N + 1).fill(0)); if (r < N) owner.push(new Array(N).fill(0)); }
      v.length = N;
      GAP = 480 / N; IN = N > 8 ? 4 : 8;
      root.classList.toggle('big', N > 8);
      root.querySelectorAll('.g4-size').forEach(function (b) { var on = +b.getAttribute('data-n') === N; b.classList.toggle('on', on); b.setAttribute('aria-pressed', on ? 'true' : 'false'); });
      turn = 1; score = { 1: 0, 2: 0 }; lastEdge = ''; over = false;
      msg.hide(); draw();
    }
    function pick(target) {
      var hit = target && target.closest && target.closest('.g4-hit');
      if (!hit || turn !== 1 || over) return;
      var p = hit.getAttribute('data-e').split(',');
      play([p[0], +p[1], +p[2]], 1);
    }
    function onClick(e) { pick(e.target); }
    function onKey(e) { if (e.key === 'Enter' || e.key === ' ') { if (e.target.closest && e.target.closest('.g4-hit')) { e.preventDefault(); pick(e.target); } } }
    svg.addEventListener('click', onClick);
    svg.addEventListener('keydown', onKey);
    q('new').addEventListener('click', reset);
    root.querySelectorAll('.g4-size').forEach(function (b) {
      b.addEventListener('click', function () { N = +b.getAttribute('data-n'); best('blockout-n', N); reset(); });
    });
    reset();
    return { destroy: function () { if (timer) clearTimeout(timer); timer = null; over = true; } };
  }

  /* ---------------------------------------------------------------- Catch and bin
     PlainBlack's own 404 game ("Bad ideas got loose", www.plainblackcreative.com/404), moved here as it is
     (Jay, 16 Oct 2026: "the version on the PlainBlack site was the version to use ... it should be the same
     game", and "every client should have a leaderboard"). Same speeds, same phases, same popups, the bin
     tipping and the win screen with initials for the leaderboard. Drag the troublemaker into the bin; it
     speeds up as you go; at ten it escapes and brings a friend; at seventeen a shiny trojan turns up, and
     binning it spills everything back out. Twenty to win, against the clock.
     A skin is the words. The leaderboard is opt.scores (pb-404.js gives the website's; without one it is
     this browser's). Colours: the accent, the page's own background and text colour (mount reads them),
     --g4-hot and --g4-danger, and --g4-panel / --g4-title-font when a site wants its own. */
  var IDEA_A = '<svg viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%;filter:drop-shadow(0 3px 8px rgba(0,0,0,0.6))"><ellipse cx="26" cy="28" rx="14" ry="13" fill="#DC2626"/><ellipse cx="26" cy="17" rx="12" ry="11" fill="#EF4444"/><polygon points="16,12 11,3 19,10" fill="#EF4444"/><polygon points="36,12 41,3 33,10" fill="#EF4444"/><ellipse cx="22" cy="16" rx="3.5" ry="3.5" fill="#fff"/><ellipse cx="30" cy="16" rx="3.5" ry="3.5" fill="#fff"/><circle cx="23" cy="17" r="2" fill="#1a1a1a"/><circle cx="31" cy="17" r="2" fill="#1a1a1a"/><circle cx="23.8" cy="16" r="0.7" fill="#fff"/><circle cx="31.8" cy="16" r="0.7" fill="#fff"/><line x1="18.5" y1="12.5" x2="24.5" y2="14.5" stroke="#B91C1C" stroke-width="2" stroke-linecap="round"/><line x1="27.5" y1="14.5" x2="33.5" y2="12.5" stroke="#B91C1C" stroke-width="2" stroke-linecap="round"/><path d="M20 22 Q26 18 32 22" stroke="#B91C1C" stroke-width="1.8" fill="none" stroke-linecap="round"/><ellipse cx="12" cy="28" rx="3.5" ry="2.5" fill="#DC2626" transform="rotate(-20 12 28)"/><ellipse cx="40" cy="28" rx="3.5" ry="2.5" fill="#DC2626" transform="rotate(20 40 28)"/><ellipse cx="20" cy="39" rx="4.5" ry="2.5" fill="#B91C1C"/><ellipse cx="32" cy="39" rx="4.5" ry="2.5" fill="#B91C1C"/><line x1="19" y1="25" x2="33" y2="25" stroke="#B91C1C" stroke-width="1" opacity="0.5"/><line x1="19" y1="29" x2="33" y2="29" stroke="#B91C1C" stroke-width="1" opacity="0.4"/><path d="M38 34 Q46 28 44 18 Q42 12 47 8" stroke="#DC2626" stroke-width="2.5" fill="none" stroke-linecap="round"/></svg>';
  var IDEA_B = '<svg viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%;filter:drop-shadow(0 3px 8px rgba(0,0,0,0.6))"><ellipse cx="26" cy="28" rx="14" ry="13" fill="#7C3AED"/><ellipse cx="26" cy="17" rx="12" ry="11" fill="#8B5CF6"/><polygon points="16,12 11,3 19,10" fill="#8B5CF6"/><polygon points="36,12 41,3 33,10" fill="#8B5CF6"/><ellipse cx="22" cy="16" rx="3.5" ry="3.5" fill="#fff"/><ellipse cx="30" cy="16" rx="3.5" ry="3.5" fill="#fff"/><circle cx="24" cy="17" r="2" fill="#1a1a1a"/><circle cx="32" cy="17" r="2" fill="#1a1a1a"/><circle cx="24.8" cy="16.5" r="0.7" fill="#fff"/><circle cx="32.8" cy="16.5" r="0.7" fill="#fff"/><line x1="19" y1="12" x2="25" y2="13.5" stroke="#6D28D9" stroke-width="2" stroke-linecap="round"/><path d="M27 13 Q30 11.5 34 13" stroke="#6D28D9" stroke-width="2" fill="none" stroke-linecap="round"/><path d="M22 21 Q27 25 31 21" stroke="#6D28D9" stroke-width="1.8" fill="none" stroke-linecap="round"/><ellipse cx="12" cy="28" rx="3.5" ry="2.5" fill="#7C3AED" transform="rotate(-20 12 28)"/><ellipse cx="40" cy="28" rx="3.5" ry="2.5" fill="#7C3AED" transform="rotate(20 40 28)"/><ellipse cx="20" cy="39" rx="4.5" ry="2.5" fill="#6D28D9"/><ellipse cx="32" cy="39" rx="4.5" ry="2.5" fill="#6D28D9"/><line x1="19" y1="25" x2="33" y2="25" stroke="#6D28D9" stroke-width="1" opacity="0.5"/><line x1="19" y1="29" x2="33" y2="29" stroke="#6D28D9" stroke-width="1" opacity="0.4"/><path d="M38 34 Q46 28 44 18 Q42 12 47 8" stroke="#7C3AED" stroke-width="2.5" fill="none" stroke-linecap="round"/></svg>';
  var TROJAN = '<svg viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%"><ellipse cx="16" cy="18" rx="9" ry="6" fill="rgba(255,220,100,0.4)" transform="rotate(-30 16 18)"/><ellipse cx="14" cy="26" rx="7" ry="4.5" fill="rgba(255,180,80,0.3)" transform="rotate(-20 14 26)"/><ellipse cx="36" cy="18" rx="9" ry="6" fill="rgba(255,220,100,0.4)" transform="rotate(30 36 18)"/><ellipse cx="38" cy="26" rx="7" ry="4.5" fill="rgba(255,180,80,0.3)" transform="rotate(20 38 26)"/><ellipse cx="26" cy="32" rx="8" ry="10" fill="#F59E0B"/><ellipse cx="26" cy="36" rx="9" ry="5.5" fill="#D97706"/><ellipse cx="26" cy="18" rx="10" ry="10" fill="#FDE68A"/><ellipse cx="26" cy="12" rx="10" ry="5.5" fill="#FEF3C7"/><ellipse cx="19" cy="16" rx="4.5" ry="6.5" fill="#FDE68A"/><ellipse cx="33" cy="16" rx="4.5" ry="6.5" fill="#FDE68A"/><ellipse cx="22" cy="18" rx="2.8" ry="2.8" fill="#fff"/><ellipse cx="30" cy="18" rx="2.8" ry="2.8" fill="#fff"/><circle cx="22.5" cy="18.5" r="1.8" fill="#DC2626"/><circle cx="30.5" cy="18.5" r="1.8" fill="#DC2626"/><circle cx="23" cy="17.8" r="0.6" fill="#fff"/><circle cx="31" cy="17.8" r="0.6" fill="#fff"/><path d="M19 23 Q26 28 33 23" stroke="#D97706" stroke-width="1.5" fill="none" stroke-linecap="round"/><line x1="36" y1="8" x2="40" y2="4" stroke="#FDE68A" stroke-width="1.5" stroke-linecap="round"/><line x1="40" y1="12" x2="45" y2="10" stroke="#FDE68A" stroke-width="1.5" stroke-linecap="round"/><line x1="40" y1="18" x2="46" y2="18" stroke="#FDE68A" stroke-width="1.5" stroke-linecap="round"/></svg>';
  var BIN = '<svg viewBox="0 0 44 52" fill="none" style="width:100%;height:100%"><rect class="g4c-lid" x="3" y="8" width="38" height="5" rx="2.5"/>' +
    '<rect class="g4c-lid" x="16" y="4" width="12" height="5" rx="2"/><path class="g4c-can" d="M7 13 L9 47 Q9 49 11 49 L33 49 Q35 49 35 47 L37 13 Z"/>' +
    '<line class="g4c-rib" x1="18" y1="17" x2="17" y2="45" stroke-width="2.5" stroke-linecap="round"/><line class="g4c-rib" x1="26" y1="17" x2="25" y2="45" stroke-width="2.5" stroke-linecap="round"/>' +
    '<rect class="g4c-rim" x="7" y="13" width="38" height="2.5" rx="1"/></svg>';

  /* Skins: the words. The first is the default. */
  var CATCH = {
    gremlins: { name: 'Gremlins', one: 'gremlin', many: 'gremlins', binned: 'Gremlin binned',
      win: ['All ', 'gremlins', ' binned.'], winSub: 'Your website is safe. For now.', board: 'Top Gremlin Catchers' },
    'bad-ideas': { name: 'Bad ideas (PlainBlack)', one: 'bad idea', many: 'bad ideas', binned: 'Bad idea neutralised',
      win: ['All ', 'bad ideas', ' neutralised.'], winSub: 'Your marketing funnel is safe. For now.', board: 'Top Brand Strategists' }
  };
  function fmtMs(ms) { var s = ms / 1000; return s < 60 ? s.toFixed(1) + 's' : Math.floor(s / 60) + 'm ' + (s % 60).toFixed(1) + 's'; }
  function dayOf(v) {
    var d = new Date(v);
    if (isNaN(d)) return typeof v === 'string' ? v.slice(0, 12) : '';
    try { return d.toLocaleDateString('en-NZ', { day: 'numeric', month: 'short' }); } catch (e) { return ''; }
  }
  /* This browser's leaderboard, when the page gives none (and the fallback when the real one cannot be reached). */
  function localBoard(board) { try { var a = JSON.parse(localStorage.getItem('g4-lb-' + board) || '[]'); return Array.isArray(a) ? a : []; } catch (e) { return []; } }
  function localAdd(board, name, score) {
    var a = localBoard(board);
    a.push({ name: name, score: score, at: new Date().toISOString() });
    a.sort(function (x, y) { return x.score - y.score; });
    a = a.slice(0, 10);
    try { localStorage.setItem('g4-lb-' + board, JSON.stringify(a)); } catch (e) { /* private window */ }
    return a;
  }
  var LOCAL_SCORES = {
    get: function (board) { return Promise.resolve(localBoard(board)); },
    put: function (board, name, score) { return Promise.resolve({ scores: localAdd(board, name, score) }); }
  };

  function catchBin(root, skinId, opt) {
    var SKIN = CATCH[skinId] ? skinId : 'gremlins', SK = CATCH[SKIN], ONE = SK.one, MANY = SK.many;
    var BOARD = 'catch-' + SKIN;
    var SCORES = opt && opt.scores && typeof opt.scores.get === 'function' && typeof opt.scores.put === 'function' ? opt.scores : LOCAL_SCORES;
    var FULL = !!(opt && opt.fullscreen);
    var HOME = opt && opt.home && typeof opt.home.href === 'string' && /^\/[^\s"'<>\\`]*$/.test(opt.home.href) && opt.home.href.indexOf('//') !== 0 ? opt.home : null;
    var TOTAL = 20, PHASE2 = 10, TROJAN_AT = 17, BSPD = 0.3, MSPD = 1.7;
    var LABEL = {
      start: '🎯 Grab the ' + ONE + '. Drag to bin.',
      hot: '🔥 Getting faster...',
      two: '💥 Two ' + MANY + '! Catch both!'
    };
    root.classList.add('g4c');
    root.innerHTML =
      '<div class="g4c-status"><span class="g4c-label" data-g4="label"></span><span class="g4c-timer" data-g4="time">0.0s</span></div>' +
      '<div class="g4c-arena">' +
        '<div class="g4c-flash"></div><div class="g4c-spill"></div>' +
        '<div class="g4c-hint">👆 Grab &amp; drag to bin</div>' +
        '<div class="g4c-pb"><i></i></div>' +
        '<div class="g4c-score">Binned: <span data-g4="n">0</span>/' + TOTAL + '</div>' +
        '<div class="g4c-speed"></div>' +
        '<div class="g4c-idea" data-g4="a">' + IDEA_A + '</div>' +
        '<div class="g4c-idea g4c-hidden" data-g4="b">' + IDEA_B + '</div>' +
        '<div class="g4c-trojan g4c-hidden" data-g4="t">' + TROJAN + '</div>' +
        '<div class="g4c-bin">' + BIN + '</div>' +
        '<div class="g4c-popup"><div class="g4c-pe"></div><div class="g4c-pt"></div><div class="g4c-ps"></div></div>' +
      '</div>' +
      '<div class="g4c-lb"><div class="g4c-lb-in"><div class="g4c-lb-head"><span class="g4c-lb-title">🏆 </span><span class="g4c-lb-sub">fastest time wins</span></div>' +
        '<table class="g4c-table" data-g4="lb"></table></div></div>' +
      '<div class="g4c-win' + (FULL ? ' g4c-full' : '') + '" role="dialog" aria-modal="false" aria-label="You won">' +
        '<div class="g4c-win-in"><div class="g4c-win-emoji">🎉</div><h2 class="g4c-win-title"></h2><p class="g4c-win-sub"></p>' +
        '<p class="g4c-win-time">Time: <strong data-g4="final">--</strong></p>' +
        '<div class="g4c-init" data-g4="init"><div class="g4c-init-label">Enter your initials for the leaderboard</div>' +
          '<div class="g4c-init-row"><input class="g4c-init-input" maxlength="3" placeholder="AAA" autocomplete="off" spellcheck="false" aria-label="Your initials">' +
          '<button type="button" class="g4c-init-btn">Save ✓</button></div></div>' +
        '<div class="g4c-win-lb" data-g4="winlb" hidden><div class="g4c-win-lb-title"></div><table class="g4c-table"></table></div>' +
        '<div class="g4c-win-btns"><button type="button" class="g4c-btn g4c-ghost" data-g4="again">🔁 Try again</button></div>' +
      '</div></div>';
    var q = function (k) { return root.querySelector('[data-g4="' + k + '"]'); };
    var arena = root.querySelector('.g4c-arena'), bin = root.querySelector('.g4c-bin'), hint = root.querySelector('.g4c-hint');
    var catchFlash = root.querySelector('.g4c-flash'), spillFlash = root.querySelector('.g4c-spill');
    var popup = root.querySelector('.g4c-popup'), pE = root.querySelector('.g4c-pe'), pT = root.querySelector('.g4c-pt'), pS = root.querySelector('.g4c-ps');
    var scoreEl = q('n'), pbFill = root.querySelector('.g4c-pb i'), speedEl = root.querySelector('.g4c-speed');
    var label = q('label'), timerEl = q('time');
    var win = root.querySelector('.g4c-win'), initPanel = q('init'), initInput = root.querySelector('.g4c-init-input'), initBtn = root.querySelector('.g4c-init-btn');
    var winLb = q('winlb'), winLbTable = winLb.querySelector('table'), lbTable = q('lb'), finalEl = q('final'), againBtn = q('again');
    root.querySelector('.g4c-lb-title').textContent = '🏆 ' + SK.board;
    winLb.querySelector('.g4c-win-lb-title').textContent = '🏆 ' + SK.board;
    var wt = root.querySelector('.g4c-win-title');
    wt.appendChild(document.createTextNode(SK.win[0]));
    var ws = document.createElement('span'); ws.textContent = SK.win[1]; wt.appendChild(ws);
    wt.appendChild(document.createTextNode(SK.win[2]));
    root.querySelector('.g4c-win-sub').textContent = SK.winSub;
    if (HOME) {
      var h = document.createElement('a');
      h.className = 'g4c-btn g4c-primary g4c-pulse'; h.href = HOME.href; h.textContent = String(HOME.label || '← Back home').slice(0, 60);
      root.querySelector('.g4c-win-btns').appendChild(h);
    }

    /* A whole-window win screen goes on <body>: a page's own animated wrapper (a transform) would trap a fixed box
       inside it. It takes the game's colours and fonts with it. */
    if (FULL) {
      var cs = getComputedStyle(root);
      ['--g4-accent', '--g4-page', '--g4-panel', '--g4-title-font', '--g4-hot', '--g4-danger', '--fs-label', '--fs-small', '--fs-body', '--fs-button', '--fs-caption'].forEach(function (k) {
        var v = cs.getPropertyValue(k).trim(); if (v) win.style.setProperty(k, v);
      });
      win.style.color = cs.color; win.style.fontFamily = cs.fontFamily;
      document.body.appendChild(win);
    }
    var alive = true, raf = 0, tRaf = 0, timers = [];
    var caught, p2, over, trojanUp, trojanUsed, tStart, tRun, finalMs, hintHidden, shakeTmr, confettiStop = null;
    function later(fn, ms) { var t = setTimeout(function () { var i = timers.indexOf(t); if (i !== -1) timers.splice(i, 1); if (alive) fn(); }, ms); timers.push(t); return t; }
    function makeG(el, x, y, tr) { return { el: el, x: x, y: y, vx: 0, vy: 0, active: false, drag: false, dox: 0, doy: 0, wan: false, tr: !!tr, pid: null }; }
    var gA = makeG(q('a'), 50, 45), gB = makeG(q('b'), 30, 35), gT = makeG(q('t'), 65, 30, true), ALL = [gA, gB, gT];

    function startT() { if (tRun) return; tStart = Date.now(); tRun = true; timerEl.classList.remove('g4c-stopped'); tick(); }
    function tick() { if (!tRun || !alive) return; timerEl.textContent = fmtMs(Date.now() - tStart); tRaf = requestAnimationFrame(tick); }
    function stopT() { finalMs = Date.now() - tStart; tRun = false; cancelAnimationFrame(tRaf); timerEl.textContent = fmtMs(finalMs); timerEl.classList.add('g4c-stopped'); }

    function AR() { return arena.getBoundingClientRect(); }
    function BR() { return bin.getBoundingClientRect(); }
    function setP(g, x, y) { g.x = x; g.y = y; g.el.style.left = x + '%'; g.el.style.top = y + '%'; }
    function spd() { return BSPD + (MSPD - BSPD) * Math.min(caught, TOTAL) / TOTAL; }

    function hud() {
      var s = spd();
      speedEl.textContent = s > 1.2 ? 'TURBO' : s > 0.7 ? 'FAST' : '';
      speedEl.className = 'g4c-speed' + (s > 1.2 ? ' g4c-danger' : s > 0.7 ? ' g4c-hot' : '');
      pbFill.style.width = Math.round(caught / TOTAL * 100) + '%';
      pbFill.className = s > 1.2 ? 'g4c-danger' : s > 0.8 ? 'g4c-hot' : '';
      scoreEl.textContent = caught;
      label.textContent = p2 ? LABEL.two : caught >= 7 ? LABEL.hot : LABEL.start;
      label.className = 'g4c-label' + (trojanUp || p2 ? ' g4c-danger' : caught >= 7 ? ' g4c-hot' : '');
    }

    /* One frame for every wanderer (the site gave each its own; the steps are the same). */
    function frame() {
      if (!alive) return;
      var ar = AR();
      if (ar.width && !over) {
        var s = spd(), mx = 10 / ar.width * 100, my = 10 / ar.height * 100;
        ALL.forEach(function (g) {
          if (!g.wan || !g.active || g.drag) return;
          var len = Math.sqrt(g.vx * g.vx + g.vy * g.vy);
          if (len > 0) { g.vx = g.vx / len * s; g.vy = g.vy / len * s; }
          g.x += g.vx; g.y += g.vy;
          if (g.x < mx || g.x > 100 - mx) g.vx *= -1;
          if (g.y < my || g.y > 100 - my) g.vy *= -1;
          g.x = Math.max(mx, Math.min(100 - mx, g.x)); g.y = Math.max(my, Math.min(100 - my, g.y));
          g.el.style.left = g.x + '%'; g.el.style.top = g.y + '%';
          if (Math.random() < 0.009) { var a = Math.random() * Math.PI * 2; g.vx = Math.cos(a) * s; g.vy = Math.sin(a) * s; }
        });
      }
      raf = requestAnimationFrame(frame);
    }
    function startW(g, x, y) {
      if (x !== undefined) { g.x = x; g.y = y; }
      g.el.style.transition = 'none'; g.el.style.left = g.x + '%'; g.el.style.top = g.y + '%';
      var a = Math.random() * Math.PI * 2, s = spd(); g.vx = Math.cos(a) * s; g.vy = Math.sin(a) * s;
      g.wan = true;
    }

    function grabStart(g, e) {
      if (!g.active || over) return;
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      e.preventDefault(); e.stopPropagation();
      if (!tRun) startT();
      g.drag = true; g.wan = false; g.pid = e.pointerId;
      g.el.classList.add('g4c-caught'); g.el.classList.remove('g4c-yeeted');
      try { g.el.setPointerCapture(e.pointerId); } catch (x) { /* fine without */ }
      if (!hintHidden) { hint.classList.add('g4c-hide'); hintHidden = true; }
      var ar = AR();
      g.dox = e.clientX - ar.left - g.x / 100 * ar.width; g.doy = e.clientY - ar.top - g.y / 100 * ar.height;
    }
    function onMove(e) {
      ALL.forEach(function (g) {
        if (!g.drag || e.pointerId !== g.pid) return;
        e.preventDefault();
        var ar = AR(), x = e.clientX - ar.left, y = e.clientY - ar.top;
        var px = Math.max(3, Math.min(97, (x - g.dox) / ar.width * 100));
        var py = Math.max(3, Math.min(97, (y - g.doy) / ar.height * 100));
        g.el.style.transition = 'none'; setP(g, px, py);
        var br = BR(), ax = ar.left + x - g.dox, ay = ar.top + y - g.doy;
        bin.classList.toggle('g4c-active', ax >= br.left && ax <= br.right && ay >= br.top && ay <= br.bottom);
      });
    }
    function onEnd(e) {
      ALL.forEach(function (g) {
        if (!g.drag || e.pointerId !== g.pid) return;
        g.drag = false; g.pid = null; g.el.classList.remove('g4c-caught');
        var br = BR();
        if (e.type !== 'pointercancel' && e.clientX >= br.left && e.clientX <= br.right && e.clientY >= br.top && e.clientY <= br.bottom) yeet(g);
        else { bin.classList.remove('g4c-active'); g.el.style.transition = ''; startW(g); }
      });
    }

    function binCentre() { var ar = AR(), br = BR(); return { x: (br.left + br.width / 2 - ar.left) / ar.width * 100, y: (br.top + br.height / 2 - ar.top) / ar.height * 100 }; }
    function flyToBin(g, cb) {
      var c = binCentre();
      g.el.style.transition = 'left .35s cubic-bezier(.4,0,.2,1),top .35s cubic-bezier(.4,0,.2,1),opacity .35s ease,transform .35s ease';
      g.el.classList.add('g4c-yeeted'); setP(g, c.x, c.y);
      later(cb, 380);
    }

    function yeet(g) {
      bin.classList.remove('g4c-active'); g.active = false; g.wan = false;
      if (g.tr) {
        trojanUp = false;
        [gA, gB].forEach(function (x) { x.active = false; x.wan = false; });
        flyToBin(g, function () { g.el.style.display = 'none'; spillAll(); });
        return;
      }
      caught++; hud();
      flyToBin(g, function () {
        catchFlash.className = 'g4c-flash g4c-good'; later(function () { catchFlash.className = 'g4c-flash'; }, 300);
        if (caught >= TOTAL) { later(endGame, 120); return; }
        if (!p2 && caught >= PHASE2) { later(triggerP2, 120); return; }
        if (p2) {
          var rem = TOTAL - caught;
          showPopup('🔥', 'Binned!', rem === 1 ? 'One more to go...' : rem + ' more to catch', false);
          later(function () {
            hidePopup(); g.el.classList.remove('g4c-yeeted', 'g4c-hidden'); g.active = true;
            if (!trojanUsed && caught >= TROJAN_AT) { spawnTrojan(); return; }
            startW(g, 20 + Math.random() * 60, 20 + Math.random() * 60);
          }, 1100);
        } else {
          showPopup('🎉', 'Binned!', SK.binned, false);
          later(function () { hidePopup(); g.el.classList.remove('g4c-yeeted'); g.active = true; startW(g, 20 + Math.random() * 60, 20 + Math.random() * 60); }, 1300);
        }
      });
    }

    function spawnTrojan() {
      trojanUp = true; trojanUsed = true;
      gB.active = false; gB.wan = false; gB.el.classList.add('g4c-hidden');
      var te = gT.el;
      te.style.display = ''; te.classList.remove('g4c-hidden', 'g4c-yeeted'); te.style.opacity = '1'; te.style.transform = '';
      gT.active = true; gT.wan = false; hud();
      startW(gT, 15 + Math.random() * 40, 15 + Math.random() * 50);
    }

    function spillAll() {
      var spilled = caught; caught = 0; hud();
      spillFlash.classList.add('g4c-show'); later(function () { spillFlash.classList.remove('g4c-show'); }, 500);
      showPopup('📸', 'It was a trojan!', spilled + ' ' + MANY + ' spilled back out...', true);
      later(function () {
        hidePopup();
        gT.active = false; gT.wan = false; gT.el.style.display = 'none';
        [gA, gB].forEach(function (g) {
          g.el.classList.remove('g4c-hidden', 'g4c-yeeted', 'g4c-dead'); g.el.style.opacity = '1'; g.el.style.transform = 'translate(-50%,-50%)'; g.active = true;
        });
        p2 = true; hud();
        var c = binCentre();
        startW(gA, c.x - 12, c.y - 6); startW(gB, c.x + 12, c.y - 6);
      }, 2300);
    }

    function triggerP2() {
      p2 = true; bin.classList.add('g4c-shaking');
      gA.active = false; gA.wan = false; gA.el.style.opacity = '0';
      if (shakeTmr) { clearTimeout(shakeTmr); timers.splice(timers.indexOf(shakeTmr), 1); }
      shakeTmr = later(function () {
        shakeTmr = null;
        bin.classList.remove('g4c-shaking');
        var c = binCentre();
        gA.el.style.transition = 'none'; gA.el.style.opacity = '1'; gA.el.classList.remove('g4c-yeeted', 'g4c-hidden'); gA.active = true; startW(gA, c.x, c.y);
        gB.el.classList.remove('g4c-hidden'); gB.active = true; startW(gB, c.x + 5, c.y - 5);
        hud(); showPopup('💥', 'It escaped!', 'And brought reinforcement...', true); later(hidePopup, 1800);
      }, 2800);
    }

    function endGame() {
      over = true; stopT();
      [gA, gB].forEach(function (g) { g.active = false; g.wan = false; });
      bin.classList.remove('g4c-shaking', 'g4c-active'); bin.classList.add('g4c-tip');
      var c = binCentre();
      function rollOut(g, ox) {
        g.el.classList.remove('g4c-yeeted', 'g4c-hidden'); g.el.style.transition = 'none'; g.el.style.opacity = '1'; g.el.style.transform = 'translate(-50%,-50%)';
        setP(g, c.x + ox, c.y); g.el.style.setProperty('--rx', (ox > 0 ? 130 : -130) + 'px'); g.el.style.setProperty('--rd', '1.5s');
        later(function () { g.el.classList.add('g4c-dead'); }, 100);
      }
      later(function () { rollOut(gA, -8); rollOut(gB, 8); }, 350);
      later(function () {
        confetti(); finalEl.textContent = fmtMs(finalMs);
        win.classList.add('g4c-show'); later(function () { try { initInput.focus({ preventScroll: !FULL }); } catch (e) { /* old browser */ } }, 500);
        refreshLb();
      }, 1500);
    }

    function showPopup(e, t, s, bad) { pE.textContent = e; pT.textContent = t; pS.textContent = s; popup.className = 'g4c-popup' + (bad ? ' g4c-bad' : '') + ' g4c-show'; }
    function hidePopup() { popup.classList.remove('g4c-show'); }

    /* ---- the leaderboard */
    function renderLb(tbl, scores, hiMs) {
      tbl.textContent = '';
      if (!scores || !scores.length) {
        var tr0 = tbl.insertRow(), td0 = tr0.insertCell(); td0.colSpan = 4; td0.className = 'g4c-empty'; td0.textContent = 'No scores yet. Be first.';
        return;
      }
      var medals = ['🏆', '🥈', '🥉'], marked = false;
      scores.slice(0, 10).forEach(function (s, i) {
        var tr = tbl.insertRow();
        if (!marked && hiMs && s.score === hiMs) { tr.className = 'g4c-new'; marked = true; }
        var cells = [[i < 3 ? medals[i] : String(i + 1), 'g4c-rank'], [String(s.name || '???').slice(0, 3), 'g4c-name'], [fmtMs(Number(s.score) || 0), 'g4c-time'], [dayOf(s.at || s.date), 'g4c-date']];
        cells.forEach(function (c) { var td = tr.insertCell(); td.className = c[1]; td.textContent = c[0]; });
      });
    }
    function clean(list) {
      return (Array.isArray(list) ? list : []).filter(function (s) { return s && /^[A-Z0-9]{1,3}$/.test(String(s.name)) && Number(s.score) > 0; })
        .sort(function (a, b) { return a.score - b.score; }).slice(0, 10);
    }
    function fetchScores() {
      return Promise.resolve().then(function () { return SCORES.get(BOARD); }).then(clean, function () { return clean(localBoard(BOARD)); });
    }
    function refreshLb() {
      var empty = !lbTable.rows.length || /g4c-empty/.test(lbTable.innerHTML);
      if (empty) { lbTable.textContent = ''; var tr = lbTable.insertRow(), td = tr.insertCell(); td.colSpan = 4; td.className = 'g4c-empty'; td.textContent = 'Loading…'; }
      fetchScores().then(function (sc) { if (alive) renderLb(lbTable, sc); });
    }
    function submitScore() {
      var raw = initInput.value.replace(/[^A-Za-z0-9]/g, '').toUpperCase().slice(0, 3);
      if (!raw) { initInput.focus(); initInput.classList.add('g4c-bad'); return; }
      initBtn.disabled = true; initBtn.textContent = 'Saving...';
      var ms = finalMs;
      Promise.resolve().then(function () { return SCORES.put(BOARD, raw, ms); }).then(function (d) {
        /* Refused (one score a little while per visitor) or unreachable: the player still sees their time, kept in this browser. */
        return d && !d.error && Array.isArray(d.scores) ? clean(d.scores) : clean(localAdd(BOARD, raw, ms));
      }, function () { return clean(localAdd(BOARD, raw, ms)); }).then(function (sc) {
        if (!alive) return;
        initPanel.hidden = true; winLb.hidden = false;
        renderLb(winLbTable, sc, ms); renderLb(lbTable, sc, ms);
      });
    }

    /* ---- confetti, the site's, inside the game unless the page gave the whole window (opt.fullscreen) */
    function confetti() {
      if (confettiStop) confettiStop();
      var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reduce) return;
      var cv = document.createElement('canvas');
      cv.className = 'g4c-confetti' + (FULL ? ' g4c-full' : '');
      (FULL ? document.body : root).appendChild(cv);
      var W = FULL ? window.innerWidth : root.clientWidth, H = FULL ? window.innerHeight : root.clientHeight;
      cv.width = W; cv.height = H;
      var ctx = cv.getContext('2d'), stop = false, id = 0;
      var cols = ['#3ecf8e', '#27a870', '#d6f5e8', '#fff', '#fde68a', '#f59e0b', '#ef4444'];
      var acc = getComputedStyle(root).getPropertyValue('--g4-accent').trim();
      if (/^#[0-9a-f]{3,8}$/i.test(acc)) { cols[0] = acc; }
      var p = [];
      for (var i = 0; i < 150; i++) p.push({ x: Math.random() * W, y: -10 - Math.random() * 180, w: 5 + Math.random() * 7, h: 9 + Math.random() * 5, c: cols[Math.floor(Math.random() * cols.length)], vx: (Math.random() - 0.5) * 4, vy: 2 + Math.random() * 3.5, rot: Math.random() * 360, rv: (Math.random() - 0.5) * 7, dead: false });
      function done() { stop = true; cancelAnimationFrame(id); if (cv.parentNode) cv.parentNode.removeChild(cv); confettiStop = null; }
      function draw() {
        if (stop || !alive) return done();
        ctx.clearRect(0, 0, W, H);
        var any = false;
        p.forEach(function (o) {
          if (o.dead) return;
          o.x += o.vx; o.y += o.vy; o.vy += 0.06; o.rot += o.rv;
          if (o.y > H + 20) { o.dead = true; return; }
          any = true;
          ctx.save(); ctx.translate(o.x, o.y); ctx.rotate(o.rot * Math.PI / 180); ctx.fillStyle = o.c; ctx.globalAlpha = 0.88; ctx.fillRect(-o.w / 2, -o.h / 2, o.w, o.h); ctx.restore();
        });
        if (any) id = requestAnimationFrame(draw); else done();
      }
      confettiStop = done;
      draw();
    }

    function reset() {
      timers.slice().forEach(clearTimeout); timers = []; shakeTmr = null;
      if (confettiStop) confettiStop();
      cancelAnimationFrame(tRaf);
      caught = 0; p2 = false; over = false; trojanUp = false; trojanUsed = false; tStart = 0; tRun = false; finalMs = 0; hintHidden = false;
      ALL.forEach(function (g) {
        g.active = false; g.wan = false; g.drag = false; g.pid = null;
        g.el.classList.remove('g4c-caught', 'g4c-yeeted', 'g4c-dead'); g.el.classList.add('g4c-hidden');
        g.el.style.display = ''; g.el.style.opacity = ''; g.el.style.transform = ''; g.el.style.transition = 'none';
      });
      bin.className = 'g4c-bin'; popup.className = 'g4c-popup';
      catchFlash.className = 'g4c-flash'; spillFlash.className = 'g4c-spill';
      hint.classList.remove('g4c-hide');
      timerEl.textContent = '0.0s'; timerEl.classList.remove('g4c-stopped');
      win.classList.remove('g4c-show'); initPanel.hidden = false; winLb.hidden = true;
      initInput.value = ''; initInput.classList.remove('g4c-bad'); initBtn.disabled = false; initBtn.textContent = 'Save ✓';
      gA.el.classList.remove('g4c-hidden'); gA.active = true;
      hud(); startW(gA, 50, 45);
    }

    var downs = ALL.map(function (g) { var f = function (e) { grabStart(g, e); }; g.el.addEventListener('pointerdown', f); return f; });
    ALL.forEach(function (g) {
      g.el.addEventListener('pointermove', onMove);
      g.el.addEventListener('pointerup', onEnd);
      g.el.addEventListener('pointercancel', onEnd);
    });
    initBtn.addEventListener('click', submitScore);
    initInput.addEventListener('keydown', function (e) { if (e.key === 'Enter') submitScore(); });
    initInput.addEventListener('input', function () { initInput.classList.remove('g4c-bad'); initInput.value = initInput.value.replace(/[^A-Za-z0-9]/g, '').toUpperCase().slice(0, 3); });
    againBtn.addEventListener('click', reset);
    reset(); refreshLb(); raf = requestAnimationFrame(frame);
    return { destroy: function () {
      alive = false; cancelAnimationFrame(raf); cancelAnimationFrame(tRaf); timers.forEach(clearTimeout); timers = [];
      if (confettiStop) confettiStop();
      if (win.parentNode && win.parentNode !== root) win.parentNode.removeChild(win);
      ALL.forEach(function (g, i) { g.el.removeEventListener('pointerdown', downs[i]); });
    } };
  }

  /* ---------------------------------------------------------------- Fly and spray
     From Vantage Drones' 404 page, made general (Jay, 15 Oct 2026: "for Enchanted Entertainment ...
     you'd be a fairy, not a drone, and you'd be dropping fairy dust ... the water blasting client
     would ... blast water"). Inside the field the pointer is the flyer. Tap or click to spray; arrow
     keys fly it and Space sprays. No timer, no losing. A skin is what flies, what it clears, the
     field, and the words. PlainBlack picks the skin for each client. */
  var ROT = function (cx, cy) { return '<g class="g4-rot"><line x1="' + (cx - 5) + '" y1="' + cy + '" x2="' + (cx + 5) + '" y2="' + cy + '"/><line x1="' + cx + '" y1="' + (cy - 5) + '" x2="' + cx + '" y2="' + (cy + 5) + '"/></g>'; };
  var FLY = {
    drone: {
      name: 'Spray drone', field: 'color-mix(in srgb,#6f9258 14%,transparent)', mist: 'var(--g4-accent)', place: 'Paddock',
      verb: 'Sprayed', hint: 'Fly the drone · click or tap to spray', who: 'the drone', act: 'spray',
      flyer: '<svg viewBox="0 0 48 48" width="48" height="48"><ellipse cx="24" cy="41" rx="9" ry="2.6" fill="rgba(0,0,0,.18)"/>' +
        '<g stroke="currentColor" stroke-width="3" stroke-linecap="round"><line x1="24" y1="24" x2="11" y2="11"/><line x1="24" y1="24" x2="37" y2="11"/><line x1="24" y1="24" x2="11" y2="37"/><line x1="24" y1="24" x2="37" y2="37"/></g>' +
        '<g fill="color-mix(in srgb,var(--g4-accent) 18%,transparent)"><circle cx="11" cy="11" r="8"/><circle cx="37" cy="11" r="8"/><circle cx="11" cy="37" r="8"/><circle cx="37" cy="37" r="8"/></g>' +
        '<g stroke="var(--g4-accent)" stroke-width="2" stroke-linecap="round">' + ROT(11, 11) + ROT(37, 11) + ROT(11, 37) + ROT(37, 37) + '</g>' +
        '<circle cx="24" cy="24" r="7" fill="var(--g4-accent)"/><circle cx="24" cy="24" r="3" fill="#fff" opacity=".7"/></svg>',
      target: '<svg viewBox="0 0 30 34" width="30" height="34"><path d="M15 34 C15 24 15 19 15 12" stroke="#3C6B3F" stroke-width="2" fill="none" stroke-linecap="round"/>' +
        '<path d="M15 23 C8 21 5 16 5 11 C11 12 14 16 15 22 Z" fill="#6F9258"/><path d="M15 25 C22 23 25 18 25 13 C19 14 16 18 15 24 Z" fill="#7E9B6A"/>' +
        '<path d="M15 17 C11 14 10 9 11 5 C15 7 16 12 15 17 Z" fill="#5B7E46"/><circle cx="15" cy="6.5" r="3.2" fill="#C68A2E"/><circle cx="15" cy="6.5" r="1.3" fill="#E8B65A"/></svg>'
    },
    fairy: {
      name: 'Fairy and fairy dust', field: 'linear-gradient(180deg,color-mix(in srgb,#8b6fd6 16%,transparent),color-mix(in srgb,#6f9258 14%,transparent))', mist: '#f5c542', place: 'Garden',
      verb: 'Sparkled', hint: 'Fly the fairy · tap to sprinkle fairy dust', who: 'the fairy', act: 'sprinkle fairy dust', bloom: true,
      flyer: '<svg viewBox="0 0 48 48" width="48" height="48"><ellipse cx="24" cy="44" rx="7" ry="2" fill="rgba(0,0,0,.15)"/>' +
        '<g class="g4-wing" fill="rgba(200,180,255,.75)" stroke="rgba(140,110,220,.9)" stroke-width="1"><ellipse cx="14" cy="18" rx="10" ry="7" transform="rotate(-25 14 18)"/><ellipse cx="34" cy="18" rx="10" ry="7" transform="rotate(25 34 18)"/>' +
        '<ellipse cx="16" cy="27" rx="7" ry="4.5" transform="rotate(20 16 27)"/><ellipse cx="32" cy="27" rx="7" ry="4.5" transform="rotate(-20 32 27)"/></g>' +
        '<path d="M24 22 L17 37 L31 37 Z" fill="var(--g4-accent)"/><circle cx="24" cy="16" r="5.5" fill="#f6d2b8"/><path d="M18.5 15 Q24 7 29.5 15 Q27 11 24 11 Q21 11 18.5 15 Z" fill="#7a4b2a"/>' +
        '<line x1="30" y1="25" x2="39" y2="16" stroke="#7a4b2a" stroke-width="1.6" stroke-linecap="round"/><path d="M39 11.5 L40.3 14.7 L43.6 15 L41 17.1 L41.8 20.4 L39 18.6 L36.2 20.4 L37 17.1 L34.4 15 L37.7 14.7 Z" fill="#f5c542"/></svg>',
      target: '<svg viewBox="0 0 30 34" width="30" height="34"><path d="M15 34 C15 26 14 22 12 17" stroke="#7d8a76" stroke-width="2" fill="none" stroke-linecap="round"/>' +
        '<path d="M14 27 C9 26 7 23 6 20 C10 20 13 23 14 27 Z" fill="#9aa595"/><g fill="#b9b4bd"><ellipse cx="9" cy="14" rx="4" ry="2.6" transform="rotate(35 9 14)"/>' +
        '<ellipse cx="13" cy="19" rx="4" ry="2.6" transform="rotate(80 13 19)"/><ellipse cx="7" cy="19" rx="4" ry="2.6" transform="rotate(-20 7 19)"/></g><circle cx="10" cy="17" r="2.4" fill="#9a9590"/></svg>',
      bloomed: '<svg viewBox="0 0 30 34" width="30" height="34"><path d="M15 34 C15 24 15 19 15 12" stroke="#4f8a46" stroke-width="2" fill="none" stroke-linecap="round"/>' +
        '<path d="M15 25 C9 24 7 20 6 17 C11 17 14 21 15 25 Z" fill="#6fb058"/><g fill="#f28ac0"><circle cx="15" cy="4.5" r="3.6"/><circle cx="20" cy="8" r="3.6"/><circle cx="18" cy="13" r="3.6"/><circle cx="12" cy="13" r="3.6"/><circle cx="10" cy="8" r="3.6"/></g>' +
        '<circle cx="15" cy="9" r="3" fill="#f5c542"/></svg>'
    },
    water: {
      name: 'Water blaster', field: 'repeating-linear-gradient(90deg,color-mix(in srgb,currentColor 7%,transparent) 0 58px,color-mix(in srgb,currentColor 12%,transparent) 58px 60px)', mist: '#3aa0e8', place: 'Driveway',
      verb: 'Blasted', hint: 'Aim the blaster · click or tap to blast', who: 'the blaster', act: 'blast',
      flyer: '<svg viewBox="0 0 48 48" width="48" height="48"><ellipse cx="24" cy="42" rx="9" ry="2.6" fill="rgba(0,0,0,.15)"/>' +
        '<rect x="21" y="27" width="6" height="15" rx="2" fill="currentColor" opacity=".7"/><rect x="14" y="20" width="20" height="10" rx="4" fill="var(--g4-accent)"/>' +
        '<rect x="20" y="8" width="8" height="14" rx="2" fill="currentColor" opacity=".8"/><rect x="18.5" y="5" width="11" height="5" rx="2" fill="var(--g4-accent)"/>' +
        '<circle cx="24" cy="25" r="2.4" fill="#fff" opacity=".8"/><g fill="#3aa0e8" opacity=".8"><circle cx="20" cy="2.5" r="1.2"/><circle cx="24" cy="1.5" r="1.4"/><circle cx="28" cy="2.5" r="1.2"/></g></svg>',
      target: '<svg viewBox="0 0 34 30" width="34" height="30"><g fill="#5a6b3a" opacity=".9"><ellipse cx="17" cy="17" rx="13" ry="9"/><ellipse cx="9" cy="12" rx="6" ry="5"/><ellipse cx="25" cy="11" rx="7" ry="5"/></g>' +
        '<g fill="#7d8f4e"><circle cx="12" cy="17" r="3"/><circle cx="21" cy="19" r="3.5"/><circle cx="24" cy="12" r="2.5"/><circle cx="9" cy="11" r="2"/></g><g fill="#3e4a27"><circle cx="16" cy="13" r="1.4"/><circle cx="27" cy="18" r="1.2"/></g></svg>'
    }
  };
  function fly(root, skinId) {
    var SK = FLY[skinId] || FLY.drone, KEY = 'fly-' + (FLY[skinId] ? skinId : 'drone');
    var SPRAY_R = 60, MAX = 6;
    root.classList.add('g4-sp');
    root.innerHTML = '<div class="g4-top"><span>' + SK.verb + ' <b data-g4="n">0</b></span><span class="g4-dim">Best <b data-g4="best">0</b></span></div>' +
      '<div class="g4-box" tabindex="0"><div class="g4-hint"></div></div>' +
      '<div class="g4-top" style="margin:8px 0 0"><span class="g4-dim">Or use the arrow keys and Space.</span><button type="button" class="g4-btn" data-g4="new">Start again</button></div>';
    var box = root.querySelector('.g4-box'), q = function (k) { return root.querySelector('[data-g4="' + k + '"]'); };
    box.style.background = SK.field;
    box.setAttribute('aria-label', SK.place + ': move ' + SK.who + ' with the mouse or arrow keys, click or Space to ' + SK.act);
    root.querySelector('.g4-hint').textContent = SK.hint;
    var drone = document.createElement('div');
    drone.className = 'g4-drone';
    drone.innerHTML = SK.flyer;
    box.appendChild(drone);
    var alive = true, raf = 0, iv = 0, weeds = [], score = 0, px = 0, py = 0, tilt = 0, keys = {}, kvx = 0, kvy = 0, usingKeys = false;
    q('best').textContent = best(KEY);
    function size() { return { w: box.clientWidth, h: box.clientHeight }; }
    function placeDrone() { drone.style.transform = 'translate(' + (px - 24) + 'px,' + (py - 24) + 'px) rotate(' + tilt + 'deg)'; }
    function spawn() {
      var s = size(); if (s.w < 60) return;
      var w = { x: 30 + Math.random() * (s.w - 60), y: 40 + Math.random() * (s.h - 60), el: document.createElement('div'), alive: true };
      w.el.className = 'g4-weed'; w.el.innerHTML = SK.target; w.el.style.left = w.x + 'px'; w.el.style.top = w.y + 'px';
      box.appendChild(w.el); weeds.push(w);
      requestAnimationFrame(function () { w.el.classList.add('grown'); });
    }
    function doSpray() {
      root.querySelector('.g4-hint').classList.add('gone');
      var m = document.createElement('div'); m.className = 'g4-mist'; m.style.left = px + 'px'; m.style.top = py + 'px';
      m.style.background = 'radial-gradient(circle,color-mix(in srgb,' + SK.mist + ' 50%,transparent) 0%,transparent 70%)';
      box.appendChild(m); setTimeout(function () { m.remove(); }, 560);
      drone.classList.add('spraying'); setTimeout(function () { drone.classList.remove('spraying'); }, 170);
      var hit = 0;
      weeds.forEach(function (w) {
        if (!w.alive) return;
        var dx = w.x - px, dy = w.y - py;
        if (dx * dx + dy * dy < SPRAY_R * SPRAY_R) {
          w.alive = false; hit++;
          /* A fairy brings a flower to life, then it fades; the others clear what they hit. */
          if (SK.bloom) { w.el.innerHTML = SK.bloomed; setTimeout(function () { w.el.classList.add('cleared'); }, 700); setTimeout(function () { w.el.remove(); weeds.splice(weeds.indexOf(w), 1); }, 1060); }
          else { w.el.classList.add('cleared'); setTimeout(function () { w.el.remove(); weeds.splice(weeds.indexOf(w), 1); }, 360); }
        }
      });
      if (hit) {
        score += hit; q('n').textContent = score;
        if (score > best(KEY)) { best(KEY, score); q('best').textContent = score; }
      }
    }
    function local(e) { var r = box.getBoundingClientRect(); px = e.clientX - r.left; py = e.clientY - r.top; }
    function onMove(e) { var ox = px; usingKeys = false; local(e); tilt = Math.max(-16, Math.min(16, (px - ox) * 0.7)); }
    function onDown(e) { if (e.pointerType === 'mouse' && e.button !== 0) return; usingKeys = false; local(e); placeDrone(); doSpray(); }
    var MAP = { arrowleft: 'l', a: 'l', arrowright: 'r', d: 'r', arrowup: 'u', w: 'u', arrowdown: 'd', s: 'd' };
    function onKey(e) {
      var k = e.key.toLowerCase();
      if (k === ' ' || k === 'enter') { e.preventDefault(); doSpray(); return; }
      if (MAP[k]) { e.preventDefault(); usingKeys = true; keys[MAP[k]] = true; }
    }
    function onKeyUp(e) { var d = MAP[e.key.toLowerCase()]; if (d) keys[d] = false; }
    function loop() {
      if (!alive) return;
      if (usingKeys) {
        var s = size();
        if (keys.l) kvx -= 0.85; if (keys.r) kvx += 0.85; if (keys.u) kvy -= 0.85; if (keys.d) kvy += 0.85;
        kvx = Math.max(-9, Math.min(9, kvx * 0.85)); kvy = Math.max(-9, Math.min(9, kvy * 0.85));
        px = Math.max(12, Math.min(s.w - 12, px + kvx)); py = Math.max(12, Math.min(s.h - 12, py + kvy));
        tilt = Math.max(-16, Math.min(16, kvx * 1.7));
      } else tilt *= 0.88;
      placeDrone();
      raf = requestAnimationFrame(loop);
    }
    function reset() {
      weeds.forEach(function (w) { w.el.remove(); }); weeds = []; score = 0; q('n').textContent = '0';
      for (var i = 0; i < 3; i++) spawn();
    }
    box.addEventListener('pointermove', onMove);
    box.addEventListener('pointerdown', onDown);
    box.addEventListener('keydown', onKey);
    box.addEventListener('keyup', onKeyUp);
    q('new').addEventListener('click', reset);
    var s0 = size(); px = s0.w / 2; py = s0.h / 2;
    reset();
    iv = setInterval(function () { if (weeds.filter(function (w) { return w.alive; }).length < MAX) spawn(); }, 950);
    raf = requestAnimationFrame(loop);
    return { destroy: function () { alive = false; cancelAnimationFrame(raf); clearInterval(iv); } };
  }

  var GAMES = {
    'block-out': { name: 'Block Out', blurb: 'Dots and boxes against the computer. Draw one line a turn; close off a square and it is yours, and you go again.', run: blockOut, skins: {} },
    'catch': { name: 'Catch and bin', blurb: 'Grab the troublemakers and drag them into the bin before they get away. It speeds up, and watch out for the trojan. Twenty to win.', run: catchBin, skins: CATCH },
    'fly': { name: 'Fly and spray', blurb: 'Fly over the field and clear what is there. No timer, no losing.', run: fly, skins: FLY }
  };
  function skinList(g) { return Object.keys(g.skins).map(function (k) { return { id: k, name: g.skins[k].name }; }); }

  window.PB404Games = {
    list: Object.keys(GAMES).map(function (id) { return { id: id, name: GAMES[id].name, blurb: GAMES[id].blurb, skins: skinList(GAMES[id]) }; }),
    mount: function (el, id, opt) {
      addCss();
      var g = GAMES[id] || GAMES['block-out'];
      el.innerHTML = '';
      var root = document.createElement('div');
      root.className = 'g4';
      var accent = opt && /^#[0-9a-f]{3,8}$/i.test(String(opt.accent || '')) ? opt.accent : '';
      if (accent) root.style.setProperty('--g4-accent', accent);
      el.appendChild(root);
      root.style.setProperty('--g4-page', pageColour(el));
      var game = g.run(root, opt && opt.skin, opt || {});
      return { destroy: function () { game.destroy(); if (root.parentNode) root.parentNode.removeChild(root); } };
    }
  };
})();
