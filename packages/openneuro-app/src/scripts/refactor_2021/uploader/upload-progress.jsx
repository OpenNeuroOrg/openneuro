import React from 'react'
import PropTypes from 'prop-types'
import { ProgressBar } from '@openneuro/components/progress-bar'

const UploadProgress = ({ progress }) => {
  return (
    <div className="upload-progress-block">
      <ProgressBar width={progress} />
    </div>
  )
}

UploadProgress.propTypes = {
  progress: PropTypes.number,
}

export default UploadProgress
