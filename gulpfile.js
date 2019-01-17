/**
@license
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

const gulp = require('gulp');
const rename = require('gulp-rename');
const replace = require('gulp-replace');
const del = require('del');
const {forkStream, getOptimizeStreams, HtmlSplitter, PolymerProject} = require('polymer-build');
const mergeStream = require('merge-stream');

/**
 * Cleans the prpl-server build in the server directory.
 */
gulp.task('prpl-server:clean', () => {
  return del('server/build');
});

/**
 * Copies the prpl-server build to the server directory while renaming the
 * node_modules directory so services like App Engine will upload it.
 */
gulp.task('prpl-server:build', () => {
  const pattern = 'node_modules';
  const replacement = 'node_assets';

  return gulp.src('build/**')
    .pipe(rename(((path) => {
      path.basename = path.basename.replace(pattern, replacement);
      path.dirname = path.dirname.replace(pattern, replacement);
    })))
    .pipe(replace(pattern, replacement))
    .pipe(gulp.dest('server/build'));
});

gulp.task('prpl-server', gulp.series(
  'prpl-server:clean',
  'prpl-server:build'
));

function bundleStream(polymerProject) {
  const sourcesStream = polymerProject.sources();
  const depsStream = polymerProject.dependencies();
  return mergeStream(sourcesStream, depsStream)
    .pipe(polymerProject.bundler());
}

function optimizeStream(stream, options) {
  const htmlSplitter = new HtmlSplitter();
  const streams = getOptimizeStreams(options);
  return streams.reduce((a, b) => a.pipe(b), stream.pipe(htmlSplitter.split()))
    .pipe(htmlSplitter.rejoin());
}

function renameStream(stream) {
  const pattern = 'node_modules';
  const replacement = 'node_assets';
  return stream
    .pipe(rename(((path) => {
      path.basename = path.basename.replace(pattern, replacement);
      path.dirname = path.dirname.replace(pattern, replacement);
    })))
    .pipe(replace(pattern, replacement))
}

gulp.task('build:static', () => {
  const config = require('./polymer.json');
  const polymerProject = new PolymerProject(config);
  const bundledStream = bundleStream(polymerProject);
  const staticStream = optimizeStream(bundledStream, {
      entrypointPath: polymerProject.config.entrypoint,
      rootDir: polymerProject.config.root,
      "js": {
        "compile": "es5",
        "minify": true,
        "transformModulesToAmd": true
      },
      "css": {
        "minify": true
      },
      "html": {
        "minify": true
      },
    })
    .pipe(polymerProject.addCustomElementsEs5Adapter());
  return renameStream(staticStream).pipe(gulp.dest('public'));
});

gulp.task('build', () => {
  const config = require('./polymer.json');
  const polymerProject = new PolymerProject(config);
  const bundledStream = bundleStream(polymerProject);
  const esmStream = optimizeStream(forkStream(bundledStream), {
      entrypointPath: polymerProject.config.entrypoint,
      rootDir: polymerProject.config.root,
      "js": {
        "minify": true
      },
      "css": {
        "minify": true
      },
      "html": {
        "minify": true
      },
    })
    .pipe(polymerProject.updateBaseTag('/esm-bundled/'));
  const es6Stream = optimizeStream(forkStream(bundledStream), {
      entrypointPath: polymerProject.config.entrypoint,
      rootDir: polymerProject.config.root,
      "js": {
        "compile": "es2015",
        "minify": true,
        "transformModulesToAmd": true
      },
      "css": {
        "minify": true
      },
      "html": {
        "minify": true
      },
    })
    .pipe(polymerProject.updateBaseTag('/es6-bundled/'));
  const es5Stream = optimizeStream(forkStream(bundledStream), {
      entrypointPath: polymerProject.config.entrypoint,
      rootDir: polymerProject.config.root,
      "js": {
        "compile": "es5",
        "minify": true,
        "transformModulesToAmd": true
      },
      "css": {
        "minify": true
      },
      "html": {
        "minify": true
      },
    })
    .pipe(polymerProject.addCustomElementsEs5Adapter())
    .pipe(polymerProject.updateBaseTag('/es5-bundled/'));
  return mergeStream(
      renameStream(esmStream).pipe(gulp.dest('server/build/esm-bundled')),
      renameStream(es6Stream).pipe(gulp.dest('server/build/es6-bundled')),
      renameStream(es5Stream).pipe(gulp.dest('server/build/es5-bundled')),
      gulp.src('polymer.json').pipe(gulp.dest('server/build'))
    );
});
