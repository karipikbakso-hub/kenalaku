// script.js — Minimal custom script + GSAP animations + lightweight lazy loader
// Requirements: only GSAP + this small file. GSAP and ScrollTrigger are loaded via CDN (defer).

document.addEventListener('DOMContentLoaded', ()=> {
  // expose year
  const y = document.getElementById('year');
  if(y) y.textContent = new Date().getFullYear();

  // Register ScrollTrigger
  if(typeof gsap !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }

  /* =========================
     Lightweight lazy loader:
     - uses loading="lazy" where supported
     - swaps <source data-srcset> -> srcset for <picture>
  ========================= */
  const lazySwap = () => {
    const pics = Array.from(document.querySelectorAll('picture'));
    if('IntersectionObserver' in window){
      const io = new IntersectionObserver((entries, obs)=>{
        entries.forEach(en=>{
          if(en.isIntersecting){
            const p = en.target;
            const src = p.querySelector('source[data-srcset]');
            const img = p.querySelector('img.lazy');
            if(src) { src.setAttribute('srcset', src.dataset.srcset); src.removeAttribute('data-srcset'); }
            if(img && img.dataset.src) { img.src = img.dataset.src; img.removeAttribute('data-src'); }
            obs.unobserve(p);
          }
        });
      }, {rootMargin:'200px 0px'});
      pics.forEach(p => io.observe(p));
    } else {
      // fallback: eager load small set
      pics.forEach(p=>{
        const s = p.querySelector('source[data-srcset]');
        const i = p.querySelector('img.lazy');
        if(s) s.setAttribute('srcset', s.dataset.srcset || '');
        if(i && i.dataset.src) i.src = i.dataset.src;
      });
    }
  };
  lazySwap();

  /* =========================
     GSAP animations
  ========================= */

  // Hero in — fade up + slight scale
  gsap.from('#hero .hero-inner', {
    opacity:0, y:22, scale:0.998, duration:0.9, ease:'power3.out'
  });

  // Stagger reveal for cards
  gsap.from('.cards .card', {
    scrollTrigger: {
      trigger: '.cards',
      start: 'top 80%',
    },
    opacity:0, y:18, stagger:0.12, duration:0.7, ease: 'power2.out'
  });

  // Gallery items fade-in on scroll with slight parallax
  gsap.utils.toArray('.gallery-item').forEach((el, i)=>{
    gsap.from(el, {
      scrollTrigger: {
        trigger: el,
        start: 'top 90%',
      },
      opacity:0, y:16, duration:0.7, ease:'power2.out', delay: i*0.04
    });
  });

  // Features slide subtle
  gsap.from('.feature', {
    scrollTrigger: {
      trigger: '.features',
      start: 'top 85%',
    },
    x:-18, opacity:0, stagger:0.12, duration:0.7, ease:'power3.out'
  });

  // WhatsApp FAB bounce in
  gsap.from('#wa-fab', {
    y:50, opacity:0, duration:0.9, ease:'bounce.out', delay:0.6
  });

  // footer fade-in
  gsap.from('.footer', {
    scrollTrigger: {
      trigger: '.footer',
      start: 'top 95%',
    },
    opacity:0, y:18, duration:0.8, ease:'power2.out'
  });

  /* Lightweight parallax for hero image */
  if(window.innerWidth > 700) {
    const heroImg = document.querySelector('.hero-img');
    if(heroImg) {
      gsap.to(heroImg, {
        yPercent: 6,
        ease: "none",
        scrollTrigger: {
          trigger: '#hero',
          start: 'top top',
          end: 'bottom top',
          scrub: 0.6
        }
      });
    }
  }

  /* Small accessibility: keyboard shortcut 'w' opens WA chat (for power users) */
  document.addEventListener('keyup', (e)=>{
    if(e.key.toLowerCase() === 'w' && !/input|textarea/i.test(document.activeElement.tagName)){
      window.open('https://wa.me/6281234567890', '_blank');
    }
  });

  // Minimal micro-interactions: elevate buttons on touchstart for native feel
  document.querySelectorAll('.btn').forEach(b=>{
    b.addEventListener('touchstart', ()=> b.style.transform='translateY(-3px)');
    b.addEventListener('touchend', ()=> b.style.transform='translateY(0)');
  });
});
