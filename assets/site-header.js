(function(){
  const header = document.querySelector('.site-header');
  if (!header) return;
  const hero = document.querySelector('.hero-dark, .page-hero, .playbook-hero, .gb-hero, .blog-section');
  let ticking = false;

  function update(){
    if (!hero){
      header.classList.remove('site-header--floating');
      header.classList.add('site-header--solid');
    } else {
      const heroBottom = hero.getBoundingClientRect().bottom;
      const pastHero = heroBottom <= 0;
      const overHeroScrolled = !pastHero && window.scrollY > 0;
      header.classList.toggle('site-header--floating', overHeroScrolled);
      header.classList.toggle('site-header--solid', pastHero);
    }
    const scrollMax = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollMax > 0
      ? Math.min(100, (window.scrollY / scrollMax) * 100)
      : 0;
    header.style.setProperty('--scroll-progress', progress + '%');
    ticking = false;
  }

  function onScroll(){
    if (!ticking){
      requestAnimationFrame(update);
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });

  if (document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', update);
  } else {
    update();
  }
})();

// Enquiry attribution: tab-scoped, expires after 30 minutes without a page visit.
// Store page paths and campaign labels only. Never collect form text or full URLs.
(function(){
  var key = 'plainblack:enquiry-attribution:v1';
  var now = Date.now();
  function path(value){
    if(!value) return '';
    try {
      var url = new URL(value, location.origin);
      if(url.origin !== location.origin) return '';
      var clean = url.pathname.replace(/\.html$/, '').replace(/\/$/, '') || '/';
      return /^\/[a-z0-9/-]*$/.test(clean) && clean.length <= 160 ? clean : '';
    } catch(e){ return ''; }
  }
  function label(value){
    return typeof value === 'string' && /^[a-z0-9][a-z0-9_-]{0,79}$/i.test(value) ? value : '';
  }
  var params = new URLSearchParams(location.search);
  var current = path(location.href);
  var previous = path(document.referrer);
  var state = {};
  try {
    var saved = JSON.parse(sessionStorage.getItem(key));
    if(saved && now >= saved.at && now - saved.at < 30 * 60 * 1000) state = saved;
  } catch(e){}
  var campaign = {};
  var referrerParams = previous ? new URL(document.referrer).searchParams : new URLSearchParams();
  var taggedArrival = ['source','medium','campaign'].some(function(field){
    return label(params.get('utm_' + field));
  });
  ['source','medium','campaign'].forEach(function(field){
    // Recover the handoff from a page using an older cached header script,
    // or when tab storage is blocked. Only same-site campaign labels qualify.
    campaign[field] = label((taggedArrival ? params : referrerParams).get('utm_' + field));
  });
  // A new tagged arrival starts a new attribution journey.
  if(campaign.source || campaign.medium || campaign.campaign) state = {};
  state.landing = path(state.landing || (!taggedArrival && previous ? previous : current));
  state.previous = current === '/contact'
    ? (previous && previous !== '/contact' ? previous : path(state.previous || ''))
    : current;
  state.source = campaign.source || label(state.source);
  state.medium = campaign.medium || label(state.medium);
  state.campaign = campaign.campaign || label(state.campaign);
  state.at = now;
  try { sessionStorage.setItem(key, JSON.stringify(state)); } catch(e){}
  var sources = ['services-ai-tools','services-brand-sprint','services-idea-engine',
    'services-name-frame','brand-sprint','idea-engine','name-frame','briefs',
    'quote-fit-filter','before-you-hit-book','contact-bouncer','do-this-today',
    'filler-score','local-trust','polite-exit','what-happens-next',
    'first-fix-clarity','first-fix-brand','first-fix-website','first-fix-no-leads',
    'first-fix-wrong-enquiries','first-fix-content',
    'first-fix-ai','first-fix-other','first-fix-unknown'];
  var from = params.get('from') || params.get('source_tool');
  var sent = false;
  window.PBEnquiry = {
    context: function(){
      return {
        source_page: state.previous || '(unavailable)',
        landing_page: state.landing || current,
        source_tool: sources.indexOf(from) >= 0 ? from : 'none',
        enquiry_campaign_source: state.source || '(not set)',
        enquiry_campaign_medium: state.medium || '(not set)',
        enquiry_campaign: state.campaign || '(not set)'
      };
    },
    confirmed: function(interest){
      if(sent) return;
      sent = true;
      // Analytics failures must never turn an accepted enquiry into a form error.
      try {
        if(typeof window.gtag !== 'function') return;
        var data = this.context();
        var services = ['branding','ideaengine','website','brief','quotefilter','customtool','other'];
        data.service_interest = services.indexOf(interest) >= 0 ? interest : 'other';
        data.form_id = 'contact';
        data.page_location = location.origin + '/contact';
        data.page_referrer = previous ? location.origin + previous : '';
        window.gtag('event', 'generate_lead', data);
      } catch(e){}
    }
  };
})();

// Mobile-nav drawer: backdrop, body-scroll-lock, ESC + outside-click close.
// Replaces the existing inline onclick that just toggled .open classes —
// keeps that working too (we listen on the same elements).
(function(){
  function ready(fn){
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn);
    else fn();
  }
  ready(function(){
    var hamburger = document.querySelector('.hamburger');
    var drawer = document.querySelector('.mobile-nav');
    if (!hamburger || !drawer) return;

    // Inject backdrop once
    var backdrop = document.querySelector('.mobile-nav-backdrop');
    if (!backdrop){
      backdrop = document.createElement('div');
      backdrop.className = 'mobile-nav-backdrop';
      document.body.appendChild(backdrop);
    }

    function open(){
      drawer.inert = false;
      drawer.removeAttribute('aria-hidden');
      drawer.classList.add('open');
      backdrop.classList.add('open');
      hamburger.classList.add('active');
      document.body.classList.add('mobile-nav-open');
      hamburger.setAttribute('aria-expanded', 'true');
    }
    function close(){
      if (drawer.contains(document.activeElement)){
        var focusTarget = window.innerWidth <= 768
          ? hamburger
          : document.querySelector('.site-header__logo');
        if (focusTarget) focusTarget.focus();
      }
      drawer.inert = true;
      drawer.setAttribute('aria-hidden', 'true');
      drawer.classList.remove('open');
      backdrop.classList.remove('open');
      hamburger.classList.remove('active');
      document.body.classList.remove('mobile-nav-open');
      hamburger.setAttribute('aria-expanded', 'false');
    }
    function toggle(){
      drawer.classList.contains('open') ? close() : open();
    }

    close();

    // Replace the inline onclick with our handler (keep the inline as a fallback no-op)
    hamburger.onclick = function(e){ e.preventDefault(); toggle(); };
    backdrop.addEventListener('click', close);
    document.addEventListener('keydown', function(e){
      if (e.key === 'Escape' && drawer.classList.contains('open')) close();
    });
    // Auto-close when a nav link is clicked (so you don't land on a new page with the drawer still open)
    drawer.addEventListener('click', function(e){
      if (e.target.tagName === 'A') close();
    });
    // Auto-close if viewport widens past the drawer breakpoint
    window.addEventListener('resize', function(){
      if (window.innerWidth > 768 && drawer.classList.contains('open')) close();
    });
  });
})();
