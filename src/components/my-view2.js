/**
@license
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

import { html } from 'lit-element';
import { PageViewElement } from './page-view-element.js';

// These are the elements needed by this element.
import './counter-element.js';

// These are the shared styles needed by this element.
import { SharedStyles } from './shared-styles.js';

class MyView2 extends PageViewElement {
  static get properties() {
    return {
      // This is the data from the store.
      _clicks: { type: Number },
      _value: { type: Number }
    };
  }

  static get styles() {
    return [
      SharedStyles
    ];
  }

  render() {
    return html`
      <section>
        <h2>State container example: simple counter</h2>
        <div class="circle">${this._clicks}</div>
        <p>This page contains a reusable <code>&lt;counter-element&gt;</code> which is connected to the
        store. When the element updates its counter, this page updates the values
        in the store, and you can see the total number of clicks reflected in
        the bubble above.</p>
        <br><br>
      </section>
      <section>
        <p>
          <counter-element
              value="${this._value}"
              clicks="${this._clicks}"
              @counter-incremented="${this._increment}"
              @counter-decremented="${this._decrement}">
          </counter-element>
        </p>
      </section>
    `;
  }

  constructor() {
    super();
    this._clicks = 0;
    this._value = 0;
  }

  _increment() {
    this._clicks++;
    this._value++;
  }

  _decrement() {
    this._clicks++;
    this._value--;
  }
}

window.customElements.define('my-view2', MyView2);
