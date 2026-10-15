#!/usr/bin/env node
/*
  Captures the mockups on the Services page (Sample Co) and the Work page's
  client case studies (15 Oct 2026). Kept here so every image can be made again.

  DASHBOARDS come from the plainblack-client repo, served locally:
    npx --yes http-server <plainblack-client> -p 8711 -c-1 -s
  Sample Co is the demo dashboard (demo/) and its sample website (demo/site/).
  A client's dashboard is their real dashboard (branding, sidebar, the mods
  they have) opened in demo mode: hub-demo.js answers every call with the
  demo's sample data (hub-demo-data.js), so no real enquiry, message, review or
  figure is captured. Each capture is opened as the client (pb_view=client)
  with the demo bar and view-as-client bar hidden.

  WEBSITES of clients are their live sites, which this script does not fetch:
  capture them with sites.mjs-style Playwright on a machine that can reach
  them (1440x900 at 2x, and Playwright's "iPhone 13" at 3x, 3.5 s after load)
  and pass the folder of PNGs named <slug>-site-desk.png / <slug>-site-phone.png.

    node scripts/capture-work-mockups.mjs <client-repo-url> [site-png-folder] [only-slug...]

  Export: desktop 1440x900 at 2x -> 1600w and 800w WebP; phone 390x844 at 3x
  -> 780w and 390w WebP; quality 0.82; reduced motion on.
  Writes assets/work/sample-co-*.webp and assets/work/<slug>/*.webp. Website-only clients
  (no dashboard shown) are listed in SITES below.
*/
import { mkdirSync, readFileSync, existsSync } from 'node:fs';
import { writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';

const [baseArg, siteDir, ...only] = process.argv.slice(2);
const base = (baseArg || 'http://localhost:8711').replace(/\/$/, '');
const require = createRequire(import.meta.url);
let pw;
try { pw = require('playwright'); } catch { pw = require('/opt/node22/lib/node_modules/playwright'); }
const out = new URL('../assets/work/', import.meta.url);

const HIDE = '[data-hub-demo-bar], :has(> [data-adm-viewback]) { display: none !important; }';
const DESK = { w: 1440, h: 900, dpr: 2, sizes: [1600, 800] };
const PHONE = { w: 390, h: 844, dpr: 3, mobile: true, sizes: [780, 390] };

/* Each client: the dashboard views to capture. A view is a size, an optional ?open= section (or a page under
   the dashboard folder), text to wait for, and an optional button to press first. Views were picked per client
   so the pop-ups do not all show the same screen in different colours. */
/* The shop's sample products are trade items (hub-demo-data.js shopSeed). A shop client gets products that fit
   them instead: same ids and variant ids, so the sample orders and till still add up, only the words change. */
const SHOP_BLOCK = /var packName = [\s\S]*?\n    \];\n/;
function shopList(pack, rest) {
  const V = (pid, id, label, price, o) => `Object.assign(V('${pid}', ${JSON.stringify(id)}, ${price}${o ? ', ' + JSON.stringify(o) : ''}), { label: ${JSON.stringify(label)} })`;
  const P = (id, name, cat, status, desc, vs, pics) => `P('${id}', ${JSON.stringify(name)}, ${JSON.stringify(cat)}, '${status}', ${JSON.stringify(desc + ' Sample product.')}, [${vs.join(', ')}], ${JSON.stringify(pics)})`;
  return `var packName = ${JSON.stringify(pack.name)};\n    var callName = ${JSON.stringify(rest.call.name)};\n    var list = [\n      ` + [
    P('PK', pack.name, pack.cat, 'active', pack.desc, [V('PK', 'Basic', pack.v[0], pack.p[0]), V('PK', 'Plus', pack.v[1], pack.p[1])], [pack.name + ' (sample)']),
    P('gift-voucher', 'Gift voucher', 'Vouchers', 'active', 'Emailed or posted.', [V('gift-voucher', '$50', '$50', 5000), V('gift-voucher', '$100', '$100', 10000), V('gift-voucher', '$200', '$200', 20000)], ['Gift voucher (sample)']),
    ...rest.items.map(([id, name, cat, desc, vs, status]) => P(id, name, cat, status || 'active', desc, vs.map(([vid, label, price, o]) => V(id, vid, label, price, o)), status === 'archived' ? [] : [name + ' (sample)'])),
    P('CO', rest.call.name, rest.call.cat, 'active', rest.call.desc, [V('CO', 'Weekday', rest.call.v[0], rest.call.p[0]), V('CO', 'Weekend', rest.call.v[1], rest.call.p[1])], [rest.call.name + ' (sample)'])
  ].join(',\n      ').replace(/'PK'/g, 'slug(packName)').replace(/'CO'/g, 'slug(callName)') + '\n    ];\n';
}
const SWAPS = {
  'nana-dunn': [
    [SHOP_BLOCK, shopList({ name: 'Gift pack', cat: 'Gift packs', desc: 'Jars of your choice in a gift box.', v: ['Three jars', 'Five jars'], p: [4500, 6900] }, {
      items: [
        ['replacement-filter', 'Pickled onions', 'Pickles', 'Crunchy, sweet and sharp.', [['One size', '500g', 1490, { qty: 14 }]]],
        ['seal-and-gasket-kit', 'Tomato relish', 'Relishes', 'Nana’s recipe.', [['One size', '300g', 1090, { qty: 3 }]]],
        ['cleaning-concentrate', 'Red onion jam', 'Relishes', 'Good on everything.', [['1L', '250g', 990, { qty: 22 }], ['5L', '1kg', 3200, { qty: 6, special: 2900 }]]],
        ['spare-parts-bundle', 'Market bundle', 'Gift packs', 'One of everything.', [['One size', 'Six jars', 7900, { qty: 0, out: true }]]],
        ['starter-care-kit', 'Christmas hamper', 'Gift packs', 'Not on the website yet.', [['One size', 'One size', 9900, { qty: 10 }]], 'hidden'],
        ['old-model-filter', 'Beetroot chutney', 'Chutneys', 'No longer made.', [['One size', '300g', 990, { qty: 0, out: true }]], 'archived']],
      call: { name: 'Mango chutney', cat: 'Chutneys', desc: 'Sweet with a little heat.', v: ['300g', '600g'], p: [1090, 1890] } })],
    ['Booking now for summer: ask for a free quote before the holidays.', 'Christmas gift packs are in. Order by 18 December for delivery.'],
    ["link: '/quote', linkLabel: 'Get a quote'", "link: '/shop', linkLabel: 'Shop gift packs'"]],
  'mane': [
    [SHOP_BLOCK, shopList({ name: 'Merino crew knit', cat: 'Knitwear', desc: 'Fine Italian merino.', v: ['M', 'L'], p: [24900, 24900] }, {
      items: [
        ['replacement-filter', 'Selvedge denim jeans', 'Denim', 'Japanese selvedge, slim straight.', [['One size', '32', 28900, { qty: 4 }]]],
        ['seal-and-gasket-kit', 'Linen shirt', 'Shirts', 'Washed linen.', [['One size', 'M', 17900, { qty: 3 }]]],
        ['cleaning-concentrate', 'Leather belt', 'Accessories', 'Full-grain leather, brass buckle.', [['1L', '32"', 12900, { qty: 6 }], ['5L', '34"', 12900, { qty: 2, special: 9900 }]]],
        ['spare-parts-bundle', 'Wool overcoat', 'Outerwear', 'British wool.', [['One size', 'L', 59900, { qty: 0, out: true }]]],
        ['starter-care-kit', 'Cashmere scarf', 'Accessories', 'Not on the website yet.', [['One size', 'One size', 19900, { qty: 5 }]], 'hidden'],
        ['old-model-filter', 'Canvas tote', 'Accessories', 'Sold through.', [['One size', 'One size', 6900, { qty: 0, out: true }]], 'archived']],
      call: { name: 'Suede chukka boots', cat: 'Footwear', desc: 'Hand-made in Portugal.', v: ['9', '10'], p: [34900, 34900] } })]]
};

