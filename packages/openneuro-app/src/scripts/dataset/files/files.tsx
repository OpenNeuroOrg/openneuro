import React, { useState } from "react"
import PropTypes from "prop-types"
import FileTree from "./file-tree"
import { Media } from "../../styles/media"
import { gql, useMutation } from "@apollo/client"
import { WarnButton } from "../../components/warn-button/WarnButton"
import { AccordionWrap } from "../../components/accordion/AccordionWrap"
import styled from "@emotion/styled"
import { Tooltip } from "../../components/tooltip/Tooltip"
import type { DatasetFile } from "../../types/dataset-file"
import bytes from "bytes"

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

interface FilesProps {
  datasetId: string
  snapshotTag: string
  datasetName: string
  files: DatasetFile[]
  editMode: boolean
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  datasetPermissions: any
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  summary: any
}

const Files = ({
  datasetId,
  snapshotTag,
  datasetName,
  files,
  editMode = false,
  datasetPermissions,
  summary,
}: FilesProps): JSX.Element => {
  const [filesToDelete, setFilesToDelete] = useState({})
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteFiles] = useMutation(DELETE_FILES)

  const isFileToBeDeleted = (id: string): boolean => id in filesToDelete

  const toggleFileToDelete = ({ id, path, filename }): void =>
    setFilesToDelete((prevFilesToDelete) => {
      if (isFileToBeDeleted(id)) {
        delete prevFilesToDelete[id]
        return { ...prevFilesToDelete }
      }
      return {
        ...prevFilesToDelete,
        [id]: { path, filename },
      }
    })

  const bulkDelete = (): void => {
    if (Object.values(filesToDelete).length) {
      setIsDeleting(true)
      void deleteFiles({
        variables: { datasetId, files: Object.values(filesToDelete) },
      }).then(() => {
        setIsDeleting(false)
        setFilesToDelete({})
      })
    }
  }

  const disableBtn = Object.values(filesToDelete).length ? null : true
  const filesCount = Object.values(filesToDelete).length
  const bulkDeleteButton = editMode &&
    (isDeleting
      ? <span>Deleting...</span>
      : (
        <span className="delete-file bulk-delete">
          <span className="bulk-delete-count">
            {disableBtn
              ? (
                <Tooltip tooltip="Click the dumpster icon to add files to Bulk Delete">
                  <b>Bulk Delete (0)</b>
                </Tooltip>
              )
              : (
                <WarnButton
                  message={`Bulk Delete (${filesCount})`}
                  icon="fas fa-dumpster"
                  iconOnly={true}
                  className="edit-file"
                  tooltip={`Delete ${filesCount}`}
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
              path={""}
              files={files}
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
                <FileTreeMetaLabel>Files:</FileTreeMetaLabel>{" "}
                {summary.totalFiles}{" "}
                <FileTreeMetaLabel>Size:</FileTreeMetaLabel>{" "}
                {bytes(summary.size)}
              </FileTreeMeta>
            )}
            <FileTree
              datasetId={datasetId}
              snapshotTag={snapshotTag}
              path={""}
              files={files}
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
