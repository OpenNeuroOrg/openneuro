import React from "react"
import type { FC } from "react"
import { gql, useMutation } from "@apollo/client"
import type { ApolloError } from "@apollo/client"
import { toast } from "react-toastify"
import ToastContent from "../../common/partials/toast-content"
import { validate as isValidEmail } from "email-validator"
import { Button } from "@openneuro/components/button"

import { isValidOrcid } from "../../utils/validationUtils"

export const UPDATE_PERMISSIONS = gql`
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
          orcid
          name
        }
      }
    }
  }
`

export const UPDATE_ORCID_PERMISSIONS = gql`
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
          name
        }
      }
    }
  }
`

interface UpdateDatasetPermissionsProps {
  datasetId: string
  userIdentifier: string
  metadata: string
  done: () => void
}

function onError(err: ApolloError) {
  toast.error(
    <ToastContent body={err?.message} />,
  )
}

/**
 * Add permissions to a dataset based on a value provided
 * userIdentifier is either an email or ORCID
 */
export const UpdateDatasetPermissions: FC<UpdateDatasetPermissionsProps> = ({
  datasetId,
  userIdentifier,
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
          if (isValidOrcid(userIdentifier)) {
            await updateDatasetPermissionsOrcid({
              variables: {
                datasetId,
                userOrcid: userIdentifier,
                level: metadata,
              },
            })
            done()
          } else if (isValidEmail(userIdentifier)) {
            try {
              await updateDatasetPermissions({
                variables: {
                  datasetId,
                  userEmail: userIdentifier,
                  level: metadata,
                },
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
