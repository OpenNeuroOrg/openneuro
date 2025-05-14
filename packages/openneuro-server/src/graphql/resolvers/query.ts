/**
 * Top level query
 */
import { dataset, datasets } from "./dataset.js"
import { participantCount, snapshot } from "./snapshots.js"
import { user, userMigration, userMigrations, users } from "./user"
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
  userMigrations,
  userMigration,
  publicMetadata,
}

export default Query
