import pubsub from '../pubsub.js'
import { withFilter } from 'graphql-subscriptions'

/**
 * Filter subscription to a specific dataset
 * @param {object} payload
 * @param {object} variables
 * @returns {boolean}
 */
const filterDatasetId = (payload, variables) =>
  payload.datasetId === variables.datasetId

export const datasetCreated = () => ({
  subscribe: () => pubsub.asyncIterator('datasetCreated'),
})

export const datasetDeleted = () => ({
  subscribe: () => pubsub.asyncIterator('datasetDeleted'),
})

export const snapshotAdded = () => ({
  subscribe: withFilter(
    () => pubsub.asyncIterator('snapshotAdded'),
    filterDatasetId,
  ),
})

export const snapshotDeleted = () => ({
  subscribe: withFilter(
    () => pubsub.asyncIterator('snapshotDeleted'),
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

const Subscription = {
  datasetCreated,
  datasetDeleted,
  snapshotAdded,
  snapshotDeleted,
  permissionsUpdated,
  draftUpdated,
  filesUpdated,
}

export default Subscription
