export const connect = (store) => (baseElement) => class extends baseElement {
  constructor() {
    super();
    store.subscribe(() => this.update(store.getState()));
    this.update(store.getState());
  }

  update(state) {
    console.warn('update() not implemented', this);
  }
};
