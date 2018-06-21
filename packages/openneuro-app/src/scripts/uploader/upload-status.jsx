import React from 'react'
import UploaderContext from './uploader-context.js'
import UploadProgress from './upload-progress.jsx'

const UploadStatus = () => (
  <UploaderContext.Consumer>
    {uploader => (
      <div>
        <h4>
          {uploader.name} - Uploading {uploader.files.length} files.
        </h4>
        <UploadProgress progress={uploader.progress} />
      </div>
    )}
  </UploaderContext.Consumer>
)

export default UploadStatus
