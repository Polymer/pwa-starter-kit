import { Element } from '../node_modules/@polymer/polymer/polymer-element.js';
import './shared-styles.js';
import './shop-products.js'
import './shop-cart.js'

// This element is connected to the redux store.
import { store } from './store/store.js';

// We are lazy loading its reducer.
import shop from './store/reducers/shop.js';

// These are the actions needed by this element.
import { checkout } from './store/actions/shop.js';

class MyView3 extends Element {
  static get template() {
    return `
    <style include="shared-styles">
      :host {
        display: block;
        padding: 10px;
      }
    </style>

    <div class="card">
      <div class="circle">[[_numItemsInCart(cart)]]</div>
      <h1>Redux example: shopping cart</h1>
      <p>This is a slightly more advanced Redux example, that simulates a
        shopping cart: getting the products, adding/removing items to the
        cart, and a checkout action, that can sometimes randomly fail (to
        simulate where you would add failure handling). </p>
      <p>This view, as well as its 2 child elements, <code>&lt;shop-products&gt;</code> and
      <code>&lt;shop-cart&gt;</code> are connected to the Redux store.</p>
      <hr>
      <h3>Products</h3>
      <shop-products></shop-products>

      <h3>Your Cart</h3>
      <shop-cart></shop-cart>

      <div>[[error]]</div>
      <button hidden$="[[!_hasItemsInCart(cart)]]" on-click="checkout">
        Checkout
      </button>
    </div>
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

  constructor() {
    super();

    // Lazy load the reducer.
    store.addReducers({
      shop
    });

    // Connect the element to the store.
    store.subscribe(() => this.update());
    this.update();
  }

  // This is called every time something is updated in the store.
  update() {
    const state = store.getState();
    this.setProperties({
      cart: state.shop.cart,
      error: state.shop.error
    });
  }

  checkout(event) {
    store.dispatch(checkout());
  }

  _hasItemsInCart(cart) {
    return cart.addedIds.length !== 0;
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
