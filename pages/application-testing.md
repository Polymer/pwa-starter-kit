---
layout: post
title: Application testing
permalink: /application-testing
---
It is good to test your apps. This page will take you through the testing setup we have provided.

## Running tests
There are many ways to test your app, and many frameworks in which you can write your tests. We provided samples for both unit tests and integration tests below -- the integration tests use [Puppeteer](https://github.com/GoogleChrome/puppeteer), and the unit tests use [WCT](https://github.com/Polymer/web-component-tester). As you modify and the customize your app, make sure you also update the tests :)

The test folder has the following structure:
```
test
├── integration
|   └── screenshots-baseline
|   └── router.js
|   └── visual.js
├── unit
|   └── index.html
|   └── counter-element.js
|   └── views-a11y.js
```
Where
- `screenshots-baseline` is the golden ("correct") set of screenshots for the app, as used in visual testing.
- `router.js` tests that the router is working correctly, and clicking on the nav links actually does a navigation.
- `visual.js` does a visual diffing of what your application currently looks like, and what it _should_ look like according to the screenshots in `screenshots-baseline`.
- `counter-element.js` is a WCT unit test that tests the simple counter element used in the first Redux demo.
- `views-a11y.js` is a WCT unit test that uses [axe-core](https://github.com/dequelabs/axe-core) to test that each of the application's views are accessible.

You can run the entire test suite via
```
npm test
```

Or a particular test suite via
```
npm run test:unit
npm run test:integration
```

## Unit testing

### Basic testing
We use [WCT](https://github.com/Polymer/tools/tree/master/packages/web-component-tester) to run unit tests. WCT comes pre-packaged with `<test-fixture>`, an element that defines a template of content and copies a clean, new instance of that content into each test suite (more information [here](https://www.polymer-project.org/3.0/docs/tools/tests#test-fixtures)). To add a new unit test to the suite:
- Create a new file under `test/unit/` (or just copy and rename `test/unit/counter-element` for a starting point.
- Add the test to the WCT suite, in `test/unit/index.html`:

```js
WCT.loadSuites([
  ...
  // Load 'my-new-test.html' test suite, using native shadow dom:
  'my-new-test.html',
  // Load 'my-new-test.html' test suite, using shadydom
  'my-new-test.html?wc-shadydom=true&wc-ce=true',
]);
```
- Once you've added the new tests to this test suite, you can run the unit tests via
```
npm run test:unit
```

By default, the tests will be run on all of your local browsers (note that if you're on a Mac OS machine, you might have to [enable remote automation](https://webkit.org/blog/6900/webdriver-support-in-safari-10/) in Safari from the "Develop" menu for this to work correctly). If you want to configure the browsers used for testing, you can use the `-l` command line argument:

```
npm run test:unit -l chrome -l firefox
```

For more information on writing unit tests with WCT, check out the [testing documentation](https://www.polymer-project.org/3.0/docs/tools/tests#overview) or the [WCT documentation](https://github.com/Polymer/tools/tree/master/packages/web-component-tester#test-fixture).

### A11y testing
[Axe-core](https://github.com/dequelabs/axe-core) is a library that automatically audits your HTML for accessibility violations. In order to use this more easily inside of unit tests, we've created a small wrapper, [`axe-report.js`](https://github.com/Polymer/pwa-helpers#axe-reportjs), that returns an `Error` containing all the violations. You can use this to unit test a [specific element](https://github.com/Polymer/pwa-starter-kit/blob/master/test/unit/counter-element.html#L72) or a [whole page](https://github.com/Polymer/pwa-starter-kit/blob/master/test/unit/views-a11y.html) as well. If you already have a `WCT` unit test set up to test the functionality of an element `el`, then you can also add an a11y test for it via:
```js
import {axeReport} from '../axe-report.js';
suite('my-element tests', function() {
  test('a11y', function() {
    const el = fixture('some-fixture');
    return axeReport(el);
  });
});
```

### Setting up Travis
By default, `npm test` runs the tests on the command line. However, you can set up a continuous integration server,
like [Travis](https://travis-ci.org/), to run the tests every time a new commit is made.

Before you do anything, make sure you've set up Travis on your Github repository according to the [Getting Started](https://docs.travis-ci.com/user/getting-started/) guide, including flipping your repo "on" on your [Travis profile page](https://travis-ci.org/profile)

The `pwa-starter-kit` Travis config lives in `.travis.yml`, and has a couple of different configurations in its matrix
- `os: osx` is a macOS build, which runs the integration tests. This is because in order to match, the baseline tests needs to be ran on the same OS as the tests (or else you're likely to run into web font problems). On our team, we generated the screenshots on a macOS machine, so it makes sense the tests are setup in the same way.
- `os: linux` runs the unit tests on Firefox/Chrome.
- [SauceLabs](https://saucelabs.com/) testing for browsers that aren't available on Travis, such as Edge.

To trigger your first continuous integration test, push a new commit to a branch.

### SauceLabs testing
At the moment, Travis CI only has Mac OS and Linux VMs, which means you need to use a separate third-party service to automate testing on Microsoft browsers. We use [SauceLabs](https://saucelabs.com/) for this, and in order to set it up on Travis, you need to include some private keys in the [.travis.yml](https://github.com/Polymer/pwa-starter-kit/blob/master/.travis.yml#L20) file (see the [SauceConnect docs](https://docs.travis-ci.com/user/sauce-connect/), [encrypted variables docs](https://docs.travis-ci.com/user/environment-variables#Defining-encrypted-variables-in-.travis.yml)). If you don't want to use SauceLabs at all, delete [this line](https://github.com/Polymer/pwa-starter-kit/blob/master/.travis.yml#L19) and [this section](https://github.com/Polymer/pwa-starter-kit/blob/master/.travis.yml#L20) from the configuration file.

## Integration testing with Puppeteer
[Puppeteer](https://github.com/GoogleChrome/puppeteer) is an `npm` library that lets you control Chrome. It makes it really easy to do things like click on particular elements in the page, wait until certain elements are loaded, and take screenshots. Because it only runs in Chrome, we're only including it as an easy way to do basic integration testing -- making sure that the basics of your app don't break in between commits.

### Router tests
The router tests (in `test/integration/router.js`) provide you with a starting point for using Puppeteer to interact with your page. They show you how you can find a particular node in a shadow root (like the navigation links), and interact with it (in particular, by clicking on it).

We've provided two different examples of doing the same thing (clicking on a node): by injecting a "deep" query selector into your testing page, and using that to find a particular node, or by using the Puppeteer API to target the node on the test side.

### Screenshot testing
Another thing that is useful to test is seeing if the app has changed visually. The examples we've provided test the layout of the app in both wide and narrow screen viewports (since the layout changes). If you want to add a new kind of visual test, you should add a new test suite, similar to [this one](https://github.com/Polymer/pwa-starter-kit/blob/master/test/integration/visual.js#L50), where in the `beforeEach` method you would use Puppeteer methods (similar to the code in the `router.js` tests) to set up the screenshot: clicking on some elements, focusing inputs, submitting forms, etc.

The "golden" (or baseline) screenshots are generated by the [`regenerate-baseline.js`](https://github.com/Polymer/pwa-starter-kit/blob/master/test/integration/screenshots-baseline/regenerate.js) script, which you can run with the `npm run test:regenerate_screenshots` command. If you want to test new parts of the app (for example, a mobile layout with the drawer open), make sure that you add both a new function to generate the screenshot with a similar set up as your test.

Note that if you run `pwa-starter-kit`'s screenshot tests fresh after cloning the repo, they might fail: this is because the checked in baseline screenshots are rendered on a MacOS machine, and if you're running the tests on a different platform, the app might render slightly differently (most likely due to the font metrics not being identical). You should re-generate the baseline screenshots in this case, and then try the test again.
