import React from 'react'
import PropTypes from 'prop-types'
import { Subscription } from 'react-apollo'
import gql from 'graphql-tag'
import { datasetCacheId } from '../mutations/cache-id.js'
import {
  DATASET_ISSUES,
  ISSUE_FIELDS,
} from '../dataset/dataset-query-fragments.js'
import ValidationStatus from './validation-status.jsx'

const VALIDATION_SUBSCRIPTION = gql`
  subscription datasetValidationUpdated($datasetId: ID!) {
    datasetValidationUpdated(datasetId: $datasetId) {
      id
      datasetId
      issues {
        ${ISSUE_FIELDS}
      }
    }
  }
`

const Validation = ({ datasetId, issues, subscribe = false }) => {
  return (
    <div className="fade-in col-xs-12 validation">
      <h3 className="metaheader">BIDS Validation</h3>
      {subscribe && (
        <Subscription
          subscription={VALIDATION_SUBSCRIPTION}
          variables={{ datasetId }}
          onSubscriptionData={({ client, subscriptionData: { data } }) => {
            const { draft } = client.readFragment({
              id: datasetCacheId(datasetId),
              fragment: DATASET_ISSUES,
            })
            client.writeFragment({
              id: datasetCacheId(datasetId),
              fragment: DATASET_ISSUES,
              data: {
                __typename: 'Dataset',
                id: datasetId,
                draft: {
                  ...draft,
                  issues: data.datasetValidationUpdated.issues,
                },
              },
            })
          }}
        />
      )}
      <ValidationStatus issues={issues} datasetId={datasetId} />
    </div>
  )
}

Validation.propTypes = {
  datasetId: PropTypes.string,
  issues: PropTypes.array,
}

export default Validation
