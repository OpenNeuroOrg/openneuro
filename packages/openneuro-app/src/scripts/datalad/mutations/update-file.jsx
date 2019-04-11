import React, { useState } from 'react'
import PropTypes from 'prop-types'
import * as Sentry from '@sentry/browser'
import { updateFiles } from '../../uploader/upload-mutation.js'
import { withApollo } from 'react-apollo'

const UpdateFile = ({ client, datasetId, multiple = false, children }) => {
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
        {children}
        <input
          type="file"
          className="update-file"
          multiple={multiple}
          webkitdirectory={multiple ? '' : null}
          onChange={async e => {
            setUploading(true)
            try {
              await updateFiles(client)(datasetId, e.target.files)
            } catch (err) {
              Sentry.captureException(err)
            } finally {
              setUploading(false)
            }
          }}
        />
      </div>
    )
  }
}

UpdateFile.propTypes = {
  client: PropTypes.object,
  datasetId: PropTypes.string,
  multiple: PropTypes.bool,
  children: PropTypes.node,
}

export default withApollo(UpdateFile)
