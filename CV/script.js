// A impressão usa o layout específico para papel definido no CSS.
document.querySelector('#print').addEventListener('click', () => window.print());

// A navegação continua funcionando por âncoras mesmo sem JavaScript.
const sections = [...document.querySelectorAll('main > section[id]')];
const navigationLinks = [...document.querySelectorAll('.section-nav a')];
if ('IntersectionObserver' in window) {
  const visibleSections = new Set();
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) visibleSections.add(entry.target);
      else visibleSections.delete(entry.target);
    });
    const active = sections.find((section) => visibleSections.has(section));
    navigationLinks.forEach((link) => {
      if (active && link.hash === `#${active.id}`) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }, { rootMargin: '-80px 0px -40% 0px', threshold: 0 });
  sections.forEach((section) => observer.observe(section));
}

// Os efeitos são opcionais: o conteúdo permanece visível sem JavaScript.
const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
const progress = document.createElement('div');
progress.className = 'scroll-progress';
progress.setAttribute('aria-hidden', 'true');
document.body.prepend(progress);
let scrollFramePending = false;
function updateProgress() {
  const available = document.documentElement.scrollHeight - window.innerHeight;
  const value = available > 0 ? Math.max(0, Math.min(1, window.scrollY / available)) : 0;
  progress.style.transform = `scaleX(${value})`;
  scrollFramePending = false;
}
window.addEventListener('scroll', () => {
  if (!scrollFramePending) {
    scrollFramePending = true;
    requestAnimationFrame(updateProgress);
  }
}, { passive: true });
window.addEventListener('resize', updateProgress);
window.addEventListener('load', updateProgress);
updateProgress();

if ('IntersectionObserver' in window) {
  const entranceObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      if (!motionPreference.matches) entry.target.classList.add('reveal-in');
      entranceObserver.unobserve(entry.target);
    });
  }, { threshold: 0.08 });
  document.querySelectorAll('.section-heading, .contact-card, .profile-details, .education-card, .qualifications, .career-entry').forEach((element) => entranceObserver.observe(element));
}

const precisePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
document.querySelectorAll('.education-card').forEach((card) => {
  card.addEventListener('pointermove', (event) => {
    if (motionPreference.matches || !precisePointer.matches) return;
    const bounds = card.getBoundingClientRect();
    card.style.setProperty('--pointer-x', `${event.clientX - bounds.left}px`);
    card.style.setProperty('--pointer-y', `${event.clientY - bounds.top}px`);
  });
});

const portraitCard = document.querySelector('.portrait-card');
const portraitArea = document.querySelector('.hero-art');
function resetPortrait() { portraitCard.style.removeProperty('transform'); }
portraitArea.addEventListener('pointermove', (event) => {
  if (motionPreference.matches || !precisePointer.matches) return;
  const bounds = portraitArea.getBoundingClientRect();
  const x = (event.clientX - bounds.left) / bounds.width - 0.5;
  const y = (event.clientY - bounds.top) / bounds.height - 0.5;
  portraitCard.style.transform = `rotateX(${-y * 8}deg) rotateY(${x * 10}deg) rotate(-3deg)`;
});
portraitArea.addEventListener('pointerleave', resetPortrait);
portraitArea.addEventListener('pointercancel', resetPortrait);
motionPreference.addEventListener('change', resetPortrait);
window.addEventListener('beforeprint', resetPortrait);
