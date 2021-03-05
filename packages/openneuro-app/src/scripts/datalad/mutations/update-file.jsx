import React from 'react'
import PropTypes from 'prop-types'
import UploaderContext from '../../uploader/uploader-context.js'
import Tooltip from '../../common/partials/tooltip.jsx'

const UpdateFile = ({
  datasetId,
  directory = false,
  multiple = false,
  path = null,
  tooltip = '',
  children,
}) => {
  return (
    <UploaderContext.Consumer>
      {uploader => (
        <div className="edit-file">
          <Tooltip tooltip={tooltip}>
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
              multiple={multiple && true}
            />
          </Tooltip>
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
  tooltip: PropTypes.string,
  children: PropTypes.node,
}

export default UpdateFile
