const webpack = require('webpack');
const CommonsChunkPlugin = require('webpack/lib/optimize/CommonsChunkPlugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const path = require('path');

const extractCSS = new ExtractTextPlugin('../css/[name].bundle.css');
const commonChunk = new CommonsChunkPlugin({
  name: 'commons',
  filename: 'commons.bundle.js',
  chunks: ['home', 'theme', '404']
});

const plugins = [
  extractCSS,
  commonChunk,
  new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /fr|en|es|it/)
];

if (process.env.NODE_ENV && process.env.NODE_ENV === 'production') {
  plugins.push(new webpack.optimize.DedupePlugin());

  plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      minimize: true,
      mangle: true,
      output: {
        comments: false
      },
      compress: {
        warnings: false
      }
    })
  );
}

module.exports = {
  devtool: 'source-map',
  plugins,
  context: path.resolve(__dirname, 'public'),
  entry: {
    home: './js/home',
    theme: './js/theme',
    404: './js/404'
  },
  output: {
    path: path.resolve(__dirname, 'public', 'js'),
    filename: '[name].bundle.js'
  },
  resolve: {
    alias: {
      collection: path.resolve(__dirname, 'public', 'js', 'collection'),
      const: path.resolve(__dirname, 'public', 'js', 'const'),
      core: path.resolve(__dirname, 'public', 'js', 'core'),
      helper: path.resolve(__dirname, 'public', 'js', 'helper'),
      model: path.resolve(__dirname, 'public', 'js', 'model'),
      router: path.resolve(__dirname, 'public', 'js', 'router'),
      templates: path.resolve(__dirname, 'public', 'js', 'templates'),
      view: path.resolve(__dirname, 'public', 'js', 'view'),
      ui: path.resolve(__dirname, 'public', 'js', 'ui')
    }
  },
  module: {
    rules: [
      {
        test: /public\/js\/.*\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        // leaflet-omnivore depends on dsv@0.0.3
        // dsv@0.0.3 is deprecated and npm replaces it by d3-dsv
        // d3-dsv depends on fs, which is not available in a web context
        // So... There...
        test: /node_modules\/dsv/,
        loader: 'transform-loader?brfs'
      },
      {
        test: /\.css$/,
        loader: extractCSS.extract(['css-loader'])
      },
      {
        test: /\.less$/,
        loader: extractCSS.extract(['css-loader', 'less-loader'])
      },
      {
        test: /\.json$/,
        loader: 'json-loader'
      },
      {
        test: /\.svg$/,
        include: /img/,
        loader: 'raw-loader'
      },
      {
        test: /\.ejs$/,
        loader: 'ejs-loader'
      },
      {
        test: /\.png$/,
        loader: 'file-loader?name=../assets/[name].[ext]'
      },
      {
        test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
        loader:
          'file-loader?mimetype=application/font-woff&name=../assets/[name].[ext]'
      },
      {
        test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
        loader:
          'file-loader?mimetype=application/font-woff2&name=../assets/[name].[ext]'
      },
      {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        loader:
          'file-loader?mimetype=application/octet-stream&name=../assets/[name].[ext]'
      },
      {
        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        loader:
          'file-loader?mimetype=application/vnd.ms-fontobject&name=../assets/[name].[ext]'
      },
      {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        exclude: /img/,
        loader: 'file-loader?mimetype=image/svg+xml&name=../assets/[name].[ext]'
      },
      {
        test: require.resolve('jquery'),
        loader: 'expose-loader?$!expose-loader?jQuery'
      },
      {
        test: require.resolve('underscore'),
        loader: 'expose-loader?_'
      },
      {
        test: require.resolve('leaflet'),
        loader: 'expose-loader?L'
      }
    ]
  }
};
