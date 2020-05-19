import mongo from '../libs/mongo.js'
const c = mongo.collections

export const trackAnalytics = (datasetId, tag, type) => {
  return c.crn.analytics.updateOne(
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
  )
}
