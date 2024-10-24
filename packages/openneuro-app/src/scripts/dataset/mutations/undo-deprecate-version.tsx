import React from "react"
import type { FC } from "react"
import { gql, useMutation } from "@apollo/client"
import { Button } from "@openneuro/components/button"
import { Tooltip } from "@openneuro/components/tooltip"

const UNDO_DEPRECATE_VERSION = gql`
  mutation undoDeprecateSnapshot($datasetId: ID!, $tag: String!) {
    undoDeprecateSnapshot(datasetId: $datasetId, tag: $tag) {
      id
      deprecated {
        reason
      }
    }
  }
`

interface UndoDeprecateVersionProps {
  datasetId: string
  tag: string
}

export const UndoDeprecateVersion: FC<UndoDeprecateVersionProps> = ({
  datasetId,
  tag,
}) => {
  const [UndoDeprecateVersion] = useMutation(UNDO_DEPRECATE_VERSION)

  return (
    <Tooltip tooltip="Undo Deprecation" flow="right">
      <Button
        icon="fa fa-undo"
        iconOnly
        label="Undo"
        size="xsmall"
        onClick={() =>
          UndoDeprecateVersion({
            variables: { datasetId, tag },
          })}
      />
    </Tooltip>
  )
}
