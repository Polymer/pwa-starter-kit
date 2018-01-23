/**
@license
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

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
