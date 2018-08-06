import React from 'react'
import PropTypes from 'prop-types'
import FileSelect from '../common/forms/file-select.jsx'
import UploaderContext from './uploader-context.js'

const UploadResume = ({ datasetId }) => (
  <UploaderContext.Consumer>
    {uploader =>
      uploader.uploading ? (
        <button
          className="fileupload-btn btn-admin"
          disabled={true}
          title="Please wait for your current upload to finish before resuming">
          <span>
            <i className="fa fa-repeat" />&nbsp;
          </span>Resume
        </button>
      ) : (
        <FileSelect
          onChange={uploader.resumeDataset(datasetId)}
          resume
          disabled={uploader.uploading}
        />
      )
    }
  </UploaderContext.Consumer>
)

UploadResume.propTypes = {
  datasetId: PropTypes.string,
}

export default UploadResume
