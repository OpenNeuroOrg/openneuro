const webpack = require('webpack')
const merge = require('webpack-merge')
const common = require('./webpack.common.js')
const CompressionPlugin = require('compression-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = merge(common, {
  mode: 'production',
  devtool: 'source-map',
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'style-[md5:contenthash:hex:20].css',
    }),
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
})
