/**
@license
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

export const NAVIGATE = 'NAVIGATE';
export const SHOW_404 = 'SHOW_404';
export const UPDATE_OFFLINE = 'UPDATE_OFFLINE';
export const OPEN_DRAWER = 'OPEN_DRAWER';
export const CLOSE_DRAWER = 'CLOSE_DRAWER';
export const OPEN_SNACKBAR = 'OPEN_SNACKBAR';
export const CLOSE_SNACKBAR = 'CLOSE_SNACKBAR';

export const navigate = (path) => {
  return {
    type: NAVIGATE,
    path
  };
};

export const show404 = (path) => {
  return {
    type: SHOW_404,
    path
  };
};

export const openDrawer = () => {
  return {
    type: OPEN_DRAWER
  };
};

export const closeDrawer = () => {
  return {
    type: CLOSE_DRAWER
  };
};

export const showSnackbar = () => (dispatch) => {
  dispatch({
    type: OPEN_SNACKBAR
  });
  setTimeout(() =>
    dispatch({ type: CLOSE_SNACKBAR }), 3000);
};

export const updateOffline = (offline) => {
  return {
    type: UPDATE_OFFLINE,
    offline
  };
};
