import request from 'superagent'
import { getDatasetWorker } from '../libs/datalad-service'

/**
 * Run remote reexporter.
 */
export const runReexporter = datasetId => {
  const worker = getDatasetWorker(datasetId)
  const uri = `${worker}/reexport-remotes/${datasetId}`
  return request.post(uri)
}

export const CHECK = 'hi'
