export const GET_PRODUCTS = 'GET_PRODUCTS';
export const ADD_TO_CART = 'ADD_TO_CART';
export const REMOVE_FROM_CART = 'REMOVE_FROM_CART';
export const CHECKOUT_SUCCESS = 'CHECKOUT_SUCCESS';

export const getAllProducts = () => {
  return {
    type: GET_PRODUCTS
  };
};

export const checkout = (productId) => (dispatch, getState) => {
  // Here you could do things like credit card validation, etc

  // If that fails, dispatch CHECKOUT_FAILURE.
  // Otherwise:
  dispatch({
    type: CHECKOUT_SUCCESS
  })
};

export const addToCart = (productId) => (dispatch, getState) => {
  const state = getState();
  // Just because the UI thinks you can add this to the cart
  // doesn't mean it's in the inventory (user could've fixed it);
  if (state.shop.products[productId].inventory > 0) {
    dispatch(addToCartUnsafe(productId))
  }
};

export const removeFromCart = (productId) => {
  return {
    type: REMOVE_FROM_CART,
    productId
  };
};

export const addToCartUnsafe = productId => {
  return {
    type: ADD_TO_CART,
    productId
  };
}
