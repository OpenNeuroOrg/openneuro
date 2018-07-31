import { summary } from './summary.js'
import { issues } from './issues.js'
import { getDraftFiles, getPartialStatus } from '../../datalad/draft.js'

export const draft = obj => ({
  id: obj.revision,
  files: () => getDraftFiles(obj.id, obj.revision),
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
