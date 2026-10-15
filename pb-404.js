/* PlainBlack's 404 page for a client's website (16 Oct 2026, the 404 page mod). The master copy is this file,
   demo/site/pb-404.js: every client's website carries the same bytes, beside pb-404-games.js (a copy of the hub's
   demo/assets/js/hub-404-games.js, which draws the games).

   The website's 404 page marks its parts and adds both scripts before </body>:
     <div data-pb-404>
       <h1 data-pb-404="headline">Words shown if the link cannot be read</h1>
       <p data-pb-404="message">...</p>
       <div data-pb-404="links"><a class="btn" href="/">Home</a></div>   link 1 dresses button 1, and so on
       <div data-pb-404="game"></div>
     </div>
     <script src="/pb-404-games.js" defer></script>
     <script src="/pb-404.js" data-feed="https://client.plainblackcreative.com/custom/notfound/<feed id>"
             data-accent="#06cc5d" data-game="catch" data-skin="bad-ideas" data-home="Back to Example" defer></script>
     data-home is optional: the words on the win screen's button home (the first link's words if not given).

   What it does, once:
     1. Tells the feed which address was not there (never for /404 itself), so it is on the client's dashboard.
        If the dashboard says where that address should go, the visitor is sent straight there.
     2. Puts the dashboard's headline, message and links in the marked parts, as plain text. Until the page is
        saved on the dashboard, or if the feed cannot be read in 4 seconds, the website's own words stay.
     3. Starts the game the dashboard chose (or data-game / data-skin when there is none) in the game part, with the
        client's leaderboard (the feed's /scores/<board>; this browser's if the feed is not set).
   It sends nothing else and reads nothing but the feed. */
(function () {
  'use strict';
  var me = document.currentScript;
  var FEED = (me && me.getAttribute('data-feed')) || '';
  if (!/^https:\/\/client\.plainblackcreative\.com\/custom\/notfound\/[a-z2-7]{16}$|^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?\//.test(FEED)) FEED = '';
  var ACCENT = (me && me.getAttribute('data-accent')) || '';
  var HOME_LABEL = (me && me.getAttribute('data-home')) || '';
  var FALLBACK = { game: (me && me.getAttribute('data-game')) || '', skin: (me && me.getAttribute('data-skin')) || '' };
  var done = false;

  function part(name) { return document.querySelector('[data-pb-404="' + name + '"]'); }
  function samePath(v) { return typeof v === 'string' && /^\/[^\s"'<>\\`]*$/.test(v) && v.indexOf('//') !== 0; }
  /* Words the page already shows are left as they are, so the website's own styling inside them (a coloured word) stays. */
  function same(a, b) { return String(a).replace(/\s+/g, ' ').trim() === String(b).replace(/\s+/g, ' ').trim(); }
  function words(el, v) { if (el && typeof v === 'string' && v && !same(el.innerText || el.textContent, v)) el.textContent = v; }
  function links(list) {
    var box = part('links');
    if (!box || !Array.isArray(list) || !list.length) return;
    var patterns = [].slice.call(box.querySelectorAll('a'));
    box.textContent = '';
    list.slice(0, 3).forEach(function (l, i) {
      if (!l || typeof l.label !== 'string' || !samePath(l.url)) return;
      var pattern = patterns[i] || patterns[patterns.length - 1];
      var a = pattern ? pattern.cloneNode(false) : document.createElement('a');
      a.href = l.url; a.textContent = l.label;
      box.appendChild(a);
    });
  }
  /* The client's leaderboard, through the feed. A refusal comes back as { error, scores } and the game shows the
     player's time anyway. */
  var SCORES = FEED ? {
    get: function (board) {
      return fetch(FEED + '/scores/' + board, { credentials: 'omit' }).then(function (r) { return r.json(); })
        .then(function (d) { if (!d || !Array.isArray(d.scores)) throw new Error('no scores'); return d.scores; });
    },
    put: function (board, name, score) {
      return fetch(FEED + '/scores/' + board, { method: 'POST', headers: { 'Content-Type': 'text/plain' }, credentials: 'omit',
        body: JSON.stringify({ name: name, score: score }) }).then(function (r) { return r.json(); });
    }
  } : undefined;
  function home() {
    var a = part('links') && part('links').querySelector('a[href]');
    var href = a ? a.getAttribute('href') : '/';
    if (!samePath(href)) href = '/';
    var label = HOME_LABEL || (a && a.textContent.replace(/\s+/g, ' ').trim()) || 'Home';
    return { href: href, label: label.slice(0, 60) };
  }
  function game(id, skin) {
    var box = part('game');
    if (!box || !id) return;
    var start = function () {
      var G = window.PB404Games;
      if (!G || !G.list.some(function (g) { return g.id === id; })) return;
      G.mount(box, id, { accent: /^#[0-9a-f]{3,8}$/i.test(ACCENT) ? ACCENT : undefined, skin: skin || undefined,
        scores: SCORES, home: home(), fullscreen: true });
    };
    if (window.PB404Games) start(); else window.addEventListener('load', start);
  }
  function show(page) {
    if (done) return;
    done = true;
    if (page && typeof page === 'object') {
      words(part('headline'), page.headline);
      var m = part('message');
      if (m && typeof page.message === 'string') { m.textContent = page.message; m.hidden = !page.message; }
      links(page.links);
      game(page.game, page.skin);
    } else game(FALLBACK.game, FALLBACK.skin);
  }

  var path = location.pathname + location.search;
  var report = !/^\/404(\.html)?\/?$/i.test(location.pathname);
  if (!FEED || !window.fetch) { show(null); return; }
  setTimeout(function () { show(null); }, 4000);
  var init = report
    ? { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ path: path, from: document.referrer || '' }), credentials: 'omit', keepalive: true }
    : { method: 'GET', credentials: 'omit' };
  fetch(FEED, init).then(function (r) { return r.ok ? r.json() : null; }).then(function (d) {
    if (d && samePath(d.sendTo) && d.sendTo !== path && !done) { done = true; location.replace(d.sendTo); return; }
    var go = function () { show(d && d.page); };
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', go); else go();
  }).catch(function () { show(null); });
})();
