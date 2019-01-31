---
layout: post
title: Sample apps
permalink: /sample-apps
---
Here are some applications that we [![built with pwa–starter–kit](https://img.shields.io/badge/built_with-pwa–starter–kit_-blue.svg)](https://github.com/Polymer/pwa-starter-kit "Built with pwa–starter–kit"){:class="inline"}

### Hacker News ([code](https://github.com/Polymer/pwa-starter-kit-hn), [demo](https://pwa-starter-kit-hn.appspot.com/))
- a small Hacker News client, inspired by the [HN PWA](https://hnpwa.com/) project that compares implementations for the same PWA app
- pattern for fetching data from a generic API
- pattern for using [`indexedDB`](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API) for local storage

### Flash Cards ([code](https://github.com/notwaldorf/flash-cards), [demo](https://flash-cards.netlify.com))
- flash-cards game to help you learn Japanese (but can be extended for any language and set of cards)
- pattern for storing state in [`localStorage`](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)
- pattern for loading local data `json` files
- uses the [`SpeechSynthesis`](https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis) API

### Books ([code](https://github.com/PolymerLabs/books), [demo](https://books-pwakit.appspot.com/))
- app that searches for books using the [Google Books API](https://developers.google.com/books/docs/v1/reference/volumes/list)
- shows how to use the [Embedded Viewer API](https://developers.google.com/books/docs/viewer/reference) to display book content
- shows how to use the [Google Books API](https://developers.google.com/books/docs/v1/reference/volumes/list) to list/update favorites on the authenticated user's bookshelf
- pattern for using UI loading placeholders
- pattern for re-fetching data when the network state changes
- pattern for integrating [Google Sign-In](https://developers.google.com/identity/protocols/OAuth2UserAgent)
- uses the [SpeechRecognition](https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition) API

### Shop ([code](https://github.com/polymer/shop/tree/lit-element), [demo](https://lit-element-dot-polymer-shop.appspot.com/))
- a sample e-commerce shopping site
- pattern for a real-life shopping cart and store checkout flow
- pattern for using custom announcers for accessibility
