import BadAnnexObject from "../../models/badAnnexObject"
import { checkAdmin } from "../permissions"
import type { GraphQLContext } from "../builder"

export const flaggedFiles = async (
  obj,
  { flagged = true, deleted = false },
  { user, userInfo }: GraphQLContext,
) => {
  await checkAdmin(user, userInfo)
  return BadAnnexObject.find({ flagged, removed: deleted })
    .populate("flagger")
    .populate("remover")
}
