---
layout: post
title: Browser support
permalink: /browser-support
---
`pwa-starter-kit` uses fairly recent browsers APIs, from new JavaScript language features, to new DOM specs:
- [Custom Elements](https://developer.mozilla.org/en-US/docs/Web/API/Window/customElements)
- [Shadow DOM](https://developer.mozilla.org/en-US/docs/Web/API/Element/attachShadow)
- [Custom CSS properties](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_variables)
- [JS modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import)
- Dynamic JS modules via [`import()`](https://github.com/tc39/proposal-dynamic-import)
- [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
- [`class` syntax](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes)
- [Object rest/spread properties](https://github.com/tc39/proposal-object-rest-spread)
- [`async`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function)/[`await`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await)

At the time of writing, Chrome 60 and Safari 11.1 natively support all of these features, out of the box. To run `pwa-starter-kit` on other browsers, you need to use a combination of polyfills and transpilation (e.g. babel).

This step is automated for you by the `npm run build` script, but in case you want to roll your own building and bundling strategy, here is an overview of what is needed and where:

Feature  | Action needed | On what browsers|
 ------------ | :-----------: | -----------: |
Custom Elements | [Polyfill](https://github.com/webcomponents/webcomponentsjs) | [IE11, Edge, Firefox<63, Safari<11](https://caniuse.com/#feat=custom-elementsv1) |
Shadow DOM | [Polyfill](https://github.com/webcomponents/webcomponentsjs) | [IE11, Edge, Firefox<63, Safari<11](https://caniuse.com/#feat=shadowdomv1)|
Class syntax | Transpile (babel), extra [adapter](https://github.com/webcomponents/webcomponentsjs#custom-elements-es5-adapterjs) for Custom Elements/Shadow DOM | [IE11](https://caniuse.com/#feat=es6-class) |
Promises | [Polyfill](https://github.com/stefanpenner/es6-promise)| [IE11](https://caniuse.com/#feat=promises) |
Object rest/spread properties | Transpile (babel) | [IE11, Edge, Safari<11.1](http://kangax.github.io/compat-table/es2016plus/#test-object_rest/spread_properties) |
JS modules | Polyfill | [IE11, Firefox<60, Safari<11](https://caniuse.com/#feat=es6-module) |
Dynamic JS modules (`import()`) | Polyfill, a module loader (webpack) | [IE11, Edge, Firefox, Safari<11.1](https://caniuse.com/#feat=es6-module-dynamic-import) |
`async`/`await` | Transpile (babel) | [IE11](https://caniuse.com/#feat=async-functions) |
