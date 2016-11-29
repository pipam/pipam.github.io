'use strict';
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var base_1 = require('../base');
var componentReady = Symbol.for('component.ready');
var ButtonComponent = (function (_super) {
    __extends(ButtonComponent, _super);
    function ButtonComponent(opts) {
        var _this = this;
        _super.call(this, opts);
        // Element Creation
        this.elm = document.createElement('button');
        // Element Classes
        this.elm.className = 'component fadable button';
        // Element Event Listeners
        this.elm.addEventListener('click', function () {
            _this.emit('click');
        });
        if (opts && opts.text) {
            this.elm.innerHTML = opts.text;
        }
        this.shown = true;
        this[componentReady]();
    }
    Object.defineProperty(ButtonComponent.prototype, "text", {
        get: function () {
            return this.elm.innerHTML;
        },
        set: function (val) {
            this.elm.innerHTML = val;
        },
        enumerable: true,
        configurable: true
    });
    ButtonComponent.prototype.click = function () {
        this.elm.click();
    };
    Object.defineProperty(ButtonComponent.prototype, "fadable", {
        get: function () {
            return true;
        },
        enumerable: true,
        configurable: true
    });
    return ButtonComponent;
}(base_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ButtonComponent;
//# sourceMappingURL=index.js.map