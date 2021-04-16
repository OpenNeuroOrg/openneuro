/**
 * Top level query
 */
import { dataset, datasets } from './dataset.js'
import { snapshot, participantCount } from './snapshots.js'
import { user, users } from './user.js'
import { datasetChanges } from './dataset-change.js'
import { downloadDataset, downloadSnapshot } from './downloads'

const Query = {
  dataset,
  datasets,
  user,
  users,
  snapshot,
  participantCount,
  datasetChanges,
  downloadDataset,
  downloadSnapshot,
}

export default Query
