import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import UpdateFile from '../mutations/update-file.jsx'
import DeleteFile from '../mutations/delete-file.jsx'
import { Media } from '../../../styles/media'
import RemoveAnnexObject from '../mutations/remove-annex-object.jsx'
import FlagAnnexObject from '../mutations/flag-annex-object.jsx'
import { isAdmin } from '../../authentication/admin-user.jsx'
import { getProfile, hasEditPermissions } from '../../authentication/profile.js'
import { Icon } from '@openneuro/components/icon'
import { Tooltip } from '@openneuro/components/tooltip'
import { useCookies } from 'react-cookie'

const filePath = (path, filename) => `${(path && path + ':') || ''}${filename}`

const filetypeIcons = {
  md: {
    icon: 'fab fa-markdown',
    color: 'deepskyblue',
  },
  json: {
    icon: 'fab fa-node-js',
    color: 'limegreen',
  },
  tsv: {
    icon: 'fas fa-file-excel',
    color: 'lightgreen',
  },
  csv: {
    icon: 'fas fa-file-csv',
    color: 'lightgreen',
  },
  nii: {
    icon: 'fas fa-brain',
    color: 'mediumpurple',
  },
  bval: {
    icon: 'fas fa-file-alt',
    color: 'cornflowerblue',
  },
  bvec: {
    icon: 'fas fa-file-alt',
    color: 'cornflowerblue',
  },
}
const specialFileIcons = {
  README: filetypeIcons.md,
  CHANGES: {
    icon: 'fas fa-file-alt',
    color: 'orange',
  },
  LICENSE: {
    icon: 'fas fa-file-alt',
    color: 'darkslateblue',
  },
}
const defaultFileIcon = {
  icon: 'fas fa-file',
  color: 'black',
}

const fileExtPattern = /\.([0-9a-z]+)(\.gz)?$/i

const getFileIcon = filename => {
  if (Object.keys(specialFileIcons).includes(filename)) {
    return specialFileIcons[filename]
  }
  const extension = fileExtPattern.exec(filename)?.[1]
  if (Object.keys(filetypeIcons).includes(extension)) {
    return filetypeIcons[extension]
  } else {
    return defaultFileIcon
  }
}

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
  const { icon, color } = getFileIcon(filename)
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
      <Icon icon={`${icon}`} color={color} />
      &nbsp;&nbsp;
      {filename}
      <span className="filetree-editfile">
        <Media greaterThanOrEqual="medium">
          <Tooltip tooltip="Download">
            <span className="edit-file download-file">
              <a
                href={apiPath(datasetId, snapshotTag, filePath(path, filename))}
                download>
                <i className="fa fa-download" />
              </a>
            </span>
          </Tooltip>
        </Media>
        <Tooltip tooltip="View">
          <span className="edit-file view-file">
            <Link to={viewerPath}>
              <i className="fa fa-eye" />
            </Link>
          </span>
        </Tooltip>
        {editMode && (
          <Media greaterThanOrEqual="medium">
            <Tooltip tooltip="Update">
              <UpdateFile datasetId={datasetId} path={path}>
                <i className="fa fa-file-o" />
              </UpdateFile>
            </Tooltip>
          </Media>
        )}
        {editMode && filename !== 'dataset_description.json' && (
          <>
            <Media greaterThanOrEqual="medium">
              <Tooltip tooltip="Delete">
                <DeleteFile
                  datasetId={datasetId}
                  path={path}
                  filename={filename}
                />
              </Tooltip>
            </Media>
            <Media greaterThanOrEqual="medium">
              <Tooltip
                tooltip={
                  isFileToBeDeleted(id)
                    ? 'Added to Bulk Delete'
                    : 'Add to Bulk Delete'
                }>
                <div
                  className={
                    isFileToBeDeleted(id)
                      ? 'added-to-bd bulk-delete-checkbox-group delete-file'
                      : 'bulk-delete-checkbox-group delete-file'
                  }>
                  <input
                    id={'cb-' + filename}
                    type="checkbox"
                    checked={isFileToBeDeleted(id)}
                    onChange={() => toggleFileToDelete({ id, path, filename })}
                  />
                  <label htmlFor={'cb-' + filename}>
                    <Icon icon="fas fa-dumpster" />
                    {isFileToBeDeleted(id) && (
                      <span className="added-to-bulk">Added</span>
                    )}
                  </label>
                </div>
              </Tooltip>
            </Media>
          </>
        )}

        {!isMobile &&
          annexed &&
          (isAdmin() ? (
            <Media greaterThanOrEqual="medium">
              <RemoveAnnexObject
                datasetId={datasetId}
                snapshot={snapshotTag}
                annexKey={annexKey}
                path={path}
                filename={filename}
              />
            </Media>
          ) : hasEditPermissions(datasetPermissions, user && user.sub) ? (
            <Media greaterThanOrEqual="medium">
              <FlagAnnexObject
                datasetId={datasetId}
                snapshot={snapshotTag}
                filepath={filePath(path, filename)}
                annexKey={annexKey}
              />
            </Media>
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
