import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { flatToTree } from './flat-to-tree.js'
import FileTree from './file-tree.jsx'
import { Media } from '../styles/media'
import { useMutation, gql } from '@apollo/client'

const DELETE_FILE = gql`
  mutation deleteFile($datasetId: ID!, $path: String!, $filename: String!) {
    deleteFile(datasetId: $datasetId, path: $path, filename: $filename)
  }
`

const Files = ({
  datasetId,
  snapshotTag,
  datasetName,
  files,
  editMode = false,
}) => {
  const [filesToDelete, setFilesToDelete] = useState({})
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteFile] = useMutation(DELETE_FILE)

  function toggleFileToDelete({ id, path, filename }) {
    setFilesToDelete(prevFilesToDelete => {
      if (id in prevFilesToDelete) {
        delete prevFilesToDelete[id]
        return { ...prevFilesToDelete }
      }
      return {
        ...prevFilesToDelete,
        [id]: { path, filename },
      }
    })
  }

  function isFileToBeDeleted(id) {
    return id in filesToDelete
  }

  function bulkDelete() {
    setIsDeleting(true)
    Promise.all(
      Object.values(filesToDelete).map(async ({ path, filename }) =>
        deleteFile({ variables: { datasetId, path, filename } }),
      ),
    ).then(() => setIsDeleting(false))
  }

  const fileTree = flatToTree(files)
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
            toggleFileToDelete={toggleFileToDelete}
            isFileToBeDeleted={isFileToBeDeleted}
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
            toggleFileToDelete={toggleFileToDelete}
            isFileToBeDeleted={isFileToBeDeleted}
          />
        </Media>
        {editMode &&
          (isDeleting ? (
            <span>Deleting...</span>
          ) : (
            <button onClick={bulkDelete} disabled={isDeleting}>
              Bulk Delete
            </button>
          ))}
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
}

export default Files
