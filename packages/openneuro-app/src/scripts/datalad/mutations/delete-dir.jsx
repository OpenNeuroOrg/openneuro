import React from 'react'
import PropTypes from 'prop-types'
import gql from 'graphql-tag'
import { Mutation } from 'react-apollo'
import WarnButton from '../../common/forms/warn-button.jsx'

const DELETE_FILES = gql`
  mutation deleteFiles($datasetId: ID!, $path: String!) {
    deleteFiles(datasetId: $datasetId, path: $path)
  }
`

const DeleteDir = ({ datasetId, path }) => (
  <Mutation mutation={DELETE_FILES} awaitRefetchQueries={true}>
    {deleteFiles => (
      <span className="delete-file">
        <WarnButton
          message="Delete"
          icon="fa-trash"
          warn={true}
          className="edit-file"
          action={cb => {
            deleteFiles({
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
