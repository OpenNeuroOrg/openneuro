import { summary } from './summary.js'
import { issues } from './issues.js'
import { description } from './description.js'
import { readme } from './readme.js'
import {
  getDraftFiles,
  getPartialStatus,
  updateDatasetRevision,
} from '../../datalad/draft.js'
import { checkDatasetWrite } from '../permissions.js'
import { filterFiles } from '../../datalad/files.js'

// A draft must have a dataset parent
const draftFiles = dataset => args => {
  return getDraftFiles(dataset.id, args).then(
    filterFiles('prefix' in args && args.prefix),
  )
}

/**
 * Check if a dataset draft is partially uploaded
 */
export const partial = (obj, { datasetId }) => {
  return getPartialStatus(datasetId)
}

/**
 * Mutation to move the draft HEAD reference forward or backward
 */
export const updateRef = (obj, { datasetId, ref }, { user, userInfo }) => {
  return checkDatasetWrite(datasetId, user, userInfo).then(() => {
    return updateDatasetRevision(datasetId, ref)
  })
}

export const draft = obj => ({
  id: obj.id,
  files: draftFiles(obj),
  summary: () => summary(obj),
  issues: () => issues(obj),
  modified:
    obj.modified instanceof Date ? obj.modified : new Date(obj.modified),
  partial: () => partial(obj, { datasetId: obj.id }),
  description: () =>
    description(obj, { datasetId: obj.id, revision: obj.revision }),
  readme: () => readme(obj, { datasetId: obj.id, revision: obj.revision }),
})
