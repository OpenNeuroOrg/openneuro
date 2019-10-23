import React, { useContext } from 'react'
import UploaderContext from './uploader-context.js'
import { readDirectory } from '../native-files/read-directory.js'

const UploadNativeSelect = () => {
  const uploader = useContext(UploaderContext)
  return (
    <div className="message fade-in">
      Select a{' '}
      <a
        href="http://bids.neuroimaging.io"
        target="_blank"
        rel="noopener noreferrer">
        BIDS dataset
      </a>{' '}
      to upload
      <button onClick={() => readDirectory().then(uploader.selectFiles)}>
        File Upload
      </button>
    </div>
  )
}
export default UploadNativeSelect
