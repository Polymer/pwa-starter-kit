---
layout: post
title: Configuring and personalizing
---
This page will take you through the steps you need to do to modify the app and add your own content.

## Table of Contents
- [Folder structure](#folder-structure)
- [Naming and code conventions](#naming-and-code-conventions)
- [Customizing the app](#customizing-the-app)
  - [Changing the name of your app](#changing-the-name-of-your-app)
  - [Adding a new page](#adding-a-new-page)
  - [Using icons](#using-icons)
  - [Sharing styles](#sharing-styles)
  - [Fonts](#fonts)
  - [But I don't want to use Redux](#but-i-dont-want-to-use-redux)
- [Advanced topics](#advanced-topics)
  - [Responsive layout](#responsive-layout)
  - [Conditionally rendering views](#conditionally-rendering-views)
  - [Routing](#routing)
  - [SEO](#seo)
  - [Fetching data](#fetching-data)
  - [Responding to network state changes](#responding-to-network-state-changes)
  - [State management](#state-management)
  - [Theming](#theming)

# Folder structure
Your app will be initialized with a bunch of folders and files, that looks like this:
```
my-app
├── images
│   ├── favicon.ico
│   └── manifest
│       ├── icon-48x48.png
│       └── ...
├── src
│   ├── store.js
│   ├── actions
│   │   └── ...
│   ├── reducers
│   │   └── ...
│   ├── components
│   │   └── ...
├── test
│   ├── unit
│   │   └── ...
│   └── integration
│       └── ...
├── index.html
├── README.md
├── package.json
├── polymer.json
├── manifest.json
├── service-worker.js
├── sw-precache-config.js
├── wct.conf.json
├── .travis.yml
```
- `images/` has your logos and favicons. If you needed to add any other assets to your application, this would be a good place for them.
- `src/` is where all the code lives. It's broken down in 4 areas:
  - `components/` is the directory that contains all the custom elements in the application.
  - `actions/`, `reducers/` and `store.js` are Redux specific files and folders. Check out the [Redux and state management]({{site.baseurl}}/redux-and-state-management) page for details on that setup.
- `test/` is the directory with all of your tests. it's split in `unit` tests (that are run across different browsers), and `integration` tests, that just run on headless Chrome to ensure that the end-to-end application runs and is accessible. Check out the [application testing]({{site.baseurl}}/application-testing) page for more information.
- `index.html` is your application's starting point. It's where you load your polyfills and the main entry point element.
- `package.json`: the `npm` configuration file, where you specify your dependencies. Make sure you run `npm install` any time you make any changes to this file.
- `polymer.json`: the `polymer cli` configuration file, that specifies how your project should be bundled, what's included in the service worker, etc. ([docs](https://www.polymer-project.org/2.0/docs/tools/polymer-json)).
- `manifest.json` is the PWA [metadata file](https://developers.google.com/web/fundamentals/web-app-manifest/). It contains the name, theme color and logos for your app, that are used whenever a user adds your application to the homescreen.
- `service-worker.js` is a placeholder file for your Service Worker. In each build directory, the `polymer cli` will populate this file with [actual contents](https://www.polymer-project.org/2.0/toolbox/service-worker), but during development it is disabled.
- `sw-precache-config.js` is a [configuration file](https://www.polymer-project.org/2.0/toolbox/service-worker) that sets up the precaching behaviour of the Service Worker (such as which files to be precached, the navigation fallback, etc.).
- `wct.conf.json` is the [web-component-tester](https://github.com/Polymer/web-component-tester) configuration file, that specifies the folder to run tests from, etc.
- `.travis.yml` sets up the integration testing we run on every commit on [Travis](https://docs.travis-ci.com/user/customizing-the-build/).

You can add more app-specific folders if you want, to keep your code organized -- for example, you might want to create a `src/views/` folder and move all the top-level views in there.

# Naming and code conventions
This section covers some background about the naming and coding conventions you will find in this template:
- Generally, an element `<sample-element>` will be created in a file called `src/components/sample-element.js`, and the class used to register it will be called `SampleElement`.
- The elements use a mix of Polymer 3 and `lit-html` via the [`LitElement`](https://github.com/Polymer/lit-element) base class. The structure of one of these elements is basically:

```js
import { LitElement, html } from '@polymer/lit-element';
class SampleElement extends LitElement {
  // The properties that your element exposes.
  static get properties() { return {
    publicProperty: Number,
    _privateProperty: String    /* note the leading underscore */
  }};

  constructor() {
    super();
    // Set up the property defaults here
    this.publicProperty = 0;
    this._privateProperty = '';
  }

  _render({publicProperty, _privateProperty}) {
    // Note the use of the object spread to explicitely
    // call out which properties you're using for rendering.

    // Anything code that is related to rendering should be done in here.

    return html`
      <!-- your element's template goes here -->
    `;
  });

  _firstRendered() {
    // Any code that relies on render having been called once goes here.
    // (for example setting up listeners, etc)
  }
  ...
}
window.customElements.define('sample-element', SampleElement);
```
- Note that private properties are named with a leading underscore (`_foo` instead of `foo`). Since JavaScript doesn't have proper private properties, this in a coding convention that implies this property shouldn't be used outside of the element itself (so you would never write `<sample-element _foo="bar">`).

# Customizing the app
Here are some changes you might want to make to your app to personalize it.

## Changing the name of your app
By default, your app is called `my-app`. If you want to change this (which you obviously will), you'll want to make changes in a bunch of places:
- Config files: `package.json`, `polymer.json` and `manifest.json`
- In the app: `index.html`, the `<title>`, several `meta` fields, and the `appTitle` attribute on the `<my-app>` element

## Adding a new page
There are 4 places where the active page is used at any time:
- As a view in the [`<main>`](https://github.com/Polymer/pwa-starter-kit/blob/master/src/components/my-app.js#L197) element.
- As a navigation link in the [`drawer <nav>`](https://github.com/Polymer/pwa-starter-kit/blob/master/src/components/my-app.js#L189) element. This is the side nav that is shown in the small-screen (i.e. mobile) view.
- As a navigation link in the [`toolbar <nav>`](https://github.com/Polymer/pwa-starter-kit/blob/master/src/components/my-app.js#L179) element. This is the toolbar that is shown in the wide-screen (i.e. desktop) view.
- In the code for [lazy loading](https://github.com/Polymer/pwa-starter-kit/blob/master/src/actions/app.js#L29) pages. We explicitly list these pages, rather that doing something like `import('./my-'+page+'.js')`, so that the bundler knows these are separate routes, and bundles their dependencies accordingly. ⚠️Don't change this! :)

To add a new page, you need to add a new entry in each of these places. Note that if you only want to add an external link or button in the toolbar, then you can skip adding anything to the `<main>` element.

### Create a new page
First, let's create a new element, that will represent the new view for the page. The easiest way to do this is to copy the [`<my-view404>`](https://github.com/Polymer/pwa-starter-kit/blob/master/src/components/my-view404.js) element, since that's a good and basic starting point:
- Copy that file, and rename it to `my-view4.js`. We're going to assume the element's name is also `my-view4`, but if you want to use a name that makes more sense (like `about-page` or something), you can totally use that -- just make sure you are consistent!
- In this new file, rename the class to `MyView404` to `MyView4` (in 2 places), and the element's name to `my-view4`. When you're done, it should look like this:

```js
import { html } from '@polymer/lit-element/lit-element.js';
import { PageViewElement } from './page-view-element.js';
import { SharedStyles } from './shared-styles.js';

class MyView4 extends PageViewElement {
  _render(props) {
    return html`
      ${SharedStyles}
      <section>
        <h2>Oops! You hit a 404</h2>
        <p>The page you're looking for doesn't seem to exist. Head back
           <a href="/">home</a> and try again?
        </p>
      </section>
    `
  }
}
window.customElements.define('my-view4', MyView4);
```

(🔎This page extends `PageViewElement` rather than `LitElement` as an optimization; for more details on that, check out the [conditional rendering]({{site.baseurl}}/configuring-and-personalizing#conditionally-rendering-views) section).

### Adding the page to the application
Great! Now we that we have our new element, we need to add it to the application!

First, add it to each of the list of nav links. In the toolbar (the wide-screen view) add:
```html
<nav class="toolbar-list">
  ...
  <a selected?="${_page === 'view4'}" href="/view4">New View!</a>
</nav>
```

Similarly, we can add it to the list of nav links in the drawer:
```html
<nav class="drawer-list">
  ...
  <a selected?="${_page === 'view4'}" href="$/view4">New View!</a>
</nav>
```

And in the main content itself:
```html
<main class="main-content">
  ...
  <my-view4 class="page" active?="${_page === 'view4'}"></my-view4>
</main>
```

Note that in all of these code snippets, the `selected` attribute is used to [highlight](https://github.com/Polymer/pwa-starter-kit/blob/master/src/components/my-app.js#L93) the active page, and the `active` attribute is also used to ensure that only the active page is [actually rendered](https://github.com/Polymer/pwa-starter-kit/blob/master/src/components/page-view-element.js#L16).

Finally, we need to lazy load this page. Without this, the links will appear, but they won't be able to navigate to your new page, since `my-view4` will be undefined (we haven't imported its source code anywhere). In the [`loadPage ` action creator](https://github.com/Polymer/pwa-starter-kit/blob/master/src/actions/app.js#L29), add a new `case` statement:
```js
switch(page) {
  ...
  case 'view4':
    import('../components/my-view4.js');
    break;
}
```

Don't worry if you don't know what an _action creator_ is yet. You can find a complete explanation of how it fits into the state management story in the [Redux]({{site.baseurl}}/redux-and-state-management) page.

That's it! Now, if you refresh the page, you should be able to see the new link and page. Don't forget to re-build your application before you deploy to production (or test that build), since this new page needs to be added to the output.

### Adding the page to the push manifest

To take advantage of HTTP/2 server push, you need to specify what scripts are needed for the new page. Add a new entry to `push-manifest.json`:

```js
{
  "/view4": {
    "src/components/my-app.js": {
      "type": "script",
      "weight": 1
    },
    "src/components/my-view4.js": {
      "type": "script",
      "weight": 1
    },
    "node_modules/@webcomponents/webcomponentsjs/webcomponents-loader.js": {
      "type": "script",
      "weight": 1
    }
  },

  /* other entries */
}
```

## Using icons
You can inline an `<svg>` directly where you need it in the page, but if there's any reusable icons you'd
like to define once and use in several places, `my-icons.js` is a good spot for that. To add a new icon, you
can just add a new line to that file:
```js
export const closeIcon = html`<svg>...</svg>`
```

Then, you can import it and use it as a template literal in an element's `_render()` method:
```js
import { closeIcon } from './my-icons.js';
_render(props) {
  return html`
    <button title="close">${closeIcon}</button>
  `;
}
```

## Sharing styles
Similarly, shared styles are also just exported template literals. If you take a look at `shared-styles.js`, it
exports a `<style>` node template, that is then inlined in an element's `_render()` method:
```js
import { SharedStyles } from './shared-styles.js';
_render(props) {
  return html`
    ${SharedStyles}
    <div>...</div>
  `;
}
```

## Fonts
The app doesn't use any web fonts for the content copy, but does use a Google font for the app title. Be careful not too load too many fonts, however: aside from increasing the download size of your first page, web fonts also [slow down the performance](https://developers.google.com/web/fundamentals/performance/optimizing-content-efficiency/webfont-optimization) of an app, and cause flashes of unstyled content.

## But I don't want to use Redux
The `pwa-starter-kit` is supposed to be the well-lit path to building a fairly complex PWA, but it should in no way feel restrictive. If you know what you're doing, and don't want to use Redux to manage your application's state, that's totally fine! We've created a separate template, [`template-no-redux`](https://github.com/Polymer/pwa-starter-kit/tree/template-no-redux), that has the same UI and PWA elements as the main template, but does not have Redux.

Instead, it uses a unidirectional data flow approach: some elements are in charge of [maintaining the state](https://github.com/Polymer/pwa-starter-kit/blob/template-no-redux/src/components/my-view2.js#L43) for their section of the application, and they [pass that data down](https://github.com/Polymer/pwa-starter-kit/blob/template-no-redux/src/components/my-view2.js#L32) to children elements. In response, when the children elements need to update the state, they [fire an event](https://github.com/Polymer/pwa-starter-kit/blob/template-no-redux/src/components/counter-element.js#L49).

# Advanced topics

## Responsive layout
By default, the `pwa-starter-kit` comes with a responsive layout. At `460px`, the application switches from a wide, desktop view to a small, mobile one. You can change this value if you want the mobile layout to apply at a different size.

For a different kind of responsive layout, the [`template-responsive-drawer-layout`](https://github.com/Polymer/pwa-starter-kit/tree/template-responsive-drawer-layout) template displays a persistent app-drawer, inline with the content on wide screens (and uses the same small-screen drawer as the main template).

#### Changing the wide screen styles
The wide screen styles are controlled in CSS by a [media-query](https://github.com/Polymer/pwa-starter-kit/blob/master/src/components/my-app.js#L150). In that block you can add any selectors that would only apply when the window viewport's width is at least `460px`; you can change this pixel value if you want to change the size at which these styles get applied (or, can add a separate style if you want to have several breakpoints).

#### Changing narrow screen styles
The rest of the styles in [`my-app`](https://github.com/Polymer/pwa-starter-kit/blob/master/src/components/my-app.js#L35) are outside of the media-query, and thus are either general styles (if they're not overwritten by the media-query styles), or narrow-screen specific, like [this one](https://github.com/Polymer/pwa-starter-kit/blob/master/src/components/my-app.js#L81) (in this example, the  `<nav class="toolbar-list">` is hidden in the narrow screen view, and visible in the wide screen view).

#### Responsive styles in JavaScript
If you want to run specific JavaScript code when the size changes from a wide to narrow screen (for example, to make the drawer persistent, etc), you can use the [`installMediaQueryWatcher`](https://github.com/Polymer/pwa-helpers/blob/master/media-query.js) helper from `pwa-helpers`. When you [set it up](https://github.com/Polymer/pwa-starter-kit/blob/master/src/components/my-app.js#L233), you can specify the callback that is ran whenever the media query matches.

## Conditionally rendering views
Which view is visible at a given time is controlled through an `active` attribute, that is set if the name of the page matches the location, and is then used for [styling](https://github.com/Polymer/pwa-starter-kit/blob/master/src/components/my-app.js#L137):

```html
<style>
  .main-content .page {
    display: none;
  }
  .main-content .page[active] {
    display: block;
  }
</style>
<main class="main-content">
  <my-view1 class="page" active?="${page === 'view1'}"></my-view1>
  <my-view2 class="page" active?="${page === 'view2'}"></my-view2>
  ...
</main>
```

However, just because a particular view isn't visible doesn't mean it's "inactive" -- its JavaScript can still run. In particular, if your application is using Redux, and the view is connected (like [`my-view2`](https://github.com/Polymer/pwa-starter-kit/blob/master/src/components/my-view2.js#L17) for example), then it will get notified **any** time the Redux store changes, which could trigger `_render()` to be called. Most of the time this is probably not what you want -- a hidden view shouldn't be updating itself until it's actually visible on screen. Apart from being inefficient (you're doing work that nobody is looking at), you could run into really weird side effects: if a view's `_render()` function also updates the title of the application, for example, the title may end up being set incorrectly by one of these inactive views, just because it was the last view to set it.

To get around that, the views inherit from a [`PageViewElement`](https://github.com/Polymer/pwa-starter-kit/blob/master/src/components/page-view-element.js) base class, rather than `LitElement` directly. This base class checks whether the `active` attribute is set on the host (the same attribute we use for styling), and calls `_render()` only if it [is set](https://github.com/Polymer/pwa-starter-kit/blob/master/src/components/page-view-element.js#L15).

If this isn't the behaviour you want, and you want hidden pages to update behind the scenes, then all you have to do is change the view's base class back to `LitElement` (i.e. changing [this line](https://github.com/Polymer/pwa-starter-kit/blob/master/src/components/my-view1.js#L15)). Just look out for those side effects!

## Routing
The app uses a very [basic router](https://github.com/Polymer/pwa-helpers/blob/master/router.js), that listens to changes to the `window.location`. You install the router by passing it a callback, which is a function that will be called any time the location changes:

```js
installRouter((location) => this._locationChanged(location));
```
Then, whenever a link is clicked (or the user navigates back to a page), `this._locationChanged` is called with the new location. You can check the [Redux page]({{site.baseurl}}/redux-and-state-management#routing) to see how this location is stored in the Redux store.

Sometimes you might need to update this location (and the Redux store) imperatively -- for example if you have custom code for link hijacking, or you're managing page navigations in a custom way. In that case, you can manually update the browser's history state yourself, and then call the `this._locationChanged` method manually (thus simulating an action from the router):

```js
// This function would get called whenever you want
// to manually manage the location.

onArticleLinkClick(page) {
  const newLocation = `/article/${page}`
  window.history.pushState({}, '', newLocation);
  this._locationChanged(newLocation);
};
```

## SEO
We've added a starting point for adding rich social graph content to each pages, both using the [Open Graph](http://ogp.me/) protocol (used on Facebook, Slack etc) and [Twitter cards](https://developer.twitter.com/en/docs/tweets/optimize-with-cards/overview/abouts-cards).

This is done in two places:
- Statically, in the [`index.html`](https://github.com/Polymer/pwa-starter-kit/blob/master/index.html#L60). These are used by the homepage, and represent any of the common metadata across all pages (for example, if you don't have a page specific description or image, etc).
- Automatically, after you change pages, in [`my-app.js`](https://github.com/Polymer/pwa-starter-kit/blob/master/src/components/my-app.js#L240), using the [`updateMetadata`](https://github.com/Polymer/pwa-helpers/blob/master/metadata.js) helper from `pwa-helpers`. By default, we update the URL and the title of each page, but there are multiple ways in which you can add page-specific content that depend on your apps.

A different approach is to update this metadata differently, depending on what page you are. For example, the **Books** doesn't update the metadata in the main [top-level element](https://github.com/PolymerLabs/books/blob/master/src/components/book-app.js#L47), but on specific sub-pages. It uses the image thumbnail of a book only on the [detail pages](https://github.com/PolymerLabs/books/blob/master/src/components/book-detail.js#L61), and adds the search query on the [explore page](https://github.com/PolymerLabs/books/blob/master/src/components/book-explore.js#L35).

If you want to test how your site is viewed by Googlebot, Sam Li has a great [article](https://medium.com/dev-channel/polymer-2-and-googlebot-2ad50c5727dd) on gotchas to look out for -- in particular, the testing section covers a couple tools you can use, such as [Fetch as Google](https://support.google.com/webmasters/answer/6066468?hl=en) and [Mobile-Friendly Test](https://search.google.com/test/mobile-friendly).

## Fetching data
If you want to fetch data from an API or a different server, we recommend dispatching an action creator from a component, and making that fetch asynchronously in a Redux action. For example, the **Flash Cards** sample app dispatches a [`loadAll`](https://github.com/notwaldorf/flash-cards/blob/master/src/components/my-app.js#L142) action creator when the main element boots up; it is that action creator that then does the [actual fetch](https://github.com/notwaldorf/flash-cards/blob/master/src/components/my-app.js#L142) of the file and sends it back to the main component by adding the data to the state [in a reducer](https://github.com/notwaldorf/flash-cards/blob/master/src/reducers/data.js#L7).

A similar approach is taken in the **Hacker News** app where an element [dispatches an action creator](https://github.com/PolymerLabs/polymer-redux-hn/blob/master/src/components/hn-item.js#L45), and it's that action creator that actually [fetches the data](https://github.com/PolymerLabs/polymer-redux-hn/blob/master/src/actions/items.js#L15) from the HN API.

## Responding to network state changes
You might want to change your UI as a response to the network state changing (i.e. going from offline to online).

Using the [`installOfflineWatcher`](https://github.com/Polymer/pwa-helpers/blob/master/network.js) helper from `pwa-helpers`, we've added a [callback](https://github.com/Polymer/pwa-starter-kit/blob/master/src/components/my-app.js#L232) that will be called any time we go online or offline. In particular, we've added a [snackbar](https://github.com/Polymer/pwa-starter-kit/blob/master/src/components/my-app.js#L208) that gets shown; you can configure its contents and style in [`snack-bar.js`](https://github.com/Polymer/pwa-starter-kit/blob/master/src/components/snack-bar.js). Note that the snackbar is shown as a result of a Redux [action creator](https://github.com/Polymer/pwa-starter-kit/blob/master/src/actions/app.js#L69) being dispatched, and its duration can be configured there.

Rather than just using it as an FYI, you can use the offline status to display conditional UI in your application. For example, the **Books** sample app displays an [offline view](https://github.com/PolymerLabs/books/blob/master/src/components/book-offline.js) rather than the details view when the [application is offline](https://github.com/PolymerLabs/books/blob/master/src/components/book-detail.js#L293).

## State management
There are many different ways in which you can manage your application's state, and choosing the right one depends a lot on the size of your team and application. For simple applications, a uni-directional data flow pattern might be enough (the top level, `<my-app>` element could be in charge of being the source of state truth, and it could pass it down to each of the elements, as needed); if that's what you're looking for, check out the [`template-no-redux`](https://github.com/Polymer/pwa-starter-kit/tree/template-no-redux) branch.

Another popular approach is [Redux](https://redux.js.org/), which keeps the state in a store outside of the app, and passes immutable copies to each element. To see how that is set up, check out the [Redux and state management]({{site.baseurl}}/redux-and-state-management) section for an explainer, and more details.


## Theming
This section is useful both if you want to change the default colours of the app, or if you want to let your users be able to switch between different themes.

#### Changing the default colours
For ease of theming, we've defined all of the colours the application uses as [CSS custom properties](https://developer.mozilla.org/en-US/docs/Web/CSS/--*), in the [`<my-app>`](https://github.com/Polymer/pwa-starter-kit/blob/master/src/components/my-app.js#L40) element. Custom properties are variables that can be reused throughout your CSS. For example, to change the application header to be white text on a lavender background, then you need to update the following properties:
```css
--app-header-background-color: lavender;
--app-header-text-color: black;
```

And similarly for the other UI elements in the application.

#### Switching themes
Re-theming the entire app basically involves updating the custom properties that are used throughout the app.
If you just want to personalize the default template with your own theme, all you have to do is change the values of the app's [custom properties](https://github.com/Polymer/pwa-starter-kit/blob/master/src/components/my-app.js#L40).

If you want to be able to switch between two different themes in the app (for example between a "light" and "dark" theme), you could just add a class (for example, `dark-theme`) to the `my-app` element for the new theme, and style that separately. This would end up looking similar to this:

```css
:host {
  /* This is the default, light theme */
  --app-primary-color: red;
  --app-secondary-color: black;
  --app-text-color: var(--app-secondary-color);
  --app-header-background-color: white;
  --app-header-text-color: var(--app-text-color);
  ...
}

:host.dark-theme {
  /* This is the dark theme */
  --app-primary-color: yellow;
  --app-secondary-color: white;
  --app-text-color: var(--app-secondary-color);
  --app-header-background-color: black;
  --app-header-text-color: var(--app-text-color);
  ...
}
```

You control when this class is added; this could be when a "use dark theme" button is clicked, or based on a hash parameter in the location, or the time of day, etc.

## Next steps
Now that you're done configuring your application, check out the next steps:
- [Testing the performance]({{site.baseurl}}/performance-testing) of your app to ensure your users have a fast experience.
- [General testing]({{site.baseurl}}/application-testing) your app to make sure new changes don't accidentally cause regressions.
- [Building and deploying]({{site.baseurl}}/building-and-deploying) to production.
