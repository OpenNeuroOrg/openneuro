/**
 * Manage serving a Draft object based on DataLad working trees
 */
import request from 'superagent'
import Dataset from '../models/dataset.js'
import { redis } from '../libs/redis.js'
import { addFileUrl } from './utils.js'
import publishDraftUpdate from '../graphql/utils/publish-draft-update.js'
import { generateFileId } from '../graphql/utils/file.js'
import { getDatasetWorker } from '../libs/datalad-service'

const draftFilesKey = datasetId => {
  return `openneuro:draftFiles:${datasetId}`
}

export const expireDraftFiles = datasetId => {
  return redis.del(draftFilesKey(datasetId))
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
  const key = draftFilesKey(datasetId)
  return redis.get(key).then(data => {
    if (!untracked && data) return JSON.parse(data).map(withGeneratedId)
    else
      return request
        .get(filesUrl)
        .query(query)
        .set('Accept', 'application/json')
        .then(({ body: { files } }) => {
          const filesWithUrls = files.map(addFileUrl(datasetId))
          if (!untracked) {
            redis.set(key, JSON.stringify(filesWithUrls))
          }
          return filesWithUrls.map(withGeneratedId)
        })
  })
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

export const draftPartialKey = datasetId => {
  return `openneuro:partialDraft:${datasetId}`
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
  const key = draftPartialKey(datasetId)
  return redis.get(key).then(data => {
    if (data) return JSON.parse(data)
    else
      return request
        .get(partialUrl)
        .set('Accept', 'application/json')
        .then(({ body: { partial } }) => {
          redis.set(key, JSON.stringify(partial))
          return partial
        })
  })
}
