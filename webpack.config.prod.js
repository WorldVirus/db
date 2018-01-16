"use strict";

module.exports = {
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
    }
};