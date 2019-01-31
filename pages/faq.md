---
layout: post
title: FAQ
permalink: /faq
---
We often get very similar questions across issues and PRs, and we figured it would be useful to list them here, for a reference.

## Replace an existing library with a different one

Sample issues: [#201](https://github.com/Polymer/pwa-starter-kit/issues/201), [#195](https://github.com/Polymer/pwa-starter-kit/pull/195)

We built pwa-starter kit (both the included templates and the sample apps) to be a good starting point for building a fairly complex PWA. This means that we had to make some decisions about which components, libraries and patterns to use -- these decisions were made around ease of use, popularity, and available documentation. There are many other options and libraries that are objectively good choices, and at the end of the day they all come down to a matter of personal preference. Since that’s not something that everyone can come to a consensus on, it’s unlikely that we will change an existing choice for a new one. You can, of course, replace any bits and pieces of pwa-starter-kit in _your_ application.

## Add example of using a library/framework

Sample issues: [#196](https://github.com/Polymer/pwa-starter-kit/issues/196), [#201](https://github.com/Polymer/pwa-starter-kit/issues/207)

pwa-starter-kit is not meant to replace any frameworks or application architecture patterns -- it’s meant to get you started towards building a complex PWA, but does not promise to build the entire thing for you. The templates are built in such a way that most JS libraries can be plugged in, since they don’t rely on a specific application structure. However, providing an example for each one of these patterns and libraries is a daunting task (and is generally applicable to a very small number of people).

If you’re looking for a good starting point of where to plug in a library, `store.js` is a good starting point -- it’s the place in the application that initializes Redux, which is a library that we plugged in, so your might need something similar.

## Can't add libraries not distributed as an ES module (ESM)

Sample issues: [#199](https://github.com/Polymer/pwa-starter-kit/issues/199)

Libraries must provide ES modules (ESM) - other module formats, such as UMD, `module.exports`, AMD, CommonJS, etc., are not compatible with Polymer build tools.

- If the library's `pkg.main` is not already ESM, check if `package.json` defines `pkg.module` or `pkg[‘jsnext:main’]` - our tools will prefer those if present.
- If the source is written as ESM, you can import the source specifically (e.g. `import 'some-lib/src'`).
- If the library sets browser globals, you can include it with a normal `<script>` tag in HTML and reference them through the window object (e.g. `window.someLib`).
- You can also consider contacting the library author to request ESM.

Alternatively, you can use another build tool (e.g. webpack, Rollup). See the below FAQ for webpack.

## Using webpack/other build tools

pwa-starter-kit is written with ES modules which is compatible with a variety of JavaScript build tools. For example, take a look at the [webpack branch](https://github.com/Polymer/pwa-starter-kit/tree/webpack).

## I’m getting errors when running the tests

Sample issues: [#193](https://github.com/Polymer/pwa-starter-kit/issues/193)

The integration tests are fairly fragile, and require that you have the correct setup for the screenshot testing to match the expected output. When in doubt, test results from Travis CI should be considered as correct.
