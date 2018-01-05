import combineReducers from '../../../node_modules/@0xcda7a/redux-es6/es/combineReducers.js';

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
