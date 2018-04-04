/**
@license
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

import { LitElement, html } from '@polymer/lit-element';

import { connect } from 'pwa-helpers/connect-mixin.js';
import './shop-item.js';

// This element is connected to the redux store.
import { store } from '../store.js';
import { removeFromCart } from '../actions/shop.js';
import { removeFromCartIcon } from './my-icons.js';
import { ButtonSharedStyles } from './button-shared-styles.js';

class ShopCart extends connect(store)(LitElement) {
  render({_cart, _products}) {
    return html`
      <style>${ButtonSharedStyles}</style>
      <style>
        :host { display: block; }
      </style>
      <p hidden="${_cart.addedIds.length !== 0}">Please add some products to cart.</p>
      ${this._displayCart(_cart).map((item) =>
        html`
          <div>
            <shop-item name="${item.title}" amount="${item.amount}" price="${item.price}"></shop-item>
            <button
                on-click="${(e) => this._removeFromCart(e)}"
                data-index$="${item.id}"
                title="Remove from cart">
              ${removeFromCartIcon}
            </button>
          </div>
        `
      )}
    `;
  }

  static get properties() { return {
    _cart: Object,
    _products: Object
  }}

  // This is called every time something is updated in the store.
  stateChanged(state) {
    this._products = state.shop.products;
    this._cart = state.shop.cart;
  }

  _displayCart(cart) {
    const items = [];
    for (let id of cart.addedIds) {
      const item = this._products[id];
      items.push({id: item.id, title: item.title, amount: cart.quantityById[id], price: item.price});
    }
    return items;
  }

  _calculateTotal(cart) {
    let total = 0;
    for (let id of cart.addedIds) {
      const item = this._products[id];
      total += item.price * cart.quantityById[id];
    }
    return parseFloat(Math.round(total * 100) / 100).toFixed(2);
  }

  _removeFromCart(event) {
    store.dispatch(removeFromCart(event.currentTarget.dataset['index']));
  }
}

window.customElements.define('shop-cart', ShopCart);
