import { LitElement, html } from '../../node_modules/@polymer/lit-element/lit-element.js'

// This is a reusable element. It is not connected to the store. You can
// imagine that it could just as well be a third-party element that you
// got from someone else.
class CounterElement extends LitElement {
  static get is() {
    return 'counter-element';
  }

  static get properties() { return {
    /* The total number of clicks you've done. */
    clicks: Number,
    /* The current value of the counter. */
    value: Number
  }};

  constructor() {
    super();
    this.clicks = 0;
    this.value = 0;
  }

  render(props) {
    return html`
      <div>
        <p>
          Clicked: <span id="value">${props.clicks}</span> times. Value is ${props.value}.
          <button on-click=${() => this._onIncrement()}>+</button>
          <button on-click=${() => this._onDecrement()}>-</button>
        </p>
      </div>
    `;
  }

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
