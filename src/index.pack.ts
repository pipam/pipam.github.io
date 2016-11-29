type object = any;

import { asyncFor, sleep } from 'then-utils';
import Sniffr = require('sniffr');

class Throttle {
  inCall = false;
  run(func: () => void): void {
    if (this.inCall) return;
    window.requestAnimationFrame(() => {
      func();
      this.inCall = false;
    });
    this.inCall = true;
  }
}

const hero = document.getElementById('hero');
const heroShuffleText = document.getElementById('heroShuffleText');

const sniffr = new Sniffr();
sniffr.sniff(window.navigator.userAgent);

const spans = Array.prototype.slice.call(heroShuffleText.getElementsByTagName('span')) as HTMLSpanElement[];
let lastSpan: HTMLSpanElement = null;

const longestSpan = spans.reduce((a, b) => (a.innerText.length > b.innerText.length) ? a : b);
heroShuffleText.style.width = `${longestSpan.innerText.length}ch`;

asyncFor(spans, (i, span) => {
  if (lastSpan) {
    lastSpan.className = 'passed';
    lastSpan.style.marginTop = null;
  }
  span.className = 'active';
  span.style.marginTop = `0.${i + 1}em`;
  //if ((span.dataset as object).img) document.getElementById((span.dataset as object).img).className = 'shown';
  lastSpan = span;
  return sleep(3000);
});

if (sniffr.browser.name !== 'safari') {
  // Safari lags with the listener
  const throttle = new Throttle();
  window.addEventListener('scroll', () => {
    throttle.run(() => {
      hero.style.backgroundPosition = `50% ${window.pageYOffset * 0.5}px`;
    });
  }, {
    passive: true
  } as any);
} else {
  // ~~For Safari, just do fixed background~~
  //hero.style.backgroundAttachment = 'fixed';
  // Nope! Safari can't even handle fixed background .-.
}