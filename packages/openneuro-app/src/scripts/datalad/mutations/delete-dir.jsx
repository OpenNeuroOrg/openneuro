import React from 'react'
import PropTypes from 'prop-types'
import gql from 'graphql-tag'
import { Mutation } from 'react-apollo'
import WarnButton from '../../common/forms/warn-button.jsx'

const DELETE_FILES = gql`
  mutation deleteFiles($datasetId: ID!, $files: FileTree!) {
    deleteFiles(datasetId: $datasetId, files: $files)
  }
`

const DeleteDir = ({ datasetId, fileTree }) => (
  <Mutation mutation={DELETE_FILES}>
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
                files: fileTree,
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
  fileTree: PropTypes.object,
}

export default DeleteDir
