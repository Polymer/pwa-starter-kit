const HtmlWebpackPlugin = require('html-webpack-plugin');
const { htmlTransform } = require('polymer-build/lib/html-transform');
const { addCustomElementsEs5Adapter } = require('polymer-build/lib/custom-elements-es5-adapter');


/**
 * Set `USE_BABEL` to false if Babel transpilation isn't needed (i.e. all your
 * target browsers support all the language features used in your source code).
 */
const USE_BABEL = true;


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
    'node_modules/@webcomponents/webcomponentsjs/custom-elements-es5-adapter': '@webcomponents/webcomponentsjs/custom-elements-es5-adapter.js',
    'node_modules/@webcomponents/webcomponentsjs/webcomponents-bundle': '@webcomponents/webcomponentsjs/webcomponents-bundle.js',
    'node_modules/@webcomponents/webcomponentsjs/webcomponents-loader': '@webcomponents/webcomponentsjs/webcomponents-loader.js',
    'node_modules/@webcomponents/webcomponentsjs/bundles/webcomponents-ce': '@webcomponents/webcomponentsjs/bundles/webcomponents-ce.js',
    'node_modules/@webcomponents/webcomponentsjs/bundles/webcomponents-sd': '@webcomponents/webcomponentsjs/bundles/webcomponents-sd.js',
    'node_modules/@webcomponents/webcomponentsjs/bundles/webcomponents-sd-ce': '@webcomponents/webcomponentsjs/bundles/webcomponents-sd-ce.js',
    'node_modules/@webcomponents/webcomponentsjs/bundles/webcomponents-sd-ce-pf': '@webcomponents/webcomponentsjs/bundles/webcomponents-sd-ce-pf.js',
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
    new HtmlWebpackPlugin({
      chunksSortMode: 'none',
      inject: false,
      template: 'index.html'
    }),
    new WebcomponentsjsHtmlWebpackPlugin()
  ]
};
