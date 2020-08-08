let instance, param;

window.addEventListener('load', () => {
  fadeEffect;
});

const fadeEffect = setInterval(() => {
  const loader = document.querySelector('.loading');
  if (!loader.style.opacity) {
    loader.style.opacity = 1;
  }
  if (loader.style.opacity > 0) {
    loader.style.opacity -= 0.1;
  } else {
    clearInterval(fadeEffect);
    loader.remove();
  }
}, 100);

const scrollToTop = () => {
  instance.scroll(0, 1000);
  location.hash = '';
};
