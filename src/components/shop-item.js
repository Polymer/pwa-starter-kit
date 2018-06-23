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

// This element is *not* connected to the Redux store.
class ShopItem extends LitElement {
  _render(props) {
    return html`
      ${props.name}:
      <span hidden="${props.amount === 0}">${props.amount} * </span>
      $${props.price}
      </span>
    `;
  }

  static get properties() {
    return {
      name: String,
      amount: String,
      price: String
    }
  }
}

window.customElements.define('shop-item', ShopItem);
