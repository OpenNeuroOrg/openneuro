import BadAnnexObject from "../../models/badAnnexObject"
import { checkAdmin } from "../permissions"

export const flaggedFiles = async (
  obj,
  { flagged = true, deleted = false },
  { user, userInfo },
) => {
  await checkAdmin(user, userInfo)
  return BadAnnexObject.find({ flagged, removed: deleted })
    .populate("flagger")
    .populate("remover")
}
