/**
 * Top level query
 */
import { dataset, datasets } from './dataset.js'
import { snapshot } from './snapshots.js'
import { user, users } from './user.js'
import { partial } from './draft.js'

const Query = {
  dataset,
  datasets,
  user,
  users,
  snapshot,
  partial,
}

export default Query
