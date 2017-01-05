const path = require('path');

const PATH = {
    BASE:  '../',
    SOURCE: 'src',
    BUILD: 'dist'
};

const config = {};

// The base directory (absolute path!) for resolving the entry option,
config.context = path.resolve(__dirname, PATH.BASE, PATH.SOURCE);

// Modules are loaded upon startup. The last one is exported.
config.entry = ['es6-promise', 'whatwg-fetch','./app.js'];

config.output = {
    // The output directory as an absolute path (required).
    path: path.resolve(__dirname, PATH.BASE, PATH.BUILD),
    // The publicPath specifies the public URL address of the output files when referenced in a browse
    publicPath: '/',
    // The output directory as an absolute path (required).
    filename: 'bundle.js'
};

config.module = {
    loaders: [{
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
            presets: ['es2015']
        }
    },{
        test: /\.jsx$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
            presets: ['react', 'es2015']
        }
    },{
        test: /\.scss$/,
        loaders: ["style-loader", "css-loader", "sass-loader"]
    }]
};

config.resolve = {
    // implicitly tell babel to load jsx
    extensions: ['', '.js', '.jsx']
};

module.exports = { PATH, config };