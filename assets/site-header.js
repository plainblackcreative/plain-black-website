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
      drawer.classList.add('open');
      backdrop.classList.add('open');
      hamburger.classList.add('active');
      document.body.classList.add('mobile-nav-open');
      hamburger.setAttribute('aria-expanded', 'true');
    }
    function close(){
      drawer.classList.remove('open');
      backdrop.classList.remove('open');
      hamburger.classList.remove('active');
      document.body.classList.remove('mobile-nav-open');
      hamburger.setAttribute('aria-expanded', 'false');
    }
    function toggle(){
      drawer.classList.contains('open') ? close() : open();
    }

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
