import React from 'react'
import PropTypes from 'prop-types'
import { Subscription } from 'react-apollo'
import gql from 'graphql-tag'
import { datasetCacheId } from '../mutations/cache-id.js'

const DATASET_DELETED_SUBSCRIPTION = gql`
  subscription datasetDeleted($datasetIds: [ID!]) {
    datasetDeleted(datasetIds: $datasetIds) {
      datasetId
    }
  }
`

const DatasetDeletedSubscription = ({ datasetIds, onDeleted }) => (
  console.log('subscribed to delete dataset for: ', datasetIds.join(', ')),
  (
    <Subscription
      subscription={DATASET_DELETED_SUBSCRIPTION}
      variables={{ datasetIds: datasetIds }}
      onSubscriptionData={({ client, subscriptionData }) => {
        const { datasetId } = subscriptionData.data.datasetDeleted
        const { cache } = client
        console.log({ cache, datasetId })
        if (typeof onDeleted === 'function') onDeleted()
      }}
    />
  )
)

DatasetDeletedSubscription.propTypes = {
  datasetIds: PropTypes.array,
}

export default DatasetDeletedSubscription
