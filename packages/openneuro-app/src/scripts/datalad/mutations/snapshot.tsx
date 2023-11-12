import React from "react"
import PropTypes from "prop-types"
import { gql, useMutation } from "@apollo/client"
import { useNavigate } from "react-router-dom"
import ErrorBoundary from "../../errors/errorBoundary.jsx"

const CREATE_SNAPSHOT = gql`
  mutation createSnapshot($datasetId: ID!, $tag: String!, $changes: [String!]) {
    createSnapshot(datasetId: $datasetId, tag: $tag, changes: $changes) {
      id
      tag
    }
  }
`

const CreateSnapshotMutation = ({ datasetId, tag, changes }) => {
  const [snapshotDataset, { error }] = useMutation(CREATE_SNAPSHOT)
  const navigate = useNavigate()
  if (error) throw error
  return (
    <button
      className="btn-modal-action"
      onClick={() =>
        snapshotDataset({ variables: { datasetId, tag, changes } }).then(() => {
          navigate(`/datasets/${datasetId}/versions/${tag}`)
        })}
    >
      Create Snapshot
    </button>
  )
}

interface SnapshotDatasetProps {
  datasetId: string
  tag: string
  changes: Array<string>
}

const SnapshotDataset = ({ datasetId, tag, changes }: SnapshotDatasetProps) => (
  <ErrorBoundary subject="error creating snapshot">
    <CreateSnapshotMutation datasetId={datasetId} tag={tag} changes={changes} />
  </ErrorBoundary>
)

CreateSnapshotMutation.propTypes = SnapshotDataset.propTypes = {
  datasetId: PropTypes.string,
  tag: PropTypes.string,
  history: PropTypes.object,
  changes: PropTypes.array,
}

export default SnapshotDataset
