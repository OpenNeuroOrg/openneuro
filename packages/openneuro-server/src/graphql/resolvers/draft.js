import { summary } from './summary.js'
import { issues } from './issues.js'
import { description } from './description.js'
import { readme } from './readme.js'
import { getDraftFiles, updateDatasetRevision } from '../../datalad/draft.js'
import { checkDatasetWrite } from '../permissions.js'
import { filterFiles } from '../../datalad/files.js'

// A draft must have a dataset parent
const draftFiles = (obj, args) => {
  return getDraftFiles(obj.id, args).then(
    filterFiles('prefix' in args && args.prefix),
  )
}

/**
 * Deprecated mutation to move the draft HEAD reference forward or backward
 *
 * Exists to support existing usage where this would result in the initial snapshot
 */
export const updateRef = async (
  obj,
  { datasetId, ref },
  { user, userInfo },
) => {
  await checkDatasetWrite(datasetId, user, userInfo)
  await updateDatasetRevision(datasetId, ref)
}

/**
 * Mutation to move the draft HEAD reference forward or backward
 */
export const revalidate = async (obj, { datasetId }, { user, userInfo }) => {
  await checkDatasetWrite(datasetId, user, userInfo)
}

const draft = {
  id: obj => obj.id,
  files: draftFiles,
  summary,
  issues,
  modified: obj => obj.modified,
  description,
  readme,
  head: obj => obj.revision,
}

export default draft
