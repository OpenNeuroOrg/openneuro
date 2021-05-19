import React from 'react'
import PropTypes from 'prop-types'
import { Mutation } from '@apollo/client/react/components'
import WarnButton from '../../common/forms/warn-button.jsx'
import { files } from '@openneuro/client'

const DeleteDir = ({ datasetId, path }) => (
  <Mutation mutation={files.deleteFiles} awaitRefetchQueries={true}>
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
                files: [{ path }],
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
