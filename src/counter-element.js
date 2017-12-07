import { Element } from '../../node_modules/@polymer/polymer/polymer-element.js';
import { store } from './store/store.js';

import { increment, decrement } from './store/actions/clicks.js';

class CounterElement extends Element {
  static get template() {
    return `
    <div>
      <p>
        Clicked: <span id="value">[[clicks]]</span> times. Value is [[value]].
        <button on-click="onIncrement">+</button>
        <button on-click="onDecrement">-</button>
      </p>
    </div>
`;
  }

  static get is() {
    return 'counter-element';
  }

  static get properties() { return {
    clicks: Number,
    value: Number
  }}


  constructor() {
    super();

    // Connect the element to the store.
    store.subscribe(() => this.update());
    this.update();
  }

  // This is called every time something is updated in the store.
  update() {
    const state = store.getState();
    this.setProperties({
      clicks: state.clicks,
      value: state.value
    });
  }

  onIncrement() {
    store.dispatch(increment());
  }

  onDecrement() {
    store.dispatch(decrement());
  }
}

window.customElements.define(CounterElement.is, CounterElement);
