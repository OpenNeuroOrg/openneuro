import fetch from 'node-fetch'
import { addFileString, commitFiles } from './dataset.js'
import { redis } from '../libs/redis.js'
import { getDatasetWorker } from '../libs/datalad-service'

export const readmeUrl = (datasetId, revision) => {
  return `http://${getDatasetWorker(
    datasetId,
  )}/datasets/${datasetId}/snapshots/${revision}/files/README`
}

export const readmeKey = (datasetId, revision) =>
  `openneuro:readme:${datasetId}:${revision}`

export const readme = async (obj, { datasetId, revision }) => {
  const key = readmeKey(datasetId, revision)
  const data = await redis.get(key)
  if (data) {
    return data
  } else {
    /** Why are we using fetch here instead of superagent?
     * The backend guesses wrong at the MIME type so fetch lets us get the string
     * without messing around with superagent parsers
     *
     * We may want to use less superagent anyways just to avoid library weight
     */
    const readmeReq = await fetch(readmeUrl(datasetId, revision))
    if (readmeReq.status === 200) {
      const readmeContent = await readmeReq.text()
      redis.set(key, readmeContent)
      return readmeContent
    } else {
      return null
    }
  }
}

export const setReadme = (datasetId, readme, user) => {
  return addFileString(datasetId, 'README', 'text/plain', readme).then(() =>
    commitFiles(datasetId, user),
  )
}
