import React from 'react'
import UploaderContext from './uploader-context.js'
import UploadProgress from './upload-progress.jsx'

const UploadProgressButton = () => (
  <UploaderContext.Consumer>
    {uploader => (
      <span className="upload-btn-wrap">
        <a
          className="nav-link nl-upload nl-progress"
          onClick={() => uploader.setLocation('/upload')}>
          <span className="link-name">view details</span>
          <UploadProgress progress={uploader.progress} />
        </a>
      </span>
    )}
  </UploaderContext.Consumer>
)

export default UploadProgressButton
