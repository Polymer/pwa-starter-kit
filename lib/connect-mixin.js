/*
  Mixin for connecting an element to the Redux store that implements the
  basic store-connection boilerplate.

  Sample use:
  import { Element as PolymerElement} from '../../node_modules/@polymer/polymer/polymer-element.js';
  import { connect } from '../../node_modules/@polymer/redux-helpers/connect-mixin.js';

  class MyElement extends connect(store)(PolymerElement) {
    // ...

    update(state) {
      this.setProperties({
        count: state.data.count,
      });
    }
  }
*/

export const connect = (store) => (baseElement) => class extends baseElement {
  constructor() {
    super();

    // Connect the element to the store.
    store.subscribe(() => this.update(store.getState()));
    this.update(store.getState());
  }


  // This is called every time something is updated in the store.
  update(state) {
    console.warn('update() not implemented', this);
  }
};
