'use strict';

const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const babelConfig = require('./.babelrc');


module.exports = {
  bail: true,

  cache: true,
  
  devtool: 'source-map',
  
  entry: [
    'babel-polyfill',
    'normalize.css',
    path.join(__dirname, 'src', 'client', 'js', 'index.jsx'),
  ],
  
  module: {
    loaders: [
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract(
          'style-loader', '!css-loader?sourceMap&importLoaders=1!postcss-loader'
        ),
      },
      {
        test: /\.jsx$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: Object.assign({}, babelConfig, {
          cacheDirectory: true,
          presets: babelConfig.presets.concat('react'),
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
        require('postcss-sass-colors'),
        autoprefixer,
        require('cssnano'),
      ],
      cleaner: [autoprefixer({browsers: 'last 2 versions'})],
    };
  },

  plugins: [
    new ExtractTextPlugin(path.join('css', 'style.css')),
  ],

  resolve: {
    extensions: ['', '.js', '.jsx'],
  },
};
