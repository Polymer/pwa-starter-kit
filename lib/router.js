/*
  Basic router that calls a callback whenever the location is updated.

  Sample use:
  import { Element as PolymerElement} from '../../node_modules/@polymer/polymer/polymer-element.js';
  import { connect } from '../../node_modules/@polymer/redux-helpers/connect-mixin.js';
  import { installRouter } from '../../lib/router.js';
  
  class MyElement extends connect(store)(PolymerElement) {
    // ...

    ready() {
      super.ready();

      // If you don’t have any other work to do other than dispatching an action,
      // you can write something like:
      installRouter(() => store.dispatch(updateLocation(window.location)));

      // If you need to do other work, you can also use this, where the
      // _notifyPathChanged method would dispatch the store action.
      // installRouter(this._notifyPathChanged.bind(this));
    }
  }
*/

export const installRouter = (locationUpdatedCallback) => {
  document.body.addEventListener('click', e => {
    if (e.defaultPrevented || e.button !== 0 ||
        e.metaKey || e.ctrlKey || e.shiftKey) return;

    const anchor = e.composedPath().filter(n => n.tagName === 'A')[0];
    if (!anchor || anchor.target ||
        anchor.hasAttribute('download') ||
        anchor.getAttribute('rel') === 'external') return;

    const href = anchor.href;
    if (!href || href.indexOf('mailto:') !== -1) return;

    const location = window.location;
    const origin = location.origin || location.protocol + '//' + location.host;
    if (href.indexOf(origin) !== 0) return;

    e.preventDefault();
    if (href !== location.href) {
      window.history.pushState({}, '', href);
      locationUpdatedCallback();
    }
  });

  window.addEventListener('popstate', () => locationUpdatedCallback());
  locationUpdatedCallback();
};
