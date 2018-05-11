#!/usr/bin/env node
import commander from 'commander'
import colors from 'colors'
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
  .option('-i, --ignoreWarnings', 'Ignore validation warnings when uploading')
  .option(
    '-n, --ignoreNiftiHeaders',
    'Disregard NIfTI header content during validation',
  )
  .option('-v, --verbose', 'Verbose output')
  .action(upload)

commander.command('*', { noHelp: true, isDefault: true }).action(() => {
  // eslint-disable-next-line no-console
  console.log('Unknown command!')
  commander.outputHelp(make_red)
})

commander.parse(process.argv)

if (!process.argv.slice(2).length) {
  commander.outputHelp(make_red)
}

function make_red(txt) {
  return colors.red(txt) //display the help text in red on the console
}
