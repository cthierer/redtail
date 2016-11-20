
module.exports = {
  entry: './src/client.js',
  output: {
    path: './dist/scripts',
    filename: 'client.js'
  },
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
      }
    ]
  }
}
