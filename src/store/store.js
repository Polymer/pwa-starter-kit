import createStore from '../../../node_modules/@0xcda7a/redux-es6/es/createStore.js';
import origCompose from '../../../node_modules/@0xcda7a/redux-es6/es/compose.js';
import applyMiddleware from '../../../node_modules/@0xcda7a/redux-es6/es/applyMiddleware.js';

import clicks from './reducers/clicks.js';

const compose = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || origCompose;

export const store = createStore(
  clicks,
  compose(applyMiddleware())
);
