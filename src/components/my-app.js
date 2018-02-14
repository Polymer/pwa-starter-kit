/**
@license
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

import { LitElement, html } from '../../node_modules/@polymer/lit-element/lit-element.js';
import { connect } from '../../node_modules/pwa-helpers/connect-mixin.js';
import { installRouter } from '../../node_modules/pwa-helpers/router.js';
import { installOfflineWatcher } from '../../node_modules/pwa-helpers/network.js';
import { installMediaQueryWatcher } from '../../node_modules/pwa-helpers/media-query.js';
import { updateSEOMetadata } from '../../node_modules/pwa-helpers/seo-metadata.js';

import { setPassiveTouchGestures } from '../../node_modules/@polymer/polymer/lib/utils/settings.js';
import { menuIcon } from './my-icons.js';
import './snack-bar.js'

import { store } from '../store.js';
import { navigate, updateOffline, showSnackbar, openDrawer, closeDrawer } from '../actions/app.js';

// When the viewport width is smaller than `responsiveWidth`, layout changes to narrow layout.
// In narrow layout, the drawer will be stacked on top of the main content instead of side-by-side.
import { responsiveWidth } from './shared-styles.js';

class MyApp extends connect(store)(LitElement) {
  render({page, appTitle, drawerOpened, snackbarOpened, offline}) {
    // Anything that's related to rendering should be done in here.

    if (page && appTitle) {
      const pageTitle = appTitle + ' - ' + page;
      updateSEOMetadata({
          title: pageTitle,
          description: pageTitle,
          url: document.location.href,
          // This object also takes an image property, that points to an img src.
        })
    }

    return html`
    <style>
      :host {
        display: block;
      }

      .toolbar-list a {
        display: inline-block;
        color: black;
        text-decoration: none;
        line-height: 30px;
        padding: 4px 24px;
      }

      .toolbar-list a[selected] {
        color: var(--app-header-selected-color);
        border-bottom: 4px solid var(--app-header-selected-color);
      }

      .main-content .page {
        display: none;
      }

      .main-content .page[selected] {
        display: block;
      }

      footer {
        padding: 24px;
        border-top: 1px solid #ccc;
        text-align: center;
      }

      .theme-btn {
        padding: 14px;
        background: var(--app-primary-color);
        color: var(--app-light-text-color);
        font-size: 13px;
        letter-spacing: 0.3px;
        font-weight: bold;
        border: none;
        border-radius: 3px;
        text-transform: uppercase;
        cursor: pointer;
      }

      .theme-btn.bottom {
        position: absolute;
        bottom: 14px;
        left: 14px;
      }

      /* Wide layout */
      @media (min-width: ${responsiveWidth}) {
        .toolbar-list {
          display: block;
        }

        .menu-btn {
          display: none;
        }

        .main-content {
          padding-top: 107px;
        }

        .theme-btn {
          position: absolute;
          top: 14px;
          right: 14px;
        }
      }
    </style>

    <h1>${appTitle}</h1>
    <nav class="toolbar-list">
      <a selected?="${page === 'view1'}" href="/view1">View One</a>
      <a selected?="${page === 'view2'}" href="/view2">View Two</a>
      <a selected?="${page === 'view3'}" href="/view3">View Three</a>
    </nav>

    <!-- Main content -->
    <main class="main-content">
      <my-view1 class="page" selected?="${page === 'view1'}"></my-view1>
      <my-view2 class="page" selected?="${page === 'view2'}"></my-view2>
      <my-view3 class="page" selected?="${page === 'view3'}"></my-view3>
      <my-view404 class="page" selected?="${page === 'view404'}"></my-view404>
    </main>

    <footer>
      <p>Made with &lt;3 by the Polymer team.</p>
    </footer>
    <snack-bar active$="${snackbarOpened}">
        You are now ${offline ? 'offline' : 'online'}.</snack-bar>
    `;
  }

  static get is() {
    return 'my-app';
  }

  static get properties() {
    return {
      page: String,
      appTitle: String,
      drawerOpened: Boolean,
      snackbarOpened: Boolean,
      offline: Boolean
    }
  }

  constructor() {
    super();
    // To force all event listeners for gestures to be passive.
    // See https://www.polymer-project.org/2.0/docs/devguide/gesture-events#use-passive-gesture-listeners
    setPassiveTouchGestures(true);
  }

  ready() {
    super.ready();
    installRouter(() => this._locationChanged());
    installOfflineWatcher((offline) => this._offlineChanged(offline));
    installMediaQueryWatcher(`(min-width: ${responsiveWidth})`,
        (matches) => this._layoutChanged(matches));
  }

  stateChanged(state) {
    this.page = state.app.page;
    this.offline = state.app.offline;
    this.snackbarOpened = state.app.snackbarOpened;
    this.drawerOpened = state.app.drawerOpened;
  }

  _layoutChanged(isWideLayout) {
    // The drawer doesn't make sense in a wide layout, so if it's opened, close it.
    this._drawerOpenedChanged(false);
  }

  _offlineChanged(offline) {
    const previousOffline = this.offline;
    store.dispatch(updateOffline(offline));

    // Don't show the snackbar on the first load of the page.
    if (previousOffline === undefined) {
      return;
    }

    store.dispatch(showSnackbar());
  }

  _locationChanged() {
    store.dispatch(navigate(window.decodeURIComponent(window.location.pathname)));

    // Close the drawer - in case the *path* change came from a link in the drawer.
    this._drawerOpenedChanged(false);
  }

  _drawerOpenedChanged(opened) {
    if (opened !== this.drawerOpened) {
      store.dispatch(opened ? openDrawer() : closeDrawer());
    }
  }
}

window.customElements.define(MyApp.is, MyApp);
