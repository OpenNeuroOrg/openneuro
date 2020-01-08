import React from 'react'
import FileSelect from '../common/forms/file-select.jsx'
import UploaderContext from './uploader-context.js'

const UploadSelect = () => (
  <div>
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
  </div>
)

export default UploadSelect
