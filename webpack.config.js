'use strict';

var path = require('path');
var webpack = require('webpack');
let externals = _externals();
module.exports = {
    mode: 'production',
    entry: './build/server.js',
    externals: externals,
    target: 'node',
    output: {
        path: path.resolve(__dirname, 'dist/'),
        filename: 'server.bundle.js'
    },
    node: {
        __dirname: true
    },
    module: {
        rules: [
            {
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [['@babel/preset-env', {
                            "targets": {
                                "node": true
                            }
                        }]]
                    }
                },
                test: /\.js$/,
                exclude: /node_modules/
            }
        ]
    },
    optimization: {
        minimize: true
    }
};

function _externals() {
    let manifest = require('./package.json');
    let dependencies = manifest.dependencies;
    let externals = {};
    for (let p in dependencies) {
        externals[p] = 'commonjs ' + p;
    }
    return externals;
}