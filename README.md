[![Built with pwa–starter–kit](https://img.shields.io/badge/built_with-pwa–starter–kit_-blue.svg)](https://github.com/Polymer/pwa-starter-kit "Built with pwa–starter–kit")
[![Build status](https://api.travis-ci.org/Polymer/pwa-starter-kit.svg?branch=template-no-redux)](https://travis-ci.org/Polymer/pwa-starter-kit)

# PWA Starter Kit -- `template-no-redux`

This sample app is a starting point for building PWAs. Out of the box, the template
gives you the following features:
- all the PWA goodness (manifest, service worker)
- a responsive layout
- application theming
- offline UI
- simple routing solution
- fast time-to-interactive and first-paint through the PRPL pattern
- easy deployment to prpl-server or static hosting
- unit and integrating testing starting points
- documentation about other advanced patterns.

This template has the same UI elements as the `master` one (`app-layout` elements, theming, etc), but does not use Redux for state management. Instead, it does a properties-down-events-up unidirectional data flow approach, where the data source of truth is mutable, and individual elements (specifically, each view) own parts of the entire application state.

### 📖Head over to the [wiki](https://github.com/PolymerLabs/pwa-starter-kit/wiki) for more details!

![pwa-starter-kit screenshot](https://user-images.githubusercontent.com/116360/37805520-24955fb8-2df8-11e8-9261-20db32eff971.jpg)
