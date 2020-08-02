let instance, param;

window.addEventListener('load', () => {
  fadeEffect;
  if (param) {
    scrollToElement(param);
  }
});

document.addEventListener('DOMContentLoaded', function () {
  // if (!isTouchDevice())
  const scrollEle = document.querySelector('.gotoTop');
  let removed = false;
  param = getParams(window.location.href);
  instance = OverlayScrollbars(document.querySelectorAll('body'), {
    className: 'os-theme-thin-dark',
    scrollbars: {
      autoHide: 's',
    },
    callbacks: {
      onScroll: (e) => {
        if (e.target.scrollTop > 250 && removed === false) {
          scrollEle.classList.remove('hidden');
          removed = true;
        } else if (e.target.scrollTop <= 250 && removed === true) {
          scrollEle.classList.add('hidden');
          removed = false;
        }
      },
    },
  });
});

const fadeEffect = setInterval(() => {
  const loader = document.querySelector('.loading');
  if (!loader.style.opacity) {
    loader.style.opacity = 1;
  }
  if (loader.style.opacity > 0) {
    loader.style.opacity -= 0.2;
  } else {
    clearInterval(fadeEffect);
    loader.remove();
  }
}, 100);

const scrollToElement = (elementName) => {
  const scrollEle = document.getElementById(elementName);
  // if (!isTouchDevice() && scrollEle) instance.scroll(scrollEle, 1000);
  if (scrollEle) instance.scroll(scrollEle, 1000);
};

const scrollToTop = () => {
  instance.scroll(0, 1000);
  location.hash = '';
};

const getParams = (url) => {
  if (url.search('#') !== -1) {
    const hash = escape(url.substring(url.indexOf('#') + 1, url.length));
    return hash;
  }
  return false;
};

// function isTouchDevice() {
//   return (
//     'ontouchstart' in window ||
//     navigator.maxTouchPoints > 0 ||
//     navigator.msMaxTouchPoints > 0
//   );
// }
