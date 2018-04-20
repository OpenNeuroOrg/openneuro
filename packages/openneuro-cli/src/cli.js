#!/usr/bin/env node
import commander from 'commander'
import packageJson from '../package.json'
import { login, upload } from './actions.js'

commander.version(packageJson.version).description(packageJson.description)

commander
  .command('login')
  .alias('l')
  .description('Setup authentication with OpenNeuro')
  .action(login)

commander
  .command('upload <dir>')
  .alias('u')
  .alias('sync')
  .description('Upload or sync a dataset (if a accession number is provided)')
  .option('-d, --dataset [dsId]', 'Specify the dataset to update')
  .action(upload)

commander.parse(process.argv)
