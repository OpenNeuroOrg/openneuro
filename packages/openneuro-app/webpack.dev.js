const path = require('path')
const merge = require('webpack-merge')
const common = require('./webpack.common.js')
const Visualizer = require('webpack-visualizer-plugin')
const history = require('connect-history-api-fallback')
const convert = require('koa-connect')

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  serve: {
    hotClient: {
      host: { client: 'localhost', server: '0.0.0.0' },
      port: 8145,
    },
    content: path.join(__dirname, 'dist'),
    host: '0.0.0.0',
    port: 9876,
    add: app => {
      const historyOptions = {}
      app.use(convert(history(historyOptions)))
    },
  },
  plugins: [new Visualizer()],
})
