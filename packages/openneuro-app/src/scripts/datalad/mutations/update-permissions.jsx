import React from 'react'
import PropTypes from 'prop-types'
import { gql } from '@apollo/client'
import { Mutation } from '@apollo/client/react/components'
import { toast } from 'react-toastify'
import ToastContent from '../../common/partials/toast-content.jsx'
import { validate as isValidEmail } from 'email-validator'

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

const UpdateDatasetPermissions = ({ datasetId, userEmail, metadata, done }) => (
  <Mutation mutation={UPDATE_PERMISSIONS}>
    {UpdateDatasetPermissions => (
      <button
        className="btn-modal-action"
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
        }}>
        Share
      </button>
    )}
  </Mutation>
)

UpdateDatasetPermissions.propTypes = {
  datasetId: PropTypes.string,
  userEmail: PropTypes.string,
  metadata: PropTypes.oneOf(['ro', 'rw', 'admin']),
  done: PropTypes.func,
}

export default UpdateDatasetPermissions
