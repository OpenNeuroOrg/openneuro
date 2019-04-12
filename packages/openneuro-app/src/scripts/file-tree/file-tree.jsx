import React, { useState } from 'react'
import PropTypes from 'prop-types'
import File from './file.jsx'
import UpdateFile from '../datalad/mutations/update-file.jsx'

const sortByFilename = (a, b) => a.filename.localeCompare(b.filename)

const sortByName = (a, b) => a.name.localeCompare(b.name)

const FileTree = ({
  datasetId,
  snapshotTag = null,
  path = '',
  name = '',
  files = [],
  directories = [],
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
          <span className="filetree-editfile">
            <UpdateFile datasetId={datasetId}>
              <i className="fa fa-plus" /> Add File
            </UpdateFile>
            <UpdateFile datasetId={datasetId} path={path} multiple>
              <i className="fa fa-plus" /> Add Directory
            </UpdateFile>
          </span>
          <ul className="child-files">
            {files.sort(sortByFilename).map((file, index) => (
              <li className="clearfix" key={index}>
                <File
                  datasetId={datasetId}
                  snapshotTag={snapshotTag}
                  path={path}
                  {...file}
                />
              </li>
            ))}
            {directories.sort(sortByName).map((dir, index) => (
              <li className="clearfix" key={index}>
                <FileTree
                  datasetId={datasetId}
                  snapshotTag={snapshotTag}
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
}

export default FileTree
