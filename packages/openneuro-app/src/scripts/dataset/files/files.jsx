import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { flatToTree } from './flat-to-tree.js'
import FileTree from './file-tree.jsx'
import { Media } from '../../styles/media'
import { useMutation, gql } from '@apollo/client'
import { WarnButton } from '@openneuro/components/warn-button'
import { AccordionWrap } from '@openneuro/components/accordion'
import styled from '@emotion/styled'
import { Tooltip } from '@openneuro/components/tooltip'
import bytes from 'bytes'

const FileTreeMeta = styled.span`
  position: absolute;
  top: 8px;
  right: 8px;
`

const FileTreeMetaLabel = styled.label`
  font-weight: bold;
  padding-left: 1ch;
`

const StyleWrapper = styled.div`
  .filetree-wrapper {
    border: 1px solid #ccc;
  }
`

const DELETE_FILES = gql`
  mutation deleteFiles($datasetId: ID!, $files: [DeleteFile]) {
    deleteFiles(datasetId: $datasetId, files: $files)
  }
`

const Files = ({
  datasetId,
  snapshotTag,
  datasetName,
  files,
  editMode = false,
  datasetPermissions,
  summary,
}) => {
  const [filesToDelete, setFilesToDelete] = useState({})
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteFiles] = useMutation(DELETE_FILES)

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
  const disableBtn = Object.values(filesToDelete).length ? null : true
  const filesCount = Object.values(filesToDelete).length
  const bulkDeleteButton =
    editMode &&
    (isDeleting ? (
      <span>Deleting...</span>
    ) : (
      <span className="delete-file bulk-delete">
        <span className="bulk-delete-count">
          {disableBtn ? (
            <Tooltip tooltip="Click the dumpster icon to add files to Bulk Delete">
              <b>Bulk Delete (0)</b>
            </Tooltip>
          ) : (
            <WarnButton
              message={'Bulk Delete (' + filesCount + ')'}
              icon="fas fa-dumpster"
              iconOnly={true}
              className="edit-file"
              tooltip={'Delete ' + filesCount}
              onConfirmedClick={bulkDelete}
            />
          )}
        </span>
      </span>
    ))
  return (
    <StyleWrapper>
      <AccordionWrap className="filetree-wrapper">
        <Media at="small">
          <div className="filetree-item">
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
          </div>
        </Media>
        <Media greaterThanOrEqual="medium">
          <div className="filetree-item">
            {summary && (
              <FileTreeMeta>
                <FileTreeMetaLabel>Files:</FileTreeMetaLabel>{' '}
                {summary.totalFiles}{' '}
                <FileTreeMetaLabel>Size:</FileTreeMetaLabel>{' '}
                {bytes(summary.size)}
              </FileTreeMeta>
            )}
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
          </div>
        </Media>
      </AccordionWrap>
    </StyleWrapper>
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
  summary: PropTypes.object,
}

export default Files
