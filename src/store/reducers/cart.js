import { RECEIVE_PRODUCTS } from '../actions/cart.js';

const cart = (state = {}, action) => {
  switch (action.type) {
    case RECEIVE_PRODUCTS:
      return {
        ...state,
        products: action.products
      };
    default:
      return state;
  }
}

export default cart;
