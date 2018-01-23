import createStore from '../../../node_modules/@0xcda7a/redux-es6/es/createStore.js';
import origCompose from '../../../node_modules/@0xcda7a/redux-es6/es/compose.js';
import applyMiddleware from '../../../node_modules/@0xcda7a/redux-es6/es/applyMiddleware.js'
import combineReducers from '../../../node_modules/@0xcda7a/redux-es6/es/combineReducers.js';
import thunk from '../../../node_modules/redux-thunk/es/index.js';
import { lazyReducerEnhancer } from '../../../node_modules/redux-helpers/lazyReducerEnhancer.js';

import app from './reducers/app.js';

const compose = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || origCompose;

export const store = createStore(
  (state, action) => state,
  compose(lazyReducerEnhancer(combineReducers), applyMiddleware(thunk))
);

// Initially loaded reducers.
store.addReducers({
  app
});
