import { PolymerLitElement } from '../../node_modules/@polymer/polymer-lit/polymer-lit-element.js'

import { connect } from '../../lib/connect-mixin.js';
import './shop-item.js'

// This element is connected to the redux store.
import { store } from '../store.js';
import { removeFromCart } from '../actions/shop.js';

class ShopCart extends connect(store)(PolymerLitElement) {
  render(props, html) {
    return html`
      <p hidden="${props.cart.addedIds.length !== 0}">Please add some products to cart.</p>
      <dom-repeat items="${this._displayCart(props.cart)}">
        <template>
          <div>
            <shop-item name="[[item.title]]" amount="[[item.amount]]" price="[[item.price]]"></shop-item>
            <button data-index$="[[item.id]]">
              Remove
            </button>
          </div>
        </template>
      </dom-repeat>
      <p>Total: $<span>${this._calculateTotal(props.cart)}</span></p>
    `;
  }

  static get is() {
    return 'shop-cart';
  }

  static get properties() { return {
    cart: Object,
    products: Object
  }}

  ready() {
    super.ready();
    this.addEventListener('click', (e) => {
      if (event.path[0].dataset['index']) {
        store.dispatch(removeFromCart(event.path[0].dataset['index']));
      }
    });
  }

  // This is called every time something is updated in the store.
  update(state) {
    this.products = state.shop.products;
    this.cart = state.shop.cart;
  }

  _displayCart(cart) {
    const items = [];
    for (let id of cart.addedIds) {
      const item = this.products[id];
      items.push({id: item.id, title: item.title, amount: cart.quantityById[id], price: item.price});
    }
    return items;
  }

  _calculateTotal(cart) {
    let total = 0;
    for (let id of cart.addedIds) {
      const item = this.products[id];
      total += item.price * cart.quantityById[id];
    }
    return parseFloat(Math.round(total * 100) / 100).toFixed(2);
  }
}

window.customElements.define(ShopCart.is, ShopCart);
