const webpack = require('webpack');
const config = require('./webpack.defaults').config;
const CompressionPlugin = require("compression-webpack-plugin");

module.exports = Object.assign({}, config, {
    devtool: "source-map",
    // externals: {
    //     react: {
    //         root: 'React',
    //         commonjs2: 'react',
    //         commonjs: 'react',
    //         amd: 'react'
    //     },
    //     'react-dom': {
    //         root: 'ReactDOM',
    //         commonjs2: 'react-dom',
    //         commonjs: 'react-dom',
    //         amd: 'react-dom'
    //     }
    // },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('production')
            }
        }),
        new webpack.optimize.OccurenceOrderPlugin(true),
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.UglifyJsPlugin({
            output: {
                comments: false
            },
            compress: {
                warnings: false,
                screw_ie8: true
            }
        }),
        new webpack.optimize.AggressiveMergingPlugin()
    ]
});