/* Each client: the mods to switch on for the capture (the ones they have, so the sidebar shows them unlocked) and
   the dashboard views to capture. A view is a size, an optional ?open= section (or a page under the dashboard
   folder), text to wait for, and an optional button to press first. One view per mod listed on the Work page. */
const CLIENTS = {
  'first-glass': { on: ['leads', 'ads', 'reviews', 'instagram', 'assets', 'signatures'], demo: { services: ['Glass repairs', 'Shower screens', 'Balustrades', 'Pool fencing'] }, views: [
    { name: 'dash-desktop', size: 'desk' },
    { name: 'dash-tool', size: 'desk', open: 'reviews', wait: '(sample)' },
    { name: 'dash-phone', size: 'phone' },
    { name: 'mod-leads', size: 'desk', open: 'numbers', wait: 'Add an enquiry' },
    { name: 'mod-ads', size: 'desk', open: 'ads', wait: 'Ad spend' },
    { name: 'mod-instagram', size: 'desk', open: 'instagram', wait: 'Your posts' },
    { name: 'mod-signatures', size: 'desk', open: 'assets', wait: 'Email signatures' }] },
  'vantage-drones': { on: ['proposals', 'leads', 'reviews', 'instagram'], demo: { services: ['Weed spraying', 'Crop spraying', 'Waterway spraying', 'Ground spraying'], places: ['Te Puke', 'Katikati', 'Matamata', 'Morrinsville', 'Whakatāne', 'Paengaroa', 'Rotorua'] }, views: [
    { name: 'dash-desktop', size: 'desk', wait: 'Proposals' },
    { name: 'mod-proposals', size: 'desk', open: 'proposals', wait: 'Make a new proposal' },
    { name: 'mod-leads', size: 'desk', open: 'numbers', wait: 'Add an enquiry' },
    { name: 'mod-reviews', size: 'desk', open: 'reviews', wait: '(sample)' },
    { name: 'mod-instagram', size: 'desk', open: 'instagram', wait: 'Your posts' }] },
  'enchanted-entertainment': { on: ['assets', 'signatures'], demo: { services: ['Character parties', 'Party packages', 'Events', 'School visits'], area: 'Wellington', places: ['Lower Hutt', 'Porirua', 'Johnsonville', 'Kāpiti', 'Upper Hutt', 'Karori', 'Petone'] }, views: [
    { name: 'dash-tool', size: 'desk', open: 'website', wait: 'Website stack' },
    { name: 'dash-phone', size: 'phone' },
    { name: 'mod-signatures', size: 'desk', open: 'assets', wait: 'Email signatures' }] },
  'bradley-roofing': { on: ['leads', 'reviews'], demo: { services: ['Re-roofs', 'New builds', 'Repairs', 'Spouting'] }, views: [
    { name: 'dash-desktop', size: 'desk', wait: 'Latest enquiries' },
    { name: 'dash-tool', size: 'desk', page: 'roof-quote/', press: 'Documents', wait: 'Roofing quote', plain: true },
    { name: 'mod-leads', size: 'desk', open: 'numbers', wait: 'Add an enquiry' },
    { name: 'mod-reviews', size: 'desk', open: 'reviews', wait: '(sample)' }] },
  'blst': { on: ['google', 'reviews', 'analytics', 'assets', 'signatures'], demo: { services: ['Waterblasting', 'Pool care', 'Path cleaning', 'Fence cleaning'] }, views: [
    { name: 'dash-phone', size: 'phone' },
    { name: 'mod-google', size: 'desk', open: 'google', wait: 'Top searches' },
    { name: 'mod-reviews', size: 'desk', open: 'reviews', wait: '(sample)' },
    { name: 'mod-analytics', size: 'desk', open: 'analytics', wait: 'Most-visited pages' },
    { name: 'mod-signatures', size: 'desk', open: 'assets', wait: 'Email signatures' }] },
  'taca': { on: ['marketing', 'assets', 'letterhead'], demo: { services: ['Tax returns', 'Bookkeeping', 'Business advice', 'Xero setup'] }, views: [
    { name: 'dash-tool', size: 'desk', open: 'marketing', wait: 'Business cards' },
    { name: 'dash-phone', size: 'phone' },
    { name: 'mod-letterhead', size: 'desk', open: 'letterhead', wait: 'TACA letterhead' }] },
  'mcindoe-media': { on: ['assets', 'signatures'], demo: { services: ['Video', 'Photography', 'Event content', 'Design'] }, views: [
    { name: 'dash-desktop', size: 'desk' },
    { name: 'mod-signatures', size: 'desk', open: 'assets', wait: 'Email signatures' }] },
  'gigi': { demo: { services: ['Campaigns', 'Editorial', 'Brand work', 'Speaking'] }, views: [
    { name: 'dash-phone', size: 'phone' }] },
  'the-marshall-method': { demo: { services: ['Remedial massage', 'Recovery sessions', 'Dry needling', 'Bodywork'], area: 'Ulverstone', places: ['Devonport', 'Burnie', 'Penguin', 'Latrobe', 'Spreyton', 'Turners Beach', 'Sheffield'] }, views: [
    { name: 'dash-phone', size: 'phone' }] },
  'nana-dunn': { on: ['shop', 'orders', 'markets', 'stockists', 'notice'], demo: { services: ['Pickles', 'Chutneys', 'Relishes', 'Gift packs'] }, views: [
    { name: 'dash-tool', size: 'desk', open: 'stockists', wait: 'Harbour Deli' },
    { name: 'dash-phone', size: 'phone' },
    { name: 'mod-shop', size: 'desk', open: 'shop', wait: 'Pickled onions' },
    { name: 'mod-orders', size: 'desk', open: 'orders', wait: 'Pickled onions' },
    { name: 'mod-markets', size: 'desk', open: 'markets', wait: 'Add a market', scroll: 'Your markets' },
    { name: 'mod-notice', size: 'desk', open: 'notice', wait: 'Christmas gift packs' }] },
  'mane': { on: ['shop', 'orders', 'till'], demo: { services: ['Knitwear', 'Denim', 'Shirts', 'Outerwear'] }, views: [
    { name: 'mod-shop', size: 'desk', open: 'shop', wait: 'Merino crew knit' },
    { name: 'mod-orders', size: 'desk', open: 'orders', wait: 'Merino crew knit' },
    { name: 'mod-till', size: 'desk', open: 'till', wait: 'Suede chukka boots' }] }
};

