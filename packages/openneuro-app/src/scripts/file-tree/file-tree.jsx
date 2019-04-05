import React, { useState } from 'react'
import PropTypes from 'prop-types'
import File from './file.jsx'

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
      <ul className="child-files">
        {expanded &&
          files.map((file, index) => (
            <li className="clearfix">
              <File
                datasetId={datasetId}
                snapshotTag={snapshotTag}
                path={path}
                {...file}
                key={index}
              />
            </li>
          ))}
        {expanded &&
          directories.map((dir, index) => (
            <li className="clearfix">
              <FileTree
                datasetId={datasetId}
                snapshotTag={snapshotTag}
                {...dir}
                key={index}
              />
            </li>
          ))}
      </ul>
    </>
  )
}

FileTree.propTypes = {
  datasetId: PropTypes.string,
  files: PropTypes.array,
}

export default FileTree
