import fetch from 'node-fetch'
import { addFileString, commitFiles } from './dataset'
import { redis } from '../libs/redis'
import CacheItem, { CacheType } from '../cache/item'
import { getDatasetWorker } from '../libs/datalad-service'
import { datasetOrSnapshot } from './utils.js'

export const readmeUrl = (datasetId, revision) => {
  return `http://${getDatasetWorker(
    datasetId,
  )}/datasets/${datasetId}/snapshots/${revision}/files/README`
}

export const readme = obj => {
  const { datasetId, revision } = datasetOrSnapshot(obj)
  const cache = new CacheItem(redis, CacheType.readme, [
    datasetId,
    revision.substring(0, 7),
  ])
  return cache.get(async () => {
    /** Why are we using fetch here instead of superagent?
     * The backend guesses wrong at the MIME type so fetch lets us get the string
     * without messing around with superagent parsers
     *
     * We may want to use less superagent anyways just to avoid library weight
     */
    const readmeReq = await fetch(readmeUrl(datasetId, revision))
    if (readmeReq.status === 200) {
      return await readmeReq.text()
    } else {
      return null
    }
  })
}

export const setReadme = (datasetId, readme, user) => {
  return addFileString(datasetId, 'README', 'text/plain', readme).then(() =>
    commitFiles(datasetId, user),
  )
}
