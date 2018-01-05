import { Element as PolymerElement} from '../node_modules/@polymer/polymer/polymer-element.js';
import { connect } from '../lib/connect-mixin.js';

// This element is connected to the redux store.
import { store } from './store/store.js';
import { getAllProducts, addToCart } from './store/actions/shop.js';

class ShopProducts extends connect(store)(PolymerElement) {
  static get template() {
    return `
      <dom-repeat items="[[_displayProducts(products)]]">
        <template>
          <div>
            <shop-item name="[[item.title]]" amount="[[item.inventory]]" price="[[item.price]]"></shop-item>
            <button disabled$="[[_hideInventory(item)]]" on-click="addToCart" data-index$="[[item.id]]">
              [[_computeButtonText(item)]]
            </button>
          </div>
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

  ready() {
    super.ready();
    store.dispatch(getAllProducts());
  }

  // This is called every time something is updated in the store.
  update(state) {
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
