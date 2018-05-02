![built_with pwa–starter–kit_](https://img.shields.io/badge/built_with-pwa–starter–kit_-blue.svg)
[![Build status](https://api.travis-ci.org/polymer/pwa-starter-kit.svg?branch=master)](https://travis-ci.org/polymer/pwa-starter-kit)

## 🚨Disclaimer 🚨
This template is not yet production ready. There are things that haven't been finalized yet, so this repo might change slightly before it's ready for release. Check out the list of Known Issues and TODOs for updates.

# PWA Starter Kit

This sample app is a starting point for building PWAs. Out of the box, the template
gives you the following features:
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

### 📖Head over to the [wiki](https://github.com/PolymerLabs/pwa-starter-kit/wiki) for more details!

![pwa-starter-kit screenshot](https://user-images.githubusercontent.com/116360/37805520-24955fb8-2df8-11e8-9261-20db32eff971.jpg)

## Known issues
- does not work Edge and Safari < 11.1 ([object spread operator issue](https://github.com/Polymer/tools/issues/173))
- does not work on IE11 ([String.prototype.startsWith issue](https://github.com/Polymer/lit-html/issues/311))
- ES5 bundle is broken ([issue](https://github.com/Polymer/polymer-cli/issues/1000))

## TODOs
- [ ] add Safari testing on Travis
- [ ] update to latest [material-design-web-components](https://github.com/material-components/material-components-web-components)
- [ ] deploy all templates as demos
