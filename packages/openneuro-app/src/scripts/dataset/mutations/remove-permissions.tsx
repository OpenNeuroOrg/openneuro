import React from "react"
import type { FC } from "react"
import { gql, useMutation } from "@apollo/client"
import { WarnButton } from "@openneuro/components/warn-button"

const REMOVE_PERMISSION = gql`
  mutation removePermissions($datasetId: ID!, $userId: String!) {
    removePermissions(datasetId: $datasetId, userId: $userId)
  }
`

export const userPermissionsFilter = (userPermissions, userId) =>
  userPermissions.filter((permission) => permission.user.id !== userId)

interface RemovePermissionsProps {
  datasetId: string
  userId: string
}

export const RemovePermissions: FC<RemovePermissionsProps> = ({
  datasetId,
  userId,
}) => {
  const [removePermissions] = useMutation(REMOVE_PERMISSION)
  const [displayOptions, setDisplayOptions] = React.useState(false)

  return (
    <>
      <WarnButton
        message="Remove Permission"
        icon="fa-trash-o"
        disabled={false}
        onConfirmedClick={() =>
          removePermissions({ variables: { datasetId, userId } })}
        displayOptions={displayOptions}
        setDisplayOptions={setDisplayOptions}
      />
    </>
  )
}
