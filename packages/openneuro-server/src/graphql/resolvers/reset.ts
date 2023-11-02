import { checkDatasetWrite } from '../permissions'
import { resetDraft as resetDraftTask } from '../../datalad/draft'

/**
 * Mutation to move the draft HEAD reference forward or backward
 */
export const resetDraft = async (
  obj,
  { datasetId, ref },
  { user, userInfo },
) => {
  await checkDatasetWrite(datasetId, user, userInfo)
  try {
    await resetDraftTask(datasetId, ref)
    return true
  } catch (err) {
    return false
  }
}
