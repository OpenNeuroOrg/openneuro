require('babel/register');
var worker = require('./libs/queue/worker.js');
worker.start();
