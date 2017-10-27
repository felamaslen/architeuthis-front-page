const jsonToSassVars = require('./jsonToSassVars');

const sassVariablesObj = require('../src/constants/styles');
const sassVariables = encodeURIComponent(jsonToSassVars(
    sassVariablesObj
));

const sassLoader = `css-loader!sass-loader!prepend-loader?data=${sassVariables}`;

const babelOptions = JSON.stringify({
    presets: ['react', 'env']
});
const babelLoader = `babel-loader?${babelOptions}`;

module.exports = {
    loaders: [
        {
            test: /\.jsx?$/,
            exclude: /node_modules/,
            loaders: [babelLoader]
        },
        {
            test: /\.(woff2?|ttf|eot|svg|png|jpg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
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

