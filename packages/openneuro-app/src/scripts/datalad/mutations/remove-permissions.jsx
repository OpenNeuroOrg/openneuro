import React from 'react'
import PropTypes from 'prop-types'
import gql from 'graphql-tag'
import { Mutation } from 'react-apollo'
import { PERMISSION_FRAGMENT } from '../dataset/dataset-query-fragments.js'
import WarnButton from '../../common/forms/warn-button.jsx'

const REMOVE_PERMISSION = gql`
  mutation removePermissions($datasetId: ID!, $userId: String!) {
    removePermissions(datasetId: $datasetId, userId: $userId)
  }
`

const RemovePermissions = ({ datasetId, userId }) => (
  <Mutation
    mutation={REMOVE_PERMISSION}
    update={cache => {
      const datasetCacheId = `Dataset:${datasetId}`
      const { permissions } = cache.readFragment({
        id: datasetCacheId,
        fragment: PERMISSION_FRAGMENT,
      })
      const newPermissions = permissions.filter(
        permission => permission.user.id !== userId,
      )
      cache.writeFragment({
        id: datasetCacheId,
        fragment: PERMISSION_FRAGMENT,
        data: {
          __typename: 'Dataset',
          id: datasetId,
          permissions: newPermissions,
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
