/**
@license
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

/**
 * NOTE(keanulee): Ideally we would just `import '@babel/polyfill'` and rely
 * on babel-preset-env's useBuiltIns
 * (https://babeljs.io/docs/en/babel-preset-env#usebuiltins) to detect language
 * features, but webcomponents-sd-ce-pf.js already imports some language
 * features, such as Symbol, which conflicts with '@babel/polyfill'. So
 * instead, we just import the features we know we need.
 */
import 'regenerator-runtime/runtime';
import '@webcomponents/webcomponentsjs/custom-elements-es5-adapter.js';
import './components/my-app';
