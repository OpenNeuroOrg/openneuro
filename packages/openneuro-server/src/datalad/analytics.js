import Analytics from '../models/analytics'

export const trackAnalytics = (datasetId, tag, type) => {
  return Analytics.updateOne(
    {
      datasetId: datasetId,
      tag: tag,
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
