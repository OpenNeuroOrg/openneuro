/**
 * Top level query
 */
import { dataset, datasets } from './dataset.js'
import { snapshot, participantCount } from './snapshots.js'
import { user, users } from './user.js'
import { datasetChanges } from './dataset-change.js'
import { flaggedFiles } from './flaggedFiles'

const Query = {
  dataset,
  datasets,
  user,
  users,
  snapshot,
  participantCount,
  datasetChanges,
  flaggedFiles,
}

export default Query
