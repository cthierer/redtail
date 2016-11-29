/* eslint-disable import/no-extraneous-dependencies */
const webpack = require('webpack')
const url = require('url')
const config = require('config')

const apiUrl = url.format(config.get('redtail.api_base'))
const configPath = config.get('redtail.paths.config')
const fullUrl = apiUrl.endsWith('/') ? apiUrl.substring(0, apiUrl.length - 1) : apiUrl
const configUrl = `${fullUrl}${configPath}`

module.exports = {
  entry: './src/client.js',
  output: {
    path: './dist/scripts',
    filename: 'client.js'
  },
  target: 'web',
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015', 'async-to-bluebird'],
          plugins: ['transform-runtime'],
          babelrc: false
        }
      },
      {
        test: /\.json$/,
        loader: 'json-loader'
      },
      {
        test: /client\.js$/,
        loader: 'string-replace',
        exclude: /node_modules/,
        query: {
          search: 'API_CONFIG_URL',
          replace: configUrl
        }
      }
    ]
  },
  plugins: [
    new webpack.ProvidePlugin({
      jQuery: 'jquery',
      $: 'jquery',
      'window.Tether': 'tether'
    })
  ],
  node: {
    fs: 'empty'
  }
}
