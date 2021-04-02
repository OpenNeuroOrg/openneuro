import React from 'react'
import PropTypes from 'prop-types'
import Files from '../../file-tree/files.jsx'
import ErrorBoundary from '../../errors/errorBoundary.jsx'

const DatasetFiles = ({
  datasetId,
  snapshotTag = null,
  datasetName,
  files,
  editMode,
  datasetPermissions,
}) => (
  <div className="dataset-files">
    <div className="col-xs-12">
      <div className="file-structure fade-in panel-group">
        <div className="panel panel-default">
          <div className="panel-heading">
            <h3 className="panel-title">Dataset File Tree</h3>
          </div>
          <div className="panel-collapse" aria-expanded="false">
            <div className="panel-body">
              <ErrorBoundary subject={'error in dataset filetree'}>
                <Files
                  datasetId={datasetId}
                  snapshotTag={snapshotTag}
                  datasetName={datasetName}
                  files={files}
                  editMode={editMode}
                  datasetPermissions={datasetPermissions}
                />
              </ErrorBoundary>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
)

DatasetFiles.propTypes = {
  datasetId: PropTypes.string,
  snapshotTag: PropTypes.string,
  datasetName: PropTypes.string,
  files: PropTypes.array,
  editMode: PropTypes.bool,
  datasetPermissions: PropTypes.object,
}

export default DatasetFiles
