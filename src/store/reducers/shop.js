import { GET_PRODUCTS, ADD_TO_CART, REMOVE_FROM_CART, CHECKOUT_SUCCESS, CHECKOUT_FAILURE } from '../actions/shop.js';

const INITIAL_CART = {
  addedIds: [],
  quantityById: {}
}

const UPDATED_CART = {
  addedIds: ["1"],
  quantityById: {"1": 1}
}

const shop = (state = {products: {}, cart: INITIAL_CART}, action) => {
  switch (action.type) {
    case GET_PRODUCTS:
      return {
        ...state,
        products: action.products
      }
      return state;
    case ADD_TO_CART:
    case REMOVE_FROM_CART:
    case CHECKOUT_SUCCESS:
      return {
        ...state,
        products: products(state.products, action),
        cart: cart(state.cart, action),
        error: ''
      }
      return state;
    case CHECKOUT_FAILURE:
      return {
        ...state,
        error: 'Checkout failed. Please try again'
      }
      return state;
    default:
      return state;
  }
}

const products = (state, action) => {
  switch (action.type) {
    case ADD_TO_CART:
    case REMOVE_FROM_CART:
      const productId = action.productId;
      return {
        ...state,
        [productId]: product(state[productId], action)
      }
      return state;
    default:
      return state;
  }
}

const product = (state, action) => {
  switch (action.type) {
    case ADD_TO_CART:
      return {
        ...state,
        inventory: state.inventory - 1
      }
    case REMOVE_FROM_CART:
      return {
        ...state,
        inventory: state.inventory + 1
      }
    default:
      return state;
  }
}

const cart = (state = INITIAL_CART, action) => {
  switch (action.type) {
    case ADD_TO_CART:
    case REMOVE_FROM_CART:
      return {
        addedIds: addedIds(state.addedIds, state.quantityById, action),
        quantityById: quantityById(state.quantityById, action)
      };
    case CHECKOUT_SUCCESS:
      return INITIAL_CART;
    default:
      return state;
  }
}

const addedIds = (state = INITIAL_CART.addedIds, quantityById, action) => {
  const productId = action.productId;
  switch (action.type) {
    case ADD_TO_CART:
      if (state.indexOf(productId) !== -1) {
        return state;
      }
      return [
        ...state,
        action.productId
      ];
    case REMOVE_FROM_CART:
      // This is called before the state is updated, so if you have 1 item in the
      // cart during the remove action, you'll have 0.
      if (quantityById[productId] <= 1) {
        // This removes all items in this array equal to productId.
        return state.filter(e => e !== productId);
      }
      return state;
    default:
      return state;
  }
}

const quantityById = (state = INITIAL_CART.quantityById, action) => {
  const productId = action.productId;
  switch (action.type) {
    case ADD_TO_CART:
      return {
        ...state,
        [productId]: (state[productId] || 0) + 1
      };
    case REMOVE_FROM_CART:
      return {
        ...state,
        [productId]: (state[productId] || 0) - 1
      };
    default:
      return state;
  }
}

export default shop;
