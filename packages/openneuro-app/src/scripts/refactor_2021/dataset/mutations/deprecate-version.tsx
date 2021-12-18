import React, { FC } from 'react'
import { gql, useMutation } from '@apollo/client'
import { Button } from '@openneuro/components/button'
import { useHistory } from 'react-router-dom'

export const DEPRECATE_VERSION = gql`
  mutation deprecateSnapshot($datasetId: ID!, $tag: String!, $reason: String!) {
    deprecateSnapshot(datasetId: $datasetId, tag: $tag, reason: $reason) {
      id
      deprecated {
        reason
      }
    }
  }
`

interface DeprecateVersionProps {
  datasetId: string
  tag: string
  reason: string
}

export const DeprecateVersion: FC<DeprecateVersionProps> = ({
  datasetId,
  tag,
  reason,
}) => {
  const history = useHistory()
  const [DeprecateVersionMutation] = useMutation(DEPRECATE_VERSION)

  return (
    <Button
      className="btn-modal-action"
      primary={true}
      label="Deprecate Version"
      size="small"
      onClick={() =>
        DeprecateVersionMutation({
          variables: { datasetId, tag, reason },
        }).then(() => {
          history.push(`/datasets/${datasetId}/versions/${tag}`)
        })
      }
    />
  )
}
