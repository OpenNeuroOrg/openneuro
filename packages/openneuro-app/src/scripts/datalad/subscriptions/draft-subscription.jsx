import React from 'react'
import PropTypes from 'prop-types'
import { Subscription } from 'react-apollo'
import gql from 'graphql-tag'
import { datasetCacheId } from '../mutations/cache-id.js'
import {
  DRAFT_FRAGMENT,
  DATASET_ISSUES,
} from '../dataset/dataset-query-fragments.js'

const DRAFT_SUBSCRIPTION = gql`
  subscription draftUpdated($datasetIds: [ID!]) {
    draftUpdated(datasetIds: $datasetIds) {
      id
      ...DatasetDraft
      ...DatasetIssues
    }
  }
  ${DRAFT_FRAGMENT}
  ${DATASET_ISSUES}
`

const DraftSubscription = ({ datasetId }) => (
  <Subscription
    subscription={DRAFT_SUBSCRIPTION}
    variables={{ datasetIds: [datasetId] }}
    onSubscriptionData={({ client, subscriptionData: { data } }) => {
      client.writeFragment({
        id: datasetCacheId(datasetId),
        fragment: DRAFT_FRAGMENT,
        data: data.draftUpdated,
      })
    }}
  />
)

DraftSubscription.propTypes = {
  datasetId: PropTypes.string,
}

export default DraftSubscription
