const webpack = require('webpack');
const config = require('./webpack.defaults').config;

module.exports = Object.assign({}, config, {
    devtool: "source-map",
    plugins: Array.prototype.concat.apply(config.plugins, [
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
    ])
});