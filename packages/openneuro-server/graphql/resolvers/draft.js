import { summary } from './summary.js'
import { issues } from './issues.js'
import { getDraftFiles, getPartialStatus } from '../../datalad/draft.js'

// A draft must have a dataset parent
const draftFiles = dataset => ({ untracked }) => {
  return getDraftFiles(dataset.id, dataset.revision, { untracked })
}

export const draft = obj => ({
  id: obj.revision,
  files: draftFiles(obj),
  summary: () => summary(obj),
  issues: () => issues(obj),
  modified: obj.modified,
  partial: () => partial(obj, { datasetId: obj.id }),
})

/**
 * Check if a dataset draft is partially uploaded
 */
export const partial = (obj, { datasetId }) => {
  return getPartialStatus(datasetId)
}
