import React, { FC } from 'react'
import { gql } from '@apollo/client'
import { Mutation } from '@apollo/client/react/components'
import { WarnButton } from '@openneuro/components/warn-button'
const REMOVE_PERMISSION = gql`
  mutation removePermissions($datasetId: ID!, $userId: String!) {
    removePermissions(datasetId: $datasetId, userId: $userId)
  }
`

export const userPermissionsFilter = (userPermissions, userId) =>
  userPermissions.filter(permission => permission.user.id !== userId)

interface RemovePermissionsProps {
  datasetId: string
  userId: string
}

export const RemovePermissions: FC<RemovePermissionsProps> = ({
  datasetId,
  userId,
}) => {
  const [displayOptions, setDisplayOptions] = React.useState(false)
  return (
    <Mutation mutation={REMOVE_PERMISSION}>
      {removePermissions => (
        <WarnButton
          message="Remove Permission"
          icon="fa-trash-o"
          disabled={false}
          onConfirmedClick={async () => {
            await removePermissions({ variables: { datasetId, userId } })
          }}
          displayOptions={displayOptions}
          setDisplayOptions={setDisplayOptions}
        />
      )}
    </Mutation>
  )
}
