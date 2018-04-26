require('babel-core/register')
var worker = require('./libs/queue/worker.js')
worker.start()
