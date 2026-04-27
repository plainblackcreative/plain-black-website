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
