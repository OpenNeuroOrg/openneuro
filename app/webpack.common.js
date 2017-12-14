const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const git = require('git-rev-sync')

// prettier-ignore
const env = {
  CRN_SERVER_URL: JSON.stringify(process.env.CRN_SERVER_URL),
  SCITRAN_AUTH_GOOGLE_CLIENT_ID: JSON.stringify(process.env.SCITRAN_AUTH_GOOGLE_CLIENT_ID),
  GOOGLE_TRACKING_ID: JSON.stringify(process.env.GOOGLE_TRACKING_ID),
  SCITRAN_AUTH_CLIENT_ID: JSON.stringify(process.env.SCITRAN_AUTH_CLIENT_ID),
  SCITRAN_ORCID_AUTH_REDIRECT_URI: JSON.stringify(process.env.SCITRAN_ORCID_AUTH_REDIRECT_URI),
  SCITRAN_ORCID_URI: JSON.stringify(process.env.SCITRAN_ORCID_URI),
}

module.exports = {
  context: path.resolve(__dirname, 'src'),
  entry: {
    app: './scripts/client.jsx',
    css: './sass/main.scss',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js',
  },
  plugins: [
    new CleanWebpackPlugin(['dist']),
    new HtmlWebpackPlugin({
      title: 'OpenNeuro',
      template: path.resolve(__dirname, 'src/index.html'),
      favicon: './assets/favicon.ico',
    }),
    new webpack.DefinePlugin({
      'process.env': env,
      __GIT_HASH__: JSON.stringify(git.long()),
      __GIT_BRANCH__: JSON.stringify(git.branch()),
    }),
    new CopyWebpackPlugin([
      {
        from: './assets/papaya.js',
        to: './papaya-[hash:8].js',
      },
    ]),
  ],
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: [/node_modules/],
        use: [
          {
            loader: 'babel-loader',
            options: { presets: ['es2015', 'react'] },
          },
        ],
      },
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          //resolve-url-loader may be chained before sass-loader if necessary
          use: ['css-loader', 'sass-loader'],
        }),
      },
      {
        test: /\.(jpg|png|svg|ico)$/,
        loader: 'file-loader',
        options: {
          name: './img/[name].[hash:8].[ext]',
        },
      },
    ],
  },
  node: {
    fs: 'empty',
  },
}
