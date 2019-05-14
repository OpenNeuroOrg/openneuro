import React from 'react'
import PropTypes from 'prop-types'
import gql from 'graphql-tag'
import { Mutation } from 'react-apollo'
import { PERMISSION_FRAGMENT } from '../dataset/dataset-query-fragments.js'
import WarnButton from '../../common/forms/warn-button.jsx'
import { datasetCacheId } from './cache-id.js'

const REMOVE_PERMISSION = gql`
  mutation removePermissions($datasetId: ID!, $userId: String!) {
    removePermissions(datasetId: $datasetId, userId: $userId)
  }
`

/**
 * Remove any permissions matching the user
 * @param {array} permissions
 * @param {string} userId
 */
export const permissionsFilter = (permissions, userId) =>
  permissions.filter(permission => permission.user.id !== userId)

const RemovePermissions = ({ datasetId, userId }) => (
  <Mutation
    mutation={REMOVE_PERMISSION}
    update={cache => {
      const { permissions } = cache.readFragment({
        id: datasetCacheId(datasetId),
        fragment: PERMISSION_FRAGMENT,
      })
      cache.writeFragment({
        id: datasetCacheId(datasetId),
        fragment: PERMISSION_FRAGMENT,
        data: {
          __typename: 'Dataset',
          id: datasetId,
          permissions: permissionsFilter(permissions, userId),
        },
      })
    }}>
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
