import Dataset from "../models/dataset"

/**
 * Update a dataset's analytics count
 * @param {string} datasetId
 * @param {string} tag Deprecated
 * @param {'views'|'downloads'} type
 */
export const trackAnalytics = async (datasetId, tag, type) => {
  if (type === "views") {
    return Dataset.updateOne(
      {
        id: datasetId,
      },
      {
        $inc: {
          views: 1,
        },
      },
    ).exec()
  } else if (type === "downloads") {
    return Dataset.updateOne(
      {
        id: datasetId,
      },
      {
        $inc: {
          downloads: 1,
        },
      },
    ).exec()
  }
}
