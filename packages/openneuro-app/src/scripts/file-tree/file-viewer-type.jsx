import React from 'react'
import PropTypes from 'prop-types'
import FileViewerText from './viewers/file-viewer-text.jsx'

/**
 * Choose the right viewer for each file type
 */
const FileViewerType = ({ path, data }) => {
  if (
    path.endsWith('README') ||
    path.endsWith('CHANGES') ||
    path.endsWith('.txt')
  ) {
    return <FileViewerText data={data} />
  } else {
    return (
      <div className="file-viewer-fallback">
        This file must be downloaded to view it.
      </div>
    )
  }
}

FileViewerType.propTypes = {
  path: PropTypes.string,
  data: PropTypes.instanceOf(ArrayBuffer),
}

export default FileViewerType
