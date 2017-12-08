export const GET_PRODUCTS = 'GET_PRODUCTS';
export const ADD_TO_CART = 'ADD_TO_CART';

// This is an async action creator.
export const getAllProducts = () => {
  return {
    type: GET_PRODUCTS
  };
};

export const addToCart = (productId) => (dispatch, getState) => {
  const state = getState();
  // Just because the UI thinks you can add this to the cart
  // doesn't mean it's in the inventory (user could've fixed it);
  if (state.shop.products[productId].inventory > 0) {
    dispatch(addToCartUnsafe(productId))
  }
};

export const addToCartUnsafe = productId => {
  return {
    type: ADD_TO_CART,
    productId
  };
}
