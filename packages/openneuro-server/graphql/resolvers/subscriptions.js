import pubsub from '../pubsub.js'

export const datasetAdded = {
  subscribe: () => pubsub.asyncIterator('datasetAdded'),
}

export const datasetDeleted = {
  subscribe: () => pubsub.asyncIterator('datasetDeleted'),
}
