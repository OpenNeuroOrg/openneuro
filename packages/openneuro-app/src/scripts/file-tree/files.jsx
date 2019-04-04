import React from 'react'
import PropTypes from 'prop-types'
import { flatToTree } from './flat-to-tree.js'
import FileTree from './file-tree.jsx'

const Files = ({ datasetName, files }) => {
  const fileTree = flatToTree(files)
  return (
    <ul className="top-level-item">
      <li className="clearfix">
        <FileTree {...fileTree} name={datasetName} />
      </li>
    </ul>
  )
}

Files.propTypes = {
  datasetName: PropTypes.string,
  files: PropTypes.array,
}

export default Files
