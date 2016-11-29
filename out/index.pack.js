"use strict";
var then_utils_1 = require('then-utils');
var Sniffr = require('sniffr');
var Throttle = (function () {
    function Throttle() {
        this.inCall = false;
    }
    Throttle.prototype.run = function (func) {
        var _this = this;
        if (this.inCall)
            return;
        window.requestAnimationFrame(function () {
            func();
            _this.inCall = false;
        });
        this.inCall = true;
    };
    return Throttle;
}());
var hero = document.getElementById('hero');
var heroShuffleText = document.getElementById('heroShuffleText');
var sniffr = new Sniffr();
sniffr.sniff(window.navigator.userAgent);
var spans = Array.prototype.slice.call(heroShuffleText.getElementsByTagName('span'));
var lastSpan = null;
var longestSpan = spans.reduce(function (a, b) { return (a.innerText.length > b.innerText.length) ? a : b; });
heroShuffleText.style.width = longestSpan.innerText.length + "ch";
then_utils_1.asyncFor(spans, function (i, span) {
    if (lastSpan) {
        lastSpan.className = 'passed';
        lastSpan.style.marginTop = null;
    }
    span.className = 'active';
    span.style.marginTop = "0." + (i + 1) + "em";
    //if ((span.dataset as object).img) document.getElementById((span.dataset as object).img).className = 'shown';
    lastSpan = span;
    return then_utils_1.sleep(3000);
});
if (sniffr.browser.name !== 'safari') {
    // Safari lags with the listener
    var throttle_1 = new Throttle();
    window.addEventListener('scroll', function () {
        throttle_1.run(function () {
            hero.style.backgroundPosition = "50% " + window.pageYOffset * 0.5 + "px";
        });
    }, {
        passive: true
    });
}
else {
}
//# sourceMappingURL=index.pack.js.map