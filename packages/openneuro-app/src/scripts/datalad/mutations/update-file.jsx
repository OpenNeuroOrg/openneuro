import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { updateFiles } from '../../uploader/upload-mutation.js'
import { withApollo } from 'react-apollo'

const UpdateFile = ({ client, datasetId, multiple = false }) => {
  const [uploading, setUploading] = useState(false)
  if (uploading) {
    return (
      <div className="edit-file">
        <i className="fa fa-file-o" /> Uploading...
      </div>
    )
  } else {
    return (
      <div className="edit-file">
        <i className="fa fa-file-o" /> Update
        <input
          type="file"
          className="update-file"
          multiple={multiple}
          onChange={async e => {
            setUploading(true)
            await updateFiles(client)(datasetId, e.target.files)
            setUploading(false)
          }}
        />
      </div>
    )
  }
}

UpdateFile.propTypes = {
  datasetId: PropTypes.string,
  path: PropTypes.string,
  filename: PropTypes.string,
}

export default withApollo(UpdateFile)
