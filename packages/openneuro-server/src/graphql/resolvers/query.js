/**
 * Top level query
 */
import { dataset, datasets } from './dataset.js'
import { snapshot, participantCount } from './snapshots.js'
import { user, users } from './user.js'
import { datasetChanges } from './dataset-change.js'

const Query = {
  dataset,
  datasets,
  user,
  users,
  snapshot,
  participantCount,
  datasetChanges,
}

export default Query
