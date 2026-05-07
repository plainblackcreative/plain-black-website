// Renders the "30-Day Challenge live" floating pill on the home page,
// the blog index, and any individual blog post tagged "30-day-challenge".
// Pill markup + styles live in /assets/style.css. Fetch failure = silent.
(function(){
  const path = location.pathname.replace(/\/$/, '');
  const isHome = path === '' || path === '/index.html';
  const isBlogIndex = path === '/blog' || path === '/blog/index.html' || path.endsWith('/blog');
  const isBlogPost = /^\/blog\/[^\/]+(\.html)?$/i.test(path) && !path.endsWith('/blog');

  if (!isHome && !isBlogIndex && !isBlogPost) return;

  // Posts: only show on challenge-tagged ones. The tag chip in the post body
  // is rendered as <a class="post-tag" href="/blog?tag=30-day-challenge">.
  if (isBlogPost) {
    const challengeTag = document.querySelector('.post-tag[href*="tag=30-day-challenge"]');
    if (!challengeTag) return;
  }

  fetch('/docs/challenge-data.json?_=' + Date.now(), { cache: 'no-cache' })
    .then(function(r){ return r.ok ? r.json() : null; })
    .then(function(data){
      if (!data) return;
      // Count every challenge day marked done, including weekly report days
      // (stats.days_complete excludes report days by design — that count is
      // for "builds shipped", not "challenge days complete").
      const arr = Array.isArray(data.days) ? data.days : [];
      let days = 0;
      for (let i = 0; i < arr.length; i++) {
        if (arr[i] && arr[i].status === 'done') days++;
      }
      if (!days && data.stats && typeof data.stats.days_complete === 'number') {
        days = data.stats.days_complete;
      }
      if (!days) return;
      const pill = document.createElement('a');
      pill.className = 'challenge-pill';
      pill.href = '/challenge';
      pill.setAttribute('aria-label', '30-Day Build Challenge live tracker');
      pill.innerHTML = '<span class="pb-dot" aria-hidden="true"></span> Challenge live: <span class="challenge-pill__count">' + days + '/30</span> days';
      // Fixed-position element belongs on body so it isn't clipped by hero overflow.
      document.body.appendChild(pill);
      pill.getBoundingClientRect();
      setTimeout(function(){ pill.classList.add('is-shown'); }, 50);
    })
    .catch(function(){ /* silent */ });
})();
