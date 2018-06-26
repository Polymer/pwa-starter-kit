const functions = require('firebase-functions');
const prpl = require('prpl-server');
const express = require('express');
const rendertron = require('rendertron-middleware');

const app = express();

/**
 * NOTE(keanulee): rendertron.makeMiddleware() doesn't work because the req
 * argument that Firebase Functions gives is based on a different URL (e.g.
 * https://us-central1-pwa-starter-kit.cloudfunctions.net/app/). This URL
 * cannot be rendered by Rendertron/browsers because static assets are not
 * available at this host. Instead, we re-implement the middlware so that it
 * renders the Firebase Hosting URL.
 */
const rendertronMiddleware = rendertron.makeMiddleware({
  proxyUrl: 'https://render-tron.appspot.com/render',
  injectShadyDom: true,
});

app.use((req, res, next) => {
  req.headers['host'] = 'pwa-starter-kit-4225c.firebaseapp.com';
  return rendertronMiddleware(req, res, next);
});

app.get('/*', prpl.makeHandler('./build', require('./build/polymer.json')));

exports.app = functions.https.onRequest(app);
