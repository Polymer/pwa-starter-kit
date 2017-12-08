import createStore from '../../../node_modules/@0xcda7a/redux-es6/es/createStore.js';
import origCompose from '../../../node_modules/@0xcda7a/redux-es6/es/compose.js';
import applyMiddleware from '../../../node_modules/@0xcda7a/redux-es6/es/applyMiddleware.js';
import combineReducers from '../../../node_modules/@0xcda7a/redux-es6/es/combineReducers.js';
import thunk from '../../../node_modules/redux-thunk/es/index.js';

import counter from './reducers/counter.js';
import shop from './reducers/shop.js';

const compose = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || origCompose;

export const store = createStore(

  // combineReducers allows you to slice your data up. In this case,
  // the counter and the shopping cart don't really share any data,
  // so it makes sense to have the state split up by areas of interest.
  combineReducers({
    counter,       // accessible in your app via state.counter
    shop,      // accessible in your app via state.shop
  }),
  compose(applyMiddleware(thunk))
);
