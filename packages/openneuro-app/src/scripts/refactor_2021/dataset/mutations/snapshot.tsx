import React from 'react'
import PropTypes from 'prop-types'
import { gql, useMutation } from '@apollo/client'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import ErrorBoundary from '../../../errors/errorBoundary.jsx'
import { Button } from '@openneuro/components/button'

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
    <Button
      primary={true}
      size="small"
      onClick={() =>
        snapshotDataset({ variables: { datasetId, tag, changes } }).then(() => {
          history.push(`/datasets/${datasetId}/versions/${tag}`)
        })
      }
      label="Create Snapshot"
    />
  )
}

interface SnapshotDatasetProps extends RouteComponentProps {
  datasetId: string
  tag: string
  changes: Array<string>
}

const SnapshotDataset = ({
  history,
  datasetId,
  tag,
  changes,
}: SnapshotDatasetProps) => (
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
