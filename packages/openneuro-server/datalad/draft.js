/**
 * Manage serving a Draft object based on DataLad working trees
 */
import request from 'superagent'
import mongo from '../libs/mongo.js'
import { redis } from '../libs/redis.js'
import config from '../config.js'
import { addFileUrl } from './utils.js'
import publishDraftUpdate from '../graphql/utils/publish-draft-update.js'
const uri = config.datalad.uri

const draftFilesKey = datasetId => {
  return `openneuro:draftFiles:${datasetId}`
}

export const expireDraftFiles = datasetId => {
  return redis.del(draftFilesKey(datasetId))
}

/**
 * Retrieve draft files from cache or the datalad-service backend
 * @param {string} datasetId Accession number string
 * @param {object} options { untracked: true } - ignores the git index
 */
export const getDraftFiles = async (datasetId, options = {}) => {
  // If untracked is set and true
  const untracked = 'untracked' in options && options.untracked
  const query = untracked ? { untracked: true } : {}
  const filesUrl = `${uri}/datasets/${datasetId}/files`
  const key = draftFilesKey(datasetId)
  return redis.get(key).then(data => {
    if (!untracked && data) return JSON.parse(data)
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
          return filesWithUrls
        })
  })
}

export const updateDatasetRevision = (datasetId, gitRef) => {
  /**
   * Update the revision pointer in a draft on changes
   */
  return mongo.collections.crn.datasets
    .update(
      { id: datasetId },
      { $set: { revision: gitRef, modified: new Date() } },
    )
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
    mongo.collections.crn.datasets.findOne({ id: datasetId }).then(obj => {
      if (obj) {
        resolve(obj.revision)
      } else {
        reject(null)
      }
    })
  })
}

export const getPartialStatus = datasetId => {
  const partialUrl = `${uri}/datasets/${datasetId}/draft`
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
