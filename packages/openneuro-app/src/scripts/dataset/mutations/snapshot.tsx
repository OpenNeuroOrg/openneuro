import React from 'react'
import PropTypes from 'prop-types'
import { gql, useMutation } from '@apollo/client'
import { useHistory } from 'react-router-dom'
import ErrorBoundary from '../../errors/errorBoundary.jsx'
import { Button } from '@openneuro/components/button'

const CREATE_SNAPSHOT = gql`
  mutation createSnapshot($datasetId: ID!, $tag: String!, $changes: [String!]) {
    createSnapshot(datasetId: $datasetId, tag: $tag, changes: $changes) {
      id
      tag
    }
  }
`

interface CreateSnapshotMutationProps {
  datasetId: string
  tag: string
  changes: Array<string>
}

const CreateSnapshotMutation = ({
  datasetId,
  tag,
  changes,
}: CreateSnapshotMutationProps) => {
  const history = useHistory()
  const [snapshotDataset, { loading, error }] = useMutation(CREATE_SNAPSHOT)

  if (error) throw error

  if (loading) {
    return <i className="fas fa-circle-notch fa-spin"></i>
  } else {
    return (
      <Button
        primary={true}
        size="small"
        onClick={(): void => {
          void snapshotDataset({
            variables: { datasetId, tag, changes },
          }).then(() => history.push(`/datasets/${datasetId}/versions/${tag}`))
        }}
        label="Create Version"
      />
    )
  }
}

interface SnapshotDatasetProps {
  datasetId: string
  tag: string
  changes: Array<string>
}

const SnapshotDataset = ({ datasetId, tag, changes }: SnapshotDatasetProps) => (
  <ErrorBoundary subject="error creating version">
    <CreateSnapshotMutation datasetId={datasetId} tag={tag} changes={changes} />
  </ErrorBoundary>
)

CreateSnapshotMutation.propTypes = SnapshotDataset.propTypes = {
  datasetId: PropTypes.string,
  tag: PropTypes.string,
  changes: PropTypes.array,
}

export default SnapshotDataset
