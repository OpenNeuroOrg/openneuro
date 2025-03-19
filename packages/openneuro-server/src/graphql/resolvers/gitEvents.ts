import { createEvent } from "../../libs/events"
import { checkDatasetWrite } from "../permissions"

/**
 * Create a git event
 */
export const createGitEvent = async (
  obj,
  { datasetId, commit, reference },
  { user, userInfo },
) => {
  await checkDatasetWrite(datasetId, user, userInfo)
  const event = await createEvent(
    datasetId,
    user,
    {
      type: "git",
      commit,
      reference,
    },
    "",
    true,
  )
  return event.toObject()
}
