import React from 'react'
import PropTypes from 'prop-types'
import { gql } from '@apollo/client'
import { Mutation } from '@apollo/client/react/components'
import { DATASET_METADATA } from '../../datalad/dataset/dataset-query-fragments'
import { datasetCacheId } from './cache-id.js'
import { Button } from '@openneuro/components/button'

export const SUBMIT_METADATA = gql`
  mutation addMetadata($datasetId: ID!, $metadata: MetadataInput!) {
    addMetadata(datasetId: $datasetId, metadata: $metadata) {
      datasetId
      datasetUrl
      datasetName
      firstSnapshotCreatedAt
      latestSnapshotCreatedAt
      dxStatus
      tasksCompleted
      grantFunderName
      grantIdentifier
      trialCount
      studyDesign
      studyDomain
      studyLongitudinal
      dataProcessed
      species
      associatedPaperDOI
      openneuroPaperDOI
      seniorAuthor
      adminUsers
      ages
      modalities
      affirmedDefaced
      affirmedConsent
    }
  }
`

const SubmitMetadata = ({ datasetId, metadata, done, disabled }) => (
  <Mutation
    mutation={SUBMIT_METADATA}
    update={(cache, { data: { addMetadata } }) => {
      cache.writeFragment({
        id: datasetCacheId(datasetId),
        fragment: DATASET_METADATA,
        data: {
          __typename: 'Dataset',
          id: datasetId,
          metadata: addMetadata,
        },
      })
    }}>
    {submitMetadata => (
      <Button
        className="btn-modal-action"
        primary={true}
        label="Submit Metadata"
        size="small"
        type="submit"
        form="metadata-form"
        disabled={disabled}
        onClick={async e => {
          e.preventDefault()
          await submitMetadata({
            variables: { datasetId, metadata },
          })
          done()
        }}
      />
    )}
  </Mutation>
)

SubmitMetadata.propTypes = {
  datasetId: PropTypes.string,
  metadata: PropTypes.object,
  done: PropTypes.func,
  disabled: PropTypes.bool,
}

export default SubmitMetadata
