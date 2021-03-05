import React from 'react'
import PropTypes from 'prop-types'
import { gql } from '@apollo/client'
import { Mutation } from '@apollo/client/react/components'
import WarnButton from '../../common/forms/warn-button.jsx'

const REMOVE_PERMISSION = gql`
  mutation removePermissions($datasetId: ID!, $userId: String!) {
    removePermissions(datasetId: $datasetId, userId: $userId)
  }
`

/**
 * Remove any permissions matching the user
 * @param {object} userPermissions
 * @param {string} userId
 */
export const userPermissionsFilter = (userPermissions, userId) =>
  userPermissions.filter(permission => permission.user.id !== userId)

const RemovePermissions = ({ datasetId, userId }) => (
  <Mutation mutation={REMOVE_PERMISSION}>
    {removePermissions => (
      <WarnButton
        message="Remove Permission"
        icon="fa-trash"
        warn={true}
        action={async cb => {
          await removePermissions({ variables: { datasetId, userId } })
          cb()
        }}
      />
    )}
  </Mutation>
)

RemovePermissions.propTypes = {
  datasetId: PropTypes.string,
  userId: PropTypes.string,
}

export default RemovePermissions
