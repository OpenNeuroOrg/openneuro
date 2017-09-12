const webpack = require('webpack');
const merge = require('webpack-merge');
const MinifyPlugin = require('babel-minify-webpack-plugin');
const common = require('./webpack.common.js');
const CompressionPlugin = require('compression-webpack-plugin');

module.exports = merge(common, {
    devtool: 'source-map',
    plugins: [
        new MinifyPlugin(),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('production')
            }
        }),
        new CompressionPlugin({
            asset: '[path].gz[query]',
            algorithm: 'gzip',
            test: /\.(js|html|css)$/
        })
    ]
});
