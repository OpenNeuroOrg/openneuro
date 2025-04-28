import React from "react"
import PropTypes from "prop-types"
import { ProgressBar } from "../components/progress-bar/ProgressBar"

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
