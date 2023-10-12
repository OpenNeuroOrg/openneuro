import { Command } from '../deps.ts'

export const gitCredential = new Command()
  .name('git-credential')
  .description(
    'A git credentials helper for easier datalad or git-annex access to datasets.',
  )
