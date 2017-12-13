import createStore from '../../../node_modules/@0xcda7a/redux-es6/es/createStore.js';
import origCompose from '../../../node_modules/@0xcda7a/redux-es6/es/compose.js';
import applyMiddleware from '../../../node_modules/@0xcda7a/redux-es6/es/applyMiddleware.js';
import combineReducers from '../../../node_modules/@0xcda7a/redux-es6/es/combineReducers.js';
import thunk from '../../../node_modules/redux-thunk/es/index.js';

import app from './reducers/app.js';
// import counter from './reducers/counter.js';
// import shop from './reducers/shop.js';

const compose = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || origCompose;

export const store = createStore(
  (state, action) => state,
  compose(lazyReducerEnhancer, applyMiddleware(thunk))
);

// Initiall loaded reducers.
store.addReducers({
  app
});

// This is used to lazy-load reducers
function lazyReducerEnhancer(nextCreator) {
  return (origReducer, preloadedState) => {
    let lazyReducers = {};
    const nextStore = nextCreator(origReducer, preloadedState);
    return {
      ...nextStore,
      addReducers(newReducers) {
        this.replaceReducer(combineReducers(lazyReducers = {
          ...lazyReducers,
          ...newReducers
        }));
      }
    }
  }
}
