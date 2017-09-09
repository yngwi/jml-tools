const webpack = require('webpack');
const path = require('path');
const UglifyJsPlugin = webpack.optimize.UglifyJsPlugin;
const PACKAGE = require('./package.json');

const shouldMinify = process.env.NODE_ENV === 'dist:min';

const PATHS = {
    src: path.join(__dirname, 'src'),
    dist: path.join(__dirname, 'dist'),
};

const config = {
    entry: path.join(PATHS.src, 'index.js'),
    devtool: 'source-map',
    output: {
        path: PATHS.dist,
        filename: `${PACKAGE.name}${shouldMinify ? '.min' : ''}.js`,
        library: PACKAGE.name,
        libraryTarget: 'umd',
        umdNamedDefine: true,
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: [
                    {
                        loader: 'babel-loader',
                    },
                ],
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        modules: [
            path.resolve(PATHS.src),
            'node_modules',
        ],
        extensions: ['.js'],
    },
    plugins: shouldMinify
        ? [new UglifyJsPlugin({minimize: true})]
        : [],
};

module.exports = config;