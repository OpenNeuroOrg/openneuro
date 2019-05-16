import pubsub from '../pubsub'

export default (datasetId, revision) => {
  pubsub.publish('draftUpdated', {
    datasetId: datasetId,
    draftUpdated: {
      __typename: 'Dataset',
      id: datasetId,
      revision,
      modified: Date(), // Set date to now
    },
  })
}
