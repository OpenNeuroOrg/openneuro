import React from 'react'
import PropTypes from 'prop-types'
import { gql } from '@apollo/client'
import { Mutation } from '@apollo/client/react/components'
import { WarnButton } from '@openneuro/components/warn-button'

const DELETE_FILE = gql`
  mutation deleteFiles($datasetId: ID!, $files: [DeleteFile]) {
    deleteFiles(datasetId: $datasetId, files: $files)
  }
`

const DeleteFile = ({ datasetId, path, filename }) => (
  <Mutation mutation={DELETE_FILE} awaitRefetchQueries={true}>
    {deleteFiles => (
      <span className="delete-file">
        <WarnButton
          message=""
          icon="fa-trash"
          className="edit-file"
          onConfirmedClick={() => {
            deleteFiles({
              variables: { datasetId, files: [{ path, filename }] },
            })
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
