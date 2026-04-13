import { getDraftRevision } from "../../datalad/draft"
import Summary from "../../models/summary"
import type { SummaryDocument } from "../../models/summary"

/**
 * Summary resolver
 */
export async function summary(dataset): Promise<Partial<SummaryDocument>> {
  const datasetSummary = (
    await Summary.findOne({
      id: dataset.revision,
      datasetId: dataset.id,
      $or: [
        { "validatorMetadata.validator": "schema" },
        { "validatorMetadata.validator": "legacy" },
        { validatorMetadata: { $exists: false } },
      ],
    }).exec()
  )?.toObject()
  if (datasetSummary) {
    return {
      ...datasetSummary,
      // Lowercase all modality fields
      modalities: datasetSummary?.modalities?.map((str) => str.toLowerCase()),
      secondaryModalities: datasetSummary?.secondaryModalities?.map(
        (str) => str.toLowerCase(),
      ),
      primaryModality: datasetSummary?.modalities[0]?.toLowerCase(),
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

/**
 * Get the primary modality for a dataset from the validator summary.
 * Returns undefined if no summary is available.
 */
export async function getPrimaryModality(
  datasetId: string,
): Promise<string | undefined> {
  try {
    const revision = await getDraftRevision(datasetId)
    const result = await summary({ id: datasetId, revision })
    return result?.primaryModality || undefined
  } catch {
    return undefined
  }
}
