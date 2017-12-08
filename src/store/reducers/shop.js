import { GET_PRODUCTS, ADD_TO_CART, REMOVE_FROM_CART } from '../actions/shop.js';

const INITIAL_CART = {
  addedIds: [],
  quantityById: {}
}

// In your app you could get this as a separate action in the store, but
// for the purpose of this example, it isn't really the point.
const INITIAL_PRODUCTS = [
  {"id": 1, "title": "Cabot Creamery Extra Sharp Cheddar Cheese", "price": 10.99, "inventory": 2},
  {"id": 2, "title": "Cowgirl Creamery Mt. Tam Cheese", "price": 29.99, "inventory": 10},
  {"id": 3, "title": "Tillamook Medium Cheddar Cheese", "price": 8.99, "inventory": 5},
  {"id": 4, "title": "Point Reyes Bay Blue Cheese", "price": 24.99, "inventory": 7},
  {"id": 5, "title": "Shepherd's Halloumi Cheese", "price": 11.99, "inventory": 3}
]

const UPDATED_CART = {
  addedIds: ["1"],
  quantityById: {"1": 1}
}

const shop = (state = {products: {}, cart: INITIAL_CART}, action) => {
  switch (action.type) {
    case GET_PRODUCTS:
      return {
        ...state,
        products: reduceById(INITIAL_PRODUCTS)
      }
      return state;
    case ADD_TO_CART:
    case REMOVE_FROM_CART:
      return {
        ...state,
        products: products(state.products, action),
        cart: cart(state.cart, action)
      }
      return state;
    default:
      return state;
  }
}

// TODO: I don't think this is the Redux way
const reduceById = (products) => {
  return products.reduce((obj, product) => {
    obj[product.id] = product
    return obj
  }, {});
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
