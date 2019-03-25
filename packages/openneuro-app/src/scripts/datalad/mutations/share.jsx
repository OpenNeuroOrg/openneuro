import React from 'react'
import PropTypes from 'prop-types'
import gql from 'graphql-tag'
import { Mutation } from 'react-apollo'

const SHARE_DATASET = gql`
  mutation updatePermissions(
    $datasetId: ID!
    $userEmail: String!
    $level: String!
  ) {
    updatePermissions(
      datasetId: $datasetId
      userEmail: $userEmail
      level: $level
    )
  }
`

const ShareDataset = ({ datasetId, userEmail, access }) => (
  <Mutation mutation={SHARE_DATASET}>
    {shareDataset => (
      <button
        className="btn-modal-action"
        onClick={() =>
          shareDataset({ variables: { datasetId, userEmail, level: access } })
        }>
        Share
      </button>
    )}
  </Mutation>
)

ShareDataset.propTypes = {
  datasetId: PropTypes.string,
  userEmail: PropTypes.string,
  access: PropTypes.oneOf(['read', 'write', 'admin']),
}

export default ShareDataset
