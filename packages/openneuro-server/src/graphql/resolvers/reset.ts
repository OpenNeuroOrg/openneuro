import { checkDatasetWrite } from "../permissions"
import { resetDraft as resetDraftTask } from "../../datalad/draft"
import type { GraphQLContext } from "../builder"

/**
 * Mutation to move the draft HEAD reference forward or backward
 */
export const resetDraft = async (
  obj,
  { datasetId, ref },
  { user, userInfo }: GraphQLContext,
) => {
  await checkDatasetWrite(datasetId, user, userInfo)
  try {
    await resetDraftTask(datasetId, ref)
    return true
  } catch (_err) {
    return false
  }
}
