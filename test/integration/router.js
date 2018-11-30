/**
@license
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

const puppeteer = require('puppeteer');
const expect = require('chai').expect;
const {startServer} = require('polyserve');
const path = require('path');
const appUrl = 'http://127.0.0.1:4444';

describe('routing tests', function() {
  let polyserve, browser, page;

  before(async function() {
    polyserve = await startServer({port:4444, root:path.join(__dirname, '../..'), moduleResolution:'node'});
  });

  after((done) => polyserve.close(done));

  beforeEach(async function() {
    browser = await puppeteer.launch();
    page = await browser.newPage();
  });

  afterEach(() => browser.close());

  it('the page selector switches pages', async function() {
    await page.goto(`${appUrl}`);
    await page.waitForSelector('my-app', {visible: true});

    await testNavigation(page, 'view2', 'View Two');
    await testNavigation(page, 'view3', 'View Three');
    await testNavigation(page, 'view1', 'View One');
  });

  it('the page selector switches pages in a different way', async function() {
    await page.goto(`${appUrl}`);
    await page.waitForSelector('my-app', {visible: true});

    // Setup
    await page.evaluate(() => {
      window.deepQuerySelector = function(query) {
        const parts = query.split('::shadow');
        let el = document;
        for (let i = 0; i < parts.length; i++) {
          el = el.querySelector(parts[i]);
          if (i % 2 === 0) {
            el = el.shadowRoot;
          }
        }
        return el === document ? null : el;
      }
      console.log(window.deepQuerySelector);
    });

    await testNavigationInADifferentWay(page, 'view2', 'View Two');
    await testNavigationInADifferentWay(page, 'view3', 'View Three');
    await testNavigationInADifferentWay(page, 'view1', 'View One');
  });
});

async function testNavigation(page, href, linkText) {
  // Shadow DOM helpers.
  const getShadowRootChildProp = (el, childSelector, prop) => {
    return el.shadowRoot.querySelector(childSelector)[prop];
  };
  const doShadowRootClick = (el, childSelector) => {
    return el.shadowRoot.querySelector(childSelector).click();
  };

  const selector = `a[href="/${href}"]`;
  const shadowSelector = `a[href="/${href}"]`;

  // Does the link say the right thing?
  const myApp = await page.$('my-app');
  const myText = await page.evaluate(getShadowRootChildProp, myApp, selector, 'textContent');
  expect(await myText).equal(linkText);

  // Does the click take you to the right page?
  await page.evaluate(doShadowRootClick, myApp, selector);
  const newUrl = await page.evaluate('window.location.href')
  expect(newUrl).equal(`${appUrl}/${href}`);
}

async function testNavigationInADifferentWay(page, href, linkText) {
  const query = `my-app::shadow a[href="/${href}"]`;

  const linkHandle = await page.evaluateHandle((query) => window.deepQuerySelector(query), query);
  const text = await page.evaluate((el) => el.textContent, linkHandle);
  expect(text).equal(linkText);

  await page.evaluate((el) => el.click(), linkHandle);
  let newUrl = await page.evaluate('window.location.href')
  expect(newUrl).equal(`${appUrl}/${href}`);
}
