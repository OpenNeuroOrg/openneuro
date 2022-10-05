import React from 'react'
import File from './file'
import UpdateFile from '../mutations/update-file.jsx'
import DeleteDir from '../mutations/delete-dir.jsx'
import FileTreeUnloadedDirectory from './file-tree-unloaded-directory.jsx'
import { Media } from '../../styles/media'
import { AccordionTab } from '@openneuro/components/accordion'
import { DatasetFile } from '../../types/dataset-file'

export const unescapePath = (path: string): string => path.replace(/:/g, '/')

interface FileTreeProps {
  datasetId: string
  snapshotTag: string
  path: string
  name: string
  files: DatasetFile[]
  editMode: boolean
  defaultExpanded: boolean
  datasetPermissions: any
  toggleFileToDelete: ({ id, path, filename }) => void
  isFileToBeDeleted: (id: string) => boolean
  bulkDeleteButton: JSX.Element
}

const FileTree = ({
  datasetId,
  snapshotTag = null,
  path = '',
  name = '',
  files = [],
  editMode = false,
  defaultExpanded = false,
  datasetPermissions,
  toggleFileToDelete,
  isFileToBeDeleted,
  bulkDeleteButton,
}: FileTreeProps): JSX.Element => {
  // Split files into a tree for this level and child levels
  // Special cases for root (path === '')
  const currentFiles = []
  const childFiles = {}
  for (const f of files) {
    // Any paths in this filename below the current path value
    const lowerPath = f.filename.substring(`${path}:`.length)
    if (path === '' ? f.filename.includes(':') : lowerPath.includes(':')) {
      // At the top level, use the directory component (first segment)
      // Below that, use all paths before the filename (sub-01:anat) for (sub-01:anat:sub-01_T1w.nii.gz)
      const childPath =
        path === ''
          ? f.filename.split(':')[0]
          : f.filename.split(':').slice(0, -1).join(':')
      if (childFiles.hasOwnProperty(childPath)) {
        childFiles[childPath].push(f)
      } else {
        childFiles[childPath] = [f]
      }
    } else {
      currentFiles.push(f)
    }
  }
  return (
    <AccordionTab
      className=""
      label={name}
      accordionStyle="file-tree"
      startOpen={defaultExpanded}>
      {editMode && (
        <Media className="filetree-dir-tools" greaterThanOrEqual="medium">
          <span className="filetree-dir">
            <UpdateFile
              datasetId={datasetId}
              path={unescapePath(path)}
              tooltip={`Choose one or more files to be added to ${name}.`}
              multiple>
              <i className="fa fa-plus" /> Add Files
            </UpdateFile>
            <UpdateFile
              datasetId={datasetId}
              path={unescapePath(path)}
              tooltip={`Choose a folder to be added to ${name}. Adding a folder with an existing name will overwrite that folder.`}
              directory>
              <i className="fa fa-plus" /> Add Directory
            </UpdateFile>
            {bulkDeleteButton || (
              <DeleteDir datasetId={datasetId} path={path} name={name} />
            )}
          </span>
        </Media>
      )}
      <ul className="child-files">
        {currentFiles.map((file, index) => {
          if (file.directory) {
            if (childFiles.hasOwnProperty(file.filename)) {
              return (
                <li className="clearfix filetree-item filetree-dir" key={index}>
                  <FileTree
                    datasetId={datasetId}
                    snapshotTag={snapshotTag}
                    editMode={editMode}
                    defaultExpanded={true}
                    datasetPermissions={datasetPermissions}
                    toggleFileToDelete={toggleFileToDelete}
                    isFileToBeDeleted={isFileToBeDeleted}
                    files={childFiles[file.filename]}
                    path={file.filename}
                    name={file.filename.split(':').pop()}
                    bulkDeleteButton={bulkDeleteButton}
                  />
                </li>
              )
            } else {
              return (
                <li className="clearfix filetree-item filetree-dir" key={index}>
                  <FileTreeUnloadedDirectory
                    datasetId={datasetId}
                    snapshotTag={snapshotTag}
                    directory={file}
                  />
                </li>
              )
            }
          } else {
            return (
              <li className="clearfix filetree-item filetree-file" key={index}>
                <File
                  id={file.id}
                  datasetId={datasetId}
                  snapshotTag={snapshotTag}
                  path={path}
                  size={file.size}
                  editMode={editMode}
                  toggleFileToDelete={toggleFileToDelete}
                  isFileToBeDeleted={isFileToBeDeleted}
                  filename={file.filename.split(':').pop()}
                  annexKey={file.key}
                  datasetPermissions={datasetPermissions}
                  annexed={file.annexed}
                  isMobile={false}
                />
              </li>
            )
          }
        })}
      </ul>
    </AccordionTab>
  )
}

export default FileTree
