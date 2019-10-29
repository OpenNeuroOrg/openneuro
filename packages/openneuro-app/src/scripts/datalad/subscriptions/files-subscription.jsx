import React from 'react'
import PropTypes from 'prop-types'
import { Subscription } from 'react-apollo'
import gql from 'graphql-tag'
// import { datasetCacheId } from '../mutations/cache-id.js'
import {} from '../dataset/dataset-query-fragments.js'

const FILES_SUBSCRIPTION = gql`
  subscription filesUpdated($datasetId: ID!) {
    filesUpdated(datasetId: $datasetId) {
      datasetId
      action
      files
      snapshot
    }
  }
`

const FilesSubscription = ({ datasetId }) => (
  console.log('subscribed to ', datasetId),
  (
    <Subscription
      subscription={FILES_SUBSCRIPTION}
      variables={{ datasetId }}
      // onSubscriptionData={({ client, subscriptionData: { data } }) => {
      onSubscriptionData={payload => {
        console.log(payload)
        // client.writeFragment({
        //   id: datasetCacheId(datasetId),
        //   fragment: DRAFT_FRAGMENT,
        //   data: data.draftUpdated,
        // })
      }}
    />
  )
)

FilesSubscription.propTypes = {
  datasetId: PropTypes.string,
}

export default FilesSubscription
