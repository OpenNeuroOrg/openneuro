import DatasetEvent from "../../models/datasetEvents"
import { checkDatasetWrite } from "../permissions"

/**
 * Get all events for a dataset
 */
export function datasetEvents(obj, _, { userInfo }) {
  if (userInfo.admin) {
    // Site admins can see all events
    return DatasetEvent.find({ datasetId: obj.id })
      .sort({ timestamp: -1 })
      .populate("user")
      .exec()
  } else {
    // Non-admin users can only see notes without the admin flag
    return DatasetEvent.find({
      datasetId: obj.id,
      event: { admin: { $ne: true } },
    })
      .sort({ timestamp: -1 })
      .populate("user")
      .exec()
  }
}

/**
 * Create or update an admin note event
 */
export async function saveAdminNote(
  obj,
  { id, datasetId, note },
  { user, userInfo },
) {
  // Only site admin users can create an admin note
  if (!userInfo?.admin) {
    throw new Error("Not authorized")
  }

  const datasetEvent = await DatasetEvent.findOneAndUpdate({ id }, {
    id,
    datasetId,
    userId: user,
    event: {
      type: "note",
      admin: true,
    },
    success: true,
    note,
  }, {
    upsert: true,
    setDefaultsOnInsert: true,
    new: true,
  }).populate("user")
  if (datasetEvent) {
    return datasetEvent
  } else {
    return null
  }
}
