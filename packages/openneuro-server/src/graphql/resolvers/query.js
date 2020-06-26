/**
 * Top level query
 */
import { dataset, datasets } from './dataset.js'
import { snapshot, participantCount } from './snapshots.js'
import { user, users } from './user.js'

const Query = {
  dataset,
  datasets,
  user,
  users,
  snapshot,
  participantCount,
}

export default Query
