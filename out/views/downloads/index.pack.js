"use strict";
var marked = require('marked');
var highlight_js_1 = require('highlight.js');
var button_1 = require('../../components/button');
var radio_field_1 = require('../../components/radio-field');
var downloads_1 = require('./downloads');
var Sniffr = require('sniffr');
var versionHeading = document.getElementById('versionHeading');
var versionDescription = document.getElementById('versionDescription');
var downloadCont = document.getElementById('downloadCont');
var baseUrl = "https://github.com/pipam/pipam/releases/download/v" + downloads_1.version;
var sniffr = new Sniffr();
sniffr.sniff(window.navigator.userAgent);
var osOpts = [
    {
        label: 'macOS',
        download: "Pipam-macOS-" + downloads_1.version + ".dmg"
    },
    {
        label: 'Windows (x64)',
        download: "Pipam-Setup-Windows-x64-" + downloads_1.version + ".exe"
    },
    {
        label: 'Linux (AppImage, x86_64)',
        download: "pipam-linux-x86_64-" + downloads_1.version + ".AppImage"
    },
    {
        label: 'Ubuntu (amd64)',
        download: "pipam-linux-amd64-" + downloads_1.version + ".deb"
    }
];
var downloadButton = new button_1.default({
    text: 'Download'
});
var osSelect = new radio_field_1.default();
var href = '';
osSelect.setOptions(osOpts.map(function (os) { return ({ text: os.label }); })).then(function () {
    osSelect.on('select', function (sel, i) {
        href = baseUrl + "/" + osOpts[i].download;
    });
    if (sniffr.os.name === 'windows') {
        osSelect.selected = 1;
        href = baseUrl + "/" + osOpts[1].download;
    }
    else if (sniffr.os.name === 'macos') {
        osSelect.selected = 0;
        href = baseUrl + "/" + osOpts[0].download;
    }
    else {
        osSelect.selected = 2;
        href = baseUrl + "/" + osOpts[2].download;
    }
    downloadButton.on('click', function () {
        window.open(href, '_blank');
    });
    downloadButton.prependTo(downloadCont);
    osSelect.appendTo(downloadCont);
    versionHeading.innerText = "v" + downloads_1.version;
    var renderer = new marked.Renderer();
    renderer.paragraph = function (txt) {
        if (txt.startsWith('<h'))
            return txt;
        return "<p>" + txt + "</p>";
    };
    var desc = marked(downloads_1.description, {
        renderer: renderer,
        highlight: function (code, lang) {
            return highlight_js_1.highlight(lang, code).value;
        }
    });
    versionDescription.innerHTML = desc;
});
//# sourceMappingURL=index.pack.js.map