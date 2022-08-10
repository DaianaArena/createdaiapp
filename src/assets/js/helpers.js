/*
 * HELPERS DE VIEWPORT
 *
 * sendHeight: envia la altura del contenedor al padre, util si el sitio esta en un iframe
 * isVisible: chequea si hay un elemento visible en el viewport, util para las animaciones
 * smoothScroll: hace smothscroll hacia el tag
 * getOffset: calcula la posicion de un elemento
 * browserDetection: devuelve el browser
*/

// envia la altura hacia el parent, si esta en un iframe es util
function sendHeight() {
  const actualHeight = document.querySelector('body').scrollHeight;
  const data = {
    contentheight: actualHeight,
  };
  window.parent.postMessage(JSON.stringify(data), '*');
}

// ve si el elemento es visible se pasa el node tomado antes por un querySelector
function isVisible(el) {
  let result = false;
  // Browser viewport
  const viewportH = window.innerHeight;
  const viewportTop = window.pageYOffset;
  const viewportBottom = viewportTop + viewportH;
  // DOM Element
  const elH = el.offsetHeight; // Height
  const elTop = el.getBoundingClientRect().top; // Top
  const elBottom = elTop + elH; // Bottom
  // Is inside viewport?
  if (elBottom > 0 && elTop < viewportH) {
    result = 1.0 - (elTop + elH) / (viewportH + elH);
  }

  return result;
}

// realiza un smoth scroll hacia el #ancla enviada
function smoothScroll(eID) {
  // toma la posicion del elemento, el cual debe pasarse para que sea uno solo por queryselector: '.clase', '#id', 'tag'
  function elmYPosition(eID) {
    const elm = document.querySelector(eID);
    let y = elm.offsetTop;
    let node = elm;
    while (node.offsetParent && node.offsetParent !== document.body) {
      node = node.offsetParent;
      y += node.offsetTop;

      if (window.innerWidth < 768) {
        y -= 50;
      }
    }
    return y;
  }

  // toma la posicion actual de la ventana
  function currentYPosition() {
    // Firefox, Chrome, Opera, Safari
    if (self.pageYOffset) return self.pageYOffset;
    // Internet Explorer 6 - standards mode
    if (document.documentElement && document.documentElement.scrollTop) return document.documentElement.scrollTop;
    // Internet Explorer 6, 7 and 8
    if (document.body.scrollTop) return document.body.scrollTop;
    return 0;
  }

  // smoth scroll
  const startY = currentYPosition();
  const stopY = elmYPosition(eID);
  const distance = stopY > startY ? stopY - startY : startY - stopY;
  if (distance < 100) {
    scrollTo(0, stopY); return;
  }
  let speed = Math.round(distance / 100);
  if (speed >= 20) speed = 20;
  const step = Math.round(distance / 25);
  let leapY = stopY > startY ? startY + step : startY - step;
  let timer = 0;
  if (stopY > startY) {
    for (var i = startY; i < stopY; i += step) {
      setTimeout(`window.scrollTo(0, ${leapY})`, timer * speed);
      leapY += step; if (leapY > stopY) leapY = stopY; timer++;
    } return;
  }
  for (var i = startY; i > stopY; i -= step) {
    setTimeout(`window.scrollTo(0, ${leapY})`, timer * speed);
    leapY -= step; if (leapY < stopY) leapY = stopY; timer++;
  }
}

// calcula la posicion de un elemento
function getOffset(el) {
  let _x = 0;
  let _y = 0;
  while (el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop)) {
    _x += el.offsetLeft - el.scrollLeft;
    _y += el.offsetTop - el.scrollTop;
    el = el.offsetParent;
  }
  return { top: _y, left: _x };
}

// detecta el browser
function browserDetection() {
  const userAgent = navigator.userAgent.toLowerCase();
  let browser;
  if (userAgent.indexOf('trident') > -1 || userAgent.indexOf('msie') > -1) {
    browser = 'ie';
  } else if (userAgent.indexOf('edge') > -1) {
    browser = 'edge';
  } else if (userAgent.indexOf('safari') !== -1) {
    if (userAgent.indexOf('chrome') > -1) {
      browser = 'chrome';
    } else if ((userAgent.indexOf('opera') > -1) || (userAgent.indexOf('opr') > -1)) {
      browser = 'opera';
    } else {
      browser = 'safari';
    }
  } else if (userAgent.indexOf('firefox') !== -1) {
    browser = 'firefox';
  } else {
    browser = 'dont-know';
  }

  return browser;
}

export {
  sendHeight, isVisible, smoothScroll, getOffset, browserDetection,
};
