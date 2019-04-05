import React from 'react'
import PropTypes from 'prop-types'
import FileView from '../../file-tree/file-view.jsx'
import { apiPath } from '../../file-tree/file.jsx'

const FileDisplay = ({ datasetId, snapshotTag = null, filePath }) => (
  <div>
    {datasetId} - {filePath}
    <div className="form-group modal-title">
      <label>{filePath.split(':').slice(-1)}</label>
      <div className="modal-download btn-admin-blue">
        <a href={apiPath(datasetId, snapshotTag, filePath)} download>
          Download
        </a>
      </div>
    </div>
    <FileView datasetId={datasetId} snapshotTag={snapshotTag} path={filePath} />
  </div>
)

FileDisplay.propTypes = {
  datasetId: PropTypes.string,
  filePath: PropTypes.string,
  snapshotTag: PropTypes.string,
}

export default FileDisplay
