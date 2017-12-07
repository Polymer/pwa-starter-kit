import { Element } from '../node_modules/@polymer/polymer/polymer-element.js';
import './shared-styles.js';
import './redux-counter/counter-element.js';

class MyView2 extends Element {
  static get template() {
    return `
    <style include="shared-styles">
      :host {
        display: block;
        padding: 10px;
      }
    </style>

    <div class="card">
      <div class="circle">2</div>
      <h1>View Two</h1>
      <p>This page contains <code>&lt;counter-element&gt;</code>, an implementation
      of the simple Redux counter example.</p>
      <hr>
      <counter-element></counter-element>
    </div>
`;
  }

  static get is() {
    return 'my-view2';
  }
}

window.customElements.define(MyView2.is, MyView2);
