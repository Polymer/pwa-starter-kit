---
layout: post
title: Setup
---
This page will take you through the steps you need to do to build and run the sample app locally.

## Prerequisites
The app uses [Web Components](https://www.webcomponents.org/introduction), [lit-html](https://github.com/Polymer/lit-html), which is a small library for writing HTML templates with JavaScript string literals, and [lit-element](https://github.com/Polymer/lit-element), a small Web Component base class built on top of it.

This app depends on several [npm](https://www.npmjs.com/) packages, which you must be able to install. Make sure that you've already installed [node.js](https://nodejs.org/en/) and [npm](https://www.npmjs.com/) before moving on to the next step. If you already have `node` installed, make sure you're using the latest version -- we recommend using `v8.0.0` and above.

## Creating a new app
To create a new app that uses the `pwa-starter-kit` template:
```
git clone --depth 1 https://github.com/Polymer/pwa-starter-kit my-app
cd my-app
```

This will generate the initial project structure inside the `my-app` folder, which roughly looks like this:
```
my-app
├── images
|   └── ...
├── src
|   └── ...
├── test
|   └── ...
├── index.html
├── README.md
├── package.json
├── polymer.json
├── manifest.json
├── service-worker.js
├── sw-precache-config.js
├── ... (misc project config files)
```
Checkout the [folder structure]({{site.baseurl}}/configuring-and-personalizing#folder-structure) page for details on what each file is used for.

### Installing dependencies
To install the project's dependencies, run
```
npm install
```

You're now ready to run and see your app!

### Run the app in development mode
To run the app locally, run
```
npm start
```

This will start a local server on port `8081`. Open [http://localhost:8081](http://localhost:8081) to view your app in the browser. Note that this server can continue running as you're making changes to your application, which you will see if you refresh the browser tab.

If the port is already taken on your computer, or if you need to change the default hostname (because you're using a Docker container, for example), you can configure them using command line arguments:
```
npm start -- --hostname 0.0.0.0 --port 4444
```

### Run the tests
Check out the [Application testing]({{site.baseurl}}/application-testing) page for more information about the tests. For a quick way to run the tests, run
```
npm run test
```

## Available scripts
In the app's root directory you can run:
- `npm start` to run the application in development mode.
- `npm run test` to run the application's unit and integration tests (see the see the [testing section]({{site.baseurl}}/application-testing) for more details. To run just the unit or integration tests, both `npm run test:unit` and `npm run test:integration` are available.
- `npm run build` to build your application for production (see the [building and deploying]({{site.baseurl}}/building-and-deploying) section for more details).
- `npm run serve:static` or `npm run serve:prpl-server` to serve the built application (see the [building and deploying]({{site.baseurl}}/building-and-deploying) section for more details).

The complete list of scripts can be found in the [`package.json`](https://github.com/Polymer/pwa-starter-kit/blob/master/package.json#L10) file.

## Browser support
`pwa-starter-kit` uses fairly recent browsers APIs, that might not be natively available on all of the browsers you are supporting. To get around that, the app relies on polyfills, to add the missing web platform features to some browsers, as well as a build step, to add newer JavaScript features to browsers that don't support them (such as transpiling ES6 to ES5 for browsers like IE11, or dynamic module imports). Check out the [Browser Support]({{site.baseurl}}/browser-support) page for more details.

## Next steps
Now that you're done with the basics of running your app, check out the next steps:
- [Configuring and personalizing]({{site.baseurl}}/configuring-and-personalizing) the app by modifying and adding your own content
- [Building and deploying]({{site.baseurl}}/building-and-deploying) to production
