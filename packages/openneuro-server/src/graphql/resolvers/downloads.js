import { checkDatasetRead } from '../permissions.js'
import { getDataset } from '../../datalad/dataset.js'
import { getSnapshot } from '../../datalad/snapshots.js'
import { getFiles, filterFiles } from '../../datalad/files.js'

export const downloadDataset = (obj, { datasetId }, { user, userInfo }) => {
  return checkDatasetRead(datasetId, user, userInfo)
    .then(() => getDataset(datasetId))
    .then(dataset => dataset.draft.files)
}

export const downloadSnapshot = (obj, { datasetId, tag }, context) => {
  return checkDatasetRead(datasetId, context.user, context.userInfo)
    .then(() => getSnapshot(datasetId, tag))
    .then(snapshot => ({
      files: ({ prefix }) =>
        getFiles(datasetId, snapshot.hexsha).then(filterFiles(prefix)),
    }))
    .then(({ files }) => files)
}
