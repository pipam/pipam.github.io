'use strict';

type object = any;

import BaseComponent from '../components/base';

class ComponentManager {
  repo: WeakMap<HTMLElement | BaseComponent, BaseComponent>;
  constructor() {
    this.repo = new WeakMap();
  }
  register(component: BaseComponent): Promise<void> {
    this.repo.set(component.elm, component);
    return Promise.resolve();
  }
  getByElement(elm: HTMLElement): Promise<BaseComponent> {
    return Promise.resolve(this.repo.get(elm));
  }
}

export default new ComponentManager(); // ComponentManager is a singleton
(<object>window).componentManager = module.exports; // Debugging
