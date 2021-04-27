import React from 'react'
import PropTypes from 'prop-types'
import { gql } from '@apollo/client'
import { Mutation } from '@apollo/client/react/components'
import WarnButton from '../../common/forms/warn-button.jsx'

export const DELETE_FILES = gql`
  mutation deletePath($datasetId: ID!, $path: String!) {
    deletePath(datasetId: $datasetId, path: $path)
  }
`

const DeleteDir = ({ datasetId, path }) => (
  <Mutation mutation={DELETE_FILES} awaitRefetchQueries={true}>
    {deletePath => (
      <span className="delete-file">
        <WarnButton
          message="Delete"
          icon="fa-trash"
          warn={true}
          className="edit-file"
          action={cb => {
            deletePath({
              variables: {
                datasetId,
                path,
              },
            }).then(() => {
              cb()
            })
          }}
        />
      </span>
    )}
  </Mutation>
)

DeleteDir.propTypes = {
  datasetId: PropTypes.string,
  path: PropTypes.string,
}

export default DeleteDir
