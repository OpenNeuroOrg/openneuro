import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { flatToTree } from './flat-to-tree.js'
import FileTree from './file-tree.jsx'
import { Media } from '../styles/media'
import { useMutation, gql } from '@apollo/client'

const DELETE_BULK = gql`
  mutation deleteBulk($datasetId: ID!, $files: [DeleteFile]) {
    deleteBulk(datasetId: $datasetId, files: $files)
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
  const [deleteBulk] = useMutation(DELETE_BULK)

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
      deleteBulk({
        variables: { datasetId, files: Object.values(filesToDelete) },
      }).then(() => {
        setIsDeleting(false)
        setFilesToDelete({})
      })
    }
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
