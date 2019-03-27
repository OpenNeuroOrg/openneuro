import React from 'react'
import PropTypes from 'prop-types'
import gql from 'graphql-tag'
import { Mutation } from 'react-apollo'
import WarnButton from '../../common/forms/warn-button.jsx'

const REMOVE_PERMISSION = gql`
  mutation removePermissions($datasetId: ID!, $userId: String!) {
    removePermissions(datasetId: $datasetId, userId: $userId)
  }
`

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
