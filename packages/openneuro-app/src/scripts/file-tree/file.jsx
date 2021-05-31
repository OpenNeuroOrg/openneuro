import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import UpdateFile from '../datalad/mutations/update-file.jsx'
import DeleteFile from '../datalad/mutations/delete-file.jsx'
import { Media } from '../styles/media'
import RemoveAnnexObject from '../datalad/mutations/remove-annex-object.jsx'
import FlagAnnexObject from '../datalad/mutations/flag-annex-object.jsx'
import { isAdmin } from '../authentication/admin-user.jsx'
import {
  getProfile,
  hasEditPermissions,
} from '../refactor_2021/authentication/profile.js'
import { useCookies } from 'react-cookie'

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
  snapshotTag,
  editMode = false,
  isMobile,
  annexed,
  annexKey,
  datasetPermissions,
  toggleFileToDelete,
  isFileToBeDeleted,
}) => {
  const snapshotVersionPath = snapshotTag ? `/versions/${snapshotTag}` : ''
  // React route to display the file
  const viewerPath = `/datasets/${datasetId}${snapshotVersionPath}/file-display/${filePath(
    path,
    filename,
  )}`
  const [cookies] = useCookies()
  const user = getProfile(cookies)
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
            <div className="bulk-delete-checkbox-group delete-file">
              <input
                id={'cb-' + filename}
                type="checkbox"
                checked={isFileToBeDeleted(id)}
                onChange={() => toggleFileToDelete({ id, path, filename })}
              />
              <label htmlFor={'cb-' + filename}>
                {isFileToBeDeleted(id) ? 'ADDED' : 'ADD TO BULK DELETE'}{' '}
              </label>
            </div>
          </>
        )}
        {!isMobile &&
          annexed &&
          (isAdmin() ? (
            <RemoveAnnexObject
              datasetId={datasetId}
              snapshot={snapshotTag}
              annexKey={annexKey}
              path={path}
              filename={filename}
            />
          ) : hasEditPermissions(datasetPermissions, user && user.sub) ? (
            <FlagAnnexObject
              datasetId={datasetId}
              snapshot={snapshotTag}
              filepath={filePath(path, filename)}
              annexKey={annexKey}
            />
          ) : null)}
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
