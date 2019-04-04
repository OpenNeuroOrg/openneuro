import React from 'react'
import PropTypes from 'prop-types'
import File from './file.jsx'

const FileTree = ({ name = '', files = [], directories = [] }) => {
  return (
    <>
      <div>{name}</div>
      {directories.map((dir, index) => (
        <FileTree {...dir} key={index} />
      ))}
      {files.map((file, index) => (
        <File {...file} key={index} />
      ))}
    </>
  )
}

FileTree.propTypes = {
  datasetId: PropTypes.string,
  files: PropTypes.array,
}

export default FileTree
