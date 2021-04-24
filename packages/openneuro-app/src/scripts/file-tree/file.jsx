import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import UpdateFile from '../datalad/mutations/update-file.jsx'
import DeleteFile from '../datalad/mutations/delete-file.jsx'
import { Media } from '../styles/media'

const filePath = (path, filename) => `${(path && path + ':') || ''}${filename}`

export const apiPath = (datasetId, snapshotTag, filePath) => {
  const snapshotPath = snapshotTag ? `/snapshots/${snapshotTag}` : ''
  return `/crn/datasets/${datasetId}${snapshotPath}/files/${filePath}`
}

const File = ({
  id,
  datasetId,
  path,
  filename,
  snapshotTag = null,
  editMode = false,
  toggleFileToDelete,
  isFileToBeDeleted,
}) => {
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
        <Media greaterThanOrEqual="medium">
          <span className="edit-file download-file">
            <a
              href={apiPath(datasetId, snapshotTag, filePath(path, filename))}
              download>
              <i className="fa fa-download" /> Download
            </a>
          </span>
        </Media>
        <span className="edit-file view-file">
          <Link to={viewerPath}>
            <i className="fa fa-eye" /> View
          </Link>
        </span>
        {editMode && (
          <Media greaterThanOrEqual="medium">
            <UpdateFile datasetId={datasetId} path={path}>
              <i className="fa fa-file-o" /> Update
            </UpdateFile>
          </Media>
        )}
        {editMode && filename !== 'dataset_description.json' && (
          <>
            <Media greaterThanOrEqual="medium">
              <DeleteFile
                datasetId={datasetId}
                path={path}
                filename={filename}
              />
            </Media>
            <input
              type="checkbox"
              checked={isFileToBeDeleted(id)}
              onChange={() => toggleFileToDelete({ id, path, filename })}
            />
          </>
        )}
      </span>
    </>
  )
}

File.propTypes = {
  datasetId: PropTypes.string,
  path: PropTypes.string,
  filename: PropTypes.string,
  snapshotTag: PropTypes.string,
  editMode: PropTypes.bool,
}

export default File
