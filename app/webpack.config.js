const path = require('path');
const webpack = require('webpack');

module.exports = {
  context: path.resolve(__dirname, 'src/scripts'),
  entry: {
    app: './index.jsx',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js',
  },
  module: {
    rules: [
      {
        test: /.jsx?$/,
        exclude: [/node_modules/],
        use: [{
          loader: 'babel-loader',
          options: { presets: ['es2015', 'react'] },
        }],
      },
    ],
  },
  node: {
    fs: "empty"
  }
};
