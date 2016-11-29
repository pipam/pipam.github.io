'use strict';
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var events_1 = require('events');
var components_1 = require('../../managers/components');
var componentReady = Symbol.for('component.ready');
var BaseComponent = (function (_super) {
    __extends(BaseComponent, _super);
    function BaseComponent(opts) {
        _super.call(this);
        this.constrOpts = opts;
        // Element Creation
        this.elm = document.createElement('div');
        // Element Classes
        this.elm.className = 'component';
        this[componentReady]();
    }
    BaseComponent.prototype[componentReady] = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (_this.constrOpts) {
                if (_this.constrOpts.id) {
                    _this.elm.id = _this.constrOpts.id;
                }
                if (_this.constrOpts.classes) {
                    for (var _i = 0, _a = _this.constrOpts.classes; _i < _a.length; _i++) {
                        var className = _a[_i];
                        _this.elm.classList.add(className);
                    }
                }
                if (_this.constrOpts.children) {
                    for (var _b = 0, _c = _this.constrOpts.children; _b < _c.length; _b++) {
                        var child = _c[_b];
                        if (child instanceof BaseComponent) {
                            child.appendTo(_this.childCont());
                        }
                        else {
                            _this.childCont().appendChild(child);
                        }
                    }
                }
            }
            components_1.default.register(_this);
            setImmediate(function () {
                _this.emit('ready');
                resolve();
            });
        });
    };
    BaseComponent.prototype.childCont = function () {
        return this.elm;
    };
    BaseComponent.prototype.rootElms = function () {
        return [this.elm];
    };
    BaseComponent.prototype.appendTo = function (elm) {
        for (var _i = 0, _a = this.rootElms(); _i < _a.length; _i++) {
            var elem = _a[_i];
            if (elem instanceof BaseComponent) {
                elem.appendTo(elm);
            }
            else {
                elm.appendChild(elem);
            }
        }
    };
    BaseComponent.prototype.prependTo = function (elm) {
        for (var _i = 0, _a = this.rootElms(); _i < _a.length; _i++) {
            var elem = _a[_i];
            if (elem instanceof BaseComponent) {
                elem.prependTo(elm);
            }
            else {
                elm.insertBefore(elem, elm.firstChild);
            }
        }
    };
    BaseComponent.prototype.insertBeforeOn = function (elm, sibling) {
        for (var _i = 0, _a = this.rootElms(); _i < _a.length; _i++) {
            var elem = _a[_i];
            if (elem instanceof BaseComponent) {
                elem.insertBeforeOn(elm, sibling);
            }
            else {
                elm.insertBefore(elem, sibling);
            }
        }
    };
    BaseComponent.prototype.disown = function () {
        for (var _i = 0, _a = this.rootElms(); _i < _a.length; _i++) {
            var elem = _a[_i];
            if (elem instanceof BaseComponent) {
                elem.disown();
            }
            else {
                elem.parentNode.removeChild(elem);
            }
        }
    };
    Object.defineProperty(BaseComponent.prototype, "shown", {
        get: function () {
            return this.elm.classList.contains('shown');
        },
        set: function (val) {
            val = !!val;
            if (val) {
                this.elm.classList.add('shown');
            }
            else {
                this.elm.classList.remove('shown');
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseComponent.prototype, "fadable", {
        get: function () {
            return false;
        },
        enumerable: true,
        configurable: true
    });
    return BaseComponent;
}(events_1.EventEmitter));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = BaseComponent;
//# sourceMappingURL=index.js.map