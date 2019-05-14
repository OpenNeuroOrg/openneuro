import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import PublishDataset from '../mutations/publish.jsx'

const Publish = ({ datasetId }) => (
  <div className="dataset-form">
    <div className="col-xs-12 dataset-form-header">
      <div className="form-group">
        <label>Publish</label>
      </div>
      <hr />
      <div className="col-xs-12 dataset-form-body">
        <p className="text-danger">
          All existing and future snapshots of this dataset will be released
          publicly under a{' '}
          <a href="https://wiki.creativecommons.org/wiki/CC0">CC0 license</a>.
        </p>
      </div>
      <div className="col-xs-12 dataset-form-controls">
        <div className="col-xs-12 modal-actions">
          <Link to={`/datasets/${datasetId}`}>
            <button className="btn-admin-blue">Return to Dataset</button>
          </Link>
          <PublishDataset datasetId={datasetId} />
        </div>
      </div>
    </div>
  </div>
)

Publish.propTypes = {
  datasetId: PropTypes.string,
}

export default Publish
