import { summary } from './summary.js'
import { issues } from './issues.js'
import { getDraftFiles } from '../../datalad/draft.js'
import { getSnapshot, getSnapshots } from '../../datalad/snapshots.js'

/**
 * Resolvers for state held by the datalad service
 */
export const draft = obj => {
  return getDraftFiles(obj.id, obj.revision).then(files => ({
    id: obj.revision,
    files,
    summary: () => summary(obj),
    issues: () => issues(obj),
    modified: obj.modified, 
  }))
}

export const snapshots = obj => {
  return getSnapshots(obj.id)
}

export const snapshot = (obj, { datasetId, tag }) => {
  return getSnapshot(datasetId, tag)
}
