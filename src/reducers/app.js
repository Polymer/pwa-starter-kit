/**
@license
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

import { NAVIGATE, SHOW_404, UPDATE_OFFLINE } from '../actions/app.js';

const app = (state = {}, action) => {
  switch (action.type) {
    case NAVIGATE:
      const path = action.path === '/' ? '/view1' : action.path;
      const page = path.slice(1);
      return {
        ...state,
        page: page
      };
    case SHOW_404:
      return {
        ...state,
        page: 'view404'
      };
    case UPDATE_OFFLINE:
      return {
        ...state,
        offline: action.offline
      };
    default:
      return state;
  }
}

export default app;
