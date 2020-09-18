import request from 'superagent'
import mime from 'mime-types'
import { getDatasetWorker } from '../libs/datalad-service'

/**
 * Handlers for datalad dataset manipulation
 *
 * Access and caching is handled here so that it can be coordinated with other
 * web nodes independent of the DataLad service.
 *
 * Unlike the other handlers, these use superagent for performance reasons
 */

/**
 * Get a file from a dataset
 */
export const getFile = (req, res) => {
  const { datasetId, snapshotId, filename } = req.params
  const worker = getDatasetWorker(datasetId)
  res.set('Content-Type', mime.lookup(filename) || 'application/octet-stream')
  const uri = snapshotId
    ? `${worker}/datasets/${datasetId}/snapshots/${snapshotId}/files/${filename}`
    : `${worker}/datasets/${datasetId}/files/${filename}`
  return request.get(uri).pipe(res)
}
