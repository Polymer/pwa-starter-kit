import { GET_PRODUCTS } from '../actions/cart.js';

// In your app you could get this as a separate action in the store, but
// for the purpose of this example, it isn't really the point.
const PRODUCTS = [
  {"id": 1, "title": "Cabot Creamery Extra Sharp Cheddar Cheese", "price": 10.99, "inventory": 2},
  {"id": 2, "title": "Cowgirl Creamery Mt. Tam Cheese", "price": 29.99, "inventory": 10},
  {"id": 3, "title": "Tillamook Medium Cheddar Cheese", "price": 8.99, "inventory": 5},
  {"id": 4, "title": "Point Reyes Bay Blue Cheese", "price": 24.99, "inventory": 5},
  {"id": 5, "title": "Shepherd's Halloumi Cheese", "price": 11.99, "inventory": 0}
]

const cart = (state = {products: PRODUCTS}, action) => {
  switch (action.type) {
    case GET_PRODUCTS:
      return {
        ...state,
        products: action.products
      };
    default:
      return state;
  }
}

export default cart;
