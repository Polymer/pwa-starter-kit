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

      <dom-repeat items="[[_displayProducts(products)]]">
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
      <p hidden$="[[_hasItemsInCart(cart)]]">Please add some products to cart.</p>
      <dom-repeat items="[[_displayCart(cart)]]">
        <template>
          <div>[[item.title]] ([[item.amount]] * [[item.price]])</div>
        </template>
      </dom-repeat>

      <p>Total: $<span>[[_calculateTotal(cart)]]</span></p>
    </div>
`;
  }

  static get is() {
    return 'my-view3';
  }

  static get properties() { return {
    // This is the data from the store.
    products: Object,
    cart: Object
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
  }

  addToCart(event) {
    store.dispatch(addToCart(event.target.dataset['index']));
  }

  _displayProducts(products) {
    return Object.values(products);
  }

  _displayCart(cart) {
    const items = [];
    for (let id of cart.addedIds) {
      const item = this.products[id];
      items.push({title: item.title, amount: cart.quantityById[id], price: item.price});
    }
    return items;
  }

  _hideInventory(item) {
    return (item.inventory === 0);
  }

  _computeButtonText(item) {
    return item.inventory === 0 ? "Sold out" : "Add to cart";
  }

  _hasItemsInCart(cart) {
    return cart.addedIds.length !== 0;
  }

  _calculateTotal(cart) {
    let total = 0;
    for (let id of cart.addedIds) {
      const item = this.products[id];
      total += item.price * cart.quantityById[id];
    }
    return parseFloat(Math.round(total * 100) / 100).toFixed(2);;
  }
}

window.customElements.define(MyView3.is, MyView3);
