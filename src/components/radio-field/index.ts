import BaseComponent, { BaseOptions } from '../base';
import uuid = require('uuid');
import { asyncFor, asyncWhile } from 'then-utils';

const componentReady = Symbol.for('component.ready');
const selected = Symbol('RadioFieldComponent.selected');

type RadioFieldOnSelectFunction = () => any;

interface RadioFieldOptions extends BaseOptions {};

interface RadioFieldItemObject {
  text?: string;
  onselect?: RadioFieldOnSelectFunction;
  selected?: boolean;
}

interface RadioFieldItem {
  input: HTMLInputElement;
  label: HTMLLabelElement;
  text: string;
}

class RadioFieldComponent extends BaseComponent {
  elm: HTMLElement;
  items: RadioFieldItem[];
  fieldName: string;
  constructor(opts?: RadioFieldOptions) {
    super(opts);

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
  get selected(): number {
    return this[selected];
  }
  set selected(val: number) {
    if (!this.items[val]) return;

    this.items[val].input.checked = true;
    this[selected] = val;
  }
  addOption({
    text = 'Item',
    onselect = null,
    selected = false
  }: RadioFieldItemObject = {}): Promise<number> {
    const input = document.createElement('input');
    const label = document.createElement('label');

    input.type = 'radio';
    input.name = this.fieldName;

    input.id = uuid();
    label.htmlFor = input.id;

    input.checked = selected;

    const item: RadioFieldItem = {
      input,
      label,
      text
    };

    this.items.push(item);

    label.innerHTML = text;
    if (onselect) this.on('select', (it) => (it === item) && onselect());

    input.addEventListener('click', () => {
      this.emit('select', item, this.items.indexOf(item));
    });

    this.elm.appendChild(input);
    this.elm.appendChild(label);
    return Promise.resolve(this.items.indexOf(item));
  }
  removeOption(index: number): Promise<void> {
    const item = this.items[index];
    item.input.parentNode.removeChild(item.input);
    item.label.parentNode.removeChild(item.label);
    return Promise.resolve();
  }
  setOptions(arr: RadioFieldItemObject[]): Promise<void> {
    return asyncWhile(() => !!this.items[0], () => {
      return this.removeOption(0);
    }).then(() => {
      return asyncFor(arr, (i, item) => {
        return this.addOption(item);
      });
    });
  }
  get fadable(): boolean {
    return true;
  }
}

export default RadioFieldComponent;