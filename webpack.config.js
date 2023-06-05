"use strict";

const path = require("path");
const webpack = require("webpack");
const externals = _externals();
module.exports = {
    mode: "production",
    entry: "./build/server.js",
    externals,
    target: "node",
    output: {
        path: path.resolve(__dirname, "dist/"),
        filename: "server.bundle.js"
    },
    node: {
        __dirname: true
    },
    module: {
        rules: [
            {
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: [["@babel/preset-env", {
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
    const manifest = require("./package.json");
    const dependencies = manifest.dependencies;
    const externals = {};
    for (const p in dependencies) {
        externals[p] = "commonjs " + p;
    }
    return externals;
}