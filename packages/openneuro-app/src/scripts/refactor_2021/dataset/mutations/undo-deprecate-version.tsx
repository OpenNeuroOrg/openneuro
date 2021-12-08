import React, { FC } from 'react'
import { gql, useMutation } from '@apollo/client'
import { Button } from '@openneuro/components/button'
import { Tooltip } from '@openneuro/components/tooltip'

const DEPRECATE_SNAPSHOT = gql`
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
  const [UndoDeprecateVersion] = useMutation(DEPRECATE_SNAPSHOT)

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
          })
        }
      />
    </Tooltip>
  )
}
