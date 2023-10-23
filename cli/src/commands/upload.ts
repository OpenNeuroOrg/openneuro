import { Command } from '../deps.ts'
import { validateCommand } from './validate.ts'

/**
 * Upload is validate extended with upload features
 */
export const upload = validateCommand
  .name('upload')
  .description('Upload a dataset to OpenNeuro')
  .option('--json', 'Hidden for upload usage', { hidden: true, override: true })
  .option('--filenameMode', 'Hidden for upload usage', {
    hidden: true,
    override: true,
  })
  .action(({ json }, dataset_directory) => {
    console.log(`upload ${dataset_directory}`)
  })
