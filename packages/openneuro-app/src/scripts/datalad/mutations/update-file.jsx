import React from 'react'
import PropTypes from 'prop-types'
import UploaderContext from '../../uploader/uploader-context.js'

const UpdateFile = ({
  datasetId,
  directory = false,
  multiple = false,
  path = null,
  children,
}) => {
  return (
    <UploaderContext.Consumer>
      {uploader => (
        <div className="edit-file">
          <input
            type="file"
            className="update-file"
            onChange={e => {
              e.preventDefault()
              uploader.resumeDataset(
                datasetId,
                path,
                false,
              )({ files: e.target.files })
            }}
            webkitdirectory={directory && 'true'}
            multiple={multiple && 'true'}
          />
          {children}
        </div>
      )}
    </UploaderContext.Consumer>
  )
}

UpdateFile.propTypes = {
  client: PropTypes.object,
  datasetId: PropTypes.string,
  directory: PropTypes.bool,
  multiple: PropTypes.bool,
  path: PropTypes.string,
  children: PropTypes.node,
}

export default UpdateFile
