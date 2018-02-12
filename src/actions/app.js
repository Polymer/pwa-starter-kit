/**
@license
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

export const UPDATE_PAGE = 'UPDATE_PAGE';
export const SHOW_404 = 'SHOW_404';
export const UPDATE_OFFLINE = 'UPDATE_OFFLINE';
export const OPEN_DRAWER = 'OPEN_DRAWER';
export const CLOSE_DRAWER = 'CLOSE_DRAWER';
export const OPEN_SNACKBAR = 'OPEN_SNACKBAR';
export const CLOSE_SNACKBAR = 'CLOSE_SNACKBAR';

export const navigate = (path) => (dispatch) => {
  // Extract the page name from path.
  const page = path === '/' ? 'view1' : path.slice(1);

  // Any other info you might want to extract from the path (like page type),
  // you can do here
  dispatch(loadPage(page));
};

const loadPage = (page) => async (dispatch) => {
  switch(page) {
    case 'view1':
      await import('../components/my-view1.js');
      // Put code here that you want it to run every time when
      // navigate to view1 page and my-view1.js is loaded
      break;
    case 'view2':
      await import('../components/my-view2.js');
      break;
    case 'view3':
      await import('../components/my-view3.js');
      break;
    default:
      page = 'view404';
      await import('../components/my-view404.js');
  }

  dispatch(updatePage(page));
}

const updatePage = (page) => {
  return {
    type: UPDATE_PAGE,
    page
  };
}

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
