import { summary } from './summary.js'
import { issues } from './issues.js'
import { description } from './description.js'
import { readme } from './readme.js'
import { getDraftFiles, updateDatasetRevision } from '../../datalad/draft.js'
import { checkDatasetWrite } from '../permissions.js'
import { filterFiles } from '../../datalad/files.js'
import { createSnapshot } from '../../datalad/snapshots.js'
import Dataset from '../../models/dataset.js'
import Snapshot from '../../models/snapshot.js'

// A draft must have a dataset parent
const draftFiles = (obj, args) => {
  return getDraftFiles(obj.id, args).then(
    filterFiles('prefix' in args && args.prefix),
  )
}

/**
 * Mutation to move the draft HEAD reference forward or backward
 */
export const updateRef = async (
  obj,
  { datasetId, ref },
  { user, userInfo },
) => {
  await checkDatasetWrite(datasetId, user, userInfo)
  await updateDatasetRevision(datasetId, ref)
  // Check if this is the first data commit and no snapshots exist
  const snapshot = await Snapshot.findOne({
    datasetId,
  }).exec()
  if (!snapshot) await createSnapshot(datasetId, '1.0.0', userInfo)
}

const draft = {
  id: obj => obj.id,
  files: draftFiles,
  summary,
  issues,
  modified: obj => obj.modified,
  description,
  readme,
  head: async obj => (await Dataset.findOne({ id: obj.id }).exec()).revision,
}

export default draft
