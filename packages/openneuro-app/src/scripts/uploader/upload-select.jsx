import React from 'react'
import FileSelect from '../common/forms/file-select.jsx'
import UploaderContext from './uploader-context.js'

const UploadSelect = () => (
  <UploaderContext.Consumer>
    {uploader => (
      <div className="message fade-in">
        Select a{' '}
        <a
          href="http://bids.neuroimaging.io"
          target="_blank"
          rel="noopener noreferrer">
          BIDS dataset
        </a>{' '}
        to upload
        <FileSelect onChange={uploader.selectFiles} />
      </div>
    )}
  </UploaderContext.Consumer>
)

export default UploadSelect
