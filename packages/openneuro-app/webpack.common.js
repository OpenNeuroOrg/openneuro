const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const ServiceWorkerWebpackPlugin = require('serviceworker-webpack-plugin')

// prettier-ignore
const env = {
  CRN_SERVER_URL: JSON.stringify(process.env.CRN_SERVER_URL),
  GOOGLE_CLIENT_ID: JSON.stringify(process.env.GOOGLE_CLIENT_ID),
  GOOGLE_TRACKING_ID: JSON.stringify(process.env.GOOGLE_TRACKING_ID),
  GLOBUS_CLIENT_ID: JSON.stringify(process.env.GLOBUS_CLIENT_ID),
  ORCID_CLIENT_ID: JSON.stringify(process.env.ORCID_CLIENT_ID),
  ORCID_REDIRECT_URI: JSON.stringify(process.env.ORCID_REDIRECT_URI),
  ORCID_URI: JSON.stringify(process.env.ORCID_URI),
  AWS_S3_ANALYSIS_BUCKET: JSON.stringify(process.env.AWS_S3_ANALYSIS_BUCKET),
  AWS_S3_DATASET_BUCKET: JSON.stringify(process.env.AWS_S3_DATASET_BUCKET),
  CRN_SERVER_DATALAD: JSON.stringify(process.env.CRN_SERVER_DATALAD) == 'true',
  ANALYSIS_ENABLED: JSON.stringify(process.env.ANALYSIS_ENABLED) == 'true',
}

module.exports = {
  context: path.resolve(__dirname, 'src'),
  entry: {
    app: './scripts/client.jsx',
    css: './sass/main.scss',
    vendor: [
      'react',
      'react-dom',
      'react-router-dom',
      'react-select',
      'react-bootstrap',
      'moment',
      'remarkable',
    ],
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name]-[hash:8].bundle.js',
  },
  plugins: [
    new CleanWebpackPlugin(['dist']),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: Infinity,
    }),
    new HtmlWebpackPlugin({
      title: 'OpenNeuro',
      template: path.resolve(__dirname, 'src/index.html'),
      favicon: './assets/favicon.ico',
    }),
    new webpack.DefinePlugin({
      'process.env': env,
    }),
    new ServiceWorkerWebpackPlugin({
      entry: path.join(__dirname, './src/scripts/sw.js'),
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
          use: ['cache-loader', 'css-loader', 'sass-loader'],
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
