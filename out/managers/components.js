'use strict';
var ComponentManager = (function () {
    function ComponentManager() {
        this.repo = new WeakMap();
    }
    ComponentManager.prototype.register = function (component) {
        this.repo.set(component.elm, component);
        return Promise.resolve();
    };
    ComponentManager.prototype.getByElement = function (elm) {
        return Promise.resolve(this.repo.get(elm));
    };
    return ComponentManager;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = new ComponentManager();
window.componentManager = module.exports; // Debugging
//# sourceMappingURL=components.js.map