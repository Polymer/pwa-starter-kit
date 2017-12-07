import { Element } from '../node_modules/@polymer/polymer/polymer-element.js';
import './shared-styles.js';
import './counter-element.js';

// This element is connected to the redux store.
import { store } from './store/store.js';
import { increment, decrement } from './store/actions/counter.js';

class MyView2 extends Element {
  static get template() {
    return `
    <style include="shared-styles">
      :host {
        display: block;
        padding: 10px;
      }
    </style>

    <div class="card">
      <div class="circle">[[clicks]]</div>
      <h1>Redux example</h1>
      <p>This page contains a reusable <code>&lt;counter-element&gt;</code>. The
      element is not build in a Redux-y way (you can think of it as being a
      third-party element you got from someone else), but this page is connected to the
      Redux store. When the element updates its counter, this page updates the values
      in the Redux store, and you can see the total number of clicks reflected in
      the bubble above.</p>
      <hr>
      <counter-element value="[[value]]" clicks="[[clicks]]"></counter-element>
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

  constructor() {
    super();

    // Connect the element to the store.
    store.subscribe(() => this.update());
    this.update();
  }

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
  update() {
    const state = store.getState();
    this.setProperties({
      clicks: state.counter.clicks,
      value: state.counter.value
    });
  }
}

window.customElements.define(MyView2.is, MyView2);
