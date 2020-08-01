const fadeEffect = setInterval(() => {
  const loader = document.querySelector(".loading");
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
window.addEventListener("load", () => {
  fadeEffect;
});
