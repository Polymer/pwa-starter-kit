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
