/**
 * Get description data from backend
 */
import config from '../config'
import request from 'superagent'
import { redis } from '../libs/redis.js'
import { commitFiles } from './dataset.js'
import { objectUrl, getFiles } from './files.js'
import { generateDataladCookie } from '../libs/authentication/jwt'
import { getDatasetWorker } from '../libs/datalad-service'
import CacheItem, { CacheType } from '../cache/item'
import { datasetOrSnapshot } from './utils.js'

export const defaultDescription = {
  Name: 'Unnamed Dataset',
  BIDSVersion: '1.1.1',
}

/**
 * Find dataset_description.json id and fetch description object
 * @param {string} datasetId
 * @returns {(files: [Object]) => Promise} Promise resolving to dataset_description.json contents or defaults
 */
export const getDescriptionObject = datasetId => files => {
  const file = files.find(f => f.filename === 'dataset_description.json')
  if (file) {
    return request
      .get(objectUrl(datasetId, file.key))
      .then(({ body, type }) => {
        // Guard against non-JSON responses
        if (type === 'application/json') return body
        else throw new Error('dataset_description.json is not JSON')
      })
      .catch(() => {
        // dataset_description does not exist or is not JSON, return default fields
        return defaultDescription
      })
  } else {
    return Promise.resolve(defaultDescription)
  }
}

export const descriptionCacheKey = (datasetId, revision) => {
  return `openneuro:dataset_description.json:${datasetId}:${revision}`
}

export const repairDescriptionTypes = description => {
  const newDescription = { ...description }
  // Array types
  if (
    description.hasOwnProperty('Authors') &&
    !Array.isArray(description.Authors)
  ) {
    newDescription.Authors = [description.Authors]
  }
  if (
    description.hasOwnProperty('ReferencesAndLinks') &&
    !Array.isArray(description.ReferencesAndLinks)
  ) {
    newDescription.ReferencesAndLinks = [description.ReferencesAndLinks]
  }
  if (
    description.hasOwnProperty('Funding') &&
    !Array.isArray(description.Funding)
  ) {
    newDescription.Funding = [description.Funding]
  }
  // String types
  if (
    description.hasOwnProperty('Name') &&
    typeof description.Name !== 'string'
  ) {
    newDescription.Name = JSON.stringify(description.Name) || ''
  }
  if (
    description.hasOwnProperty('DatasetDOI') &&
    typeof description.DatasetDOI !== 'string'
  ) {
    newDescription.DatasetDOI = JSON.stringify(description.DatasetDOI) || ''
  }
  if (
    description.hasOwnProperty('Acknowledgements') &&
    typeof description.Acknowledgements !== 'string'
  ) {
    newDescription.Acknowledgements =
      JSON.stringify(description.Acknowledgements) || ''
  }
  if (
    description.hasOwnProperty('HowToAcknowledge') &&
    typeof description.HowToAcknowledge !== 'string'
  ) {
    newDescription.HowToAcknowledge =
      JSON.stringify(description.HowToAcknowledge) || ''
  }
  return newDescription
}

/**
 * Get a parsed dataset_description.json
 * @param {object} obj dataset or snapshot object
 */
export const description = obj => {
  // Obtain datasetId from Dataset or Snapshot objects
  const { datasetId, revision } = datasetOrSnapshot(obj)
  const cache = new CacheItem(redis, CacheType.datasetDescription, [
    datasetId,
    revision,
  ])
  return cache
    .get(() => {
      return getFiles(datasetId, revision)
        .then(getDescriptionObject(datasetId))
        .then(uncachedDescription => ({ id: revision, ...uncachedDescription }))
    })
    .then(description => repairDescriptionTypes(description))
}

export const setDescription = (datasetId, user, descriptionFieldUpdates) => {
  const url = `${getDatasetWorker(datasetId)}/datasets/${datasetId}/description`
  return request
    .post(url)
    .send({ description_fields: descriptionFieldUpdates }) // eslint-disable-line @typescript-eslint/camelcase
    .set('Accept', 'application/json')
    .set('Cookie', generateDataladCookie(config)(user))
    .then(res => {
      const description = res.body
      return commitFiles(datasetId, user).then(gitRef => ({
        id: gitRef,
        ...description,
      }))
    })
}
