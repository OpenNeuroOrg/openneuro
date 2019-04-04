import React, { useState } from 'react'
import PropTypes from 'prop-types'
import File from './file.jsx'

const FileTree = ({ name = '', files = [], directories = [] }) => {
  const [expanded, setExpanded] = useState(false)

  return (
    <>
      <button
        className="btn-file-folder"
        onClick={() => setExpanded(!expanded)}>
        <i className={`type-icon fa fa-folder${expanded ? '-open' : ''}`} />
        {name}
      </button>
      <ul className="child-files">
        {expanded &&
          files.map((file, index) => (
            <li className="clearfix">
              <File {...file} key={index} />
            </li>
          ))}
        {expanded &&
          directories.map((dir, index) => (
            <li className="clearfix">
              <FileTree {...dir} key={index} />
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
