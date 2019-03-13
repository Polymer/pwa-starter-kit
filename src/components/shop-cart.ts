/**
@license
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

import { LitElement, html, css, property, customElement } from 'lit-element';
import { connect } from 'pwa-helpers/connect-mixin.js';

// This element is connected to the Redux store.
import { store, RootState } from '../store.js';

// These are the elements needed by this element.
import { removeFromCartIcon } from './my-icons.js';
import './shop-item.js';

// These are the actions needed by this element.
import { removeFromCart } from '../actions/shop.js';

// These are the reducers needed by this element.
import { cartItemsSelector, cartTotalSelector } from '../reducers/shop.js';

// These are the shared styles needed by this element.
import { ButtonSharedStyles } from './button-shared-styles.js';
import { CartItem } from '../reducers/shop.js';

@customElement('shop-cart')
export class ShopCart extends connect(store)(LitElement) {
  @property({type: Array})
  private _items: Array<CartItem> = [];

  @property({type: Number})
  private _total = 0;

  static get styles() {
    return [
      ButtonSharedStyles,
      css`
        :host {
          display: block;
        }
      `
    ];
  }

  protected render() {
    return html`
      <p ?hidden="${this._items.length !== 0}">Please add some products to cart.</p>
      ${this._items.map((item) =>
        html`
          <div>
            <shop-item .name="${item.title}" .amount="${item.amount}" .price="${item.price}"></shop-item>
            <button
                @click="${this._removeButtonClicked}"
                data-index="${item.id}"
                title="Remove from cart">
              ${removeFromCartIcon}
            </button>
          </div>
        `
      )}
      <p ?hidden="${!this._items.length}"><b>Total:</b> ${this._total}</p>
    `;
  }


  private _removeButtonClicked(e: Event) {
    store.dispatch(removeFromCart((e.currentTarget as HTMLButtonElement).dataset['index']));
  }

  // This is called every time something is updated in the store.
  stateChanged(state: RootState) {
    this._items = cartItemsSelector(state);
    this._total = cartTotalSelector(state);
  }
}
