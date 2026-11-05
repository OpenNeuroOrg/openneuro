import { getDatasetWorker } from "../libs/datalad-service"

/**
 * Run remote reexporter.
 */
export const runReexporter = async (datasetId) => {
  const worker = getDatasetWorker(datasetId)
  const uri = `http://${worker}/datasets/${datasetId}/reexport-remotes`
  const response = await fetch(uri, { method: "POST" })
  if (!response.ok) {
    throw new Error(
      `Failed to run reexporter for dataset "${datasetId}": ${response.status} ${response.statusText}`,
    )
  }
  return response
}

export const CHECK = "hi"
