import React from 'react'
import PropTypes from 'prop-types'
import gql from 'graphql-tag'
import { Mutation } from 'react-apollo'
import { withRouter } from 'react-router-dom'
import { DATASET_SNAPSHOTS } from '../dataset/dataset-query-fragments.js'

const CREATE_SNAPSHOT = gql`
  mutation createSnapshot($datasetId: ID!, $tag: String!, $changes: [String!]) {
    createSnapshot(datasetId: $datasetId, tag: $tag, changes: $changes) {
      id
      tag
      created
    }
  }
`

const SnapshotDataset = ({ history, datasetId, tag, changes }) => (
  <Mutation
    mutation={CREATE_SNAPSHOT}
    update={(cache, { data: { createSnapshot } }) => {
      const datasetCacheId = `Dataset:${datasetId}`
      // Fetch known snapshots
      const { snapshots } = cache.readFragment({
        id: datasetCacheId,
        fragment: DATASET_SNAPSHOTS,
      })
      cache.writeFragment({
        id: datasetCacheId,
        fragment: DATASET_SNAPSHOTS,
        data: {
          __typename: 'Dataset',
          id: datasetId,
          snapshots: [...snapshots, createSnapshot],
        },
      })
    }}>
    {snapshotDataset => (
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
    )}
  </Mutation>
)

SnapshotDataset.propTypes = {
  datasetId: PropTypes.string,
  tag: PropTypes.string,
  history: PropTypes.object,
}

export default withRouter(SnapshotDataset)
