import pubsub from '../pubsub.js'

import { withFilter } from 'graphql-subscriptions'

/**
 * Filter subscription to a specific dataset
 * @param {object} payload
 * @param {object} variables
 * @returns {boolean}
 */
const filterDatasetId = (payload, variables) => {
  const { datasetId, datasetIds } = variables
  if (datasetId) return datasetId === payload.datasetId
  if (datasetIds) return datasetIds.includes(payload.datasetId)
  return false
}

export const datasetDeleted = () => ({
  subscribe: withFilter(
    () => pubsub.asyncIterator('datasetDeleted'),
    filterDatasetId,
  ),
})

export const snapshotsUpdated = () => ({
  subscribe: withFilter(
    () => pubsub.asyncIterator('snapshotsUpdated'),
    filterDatasetId,
  ),
})

export const draftUpdated = () => ({
  subscribe: withFilter(
    () => pubsub.asyncIterator('draftUpdated'),
    filterDatasetId,
  ),
})

export const permissionsUpdated = () => ({
  subscribe: withFilter(
    () => pubsub.asyncIterator('permissionsUpdated'),
    filterDatasetId,
  ),
})

export const filesUpdated = () => ({
  subscribe: withFilter(
    () => pubsub.asyncIterator('filesUpdated'),
    filterDatasetId,
  ),
})

export const datasetChanged = () => ({
  subscribe: () => pubsub.asyncIterator('datasetChanged'),
})

const Subscription = {
  datasetDeleted,
  snapshotsUpdated,
  permissionsUpdated,
  draftUpdated,
  filesUpdated,
  datasetChanged,
}

export default Subscription
