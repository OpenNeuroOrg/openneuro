/**
 * Top level query
 */
import { dataset, datasets } from "./dataset.js"
import { participantCount, snapshot } from "./snapshots.js"
import { user, users } from "./user.js"
import { flaggedFiles } from "./flaggedFiles"
import { publicMetadata } from "./metadata"

const Query = {
  dataset,
  datasets,
  user,
  users,
  snapshot,
  participantCount,
  flaggedFiles,
  publicMetadata,
}

export default Query
