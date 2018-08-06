import React from 'react'
import PropTypes from 'prop-types'
import FileSelect from '../common/forms/file-select.jsx'
import UploaderContext from './uploader-context.js'

const UploadResume = ({ datasetId }) => (
  <UploaderContext.Consumer>
    {uploader => (
      <FileSelect onChange={uploader.resumeDataset(datasetId)} resume />
    )}
  </UploaderContext.Consumer>
)

UploadResume.propTypes = {
  datasetId: PropTypes.string,
}

export default UploadResume
