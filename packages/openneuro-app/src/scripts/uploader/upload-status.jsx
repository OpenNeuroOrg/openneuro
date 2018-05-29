import React from 'react'
import UploaderContext from './uploader-context.js'

const UploadStatus = () => (
  <UploaderContext.Consumer>{uploader => null}</UploaderContext.Consumer>
)

export default UploadStatus
