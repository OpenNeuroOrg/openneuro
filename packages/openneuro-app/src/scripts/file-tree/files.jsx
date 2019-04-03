import React from 'react'
import PropTypes from 'prop-types'
import { flatToTree } from './flat-to-tree.js'
import FileTree from './file-tree.jsx'

const Files = ({ datasetId, files }) => {
  const fileTree = flatToTree(files)
  return <FileTree {...fileTree} name={datasetId} />
}

export default Files
