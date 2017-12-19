module.exports = {
  entry: [
    'babel-polyfill',
    './src/index.js'
  ],

  output: {
    filename: 'dist/bundle.js'
  },

  target: 'node',

  module: {
    loaders: [{
      test: /\.js?$/,
      exclude: /(node_modules)/,
      loader: 'babel-loader'
    }]
  }
};
