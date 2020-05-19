import config from '../config'
import request from 'superagent'
import mime from 'mime-types'
import { getDatasetRevision } from '../datalad/draft'
import { getSnapshot } from '../datalad/snapshots'
import { decodeFilePath, getFiles } from '../datalad/files.js'

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
 * Get a file from a dataset
 */
export const getFile = async (req, res) => {
  const datasetId = req.params.datasetId
  const snapshotId = req.params.snapshotId
  const filename = req.params.filename
  const decodedFilename = decodeFilePath(filename)
  let fileList = []
  let data
  if (snapshotId) {
    data = await getSnapshot(datasetId, snapshotId)
    fileList = data ? data.files : []
  } else {
    const currentRevision = await getDatasetRevision(datasetId)
    if (currentRevision) {
      fileList = await getFiles(datasetId, currentRevision)
    }
  }
  const file = fileList.find(f => {
    return f.filename == decodedFilename
  })
  const filepath = file ? file.key : null
  res.set('Content-Type', mime.lookup(filename) || 'application/octet-stream')
  const uri = `${URI}/datasets/${datasetId}/objects/${filepath}`
  return request.get(uri).pipe(res)
}
