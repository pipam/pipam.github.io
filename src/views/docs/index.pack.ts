type object = any;

import marked = require('marked');
import RadioFieldComponent from '../../components/radio-field';
import ButtonComponent from '../../components/button';
import Sniffr = require('sniffr');
import { highlight } from 'highlight.js';
import isAbsoluteUrl = require('is-absolute-url');
import { asyncFor } from 'then-utils';
import { resolve } from 'url';

// getParameterByName, modified from http://stackoverflow.com/a/901144/6620880
// courtesy of jolly.exe on StackOverflow (https://stackoverflow.com/users/1045296/jolly-exe)
function getParameterByName(name: string, url: string = window.location.href): string {
  name = name.replace(/[\[\]]/g, "\\$&");

  const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`);
  const results = regex.exec(url);

  if (!results) return null;
  if (!results[2]) return '';

  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

interface DocIndexItem {
  title: string;
  path: string;
  children?: DocIndexItem[];
}

const docsBar = document.getElementById('docsBar');
const docsCont = document.getElementById('docsCont');
const docsNav = document.getElementById('docsNav');
const docParam = getParameterByName('doc');
const baseDocUrl = 'https://raw.githubusercontent.com/pipam/pipam/master/docs'/*`${window.location.protocol}//${window.location.hostname}:8081/docs`*/;

const toggleNavButton = new ButtonComponent({
  text: 'Toggle Docs Nav'
});
const scriptField = new RadioFieldComponent();
const osField = new RadioFieldComponent();

toggleNavButton.on('click', () => {
  docsNav.classList.toggle('shown');
});

scriptField.setOptions([
  {
    text: 'TypeScript',
    selected: true
  },
  {
    text: 'JavaScript'
  }
]);
scriptField.on('select', (item, i: number) => {
  (<object>docsCont.dataset).scriptPref = item.text.toLowerCase();
  if (window.localStorage) {
    window.localStorage.setItem('scriptPref', String(i));
  }
});

osField.on('select', (item, i: number) => {
  (docsCont.dataset as object).osPref = item.text.toLowerCase();
  if (window.localStorage) {
    window.localStorage.setItem('osPref', String(i));
  }
});

osField.setOptions([
  {
    text: 'Unix',
    selected: true
  },
  {
    text: 'Windows'
  }
]).then(() => {
  toggleNavButton.appendTo(docsBar);
  scriptField.appendTo(docsBar);
  osField.appendTo(docsBar);

  const sniffr = new Sniffr();
  sniffr.sniff(window.navigator.userAgent);

  if (sniffr.os.name === 'windows') {
    (docsCont.dataset as object).osPref = 'windows';
    osField.selected = 1;
  } else {
    osField.selected = 0;
  }

  if (window.localStorage) {
    const osPref = window.localStorage.getItem('osPref');
    const scriptPref = window.localStorage.getItem('scriptPref');

    if (osPref) osField.selected = parseInt(osPref);
    if (scriptPref) scriptField.selected = parseInt(scriptPref);
  }

  window.fetch('../../../resources/docs-index.json').then(res => {
    if (!res.ok) return Promise.reject(new Error('Couldn\'t fetch doc index'));
    return res.json();
  }).then((json: DocIndexItem) => {
    const loop = (child, parentElm) => {
      let elm: HTMLDivElement | HTMLAnchorElement = null;
      if (child.children) {
        elm = document.createElement('div');
        elm.className = 'docsNavExpandCont';

        const a = document.createElement('a');
        a.className = 'docsNavItem expandable';
        a.href = `./index.html?doc=${child.path}`;
        a.innerHTML = child.title;

        elm.addEventListener('click', () => {
          a.click();
        });

        const div = document.createElement('div');
        div.className = 'expand';

        elm.appendChild(a);
        elm.appendChild(div);

        for (const child2 of child.children) loop(child2, div);
      } else {
        elm = document.createElement('a');
        elm.className = 'docsNavItem';
        elm.href = `./index.html?doc=${child.path}`;
        elm.innerHTML = child.title;
      }

      parentElm.appendChild(elm);
    };

    for (const child of json.children) loop(child, docsNav);
  }).then(() => {
    if (!docParam) {
      docsNav.classList.add('shown');
    } else {
      return window.fetch(`${baseDocUrl}/${docParam}`).then(res => {
        if (!res.ok) return Promise.reject(new Error('Couldn\'t fetch doc'));
        return res.text();
      }).then(str => {
        const renderer = new marked.Renderer();
        renderer.paragraph = (txt) => {
          if (txt.startsWith('<h')) return txt;
          return `<p>${txt}</p>`;
        };

        return marked(str, {
          renderer,
          highlight(code, lang) {
            return highlight(lang, code).value;
          }
        });
      }).then(html => {
        docsCont.innerHTML = html;
        return asyncFor((<HTMLAnchorElement[]>Array.prototype.slice.call(docsCont.getElementsByTagName('a'))), (i, link) => {
          const href = link.getAttribute('href');
          if (!isAbsoluteUrl(href)) {
            if (href.endsWith('.md')) {
              link.href = `./index.html?doc=${resolve(docParam, href)}`;
            } else {
              link.href = resolve(`${baseDocUrl}/${docParam}`, href);
            }
          }
          return Promise.resolve();
        });
      });
    }
  });
});
