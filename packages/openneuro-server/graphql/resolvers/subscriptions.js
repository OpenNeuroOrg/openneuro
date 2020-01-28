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
  type: '[Permission]',
  subscribe: withFilter(
    () => pubsub.asyncIterator('permissionsUpdated'),
    filterDatasetId,
  ),
  args: {
    datasetId: 'ID!',
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
  snapshotAdded,
  snapshotDeleted,
  permissionsUpdated,
  draftUpdated,
  filesUpdated,
}

export default Subscription
