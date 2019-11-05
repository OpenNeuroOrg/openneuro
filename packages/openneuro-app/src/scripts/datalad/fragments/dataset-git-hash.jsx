import React from 'react'
import PropTypes from 'prop-types'

const DatasetGitHash = ({ title, gitHash }) => (
  <div className="dataset-git-hash">
    <div className="col-xs-12">
      <div className="file-structure fade-in panel-group">
        <div className="panel panel-default">
          <div className="panel-heading">
            <h3 className="panel-title">{title}</h3>
          </div>
          <div className="panel-body">{gitHash}</div>
        </div>
      </div>
    </div>
  </div>
)

DatasetGitHash.propTypes = {
  title: PropTypes.String,
  gitHash: PropTypes.String,
}

export default DatasetGitHash
