import React, { FC } from 'react'
import { gql } from '@apollo/client'
import { Mutation } from '@apollo/client/react/components'
import { toast } from 'react-toastify'
import ToastContent from '../../common/partials/toast-content'
import { validate as isValidEmail } from 'email-validator'
import { Button } from '@openneuro/components/button'

const UPDATE_PERMISSIONS = gql`
  mutation updatePermissions(
    $datasetId: ID!
    $userEmail: String!
    $level: String!
  ) {
    updatePermissions(
      datasetId: $datasetId
      userEmail: $userEmail
      level: $level
    ) {
      id
      email
    }
  }
`

export const mergeNewPermission = (
  datasetId,
  oldPermissions,
  userInfo,
  metadata,
) => {
  return {
    __typename: 'Dataset',
    id: datasetId,
    permissions: {
      ...oldPermissions,
      userPermissions: [
        ...oldPermissions.userPermissions,
        {
          __typename: 'Permission',
          user: { __typename: 'User', ...userInfo },
          level: metadata,
        },
      ],
    },
  }
}

interface UpdateDatasetPermissionsProps {
  datasetId: string
  userEmail: string
  metadata: string
  done: () => void
}

export const UpdateDatasetPermissions: FC<UpdateDatasetPermissionsProps> = ({
  datasetId,
  userEmail,
  metadata,
  done,
}) => {
  //const [displayOptions, setDisplayOptions] = React.useState(false)
  return (
    <Mutation mutation={UPDATE_PERMISSIONS}>
      {UpdateDatasetPermissions => (
        <Button
          className="btn-modal-action"
          primary={true}
          label="Share"
          size="small"
          onClick={async () => {
            if (isValidEmail(userEmail)) {
              try {
                await UpdateDatasetPermissions({
                  variables: { datasetId, userEmail, level: metadata },
                })
                done()
              } catch (err) {
                toast.error(
                  <ToastContent body="A user with that email address does not exist" />,
                )
              }
            } else {
              toast.error(
                <ToastContent body="Please enter a valid email address" />,
              )
            }
          }}
        />
      )}
    </Mutation>
  )
}
