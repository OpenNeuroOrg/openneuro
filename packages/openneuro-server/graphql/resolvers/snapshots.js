import * as datalad from '../../datalad/snapshots.js'
import { dataset, analytics } from './dataset.js'
import { checkDatasetWrite } from '../permissions.js'
import { readme } from './readme.js'
import { description } from './description.js'

export const snapshots = obj => {
  return datalad.getSnapshots(obj.id)
}

export const snapshot = (obj, { datasetId, tag }, context) => {
  return datalad.getSnapshot(datasetId, tag).then(snapshot => ({
    ...snapshot,
    dataset: () => dataset(snapshot, { id: datasetId }, context),
    description: () => description(obj, { datasetId, tag }),
    readme: () => readme(obj, { datasetId, revision: tag }),
  }))
}

/**
 * Tag the working tree for a dataset
 */
export const createSnapshot = (obj, { datasetId, tag }, { user, userInfo }) => {
  return checkDatasetWrite(datasetId, user, userInfo).then(() => {
    return datalad.createSnapshot(datasetId, tag, userInfo)
  })
}

/**
 * Remove a tag from a dataset
 */
export const deleteSnapshot = (obj, { datasetId, tag }, { user, userInfo }) => {
  return checkDatasetWrite(datasetId, user, userInfo).then(() => {
    return datalad.deleteSnapshot(datasetId, tag)
  })
}

/**
 * Update the file urls within a snapshot
 */
export const updateSnapshotFileUrls = (obj, { fileUrls }) => {
  const datasetId = fileUrls.datasetId
  const snapshotTag = fileUrls.tag
  const files = fileUrls.files
  return datalad.updateSnapshotFileUrls(datasetId, snapshotTag, files)
}

const Snapshot = {
  analytics: snapshot => analytics(snapshot),
}

export default Snapshot
