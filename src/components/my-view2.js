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
import './counter-element.js';

class MyView2 extends LitElement {
  render(props) {
    return html`
      <style>${SharedStyles}</style>
      <section>
        <h2>Redux example: simple counter</h2>
        <div class="circle">${props.clicks}</div>
        <p>This page contains a reusable <code>&lt;counter-element&gt;</code>, which
        you can think of it as being a third-party element you got from someone else).
        The source of truth for the data is this view, and it passes the value and
        clicks to the element; when the element updates its counter, it fires
        and event, and this page updates its internal state. You can also see the
        total number of clicks reflected in the bubble above.</p>
        <br><br>
      </section>
      <section>
        <p>
          <counter-element value="${props.value}" clicks="${props.clicks}"></counter-element>
        </p>
      </section>
    `;
  }

  static get is() {
    return 'my-view2';
  }

  static get properties() { return {
    clicks: Number,
    value: Number
  }}

  constructor() {
    super();
    this.clicks = 0;
    this.value = 0;
  }

  ready() {
    super.ready();
    // Every time the display of the counter updates, we should save
    // these values in the store
    this.addEventListener('counter-incremented', function() {
      this.clicks++;
      this.value++;
    });

    this.addEventListener('counter-decremented', function() {
      this.clicks++;
      this.value--;
    });
  }
}

window.customElements.define(MyView2.is, MyView2);
