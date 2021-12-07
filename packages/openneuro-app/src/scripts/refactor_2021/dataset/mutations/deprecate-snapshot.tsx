import React, { FC, useState } from 'react'
import { gql, useMutation } from '@apollo/client'
import { Button } from '@openneuro/components/button'

const DEPRECATE_SNAPSHOT = gql`
  mutation deprecateSnapshot($datasetId: ID!, $tag: String!, $reason: String!) {
    deprecateSnapshot(datasetId: $datasetId, tag: $tag, reason: $reason) {
      id
      deprecated {
        reason
      }
    }
  }
`

interface DeprecateSnapshotProps {
  datasetId: string
  tag: string
  reason: string
}

export const DeprecateSnapshot: FC<DeprecateSnapshotProps> = ({
  datasetId,
  tag,
  reason,
}) => {
  const [DeprecateSnapshot, { data, error }] = useMutation(DEPRECATE_SNAPSHOT)

  return (
    <Button
      className="btn-modal-action"
      primary={true}
      label="Deprecate Version"
      size="small"
      onClick={() =>
        DeprecateSnapshot({
          variables: { datasetId, tag, reason },
        })
      }
    />
  )
}
