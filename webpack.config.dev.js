module.exports = {
  entry: [
    'babel-polyfill',
    './src/index.js'
  ],

  output: {
    filename: 'built/bundle.js'
  },

  target: 'node',
  watch: true,

  module: {
    loaders: [{
      test: /\.js?$/,
        exclude: /(node_modules|bower_components)/,
      loader: 'babel-loader'
    }]
  }
};
