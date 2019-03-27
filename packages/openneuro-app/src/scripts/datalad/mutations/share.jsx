import React from 'react'
import PropTypes from 'prop-types'
import gql from 'graphql-tag'
import { Mutation } from 'react-apollo'
import { PERMISSION_FRAGMENT } from '../dataset/dataset-query-fragments.js'

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
    ) {
      id
      email
    }
  }
`

const ShareDataset = ({ datasetId, userEmail, access, done }) => (
  <Mutation
    mutation={SHARE_DATASET}
    update={(cache, { data: { updatePermissions } }) => {
      const datasetCacheId = `Dataset:${datasetId}`
      const { permissions } = cache.readFragment({
        id: datasetCacheId,
        fragment: PERMISSION_FRAGMENT,
      })
      cache.writeFragment({
        id: datasetCacheId,
        fragment: PERMISSION_FRAGMENT,
        data: {
          __typename: 'Dataset',
          id: datasetId,
          permissions: [
            ...permissions,
            {
              __typename: 'Permission',
              user: { __typename: 'User', ...updatePermissions },
              level: access,
            },
          ],
        },
      })
    }}>
    {shareDataset => (
      <button
        className="btn-modal-action"
        onClick={async () => {
          await shareDataset({
            variables: { datasetId, userEmail, level: access },
          })
          done()
        }}>
        Share
      </button>
    )}
  </Mutation>
)

ShareDataset.propTypes = {
  datasetId: PropTypes.string,
  userEmail: PropTypes.string,
  access: PropTypes.oneOf(['ro', 'rw', 'admin']),
  done: PropTypes.func,
}

export default ShareDataset
