import { Element } from '../../node_modules/@polymer/polymer/polymer-element.js';

// This element is *not* connected to the redux store.

class ShopItem extends Element {
  static get template() {
    return `
      <style>
        display: inline-block;
      </style>
        [[name]]:
        <span hidden$="[[_hideAmount(amount)]]">[[amount]] * </span>
        $[[price]]
      </span>
    `;
  }

  static get is() {
    return 'shop-item';
  }

  static get properties() {
    return {
      name: String,
      amount: String,
      price: String
    }
  }

  _hideAmount(amount) {
    return (amount === 0);
  }
}

window.customElements.define(ShopItem.is, ShopItem);
