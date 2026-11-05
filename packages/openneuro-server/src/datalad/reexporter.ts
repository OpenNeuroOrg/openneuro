import {
  assertWorkerResponse,
  discardWorkerResponse,
  getDatasetWorker,
} from "../libs/datalad-service"

/**
 * Run remote reexporter.
 */
export const runReexporter = async (datasetId) => {
  const worker = getDatasetWorker(datasetId)
  const uri = `http://${worker}/datasets/${datasetId}/reexport-remotes`
  const response = await fetch(uri, { method: "POST" })
  await assertWorkerResponse(
    response,
    `Failed to run reexporter for dataset "${datasetId}"`,
  )
  await discardWorkerResponse(response)
}

export const CHECK = "hi"
