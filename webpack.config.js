const webpack = require('webpack');
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const SpritesmithPlugin = require('webpack-spritesmith');
const TerserPlugin = require('terser-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const Dotenv = require('dotenv-webpack');

const { version } = require('./package.json');

require('dotenv').config();

function sassLoader(config) {
    const common = [
        'css-loader',
        {
            loader: 'postcss-loader',
            options: {
                config: {
                    path: path.resolve(__dirname, './src/sass/postcss.config.js')
                }
            }
        },
        'sass-loader'
    ];

    if (config.__DEV__) {
        return ['style-loader', ...common];
    }

    return [MiniCssExtractPlugin.loader, ...common];
}

function getPlugins(config) {
    const common = [
        new SpritesmithPlugin({
            src: {
                cwd: path.resolve(__dirname, 'src/images/ico'),
                glob: '**/*.png'
            },
            target: {
                image: path.join(__dirname, `src/images/sprite/sprite.png`),
                css: path.join(__dirname, `src/images/sprite/sprite.scss`)
            },
            apiOptions: {
                cssImageRef: `~sprite.png`
            },
            retina: '@2x',
            spritesmithOptions: {
                padding: 0
            }
        }),
        new webpack.DefinePlugin({
            'process.env': {
                GOOGLE_AUTH_WEB_CLIENT_ID: JSON.stringify(process.env.GOOGLE_AUTH_WEB_CLIENT_ID),
                VERSION: JSON.stringify(version),
                NODE_ENV: JSON.stringify(process.env.NODE_ENV)
            }
        })
    ];

    if (config.__DEV__) {
        return [
            ...common,
            new webpack.HotModuleReplacementPlugin(),
            new Dotenv()
        ];
    }

    return [
        ...common,
        new MiniCssExtractPlugin({
            filename: 'style.css?v=[hash]',
            chunkFilename: '[name].chunk.css?v=[chunkHash]'
        })
    ];
}

function getEntry(config) {
    const common = ['./src/index'];

    if (config.__DEV__) {
        return [
            'webpack/hot/only-dev-server',
            'webpack-hot-middleware/client?reload=true',
            ...common
        ];
    }

    return common;
}

const assetPath = path.join(__dirname, 'dist');

const publicPath = process.env.PUBLIC_PATH || '/';

module.exports = (config = { __DEV__: process.env.NODE_ENV === 'development' }) => ({
    entry: getEntry(config),
    devtool: config.__DEV__
        ? 'cheap-module-eval-source-map'
        : false,
    mode: process.env.NODE_ENV || 'production',
    output: {
        path: assetPath,
        publicPath,
        filename: 'bundle.js?v=[hash]',
        globalObject: 'this'
    },
    module: {
        rules: [
            {
                test: /\.html$/,
                use: {
                    loader: 'html-loader',
                    options: { minimize: true }
                }
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: 'babel-loader'
            },
            {
                test: /workers\/(.*)\.js$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'worker-loader',
                        options: {
                            name: '[name].worker.js',
                            inline: true
                        }
                    },
                    'babel-loader'
                ]
            },
            {
                test: /\.scss$/,
                exclude: /node_modules/,
                use: sassLoader(config)
            },
            {
                test: /\.css$/,
                use: 'css-loader'
            },
            {
                test: /\.(woff2?|ttf|eot)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                exclude: /node_modules/,
                loader: 'file-loader'
            },
            {
                test: /\.(png|jpg|wav|mp3|mp4)$/,
                exclude: [/node_modules/, /favicon\.png/],
                use: 'file-loader'
            },
            {
                test: /\.svg$/,
                exclude: /node_modules/,
                use: [
                    'babel-loader',
                    {
                        loader: 'react-svg-loader',
                        query: {
                            svgo: {
                                pretty: true,
                                plugins: [{ removeStyleElement: true }]
                            }
                        }
                    }
                ]
            },
            {
                test: /favicon\.png/,
                use: {
                    loader: 'file-loader',
                    options: {
                        name: 'favicon.ico',
                        path: assetPath,
                        publicPath
                    }
                }
            }
        ]
    },
    resolve: {
        modules: [
            path.resolve(__dirname, 'src/images/sprite'),
            'node_modules'
        ],
        alias: {
            'react-dom': '@hot-loader/react-dom',
            sass: path.resolve(__dirname, 'src/sass'),
            constants: path.resolve(__dirname, 'src/constants')
        }
    },
    optimization: {
        minimize: !config.__DEV__,
        minimizer: [
            new TerserPlugin(),
            new OptimizeCssAssetsPlugin({})
        ]
    },
    plugins: getPlugins(config)
});

