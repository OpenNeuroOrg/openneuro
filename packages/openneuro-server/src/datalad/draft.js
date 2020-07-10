/**
 * Manage serving a Draft object based on DataLad working trees
 */
import request from 'superagent'
import Dataset from '../models/dataset.js'
import { redis } from '../libs/redis'
import CacheItem, { CacheType } from '../cache/item'
import { addFileUrl } from './utils.js'
import publishDraftUpdate from '../graphql/utils/publish-draft-update.js'
import { generateFileId } from '../graphql/utils/file.js'
import { getDatasetWorker } from '../libs/datalad-service'

export const expireDraftFiles = datasetId => {
  const cache = new CacheItem(redis, CacheType.commitFiles, [datasetId])
  return cache.drop()
}

/**
 *
 * @param {object} file
 * @param {string} file.filename '/' delimited
 * @param {string|number} file.size
 */
const withGeneratedId = file => ({
  ...file,
  id: generateFileId(file.filename.split('/').join(':'), file.size),
})

/**
 * Retrieve draft files from cache or the datalad-service backend
 * @param {string} datasetId Accession number string
 * @param {object} options { untracked: true } - ignores the git index
 */
export const getDraftFiles = (datasetId, options = {}) => {
  // If untracked is set and true
  const untracked = 'untracked' in options && options.untracked
  const query = untracked ? { untracked: true } : {}
  const filesUrl = `${getDatasetWorker(datasetId)}/datasets/${datasetId}/files`
  if (untracked) {
    return request
      .get(filesUrl)
      .query(query)
      .set('Accept', 'application/json')
      .then(({ body: { files } }) => files.map(withGeneratedId))
  } else {
    const cache = new CacheItem(redis, CacheType.commitFiles, [datasetId])
    return cache.get(() =>
      request
        .get(filesUrl)
        .query(query)
        .set('Accept', 'application/json')
        .then(({ body: { files } }) => {
          const filesWithUrls = files.map(addFileUrl(datasetId))
          return filesWithUrls.map(withGeneratedId)
        }),
    )
  }
}

export const updateDatasetRevision = (datasetId, gitRef) => {
  /**
   * Update the revision pointer in a draft on changes
   */
  return Dataset.updateOne(
    { id: datasetId },
    { revision: gitRef, modified: new Date() },
  )
    .exec()
    .then(() => {
      // Remove the now invalid draft files cache
      return expireDraftFiles(datasetId)
    })
    .then(() => publishDraftUpdate(datasetId, gitRef))
}

export const getDatasetRevision = async datasetId => {
  return new Promise((resolve, reject) => {
    Dataset.findOne({ id: datasetId })
      .exec()
      .then(obj => {
        if (obj) {
          resolve(obj.revision)
        } else {
          reject(null)
        }
      })
  })
}

export const getPartialStatus = datasetId => {
  const partialUrl = `${getDatasetWorker(
    datasetId,
  )}/datasets/${datasetId}/draft`
  const cache = new CacheItem(redis, CacheType.partial, [datasetId])
  return cache.get(() =>
    request
      .get(partialUrl)
      .set('Accept', 'application/json')
      .then(({ body: { partial } }) => partial),
  )
}
