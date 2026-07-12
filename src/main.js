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

const updateThemeControls = () => {
  const activeTheme = getActiveTheme();

  document.querySelectorAll('[data-theme-toggle]').forEach((toggle) => {
    const isOled = activeTheme === 'oled';
    toggle.setAttribute('aria-pressed', String(isOled));
    toggle.setAttribute('aria-label', isOled ? 'Switch to light theme' : 'Switch to OLED black theme');
    toggle.title = isOled ? 'Switch to light theme' : 'Switch to OLED black theme';

    const icon = toggle.querySelector('.theme-toggle__icon');
    if (icon) icon.textContent = isOled ? '☀' : '◐';
  });
};

const applyTheme = (theme, persist = false) => {
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

const storedTheme = getStoredTheme();
if (storedTheme) {
  applyTheme(storedTheme);
} else {
  updateThemeControls();
}

document.querySelectorAll('[data-theme-toggle]').forEach((toggle) => {
  toggle.addEventListener('click', () => {
    applyTheme(getActiveTheme() === 'oled' ? 'light' : 'oled', true);
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

const navLinks = [...document.querySelectorAll('.site-nav a[href^="#"]')];
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
