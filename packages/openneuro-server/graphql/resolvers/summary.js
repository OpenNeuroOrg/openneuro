import mongo from '../../libs/mongo.js'

/**
 * Summary resolver
 */
export const summary = dataset => {
  return mongo.collections.crn.summaries.findOne({
    id: dataset.revision,
    datasetId: dataset.id,
  })
}
