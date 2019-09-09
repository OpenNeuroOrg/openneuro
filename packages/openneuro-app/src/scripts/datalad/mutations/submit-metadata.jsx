import React from 'react'
import PropTypes from 'prop-types'
import gql from 'graphql-tag'
import { Mutation } from 'react-apollo'
import { DATASET_METADATA } from '../dataset/dataset-query-fragments.js'
import { datasetCacheId } from './cache-id.js'

const SUBMIT_METADATA = gql`
  mutation addMetadata($datasetId: ID!, $metadata: MetadataInput!) {
    addMetadata(datasetId: $datasetId, metadata: $metadata) {
      datasetId
      type
      datasetUrl
      datasetName
      firstSnapshotCreatedAt
      latestSnapshotCreatedAt
      dxStatus
      tasksCompleted
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
    }
  }
`

const SubmitMetadata = ({ datasetId, metadata, done }) => (
  <Mutation
    mutation={SUBMIT_METADATA}
    update={(cache, { data: { addMetadata } }) => {
      cache.writeFragment({
        id: datasetCacheId(datasetId),
        fragment: DATASET_METADATA,
        data: addMetadata,
      })
    }}>
    {submitMetadata => (
      <button
        type="submit"
        form="metadata-form"
        className="btn-modal-action"
        onClick={async () => {
          await submitMetadata({
            variables: { datasetId, metadata },
          })
          done()
        }}>
        Submit Metadata
      </button>
    )}
  </Mutation>
)

SubmitMetadata.propTypes = {
  datasetId: PropTypes.string,
  metadata: PropTypes.object,
  done: PropTypes.func,
}

export default SubmitMetadata
