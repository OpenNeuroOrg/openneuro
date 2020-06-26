import Summary from '../../models/summary'

/**
 * Summary resolver
 */
export const summary = dataset => {
  return Summary.findOne({
    id: dataset.revision,
    datasetId: dataset.id,
  }).exec()
}

/**
 * Save summary data returned by the datalad service
 *
 * Returns the saved summary if successful
 */
export const updateSummary = (obj, args) => {
  return Summary.updateOne(
    { id: args.summary.id, datasetId: args.summary.datasetId },
    args.summary,
    {
      upsert: true,
    },
  )
    .exec()
    .then(() => args.summary)
}
