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
const appUrl = 'http://127.0.0.1:4444';

describe('screenshot diffing', async function() {
  let polyserve, browser, page;

  before(async function() {
    polyserve = await startServer({port:4444, root:path.join(__dirname, '..')});
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

  it('all views look the same', async function() {
    const dir = `${process.cwd()}/test/screenshots-current`;
    const baselineDir = `${process.cwd()}/test/screenshots-baseline`;
    if (!fs.existsSync(dir)){
      fs.mkdirSync(dir);
    }

    // See that each route loads correctly.
    await page.goto(`${appUrl}`);
    await page.screenshot({path: `${dir}/index.png`});

    for (let i = 1; i <= 3; i++) {
      await page.goto(`${appUrl}/view${i}`);
      await page.screenshot({path: `${dir}/view${i}.png`});

      // Compare this screenshot with its baseline.
      var filesRead = 0;
      var thisImg = fs.createReadStream(`${dir}/view${i}.png`).pipe(new PNG()).on('parsed', doneReading);
      var baselineImg = fs.createReadStream(`${baselineDir}/view${i}.png`).pipe(new PNG()).on('parsed', doneReading);

      function doneReading() {
        // Wait until both files are read;
        if (++filesRead < 2) return;

        // The files should be the same size.
        expect(thisImg.width, 'image widths are the same').equal(baselineImg.width);
        expect(thisImg.height, 'image heights are the same').equal(baselineImg.height);

        // Visual diff
        var diff = new PNG({width: thisImg.width, height: thisImg.height});
        var numDiffPixels = pixelmatch(thisImg.data, baselineImg.data, diff.data, thisImg.width, thisImg.height, {threshold: 0.1});

        expect(numDiffPixels, `view${i}.png looks correct`).equal(0);
      }
    }
  });
});
