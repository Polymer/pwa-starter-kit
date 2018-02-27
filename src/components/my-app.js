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

import '../../node_modules/@polymer/app-layout/app-drawer/app-drawer.js';
import '../../node_modules/@polymer/app-layout/app-header/app-header.js';
import '../../node_modules/@polymer/app-layout/app-scroll-effects/effects/waterfall.js';
import '../../node_modules/@polymer/app-layout/app-toolbar/app-toolbar.js';
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
        --app-drawer-width: 256px;
        display: block;

        /* Default theme */
        --pink: #E91E63;
        --gray: #293237;
        --app-primary-color: var(--pink);
        --app-secondary-color: var(--gray);
        --app-dark-text-color: var(--app-secondary-color);
        --app-light-text-color: white;
        --app-section-even-color: #f7f7f7;
        --app-section-odd-color: white;

        --app-header-background-color: white;
        --app-header-text-color: var(--app-dark-text-color);
        --app-header-selected-color: var(--app-primary-color);

        --app-drawer-background-color: var(--app-secondary-color);
        --app-drawer-text-color: var(--app-light-text-color);
        --app-drawer-selected-color: #78909C;
      }

      :host(.bright-theme) {
        --yellow: #F2E579;
        --pink: #DF5D94;

        --app-primary-color: #78BDF0;  /* light blue */
        --app-secondary-color: #564B7A;  /* dark purple */
        --app-dark-text-color: #293237;  /* grey */
        --app-light-text-color: white;
        --app-section-even-color: #FFFDE7;
        --app-section-odd-color: white;

        --app-header-background-color: var(--pink);
        --app-header-text-color: white;
        --app-header-selected-color: var(--yellow);

        --app-drawer-background-color: var(--app-secondary-color);
        --app-drawer-text-color: white;
        --app-drawer-selected-color: var(--yellow);
      }

      app-header {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        text-align: center;
        background-color: var(--app-header-background-color);
        color: var(--app-header-text-color);
        border-bottom: 1px solid #eee;
      }

      .toolbar-top {
        background-color: var(--app-header-background-color);
      }

      [main-title] {
        font-family: 'Pacifico';
        text-transform: lowercase;
        font-size: 30px;
      }

      .toolbar-list {
        display: none;
      }

      .toolbar-list a {
        display: inline-block;
        color: var(--app-header-text-color);
        text-decoration: none;
        line-height: 30px;
        padding: 4px 24px;
      }

      .toolbar-list a[selected] {
        color: var(--app-header-selected-color);
        border-bottom: 4px solid var(--app-header-selected-color);
      }

      .menu-btn {
        background: none;
        border: none;
        fill: var(--app-header-text-color);
        cursor: pointer;
        height: 44px;
        width: 44px;
      }

      .drawer-list {
        box-sizing: border-box;
        width: 100%;
        height: 100%;
        padding: 24px;
        background: var(--app-drawer-background-color);
        position: relative;
      }

      .drawer-list a {
        display: block;
        text-decoration: none;
        color: var(--app-drawer-text-color);
        line-height: 40px;
        padding: 0 24px;
      }

      .drawer-list a[selected] {
        color: var(--app-drawer-selected-color);
      }

      .main-content {
        padding-top: 64px;
        min-height: 100vh;
      }

      .main-content .page {
        display: none;
      }

      .main-content .page[selected] {
        display: block;
      }

      footer {
        padding: 24px;
        background: var(--app-drawer-background-color);
        color: var(--app-drawer-text-color);
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

    <!-- Header -->
    <app-header condenses reveals effects="waterfall">
      <app-toolbar class="toolbar-top">
        <button class="menu-btn" on-click="${_ => this._drawerOpenedChanged(true)}">${menuIcon}</button>
        <div main-title>${appTitle}</div>
        <button class="theme-btn" on-click="${_ => this._changeTheme()}">change theme</button>
      </app-toolbar>

      <!-- This gets hidden on a small screen-->
      <nav class="toolbar-list">
        <a selected?="${page === 'view1'}" href="/view1">View One</a>
        <a selected?="${page === 'view2'}" href="/view2">View Two</a>
        <a selected?="${page === 'view3'}" href="/view3">View Three</a>
      </nav>
    </app-header>

    <!-- Drawer content -->
    <app-drawer opened="${drawerOpened}" on-opened-changed="${e => this._drawerOpenedChanged(e.target.opened)}">
      <nav class="drawer-list">
        <a selected?="${page === 'view1'}" href="/view1">View One</a>
        <a selected?="${page === 'view2'}" href="/view2">View Two</a>
        <a selected?="${page === 'view3'}" href="/view3">View Three</a>

        <button class="theme-btn bottom" on-click="${_ => {this._changeTheme()}}">change theme</button>
      </nav>
    </app-drawer>

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
    <snack-bar active?="${snackbarOpened}">
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

  _changeTheme() {
    if (this.classList.contains('bright-theme')) {
      this.classList.remove('bright-theme');
    } else {
      this.classList.add('bright-theme');
    }
  }
}

window.customElements.define(MyApp.is, MyApp);
