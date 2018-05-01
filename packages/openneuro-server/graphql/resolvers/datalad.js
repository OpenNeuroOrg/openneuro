import { summary } from './summary.js'
import { getDraftFiles } from '../../datalad/draft.js'
import { getSnapshots } from '../../datalad/snapshots.js'

/**
 * Resolvers for state held by the datalad service
 */
export const draft = obj => {
  return getDraftFiles(obj.id).then(files => ({
    files,
    summary,
    modified: new Date(), // TODO - Return cache age here
  }))
}

export const snapshots = obj => {
  return getSnapshots(obj.id)
}
