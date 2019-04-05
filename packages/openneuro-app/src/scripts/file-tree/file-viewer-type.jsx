import React from 'react'
import PropTypes from 'prop-types'
import FileViewerText from './viewers/file-viewer-text.jsx'
import FileViewerNifti from './viewers/file-viewer-nifti.jsx'
import FileViewerJson from './viewers/file-viewer-json.jsx'

/**
 * Choose the right viewer for each file type
 */
const FileViewerType = ({ path, url, data }) => {
  if (
    path.endsWith('README') ||
    path.endsWith('CHANGES') ||
    path.endsWith('.txt')
  ) {
    return <FileViewerText data={data} />
  } else if (path.endsWith('.nii.gz') || path.endsWith('.nii')) {
    return <FileViewerNifti imageUrl={url} />
  } else if (path.endsWith('.json')) {
    return <FileViewerJson data={data} />
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
  url: PropTypes.string,
  data: PropTypes.instanceOf(ArrayBuffer),
}

export default FileViewerType
