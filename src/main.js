const root = document.documentElement;
root.classList.add('js');

const themeStorageKey = 'portfolio-theme';
const systemTheme = window.matchMedia('(prefers-color-scheme: dark)');

const getStoredTheme = () => {
  try {
    const theme = window.localStorage.getItem(themeStorageKey);
    return theme === 'light' || theme === 'oled' ? theme : null;
  } catch {
    return null;
  }
};

const getActiveTheme = () => root.dataset.theme || (systemTheme.matches ? 'oled' : 'light');

const initThemeToggleIcons = () => {
  document.querySelectorAll('[data-theme-toggle]').forEach((toggle, index) => {
    const iconContainer = toggle.querySelector('.theme-toggle__icon');
    if (iconContainer) {
      const maskId = `theme-mask-${index}`;
      iconContainer.innerHTML = `
        <svg class="theme-icon-svg" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none">
          <mask id="${maskId}">
            <rect x="0" y="0" width="24" height="24" fill="white" />
            <circle cx="30" cy="0" r="6" fill="black" class="theme-mask-circle" />
          </mask>
          <circle cx="12" cy="12" r="5" fill="currentColor" mask="url(#${maskId})" class="theme-center-circle" />
          <g class="theme-rays" stroke="currentColor">
            <line x1="12" y1="1" x2="12" y2="3" />
            <line x1="12" y1="21" x2="12" y2="23" />
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
            <line x1="1" y1="12" x2="3" y2="12" />
            <line x1="21" y1="12" x2="23" y2="12" />
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
          </g>
        </svg>
      `;
    }
  });
};

const updateThemeControls = () => {
  const activeTheme = getActiveTheme();

  document.querySelectorAll('[data-theme-toggle]').forEach((toggle) => {
    const isOled = activeTheme === 'oled';
    toggle.setAttribute('aria-pressed', String(isOled));
    toggle.setAttribute('aria-label', isOled ? 'Switch to light theme' : 'Switch to OLED black theme');
    toggle.title = isOled ? 'Switch to light theme' : 'Switch to OLED black theme';
  });
};

const applyTheme = (theme, persist = false, animated = false, event = null) => {
  const changeTheme = () => {
    root.dataset.theme = theme;

    if (persist) {
      try {
        window.localStorage.setItem(themeStorageKey, theme);
      } catch {
        // The site remains fully usable when storage is unavailable.
      }
    }

    updateThemeControls();
  };

  const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!animated || !document.startViewTransition || isReducedMotion) {
    changeTheme();
    return;
  }

  // Get click coordinates or default to screen center
  let x = window.innerWidth / 2;
  let y = window.innerHeight / 2;

  if (event) {
    const rect = event.currentTarget.getBoundingClientRect();
    x = event.clientX || (rect.left + rect.width / 2);
    y = event.clientY || (rect.top + rect.height / 2);
  }

  // Calculate radius to the furthest viewport corner
  const endRadius = Math.hypot(
    Math.max(x, window.innerWidth - x),
    Math.max(y, window.innerHeight - y)
  );

  root.style.setProperty('--theme-toggle-x', `${x}px`);
  root.style.setProperty('--theme-toggle-y', `${y}px`);
  root.style.setProperty('--theme-toggle-r', `${endRadius}px`);

  document.startViewTransition(changeTheme);
};

// Initialize SVG icons immediately
initThemeToggleIcons();

const storedTheme = getStoredTheme();
if (storedTheme) {
  applyTheme(storedTheme);
} else {
  updateThemeControls();
}

document.querySelectorAll('[data-theme-toggle]').forEach((toggle) => {
  toggle.addEventListener('click', (event) => {
    applyTheme(getActiveTheme() === 'oled' ? 'light' : 'oled', true, true, event);
  });
});

systemTheme.addEventListener('change', () => {
  if (!getStoredTheme()) updateThemeControls();
});

const timeElement = document.getElementById('local-time');

if (timeElement) {
  const updateTime = () => {
    const now = new Date();
    timeElement.textContent = new Intl.DateTimeFormat('en-IN', {
      timeZone: 'Asia/Kolkata',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).format(now);
  };

  updateTime();
  window.setInterval(updateTime, 60_000);
}

const yearElement = document.getElementById('current-year');
if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const revealItems = document.querySelectorAll('.reveal');

if (reducedMotion || !('IntersectionObserver' in window)) {
  revealItems.forEach((item) => item.classList.add('is-visible'));
} else {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
  );

  revealItems.forEach((item) => revealObserver.observe(item));
}

const navLinks = [...document.querySelectorAll('.site-nav a[href^="#"], .mobile-nav-dock a[href^="#"]')];
const navTargets = navLinks
  .map((link) => ({ link, target: document.querySelector(link.getAttribute('href')) }))
  .filter(({ target }) => target);

if (navTargets.length && 'IntersectionObserver' in window) {
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      const visibleEntry = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (!visibleEntry) return;

      navTargets.forEach(({ link, target }) => {
        if (target === visibleEntry.target) {
          link.setAttribute('aria-current', 'page');
        } else {
          link.removeAttribute('aria-current');
        }
      });
    },
    { rootMargin: '-18% 0px -62% 0px', threshold: [0.05, 0.2, 0.5] },
  );

  navTargets.forEach(({ target }) => sectionObserver.observe(target));
}

// Auto-hide mobile navigation dock on scroll down
let lastScrollY = window.scrollY;
const mobileNav = document.querySelector('.mobile-nav-dock');
if (mobileNav) {
  window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;
    if (currentScrollY > lastScrollY && currentScrollY > 50) {
      mobileNav.style.transform = 'translate(-50%, 150%)';
      mobileNav.style.opacity = '0';
      mobileNav.style.pointerEvents = 'none';
    } else {
      mobileNav.style.transform = 'translate(-50%, 0)';
      mobileNav.style.opacity = '1';
      mobileNav.style.pointerEvents = 'auto';
    }
    lastScrollY = currentScrollY;
  }, { passive: true });
}

// Header sticky detection via IntersectionObserver
document.querySelectorAll('.site-header, .project-header').forEach((header) => {
  const sentinel = document.createElement('div');
  sentinel.className = 'header-sentinel';
  sentinel.style.height = '0';
  sentinel.style.margin = '0';
  sentinel.style.padding = '0';
  sentinel.style.pointerEvents = 'none';
  sentinel.style.visibility = 'hidden';
  
  header.parentNode.insertBefore(sentinel, header);

  const observer = new IntersectionObserver((entries) => {
    const isScrolled = !entries[0].isIntersecting;
    header.classList.toggle('is-sticky', isScrolled);
  }, {
    threshold: [0],
  });
  observer.observe(sentinel);
});
