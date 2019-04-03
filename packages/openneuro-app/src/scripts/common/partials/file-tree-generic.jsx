import React from 'react'
import PropTypes from 'prop-types'

const FileTreeGeneric = ({ files }) =>
  files ? (
    <ul>
      {files.map(file => (
        <li key={file.id}>{file.filename}</li>
      ))}
    </ul>
  ) : null

FileTreeGeneric.propTypes = {
  files: PropTypes.array,
}

export default FileTreeGeneric
