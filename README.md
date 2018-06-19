[![Built with pwa–starter–kit](https://img.shields.io/badge/built_with-pwa–starter–kit_-blue.svg)](https://github.com/Polymer/pwa-starter-kit "Built with pwa–starter–kit")
[![Build status](https://api.travis-ci.org/Polymer/pwa-starter-kit.svg?branch=template-minimal-ui)](https://travis-ci.org/Polymer/pwa-starter-kit)

# PWA Starter Kit - template-minimal-ui

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

This template uses Redux for state management like the `master` template, but doesn't use any of the `app-layout` elements (app-header or app-drawer) for the responsive UI.

### 📖Head over to the [documentation site](https://polymer.github.io/pwa-starter-kit/) for more details or check out [how to get started](https://polymer.github.io/pwa-starter-kit/setup/)!

![pwa-starter-kit screenshot](https://user-images.githubusercontent.com/116360/39716939-a353c706-51e6-11e8-972b-e006d25817ce.png)

## Known issues
These are high priority and currently being worked on, and they will all be fixed before the 1.0 release:
- `lit-element` and `lit-html` have IE11 compatibility issues
- if you have Node version 10, you might have problems running the unit tests (and you will get an error along the lines of `Cannot read property '1' of null`. For now, we recommend using node 8 or 9.

## TODOs
- [x] setup Safari testing on Travis
- [ ] update to latest [material-design-web-components](https://github.com/material-components/material-components-web-components)
- [x] deploy all templates as demos
