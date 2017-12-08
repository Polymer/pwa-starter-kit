import { Element } from '../node_modules/@polymer/polymer/polymer-element.js';
import './shared-styles.js';

// This element is connected to the redux store.
import { store } from './store/store.js';
import { getAllProducts, addToCart } from './store/actions/shop.js';

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
      <div class="circle">3</div>
      <h1>Redux example: shopping cart</h1>
      <p>[description here]</p>
      <hr>
      <h3>Products</h3>

      <dom-repeat items="[[products]]">
        <template>
          <div>
            [[item.title]] - [[item.price]]
            <span hidden$="[[_hideInventory(item)]]">
              * [[item.inventory]]
            </span>
          </div>
          <button disabled$="[[_hideInventory(item)]]" on-click="addToCart" data-index$="[[item.id]]">
            [[_computeButtonText(item)]]
          </button>
        </template>
      </dom-repeat>

      <h3>Your Cart</h3>
    </div>
`;
  }

  static get is() {
    return 'my-view3';
  }

  static get properties() { return {
    products: Array,
    cart: {
      type: Object,
      observer: '_cartUpdated'
    }
  }}

  constructor() {
    super();

    // Connect the element to the store.
    store.subscribe(() => this.update());
    this.update();
  }

  ready() {
    super.ready();
    store.dispatch(getAllProducts());
  }

  // This is called every time something is updated in the store.
  update() {
    const state = store.getState();
    this.setProperties({
      products: state.shop.products,
      cart: state.shop.cart
    });
    console.log(state);
  }

  addToCart(event) {
    store.dispatch(addToCart(event.target.dataset['index']));
  }

  _cartUpdated(cart) {
    debugger
  }

  _hideInventory(item) {
    return (item.inventory === 0);
  }

  _computeButtonText(item) {
    return item.inventory === 0 ? "Sold out" : "Add to cart";
  }
}

window.customElements.define(MyView3.is, MyView3);
