import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { flatToTree } from './flat-to-tree.js'
import FileTree from './file-tree.jsx'
import { Media } from '../../../styles/media'
import { useMutation, gql } from '@apollo/client'
import { WarnButton } from '@openneuro/components/warn-button'
import { AccordionWrap } from '@openneuro/components/accordion'
import styled from '@emotion/styled'

const StyleWrapper = styled.div`
  .filetree-wrapper {
    border: 1px solid #ccc;
    border-radius: 4px;
    padding: 0 0 0 15px;
    margin-bottom: 25px;

    .accordion-content {
      margin: 0;
    }
    .accordion-item {
      overflow: visible;
    }
    .accordion-item.collapsed {
      display: none;
    }
    .filetree-header {
      margin: 0;
      padding: 10px 0;
      border-bottom: 1px solid #e3e3e3;
    }
    .filetree-item {
      list-style-type: none;
      padding: 5px 0 5px 15px;
      border-left: 1px solid #e3e3e3;
    }
    .filetree-item:not(:last-child) {
      border-bottom: 1px solid #e3e3e3;
    }
    .filetree-dir-tools {
      padding-bottom: 5px;
      border-bottom: 1px solid #e3e3e3;
      .filetree-editfile span:last-child {
        margin: 0 0 0 auto;
      }
    }
    button.btn-warn-component {
      padding: 0;
      i {
        font-size: 16px;
      }
    }
    .filetree-editfile {
      display: flex;
      margin-left: auto;
      margin-right: 15px;

      i {
        font-size: 16px;
      }

      .edit-file {
        float: left;
        margin-right: 5px;
        text-align: center;
        display: inline-block;
        overflow: hidden;
        font-size: 10px;
        line-height: 10px;
        margin: 0 5px 0 0;
        width: auto;
        position: relative;
        padding: 3px 5px;
        border: 0;
        color: #007c92;
        color: var(--secondary);
      }
      .delete-file {
        margin-right: 10px;
      }
      .delete-file.bulk-delete {
        display: flex;

        span.bulk-delete-count {
          margin-left: 5px;
        }
      }
      .edit-file input,
      .delete-file input {
        opacity: 0;
        filter: alpha(opacity=0);
        position: absolute;
        cursor: pointer;
        left: 0;
        right: 0;
        bottom: 0;
        top: 0;
        width: 100%;
      }
      div.bulk-delete-checkbox-group.delete-file {
        input {
          opacity: 1;
          left: 4px;
          top: 12px;
        }
      }
      button.btn-warn-component {
        border: none;
        background: none;
        color: indianred;
      }
    }
    ul.child-files {
      margin: 0;
      padding: 0;
    }
    .filetree-file {
      display: flex;
    }
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
        <WarnButton
          message="Bulk Delete"
          icon="fas fa-dumpster"
          className="edit-file"
          tooltip="Click the dumpster icon on files below to add them to the delete batch."
          onConfirmedClick={bulkDelete}
        />{' '}
        <span className="bulk-delete-count">
          {disableBtn ? '(none)' : `(${filesCount})`}
        </span>
      </span>
    ))
  return (
    <StyleWrapper>
      <AccordionWrap className="filetree-wrapper">
        <h4 className="filetree-header">{datasetName}</h4>
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
}

export default Files
