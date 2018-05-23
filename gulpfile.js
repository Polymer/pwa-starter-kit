const gulp = require('gulp');
const del = require('del');
const { exec } = require('child_process');
const { renameSync: move } = require('fs');
const renamer = require('renamer');
const replace = require('replace');

/**
 * Cleans the PRPL server build directory (<project folder>/server/build)
 */
gulp.task('clean:prpl-server', () =>
  del`server/build`);

/**
 * Builds a static version of the PWA that can be used on any hosting service
 */
gulp.task('build:static', (cb) =>
  // Build the project using Polymer CLI
  exec('polymer build', cb));

/**
 * Builds the PRPL-server-ready version of the PWA, auto setting the base path
 * and renaming the node_modules folder, otherwise services like App Engine won't
 * upload it
 */
gulp.task('build:prpl-server', (cb) => {
  // Build the project using Polymer CLI
  exec('polymer build --auto-base-path', (err) => {
    if (err) {
      cb(err);
    }

    // Move the CLI output to `server/`
    move('build', 'server/build');

    // Rename all the `node_modules` folders to `node_assets`
    const results = renamer.replace({
      find: 'node_modules',
      replace: 'node_assets',
      files: renamer.expand('server/build/**').filesAndDirs,
    });
    const resultsTokens = renamer.replaceIndexToken(results);
    renamer.rename(resultsTokens);

    // Replace all the occurrencies of `node_modules` to `node_assets` in files
    replace({
      regex: 'node_modules',
      replacement: 'node_assets',
      paths: ['server/build'],
      recursive: true,
      silent: true,
    });

    cb();
  });
});

/**
 * Cleans and builds both the static and the PRPL-server-ready versions of the PWA
 */
gulp.task('build', gulp.series(
  'clean:prpl-server',
  'build:prpl-server',
  'build:static',
));
