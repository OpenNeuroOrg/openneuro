#!/usr/bin/env node
import commander from 'commander'
import { version } from './lerna.json'
import { login, upload, download, ls } from './actions.js'
import { gitCredential } from './gitCredential.js'
import { gitAnnexRemote } from './gitAnnexRemote.js'
import { create } from './createDataset.js'

commander.version(version).description('OpenNeuro command line tools.')

commander.addHelpText(
  'after',
  `
See additional options for each command with "openneuro [command] --help". Example:
  $ openneuro upload --help`,
)

commander
  .command('login')
  .alias('l')
  .description('Setup authentication with OpenNeuro')
  .action(login)

commander
  .command('upload <dir>')
  .alias('u')
  .description('Upload or sync a dataset (if an accession number is provided)')
  .option(
    '-d, --dataset [dsId]',
    'Specify the dataset to update, use this to resume uploads or add new files',
  )
  .option('-i, --ignoreWarnings', 'Ignore validation warnings when uploading')
  .option(
    '-n, --ignoreNiftiHeaders',
    'Disregard NIfTI header content during validation',
  )
  .option(
    '--ignoreSubjectConsistency',
    'Skip checking that any given file for one subject is present for all other subjects',
  )
  .option('-v, --verbose', 'Verbose output')
  .action(upload)

commander
  .command('download <datasetId> <destination>')
  .alias('d')
  .description(
    'Download a dataset draft or snapshot. If neither is specified, will prompt with available snapshots.',
  )
  .option('--draft')
  .option('-s, --snapshot [snapshotVersion]')
  .action(download)

commander
  .command('git-credential <operation>')
  .description(
    'A git credentials helper for easier datalad or git-annex access to datasets.',
  )
  .action(gitCredential)

commander
  .command('create-dataset')
  .alias('c')
  .description(
    'Create a new empty dataset, useful for adding existing DataLad or git-annex datasets.',
  )
  .action(() => {
    create()
  })

commander
  .command('ls <datasetId>')
  .description('Lists files from a snapshotted dataset version.')
  .option('-s, --snapshot [snapshotVersion]')
  .action(ls)

const processName = process.argv[1].endsWith('index.js')
  ? process.env.npm_lifecycle_event
  : process.argv[1]

if (processName.endsWith('git-credential-openneuro')) {
  gitCredential()
} else if (processName.endsWith('git-annex-remote-openneuro')) {
  gitAnnexRemote()
} else {
  commander.parse(process.argv)
  if (!process.argv.slice(2).length) {
    commander.help()
  }
}
