/**
@license
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

import { html } from '@polymer/lit-element/lit-element.js';
import { PageViewElement } from './page-view-element.js';
import { SharedStyles } from './shared-styles.js';
import { connect } from 'pwa-helpers/connect-mixin.js';
import './counter-element.js';

// This element is connected to the redux store.
import { store } from '../store.js';

// These are the actions needed by this element.
import { increment, decrement } from '../actions/counter.js';

// We are lazy loading its reducer.
import counter from '../reducers/counter.js';
store.addReducers({
  counter
});

class MyView2 extends connect(store)(PageViewElement) {
  render(props) {
    return html`
      <style>${SharedStyles}</style>
      <section>
        <h2>Redux example: simple counter</h2>
        <div class="circle">${props.clicks}</div>
        <p>This page contains a reusable <code>&lt;counter-element&gt;</code>. The
        element is not build in a Redux-y way (you can think of it as being a
        third-party element you got from someone else), but this page is connected to the
        Redux store. When the element updates its counter, this page updates the values
        in the Redux store, and you can see the total number of clicks reflected in
        the bubble above.</p>
        <br><br>
      </section>
      <section>
        <p>
          <counter-element value="${props.value}" clicks="${props.clicks}"
              on-counter-incremented="${() => store.dispatch(increment())}"
              on-counter-decremented="${() => store.dispatch(decrement())}">

          </counter-element>
        </p>
      </section>
    `;
  }

  static get properties() { return {
    // This is the data from the store.
    clicks: Number,
    value: Number
  }}

  // This is called every time something is updated in the store.
  stateChanged(state) {
    this.clicks = state.counter.clicks;
    this.value = state.counter.value;
  }
}

window.customElements.define('my-view2', MyView2);
