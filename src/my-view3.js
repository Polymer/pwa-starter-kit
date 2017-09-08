import { Element } from '../node_modules/@polymer/polymer/polymer-element.js';
import './shared-styles.js';
class MyView3 extends Element {
  static get template() {
    return `
    <style include="shared-styles">
      :host {
        display: block;

        padding: 10px;
      }
    </style>

    <div class="card">
      <div class="circle">3</div>
      <h1>View Three</h1>
      <p>Modus commodo minimum eum te, vero utinam assueverit per eu.</p>
      <p>Ea duis bonorum nec, falli paulo aliquid ei eum.Has at minim mucius aliquam, est id tempor laoreet.Pro saepe pertinax ei, ad pri animal labores suscipiantur.</p>
    </div>
`;
  }

  static get is() {
    return 'my-view3';
  }
}

window.customElements.define(MyView3.is, MyView3);
