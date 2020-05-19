import mongo from '../../libs/mongo.js'
import publishDraftUpdate from '../utils/publish-draft-update.js'

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
      publishDraftUpdate(args.validation.datasetId, args.validation.id)
      return true
    })
}
