'use strict';

const path = require('path');

const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const babelConfig = require('./.babelrc');


const config = {
  bail: true,

  cache: true,

  devtool: 'source-map',

  entry: [
    'babel-polyfill',
    'whatwg-fetch',
    'normalize.css',
    path.join(__dirname, 'node_modules', 'font-awesome', 'css', 'font-awesome.css'),
    path.join(__dirname, 'src', 'client', 'index.jsx'),
  ],

  module: {
    loaders: [
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract(
          'style-loader', '!css-loader?sourceMap&importLoaders=1&-url!postcss-loader'
        ),
      },
      {
        test: /\.jsx$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: Object.assign({}, babelConfig, {
          cacheDirectory: true,
          presets: [...babelConfig.presets, 'react'],
        }),
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: Object.assign({}, babelConfig, {
          cacheDirectory: true,
        }),
      },
    ],
  },

  output: {
    path: path.join(__dirname, 'dist', 'client', 'static'),
    publicPath: 'static/',
    filename: path.join('js', 'whodunnit.min.js'),
    chunkFilename: '[chunkHash].js',
    sourceMapFileName: '[name].map',
  },

  postcss(webpack) {
    const autoprefixer = require('autoprefixer');

    return {
      defaults: [
        require('postcss-import')({
          addDependencyTo: webpack,
        }),
        require('postcss-simple-vars'),
        require('postcss-nested'),
        require('postcss-color-function'),
        autoprefixer,
        require('cssnano'),
      ],
      cleaner: [autoprefixer({browsers: 'last 2 versions'})],
    };
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      }
    }),
    new ExtractTextPlugin(path.join('css', 'style.min.css')),
  ],

  resolve: {
    extensions: ['', '.js', '.jsx'],
  },
};

if (process.env.NODE_ENV === 'production') {
  config.plugins.push(
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin()
  );
}

module.exports = config;
