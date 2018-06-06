import config from '../config'
import request from 'superagent'
import { getAccessionNumber } from '../libs/dataset'

/**
 * Handlers for datalad dataset manipulation
 *
 * Access and caching is handled here so that it can be coordinated with other
 * web nodes independent of the DataLad service.
 *
 * Unlike the other handlers, these use superagent for performance reasons
 */

const URI = config.datalad.uri

/**
 * Create a DataLad repo
 */
export const createDataset = async (req, res) => {
  const accessionNumber = await getAccessionNumber()
  const uri = `${URI}/datasets/${accessionNumber}`
  request.post(uri).then(() => {
    res.send()
  })
}

export const deleteDataset = (req, res) => {
  const datasetId = req.params.datasetId
  const uri = `${URI}/datasets/${datasetId}`
  request.del(uri).then(() => {
    res.send()
  })
}

/**
 * Create a git tag representing a snapshot
 */
export const createSnapshot = (req, res) => {
  const datasetId = req.params.datasetId
  const snapshotId = req.params.snapshotId
  const uri = `${URI}/datasets/${datasetId}/snapshots/${snapshotId}`
  request.post(uri).then(() => {
    res.send()
  })
}

/** Migrate a dataset from the private to public aws bucket */
export const publishDataset = (req, res) => {
  const datasetId = req.params.datasetId
  const uri = `${URI}/datasets/${datasetId}/publish`
  request.post(uri).then(() => {
    res.send()
  })
}

/** Migrate a dataset from the private to public aws bucket */
export const unpublishDataset = (req, res) => {
  const datasetId = req.params.datasetId
  const uri = `${URI}/datasets/${datasetId}/publish`
  request.del(uri).then(() => {
    res.send()
  })
}

/**
 * Get a file from a dataset
 */
export const getFile = (req, res) => {
  const datasetId = req.params.datasetId
  const snapshotId = req.params.snapshotId
  const filename = req.params.filename
  res.set('Content-Type', 'application/*')
  let uri = `${URI}/datasets/${datasetId}/files/${filename}`
  if (snapshotId) {
    uri = `${URI}/datasets/${datasetId}/snapshots/${snapshotId}/files/${filename}`
  }
  
  return request.get(uri)
    .pipe(res)
}
