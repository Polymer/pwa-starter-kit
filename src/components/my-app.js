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
import { connect } from '../../node_modules/redux-helpers/connect-mixin.js';
import { installRouter } from '../../node_modules/redux-helpers/router.js';
import '../../node_modules/@polymer/app-layout/app-drawer/app-drawer.js';
import '../../node_modules/@polymer/app-layout/app-header/app-header.js';
import '../../node_modules/@polymer/app-layout/app-scroll-effects/app-scroll-effects.js';
import '../../node_modules/@polymer/app-layout/app-toolbar/app-toolbar.js';
import { menuIcon } from './my-icons.js';

import { store } from '../store.js';
import { navigate, show404 } from '../actions/app.js';

// When the viewport width is smaller than `responsiveWidth`, layout changes to narrow layout.
// In narrow layout, the drawer will be stacked on top of the main content instead of side-by-side.
import { responsiveWidth } from './shared-styles.js';

class MyApp extends connect(store)(LitElement) {
  render({page, appTitle}) {
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

      .toolbar-list a[selected="true"] {
        color: var(--app-header-selected-color);
        border-bottom: 4px solid var(--app-header-selected-color);
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
        position: relative;
      }

      .drawer-list a {
        display: block;
        text-decoration: none;
        color: var(--app-drawer-text-color);
        line-height: 40px;
        padding: 0 24px;
      }

      .drawer-list a[selected="true"] {
        color: var(--app-drawer-selected-color);
      }

      .main-content {
        padding-top: 64px;
        min-height: 100vh;
      }

      .main-content .page[selected="true"] {
        display: block;
      }

      .main-content .page[selected="false"] {
        display: none;
      }

      footer {
        box-sizing: border-box;
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
        <button class="menu-btn" on-click="${() => this._drawer.open()}">${menuIcon}</button>
        <div main-title>${appTitle}</div>
        <button class="theme-btn" on-click="${() => this._changeTheme()}">change theme</button>
      </app-toolbar>

      <!-- This gets hidden on a small screen-->
      <div class="toolbar-list" role="navigation">
        <a selected$="${page === 'view1'}" href="${Polymer.rootPath}view1">View One</a>
        <a selected$="${page === 'view2'}" href="${Polymer.rootPath}view2">View Two</a>
        <a selected$="${page === 'view3'}" href="${Polymer.rootPath}view3">View Three</a>
      </div>
    </app-header>

    <!-- Drawer content -->
    <app-drawer id="drawer">
      <div class="drawer-list" role="navigation">
        <a selected$="${page === 'view1'}" href="${Polymer.rootPath}view1">View One</a>
        <a selected$="${page === 'view2'}" href="${Polymer.rootPath}view2">View Two</a>
        <a selected$="${page === 'view3'}" href="${Polymer.rootPath}view3">View Three</a>

        <button class="theme-btn bottom" on-click="${() => {this._changeTheme(); this._drawer.close()}}">change theme</button>
      </div>
    </app-drawer>

    <!-- Main content -->
    <div class="main-content" role="main">
      <my-view1 class="page" selected$="${page === 'view1'}"></my-view1>
      <my-view2 class="page" selected$="${page === 'view2'}"></my-view2>
      <my-view3 class="page" selected$="${page === 'view3'}"></my-view3>
      <my-view404 class="page" selected$="${page === 'view404'}"></my-view404>
    </div>

    <footer>
      <p>Made with &lt;3 by the Polymer team</p>
    </footer>
`;
  }

  static get is() {
    return 'my-app';
  }

  static get properties() {
    return {
      page: String,
      appTitle: String,
    }
  }

  update(state) {
    this.page = state.app.page;
  }

  _propertiesChanged(props, changed, oldProps) {
    if (changed && 'page' in changed) {
      this._pageChanged();
      this._updateMetadata();
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

  _changeTheme() {
    if (this.classList.contains('bright-theme')) {
      this.classList.remove('bright-theme');
    } else {
      this.classList.add('bright-theme');
    }
  }

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

  _updateMetadata() {
    document.title = this.appTitle + ' - ' + this.page;

    // Set open graph metadata
    this._setMeta('property', 'og:title', document.title);
    // You could replace this with a description, if you had one.
    this._setMeta('property', 'og:description', document.title);
    this._setMeta('property', 'og:url', document.location.href);
    // If you have an image that's specific to each page:
    //this._setMeta('property', 'og:image', ...);

    // Set twitter card metadata
    this._setMeta('property', 'twitter:title', document.title);
      // You could replace this with a description, if you had one.
    this._setMeta('property', 'twitter:description', document.title);
    this._setMeta('property', 'twitter:url', document.location.href);
    // If you have an image that's specific to each page:
    //this._setMeta('property', 'twitter:image:src', ...);
  }

  _setMeta(attrName, attrValue, content) {
    let element = document.head.querySelector(`meta[${attrName}="${attrValue}"]`);
    if (!element) {
      element = document.createElement('meta');
      element.setAttribute(attrName, attrValue);
      document.head.appendChild(element);
    }
    element.setAttribute('content', content || '');
  }
}

window.customElements.define(MyApp.is, MyApp);
