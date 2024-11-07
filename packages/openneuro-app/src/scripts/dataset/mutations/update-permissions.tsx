import React from "react"
import type { FC } from "react"
import { gql, useMutation } from "@apollo/client"
import type { ApolloError } from "@apollo/client"
import { toast } from "react-toastify"
import ToastContent from "../../common/partials/toast-content"
import { validate as isValidEmail } from "email-validator"
import { Button } from "@openneuro/components/button"

export function isValidOrcid(orcid: string) {
  if (orcid) {
    return /^[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{3}[0-9X]$/.test(orcid)
      ? true
      : false
  } else {
    return false
  }
}

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
      userPermissions {
        datasetId
        userId
        level
        user {
          id
          email
          oricd
        }
      }
    }
  }
`

const UPDATE_ORCID_PERMISSIONS = gql`
  mutation updateOrcidPermissions(
    $datasetId: ID!
    $userOrcid: String!
    $level: String!
  ) {
    updateOrcidPermissions(
      datasetId: $datasetId
      userOrcid: $userOrcid
      level: $level
    ) {
      id
      userPermissions {
        datasetId
        userId
        level
        user {
          id
          email
          orcid
        }
      }
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
    __typename: "Dataset",
    id: datasetId,
    permissions: {
      ...oldPermissions,
      userPermissions: [
        ...oldPermissions.userPermissions,
        {
          __typename: "Permission",
          user: { __typename: "User", ...userInfo },
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

function onError(err: ApolloError) {
  toast.error(
    <ToastContent body={err?.message} />,
  )
}

export const UpdateDatasetPermissions: FC<UpdateDatasetPermissionsProps> = ({
  datasetId,
  userEmail,
  metadata,
  done,
}) => {
  const [updateDatasetPermissions] = useMutation(
    UPDATE_PERMISSIONS,
    { onError },
  )
  const [updateDatasetPermissionsOrcid] = useMutation(
    UPDATE_ORCID_PERMISSIONS,
    { onError },
  )
  return (
    <>
      <Button
        className="btn-modal-action"
        primary={true}
        label="Share"
        size="small"
        onClick={async () => {
          if (isValidOrcid(userEmail)) {
            await updateDatasetPermissionsOrcid({
              variables: { datasetId, userOrcid: userEmail, level: metadata },
            })
            done()
          } else if (isValidEmail(userEmail)) {
            try {
              await updateDatasetPermissions({
                variables: { datasetId, userEmail, level: metadata },
              })
              done()
            } catch (_err) {
              toast.error(
                <ToastContent body="A user with that email address does not exist" />,
              )
            }
          } else {
            toast.error(
              <ToastContent body="Please enter a valid email address or ORCID" />,
            )
          }
        }}
      />
    </>
  )
}
