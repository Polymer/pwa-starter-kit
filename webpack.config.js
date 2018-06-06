const HtmlWebpackPlugin = require('html-webpack-plugin');

const es2015 = true;

class WebcomponentsjsHtmlWebpackPlugin {
  apply(compiler) {
    compiler.hooks.compilation.tap('WebcomponentsjsHtmlWebpackPlugin', (compilation) => {
      compilation.hooks.htmlWebpackPluginAfterHtmlProcessing.tapAsync(
        'WebcomponentsjsHtmlWebpackPlugin',
        (data, cb) => {
          // Webpack will output normal scripts (not ES modules).
          data.html = data.html.replace(' type="module"', '');
  
          // Inject custom-elements-es5-adapter if es2015.
          if (es2015) {
            const webcomponentsjsBasePath = `node_modules/@webcomponents/webcomponentsjs/`;
            const loaderFragment = `<script src="${webcomponentsjsBasePath}webcomponents-loader.js"></script>`;
            const es5AdapterFragment = `<script>if (!window.customElements) { document.write('<!--'); }</script>
<script type="text/javascript" src="${webcomponentsjsBasePath}custom-elements-es5-adapter.js"></script>
<!--! do not remove -->`;
            data.html = data.html.replace(loaderFragment, `${es5AdapterFragment}
${loaderFragment}`);
          }
  
          cb(null, data)
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
  mode: 'production',
  module: {
    rules: es2015 ? [
      {
        test: /\.js$/,
        exclude: /webcomponentsjs/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              'babel-preset-es2015'
            ],
            plugins: [
              'syntax-dynamic-import',
              'transform-object-rest-spread'
            ]
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
