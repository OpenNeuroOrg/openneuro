import { Command, bidsValidator } from '../deps.ts'

const validateCommand = new Command()
  .name('bids-validator')
  .description(
    'This tool checks if a dataset in a given directory is compatible with the Brain Imaging Data Structure specification. To learn more about Brain Imaging Data Structure visit http://bids.neuroimaging.io',
  )
  .arguments('<dataset_directory>')
  .version('alpha')
  .option('--json', 'Output machine readable JSON')
  .option(
    '-s, --schema <type:string>',
    'Specify a schema version to use for validation',
    {
      default: 'latest',
    },
  )
  .option('-v, --verbose', 'Log more extensive information about issues')
  .option(
    '--ignoreNiftiHeaders',
    'Disregard NIfTI header content during validation',
  )
  .option(
    '--filenameMode',
    'Enable filename checks for newline separated filenames read from stdin',
  )

export const validate = validateCommand
