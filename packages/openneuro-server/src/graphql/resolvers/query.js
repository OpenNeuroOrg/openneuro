/**
 * Top level query
 */
import { dataset, datasets } from './dataset.js'
import { snapshot, participantCount } from './snapshots.js'
import { user, users } from './user.js'
import { datasetChanges } from './dataset-change.js'
import { flaggedFiles } from './flaggedFiles'
import { searchDatasets } from './dataset-search'

const Query = {
  dataset,
  datasets,
  searchDatasets,
  user,
  users,
  snapshot,
  participantCount,
  datasetChanges,
  flaggedFiles,
}

export default Query
