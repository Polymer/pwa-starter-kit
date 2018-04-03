/**
@license
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

import '../../src/components/counter-element.js';
import {axeReport} from '../axe-report.js';

describe('counter-element', function() {
  let el;

  beforeEach(function() {
    const template = document.createElement('template');
    template.innerHTML = `
      <counter-element id="fixture"></counter-element>
    `;
    const content = template.content.cloneNode(true);
    document.body.appendChild(content);
    el = document.getElementById('fixture');
  });

  afterEach(function() {
    document.body.removeChild(el);
  });

  it('starts empty', function() {
    expect(el.clicks).equal(0);
    expect(el.value).equal(0);
  });

  it('clicking on plus increments', function() {
    expect(el.clicks).equal(0);
    expect(el.value).equal(0);

    const buttons = el.shadowRoot.querySelectorAll('button');
    buttons[0].click();

    expect(el.clicks).equal(1);
    expect(el.value).equal(1);
  });

  it('clicking on minus decrements', function() {
    expect(el.clicks).equal(0);
    expect(el.value).equal(0);

    const buttons = el.shadowRoot.querySelectorAll('button');
    buttons[1].click();

    expect(el.clicks).equal(1);
    expect(el.value).equal(-1);
  });

  it('a11y', function() {
    return axeReport(el);
  });
});
