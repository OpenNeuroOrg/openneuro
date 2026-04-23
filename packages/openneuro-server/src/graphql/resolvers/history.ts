import { getDatasetWorker } from "../../libs/datalad-service"
import type { DatasetDocument } from "../../models/dataset"

export const history = async (obj: DatasetDocument) => {
  const datasetId = obj.id
  const historyUrl = `http://${
    getDatasetWorker(
      datasetId,
    )
  }/datasets/${datasetId}/history`
  const resp = await fetch(historyUrl)
  const { log } = await resp.json()
  return log
}
