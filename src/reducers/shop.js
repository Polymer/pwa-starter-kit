/**
@license
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

import {
  GET_PRODUCTS,
  ADD_TO_CART,
  REMOVE_FROM_CART,
  CHECKOUT_SUCCESS,
  CHECKOUT_FAILURE
} from '../actions/shop.js';
import { createSelector } from 'reselect';

const INITIAL_CART = {
  addedIds: [],
  quantityById: {}
};

const UPDATED_CART = {
  addedIds: ['1'],
  quantityById: {'1': 1}
};

const shop = (state = {products: {}, cart: INITIAL_CART}, action) => {
  switch (action.type) {
    case GET_PRODUCTS:
      return {
        ...state,
        products: action.products
      };
    case ADD_TO_CART:
    case REMOVE_FROM_CART:
    case CHECKOUT_SUCCESS:
      return {
        ...state,
        products: products(state.products, action),
        cart: cart(state.cart, action),
        error: ''
      };
    case CHECKOUT_FAILURE:
      return {
        ...state,
        error: 'Checkout failed. Please try again'
      };
    default:
      return state;
  }
};

// Slice reducer: it only reduces the bit of the state it's concerned about.
const products = (state, action) => {
  switch (action.type) {
    case ADD_TO_CART:
    case REMOVE_FROM_CART:
      const productId = action.productId;
      return {
        ...state,
        [productId]: product(state[productId], action)
      };
    default:
      return state;
  }
};

const product = (state, action) => {
  switch (action.type) {
    case ADD_TO_CART:
      return {
        ...state,
        inventory: state.inventory - 1
      };
    case REMOVE_FROM_CART:
      return {
        ...state,
        inventory: state.inventory + 1
      };
    default:
      return state;
  }
};

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
};

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
};

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
};

export default shop;

// Per Redux best practices, the shop data in our store is structured
// for efficiency (small size and fast updates).
//
// The _selectors_ below transform store data into specific forms that
// are tailored for presentation. Putting this logic here keeps the
// layers of our app loosely coupled and easier to maintain, since
// views don't need to know about the store's internal data structures.
//
// We use a tiny library called `reselect` to create efficient
// selectors. More info: https://github.com/reduxjs/reselect.

const cartSelector = state => state.shop.cart;
const productsSelector = state => state.shop.products;

// Return a flattened array representation of the items in the cart
export const cartItemsSelector = createSelector(
  cartSelector,
  productsSelector,
  (cart, products) => {
    const items = [];
    for (let id of cart.addedIds) {
      const item = products[id];
      items.push({id: item.id, title: item.title, amount: cart.quantityById[id], price: item.price});
    }
    return items;
  }
);

// Return the total cost of the items in the cart
export const cartTotalSelector = createSelector(
  cartSelector,
  productsSelector,
  (cart, products) => {
    let total = 0;
    for (let id of cart.addedIds) {
      const item = products[id];
      total += item.price * cart.quantityById[id];
    }
    return parseFloat(Math.round(total * 100) / 100).toFixed(2);
  }
);

// Return the number of items in the cart
export const cartQuantitySelector = createSelector(
  cartSelector,
  cart => {
    let num = 0;
    for (let id of cart.addedIds) {
      num += cart.quantityById[id];
    }
    return num;
  }
);
