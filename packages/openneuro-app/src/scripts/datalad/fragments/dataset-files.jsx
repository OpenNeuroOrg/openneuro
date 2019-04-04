import React from 'react'
import PropTypes from 'prop-types'
import Files from '../../file-tree/files.jsx'

const DatasetFiles = ({ datasetName, files }) => (
  <div className="dataset-files">
    <div className="col-xs-12">
      <div className="file-structure fade-in panel-group">
        <div className="panel panel-default">
          <div className="panel-heading">
            <h3 className="panel-title">Dataset File Tree</h3>
          </div>
          <div className="panel-collapse" aria-expanded="false">
            <div className="panel-body">
              <Files datasetName={datasetName} files={files} />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
)

DatasetFiles.propTypes = {
  files: PropTypes.array,
}

export default DatasetFiles
