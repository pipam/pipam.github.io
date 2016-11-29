"use strict";
var marked = require('marked');
var radio_field_1 = require('../../components/radio-field');
var button_1 = require('../../components/button');
var Sniffr = require('sniffr');
var highlight_js_1 = require('highlight.js');
var isAbsoluteUrl = require('is-absolute-url');
var then_utils_1 = require('then-utils');
var url_1 = require('url');
// getParameterByName, modified from http://stackoverflow.com/a/901144/6620880
// courtesy of jolly.exe on StackOverflow (https://stackoverflow.com/users/1045296/jolly-exe)
function getParameterByName(name, url) {
    if (url === void 0) { url = window.location.href; }
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)");
    var results = regex.exec(url);
    if (!results)
        return null;
    if (!results[2])
        return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}
var docsBar = document.getElementById('docsBar');
var docsCont = document.getElementById('docsCont');
var docsNav = document.getElementById('docsNav');
var docParam = getParameterByName('doc');
var baseDocUrl = 'https://raw.githubusercontent.com/pipam/pipam/master/docs';
var toggleNavButton = new button_1.default({
    text: 'Toggle Docs Nav'
});
var scriptField = new radio_field_1.default();
var osField = new radio_field_1.default();
toggleNavButton.on('click', function () {
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
scriptField.on('select', function (item, i) {
    docsCont.dataset.scriptPref = item.text.toLowerCase();
    if (window.localStorage) {
        window.localStorage.setItem('scriptPref', String(i));
    }
});
osField.on('select', function (item, i) {
    docsCont.dataset.osPref = item.text.toLowerCase();
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
]).then(function () {
    toggleNavButton.appendTo(docsBar);
    scriptField.appendTo(docsBar);
    osField.appendTo(docsBar);
    var sniffr = new Sniffr();
    sniffr.sniff(window.navigator.userAgent);
    if (sniffr.os.name === 'windows') {
        docsCont.dataset.osPref = 'windows';
        osField.selected = 1;
    }
    else {
        osField.selected = 0;
    }
    if (window.localStorage) {
        var osPref = window.localStorage.getItem('osPref');
        var scriptPref = window.localStorage.getItem('scriptPref');
        if (osPref)
            osField.selected = parseInt(osPref);
        if (scriptPref)
            scriptField.selected = parseInt(scriptPref);
    }
    window.fetch('../../../resources/docs-index.json').then(function (res) {
        if (!res.ok)
            return Promise.reject(new Error('Couldn\'t fetch doc index'));
        return res.json();
    }).then(function (json) {
        var loop = function (child, parentElm) {
            var elm = null;
            if (child.children) {
                elm = document.createElement('div');
                elm.className = 'docsNavExpandCont';
                var a_1 = document.createElement('a');
                a_1.className = 'docsNavItem expandable';
                a_1.href = "./index.html?doc=" + child.path;
                a_1.innerHTML = child.title;
                elm.addEventListener('click', function () {
                    a_1.click();
                });
                var div = document.createElement('div');
                div.className = 'expand';
                elm.appendChild(a_1);
                elm.appendChild(div);
                for (var _i = 0, _a = child.children; _i < _a.length; _i++) {
                    var child2 = _a[_i];
                    loop(child2, div);
                }
            }
            else {
                elm = document.createElement('a');
                elm.className = 'docsNavItem';
                elm.href = "./index.html?doc=" + child.path;
                elm.innerHTML = child.title;
            }
            parentElm.appendChild(elm);
        };
        for (var _i = 0, _a = json.children; _i < _a.length; _i++) {
            var child = _a[_i];
            loop(child, docsNav);
        }
    }).then(function () {
        if (!docParam) {
            docsNav.classList.add('shown');
        }
        else {
            return window.fetch(baseDocUrl + "/" + docParam).then(function (res) {
                if (!res.ok)
                    return Promise.reject(new Error('Couldn\'t fetch doc'));
                return res.text();
            }).then(function (str) {
                var renderer = new marked.Renderer();
                renderer.paragraph = function (txt) {
                    if (txt.startsWith('<h'))
                        return txt;
                    return "<p>" + txt + "</p>";
                };
                return marked(str, {
                    renderer: renderer,
                    highlight: function (code, lang) {
                        return highlight_js_1.highlight(lang, code).value;
                    }
                });
            }).then(function (html) {
                docsCont.innerHTML = html;
                return then_utils_1.asyncFor(Array.prototype.slice.call(docsCont.getElementsByTagName('a')), function (i, link) {
                    var href = link.getAttribute('href');
                    if (!isAbsoluteUrl(href)) {
                        if (href.endsWith('.md')) {
                            link.href = "./index.html?doc=" + url_1.resolve(docParam, href);
                        }
                        else {
                            link.href = url_1.resolve(baseDocUrl + "/" + docParam, href);
                        }
                    }
                    return Promise.resolve();
                });
            });
        }
    });
});
//# sourceMappingURL=index.pack.js.map