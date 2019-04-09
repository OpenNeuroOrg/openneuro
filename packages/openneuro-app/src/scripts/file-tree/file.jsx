import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import DeleteFile from '../datalad/mutations/delete-file.jsx'

const filePath = (path, filename) => `${(path && path + ':') || ''}${filename}`

export const apiPath = (datasetId, snapshotTag, filePath) => {
  const snapshotPath = snapshotTag ? `/snapshots/${snapshotTag}` : ''
  return `/crn/datasets/${datasetId}${snapshotPath}/files/${filePath}`
}

const File = ({ datasetId, path, filename, snapshotTag = null }) => {
  const snapshotVersionPath = snapshotTag ? `/versions/${snapshotTag}` : ''
  // React route to display the file
  const viewerPath = `/datasets/${datasetId}${snapshotVersionPath}/file-display/${filePath(
    path,
    filename,
  )}`
  return (
    <>
      {filename}
      <span className="filetree-editfile">
        <span className="edit-file download-file">
          <a
            href={apiPath(datasetId, snapshotTag, filePath(path, filename))}
            download>
            <i className="fa fa-download" /> Download
          </a>
        </span>
        <span className="edit-file view-file">
          <Link to={viewerPath}>
            <i className="fa fa-eye" /> View
          </Link>
        </span>
        <span className="edit-file update-file">
          <a
            href={apiPath(datasetId, snapshotTag, filePath(path, filename))}
            download>
            <i className="fa fa-file-o" /> Update
          </a>
        </span>
        <span className="edit-file delete-file">
          <DeleteFile datasetId={datasetId} path={path} filename={filename} />
        </span>
      </span>
    </>
  )
}

File.propTypes = {
  datasetId: PropTypes.string,
  path: PropTypes.string,
  filename: PropTypes.string,
  snapshotTag: PropTypes.string,
}

export default File
