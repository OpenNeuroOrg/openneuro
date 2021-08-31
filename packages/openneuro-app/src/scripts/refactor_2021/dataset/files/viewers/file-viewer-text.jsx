import React from 'react'
import PropTypes from 'prop-types'

const FileViewerText = ({ data }) => {
  const decoder = new TextDecoder()
  return <pre>{decoder.decode(data)}</pre>
}

FileViewerText.propTypes = {
  data: PropTypes.instanceOf(ArrayBuffer),
}

export default FileViewerText
