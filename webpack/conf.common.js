const path = require('path');

const plugins = require('./plugin.common');

module.exports = {
    entry: ['babel-polyfill', './src/index'],
    output: {
        path: path.join(__dirname, '../assets'),
        filename: 'bundle.js'
    },
    resolve: {
        modules: ['node_modules', path.join(__dirname, '../src/images/sprite')],
        extensions: ['*', '.js', '.json']
    },
    resolveLoader: {
        modules: ['node_modules', __dirname]
    },
    plugins
};

