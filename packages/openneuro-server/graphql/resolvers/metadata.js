import MetadataModel from '../../models/metadata.js'

/**
 * Summary resolver
 */
export const metadata = dataset => {
  return MetadataModel.findOne({
    datasetId: dataset.id,
  })
}

/**
 * upserts metadata
 */
export const addMetadata = async (obj, { datasetId, metadata }) => {
  const result = await MetadataModel
    .findOneAndUpdate(
      { datasetId },
      metadata,
      {
        new: true,
        upsert: true,
      },
    )
  return result
}
