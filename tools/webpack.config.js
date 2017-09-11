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
          loader: 'babel-loader',
          query: {
              presets: ['babel-preset-es2015', 'babel-preset-es2016', 'babel-preset-es2017'].map(require.resolve)
          }
      }
    ]
  },
  resolve: {
    extensions: ['.js'],
    modules: [
      '../src',
      '../node_modules'
    ]
  },
};
