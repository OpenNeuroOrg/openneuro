import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

const Share = ({ datasetId }) => (
  <div className="dataset-form">
    <div className="col-xs-12 dataset-form-header">
      <div className="form-group">
        <label>Share Dataset</label>
      </div>
      <hr />
      <div className="col-xs-12 dataset-form-body">
        <p>Dataset shared with:</p>
        <p>Permissions list</p>
        <p>Enter a user's email address and select access level to share</p>
        <p>Access level</p>
      </div>
      <div className="col-xs-12 dataset-form-controls">
        <div className="col-xs-12 modal-actions">
          <Link to={`/datasets/${datasetId}`}>
            <button className="btn-admin-blue">Return to Dataset</button>
          </Link>
          <button className="btn-modal-action">Share</button>
        </div>
      </div>
    </div>
  </div>
)

export default Share
