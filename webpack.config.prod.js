"use strict";
const webpack = require('webpack');
const merge = require('webpack-merge');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = merge( {
    entry:[
        'babel-polyfill',
        "./scripts/MainClassStarterApp.js"],
    output: {
        filename: "dist/index.js"
    },

    target: 'node',

    module: {
        loaders: [{
            test: /\.js?$/,
            exclude: /(node_modules)/,
            loader: 'babel-loader'
        }]
    },
    devtool: 'source-map',
    plugins: [
        new UglifyJSPlugin({
            sourceMap: true
        }),
           new webpack.DefinePlugin({
                   'process.env.NODE_ENV': JSON.stringify('production')
     })
]
})
