const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    context: path.resolve(__dirname, 'src'),
    entry: {
        app: './scripts/client.jsx',
        css: './sass/main.scss'
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].bundle.js'
    },
    plugins: [
        new CleanWebpackPlugin(['dist']),
        new HtmlWebpackPlugin({
            title: 'OpenNeuro',
            template: path.resolve(__dirname, 'src/index.html'),
            favicon: './assets/favicon.ico'
        }),
        new webpack.DefinePlugin({
            'process.env': {
                CRN_SERVER_URL: JSON.stringify(process.env.CRN_SERVER_URL),
                SCITRAN_AUTH_CLIENT_ID: JSON.stringify(
                    process.env.SCITRAN_AUTH_CLIENT_ID
                ),
                GOOGLE_TRACKING_ID: JSON.stringify(
                    process.env.GOOGLE_TRACKING_ID
                )
            }
        }),
        new ExtractTextPlugin('style.css'),
        new CopyWebpackPlugin([{ from: './assets/papaya.js' }])
    ],
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: [/node_modules/],
                use: [
                    {
                        loader: 'babel-loader',
                        options: { presets: ['es2015', 'react'] }
                    }
                ]
            },
            {
                test: /\.scss$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    //resolve-url-loader may be chained before sass-loader if necessary
                    use: ['css-loader', 'sass-loader']
                })
            },
            {
                test: /\.(jpg|png|svg|ico)$/,
                loader: 'file-loader',
                options: {
                    name: './img/[name].[hash].[ext]'
                }
            }
        ]
    },
    node: {
        fs: 'empty'
    }
};
