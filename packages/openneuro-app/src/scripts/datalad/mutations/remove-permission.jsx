import React from 'react'
import PropTypes from 'prop-types'
import gql from 'graphql-tag'
import { Mutation } from 'react-apollo'
import WarnButton from '../../common/forms/warn-button.jsx'

const REMOVE_PERMISSION = gql`
  mutation removePermission($datasetId: ID!, $userId: String!) {
    removePermission(datasetId: $datasetId, userId: $userId)
  }
`

const RemovePermission = ({ datasetId, userId }) => (
  <Mutation mutation={REMOVE_PERMISSION}>
    {removePermission => (
      <WarnButton
        message="Remove Permission"
        icon="fa-trash"
        warn={true}
        action={async cb => {
          await removePermission({ variables: { datasetId, userId } })
          cb()
        }}
      />
    )}
  </Mutation>
)

RemovePermission.propTypes = {
  datasetId: PropTypes.string,
  userId: PropTypes.string,
}

export default RemovePermission
