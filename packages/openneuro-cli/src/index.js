#!/usr/bin/env node
// ES6 module shim
/* eslint-disable */
require = require('esm')(module)
module.exports = require('./cli.js')
