export const GET_PRODUCTS = 'GET_PRODUCTS';

// This is an async action creator.
export const getAllProducts = () => (dispatch, getState) => {
  return {
    type: GET_PRODUCTS
  };
};
