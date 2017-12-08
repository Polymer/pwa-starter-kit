// TODO: figure out why this import doesn't work.
//import products from '../../api/products.js'

export const RECEIVE_PRODUCTS = 'RECEIVE_PRODUCTS';

// This is an async action creator.
export const getAllProducts = () => (dispatch, getState) => {
  // shop.getProducts(products => {
  //   dispatch(receiveProducts(products))
  // })
  const products = [{"id": 1, "title": "Cabot Creamery Extra Sharp Cheddar Cheese", "price": 10.99, "inventory": 2},
  {"id": 2, "title": "Cowgirl Creamery Mt. Tam Cheese", "price": 29.99, "inventory": 10},
  {"id": 3, "title": "Tillamook Medium Cheddar Cheese", "price": 8.99, "inventory": 5},
  {"id": 4, "title": "Point Reyes Bay Blue Cheese", "price": 24.99, "inventory": 5},
  {"id": 5, "title": "Shepherd's Halloumi Cheese", "price": 11.99, "inventory": 0}]
  dispatch(receiveProducts(products))
};

export const receiveProducts = (products) =>  {
  return {
    type: RECEIVE_PRODUCTS,
    products
  };
};
