import React from 'react'
import PropTypes from 'prop-types'
import gql from 'graphql-tag'
import { Mutation } from '@apollo/client/react/components'
import WarnButton from '../../common/forms/warn-button.jsx'

const DELETE_FILE = gql`
  mutation deleteFile($datasetId: ID!, $path: String!, $filename: String!) {
    deleteFile(datasetId: $datasetId, path: $path, filename: $filename)
  }
`

const DeleteFile = ({ datasetId, path, filename }) => (
  <Mutation mutation={DELETE_FILE} awaitRefetchQueries={true}>
    {deleteFile => (
      <span className="delete-file">
        <WarnButton
          message="Delete"
          icon="fa-trash"
          warn={true}
          className="edit-file"
          action={cb => {
            deleteFile({ variables: { datasetId, path, filename } }).then(
              () => {
                cb()
              },
            )
          }}
        />
      </span>
    )}
  </Mutation>
)

DeleteFile.propTypes = {
  datasetId: PropTypes.string,
  path: PropTypes.string,
  filename: PropTypes.string,
}

export default DeleteFile
