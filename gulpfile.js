const gulp = require('gulp');
const replace = require('gulp-replace');
const rename = require('gulp-rename');
const logger = require('gulplog');
const path = require('path');
const del = require('del');
const mergeStream = require('merge-stream');
const {forkStream, PolymerProject, addServiceWorker, HtmlSplitter, getOptimizeStreams} = require('polymer-build');
const projectConfig = require('./polymer.json');


/* ********** HELPERS ****************************************************** */

/**
 * Returns a promise that resolves when the stream ends,
 * or rejects when the stream throws an error
 */
const waitFor = (stream) => new Promise((resolve, reject) => {
  stream.on('end', resolve);
  stream.on('error', reject);
});

/**
 * Utility that allows to avoid loads of .pipe chains
 */
const pipeStreams = (streams) => Array.prototype.concat.apply([], streams)
  .reduce((a, b) => a.pipe(b));

/**
 * This helper function does basically the same things as the Polymer CLI
 * `build` command, but it also has some extra options to help us with some
 * special tasks (e.g. renaming the node_modules output folder).
 */
const build = async (options, polymerProject) => {
  const buildName = options.name || 'default';
  const buildDirectory = path.join(options.outputDir, buildName);
  const logPrefix = options.logPrefix || '';

  // Fork the two streams to guarentee we are working with clean copies of each
  // file and not sharing object references with other builds.
  const sourcesStream = forkStream(polymerProject.sources());
  const depsStream = forkStream(polymerProject.dependencies());

  const bundled = !!options.bundle;

  let buildStream = mergeStream(sourcesStream, depsStream);

  const compiledToES5 = (options.js === undefined) ?
    false :
    options.js.compile === true || options.js.compile === 'es5';
  if (compiledToES5) {
    buildStream = buildStream.pipe(polymerProject.addCustomElementsEs5Adapter());
  }

  if (bundled) {
    const bundlerOptions = {
      rewriteUrlsInTemplates: true
    };
    if (typeof options.bundle === 'object') {
      Object.assign(bundlerOptions, options.bundle);
    }
    buildStream = buildStream.pipe(polymerProject.bundler(bundlerOptions));
  }

  const htmlSplitter = new HtmlSplitter();

  buildStream = pipeStreams([
    buildStream,
    htmlSplitter.split(),

    getOptimizeStreams({
      html: options.html,
      css: options.css,
      js: {
        ...options.js,
        moduleResolution: polymerProject.config.moduleResolution,
      },
      entrypointPath: polymerProject.config.entrypoint,
      rootDir: polymerProject.config.root,
    }),

    htmlSplitter.rejoin(),
  ]);

  if (options.insertPrefetchLinks) {
    buildStream = buildStream.pipe(polymerProject.addPrefetchLinks());
  }

  buildStream.once('data', () =>
    logger.info(`${logPrefix}(${buildName}) Building...`));

  if (options.basePath) {
    let basePath = options.basePath === true ? buildName : options.basePath;
    if (!basePath.startsWith('/')) {
      basePath = '/' + basePath;
    }
    if (!basePath.endsWith('/')) {
      basePath = basePath + '/';
    }
    buildStream = buildStream.pipe(polymerProject.updateBaseTag(basePath));
  }

  if (options.addPushManifest) {
    buildStream = buildStream.pipe(polymerProject.addPushManifest());
  }

  if (options.nodeModulesName) {
    buildStream = pipeStreams([
      buildStream,
      // FIXME this replace isn't currenly working,
      // it MUST be fixed before carrying this branch forward
      replace(/node_nodules/, options.nodeModulesName),
      rename((path) =>
        path.dirname = path.dirname.replace(/node_modules/, options.nodeModulesName)),
    ]);
  }

  // Finish the build stream by piping it into the final build directory.
  buildStream = buildStream.pipe(gulp.dest(buildDirectory));

  // If a service worker was requested, parse the service worker config file
  // while the build is in progress. Loading the config file during the build
  // saves the user ~300ms vs. loading it afterwards.
  const swPrecacheConfigPath = path.resolve(
    polymerProject.config.root,
    options.swPrecacheConfig || 'sw-precache-config.js');
  let swConfig = null;
  if (options.addServiceWorker) {
    swConfig = require(swPrecacheConfigPath);
  }

  // There is nothing left to do, so wait for the build stream to complete.
  await waitFor(buildStream);

  if (options.addServiceWorker) {
    await addServiceWorker({
      buildRoot: buildDirectory,
      project: polymerProject,
      swPrecacheConfig: swConfig || undefined,
      bundled: bundled,
    });
  }

  logger.info(`${logPrefix}(${buildName}) Build complete!`);
};

/* ********** TASKS ******************************************************** */

/**
 * Cleans the static build directory (<project folder>/build)
 */
gulp.task('clean:static', () =>
  del`build`);

/**
 * Cleans the PRPL server build directory (<project folder>/server/build)
 */
gulp.task('clean:prpl-server', () =>
  del`server/build`);

/**
 * Builds a static version of the PWA that can be used on any hosting service
 */
gulp.task('build:static', () => {
  const project = new PolymerProject(projectConfig);
  return Promise.all(projectConfig.builds.map((buildConfig) =>
    build({
      ...buildConfig,
      outputDir: 'build',
      logPrefix: '[build:static] ',
    }, project)));
});

/**
 * Builds the PRPL-server-ready version of the PWA, auto setting the base path
 * and renaming the node_modules folder, otherwise services like App Engine won't
 * upload it
 */
gulp.task('build:prpl-server', () => {
  const autoBasePathedConfig = {
    ...projectConfig,
    builds: projectConfig.builds.map((build) => ({
      ...build,
      basePath: true,
    })),
  };
  const project = new PolymerProject(autoBasePathedConfig);
  return Promise.all(autoBasePathedConfig.builds.map((buildConfig) =>
    build({
      ...buildConfig,
      outputDir: 'server/build',
      nodeModulesName: 'node_assets',
      logPrefix: '[build:prpl-server] ',
    }, project)));
});

/**
 * Cleans and builds both the static and the PRPL-server-ready versions of the PWA
 * in parallel
 */
gulp.task('build', gulp.parallel(
  gulp.series('clean:static', 'build:static'),
  gulp.series('clean:prpl-server', 'build:prpl-server'),
));
