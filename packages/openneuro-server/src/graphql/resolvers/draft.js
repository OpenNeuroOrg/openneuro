import { summary } from './summary.js'
import { issues } from './issues.js'
import { description } from './description.js'
import { readme } from './readme.js'
import {
  getDraftFiles,
  getPartialStatus,
  updateDatasetRevision,
} from '../../datalad/draft.js'
import { checkDatasetRead, checkDatasetWrite } from '../permissions.js'
import { filterFiles } from '../../datalad/files.js'

// A draft must have a dataset parent
const draftFiles = (obj, args) => {
  return getDraftFiles(obj.id, args).then(
    filterFiles('prefix' in args && args.prefix),
  )
}

/**
 * Check if a dataset draft is partially uploaded
 */
export const partial = (obj, _, { user, userInfo }) => {
  return checkDatasetRead(obj.id, user, userInfo).then(() => {
    return getPartialStatus(obj.id)
  })
}

/**
 * Mutation to move the draft HEAD reference forward or backward
 */
export const updateRef = (obj, { datasetId, ref }, { user, userInfo }) => {
  return checkDatasetWrite(datasetId, user, userInfo).then(() => {
    return updateDatasetRevision(datasetId, ref)
  })
}

const draft = {
  id: obj => obj.id,
  files: draftFiles,
  summary,
  issues,
  modified: obj => obj.modified,
  partial,
  description,
  readme,
}

export default draft
