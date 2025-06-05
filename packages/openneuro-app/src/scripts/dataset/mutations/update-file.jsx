import React from "react"
import PropTypes from "prop-types"
import UploaderContext from "../../uploader/uploader-context.js"

const UpdateFile = ({
  datasetId,
  directory = false,
  multiple = false,
  path = null,
  filename = null,
  children,
}) => {
  return (
    <UploaderContext.Consumer>
      {(uploader) => (
        <div className="edit-file">
          <input
            type="file"
            className="update-file"
            onChange={(e) => {
              e.preventDefault()
              if (filename && e.target.files.length === 1) {
                // In the case that a single file was selected,
                // name that file based on the original path and not the client side name.
                const target = e.target.files[0]
                const files = [
                  new File([target], filename, { type: target.type }),
                ]
                uploader.resumeDataset(
                  datasetId,
                  path,
                  false,
                )({ files })
              } else {
                uploader.resumeDataset(
                  datasetId,
                  path,
                  false,
                )({ files: e.target.files })
              }
            }}
            webkitdirectory={directory ? "true" : undefined}
            multiple={multiple && true}
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
  tooltip: PropTypes.string,
  children: PropTypes.node,
}

export default UpdateFile
