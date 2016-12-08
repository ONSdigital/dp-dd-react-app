const defaults = require('./webpack.defaults');

module.exports = Object.assign({}, defaults.config, {
    devtool: "eval"
});