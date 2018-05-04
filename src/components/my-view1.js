/**
@license
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

import { html } from '@polymer/lit-element';
import { SharedStyles } from './shared-styles.js';
import { PageViewElement } from './page-view-element.js';

class MyView1 extends PageViewElement {
  _render(props) {
    return html`
      ${SharedStyles}
      <section>
        <h2>Static page</h2>
        <p>This is a text-only page.</p>
        <p>It doesn't do anything other than display some static text.</p>
      </section>
      <section>
        <h2>Cheese ipsum</h2>
        <p>Squirty cheese roquefort goat. Port-salut monterey jack cheesy grin gouda airedale when the cheese comes out everybody's happy fondue edam. Cauliflower cheese lancashire rubber cheese pepper jack cheese and wine who moved my cheese cheese and biscuits emmental. Goat cheese slices cheese strings cut the cheese port-salut hard cheese gouda cheese on toast. Cheesy feet paneer lancashire cheese triangles brie hard cheese ricotta blue castello. Taleggio cut the cheese blue castello roquefort cut the cheese fondue roquefort caerphilly. Stinking bishop cow brie fondue cheese and biscuits croque monsieur danish fontina cottage cheese. Pepper jack the big cheese squirty cheese pecorino dolcelatte dolcelatte fromage frais brie. Cheese on toast chalk and cheese manchego paneer lancashire lancashire caerphilly.</p>
        <p>Cream cheese camembert de normandie cottage cheese. Manchego queso mascarpone dolcelatte queso melted cheese rubber cheese blue castello. Cheese and biscuits blue castello jarlsberg babybel cheeseburger queso port-salut taleggio. Pecorino cauliflower cheese squirty cheese cow gouda danish fontina feta stilton. Emmental say cheese pepper jack cheese on toast everyone loves cheese on toast monterey jack red leicester. Brie edam hard cheese cheese and wine cheesecake stinking bishop caerphilly mascarpone. Ricotta boursin taleggio paneer.</p>
      </section>
      <section>
        <p>Squirty cheese roquefort goat. Port-salut monterey jack cheesy grin gouda airedale when the cheese comes out everybody's happy fondue edam. Cauliflower cheese lancashire rubber cheese pepper jack cheese and wine who moved my cheese cheese and biscuits emmental. Goat cheese slices cheese strings cut the cheese port-salut hard cheese gouda cheese on toast. Cheesy feet paneer lancashire cheese triangles brie hard cheese ricotta blue castello. Taleggio cut the cheese blue castello roquefort cut the cheese fondue roquefort caerphilly. Stinking bishop cow brie fondue cheese and biscuits croque monsieur danish fontina cottage cheese. Pepper jack the big cheese squirty cheese pecorino dolcelatte dolcelatte fromage frais brie. Cheese on toast chalk and cheese manchego paneer lancashire lancashire caerphilly.</p>
        <p>Cream cheese camembert de normandie cottage cheese. Manchego queso mascarpone dolcelatte queso melted cheese rubber cheese blue castello. Cheese and biscuits blue castello jarlsberg babybel cheeseburger queso port-salut taleggio. Pecorino cauliflower cheese squirty cheese cow gouda danish fontina feta stilton. Emmental say cheese pepper jack cheese on toast everyone loves cheese on toast monterey jack red leicester. Brie edam hard cheese cheese and wine cheesecake stinking bishop caerphilly mascarpone. Ricotta boursin taleggio paneer.</p>
      </section>
    `;
  }
}

window.customElements.define('my-view1', MyView1);
