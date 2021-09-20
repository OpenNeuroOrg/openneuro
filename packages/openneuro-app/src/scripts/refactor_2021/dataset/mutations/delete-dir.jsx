import React from 'react'
import PropTypes from 'prop-types'
import { gql } from '@apollo/client'
import { Mutation } from '@apollo/client/react/components'
import { WarnButton } from '@openneuro/components/warn-button'

export const DELETE_FILES = gql`
  mutation deleteFiles($datasetId: ID!, $files: [DeleteFile]!) {
    deleteFiles(datasetId: $datasetId, files: $files)
  }
`

const DeleteDir = ({ datasetId, path }) => (
  <Mutation mutation={DELETE_FILES} awaitRefetchQueries={true}>
    {deleteFiles => (
      <span className="delete-file">
        <WarnButton
          message=""
          icon="fa-trash"
          className="edit-file"
          onConfirmedClick={() => {
            deleteFiles({
              variables: {
                datasetId,
                files: [{ path }],
              },
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
