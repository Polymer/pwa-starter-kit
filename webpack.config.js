/**
@license
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { htmlTransform } = require('polymer-build/lib/html-transform');
const { addCustomElementsEs5Adapter } = require('polymer-build/lib/custom-elements-es5-adapter');
const WorkboxWebpackPlugin = require('workbox-webpack-plugin');


/**
 * Set `USE_BABEL` to false if Babel transpilation isn't needed (i.e. all your
 * target browsers support all the language features used in your source code).
 */
const USE_BABEL = false;


class WebcomponentsjsHtmlWebpackPlugin {
  apply(compiler) {
    compiler.hooks.compilation.tap('WebcomponentsjsHtmlWebpackPlugin', (compilation) => {
      compilation.hooks.htmlWebpackPluginAfterHtmlProcessing.tapAsync(
        'WebcomponentsjsHtmlWebpackPlugin',
        (data, cb) => {
          // Source uses modules, but Webpack will output regular script.
          data.html = data.html.replace(' type="module"', '');

          data.html = htmlTransform(data.html, {
            js: {
              minify: true
            },
            minifyHtml: true,
            injectRegeneratorRuntime: USE_BABEL
          });

          if (USE_BABEL) {
            data.html = addCustomElementsEs5Adapter(data.html);
          }
  
          cb(null, data);
        }
      );
    });
  }
}

module.exports = {
  entry: {
    'src/components/my-app': './src/components/my-app.js'
  },
  devServer: {
    historyApiFallback: true
  },
  mode: 'production',
  module: {
    rules: USE_BABEL ? [
      {
        test: /\.js$/,
        exclude: /webcomponentsjs/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: ['@babel/plugin-syntax-dynamic-import']
          }
        }
      }
    ] : []
  },
  plugins: [
    new CopyWebpackPlugin([
      { from: 'images', to: 'images' },
      { from: 'node_modules/@webcomponents/webcomponentsjs', to: 'node_modules/@webcomponents/webcomponentsjs' },
      { from: 'manifest.json', to: 'manifest.json' },
    ]),
    new HtmlWebpackPlugin({
      chunksSortMode: 'none',
      inject: false,
      template: 'index.html'
    }),
    new WebcomponentsjsHtmlWebpackPlugin(),
    new WorkboxWebpackPlugin.GenerateSW({
      include: ['index.html', 'manifest.json', /^src\/.*.js$/],
      exclude: [],
      navigateFallback: 'index.html',
      swDest: 'service-worker.js',
      clientsClaim: true,
      skipWaiting: true,
      runtimeCaching: [
        {
          urlPattern: /\/@webcomponents\/webcomponentsjs\//,
          handler: 'staleWhileRevalidate'
        },
        {
          urlPattern: /^https:\/\/fonts.gstatic.com\//,
          handler: 'staleWhileRevalidate'
        }
      ]
    })
  ]
};
