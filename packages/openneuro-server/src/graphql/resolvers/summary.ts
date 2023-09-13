import Summary, { SummaryDocument } from '../../models/summary'
import { datasetType } from './datasetType'

/**
 * Summary resolver
 */
export async function summary(dataset): Promise<Partial<SummaryDocument>> {
  const datasetSummary = (
    await Summary.findOne({
      id: dataset.revision,
      datasetId: dataset.id,
      // Match if we have no validatorMetadata or the correct 'legacy' / 'schema' value if we do
      $or: [
        { 'validatorMetadata.validator': await datasetType(dataset) },
        { validatorMetadata: { $exists: false } },
      ],
    }).exec()
  )?.toObject()
  if (datasetSummary) {
    return {
      ...datasetSummary,
      primaryModality: datasetSummary?.modalities[0],
    }
  } else {
    return null
  }
}

/**
 * Save summary data returned by the datalad service
 *
 * Returns the saved summary if successful
 */
export const updateSummary = (obj, args) => {
  return Summary.updateOne(
    {
      id: args.summary.id,
      datasetId: args.summary.datasetId,
      validatorMetadata: args.summary.validatorMetadata,
    },
    args.summary,
    {
      upsert: true,
    },
  )
    .exec()
    .then(() => args.summary)
}
