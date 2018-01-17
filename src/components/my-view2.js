import { LitElement, html } from '../../node_modules/@polymer/lit-element/lit-element.js'
import { SharedStyles } from './shared-styles.js';
import { connect } from '../../lib/connect-mixin.js';
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

      <div class="card">
        <div class="circle">${props.clicks}</div>
        <h1>Redux example: simple counter</h1>
        <p>This page contains a reusable <code>&lt;counter-element&gt;</code>. The
        element is not build in a Redux-y way (you can think of it as being a
        third-party element you got from someone else), but this page is connected to the
        Redux store. When the element updates its counter, this page updates the values
        in the Redux store, and you can see the total number of clicks reflected in
        the bubble above.</p>
        <hr>
        <counter-element value="${props.value}" clicks="${props.clicks}"></counter-element>
      </div>
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
