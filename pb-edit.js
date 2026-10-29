/* PlainBlack "Edit on your website" helper (14 Oct 2026). One file, the same bytes on every website that has
   Edit your website; the master is this copy, beside the demo dashboard's sample website.

   INERT on a normal visit. It wakes only inside the dashboard's editing frame: the page is in a frame AND that frame is
   named "pb-cms-edit" (the name stays with the frame as the person clicks around the site, so every page they reach
   is editable). Then it:
     - outlines every marked part (data-cms, data-cms-img, data-cms-cards) and shows its name on hover;
     - tells the dashboard which page this is and which parts it has ("pb-cms-ready");
     - on a click on a marked part, tells the dashboard which part ("pb-cms-pick") instead of following a link;
     - lets every other link work, so the person browses their site as usual;
     - shows a change as it is made ("pb-cms-set": words, a photo, or a list of cards), and scrolls to a part the dashboard names ("pb-cms-focus").
   And every SECTION of the page takes a note (23 Oct 2026, Jay: "many sections wont accept a note"): the menu, every
   top-level <header>, <nav>, <section>, <article> and the footer, each named by its first heading. It lists them in
   "pb-cms-ready" (and again in "pb-cms-sections" once everything has loaded); a click anywhere in one that is not a
   marked part or a link tells the dashboard which ("pb-cms-section") and lets the click carry on, so menus, galleries
   and questions still open; "pb-cms-focus" with a section shows it; "pb-cms-notes" puts a count of open notes on each.
   What it sends is the page's path and part names, which the page already shows to anyone. It takes messages only
   from its parent, and only when that parent is a PlainBlack dashboard (or this same site, for the demo). It never
   saves anything: saving is the dashboard's, through the website's own server. */
