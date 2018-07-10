// Run any pending MongoDB migrations
require('babel-core/register')
require('./migrations/upgrade.js')
