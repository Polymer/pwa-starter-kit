---
layout: post
title: What's in the box?
---
The `pwa-starter-kit` is a sample app that's meant to be used as a starting point for building PWAs. Out of the box, it gives you the following features:
- all the PWA goodness (manifest, service worker)
- a responsive layout
- application theming
- example of using Redux for state management
- offline UI
- simple routing solution
- fast time-to-interactive and first-paint through the PRPL pattern
- easy deployment to prpl-server or static hosting
- unit and integrating testing starting points
- documentation about other advanced patterns.

## Other templates
If you already know what you're doing and want a simpler template to start from, we've created several separate templates, with some of the features removed:

### `template-minimal-ui` ([code](https://github.com/Polymer/pwa-starter-kit/tree/template-minimal-ui), [demo](https://template-minimal-ui-dot-pwa-starter-kit.appspot.com/))

This template uses Redux for state management like the `master` template, but doesn't use any of the `app-layout` elements (`app-header` or `app-drawer`) for the responsive UI.

### `template-no-redux` ([code](https://github.com/Polymer/pwa-starter-kit/tree/template-no-redux), [demo](https://template-no-redux-dot-pwa-starter-kit.appspot.com/))

This template has the same UI elements as the `master` one (`app-layout` elements, theming, etc), but does _not_ use Redux for state management. Instead, it does a properties-down-events-up unidirectional data flow approach, where the data source of truth is mutable, and individual elements (specifically, each view) own parts of the entire application state.

### `template-responsive-drawer-layout` ([code](https://github.com/Polymer/pwa-starter-kit/tree/template-responsive-drawer-layout), [demo](https://template-responsive-drawer-layout-dot-pwa-starter-kit.appspot.com/))

This template is very similar to the `master` template, in the sense that it keeps both Redux for state management, and all of the UI elements. The main difference is that the wide screen layout displays a persistent `app-drawer`, inline with the content.

## `pwa-helpers`
A lot of the reusable functionality of `pwa-starter-kit` has already been pulled out as helper methods, into a separate repo. The [`pwa-helpers`](https://github.com/Polymer/pwa-helpers) contains:
- `router.js`: a very basic router that calls a callback any time the location changes
- `network.js`: calls a callback whenever the network connectivity of the app changes
- `metadata.js`: utility method that sets the Twitter card/open graph metadata for a specific page
- `media-query.js`: calls a callback whenever a media-query matches in response to the viewport size changing
- `connect-mixin.js`: small mixin that you can add to a Custom Element base class to automatically connect to a Redux store

Each of these helpers is very small, and can be implemented in many different, bespoke ways. However, they each represent a feature that is often needed across many different applications, so unless you already have a solution planned for your app, you could use one of these.
