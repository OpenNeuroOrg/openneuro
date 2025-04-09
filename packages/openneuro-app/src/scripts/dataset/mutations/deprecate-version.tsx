import React from "react"
import type { FC } from "react"
import { gql, useMutation } from "@apollo/client"
import { Button } from "../../components/button/Button"
import { useNavigate } from "react-router-dom"

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
  const navigate = useNavigate()
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
          navigate(`/datasets/${datasetId}/versions/${tag}`)
        })}
    />
  )
}
