import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { gql, useMutation, useSubscription } from '@apollo/client'
import { useHistory } from 'react-router-dom'
import ErrorBoundary from '../../../errors/errorBoundary.jsx'
import { Button } from '@openneuro/components/button'
import { SNAPSHOTS_UPDATED_SUBSCRIPTION } from '../../../datalad/subscriptions/useSnapshotsUpdatedSubscriptions'

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
  const [submitted, setSubmitted] = useState(false)
  const { loading: subscriptionLoading } = useSubscription(
    SNAPSHOTS_UPDATED_SUBSCRIPTION,
    {
      variables: { datasetId },
      fetchPolicy: 'network-only',
    },
  )

  if (error) throw error

  if (submitted && subscriptionLoading) {
    return (
      <>
        <i className="fas fa-circle-notch fa-spin"></i>Snapshot creation in
        progress
      </>
    )
  } else if (submitted && !subscriptionLoading) {
    // TODO - We are sending the subscription too early because this requires a small but predictable delay
    setTimeout(
      () => history.push(`/datasets/${datasetId}/versions/${tag}`),
      2000,
    )
  } else {
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
            }).then(() => void setSubmitted(true))
          }}
          label="Create Snapshot"
        />
      )
    }
  }
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
  changes: PropTypes.array,
}

export default SnapshotDataset
