---
layout: post
title: Building and deploying
permalink: /building-and-deploying
---
This page will take you through the steps you need to do to build and deploy your application to production.

## Table of Contents
- [prpl-server (recommended)](#prpl-server-recommended)
  - [Building for prpl-server](#building-for-prpl-server)
  - [Previewing prpl-server](#previewing-prpl-server)
  - [Deploying prpl-server](#deploying-prpl-server)
    - [App Engine](#app-engine)
    - [Firebase Hosting + Firebase Functions](#firebase-hosting--firebase-functions)
- [Static hosting](#static-hosting)
  - [Building for static hosting](#building-for-static-hosting)
  - [Previewing static hosting](#previewing-static-hosting)
  - [Deploying static hosting](#deploying-static-hosting)
    - [App Engine](#app-engine-1)
    - [Firebase Hosting](#firebase-hosting)
    - [Netlify](#netlify)
- [Service Worker](#service-worker)

## `prpl-server` (recommended)
[prpl-server](https://github.com/Polymer/prpl-server-node) is a node server that uses differential serving to deliver the optimal response for each browser. Our provided configuration ([`polymer.json`](https://github.com/Polymer/pwa-starter-kit/blob/master/polymer.json)) supports the following responses:

- `esm-bundled` - Bundled ES modules for browsers that support ES modules
- `es6-bundled` - Bundled ES6/2015 code using [AMD](http://requirejs.org/docs/whyamd.html) for other browsers that support ES6/2015
- `es5-bundled` - Bundled ES5 code using [AMD](http://requirejs.org/docs/whyamd.html) for other browsers
- Server-side rendered pages (with [Rendertron](https://github.com/GoogleChrome/rendertron)) for supported bots/web crawlers

### Building for `prpl-server`
To run the build:

```
npm run build
```

This will populate the `server/build/` directory:

```
server/
├── build/
|   └── es5-bundled/
|   └── es6-bundled/
|   └── esm-bundled/
|   └── polymer.json
├── app.yaml
├── package-lock.json
└── package.json
```

### Previewing `prpl-server`
To preview the build using prpl-server locally:

```
npm run serve
```

### Deploying `prpl-server`
After building, the contents of `server/` contains all the files and configuration necessary to run the app in production. The provided `server/package.json` specifies server dependencies and the start command which can be used on almost any hosting service that supports Node.js.

#### App Engine

##### Standard Environment
The contents of `server/app.yaml` is pre-configured to be deployed to [Google App Engine Node.js Standard Environment](https://cloud.google.com/appengine/docs/standard/nodejs/). Use the `gcloud` tool to deploy the contents of `server/` (e.g. `gcloud app deploy server/app.yaml`).

##### Flexible Environment
To deploy to [Google App Engine Node.js Flexible Environment](https://cloud.google.com/appengine/docs/flexible/nodejs/), replace the entire contents of `server/app.yaml` with:

```yaml
runtime: nodejs
env: flex
automatic_scaling:
  min_num_instances: 1
```

Use the `gcloud` tool to deploy the contents of `server/` (e.g. `gcloud app deploy server/app.yaml`).

#### Firebase Hosting + Firebase Functions
_Firebase Hosting_ alone is not sufficient for hosting the `prpl-server` build since it requires some server-side processing of the user agent string. Instead, you will have to use `Firebase Functions` for server-side processing. [This gist](https://gist.github.com/Dabolus/314bd939959ebe68f57f1dcebe120a7e) contains detailed instructions on how to accomplish this.

## Static hosting
If you don't need differential serving and want to serve the same build to all browsers, you can just deploy to a static server.

### Building for static hosting
To build the production site, run:

```
npm run build:static
```

This will create three different build outputs:

```
build/
├── es5-bundled/
├── es6-bundled/
├── esm-bundled/
└── ...
```

- `esm-bundled` - Bundled ES modules for browsers that support ES modules
- `es6-bundled` - Bundled ES6/2015 code using [AMD](http://requirejs.org/docs/whyamd.html) for other browsers that support ES6/2015
- `es5-bundled` - Bundled ES5 code using [AMD](http://requirejs.org/docs/whyamd.html) for other browsers

### Previewing static hosting
To preview it locally, run:

```
npm run serve:static
```

Our provided configuration will serve the `es5-bundled` build. If you don't need to support legacy browsers, you can use a more modern build by modifying the `serve:static` script in [package.json](https://github.com/Polymer/pwa-starter-kit/blob/master/package.json#L14) to use `es6-bundled` or `esm-bundled` instead. Be sure that all page navigation requests are served the contents of `index.html`.

### Deploying static hosting
By default, static hosting servers aren't set up to work with single page apps (SPAs) -- in particular, the problem is that an SPA uses routes that do not correspond to full file path names. For example, in `pwa-starter-kit` the second view's URL is `http://localhost:8081/view2`, but that doesn't correspond to a file that the browser can use. Each static hosting server has a different approach to working around this:

#### App Engine
Download the [Google App Engine SDK](https://cloud.google.com/appengine/downloads) and follow the instructions for your platform to install it. Here we are using Python SDK.

[Sign up for an App Engine account](https://cloud.google.com/appengine) and go to [project dashboard](https://pantheon.corp.google.com/cloud-resource-manager) page to create a new project. Make note of the project ID associated with your project.

Create an App Engine config file (`app.yaml`) with the following:

```yaml
runtime: python27
api_version: 1
threadsafe: yes

handlers:

- url: /images
  static_dir: build/es5-bundled/images
  secure: always

- url: /node_modules
  static_dir: build/es5-bundled/node_modules
  secure: always

- url: /src
  static_dir: build/es5-bundled/src
  secure: always

- url: /manifest.json
  static_files: build/es5-bundled/manifest.json
  upload: build/es5-bundled/manifest.json
  secure: always

- url: /service-worker.js
  static_files: build/es5-bundled/service-worker.js
  upload: build/es5-bundled/service-worker.js
  secure: always

- url: /.*
  static_files: build/es5-bundled/index.html
  upload: build/es5-bundled/index.html
  secure: always

skip_files:
- build/es6-bundled/
- build/esm-bundled/
- images/
- node_modules/
- server/
- src/
- test/
```

To deploy your project:
```
gcloud app deploy --project <project_ID>
```

#### Firebase Hosting
[Firebase](https://firebase.google.com/docs/hosting/) provides easy http2-enabled static hosting, a real-time database, server functions, and edge-caching all over the globe.

Install the Firebase CLI:
```
npm install -g firebase-tools
```
[Sign up for a Firebase account](https://www.firebase.com/signup/) if you don't have one. Then go to [Firebase Console](https://www.firebase.com/) to create a new project. Make note of the project ID associated with your project.

Login to the Firebase and set the previously created project as the active Firebase project for your working directory:
```
firebase login
firebase use <project_ID>
```

Create a Firebase config file (`firebase.json`) with the following:

```json
{
  "hosting": {
    "public": "build/es5-bundled/",
    "rewrites": [
      {
        "source": "**/!(*.*)",
        "destination": "/index.html"
      }
    ],
     "headers": [
      {
        "source":"/service-worker.js",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "no-cache"
          }
        ]
      }
    ]
  }
}
```

To deploy your project:
```
firebase deploy
```

#### Netlify
[Netlify](https://www.netlify.com/) has built-in [Continuous Deployment](https://www.netlify.com/docs/continuous-deployment/) which automatically runs your build commands and deploys the result whenever you push to your Git repository.

Create a `_redirects` file with the following [rewrite rules](https://www.netlify.com/docs/redirects/):
```
/*    /index.html   200
```
Go to [netlify project](https://app.netlify.com/signup) page and setup the Git hosting for the new project. In `Basic build settings`, put `npm run build:static` as the build command and `build/es5-bundled` as the publish directory.

Click `Deploy site`.

## Service Worker
A Service Worker is loaded and registered in the [`index.html`](https://github.com/Polymer/pwa-starter-kit/blob/master/index.html#L68) file. However, during development (to make debugging easier), the Service Worker does not actually exist, and only a [stub](https://github.com/Polymer/pwa-starter-kit/blob/master/service-worker.js) file is used.

The production time Service Worker is automatically created during build time, i.e. by running `npm run build` or `npm run build:static`. This file is generated based on the [`polymer.json`](https://github.com/Polymer/pwa-starter-kit/blob/master/polymer.json) and [`sw-precache-config.js`](https://github.com/Polymer/pwa-starter-kit/blob/master/sw-precache-config.js) configuration files, and you can find it under each of the build directories:

```
build/
├── es5-bundled/
|   └── service-worker.js
├── es6-bundled/
|   └── service-worker.js
├── esm-bundled/
|   └── service-worker.js
└── ...
```

By default, all of the source files (inside the `/src` directory) will be pre-cached, as specified in the [`sw-precache-config.js`](https://github.com/Polymer/pwa-starter-kit/blob/master/sw-precache-config.js) configuration file. If you want to change this behaviour, check out the [`sw-precache-config` docs](https://www.polymer-project.org/3.0/toolbox/service-worker).
