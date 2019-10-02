import React, { useState } from 'react'
import PropTypes from 'prop-types'
import File from './file.jsx'
import UpdateFile from '../datalad/mutations/update-file.jsx'
import DeleteDir from '../datalad/mutations/delete-dir.jsx'

export const sortByFilename = (a, b) => a.filename.localeCompare(b.filename)

export const sortByName = (a, b) => a.name.localeCompare(b.name)

export const unescapePath = path => path.replace(/:/g, '/')

const FileTree = ({
  datasetId,
  snapshotTag = null,
  path = '',
  name = '',
  files = [],
  directories = [],
  editMode = false,
  defaultExpanded = false,
}) => {
  const [expanded, setExpanded] = useState(defaultExpanded)
  return (
    <>
      <button
        className="btn-file-folder"
        onClick={() => setExpanded(!expanded)}>
        <i className={`type-icon fa fa-folder${expanded ? '-open' : ''}`} />{' '}
        {name}
        <i
          className={`accordion-icon fa fa-caret${expanded ? '-up' : '-down'}`}
        />
      </button>
      {expanded && (
        <>
          {editMode && (
            <span className="filetree-editfile">
              <UpdateFile datasetId={datasetId} path={unescapePath(path)}>
                <i className="fa fa-plus" /> Add File
              </UpdateFile>
              <UpdateFile
                datasetId={datasetId}
                path={unescapePath(path)}
                multiple>
                <i className="fa fa-plus" /> Add Directory
              </UpdateFile>
              <DeleteDir
                datasetId={datasetId}
                fileTree={{ name, path, files, directories }}
              />
            </span>
          )}
          <ul className="child-files">
            {files.sort(sortByFilename).map((file, index) => (
              <li className="clearfix" key={index}>
                <File
                  datasetId={datasetId}
                  snapshotTag={snapshotTag}
                  path={path}
                  editMode={editMode}
                  {...file}
                />
              </li>
            ))}
            {directories.sort(sortByName).map((dir, index) => (
              <li className="clearfix" key={index}>
                <FileTree
                  datasetId={datasetId}
                  snapshotTag={snapshotTag}
                  editMode={editMode}
                  {...dir}
                />
              </li>
            ))}
          </ul>
        </>
      )}
    </>
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
}

export default FileTree
