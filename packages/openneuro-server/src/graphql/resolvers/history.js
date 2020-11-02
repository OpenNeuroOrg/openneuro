import { getDatasetWorker } from '../../libs/datalad-service.js'

export const history = async obj => {
  const historyUrl = `${getDatasetWorker(
    datasetId,
  )}/datasets/${datasetId}/history`
  const resp = await fetch(historyUrl)
  const { log } = await resp.json()
  return log
}
