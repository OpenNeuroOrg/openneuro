import request from "superagent"
import { getDatasetWorker } from "../libs/datalad-service"

/**
 * Run remote reexporter.
 */
export const runReexporter = (datasetId) => {
  const worker = getDatasetWorker(datasetId)
  const uri = `${worker}/datasets/${datasetId}/reexport-remotes`
  return request.post(uri)
}

export const CHECK = "hi"
