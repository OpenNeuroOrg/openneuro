import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { flatToTree } from './flat-to-tree.js'
import FileTree from './file-tree.jsx'
import { Media } from '../styles/media'
import { useMutation } from '@apollo/client'
import WarnButton from '../common/forms/warn-button.jsx'
import { files as client } from '@openneuro/client'

const Files = ({
  datasetId,
  snapshotTag,
  datasetName,
  files,
  editMode = false,
  datasetPermissions,
}) => {
  const [filesToDelete, setFilesToDelete] = useState({})
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteFiles] = useMutation(client.deleteFiles)

  const isFileToBeDeleted = id => id in filesToDelete

  const toggleFileToDelete = ({ id, path, filename }) =>
    setFilesToDelete(prevFilesToDelete => {
      if (isFileToBeDeleted(id)) {
        delete prevFilesToDelete[id]
        return { ...prevFilesToDelete }
      }
      return {
        ...prevFilesToDelete,
        [id]: { path, filename },
      }
    })

  const bulkDelete = () => {
    if (Object.values(filesToDelete).length) {
      setIsDeleting(true)
      deleteFiles({
        variables: { datasetId, files: Object.values(filesToDelete) },
      }).then(() => {
        setIsDeleting(false)
        setFilesToDelete({})
      })
    }
  }

  const fileTree = flatToTree(files)
  const diableBtn = Object.values(filesToDelete).length ? null : true
  const filesCount = Object.values(filesToDelete).length
  const bulkDeleteButton =
    editMode &&
    (isDeleting ? (
      <span>Deleting...</span>
    ) : (
      <span className="delete-file">
        <WarnButton
          message="Bulk Delete"
          icon="fa-trash"
          warn={true}
          className="edit-file"
          action={bulkDelete}
        />{' '}
        {diableBtn ? (
          '0 files added'
        ) : (
          <>
            {filesCount} file{filesCount > 1 ? 's' : ''} added
          </>
        )}
      </span>
    ))
  return (
    <ul className="top-level-item">
      <li className="clearfix">
        <Media at="small">
          <FileTree
            datasetId={datasetId}
            snapshotTag={snapshotTag}
            path={''}
            {...fileTree}
            name={datasetName}
            editMode={editMode}
            defaultExpanded={false}
            datasetPermissions={datasetPermissions}
            toggleFileToDelete={toggleFileToDelete}
            isFileToBeDeleted={isFileToBeDeleted}
            bulkDeleteButton={bulkDeleteButton}
          />
        </Media>
        <Media greaterThanOrEqual="medium">
          <FileTree
            datasetId={datasetId}
            snapshotTag={snapshotTag}
            path={''}
            {...fileTree}
            name={datasetName}
            editMode={editMode}
            defaultExpanded={true}
            datasetPermissions={datasetPermissions}
            toggleFileToDelete={toggleFileToDelete}
            isFileToBeDeleted={isFileToBeDeleted}
            bulkDeleteButton={bulkDeleteButton}
          />
        </Media>
      </li>
    </ul>
  )
}

Files.propTypes = {
  datasetId: PropTypes.string,
  snapshotTag: PropTypes.string,
  datasetName: PropTypes.string,
  files: PropTypes.array,
  editMode: PropTypes.bool,
  fetchMore: PropTypes.func,
  datasetPermissions: PropTypes.object,
}

export default Files
