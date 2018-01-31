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
const fs = require('fs');
const PNG = require('pngjs').PNG;
const pixelmatch = require('pixelmatch');

const currentDir = `${process.cwd()}/test/screenshots-current`;
const baselineDir = `${process.cwd()}/test/screenshots-baseline`;

describe('screenshot diffing', async function() {
  let polyserve, browser, page;

  before(async function() {
    polyserve = await startServer({port:4444, root:path.join(__dirname, '..')});

    // Create the test directory if needed.
    if (!fs.existsSync(currentDir)){
      fs.mkdirSync(currentDir);
    }
  });

  after(function(done) {
    polyserve.close(done);
  });

  beforeEach(async function() {
    browser = await puppeteer.launch();
    page = await browser.newPage();
  });

  afterEach(async function() {
    await browser.close();
  });

  it('/index.html looks correct', async function() {
    await takeAndCompareScreenshot(page, '', 'index');
  });
  it('/view1 looks correct', async function() {
    await takeAndCompareScreenshot(page, 'view1');
  });
  it('/view2 looks correct', async function() {
    await takeAndCompareScreenshot(page, 'view2');
  });
  it('/view3 looks correct', async function() {
    await takeAndCompareScreenshot(page, 'view3');
  });
  it('/404 looks correct', async function() {
    await takeAndCompareScreenshot(page, 'batmanNotAView');
  });
});

async function takeAndCompareScreenshot(page, route, fileName) {
  // If you didn't specify a file, use the name of the route.
  if (!fileName) {
    fileName = route;
  }
  await page.goto(`http://127.0.0.1:4444/${route}`);
  await page.screenshot({path: `${currentDir}/${fileName}.png`});
  await compareScreenshots(fileName);
}

function compareScreenshots(view) {
  return new Promise((resolve, reject) => {
    var img1 = fs.createReadStream(`${currentDir}/${view}.png`).pipe(new PNG()).on('parsed', doneReading);
    var img2 = fs.createReadStream(`${baselineDir}/${view}.png`).pipe(new PNG()).on('parsed', doneReading);

    var filesRead = 0;
    function doneReading() {
      // Wait until both files are read.
      if (++filesRead < 2) return;

      // The files should be the same size.
      expect(img1.width, 'image widths are the same').equal(img2.width);
      expect(img1.height, 'image heights are the same').equal(img2.height);

      // Do the visual diff.
      var diff = new PNG({width: img1.width, height: img2.height});
      var numDiffPixels = pixelmatch(img1.data, img2.data, diff.data, img1.width, img1.height, {threshold: 0.1});

      expect(numDiffPixels, 'it looks correct').equal(0);

      resolve();
    }
  });
}
