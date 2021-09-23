import Analytics from '../models/analytics'
import Dataset from '../models/dataset'

/**
 * Update a dataset's analytics count
 * @param {string} datasetId
 * @param {string} tag Deprecated
 * @param {'views'|'downloads'} type
 */
export const trackAnalytics = async (datasetId, tag, type) => {
  return Dataset.updateOne(
    {
      id: datasetId,
    },
    {
      $inc: {
        [type]: 1,
      },
    },
    {
      upsert: true,
    },
  ).exec()
}
