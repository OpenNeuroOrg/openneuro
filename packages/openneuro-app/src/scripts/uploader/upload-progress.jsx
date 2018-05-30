import React from 'react'
import PropTypes from 'prop-types'
import { ProgressBar } from 'react-bootstrap'

const UploadProgress = ({ progress }) => (
  <div className="upload-progress-block">
    <ProgressBar active bsStyle="success" now={progress} key={2} />
  </div>
)

UploadProgress.propTypes = {
  progress: PropTypes.number,
}

export default UploadProgress
