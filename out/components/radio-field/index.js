"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var base_1 = require('../base');
var uuid = require('uuid');
var then_utils_1 = require('then-utils');
var componentReady = Symbol.for('component.ready');
var selected = Symbol('RadioFieldComponent.selected');
;
var RadioFieldComponent = (function (_super) {
    __extends(RadioFieldComponent, _super);
    function RadioFieldComponent(opts) {
        _super.call(this, opts);
        this.items = [];
        this.fieldName = uuid();
        // Element Creation
        this.elm = document.createElement('div');
        // Element Classes
        this.elm.className = 'component fadable radio-field';
        this.shown = true;
        this[selected] = -1;
        this[componentReady]();
    }
    Object.defineProperty(RadioFieldComponent.prototype, "selected", {
        get: function () {
            return this[selected];
        },
        set: function (val) {
            if (!this.items[val])
                return;
            this.items[val].input.checked = true;
            this[selected] = val;
        },
        enumerable: true,
        configurable: true
    });
    RadioFieldComponent.prototype.addOption = function (_a) {
        var _this = this;
        var _b = _a === void 0 ? {} : _a, _c = _b.text, text = _c === void 0 ? 'Item' : _c, _d = _b.onselect, onselect = _d === void 0 ? null : _d, _e = _b.selected, selected = _e === void 0 ? false : _e;
        var input = document.createElement('input');
        var label = document.createElement('label');
        input.type = 'radio';
        input.name = this.fieldName;
        input.id = uuid();
        label.htmlFor = input.id;
        input.checked = selected;
        var item = {
            input: input,
            label: label,
            text: text
        };
        this.items.push(item);
        label.innerHTML = text;
        if (onselect)
            this.on('select', function (it) { return (it === item) && onselect(); });
        input.addEventListener('click', function () {
            _this.emit('select', item, _this.items.indexOf(item));
        });
        this.elm.appendChild(input);
        this.elm.appendChild(label);
        return Promise.resolve(this.items.indexOf(item));
    };
    RadioFieldComponent.prototype.removeOption = function (index) {
        var item = this.items[index];
        item.input.parentNode.removeChild(item.input);
        item.label.parentNode.removeChild(item.label);
        return Promise.resolve();
    };
    RadioFieldComponent.prototype.setOptions = function (arr) {
        var _this = this;
        return then_utils_1.asyncWhile(function () { return !!_this.items[0]; }, function () {
            return _this.removeOption(0);
        }).then(function () {
            return then_utils_1.asyncFor(arr, function (i, item) {
                return _this.addOption(item);
            });
        });
    };
    Object.defineProperty(RadioFieldComponent.prototype, "fadable", {
        get: function () {
            return true;
        },
        enumerable: true,
        configurable: true
    });
    return RadioFieldComponent;
}(base_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = RadioFieldComponent;
//# sourceMappingURL=index.js.map