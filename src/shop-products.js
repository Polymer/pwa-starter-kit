import { Element } from '../node_modules/@polymer/polymer/polymer-element.js';

// This element is connected to the redux store.
import { store } from './store/store.js';
import { getAllProducts, addToCart } from './store/actions/shop.js';

class ShopProducts extends Element {
  static get template() {
    return `
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
`;
  }

  static get is() {
    return 'shop-products';
  }

  static get properties() { return {
    products: Object
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
      products: state.shop.products
    });
  }

  _displayProducts(products) {
    return Object.values(products);
  }

  _computeButtonText(item) {
    return item.inventory === 0 ? 'Sold out' : 'Add to cart';
  }

  _hideInventory(item) {
    return (item.inventory === 0);
  }

  addToCart(event) {
    store.dispatch(addToCart(event.target.dataset['index']));
  }
}

window.customElements.define(ShopProducts.is, ShopProducts);
