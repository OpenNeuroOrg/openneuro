import {
  Command,
  EnumType,
  ValidatorOptions,
  LevelName,
  LogLevelNames,
} from './deps.ts'

import { login } from './commands/login.ts'
import { validate } from './commands/validate.ts'
import { upload } from './commands/upload.ts'
import { gitCredential } from './commands/git-credential.ts'

export type OpenNeuroOptions = {
  localPath?: string
  validatorOptions?: ValidatorOptions
  debug: LevelName
}

const openneuroCommand = new Command()
  .name('openneuro')
  .type('debugLevel', new EnumType(LogLevelNames))
  .description(
    'OpenNeuro command line tools for uploading, downloading, or syncing datasets. See https://docs.openneuro.org for detailed guides.',
  )
  // TODO - Sync this with the node packages
  .version('4.20.0')
  .command('login', login)
  .command('upload', upload)
  .command('git-credential', gitCredential)

/**
 * Parse command line options and return a OpenNeuroOptions config
 * @param argumentOverride Override the arguments instead of using Deno.args
 */
export async function commandLine(
  argumentOverride: string[],
): Promise<OpenNeuroOptions> {
  const { args, options } = await openneuroCommand.parse(argumentOverride)

  return {
    datasetPath: args[0],
    ...options,
    debug: options.debug as LevelName,
  }
}
