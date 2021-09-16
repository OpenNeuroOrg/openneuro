import React, { useState } from 'react'
import PropTypes from 'prop-types'
import File from './file.jsx'
import UpdateFile from '../mutations/update-file.jsx'
import DeleteDir from '../mutations/delete-dir.jsx'
import FileTreeUnloadedDirectory from './file-tree-unloaded-directory.jsx'
import { Media } from '../styles/media'
import { AccordionTab } from '@openneuro/components/accordion'

export const sortByFilename = (a, b) => a.filename.localeCompare(b.filename)

export const sortByName = (a, b) => a.name.localeCompare(b.name)

export const unescapePath = path => path.replace(/:/g, '/')

const isTopLevel = dir => !dir.path.includes(':')

const FileTree = ({
  datasetId,
  snapshotTag = null,
  path = '',
  name = '',
  files = [],
  directories = [],
  editMode = false,
  defaultExpanded = false,
  datasetPermissions,
  toggleFileToDelete,
  isFileToBeDeleted,
  bulkDeleteButton,
}) => {
  return (
    <AccordionTab
      className=""
      label={name}
      accordionStyle="file-tree"
      startOpen={defaultExpanded}
    >
      {editMode && (
        <Media className="filetree-dir-tools" greaterThanOrEqual="medium">
          <span className="filetree-editfile">
            <UpdateFile
              datasetId={datasetId}
              path={unescapePath(path)}
              multiple>
              <i className="fa fa-plus" /> Add Files
            </UpdateFile>
            <UpdateFile
              datasetId={datasetId}
              path={unescapePath(path)}
              tooltip={`Choose a folder to be added to /${name}. Adding a folder with an existing name will overwrite that folder.`}
              directory>
              <i className="fa fa-plus" /> Add Directory
            </UpdateFile>
            {bulkDeleteButton || (
              <DeleteDir datasetId={datasetId} path={path} />
            )}
          </span>
        </Media>
      )}
      <ul className="child-files">
        {files.sort(sortByFilename).map((file, index) => (
          <li className="clearfix filetree-item filetree-file" key={index}>
            <File
              id={file.id}
              datasetId={datasetId}
              snapshotTag={snapshotTag}
              path={path}
              editMode={editMode}
              toggleFileToDelete={toggleFileToDelete}
              isFileToBeDeleted={isFileToBeDeleted}
              {...file}
              annexKey={file.key}
              datasetPermissions={datasetPermissions}
            />
          </li>
        ))}
        {directories.sort(sortByName).map((dir, index) => {
          if ('files' in dir || 'directories' in dir) {
            // Loaded directory
            return (
              <li className="clearfix filetree-item filetree-dir" key={index}>
                <FileTree
                  datasetId={datasetId}
                  snapshotTag={snapshotTag}
                  editMode={editMode}
                  defaultExpanded={isTopLevel(dir)}
                  datasetPermissions={datasetPermissions}
                  toggleFileToDelete={toggleFileToDelete}
                  isFileToBeDeleted={isFileToBeDeleted}
                  {...dir}
                />
              </li>
            )
          } else {
            // Unloaded
            return (
              <li className="clearfix filetree-item filetree-dir" key={index}>
                <FileTreeUnloadedDirectory
                  datasetId={datasetId}
                  snapshotTag={snapshotTag}
                  directory={dir}
                />
              </li>
            )
          }
        })}
      </ul>
    </AccordionTab>
  )
}

FileTree.propTypes = {
  datasetId: PropTypes.string,
  files: PropTypes.array,
  snapshotTag: PropTypes.string,
  path: PropTypes.string,
  name: PropTypes.string,
  directories: PropTypes.array,
  editMode: PropTypes.bool,
  defaultExpanded: PropTypes.bool,
  datasetPermissions: PropTypes.object,
}

export default FileTree
