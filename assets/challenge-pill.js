// Renders the "30-Day Challenge live" pill in the hero of the blog index
// and any individual blog post tagged "30-day-challenge". Pill markup +
// styles live in /assets/style.css. Fetch failure = silent no-op.
(function(){
  const path = location.pathname.replace(/\/$/, '');
  const isBlogIndex = path === '/blog' || path === '/blog/index.html' || path.endsWith('/blog');
  const isBlogPost = /^\/blog\/[^\/]+(\.html)?$/i.test(path) && !path.endsWith('/blog');

  if (!isBlogIndex && !isBlogPost) return;

  // Posts: only show on challenge-tagged ones. The tag chip in the post body
  // is rendered as <a class="post-tag" href="/blog?tag=30-day-challenge">.
  if (isBlogPost) {
    const challengeTag = document.querySelector('.post-tag[href*="tag=30-day-challenge"]');
    if (!challengeTag) return;
  }

  const heroSelector = isBlogIndex ? '.page-hero' : '.post-hero';
  const hero = document.querySelector(heroSelector);
  if (!hero) return;
  // Need a positioned parent so the absolute pill anchors correctly.
  if (getComputedStyle(hero).position === 'static') hero.style.position = 'relative';

  fetch('/docs/challenge-data.json?_=' + Date.now(), { cache: 'no-cache' })
    .then(function(r){ return r.ok ? r.json() : null; })
    .then(function(data){
      if (!data || !data.stats || typeof data.stats.days_complete !== 'number') return;
      const days = data.stats.days_complete;
      const pill = document.createElement('a');
      pill.className = 'challenge-pill';
      pill.href = '/challenge';
      pill.setAttribute('aria-label', '30-Day Build Challenge live tracker');
      pill.innerHTML = '<span class="pb-dot" aria-hidden="true"></span> Challenge live: <span class="challenge-pill__count">' + days + '/30</span> days';
      hero.appendChild(pill);
      // Force a reflow before adding the visible class so the entry transition fires.
      pill.getBoundingClientRect();
      setTimeout(function(){ pill.classList.add('is-shown'); }, 50);
    })
    .catch(function(){ /* silent */ });
})();
