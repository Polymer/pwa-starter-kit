let webpack = require('webpack');
var path = require('path');

module.exports = {
  entry: [
    '../src/my-app.js'
  ],
  output: {
    path: path.resolve(__dirname, '../build'),
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {
          test: /src\/.+.js$/,
          loader: 'babel-loader',
          query: {
              presets: ['babel-preset-es2015'].map(require.resolve)
          }
      }
    ]
    }
};
