/**
@license
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

import { LitElement, html, property } from '@polymer/lit-element';
import { connect } from 'pwa-helpers/connect-mixin.js';

// This element is connected to the Redux store.
import { store, RootState } from '../store.js';

// These are the elements needed by this element.
import './shop-item.js';

// These are the actions needed by this element.
import { getAllProducts, addToCart } from '../actions/shop.js';

// These are the elements needed by this element.
import { addToCartIcon } from './my-icons.js';

// These are the shared styles needed by this element.
import { ButtonSharedStyles } from './button-shared-styles.js';
import { ShopState, ProductsState } from '../reducers/shop.js';

class ShopProducts extends LitElement {
  render() {
    return html`
      ${ButtonSharedStyles}
      <style>
        :host { display: block; }
      </style>
      ${Object.keys(this._products).map((key) => {
        const item = this._products[key];
        return html`
          <div>
            <shop-item name="${item.title}" amount="${item.inventory}" price="${item.price}"></shop-item>
            <button
                .disabled="${item.inventory === 0}"
                @click="${(e: Event) => store.dispatch(addToCart((e.currentTarget as HTMLButtonElement).dataset['index']))}"
                data-index="${item.id}"
                title="${item.inventory === 0 ? 'Sold out' : 'Add to cart' }">
              ${item.inventory === 0 ? 'Sold out': addToCartIcon }
            </button>
          </div>
        `
      })}
    `;
  }

  @property({type: Object})
  _products: ProductsState = {};

  firstUpdated() {
    store.dispatch(getAllProducts());
  }
}

class ConnectedShopProducts extends connect(store)(ShopProducts) {
  // This is called every time something is updated in the store.
  _stateChanged(state: RootState) {
    this._products = (state.shop as ShopState).products;
  }
}

window.customElements.define('shop-products', ConnectedShopProducts);
