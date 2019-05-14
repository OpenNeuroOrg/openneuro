// Run any pending MongoDB migrations
require('@babel/register')
require('./migrations/upgrade.js')
