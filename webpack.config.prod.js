"use strict";
const webpack = require('webpack');
const merge = require('webpack-merge');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = merge( {
    entry:
        "./scripts/MainClassStarterApp.js",
    output: {
        filename: "dist/index.js"
    },

    target: 'node',

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
