/**
@license
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

import { LitElement, html } from '../../node_modules/@polymer/lit-element/lit-element.js'
import { SharedStyles } from './shared-styles.js';
import { connect } from '../../node_modules/pwa-helpers/connect-mixin.js';
import './shop-products.js'
import './shop-cart.js'

// This element is connected to the redux store.
import { store } from '../store.js';

// We are lazy loading its reducer.
import shop from '../reducers/shop.js';
store.addReducers({
  shop
});

// These are the actions needed by this element.
import { checkout } from '../actions/shop.js';

class MyView3 extends connect(store)(LitElement) {
  render({cart, error}) {
    return html`
      <style>${SharedStyles}</style>

      <section>
        <h2>Redux example: shopping cart</h2>
        <div class="circle">${this._numItemsInCart(cart)}</div>

        <p>This is a slightly more advanced Redux example, that simulates a
          shopping cart: getting the products, adding/removing items to the
          cart, and a checkout action, that can sometimes randomly fail (to
          simulate where you would add failure handling). </p>
        <p>This view, as well as its 2 child elements, <code>&lt;shop-products&gt;</code> and
        <code>&lt;shop-cart&gt;</code> are connected to the Redux store.</p>
      </section>
      <section>
        <h3>Products</h3>
        <shop-products></shop-products>

        <h3>Your Cart</h3>
        <shop-cart></shop-cart>

        <div>${error}</div>
        <button hidden="${cart.addedIds.length == 0}" on-click="${this.checkout}">
          Checkout
        </button>
      </section>
    `;
  }

  static get is() {
    return 'my-view3';
  }

  static get properties() { return {
    // This is the data from the store.
    cart: Object,
    error: String
  }}

  // This is called every time something is updated in the store.
  stateChanged(state) {
    this.cart = state.shop.cart;
    this.error = state.shop.error;
  }

  checkout(event) {
    store.dispatch(checkout());
  }

  _numItemsInCart(cart) {
    let num = 0;
    for (let id of cart.addedIds) {
      num += cart.quantityById[id];
    }
    return num;
  }
}

window.customElements.define(MyView3.is, MyView3);
