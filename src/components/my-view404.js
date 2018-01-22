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
      Oops you hit a 404. <a href="${Polymer.rootPath}">Head back to home.</a>
    `
  }

  static get is() {
    return 'my-view404';
  }
}

window.customElements.define(MyView404.is, MyView404);
