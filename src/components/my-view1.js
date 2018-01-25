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
import { SharedStyles } from './shared-styles.js';

class MyView1 extends LitElement {
  static get is() {
    return 'my-view1';
  }

  render(props) {
    return html`
      <style>${SharedStyles}</style>

      <section>
        <h2>Static page</h2>
        <p>This is a text-only page.</p>
        <p>It doesn't do anything other than display some static text.</p>
      </section>
      <section>
        <h2>Bacon ipsum</h2>
        <p>Bacon ipsum dolor amet swine picanha doner pig. Buffalo pastrami ball tip brisket biltong spare ribs, flank pork chop strip steak pork loin venison pig porchetta chuck. Turducken biltong porchetta spare ribs tail. Shoulder jowl shankle kevin, ground round burgdoggen short loin turkey alcatra pork loin buffalo prosciutto beef ribs sirloin. Filet mignon alcatra tail tongue. Leberkas kevin jowl meatloaf.</p>
        <p>Capicola ham short ribs, strip steak turkey ham hock picanha. Biltong fatback boudin pork chop buffalo venison. Ground round buffalo picanha leberkas doner ribeye tongue kielbasa meatball andouille bacon. Chicken spare ribs corned beef ball tip tri-tip frankfurter chuck.</p>
      </section>
      <section>
        <p>Bacon ipsum dolor amet swine picanha doner pig. Buffalo pastrami ball tip brisket biltong spare ribs, flank pork chop strip steak pork loin venison pig porchetta chuck. Turducken biltong porchetta spare ribs tail. Shoulder jowl shankle kevin, ground round burgdoggen short loin turkey alcatra pork loin buffalo prosciutto beef ribs sirloin. Filet mignon alcatra tail tongue. Leberkas kevin jowl meatloaf.</p>
        <p>Capicola ham short ribs, strip steak turkey ham hock picanha. Biltong fatback boudin pork chop buffalo venison. Ground round buffalo picanha leberkas doner ribeye tongue kielbasa meatball andouille bacon. Chicken spare ribs corned beef ball tip tri-tip frankfurter chuck.</p>
      </section>
    `;
  }
}

window.customElements.define(MyView1.is, MyView1);
