import React, { useState } from 'react'
import PropTypes from 'prop-types'
import * as Sentry from '@sentry/browser'
import { updateFiles } from '../../uploader/upload-mutation.js'
import { withApollo } from 'react-apollo'

/**
 * Prefix all files with a path
 * This supports uploading within another directory
 * @param {FileList} fileList FileList for upload
 * @param {string} path Prefix path for all files
 * @returns {Array} Updated array of files with adapted paths
 */
export const addPathToFiles = (fileList, path) => {
  return path
    ? fileList.map(file => ({
        ...file,
        webkitRelativePath: `${path}/${file.webkitRelativePath}`,
      }))
    : fileList
}

/**
 * Allow the first filename to be overriden
 * Mostly useful for "replace" of an existing file
 * @param {*} fileList
 * @param {*} name New filename
 */
export const overrideFilename = (fileList, name) => {
  if (name) {
    const newFile = { ...fileList[0], name }
    return [newFile, ...fileList.slice(1)]
  } else {
    return fileList
  }
}

const UpdateFile = ({
  client,
  datasetId,
  multiple = false,
  path = null,
  filename = null,
  children,
}) => {
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
              // The filename prop overrides the first filename
              const files = overrideFilename(e.target.files, filename)
              await updateFiles(client)(datasetId, addPathToFiles(files, path))
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
  path: PropTypes.string,
  children: PropTypes.node,
}

export default withApollo(UpdateFile)
