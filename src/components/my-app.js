/**
@license
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

import { LitElement, html } from '../../node_modules/@polymer/lit-element/lit-element.js'
import { connect } from '../../../node_modules/redux-helpers/connect-mixin.js';
import { installRouter } from '../../../node_modules/redux-helpers/router.js';
import '../../node_modules/@polymer/app-layout/app-drawer/app-drawer.js';
import '../../node_modules/@polymer/app-layout/app-header/app-header.js';
import '../../node_modules/@polymer/app-layout/app-scroll-effects/app-scroll-effects.js';
import '../../node_modules/@polymer/app-layout/app-toolbar/app-toolbar.js';
import '../../node_modules/@polymer/iron-pages/iron-pages.js';
import '../../node_modules/@polymer/iron-selector/iron-selector.js';
import { menuIcon } from './my-icons.js';


import { store } from '../store.js';
import { navigate, show404 } from '../actions/app.js';

// When the viewport width is smaller than `responsiveWidth`, layout changes to narrow layout.
// In narrow layout, the drawer will be stacked on top of the main content instead of side-by-side.
const responsiveWidth = '460px';

class MyApp extends connect(store)(LitElement) {
  render({page}) {
    return html`
    <style>
      :host {
        --app-text-color: black;

        --app-header-background-color: white;
        --app-header-text-color: black;
        --app-header-selected-color: #FF0083;

        --app-drawer-background-color: #313131;
        --app-drawer-text-color: white;
        --app-drawer-selected-color: #B7B7B7;

        --app-primary-color: #4285f4;
        --app-secondary-color: black;
        --app-drawer-width: 256px;

        display: block;
      }

      app-header {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        color: #fff;
        background-color: var(--app-header-background-color);
        text-align: center;
        color: var(--app-header-text-color);
        border-bottom: 1px solid #eee;
      }

      [main-title] {
        font-family: 'Pacifico';
        text-transform: lowercase;
        font-size: 30px;
      }

      .toolbar-list {
        display: none;
        text-align: center;
      }

      .toolbar-list a {
        display: inline-block;
        color: var(--app-header-text-color);
        text-decoration: none;
        line-height: 30px;
        padding: 14px 24px;
      }

      .toolbar-list a.iron-selected {
        color: var(--app-header-selected-color);
      }

      .menu-btn {
        box-sizing: border-box;
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
      }

      .drawer-list a {
        display: block;
        text-decoration: none;
        color: var(--app-drawer-text-color);
        line-height: 40px;
        padding: 0 24px;
      }

      .drawer-list a.iron-selected {
        color: var(--app-drawer-selected-color);
      }

      .main-content {
        padding-top: 64px;
      }

      footer {
        box-sizing: border-box;
        padding: 24px;
        background: var(--app-drawer-background-color);
        color: var(--app-drawer-text-color);
        text-align: center;
      }
      /* Wide layout */
      @media (min-width: ${responsiveWidth}) {
        .toolbar-list {
          display: block;
          width: 100%;
        }
        .menu-btn {
          display: none;
        }

        .main-content {
          padding-top: 122px;
        }
      }
    </style>

    <!-- Header -->
    <app-header condenses reveals effects="waterfall">
      <app-toolbar>
        <button class="menu-btn" on-click="${() => this._drawer.open()}" icon="my-icons:menu">${menuIcon}</button>
        <div main-title>My App</div>
      </app-toolbar>
      <!-- This gets hidden on a small screen-->
      <div class="toolbar-list">
        <iron-selector selected="${page}" attr-for-selected="name" role="navigation">
          <a name="view1" href="${Polymer.rootPath}view1">View One</a>
          <a name="view2" href="${Polymer.rootPath}view2">View Two</a>
          <a name="view3" href="${Polymer.rootPath}view3">View Three</a>
        </iron-selector>
      </div>
    </app-header>

    <!-- Drawer content -->
    <app-drawer id="drawer">
      <div class="drawer-list">
        <iron-selector selected="${page}" attr-for-selected="name" role="navigation">
          <a name="view1" href="${Polymer.rootPath}view1">View One</a>
          <a name="view2" href="${Polymer.rootPath}view2">View Two</a>
          <a name="view3" href="${Polymer.rootPath}view3">View Three</a>
        </iron-selector>
      </div>
    </app-drawer>

    <!-- Main content -->
    <iron-pages class="main-content" selected="${page}" attr-for-selected="name" fallback-selection="view404" role="main">
      <my-view1 name="view1"></my-view1>
      <my-view2 name="view2"></my-view2>
      <my-view3 name="view3"></my-view3>
      <my-view404 name="view404"></my-view404>
    </iron-pages>

    <footer>
      <p>Made with <3 by the Polymer team</p>
    </footer>
`;
  }

  static get is() {
    return 'my-app';
  }

  static get properties() {
    return {
      page: String
    }
  }

  update(state) {
    this.page = state.app.page;
  }

  _propertiesChanged(props, changed, oldProps) {
    if (changed && 'page' in changed) {
      this._pageChanged();
    }
    super._propertiesChanged(props, changed, oldProps);
  }

  ready() {
    super.ready();
    this._drawer = this.shadowRoot.getElementById('drawer');
    installRouter(this._notifyPathChanged.bind(this));

    // let mql = window.matchMedia(`(min-width: ${responsiveWidth})`);
    // mql.addListener((e) => this._layoutChange(e.matches));
    // this._layoutChange(mql.matches);
  }

  // _layoutChange(isWideLayout) {
  //   this._drawer.persistent = this._drawer.opened = isWideLayout;
  // }

  _notifyPathChanged() {
    store.dispatch(navigate(window.decodeURIComponent(window.location.pathname)));

    // Close a non-persistent drawer when the page & route are changed.
    if (!this._drawer.persistent) {
      this._drawer.close();
    }
  }

  _pageChanged() {
    // Load page import on demand. Show 404 page if fails
    let loaded;
    if (!this.page) {
      return;
    }
    switch(this.page) {
      case 'view1':
        loaded = import('./my-view1.js');
        break;
      case 'view2':
        loaded = import('./my-view2.js');
        break;
      case 'view3':
        loaded = import('./my-view3.js');
        break;
      case 'view404':
        loaded = import('./my-view404.js');
        break;
      default:
        loaded = Promise.reject();
    }

    loaded.then(
      _ => {},
      _ => { store.dispatch(show404()) }
    );
  }
}

window.customElements.define(MyApp.is, MyApp);
