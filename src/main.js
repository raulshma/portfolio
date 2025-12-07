function throttle(fn, wait) {
  let lastTime = 0;
  return function(...args) {
    const now = performance.now();
    if (now - lastTime >= wait) {
      lastTime = now;
      fn.apply(this, args);
    }
  };
}

const glassCards = document.querySelectorAll('.glass-card');

if (glassCards.length > 0) {
  const handleMouseMove = throttle((e) => {
    glassCards.forEach(card => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  }, 20);
  
  document.addEventListener('mousemove', handleMouseMove, { passive: true });
}

const sections = document.querySelectorAll('div[id]');
const navLinks = document.querySelectorAll('.dock-item');

const projectsSection = document.getElementById('projects');

if (projectsSection) {
  const handleScroll = throttle(() => {
    const rect = projectsSection.getBoundingClientRect();
    const isVisible = rect.top < window.innerHeight / 2 && rect.bottom > 0;
    
    navLinks.forEach(link => {
       if (link.href.includes('#projects')) {
          link.classList.toggle('active', isVisible);
          if (isVisible) navLinks[0].classList.remove('active');
          else navLinks[0].classList.add('active');
       }
    });
  }, 100);
  
  window.addEventListener('scroll', handleScroll, { passive: true });
}

document.addEventListener('click', (e) => {
  const link = e.target.closest('a');
  if (!link) return;
  
  const url = new URL(link.href);
  if (url.origin !== location.origin) return;

  if (!document.startViewTransition) return;

  if (url.pathname === location.pathname && url.hash) {
     e.preventDefault();
     const target = document.querySelector(url.hash);
     if (target) {
       document.startViewTransition(() => {
         target.scrollIntoView({ behavior: 'smooth' });
       });
     }
  }
});
