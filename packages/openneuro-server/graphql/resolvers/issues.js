import mongo from '../../libs/mongo.js'

/**
 * Issues resolver
 */
export const issues = dataset => {
  return mongo.collections.crn.issues
    .findOne({
      id: dataset.revision,
      datasetId: dataset.id,
    })
    .then(({ issues }) => issues)
}