const browser = await pw.chromium.launch();
const encoder = await (await browser.newContext()).newPage();

async function save(png, sizes, name) {
  for (const w of sizes) {
    const data = await encoder.evaluate(async ([src, w]) => {
      const img = new Image(); img.src = 'data:image/png;base64,' + src; await img.decode();
      const c = document.createElement('canvas'); c.width = w; c.height = Math.round(img.height * w / img.width);
      const g = c.getContext('2d'); g.imageSmoothingQuality = 'high'; g.drawImage(img, 0, 0, c.width, c.height);
      return c.toDataURL('image/webp', 0.82).split(',')[1];
    }, [png.toString('base64'), w]);
    const file = new URL(`${name}-${w}w.webp`, out);
    mkdirSync(new URL('.', file), { recursive: true });
    await writeFile(file, Buffer.from(data, 'base64'));
    console.log(file.pathname.split('/assets/')[1]);
  }
}

async function shoot(url, size, { client = false, demo = null, waitText = '', press = '', on = [], swaps = [], scroll = '' } = {}) {
  const ctx = await browser.newContext({ viewport: { width: size.w, height: size.h }, deviceScaleFactor: size.dpr, isMobile: !!size.mobile, hasTouch: !!size.mobile, reducedMotion: 'reduce' });
  if (client) await ctx.addCookies([{ name: 'pb_view', value: 'client', url: base }]);
  if (demo) {
    let data = await (await fetch(base + '/demo/assets/js/hub-demo-data.js')).text();
    for (const [from, to] of swaps) {
      const next = data.replace(from, to);
      if (next === data) throw new Error('sample data swap found nothing: ' + String(from).slice(0, 40));
      data = next;
    }
    const sections = Object.fromEntries(on.map(k => [k, 'live']));
    await ctx.route(/\/assets\/js\/hub-client\.js/, async r => {
      const res = await r.fetch();
      const body = (await res.text()) + `\n;window.HUB_CLIENT.demo = Object.assign({ view: 'client' }, ${JSON.stringify(demo)});\n` +
        `window.HUB_CLIENT.sections = Object.assign({}, window.HUB_CLIENT.sections, ${JSON.stringify(sections)});\n`;
      r.fulfill({ response: res, body });
    });
    await ctx.route(/\/assets\/js\/hub-demo\.js/, async r => {
      const res = await r.fetch();
      r.fulfill({ response: res, body: (await res.text()) + '\n' + data });
    });
  }
  const page = await ctx.newPage();
  /* Some views draw once their data lands, and not always first time: wait for sample data on screen, reload if not. */
  for (let attempt = 0; ; attempt++) {
    /* A view that keeps polling (Proposals' frame) never goes network-idle: settle for loaded. */
    await page.goto(url, { waitUntil: 'networkidle', timeout: 15000 }).catch(() => {});
    await page.waitForTimeout(2500);
    if (press) { await page.getByRole('button', { name: press, exact: true }).first().click(); await page.waitForTimeout(1200); }
    if (!waitText || (await page.evaluate(t => document.body.innerText.includes(t), waitText))) break;
    if (attempt === 5) throw new Error(url + ': "' + waitText + '" never showed');
  }
  if (scroll) { await page.getByText(scroll, { exact: false }).first().scrollIntoViewIfNeeded(); await page.waitForTimeout(400); }
  await page.addStyleTag({ content: HIDE });
  await page.evaluate(() => document.activeElement && document.activeElement.blur());
  const rules = await page.evaluate(() => [...document.styleSheets].reduce((n, x) => { try { return n + x.cssRules.length; } catch { return n; } }, 0));
  if (!rules) throw new Error(url + ': no stylesheet applied');
  const png = await page.screenshot();
  await ctx.close();
  return png;
}

