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

describe('👀 page screenshots are correct', async function() {
  let polyserve, browser, page;

  before(async function() {
    polyserve = await startServer({port:4444, root:path.join(__dirname, '..')});

    // Create the test directory if needed.
    if (!fs.existsSync(currentDir)){
      fs.mkdirSync(currentDir);
    }
    // And it's subdirectories.
    if (!fs.existsSync(`${currentDir}/wide`)){
      fs.mkdirSync(`${currentDir}/wide`);
    }
    if (!fs.existsSync(`${currentDir}/narrow`)){
      fs.mkdirSync(`${currentDir}/narrow`);
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

  // Note: uncomment this function if you need to regenerate *all*
  // your baseline tests.
  // describe('regenerate screenshots', async function() {
  //   it('regenerates screenshots', async function() {
  //     await generateBaselineScreenshots(page);
  //   });
  // });

  describe('wide screen', async function() {
    beforeEach(async function() {
      page.setViewport({width: 800, height: 600});
    });

    it('/index.html', async function() {
      await takeAndCompareScreenshot(page, '', 'wide');
    });
    it('/view1', async function() {
      await takeAndCompareScreenshot(page, 'view1', 'wide');
    });
    it('/view2', async function() {
      await takeAndCompareScreenshot(page, 'view2', 'wide');
    });
    it('/view3', async function() {
      await takeAndCompareScreenshot(page, 'view3', 'wide');
    });
    it('/404', async function() {
      await takeAndCompareScreenshot(page, 'batmanNotAView', 'wide');
    });
  });

  describe('narrow screen', async function() {
    beforeEach(async function() {
      page.setViewport({width: 375, height: 667});
    });

    it('/index.html', async function() {
      await takeAndCompareScreenshot(page, '', 'narrow');
    });
    it('/view1', async function() {
      await takeAndCompareScreenshot(page, 'view1', 'narrow');
    });
    it('/view2', async function() {
      await takeAndCompareScreenshot(page, 'view2', 'narrow');
    });
    it('/view3', async function() {
      await takeAndCompareScreenshot(page, 'view3', 'narrow');
    });
    it('/404', async function() {
      await takeAndCompareScreenshot(page, 'batmanNotAView', 'narrow');
    });
  });
});

async function takeAndCompareScreenshot(page, route, filePrefix) {
  // If you didn't specify a file, use the name of the route.
  let fileName = filePrefix + '/' + (route ? route : 'index');

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

      expect(numDiffPixels, 'number of different pixels').equal(0);

      resolve();
    }
  });
}

async function generateBaselineScreenshots(page) {
  // Wide screen.
  page.setViewport({width: 800, height: 600});
  await page.goto('http://127.0.0.1:4444/');
  await page.screenshot({path: `${baselineDir}/wide/index.png`});
  for (var i = 1; i <= 3; i++) {
    await page.goto(`http://127.0.0.1:4444/view${i}`);
    await page.screenshot({path: `${baselineDir}/wide/view${i}.png`});
  }
  await page.goto('http://127.0.0.1:4444/batmanNotAView');
  await page.screenshot({path: `${baselineDir}/wide/batmanNotAView.png`});

  // Narrow screen.
  page.setViewport({width: 375, height: 667});
  await page.goto('http://127.0.0.1:4444/');
  await page.screenshot({path: `${baselineDir}/narrow/index.png`});
  for (var i = 1; i <= 3; i++) {
    await page.goto(`http://127.0.0.1:4444/view${i}`);
    await page.screenshot({path: `${baselineDir}/narrow/view${i}.png`});
  }
  await page.goto('http://127.0.0.1:4444/batmanNotAView');
  await page.screenshot({path: `${baselineDir}/narrow/batmanNotAView.png`});
}
