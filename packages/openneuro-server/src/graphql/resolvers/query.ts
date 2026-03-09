/**
 * Top level query
 */
import { dataset, datasets } from "./dataset"
import { participantCount, snapshot } from "./snapshots"
import { user, users } from "./user"
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
