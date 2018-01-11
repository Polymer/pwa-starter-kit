import { PolymerLitElement } from '../../node_modules/@polymer/polymer-lit/polymer-lit-element.js'
import { SharedStyles } from './shared-styles.js';

class MyView1 extends PolymerLitElement {
  static get is() {
    return 'my-view1';
  }

  render(props, html) {
    return html`
      <style>${SharedStyles}</style>

      <style>
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
}

window.customElements.define(MyView1.is, MyView1);
