/* A COPY of plainblack-client demo/assets/js/hub-404-games.js (the master). Change the master, then copy it here. */
/* ==========================================================================
   The hub engine, 15 Oct 2026: the games for the 404 page mod (hub-404.js).
   Jay, 15 Oct 2026: "pick which game you want on your site ... we just put
   them all in". One file, so the dashboard's preview and a client's own 404
   page run exactly the same game.

   ENGINE FILE: the same bytes for every client with the hub (see hub.js).
   No client's name, words or data belong here. It only defines
   window.PB404Games; it fetches nothing and sends nothing.

     PB404Games.list               [{ id, name, blurb }]
     PB404Games.mount(el, id, opt) draws game `id` into `el`, returns
                                   { destroy() }. opt: { accent: '#hex', skin }.
     Each list entry has skins [{ id, name }]: the same game dressed for a
     client (a drone, a fairy, a water blaster). PlainBlack picks the skin.

   The games:
     block-out  Block Out (new, Jay's): dots and boxes against the computer.
                Draw one line a turn; close off a square and it is yours and
                you go again. Most squares wins.
     catch      Catch and bin (from PlainBlack's own 404 page, "Bad ideas got
                loose"): drag them to the bin, faster and faster, twenty to
                win, and do not bin the trojan. Skins: gremlins (default), bad ideas.
     fly        Fly and spray (from Vantage Drones' 404 page): fly over the
                field and clear it. Skins: spray drone and weeds, fairy and
                fairy dust on wilting flowers, water blaster and moss.

   Each game stays inside `el` (no page-wide cursor, no listeners left after
   destroy). Text and lines take the colour of the page around them; the
   accent is the client's brand colour. Best scores are kept in this browser
   only. Classes are g4-*.
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
    /* Bad ideas */
    '.g4-bi .g4-box{height:250px;cursor:crosshair}',
    '.g4-bar{position:absolute;top:8px;left:10px;right:80px;height:3px;border-radius:2px;background:color-mix(in srgb,currentColor 10%,transparent);z-index:5}',
    '.g4-bar i{display:block;height:100%;width:0;border-radius:2px;background:var(--g4-accent);transition:width .3s}',
    '.g4-hud{position:absolute;top:4px;right:10px;font-size:12px;font-weight:700;opacity:.7;z-index:5}',
    '.g4-hint{position:absolute;top:22px;left:50%;transform:translateX(-50%);font-size:12px;font-weight:700;opacity:.6;white-space:nowrap;transition:opacity .4s;pointer-events:none;z-index:5}',
    '.g4-hint.gone{opacity:0}',
    '.g4-idea{position:absolute;width:50px;height:50px;transform:translate(-50%,-50%);cursor:grab;z-index:10;touch-action:none;animation:g4wig .45s ease-in-out infinite alternate}',
    '.g4-idea svg{width:100%;height:100%;filter:drop-shadow(0 3px 6px rgba(0,0,0,.35));pointer-events:none}',
    '.g4-idea.drag{animation:none;cursor:grabbing;filter:drop-shadow(0 0 10px var(--g4-accent))}',
    '.g4-idea.gone{display:none}',
    '.g4-idea.trojan{animation:g4float 1.1s ease-in-out infinite alternate}',
    '@keyframes g4wig{from{transform:translate(-50%,-50%) rotate(-5deg)}to{transform:translate(-50%,-50%) rotate(5deg) scale(1.06)}}',
    '@keyframes g4float{from{transform:translate(-50%,-50%) translateY(-3px)}to{transform:translate(-50%,-50%) translateY(3px)}}',
    '.g4-bin{position:absolute;right:14px;bottom:10px;width:44px;height:52px;z-index:5;transform-origin:bottom center;transition:transform .15s}',
    '.g4-bin.hot{transform:scale(1.18)}',
    '.g4-bin.shake{animation:g4shake .1s ease-in-out infinite}',
    '@keyframes g4shake{25%{transform:rotate(-7deg)}75%{transform:rotate(7deg)}}',
    '.g4-flash{position:absolute;inset:0;opacity:0;pointer-events:none;transition:opacity .2s;background:var(--g4-accent)}',
    '.g4-flash.on{opacity:.16}.g4-flash.bad{background:#dc2626}',
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
    '@media (prefers-reduced-motion:reduce){.g4-idea,.g4-drone .g4-rot,.g4-idea.trojan{animation:none}}'
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
     From PlainBlack's own 404 page ("Bad ideas got loose"), made general: drag the troublemaker into the bin. It speeds up as you go; at ten
     it escapes and brings a friend; near the end a shiny trojan turns up, and binning it spills
     everything back out. Twenty to win, against the clock. */
  var IDEA = function (a, b, d) {
    return '<svg viewBox="0 0 52 52"><ellipse cx="26" cy="28" rx="14" ry="13" fill="' + a + '"/><ellipse cx="26" cy="17" rx="12" ry="11" fill="' + b + '"/>' +
      '<polygon points="16,12 11,3 19,10" fill="' + b + '"/><polygon points="36,12 41,3 33,10" fill="' + b + '"/>' +
      '<ellipse cx="22" cy="16" rx="3.5" ry="3.5" fill="#fff"/><ellipse cx="30" cy="16" rx="3.5" ry="3.5" fill="#fff"/>' +
      '<circle cx="23" cy="17" r="2" fill="#1a1a1a"/><circle cx="31" cy="17" r="2" fill="#1a1a1a"/>' +
      '<line x1="18.5" y1="12.5" x2="24.5" y2="14.5" stroke="' + d + '" stroke-width="2" stroke-linecap="round"/><line x1="27.5" y1="14.5" x2="33.5" y2="12.5" stroke="' + d + '" stroke-width="2" stroke-linecap="round"/>' +
      '<path d="M20 22 Q26 18 32 22" stroke="' + d + '" stroke-width="1.8" fill="none" stroke-linecap="round"/>' +
      '<ellipse cx="20" cy="39" rx="4.5" ry="2.5" fill="' + d + '"/><ellipse cx="32" cy="39" rx="4.5" ry="2.5" fill="' + d + '"/>' +
      '<path d="M38 34 Q46 28 44 18 Q42 12 47 8" stroke="' + a + '" stroke-width="2.5" fill="none" stroke-linecap="round"/></svg>';
  };
  var TROJAN = '<svg viewBox="0 0 52 52"><ellipse cx="16" cy="18" rx="9" ry="6" fill="rgba(255,220,100,.45)" transform="rotate(-30 16 18)"/>' +
    '<ellipse cx="36" cy="18" rx="9" ry="6" fill="rgba(255,220,100,.45)" transform="rotate(30 36 18)"/><ellipse cx="26" cy="32" rx="8" ry="10" fill="#F59E0B"/>' +
    '<ellipse cx="26" cy="18" rx="10" ry="10" fill="#FDE68A"/><ellipse cx="22" cy="18" rx="2.8" ry="2.8" fill="#fff"/><ellipse cx="30" cy="18" rx="2.8" ry="2.8" fill="#fff"/>' +
    '<circle cx="22.5" cy="18.5" r="1.8" fill="#DC2626"/><circle cx="30.5" cy="18.5" r="1.8" fill="#DC2626"/><path d="M19 23 Q26 28 33 23" stroke="#D97706" stroke-width="1.5" fill="none" stroke-linecap="round"/></svg>';
  var BIN = '<svg viewBox="0 0 44 52" style="width:100%;height:100%"><rect x="3" y="8" width="38" height="5" rx="2.5" fill="currentColor" opacity=".55"/>' +
    '<rect x="16" y="4" width="12" height="5" rx="2" fill="currentColor" opacity=".55"/><path d="M7 13 L9 47 Q9 49 11 49 L33 49 Q35 49 35 47 L37 13 Z" fill="currentColor" opacity=".35"/>' +
    '<line x1="18" y1="17" x2="17" y2="45" stroke="var(--g4-accent)" stroke-width="2.5" stroke-linecap="round"/><line x1="26" y1="17" x2="25" y2="45" stroke="var(--g4-accent)" stroke-width="2.5" stroke-linecap="round"/></svg>';

  /* Skins: the words for what you catch. The first is the default. */
  var CATCH = {
    gremlins: { name: 'Gremlins', one: 'gremlin', many: 'gremlins' },
    'bad-ideas': { name: 'Bad ideas (PlainBlack)', one: 'bad idea', many: 'bad ideas' }
  };

  function catchBin(root, skinId) {
    var SK = CATCH[skinId] || CATCH.gremlins, ONE = SK.one, MANY = SK.many;
    var BEST = 'catch-' + (CATCH[skinId] ? skinId : 'gremlins') + '-ms';
    var TOTAL = 20, PHASE2 = 10, TROJAN_AT = 17, SLOW = 0.3, FAST = 1.7;
    root.classList.add('g4-bi');
    root.innerHTML = '<div class="g4-top"><span data-g4="label">Grab the ' + ONE + '. Drag it to the bin.</span><span data-g4="time">0.0s</span></div>' +
      '<div class="g4-box"><div class="g4-flash"></div><div class="g4-bar"><i></i></div><div class="g4-hud">Binned <b data-g4="n">0</b>/' + TOTAL + '</div>' +
      '<div class="g4-hint">Grab and drag to the bin</div><div class="g4-bin">' + BIN + '</div></div>' +
      '<div class="g4-top" style="margin:8px 0 0"><span class="g4-dim" data-g4="best"></span><button type="button" class="g4-btn" data-g4="new">Start again</button></div>';
    var box = root.querySelector('.g4-box'), bin = root.querySelector('.g4-bin'), flash = root.querySelector('.g4-flash'), msg = makeMsg(box);
    var q = function (k) { return root.querySelector('[data-g4="' + k + '"]'); };
    var alive = true, raf = 0, timers = [], caught, p2, trojanUsed, start, ended, drag = null;
    function later(fn, ms) { var t = setTimeout(function () { timers.splice(timers.indexOf(t), 1); if (alive) fn(); }, ms); timers.push(t); }
    function sprite(html, cls) {
      var el = document.createElement('div');
      el.className = 'g4-idea gone ' + (cls || '');
      el.innerHTML = html;
      box.appendChild(el);
      return { el: el, x: 50, y: 50, vx: 0, vy: 0, on: false, tr: cls === 'trojan' };
    }
    var A = sprite(IDEA('#DC2626', '#EF4444', '#B91C1C')), B = sprite(IDEA('#7C3AED', '#8B5CF6', '#6D28D9')), T = sprite(TROJAN, 'trojan');
    var all = [A, B, T];
    function fmt(ms) { var s = ms / 1000; return s < 60 ? s.toFixed(1) + 's' : Math.floor(s / 60) + 'm ' + (s % 60).toFixed(1) + 's'; }
    function speed() { return SLOW + (FAST - SLOW) * Math.min(caught, TOTAL) / TOTAL; }
    function place(g) { g.el.style.left = g.x + '%'; g.el.style.top = g.y + '%'; }
    function launch(g, x, y) {
      g.x = x; g.y = y; g.on = true; g.el.classList.remove('gone');
      var a = Math.random() * Math.PI * 2; g.vx = Math.cos(a); g.vy = Math.sin(a);
      place(g);
    }
    function hide(g) { g.on = false; g.el.classList.add('gone'); }
    function hud() {
      q('n').textContent = caught;
      root.querySelector('.g4-bar i').style.width = Math.round(caught / TOTAL * 100) + '%';
      q('label').textContent = T.on ? 'Something shiny turned up…' : p2 ? 'Two ' + MANY + '! Catch both.' : caught >= 7 ? 'Getting faster…' : 'Grab the ' + ONE + '. Drag it to the bin.';
      var b = best(BEST);
      q('best').textContent = b ? 'Your best: ' + fmt(b) : 'Twenty to win, against the clock.';
    }
    function loop() {
      if (!alive) return;
      var s = speed();
      all.forEach(function (g) {
        if (!g.on || g === (drag && drag.g)) return;
        g.x += g.vx * s; g.y += g.vy * s;
        if (g.x < 8 || g.x > 92) { g.vx *= -1; g.x = Math.max(8, Math.min(92, g.x)); }
        if (g.y < 10 || g.y > 90) { g.vy *= -1; g.y = Math.max(10, Math.min(90, g.y)); }
        if (Math.random() < 0.009) { var a = Math.random() * Math.PI * 2; g.vx = Math.cos(a); g.vy = Math.sin(a); }
        place(g);
      });
      if (start && !ended) q('time').textContent = fmt(Date.now() - start);
      raf = requestAnimationFrame(loop);
    }
    function overBin(cx, cy) { var r = bin.getBoundingClientRect(); return cx >= r.left - 8 && cx <= r.right + 8 && cy >= r.top - 8 && cy <= r.bottom + 8; }
    function down(e) {
      var g = all.filter(function (x) { return x.on && x.el === (e.target.closest && e.target.closest('.g4-idea')); })[0];
      if (!g || ended) return;
      e.preventDefault();
      if (!start) start = Date.now();
      root.querySelector('.g4-hint').classList.add('gone');
      drag = { g: g, id: e.pointerId };
      g.el.classList.add('drag');
      try { box.setPointerCapture(e.pointerId); } catch (x) {}
      move(e);
    }
    function move(e) {
      if (!drag || e.pointerId !== drag.id) return;
      var r = box.getBoundingClientRect(), g = drag.g;
      g.x = Math.max(3, Math.min(97, (e.clientX - r.left) / r.width * 100));
      g.y = Math.max(3, Math.min(97, (e.clientY - r.top) / r.height * 100));
      place(g);
      bin.classList.toggle('hot', overBin(e.clientX, e.clientY));
    }
    function up(e) {
      if (!drag || e.pointerId !== drag.id) return;
      var g = drag.g; drag = null;
      g.el.classList.remove('drag'); bin.classList.remove('hot');
      if (overBin(e.clientX, e.clientY)) binned(g);
    }
    function pulse(bad) { flash.className = 'g4-flash on' + (bad ? ' bad' : ''); later(function () { flash.className = 'g4-flash'; }, 300); }
    function binned(g) {
      hide(g);
      if (g.tr) {
        [A, B].forEach(hide);
        var spilled = caught; caught = 0; hud(); pulse(true);
        msg.show('It was a trojan!', spilled + ' ' + MANY + ' spilled back out…');
        later(function () { msg.hide(); p2 = true; launch(A, 70, 70); launch(B, 80, 60); hud(); }, 2200);
        return;
      }
      caught++; hud(); pulse(false);
      if (caught >= TOTAL) return win();
      if (!p2 && caught >= PHASE2) {
        p2 = true; bin.classList.add('shake');
        msg.show('It escaped!', 'And brought a friend…');
        later(function () { bin.classList.remove('shake'); msg.hide(); launch(A, 80, 70); launch(B, 75, 60); hud(); }, 2000);
        return;
      }
      later(function () {
        if (!trojanUsed && caught >= TROJAN_AT) { trojanUsed = true; hide(B); launch(T, 20 + Math.random() * 40, 20 + Math.random() * 50); hud(); return; }
        launch(g, 20 + Math.random() * 60, 20 + Math.random() * 60);
      }, 500);
    }
    function win() {
      ended = true; all.forEach(hide);
      var ms = Date.now() - start, b = best(BEST);
      if (!b || ms < b) best(BEST, ms);
      q('time').textContent = fmt(ms); hud();
      msg.show('All binned!', 'Your time: ' + fmt(ms) + (!b || ms < b ? ' · a new best' : ''), 'Play again', reset);
    }
    function reset() {
      timers.slice().forEach(clearTimeout); timers = [];
      caught = 0; p2 = false; trojanUsed = false; start = 0; ended = false; drag = null;
      all.forEach(hide); bin.classList.remove('shake'); msg.hide();
      root.querySelector('.g4-hint').classList.remove('gone');
      q('time').textContent = '0.0s';
      launch(A, 45, 50); hud();
    }
    box.addEventListener('pointerdown', down);
    box.addEventListener('pointermove', move);
    box.addEventListener('pointerup', up);
    box.addEventListener('pointercancel', up);
    q('new').addEventListener('click', reset);
    reset(); raf = requestAnimationFrame(loop);
    return { destroy: function () { alive = false; cancelAnimationFrame(raf); timers.forEach(clearTimeout); timers = []; } };
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
      var game = g.run(root, opt && opt.skin);
      return { destroy: function () { game.destroy(); if (root.parentNode) root.parentNode.removeChild(root); } };
    }
  };
})();
