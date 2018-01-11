import { PolymerLitElement } from '../../node_modules/@polymer/polymer-lit/polymer-lit-element.js'

// This element is *not* connected to the redux store.
class ShopItem extends PolymerLitElement {
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

  render(props, html) {
    return html`
      ${props.name}:
      <span hidden="${props.amount === 0}">${props.amount}: * </span>
      $${props.price}:
      </span>
    `;
  }
}

window.customElements.define(ShopItem.is, ShopItem);
