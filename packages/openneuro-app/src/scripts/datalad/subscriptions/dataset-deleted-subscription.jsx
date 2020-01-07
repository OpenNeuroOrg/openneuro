import React from 'react'
import PropTypes from 'prop-types'
import { Subscription } from 'react-apollo'
import gql from 'graphql-tag'
// import { datasetCacheId } from '../mutations/cache-id.js'

const DATASET_DELETED_SUBSCRIPTION = gql`
  subscription datasetDeleted($datasetIds: [ID!]) {
    datasetDeleted(datasetIds: $datasetIds) {
      datasetId
      testProp
    }
  }
`

const DatasetDeletedSubscription = ({ datasetIds }) => (
  console.log('subscribed to delete dataset for: ', datasetIds.join(', ')),
  (
    <Subscription
      subscription={DATASET_DELETED_SUBSCRIPTION}
      variables={{ datasetIds: datasetIds }}
      onSubscriptionData={({ client, subscriptionData: { data } }) => {
        console.log('dataset deleted')
        console.log({ data, client })
      }}
    />
  )
)

DatasetDeletedSubscription.propTypes = {
  datasetIds: PropTypes.array,
}

export default DatasetDeletedSubscription
