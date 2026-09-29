const hero = document.querySelector('.hero');
const counters = document.querySelectorAll('[data-count]');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let ticking = false;

function setupScrollAnimation() {
  if (reducedMotion || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  gsap.registerPlugin(ScrollTrigger);
  const visual = document.querySelector('.hero-visual');
  const title = document.querySelector('.hero-title');
  const inner = document.querySelector('.hero-inner');

  gsap.timeline({
    scrollTrigger: {
      trigger: hero,
      start: 'top top',
      end: 'bottom top',
      scrub: 0.7,
      invalidateOnRefresh: true
    }
  })
    .to(visual, { x: '22vw', y: '72vh', rotate: 125, scale: 0.72, ease: 'none' }, 0)
    .to(title, { y: '-8vh', scale: 0.94, ease: 'none' }, 0)
    .to(inner, { y: '10vh', ease: 'none' }, 0);
}

function animateCounters() {
  counters.forEach((counter) => {
    const target = Number(counter.dataset.count);
    if (reducedMotion || target === 0) {
      counter.textContent = target;
      return;
    }

    const duration = 1100;
    const startedAt = performance.now();
    const update = (now) => {
      const progress = Math.min((now - startedAt) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      counter.textContent = Math.round(target * eased);
      if (progress < 1) requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
  });
}

function updateParallax() {
  const scrollY = window.scrollY;
  const heroHeight = hero.offsetHeight;
  const progress = Math.min(scrollY / heroHeight, 1);
  const x = Math.sin(progress * Math.PI) * 24;
  const y = scrollY * 0.14;

  hero.style.setProperty('--grid-shift', `${scrollY * 0.12}px`);
  hero.style.setProperty('--orb-x', `${x}px`);
  hero.style.setProperty('--orb-y', `${y}px`);
  hero.style.setProperty('--orbit-x', `${x * 1.7}px`);
  hero.style.setProperty('--orbit-y', `${y * -0.35}px`);
  hero.style.setProperty('--bubble-x', `${x * -1.4}px`);
  hero.style.setProperty('--bubble-y', `${y * -0.7}px`);
  hero.style.setProperty('--hero-progress', progress);

  if (!reducedMotion) {
    hero.querySelector('.hero-inner').style.transform = `translate3d(0, ${scrollY * 0.1}px, 0)`;
    hero.querySelector('.hero-title').style.transform = `translate3d(0, ${scrollY * -0.08}px, 0) scale(${1 - progress * 0.06})`;
    hero.querySelector('.scroll-cue').style.opacity = Math.max(0, 1 - progress * 4);
  }
  ticking = false;
}

function requestParallaxUpdate() {
  if (!ticking) {
    requestAnimationFrame(updateParallax);
    ticking = true;
  }
}

window.addEventListener('scroll', requestParallaxUpdate, { passive: true });
window.addEventListener('resize', requestParallaxUpdate);

window.addEventListener('load', () => {
  hero.classList.add('is-ready');
  animateCounters();
  updateParallax();
  setupScrollAnimation();
});
