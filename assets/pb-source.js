/* Where an enquiry came from (13 Nov 2026): a copy of PlainBlack's master copy (portal repo, _templates/pb-source.js).
   Change the master and copy it here; never change this copy on its own. Adds lead_source, lead_campaign and landing_page
   to forms marked data-pb-source, which the PlainBlack dashboard's Leads shows as where the enquiry came from. */
(() => {
  'use strict';
  const KEY = 'pb-lead-source-v1';
  const DAYS = 30;
  const AI = { 'chatgpt.com': 'chatgpt.com', 'chat.openai.com': 'chatgpt.com', 'perplexity.ai': 'perplexity.ai', 'www.perplexity.ai': 'perplexity.ai',
    'claude.ai': 'claude.ai', 'gemini.google.com': 'gemini.google.com', 'copilot.microsoft.com': 'copilot.microsoft.com' };
  const ENGINE = /(^|\.)(google|bing|duckduckgo|yahoo|ecosia)\.[a-z.]+$/;
  const SOCIAL = /(^|\.)(facebook|instagram)\.com$/;
  function classify() {
    const q = new URLSearchParams(location.search);
    const us = (q.get('utm_source') || '').toLowerCase().trim();
    const um = (q.get('utm_medium') || '').toLowerCase().trim();
    let ref = '';
    try { ref = document.referrer ? new URL(document.referrer).hostname.toLowerCase() : ''; } catch (_) {}
    if (ref === location.hostname.toLowerCase()) ref = '';
    if (q.get('gclid') || q.get('gbraid') || q.get('wbraid')) return 'google / cpc';
    if (us) {
      if (/^(cpc|ppc|paid|paidsearch|paid_social|paid-social)$/.test(um)) return `${us} / ${um === 'cpc' || um === 'ppc' ? 'cpc' : 'paid'}`;
      return `${us} / ${um || 'referral'}`;
    }
    if (q.get('fbclid')) return 'facebook / social';
    if (!ref) return '(direct) / (none)';
    if (AI[ref]) return `${AI[ref]} / referral`;
    const engine = ENGINE.exec(ref);
    if (engine) return `${engine[2]} / organic`;
    const social = SOCIAL.exec(ref.replace(/^(l|lm|m|web)\./, ''));
    if (social) return `${social[2]} / social`;
    return `${ref.replace(/^www\./, '')} / referral`;
  }
  let kept = null;
  try { kept = JSON.parse(localStorage.getItem(KEY) || 'null'); } catch (_) {}
  if (!kept || !kept.at || Date.now() - kept.at > DAYS * 86400000) {
    const c = new URLSearchParams(location.search).get('utm_campaign') || '';
    kept = { source: classify(), campaign: c.slice(0, 120), page: location.pathname.slice(0, 200), at: Date.now() };
    try { localStorage.setItem(KEY, JSON.stringify(kept)); } catch (_) {}
  }
  const fields = { lead_source: kept.source, lead_campaign: kept.campaign, landing_page: kept.page };
  window.pbLeadSource = () => ({ ...fields });
  const tag = (form) => {
    if (!form || !form.matches || !form.matches('form.enquiry-form, form[data-pb-source]')) return;
    for (const [name, value] of Object.entries(fields)) {
      if (!value || form.elements[name]) continue;
      const input = document.createElement('input');
      input.type = 'hidden'; input.name = name; input.value = value;
      form.append(input);
    }
  };
  document.querySelectorAll('form').forEach(tag);
  /* Forms drawn later, or a site script that loads before its form: tagged as they are sent. A capture listener on the
     document runs before the form's own submit handler, so the fields are there when it reads the form. */
  document.addEventListener('submit', (e) => tag(e.target), true);
})();
