import React from 'react'
import PropTypes from 'prop-types'

const UploadFileStatus = ({ uploadingFiles, failedFiles }) => (
  <>
    <p>{[...uploadingFiles].join(', ')}</p>
    <p>
      {failedFiles.size
        ? `Too many failed attempts for '${[...failedFiles].join(', ')}'`
        : null}
    </p>
  </>
)

UploadFileStatus.propTypes = {
  uploadingFiles: PropTypes.instanceOf(Set),
  failedFiles: PropTypes.instanceOf(Set),
}

export default UploadFileStatus
