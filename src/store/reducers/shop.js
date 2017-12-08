import { GET_PRODUCTS, ADD_TO_CART } from '../actions/shop.js';

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
  {"id": 4, "title": "Point Reyes Bay Blue Cheese", "price": 24.99, "inventory": 5},
  {"id": 5, "title": "Shepherd's Halloumi Cheese", "price": 11.99, "inventory": 0}
]

const UPDATED_CART = {
  addedIds: ["1"],
  quantityById: {"1": 1}
}

const shop = (state = {products: INITIAL_PRODUCTS, cart: INITIAL_CART}, action) => {
  switch (action.type) {
    case ADD_TO_CART:
    debugger
      return {
        ...state,
        cart: UPDATED_CART
      }
      return state;
    default:
      return state;
  }
}

// const cart = (state, action) = {
//   switch (action.type) {
//     case ADD_TO_CART:
//       return {
//         addedIds: 1, //addedIds(state.addedIds, action),
//         quantityById: 1, //quantityById(state.quantityById, action)
//       }
//
//     default:
//       return state
//   }
// }
//
// const addedIds = (state = initialState.addedIds, action) => {
//   switch (action.type) {
//     case ADD_TO_CART:
//       if (state.indexOf(action.productId) !== -1) {
//         return state
//       }
//       return [ ...state, action.productId ]
//     default:
//       return state
//   }
// }
//
// const quantityById = (state = initialState.quantityById, action) => {
//   switch (action.type) {
//     case ADD_TO_CART:
//       const { productId } = action
//       return { ...state,
//         [productId]: (state[productId] || 0) + 1
//       }
//     default:
//       return state
//   }
// }

export default shop;
