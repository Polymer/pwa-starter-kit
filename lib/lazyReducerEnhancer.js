import combineReducers from '../../../node_modules/@0xcda7a/redux-es6/es/combineReducers.js';

/*
  If you are lazy loading any connected elements, then these elements must be
  able to lazily install their reducers. This is a store enhancer that
  enables that

  Sample use (where you define your redux store, in store.js):

  import lazyReducerEnhancer from '../../node_modules/@polymer/redux-helpers/lazyReducerEnhancer.js';
  import someReducer from './reducers/someReducer.js';

  export const store = createStore(
    (state, action) => state,
    compose(lazyReducerEnhancer, applyMiddleware(thunk))
  );

  // Initially loaded reducers.
  store.addReducers({
    someReducer
  });
*/
const lazyReducerEnhancer = function(nextCreator) {
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
export default lazyReducerEnhancer;
