/**
@license
Copyright (c) 2019 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

import resolve from 'rollup-plugin-node-resolve';

export default {
  input: './src/components/my-app.js',
  output: [
    {
      dir: 'public/src/components',
      format: 'esm'
    },
    {
      dir: 'public/src_nomodule/components',
      format: 'system'
    }
  ],
  plugins: [
    resolve({
      // use "jsnext:main" if possible
      // legacy field pointing to ES6 module in third-party libraries,
      // deprecated in favor of "pkg.module":
      // - see: https://github.com/rollup/rollup/wiki/pkg.module
      jsnext: true,  // Default: false
    })
  ]
};
