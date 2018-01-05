import { Element } from '../../node_modules/@polymer/polymer/polymer-element.js';

// This is a reusable element. It is not connected to the store. You can
// imagine that it could just as well be a third-party element that you
// got from someone else.
class CounterElement extends Element {
  static get template() {
    return `
    <div>
      <p>
        Clicked: <span id="value">[[clicks]]</span> times. Value is [[value]].
        <button on-click="_onIncrement">+</button>
        <button on-click="_onDecrement">-</button>
      </p>
    </div>
`;
  }

  static get is() {
    return 'counter-element';
  }

  static get properties() { return {
    /* The total number of clicks you've done. */
    clicks: {
      type: Number,
      value: 0
    },

    /* The current value of the counter. */
    value: {
      type: Number,
      value: 0
    }
  }};

  _onIncrement() {
    this.value++;
    this.clicks++;
    this.dispatchEvent(new CustomEvent('counter-incremented',
        {bubbles: true, composed: true}));
  }

  _onDecrement() {
    this.value--;
    this.clicks++;
    this.dispatchEvent(new CustomEvent('counter-decremented',
        {bubbles: true, composed: true}));
  }
}

window.customElements.define(CounterElement.is, CounterElement);
