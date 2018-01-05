import { Element } from '../node_modules/@polymer/polymer/polymer-element.js';
import './shared-styles.js';

class MyView1 extends Element {
  static get template() {
    return `
    <style include="shared-styles">
      :host {
        display: block;

        padding: 10px;
      }
    </style>

    <div class="card">
      <div class="circle">1</div>
      <h1>Static Page</h1>
      <p>This is a text-only page.</p>
      <p>It doesn't do anything other than display some static text.</p>
    </div>
`;
  }

  static get is() {
    return 'my-view1';
  }
}

window.customElements.define(MyView1.is, MyView1);
