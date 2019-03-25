import React from 'react'
import PropTypes from 'prop-types'
import gql from 'graphql-tag'
import { Mutation } from 'react-apollo'

const REMOVE_PERMISSION = gql`
  mutation removePermission($datasetId: ID!, $userId: String!) {
    removePermission(datasetId: $datasetId, userId: $userId)
  }
`

const RemovePermission = ({ datasetId, userId }) => (
  <Mutation mutation={REMOVE_PERMISSION}>
    {removePermission => (
      <button
        className="btn"
        onClick={() => removePermission({ variables: { datasetId, userId } })}>
        Remove Permission
      </button>
    )}
  </Mutation>
)

RemovePermission.propTypes = {
  datasetId: PropTypes.string,
  userId: PropTypes.string,
}

export default RemovePermission
