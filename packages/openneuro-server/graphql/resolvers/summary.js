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

/**
 * Save summary data returned by the datalad service
 *
 * Returns the saved summary if successful
 */
export const updateSummary = (obj, args) => {
  const summaries = mongo.collections.crn.summaries
  return summaries
    .update(
      { id: args.summary.id, datasetId: args.summary.datasetId },
      args.summary,
      {
        upsert: true,
      },
    )
    .then(() => args.summary)
}
