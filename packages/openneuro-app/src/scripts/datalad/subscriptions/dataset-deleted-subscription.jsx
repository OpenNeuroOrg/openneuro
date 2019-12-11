import React from 'react'
import PropTypes from 'prop-types'
import { Subscription } from 'react-apollo'
import gql from 'graphql-tag'

const DATASET_DELETED_SUBSCRIPTION = gql`
  subscription datasetDeleted($datasetIds: [ID!]) {
    datasetDeleted(datasetIds: $datasetIds) {
      datasetId
    }
  }
`

const DatasetDeletedSubscription = ({ datasetIds, onDeleted }) => (
  <Subscription
    subscription={DATASET_DELETED_SUBSCRIPTION}
    variables={{ datasetIds: datasetIds }}
    onSubscriptionData={() => {
      // triggers a redirect to dashboard if on the deleted dataset's page
      // triggers a reload if on a dashboard page containing the deleted dataset
      if (typeof onDeleted === 'function') onDeleted()
    }}
  />
)

DatasetDeletedSubscription.propTypes = {
  datasetIds: PropTypes.array,
  onDeleted: PropTypes.func,
}

export default DatasetDeletedSubscription
