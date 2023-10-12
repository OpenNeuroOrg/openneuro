import { Command } from '../deps.ts'

export const upload = new Command()
  .name('upload')
  .description('Upload a dataset to OpenNeuro')
  .arguments('<dataset_directory>')
