import Issue from '../../models/issue'
import publishDraftUpdate from '../utils/publish-draft-update.js'

/**
 * Save issues data returned by the datalad service
 *
 * Returns only a boolean if successful or not
 */
export const updateValidation = (obj, args) => {
  return Issue.updateOne(
    { id: args.validation.id, datasetId: args.validation.datasetId },
    args.validation,
    {
      upsert: true,
    },
  )
    .exec()
    .then(() => {
      publishDraftUpdate(args.validation.datasetId, args.validation.id)
      return true
    })
}
