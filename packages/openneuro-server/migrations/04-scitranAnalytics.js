/* eslint-disable no-console */
/**
 * Migrate permissions from SciTran datasets to new db
 */
import path from 'path'
import bidsId from '../libs/bidsId.js'
import mongo from '../libs/mongo.js'
import Analytics from '../models/analytics.js'

const scitran = mongo.collections.scitran

export default {
  id: path.basename(module.filename),
  update: async () => {
    const analytics = await scitran.analytics.find({}).toArray()
    // console.log('analytics:', analytics)
    const newAnalytics = []
    for (const analytic of analytics) {
      let { datasetId, tag } = bidsId.decode(analytic.container_id)
      newAnalytics.push({
        datasetId,
        tag,
        type: analytic.analytics_type,
      })
    }
    Analytics.collection.insert(newAnalytics).catch(e => {
      throw e
    })
  },
}
