/**
@license
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

import '../../src/components/my-view1.js';
import '../../src/components/my-view2.js';
import '../../src/components/my-view3.js';
import '../../src/components/my-view404.js';

import '../../node_modules/axe-core/axe.min.js';

async function axeReport(dom, config = {}) {
  const {cleanup, axeConfig} = config;
  const {violations} = await axe.run(dom, axeConfig || {
    runOnly: ['wcag2a', 'wcag2aa', 'section508'],
    // we don't care about passing tests
    resultTypes: ['violations']
  });
  await cleanup();
  if (!violations.length) {
    return;
  }
  const errorMessage = ['Accessibility Violations', '---'];
  for (const violation of violations) {
    errorMessage.push(violation.help);
    for (const node of violation.nodes) {
      errorMessage.push(node.failureSummary);
      errorMessage.push(node.html);
    }
    errorMessage.push('---');
  }
  throw new Error(errorMessage.join('\n'));
}

describe('views are accessible', function() {
  // it('my-view1', function() {
  //   const el = document.createElement('my-view1');
  //   el.active = true;
  //   document.body.appendChild(el);
  //
  //   const report = axeReport(el);
  //
  //   document.body.removeChild(el);
  //   return report;
  // });
  //
  // it('my-view2', function() {
  //   const el = document.createElement('my-view2');
  //   el.active = true;
  //   document.body.appendChild(el);
  //
  //   const report = axeReport(el);
  //
  //   document.body.removeChild(el);
  //   return report;
  // });

  it('my-view3', function() {
    const el = document.createElement('my-view3');
    document.body.appendChild(el);
    el.active = true;

    return axeReport(el, {
      cleanup(){
        el.remove();
      }
    });

  });

  // it('my-view404', function() {
  //   const el = document.createElement('my-view404');
  //   el.active = true;
  //   document.body.appendChild(el);
  //
  //   const report = axeReport(el);
  //
  //   document.body.removeChild(el);
  //   return report;
  // });
});
