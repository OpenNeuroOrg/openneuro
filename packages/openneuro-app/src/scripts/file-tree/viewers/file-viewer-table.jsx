import React from 'react'
import PropTypes from 'prop-types'

const FileViewerTable = ({ data }) => {
  const decoder = new TextDecoder()
  return <pre>{decoder.decode(data)}</pre>
}

FileViewerTable.propTypes = {
  data: PropTypes.instanceOf(ArrayBuffer),
}

export default FileViewerTable
