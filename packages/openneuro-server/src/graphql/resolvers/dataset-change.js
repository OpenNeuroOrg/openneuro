import DatasetChange from '../../models/datasetChange.js'

export const datasetChanges = (_, { limit = 100 }) => {
  return DatasetChange.find().sort({ $natural: -1 }).limit(limit)
}
