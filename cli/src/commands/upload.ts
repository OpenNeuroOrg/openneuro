import { Command } from '../deps.ts'
import { validateCommand } from './validate.ts'
import { LoginError, getConfig } from './login.ts'
import { logger } from '../logger.ts'

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
    let config
    try {
      config = getConfig()
    } catch (err) {
      if (err instanceof LoginError) {
        console.error('Run `openneuro login` before upload.')
      }
    }
    logger.info(
      `configured with URL "${config.url}" and token "${config.token.slice(
        0,
        3,
      )}...${config.token.slice(-3)}`,
    )
    logger.info(`upload ${dataset_directory}`)
  })
