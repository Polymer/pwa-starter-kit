import { LitElement, html } from '../../node_modules/@polymer/lit-element/lit-element.js'

class MyView404 extends LitElement {
  render(props) {
    return html`
      <style>
        :host {
          display: block;
          padding: 10px 20px;
        }
      </style>
      Oops you hit a 404. <a href="[[rootPath]]">Head back to home.</a>
    `
  }

  static get is() {
    return 'my-view404';
  }

  static get properties() {
    return {
      // This shouldn't be neccessary, but the Analyzer isn't picking up
      // Polymer.Element#rootPath
      rootPath: String
    };
  }
}

window.customElements.define(MyView404.is, MyView404);
