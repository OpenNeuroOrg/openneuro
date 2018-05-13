import mongo from '../../libs/mongo.js'

/**
 * Save validation data returned by the datalad service
 *
 * Returns only a boolean if successful or not
 *
 * updateValidation(datasetId: ID!, ref: String!, summary: Summary, issues: [ValidationIssue])
 */
export const updateValidation = (obj, args) => {
  const validations = mongo.collections.crn.draftValidations
  return validations
    .update({ datasetId: args.datasetId, ref: args.ref }, args, {
      upsert: true,
    })
    .then(() => true)
}
