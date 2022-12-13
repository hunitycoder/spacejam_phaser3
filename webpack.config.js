const path = require('path')
const { EnvironmentPlugin } = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const ESLintPlugin = require('eslint-webpack-plugin')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const Dotenv = require('dotenv-webpack');

const { ENVIRONMENT } = process.env;

console.log({ ENVIRONMENT })

module.exports = {
    entry: './src/index.js',
    output: {
        filename: '[name].[contenthash].js',
        path: path.resolve(__dirname, './build')
    },
    devtool: 'eval-source-map',
    plugins: [
        new EnvironmentPlugin({
            ENVIRONMENT
        }),
        new CleanWebpackPlugin(),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: 'public',
                    to: 'public'
                }
            ]
        }),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: './src/index.html'
        }),
        new ESLintPlugin(),
        new ForkTsCheckerWebpackPlugin(),
        new Dotenv(),
    ],
    module: {
        rules: [
            {
                test: /\.ts(x?)$/,
                exclude: /node_modules/,
                use: ['babel-loader', 'ts-loader']
            },
            {
                test: /\.js(x?)$/,
                exclude: /node_modules/,
                use: 'babel-loader'
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf|svg)$/,
                use: ['url-loader?limit=100000']
            },
            {
                test: /\.(png|mp3|mp4)$/,
                use: ['file-loader']
            },
        ]
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx']
    },
    optimization: {
        // Separate runtime code into a runtime chunk
        runtimeChunk: 'single',
        // Separate dependencies into a vendors chunk
        splitChunks: {
            chunks: 'all'
        }
    },
    devServer: {
        overlay: true,
        stats: 'minimal',
        host: '0.0.0.0',
        disableHostCheck: true
    }
};
