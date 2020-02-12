import React from 'react'
import PropTypes from 'prop-types'
import gql from 'graphql-tag'
import { Mutation } from 'react-apollo'
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

const SnapshotDataset = ({ history, datasetId, tag, changes }) => (
  <ErrorBoundary subject="error creating snapshot">
    <Mutation mutation={CREATE_SNAPSHOT}>
      {(snapshotDataset, { error }) => {
        if (error) throw error
        return (
          <button
            className="btn-modal-action"
            onClick={() =>
              snapshotDataset({ variables: { datasetId, tag, changes } }).then(
                () => {
                  history.push(`/datasets/${datasetId}/versions/${tag}`)
                },
              )
            }>
            Create Snapshot
          </button>
        )
      }}
    </Mutation>
  </ErrorBoundary>
)

SnapshotDataset.propTypes = {
  datasetId: PropTypes.string,
  tag: PropTypes.string,
  history: PropTypes.object,
  changes: PropTypes.array,
}

export default withRouter(SnapshotDataset)