(function () {
  'use strict';
  if (window.parent === window || window.name !== 'pb-cms-edit') return;
  var SEL = '[data-cms],[data-cms-img],[data-cms-cards]';
  var OK = /^https:\/\/client\.plainblackcreative\.com$|^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/;
  function keyOf(el) { return el.getAttribute('data-cms') || el.getAttribute('data-cms-img') || el.getAttribute('data-cms-cards') || ''; }
  function find(key) {
    return [].filter.call(document.querySelectorAll(SEL), function (el) { return keyOf(el) === key; })[0] || null;
  }
  /* A picture address the page may show: https, a data image, or this site's own file. */
  function safe(u) {
    if (typeof u !== 'string' || !u) return '';
    if (/^data:image\//.test(u)) return u;
    try { var x = new URL(u, location.href); return x.protocol === 'https:' || x.origin === location.origin ? x.href : ''; } catch (e) { return ''; }
  }
  /* Cards: a website may draw them itself (window.pbCmsCards(box, items)); otherwise each card already on the page
     takes its new picture, words and caption, a copy of the last card is added for a new one, and a removed one goes. */
  function cards(box, items) {
    if (typeof window.pbCmsCards === 'function') { try { window.pbCmsCards(box, items); return; } catch (e) {} }
    var kids = [].filter.call(box.children, function (k) { return k.tagName !== 'SCRIPT' && k.tagName !== 'TEMPLATE'; });
    if (!kids.length) return;
    items.forEach(function (c, i) {
      var card = kids[i];
      if (!card) { card = kids[kids.length - 1].cloneNode(true); box.appendChild(card); kids.push(card); }
      var pic = card.querySelector('img,video'), src = safe(c.src), video = c.type === 'video';
      if (pic && src) {
        if ((pic.tagName === 'VIDEO') !== video) {
          var n = document.createElement(video ? 'video' : 'img');
          n.className = pic.className; pic.parentNode.replaceChild(n, pic); pic = n;
        }
        pic.removeAttribute('srcset');
        pic.src = src;
        if (video) { pic.muted = true; pic.playsInline = true; pic.controls = true; if (safe(c.poster)) pic.poster = safe(c.poster); }
        else pic.alt = typeof c.alt === 'string' ? c.alt : '';
      }
      var t = card.querySelector('[data-cms-card-text]') || card.querySelector('p');
      if (t && typeof c.text === 'string') t.textContent = c.text;
      var cap = card.querySelector('[data-cms-card-caption]') || card.querySelector('figcaption');
      if (cap && typeof c.caption === 'string') { cap.textContent = c.caption; cap.hidden = !c.caption; }
      /* The extras a list may allow (data-cms-cards-extras): a tag, a link, the part of the picture that shows, hidden. */
      var chip = card.querySelector('[data-cms-card-chip]');
      if (chip && typeof c.chip === 'string') chip.textContent = c.chip;
      var a = card.tagName === 'A' ? card : card.querySelector('a');
      if (a && typeof c.link === 'string' && /^https:\/\//.test(c.link)) a.href = c.link;
      if (pic && pic.tagName === 'IMG') {
        pic.style.objectPosition = c.focal && typeof c.focal.x === 'number' ? c.focal.x + '% ' + c.focal.y + '%' : '';
        pic.style.transform = c.zoom > 100 ? 'scale(' + c.zoom / 100 + ')' : '';
      }
      card.style.opacity = c.hidden ? '.3' : '';
    });
    kids.slice(items.length).forEach(function (k) { k.parentNode.removeChild(k); });
  }
  function tell(msg) { msg.path = location.pathname; window.parent.postMessage(msg, '*'); }

  // ---------------------------------------------------------------- sections, for notes
  var SECS = 'header,nav,section,article,footer', secs = [], pins = [], counts = {};
  function shown(el) { if (el.hidden || el.closest('[hidden]')) return false; var c = getComputedStyle(el); return c.display !== 'none' && c.visibility !== 'hidden'; }
  function words(v, n) { v = String(v || '').replace(/\s+/g, ' ').trim(); return v.length > n ? v.slice(0, n - 1) + '\u2026' : v; }
  function secName(el, i) {
    var h = el.querySelector('h1,h2,h3'), t = words(h ? h.textContent : el.getAttribute('aria-label'), 90);
    if (t) return t;
    if (el.tagName === 'NAV' || el.tagName === 'HEADER') return 'Menu at the top';
    if (el.tagName === 'FOOTER') return 'Footer';
    return words(el.innerText || el.textContent, 60) || 'Part ' + (i + 1);
  }
  function secOf(el) { return el && el.closest ? el.closest('[data-pb-sec]') : null; }
  function collect() {
    var seen = {};
    secs = [].filter.call(document.querySelectorAll(SECS), function (el) { return !(el.parentElement && el.parentElement.closest(SECS)) && shown(el); });
    return secs.map(function (el, i) {
      var base = (el.tagName.toLowerCase() + '-' + (String(el.className || '').split(/\s+/)[0] || '')).replace(/[^a-z0-9-]/gi, '').toLowerCase().slice(0, 30), id = base, n = 2;
      while (seen[id]) { id = base + '-' + n; n += 1; }
      seen[id] = 1;
      el.setAttribute('data-pb-sec', id);
      return { id: id, name: secName(el, i) };
    });
  }
  function secById(id) { return secs.filter(function (el) { return el.getAttribute('data-pb-sec') === id; })[0] || null; }
  var tag = document.createElement('div');
  tag.style.cssText = 'position:absolute;z-index:2147483646;pointer-events:none;font:600 var(--t-caption,13px)/1.2 system-ui,Arial,sans-serif;padding:5px 9px;border-radius:0 0 8px 0;background:#475569;color:#fff;display:none';
  function at(el, box) { var r = el.getBoundingClientRect(); box.style.left = (r.left + window.scrollX) + 'px'; box.style.top = (r.top + window.scrollY) + 'px'; }
  function pinAll() {
    pins.forEach(function (p) { if (p.parentNode) p.parentNode.removeChild(p); });
    pins = [];
    Object.keys(counts).forEach(function (id) {
      var el = secById(id), n = counts[id];
      if (!el || !n) return;
      var b = document.createElement('div');
      b.style.cssText = 'position:absolute;z-index:2147483645;pointer-events:none;font:600 var(--t-caption,13px)/1 system-ui,Arial,sans-serif;padding:5px 8px;border-radius:999px;background:#b91c1c;color:#fff';
      b.textContent = n + (n === 1 ? ' note' : ' notes');
      document.body.appendChild(b);
      var r = el.getBoundingClientRect();
      b.style.top = (r.top + window.scrollY + 8) + 'px';
      b.style.left = (r.right + window.scrollX - b.offsetWidth - 10) + 'px';
      pins.push(b);
    });
  }
  document.addEventListener('mouseover', function (e) {
    var el = secOf(e.target);
    if (!el || (e.target.closest && e.target.closest(SEL))) { tag.style.display = 'none'; return; }
    if (!tag.parentNode) document.body.appendChild(tag);
    tag.textContent = 'Leave a note: ' + secName(el, secs.indexOf(el));
    tag.style.display = 'block';
    at(el, tag);
  });
  window.addEventListener('resize', pinAll);

  var css = document.createElement('style');
  css.textContent = '[data-pb-sec]:hover{outline:2px dashed rgba(71,85,105,.45);outline-offset:-2px}[data-pb-sec].pb-sec-on{outline:3px solid #475569!important;outline-offset:-3px}' +
    SEL.split(',').map(function (s) { return s + ':not([hidden])'; }).join(',') +
    '{outline:2px dashed rgba(37,99,235,.6)!important;outline-offset:3px;cursor:pointer!important}' +
    SEL.split(',').map(function (s) { return s + ':hover'; }).join(',') + ',.pb-cms-on{outline:3px solid #2563eb!important;outline-offset:3px}';
  (document.head || document.documentElement).appendChild(css);

  document.addEventListener('click', function (e) {
    var el = e.target && e.target.closest ? e.target.closest(SEL) : null;
    if (!el) {
      /* Not a marked part: a link browses as usual; anywhere else in a section picks it for a note, and the click carries on. */
      var sec = secOf(e.target);
      if (sec && !(e.target.closest && e.target.closest('a[href]'))) tell({ type: 'pb-cms-section', part: sec.getAttribute('data-pb-sec') });
      return;
    }
    e.preventDefault();
    e.stopPropagation();
    tell({ type: 'pb-cms-pick', key: keyOf(el) });
  }, true);

  window.addEventListener('message', function (e) {
    if (e.source !== window.parent || !(OK.test(e.origin) || e.origin === location.origin)) return;
    var m = e.data || {}, el = typeof m.key === 'string' ? find(m.key) : null;
    if (m.type === 'pb-cms-set' && el) {
      if (el.hasAttribute('data-cms-cards')) {
        if (Array.isArray(m.items) && m.items.length) cards(el, m.items.slice(0, 40));
      } else if (el.hasAttribute('data-cms-img')) {
        if (typeof m.value === 'string' && /^(https:|data:image\/)/.test(m.value)) { el.removeAttribute('srcset'); el.src = m.value; }
        if (typeof m.alt === 'string') el.alt = m.alt;
      } else if (el.hasAttribute('data-cms') && typeof m.value === 'string') {
        el.textContent = m.value;
        if (el.hasAttribute('data-cms-optional')) el.hidden = !m.value;
      }
    } else if (m.type === 'pb-cms-focus') {
      [].forEach.call(document.querySelectorAll('.pb-cms-on,.pb-sec-on'), function (x) { x.classList.remove('pb-cms-on'); x.classList.remove('pb-sec-on'); });
      var sec = typeof m.section === 'string' ? secById(m.section) : null;
      if (sec) { sec.classList.add('pb-sec-on'); if (m.scroll !== false) sec.scrollIntoView({ block: 'start', behavior: 'smooth' }); }
      else if (el && !el.hidden) { el.classList.add('pb-cms-on'); el.scrollIntoView({ block: 'center', behavior: 'smooth' }); }
    } else if (m.type === 'pb-cms-notes' && m.counts && typeof m.counts === 'object') {
      counts = m.counts;
      pinAll();
    }
  });

  function ready() {
    [].forEach.call(document.querySelectorAll(SEL), function (el) { if (!el.title) el.title = 'Change: ' + (el.getAttribute('data-cms-label') || keyOf(el)); });
    tell({ type: 'pb-cms-ready', keys: [].map.call(document.querySelectorAll(SEL), keyOf), sections: collect() });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', ready); else ready();
  /* Once everything has loaded, the sections again: a script may have shown or hidden one since. */
  function loaded() { tell({ type: 'pb-cms-sections', sections: collect() }); pinAll(); }
  if (document.readyState === 'complete') setTimeout(loaded, 50); else window.addEventListener('load', function () { setTimeout(loaded, 50); });
})();
