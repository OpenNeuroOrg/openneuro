import React from 'react'
import UploaderContext from './uploader-context.js'

const UploadProgressButton = () => (
  <UploaderContext.Consumer>
    {uploader => (
      <a
        className="nav-link nl-upload nl-progress"
        onClick={() => uploader.setLocation('/upload')}>
        view details
      </a>
    )}
  </UploaderContext.Consumer>
)

export default UploadProgressButton
