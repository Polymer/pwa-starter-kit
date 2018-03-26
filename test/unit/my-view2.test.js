/**
@license
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

import {axeReport} from '../axe-report.js';
import '../../src/components/my-view2.js';

describe('my-view2: a11y', function() {
  it('is accessible', function() {
    const el = document.createElement('my-view2');
    // Need to be active before it gets appended to the DOM, so that
    // we don't have to wait for another render() cycle.
    el.setAttribute('active', true);
    document.body.appendChild(el);
    return axeReport(el, { cleanup() { el.remove(); } });
  });
});
