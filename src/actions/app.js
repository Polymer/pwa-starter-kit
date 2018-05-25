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
export const UPDATE_OFFLINE = 'UPDATE_OFFLINE';
export const UPDATE_WIDE_LAYOUT = 'UPDATE_WIDE_LAYOUT';
export const UPDATE_DRAWER_STATE = 'UPDATE_DRAWER_STATE';
export const OPEN_SNACKBAR = 'OPEN_SNACKBAR';
export const CLOSE_SNACKBAR = 'CLOSE_SNACKBAR';

export const navigate = (path) => (dispatch) => {
  // Extract the page name from path.
  const page = path === '/' ? 'view1' : path.slice(1);

  // Any other info you might want to extract from the path (like page type),
  // you can do here
  dispatch(loadPage(page));

  // Close the drawer - in case the *path* change came from a link in the drawer.
  dispatch(updateDrawerState(false));
};

const loadPage = (page) => async (dispatch) => {
  // If the page is invalid, set to 404. The is also a good spot to check
  // other location things like sub-path or query params.
  if (['view1', 'view2', 'view3'].indexOf(page) === -1) {
    page = 'view404';
  }

  dispatch(updatePage(page));

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
      await import('../components/my-view404.js');
  }
}

const updatePage = (page) => {
  return {
    type: UPDATE_PAGE,
    page
  };
}

let snackbarTimer;

export const showSnackbar = () => (dispatch) => {
  dispatch({
    type: OPEN_SNACKBAR
  });
  clearTimeout(snackbarTimer);
  snackbarTimer = setTimeout(() =>
    dispatch({ type: CLOSE_SNACKBAR }), 3000);
};

export const updateOffline = (offline) => (dispatch, getState) => {
  // Show the snackbar, unless this is the first load of the page.
  if (getState().app.offline !== undefined) {
    dispatch(showSnackbar());
  }
  dispatch({
    type: UPDATE_OFFLINE,
    offline
  });
};

export const updateLayout = (wideLayout) => (dispatch, getState) => {
  dispatch({
    type: UPDATE_WIDE_LAYOUT,
    wideLayout
  })
  // Open the drawer when we are switching to wide layout and close it when we are
  // switching to narrow.
  dispatch(updateDrawerState(wideLayout));
}

export const updateDrawerState = (opened) => (dispatch, getState) => {
  const app = getState().app;
  // Don't allow closing the drawer when it's in wideLayout.
  if (app.drawerOpened !== opened && (!app.wideLayout || opened)) {
    dispatch({
      type: UPDATE_DRAWER_STATE,
      opened
    });
  }
}
