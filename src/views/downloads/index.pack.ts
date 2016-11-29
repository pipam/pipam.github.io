type object = any;

import marked = require('marked');
import { highlight } from 'highlight.js';
import ButtonComponent from '../../components/button';
import RadioFieldComponent from '../../components/radio-field';
import { version, description } from './downloads';
import Sniffr = require('sniffr');

interface DownloadsInfo {
  version: string;
  description: string;
}

interface OS {
  label: string;
  download: string;
}

const versionHeading = document.getElementById('versionHeading');
const versionDescription = document.getElementById('versionDescription');
const downloadCont = document.getElementById('downloadCont');
const baseUrl = `https://github.com/pipam/pipam/releases/download/v${version}`;
const sniffr = new Sniffr();
sniffr.sniff(window.navigator.userAgent);

const osOpts: OS[] = [
  {
    label: 'macOS',
    download: `Pipam-macOS-${version}.dmg`
  },
  {
    label: 'Windows (x64)',
    download: `Pipam-Setup-Windows-x64-${version}.exe`
  },
  {
    label: 'Linux (AppImage, x86_64)',
    download: `pipam-linux-x86_64-${version}.AppImage`
  },
  {
    label: 'Ubuntu (amd64)',
    download: `pipam-linux-amd64-${version}.deb`
  }
];

const downloadButton = new ButtonComponent({
  text: 'Download'
});
const osSelect = new RadioFieldComponent();
let href = '';

osSelect.setOptions(osOpts.map(os => ({ text: os.label }))).then(() => {
  osSelect.on('select', (sel, i: number) => {
    href = `${baseUrl}/${osOpts[i].download}`;
  });

  if (sniffr.os.name === 'windows') {
    osSelect.selected = 1;
    href = `${baseUrl}/${osOpts[1].download}`;
  } else if (sniffr.os.name === 'macos') {
    osSelect.selected = 0;
    href = `${baseUrl}/${osOpts[0].download}`;
  } else {
    osSelect.selected = 2;
    href = `${baseUrl}/${osOpts[2].download}`;
  }

  downloadButton.on('click', () => {
    window.open(href, '_blank');
  });

  downloadButton.prependTo(downloadCont);
  osSelect.appendTo(downloadCont);

  versionHeading.innerText = `v${version}`;

  const renderer = new marked.Renderer();
  renderer.paragraph = (txt) => {
    if (txt.startsWith('<h')) return txt;
    return `<p>${txt}</p>`;
  };

  const desc = marked(description, {
    renderer,
    highlight(code, lang) {
      return highlight(lang, code).value;
    }
  });

  versionDescription.innerHTML = desc;
});