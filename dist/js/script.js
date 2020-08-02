let instance, param;

window.addEventListener('load', () => {
  fadeEffect;
  if (param) {
    scrollToElement(param);
  }
});

document.addEventListener('DOMContentLoaded', function () {
  const scrollEle = document.querySelector('.gotoTop');
  const scrollEleBtn = document.querySelector('#gotoTopBtn');
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
          scrollEle.classList.remove('opacity-0');
          scrollEleBtn.classList.remove('cursor-default');
          removed = true;
        } else if (e.target.scrollTop <= 250 && removed === true) {
          scrollEle.classList.add('opacity-0');
          scrollEleBtn.classList.add('cursor-default');
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
    loader.style.opacity -= 0.1;
  } else {
    clearInterval(fadeEffect);
    loader.remove();
  }
}, 100);

const scrollToElement = (elementName) => {
  const scrollEle = document.getElementById(elementName);
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
