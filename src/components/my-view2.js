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
import { connect } from '../../../node_modules/redux-helpers/connect-mixin.js';
import './shared-styles.js';
import './counter-element.js';

// This element is connected to the redux store.
import { store } from '../store.js';

// We are lazy loading its reducer.
import counter from '../reducers/counter.js';
store.addReducers({
  counter
});


// These are the actions needed by this element.
import { increment, decrement } from '../actions/counter.js';

class MyView2 extends connect(store)(LitElement) {
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

  ready() {
    super.ready();
    // Every time the display of the counter updates, we should save
    // these values in the store
    this.addEventListener('counter-incremented', function() {
      store.dispatch(increment());
    });

    this.addEventListener('counter-decremented', function() {
      store.dispatch(decrement());
    });
  }

  // This is called every time something is updated in the store.
  update(state) {
    this.clicks = state.counter.clicks;
    this.value = state.counter.value;
  }
}

window.customElements.define(MyView2.is, MyView2);
