---
layout: post
title: Redux and state management
---
This page will take you through the steps you need to do to use Redux to manage your application's state.

## Table of contents

- [General principles](#general-principles)
  - [Some definitions](#some-definitions)
  - [Naming conventions](#naming-conventions)
- [Connecting elements to the store](#connecting-elements-to-the-store)
  - [What to connect](#what-to-connect)
  - [How to connect](#how-to-connect)
    - [Creating a store](#creating-a-store)
    - [Connecting an element to the store](#connecting-an-element-to-the-store)
    - [Dispatching actions](#dispatching-actions)
- [Case study walkthrough](##case-study-walkthrough)
  - [Example 1: Counter](#example-1-counter)
  - [Example 2: Shopping Cart](#example-2-shopping-cart)
  - [Routing](#routing)
- [Patterns](#patterns)
  - [Connecting dom events to action creators](#connecting-dom-events-to-action-creators)
    - [Manually](#manually)
    - [Automatically](#automatically)
  - [Reducers: slice reducers](#reducers-slice-reducers)
  - [Avoid duplicate state](#avoid-duplicate-state)
  - [How to make sure third-party components don't mutate the state](#how-to-make-sure-third-party-components-dont-mutate-the-state)
  - [Routing](#routing-1)
  - [Lazy Loading](#lazy-loading)
  - [Replicating the state for storage](#replicating-the-state-for-storage)

## General principles
[Redux](https://redux.js.org/) is a small state management container, that is view agnostic and widely used. It is centered around the idea of separating your application logic (the application state) from your view layer, and having the store as a single source of truth for the application state. We recommend reading some of the [Redux docs](https://redux.js.org/) for a good introduction, as well as this awesome [cartoon intro to Redux](https://code-cartoons.com/a-cartoon-intro-to-redux-3afb775501a6) by Lin Clark.

One of the neat features of Redux is that it lets you do [time travel debugging](https://code-cartoons.com/hot-reloading-and-time-travel-debugging-what-are-they-3c8ed2812f35); in particular, we use this [Chrome extension](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd?hl=en).

### Some definitions

When working with Redux, a bunch of words get used a lot, that might sound confusing at first:
- **state**: this is the information contained by the app. In general, any element properties that you use could be considered the state.
- **store**: the thing that holds the state. You can only have one store, and it is the source of all truth. You can get the state from the store via `store.getState()`.
- **actions**: represent the facts about “what happened” to the state, and are how the application communicates with the store (to tell it that something needs to be updated. You send an action `MEOW` to the store using `store.dispatch(MEOW)`.
- **action creators**: functions that create actions. They return an action, which can then be dispatched. You use an action creator in your app via `store.dispatch(doAMeow())`. Action creators can also dispatch asynchronous actions, which makes them very useful!
- **reducers**: describe how the state updates as a result of an action. They are functions that take the old state, an action, and (after doing some work), return a brand new copy of the state, with the right updates applied.

### Naming conventions
We recommend structuring your application code as follows:
```
src
├── store.js
├── actions
│   └── counter.js
|   └── ...
├── reducers
│   └── counter.js
|   └── ...
└── components
    └── simple-counter.js
    └── my-app.js
    └── ...
```

- Action creators and reducers can (but aren't required to) have the same name, and be named after the slice of the app's data they deal with. For example, a shopping app could have the following reducers:
  - `app.js` to deal with big picture app-related data, such as online/offline status, route paths, etc.
  - `products.js` for the list of products you can purchase.
  - `cart.js` for the shopping cart.
  - etc.
- Action type
  - Verb(+noun, optional), present tense: `ADD_TODO`, `FETCH`, `FETCH_ITEMS`, `RECEIVE_ITEMS`.
  - These should represent what's about to happen, not what has already happened.
- Action creator
  - Same as action type, camel cased (`addTodo` -> `ADD_TODO`).
- Selector
  - `categorySelector`/`itemsSelector` vs `getCategory`/`getItems` (to distinguish that one is a selector, whereas the `get*` methods could just be non-memoized selectors).

## Connecting elements to the store

### What to connect
Generally, anything that needs to have direct access to the store data should be considered a **connected** element. This includes both updating the state (by calling `store.dispatch`), or consuming the state (by calling `store.subscribe`). However, if the element only needs to consume store data, it could receive this data via data bindings from a connected parent element. If you think about a shopping cart example: the cart itself needs to be connected to the store, since “what's in the cart” is part of the application's state, but the reusable elements that are rendering each item in the cart don't need to be connected (since they can just receive their data through a data binding).

Since this is a very application specific decision, one way to start looking at it is to try connecting your lazy-loaded elements, and then go up or down one level from there. That might end up looking something like:
<img width="785" alt="screen shot 2018-01-25 at 12 22 39 pm" src="https://user-images.githubusercontent.com/1369170/35410478-7373c98a-01ca-11e8-9f7f-4b95c8a4f47c.png">

In this example, only `my-app` and `my-view1` are connected. Since `a-element` is more of a reusable component rather than an application level component, even if it needs to update the application's data, it will communicate this via a DOM event, like [this](https://github.com/Polymer/pwa-starter-kit/blob/master/src/components/counter-element.js#L56).

## How to connect
If you want to follow along with actual code, we've included a basic Redux [counter example](https://github.com/Polymer/pwa-starter-kit/blob/master/src/components/my-view2.js) in `pwa-starter-kit`.

### Creating a store
If you want to create a simple store, that is not lazy loading reducers, then you probably want something like this:
```js
export const store = createStore(
  reducer,
  compose(applyMiddleware(thunk))
);
```
Note that this still isn't the most basic store you can have, since it adds the [redux-thunk](https://github.com/gaearon/redux-thunk) middleware -- this allows you to dispatch async actions, which for any medium-complexity app is a requirement. In most cases however, you're going to be lazy loading routes, and they should lazy load their reducers, so you want a store that can replace its reducers after it's been initialized, which is why `pwa-starter-kit` initializes the store with a `lazyReducerEnhancer` and the `redux-thunk`:

```js
export const store = createStore(
  (state, action) => state,
  compose(lazyReducerEnhancer(combineReducers), applyMiddleware(thunk))
);
```

You can find more details on the `lazyReducerEnhancer` in the [Lazy Loading](#lazy-loading) section.

### Connecting an element to the store
An element that is connected should call `store.subscribe` in the constructor, and only update its properties in the `update` method (if it needs to). We use a mixin ([`connect-mixin.js`](https://github.com/Polymer/pwa-helpers/blob/master/connect-mixin.js)) from `pwa-helpers` that does all the connection boilerplate for you, and expects you to implement the `stateChanged` method. Example use:

```js
import { LitElement, html } from '@polymer/lit-element/lit-element.js'
import { connect } from  '@polymer/pwa-helpers/connect-mixin.js';
import { store } from './store/store.js';

class MyElement extends connect(store)(LitElement) {
  static get is() { return 'my-element'; }

  static get properties() { return {
    clicks: { type: Number },
    value: { type: Number }
  }}

  render() {
    return html`...`;
  }

  // If you don't implement this method, you will get a
  // warning in the console.
  stateChanged(state) {
    this.clicks = state.counter.clicks;
    this.value = state.counter.value;
  }
}
```

Note that `stateChanged` gets called **any** time the store updates, not when only the things you care about update. So in the example above, `stateChanged` could be called multiple times without `state.counter.clicks` and `state.counter.value` ever changing. If you're doing any expensive work in `stateChanged`, such as transforming the data from the Redux store (with something like `Object.values(state.data.someArray)`), consider moving that logic into the `render()` function (which is called only if the properties update), using a selector, or adding some form of dirty checking:

```js
stateChanged(state) {
  if (this.clicks !== state.counter.clicks) {
    this.clicks = state.counter.clicks;
  }
}
```
### Dispatching actions
If an element needs to dispatch an action to update the store, it should call an action creator:

```js
import { increment } from './store/actions/counter.js';

firstUpdated() {
  // Every time the display of the counter updates, save
  // these values in the store
  this.addEventListener('counter-incremented', function() {
    store.dispatch(increment());
  });
}
```

Action creators say what the system _should_ do, not what it has already done. This action creator could return a synchronous action:
```js
export const increment = () => {
  return {
    type: INCREMENT
  };
};
```

An asynchronous one,
```js
export const increment = () => (dispatch, getState) => {
  // Do some sort of work.
  const state = getState();
  const howMuch  = state.counter.doubleIncrement ? 2 : 1;
  dispatch({
      type: INCREMENT,
      howMuch,
    });
  }
};
```
Or dispatch the result of another action creator:
```js
export const increment = () => (dispatch, getState) => {
  // Do some sort of work.
  const state = getState();
  const howMuch = state.counter.doubleIncrement? 2 : 1;
  dispatch(incrementBy(howMuch));
};
```

## Case study walkthrough
The goal of this walkthrough is to demonstrate how to get started with Redux, by explaining how we added 2 of the standard Redux examples in the `pwa-starter-kit` template app.

### Example 1: Counter
The [counter](https://redux.js.org/docs/introduction/Examples.html#counter-vanilla) example is very simple: we're going to add a counter custom element (that you can imagine is a reusable, third party element) to `my-view2.js`. This example is very detailed, and goes through every line of code that needs to change. If you want a higher level example, check out Example 2. The interaction between the elements, the action creators, action, reducers and the store looks something like this:
<img width="886" alt="screen shot 2018-01-25 at 12 44 24 pm" src="https://user-images.githubusercontent.com/1369170/35411408-7edd9d84-01cd-11e8-9044-d817dc1967da.png">

#### `counter.element.js`
This is a [plain element](https://github.com/Polymer/pwa-starter-kit/blob/master/src/components/counter-element.js) that's not connected to the Redux store. It has two properties, `clicks` and `value`, and 2 buttons that increment or decrement the value (and always increment `clicks`).

#### `my-view2.js`
This element is an [app-level element](https://github.com/Polymer/pwa-starter-kit/blob/master/src/components/my-view2.js) (as opposed to a reusable element), and it's connected to the store. This means that it will be able to read and update the application's state -- in particular, the value/clicks properties from `counter-element`. We need to:
- Add `counter-element` to this view. Note that we pass the state **down** to the element, since the state lives in the Redux store, not in the element. We do this because even though the `counter-element` updates _its_ internal properties every time you click any of the buttons, that may not necessarily be the true state of the app -- imagine a more complex example, where a different view is also updating the value of this counter. The store is then the only source of truth for the data, and the `counter-element` must always reflect that.

```html
<counter-element value="${props._value}" clicks="${props._clicks}"></counter-element>
```
- To demonstrate that it is the Redux store driving the state, and not `counter-element`'s internal, hidden state, we also added the `clicks` property to the circle in the header:

```html
<div class="circle">${props._clicks}</div>
```
- Connect the view to the store:

```js
import { connect } from '@polymer/pwa-helpers/connect-mixin.js';
class MyView2 extends connect(store)(LitElement) {
...
}
```
- Lazily load the reducers. You don't _have_ to do this (especially if you're prototyping), but since this view is lazy loaded, its reducers should be as well (to follow the “don't do anything until you actually need it” PRPL approach).

```js
import counter from '../reducers/counter.js';
store.addReducers({
  counter
});
```
- Implement the `stateChanged` method, which is called when anything is updated in the store. Since the store is the source of truth for the 2 properties (rather than `counter-element` itself), any time the Redux store updates we need to update any local properties; this keeps `counter-element` up to-date:

```js
stateChanged(state) {
  this._clicks = state.counter.clicks;
  this._value = state.counter.value;
}
```

- Note that here both `_clicks` and `_value` start with an underscore, which means they are protected -- we don't expect anyone from _outside_ the `<my-view2>` element to want to modify them.
- In turn, when `counter-element` updates its value (because the buttons were clicked), we listen to its change events and dispatch an action creator to the store:

```js
this.addEventListener('counter-incremented', function() {
  store.dispatch(increment());
})
```
- `increment` is an action creator. It is defined in `src/actions/counter.js`, and dispatches an `INCREMENT` action (and the same for `decrement`). When the store receives this action, it needs to update the state. This is done in the `src/reducers/counter.js` reducer.

### Example 2: Shopping Cart
The [shopping cart example](https://redux.js.org/docs/introduction/Examples.html#shopping-cart) is a little more complex. The main view element (`my-view3.js`) contains `<shop-products>`, a list of products that you can choose from, and `<shop-cart>`, the shopping cart. You can select products from the list to add them to the cart; each product has a limited stock, and can run out. You can perform a checkout in the cart, which has a probability of failing (which in real life could fail because of credit card validation, server errors, etc). It looks like this:
<img width="819" alt="screen shot 2018-01-25 at 12 50 22 pm" src="https://user-images.githubusercontent.com/1369170/35411643-53dccc62-01ce-11e8-8799-6a48da8901a5.png">

#### `my-view3.js`
This is a connected element that displays both the list of products, the cart, and the Checkout button. It is only connected because it needs to display conditional UI, based on whether the cart has any items (i.e. show a Checkout button or not). This could've been an unconnected element if the Checkout button belonged to the cart, for example.
- Pressing the Checkout button calls the `checkout` action creator. In this action creator you would do any credit cart/server validations, so if the operation cannot be completed, you would fire `CHECKOUT_FAILURE` here. We simulate that by flipping a coin, and conditionally dispatching the async action.
- If the checkout action succeeds, then the `products` object will be updated (with the new stock), and the `cart` will be reset to its initial value (empty).
- One thing to note: in the `src/reducers/shop.js` reducer we use a lot of slice reducers. A slice reducer is responsible for a slice (yes, really) of the whole store (for example, one product item) and updating it. To update the available stock for a specific item ID in the store, we call the `products` slide reducer (to reduce the whole store to just the products), then the `product` slice reducer for the product ID passed in the action.

#### `shop-products.js`
This element gets the list of products from the store by dispatching the `getAllProducts` action creator. When the store is updated (by fetching the products from a service, for example), its `stateChanged` method is called, which populates a `products` object. Finally, this object is used to render the list of products.
- `getAllProducts` is an action creator that simulates getting the data from a service (it doesn't, it gets it from a local object, but that's where you would out that logic). When the data is ready, it dispatches an async `GET_PRODUCTS` action.
- Note that whenever a product is added to the cart, the `addToCart` action creator is dispatched. This updates both the `products` and `cart` objects in the Redux store, which will in turn call `stateChanged` in both `shop-products` and `shop-cart`.
- Adding an item to the cart dispatches the `addToCart` action creator, which first double-checks the stock (on the Redux side) before actually adding the item to the cart. This is done to avoid any front-end hacks where you could add more items to the cart than in the stock 😅

#### `shop-cart.js`
Similar to `shop-products`, this element is also connected to the store and observes both the `products` and `cart` state. One of the Redux rules is that there should be only one source of truth, and you should not be duplicating data. For this reason, `products` is the source of truth (that contains all the available items), and `cart` contains the indexes, and number of, items that have been added to the cart.

### Routing
We use a very simple (but flexible) redux-friendly router, that uses the window location and stores it in store. We do this by using the `installRouter` helper method provided from the `pwa-helpers` package:
```js
import { installRouter } from '@polymer/pwa-helpers/router.js';
firstUpdated() {
  installRouter((location) => this._locationChanged(location));
}
```

## Patterns

### Connecting DOM events to action creators
If you don't want to connect every element to the store (and you shouldn't), unconnected elements will have to communicate the need to update the state in the store.

#### Manually
You can do this manually by firing event. If `<child-element>` is unconnected but displays and modifies a property `foo`:
- Whenever foo is modified, `<child-element>` fires an event:

```js
_onIncrement() {
  this.value++;
  this.dispatchEvent(new CustomEvent('counter-incremented');
}
```
- The connected parent of `<child-element>` can listen to this event and dispatch an action to the store:

```html
<counter-element on-counter-incremented="${() => store.dispatch(increment())}"
```

Or in JavaScript,
```js
firstUpdated() {
  this.addEventListener('counter-incremented', function() {
    store.dispatch(increment());
  });
}
```

#### Automatically
Alternatively, you can write a helper to automatically convert any Polymer `foo-changed` property change event into a Redux action. Note that this requires the `<child-element>`'s properties to be notifying (i.e. have `notify: true`), which isn't necessarily true of all third party elements out there. Here's an [example](https://gist.github.com/kevinpschaaf/995c9d1fd0f58fe021b174c4238b38c3#file-5-connect-element-mixin-js) of that.

### Reducers: slice reducers

To make your app more modular, you can split the main state object into parts ("slices") and have smaller "slice reducers" operate on each part ([read more about slice reducers](https://redux.js.org/docs/recipes/reducers/SplittingReducerLogic.html)). With the `lazyReducerEnhancer`, your app can lazily add slice reducers as necessary (e.g. add the `counter` slice reducer when `my-view2.js` is imported since only `my-view2` operates on that part of the state).

**`src/store.js:`**
```js
export const store = createStore(
  (state, action) => state,
  compose(lazyReducerEnhancer(combineReducers), applyMiddleware(thunk))
);
```

**`src/components/my-view2.js:`**
```js
// This element is connected to the Redux store.
import { store } from '../store.js';

// We are lazy loading its reducer.
import counter from '../reducers/counter.js';
store.addReducers({
  counter
});
```

### Avoid duplicate state

We avoid storing duplicate data in the state by using the [Reselect](https://github.com/reactjs/reselect) library. For example, the state may contain a list of items, and one of them is the selected item (e.g. based on the URL). Instead of storing the selected item separately, create a selector that computes the selected item:

```js
import { createSelector } from 'reselect';

const locationSelector = state => state.location;
const itemsSelector = state => state.items;

const selectedItemSelector = createSelector(
  locationSelector,
  itemsSelector,
  (location, items) => items[location.pathname.slice(1)]
);

// To get the selected item:
console.log(selectedItemSelector(state));
```

To see an example of this, check out the cart example's [cart quantity selector](https://github.com/Polymer/pwa-starter-kit/blob/master/src/components/my-view3.js#L107) or the [item selector](https://github.com/PolymerLabs/polymer-redux-hn/blob/master/src/components/hn-item.ts#L59) from the [Redux-HN](https://github.com/PolymerLabs/polymer-redux-hn) sample app. In both examples, the selector is actually defined in a reducer, since it's being used both on the Redux side, as well as in the view layer.

### How to make sure third-party components don't mutate the state
Most third-party components were not written to be used in an immutable way, and are not connected to the Redux store so you can't guarantee that they will not try to update the store. For example, `paper-input` has a `value` property, that it updates based on internal actions (i.e. you typing, validating, etc). To make sure that elements like this don't update the store:
- Use one-way data bindings to pass primitives (Strings, Numbers, etc) down to the element.
  - `<paper-input value="${foo}"></paper-input>`
  - Because it's a primitive value, paper-input receives a copy of `foo`. When it updates `foo`, it only updates **its** copy, not the actual property in the store
  - Listen to `foo-changed` events outside the element, and dispatch an action to update the store from there ([example](https://github.com/Polymer/pwa-starter-kit/blob/master/src/components/my-view2.js#L51)).
- Since arrays/objects are mutable, pass down a **copy** of an array or object down to the element:
  - `<other-input data="${_copy(fooArray)}"></other-input>`
  - `<other-input data="${_deepCopy(fooObj)}"></other-input>`
  - Listen to change events as above to dispatch an action to update the store.

### Routing
With Redux, you're basically on your own for routing. However, we have provided a [helper router](https://github.com/Polymer/pwa-helpers/blob/master/router.js) to get you started. Our suggestion is to update the location state based on `window.location`. That is, whenever a link is clicked (or the user navigates back), an action is dispatched to update the state based on the location. This works well with time-travel debugging - jumping to a previous state doesn't affect the URL bar or history stack.

Example of installing and using the router:

```js
// ...
import { installRouter } from '@polymer/pwa-helpers/router.js';

class MyApp extends connect(store)(LitElement) {
    // ...
    firstUpdated() {
      installRouter((location) => this._locationChanged(location));

      // The argument passed to installRouter is a callback. If you don't
      // have any other work to do other than dispatching an action, you
      // can also write something like:
      // installRouter((location) => store.dispatch(navigate(location.pathname)));
    }

    _locationChanged(location) {
      // What action creator you dispatch and what part of the location
      // will depend on your app.
      store.dispatch(navigate(location.pathname));

      // Do other work, if needed, like closing drawers, etc.
    }
  }
}
```

### Lazy loading
One of the main aspects of the PRPL pattern is lazy loading your application's components as they are needed. If one of these lazy-loaded elements is connected to the store, then your app needs to be able to lazy load that element's reducers as well.

There are many ways in which you can do this. We've implemented one of them as a [helper](https://github.com/Polymer/pwa-helpers/blob/master/lazy-reducer-enhancer.js), which can be added to the store:
```js
import lazyReducerEnhancer from '@polymer/pwa-helpers/lazy-reducer-enhancer.js';

// Not-lazy loaded reducers that are initially loaded.
import app from './reducers/app.js';

export const store = createStore(
  (state, action) => state,
  compose(lazyReducerEnhancer, applyMiddleware(thunk))
);

// Initially loaded reducers.
store.addReducers({
  app
});
```

In this example, the application will boot up and install the `app` reducers, but no others. In your lazy-loaded element, to load its reducer, all you need to do is call `store.addReducers`:
```js
// If this element was lazy loaded, we must also install its reducer
import { someReducer } from './store/reducers/one.js';
import { someOtherReducer } from './store/reducers/two.js';

// Lazy-load the reducer
store.addReducers({someReducer, someOtherReducer});

class MyElement extends ... {
…
}
```

### Replicating the state for storage
One of the things your app might want to do is save the state of the app in a storage location (like a database, or `localStorage`. Redux is very useful for this, since you basically just need to install a new reducer to subscribe to the state, that will dump the state into storage.

To do this, we can first create two functions, called `saveState` and `loadState`, to read to/from storage:
```js
export const saveState = (state) => {
  let stringifiedState = JSON.stringify(state);
  localStorage.setItem(MY_KEY, stringifiedState);
}
export const loadState = () => {
  let json = localStorage.getItem(MY_KEY) || '{}';
  let state = JSON.parse(json);

  if (state) {
    return state;
  } else {
    return undefined;  // To use the defaults in the reducers
  }
}
```

Now, in `store.js`, we basically want to use the result of `loadState()` as the default state in the store, and call `saveState()` every time the store updates:

```js
export const store = createStore(
  (state, action) => state,
  loadState(),  // If there is local storage data, load it.
  compose(lazyReducerEnhancer(combineReducers), applyMiddleware(thunk))
);

// This subscriber writes to local storage anytime the state updates.
store.subscribe(() => {
  saveState(store.getState());
});
```

That's it! If you want to see a demo of this in a project, the [**Flash-Cards**](https://github.com/notwaldorf/flash-cards/blob/master/src/localStorage.js) app implements this pattern.
