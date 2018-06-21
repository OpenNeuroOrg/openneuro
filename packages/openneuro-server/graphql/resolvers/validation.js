import mongo from '../../libs/mongo.js'
import pubsub from '../pubsub'

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

/**
 * Save issues data returned by the datalad service
 *
 * Returns only a boolean if successful or not
 */
export const updateValidation = (obj, args) => {
  const issues = mongo.collections.crn.issues
  return issues
    .update(
      { id: args.validation.id, datasetId: args.validation.datasetId },
      args.validation,
      {
        upsert: true,
      },
    )
    .then(() => {
      pubsub.publish('datasetValidationUpdated', {})
      return true
    })
}
