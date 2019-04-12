import React from 'react'
import PropTypes from 'prop-types'
import { flatToTree } from './flat-to-tree.js'
import FileTree from './file-tree.jsx'

const Files = ({
  datasetId,
  snapshotTag,
  datasetName,
  files,
  editMode = false,
}) => {
  const fileTree = flatToTree(files)
  return (
    <ul className="top-level-item">
      <li className="clearfix">
        <FileTree
          datasetId={datasetId}
          snapshotTag={snapshotTag}
          path={''}
          {...fileTree}
          name={datasetName}
          editMode={editMode}
          defaultExpanded={true}
        />
      </li>
    </ul>
  )
}

Files.propTypes = {
  datasetName: PropTypes.string,
  files: PropTypes.array,
}

export default Files