const want = s => !only.length || only.includes(s);

if (want('sample-co')) {
  await save(await shoot(base + '/demo/site/', DESK), DESK.sizes, 'sample-co-site-desktop');
  await save(await shoot(base + '/demo/site/', PHONE), PHONE.sizes, 'sample-co-site-phone');
  await save(await shoot(base + '/demo/', DESK, { client: true }), DESK.sizes, 'sample-co-dash-desktop');
  await save(await shoot(base + '/demo/', PHONE, { client: true }), PHONE.sizes, 'sample-co-dash-phone');
}

const SITES = Object.keys(CLIENTS);
for (const slug of SITES) {
  if (!want(slug)) continue;
  const cfg = CLIENTS[slug] || { views: [] };
  const dash = `${base}/${cfg.folder || slug}/`;
  for (const v of cfg.views) {
    const size = v.size === 'phone' ? PHONE : DESK;
    const url = dash + (v.page || '') + (v.open ? '?open=' + v.open : '');
    const opts = v.plain ? { waitText: v.wait, press: v.press } : { client: true, demo: cfg.demo || {}, waitText: v.wait || '', press: v.press, on: cfg.on || [], swaps: SWAPS[slug] || [], scroll: v.scroll };
    await save(await shoot(url, size, opts), size.sizes, `${slug}/${v.name}`);
  }
  for (const [kind, size, name] of [['desk', DESK, 'site-desktop'], ['phone', PHONE, 'site-phone']]) {
    const f = siteDir && `${siteDir}/${slug}-site-${kind}.png`;
    if (f && existsSync(f)) await save(readFileSync(f), size.sizes, `${slug}/${name}`);
    else console.log(`(no ${slug} ${kind} website capture given)`);
  }
}
await browser.close();
