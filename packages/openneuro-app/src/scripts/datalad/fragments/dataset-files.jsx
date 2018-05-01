import React from 'react'
import FileTreeGeneric from '../../common/partials/file-tree-generic.jsx'

const DatasetFiles = ({ files }) => (
  <div className="dataset-files">
    <div className="col-xs-12">
      <div className="file-structure fade-in panel-group">
        <div className="panel panel-default">
          <div className="panel-heading">
            <h3 className="panel-title">Dataset File Tree</h3>
          </div>
          <div className="panel-collapse" aria-expanded="false">
            <div className="panel-body">
              <FileTreeGeneric files={files} />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
)

export default DatasetFiles
