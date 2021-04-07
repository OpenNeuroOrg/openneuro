import React from 'react'
import PropTypes from 'prop-types'
import { gql, useMutation } from '@apollo/client'
import { withRouter } from 'react-router-dom'
import ErrorBoundary from '../../errors/errorBoundary.jsx'

const CREATE_SNAPSHOT = gql`
  mutation createSnapshot($datasetId: ID!, $tag: String!, $changes: [String!]) {
    createSnapshot(datasetId: $datasetId, tag: $tag, changes: $changes) {
      id
      tag
    }
  }
`

const CreateSnapshotMutation = ({ history, datasetId, tag, changes }) => {
  const [snapshotDataset, { error }] = useMutation(CREATE_SNAPSHOT)
  if (error) throw error
  return (
    <button
      className="btn-modal-action"
      onClick={() =>
        snapshotDataset({ variables: { datasetId, tag, changes } }).then(() => {
          history.push(`/datasets/${datasetId}/versions/${tag}`)
        })
      }>
      Create Snapshot
    </button>
  )
}

const SnapshotDataset = ({ history, datasetId, tag, changes }) => (
  <ErrorBoundary subject="error creating snapshot">
    <CreateSnapshotMutation
      history={history}
      datasetId={datasetId}
      tag={tag}
      changes={changes}
    />
  </ErrorBoundary>
)

CreateSnapshotMutation.propTypes = SnapshotDataset.propTypes = {
  datasetId: PropTypes.string,
  tag: PropTypes.string,
  history: PropTypes.object,
  changes: PropTypes.array,
}

export default withRouter(SnapshotDataset)
