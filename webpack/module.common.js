const jsonToSassVars = require('./jsonToSassVars');

const sassVariablesObj = require('../src/constants/styles');
const sassVariables = encodeURIComponent(jsonToSassVars(
    sassVariablesObj
));

const sassLoader = `css-loader!sass-loader!prepend-loader?data=${sassVariables}`;

module.exports = {
    loaders: [
        {
            test: /\.jsx?$/,
            exclude: /node_modules/,
            loaders: 'babel-loader'
        },
        {
            test: /favicon/,
            loader: 'file-loader',
            query: {
                name: 'favicon.jpg',
                publicPath: '../'
            }
        },
        {
            test: name => {
                if (name.match(/favicon/)) {
                    return false;
                }

                return name.match(/\.(woff2?|ttf|eot|svg|png|jpg)(\?v=[0-9]\.[0-9]\.[0-9])?$/);
            },
            loader: 'file-loader',
            query: {
                name: 'static/[hash].[ext]',
                publicPath: '../'
            }
        },
        {
            test: /\.scss$/,
            enforce: 'pre',
            loaders: 'import-glob-loader'
        },
        {
            test: /\.scss$/,
            exclude: /node_modules/,
            loaders: sassLoader
        }
    ]
};

