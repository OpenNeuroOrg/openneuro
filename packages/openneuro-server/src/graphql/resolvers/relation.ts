import Dataset from '../../models/dataset'
import { checkDatasetAdmin } from '../permissions'
import { DOIPattern } from '../../libs/doi/normalize'

export const createRelation = async (
  obj,
  { datasetId, doi, relation, kind, description },
  { user, userInfo },
) => {
  await checkDatasetAdmin(datasetId, user, userInfo)
  // Validate the right DOI format
  if (!doi.startsWith('doi:') || !doi.slice(4).match(DOIPattern)) {
    throw new Error(
      'DOI format must follow BIDS recommended format (see https://bids-specification.readthedocs.io/en/stable/02-common-principles.html#uniform-resource-indicator)',
    )
  }
  const dataset = await Dataset.findOneAndUpdate(
    { id: datasetId },
    { $push: { related: { id: doi, relation, kind, description } } },
    { new: true },
  )
    .lean()
    .exec()
  return dataset
}

export const deleteRelation = async (
  obj,
  { datasetId, doi },
  { user, userInfo },
) => {
  await checkDatasetAdmin(datasetId, user, userInfo)
  return await Dataset.findOneAndUpdate(
    { id: datasetId },
    { $pull: { related: { id: doi } } },
    { new: true },
  )
    .lean()
    .exec()
}
