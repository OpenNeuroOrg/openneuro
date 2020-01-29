import pubsub from '../pubsub.js'
import { withFilter } from 'graphql-subscriptions'

/**
 * Filter subscription to a specific dataset
 * @param {object} payload
 * @param {object} variables
 * @returns {boolean}
 */
const filterDatasetId = (payload, variables) =>
  variables.datasetIds.includes(payload.datasetId)

export const datasetCreated = () => ({
  subscribe: () => pubsub.asyncIterator('datasetCreated'),
})

export const datasetDeleted = () => ({
  type: 'ID!',
  subscribe: withFilter(
    () => pubsub.asyncIterator('datasetDeleted'),
    filterDatasetId,
  ),
  args: {
    datasetIds: '[ID!]',
  },
})

export const snapshotAdded = {
  type: 'Snapshot',
  subscribe: withFilter(
    () => pubsub.asyncIterator('snapshotAdded'),
    filterDatasetId,
  ),
  args: {
    datasetId: 'ID!',
  },
}

export const snapshotDeleted = {
  type: 'ID',
  subscribe: withFilter(
    () => pubsub.asyncIterator('snapshotDeleted'),
    filterDatasetId,
  ),
  args: {
    datasetId: 'ID!',
  },
}

export const draftUpdated = {
  type: 'Dataset',
  subscribe: withFilter(
    () => pubsub.asyncIterator('draftUpdated'),
    filterDatasetId,
  ),
  args: {
    datasetId: 'ID!',
  },
}

export const permissionsUpdated = {
  type: 'Dataset',
  subscribe: withFilter(
    () => pubsub.asyncIterator('permissionsUpdated'),
    filterDatasetId,
  ),
  args: {
    datasetIds: '[ID!]',
  },
}

export const filesUpdated = {
  type: 'FilesUpdate',
  subscribe: withFilter(
    () => pubsub.asyncIterator('filesUpdated'),
    filterDatasetId,
  ),
  args: {
    datasetId: 'ID!',
  },
}

const Subscription = {
  datasetDeleted,
  snapshotAdded,
  snapshotDeleted,
  permissionsUpdated,
  draftUpdated,
  filesUpdated,
}

export default Subscription
