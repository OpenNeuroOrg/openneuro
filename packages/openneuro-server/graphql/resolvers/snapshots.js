import { getSnapshot, getSnapshots } from '../../datalad/snapshots.js'
import { dataset } from './dataset.js'

export const snapshots = obj => {
  return getSnapshots(obj.id)
}

export const snapshot = (obj, { datasetId, tag }, context) => {
  return getSnapshot(datasetId, tag).then(snapshot => ({
    ...snapshot,
    dataset: () => dataset(snapshot, { id: datasetId }, context),
  }))
}
