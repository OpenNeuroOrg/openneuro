import config from '../../../../config.js'

export const downloadUri = (datasetId, snapshotTag) =>
  // This can't be a GraphQL query since it is intercepted
  // by the service worker
  snapshotTag
    ? `${config.crn.url}datasets/${datasetId}/snapshots/${snapshotTag}/download`
    : `${config.crn.url}datasets/${datasetId}/download`
