import DatasetEvent from "../../models/datasetEvents"

/**
 * Get all events for a dataset
 */
export function datasetEvents(obj, _, { userInfo }) {
  if (userInfo.admin) {
    // Site admins can see all events
    return DatasetEvent.find({ datasetId: obj.id })
      .sort({ timestamp: -1 })
      .populate("eventUser")
      .exec()
  } else {
    // Non-admin users can only see notes without the admin flag
    return DatasetEvent.find({
      datasetId: obj.id,
      event: { admin: { $ne: true } },
    })
      .sort({ timestamp: -1 })
      .populate("eventUser")
      .exec()
  }
}
