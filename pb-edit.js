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
    });
    kids.slice(items.length).forEach(function (k) { k.parentNode.removeChild(k); });
  }
  function tell(msg) { msg.path = location.pathname; window.parent.postMessage(msg, '*'); }

  var css = document.createElement('style');
  css.textContent = SEL.split(',').map(function (s) { return s + ':not([hidden])'; }).join(',') +
    '{outline:2px dashed rgba(37,99,235,.6)!important;outline-offset:3px;cursor:pointer!important}' +
    SEL.split(',').map(function (s) { return s + ':hover'; }).join(',') + ',.pb-cms-on{outline:3px solid #2563eb!important;outline-offset:3px}';
  (document.head || document.documentElement).appendChild(css);

  document.addEventListener('click', function (e) {
    var el = e.target && e.target.closest ? e.target.closest(SEL) : null;
    if (!el) return;
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
      [].forEach.call(document.querySelectorAll('.pb-cms-on'), function (x) { x.classList.remove('pb-cms-on'); });
      if (el && !el.hidden) { el.classList.add('pb-cms-on'); el.scrollIntoView({ block: 'center', behavior: 'smooth' }); }
    }
  });

  function ready() {
    [].forEach.call(document.querySelectorAll(SEL), function (el) { if (!el.title) el.title = 'Change: ' + (el.getAttribute('data-cms-label') || keyOf(el)); });
    tell({ type: 'pb-cms-ready', keys: [].map.call(document.querySelectorAll(SEL), keyOf) });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', ready); else ready();
})();
