const webpack = require('webpack')
const merge = require('webpack-merge')
const MinifyPlugin = require('babel-minify-webpack-plugin')
const common = require('./webpack.common.js')
const CompressionPlugin = require('compression-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

module.exports = merge(common, {
  devtool: 'source-map',
  plugins: [
    new ExtractTextPlugin('style-[contenthash:8].css'),
    new MinifyPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
      },
    }),
    new CompressionPlugin({
      asset: '[path].gz[query]',
      algorithm: 'gzip',
      test: /\.(js|html|css)$/,
    }),
  ],
  output: {
    filename: '[name]-[hash:8].bundle.js',
  },
})
