import React from 'react'
import PropTypes from 'prop-types'
import gql from 'graphql-tag'
import { Mutation } from '@apollo/client/react/components'
import WarnButton from '../../common/forms/warn-button.jsx'

const DELETE_FILE = gql`
  mutation removeAnnexObject(
    $datasetId: ID!
    $path: String!
    $filename: String!
    $annexKey: String!
  ) {
    removeAnnexObject(
      datasetId: $datasetId
      path: $path
      filename: $filename
      annexKey: $annexKey
    )
  }
`

const RemoveAnnexObject = ({ datasetId, path, filename, annexKey }) => (
  <Mutation mutation={DELETE_FILE} awaitRefetchQueries={true}>
    {removeAnnexObject => (
      // fa-exclamation-triangle might be better
      <span className="remove-annex-object">
        <WarnButton
          message="Rm Annexed"
          icon="fa-frown-o"
          warn={true}
          className="edit-file"
          action={cb => {
            removeAnnexObject({
              variables: { datasetId, path, filename, annexKey },
            }).then(() => {
              cb()
            })
          }}
        />
      </span>
    )}
  </Mutation>
)

RemoveAnnexObject.propTypes = {
  datasetId: PropTypes.string,
  path: PropTypes.string,
  filename: PropTypes.string,
  annexKey: PropTypes.string,
}

export default RemoveAnnexObject
