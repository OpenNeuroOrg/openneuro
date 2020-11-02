import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import DatasetHistory from '../fragments/dataset-history.jsx'
import CacheClear from '../mutations/cache-clear.jsx'

const AdminDataset = ({ datasetId }) => (
  <div className="dataset-form">
    <div className="col-xs-12 dataset-form-header">
      <div className="form-group">
        <label>Admin</label>
      </div>
      <DatasetHistory datasetId={datasetId} />
      <CacheClear datasetId={datasetId} />
      <hr />
      <div className="col-xs-12 dataset-form-controls">
        <div className="col-xs-12 modal-actions">
          <Link to={`/datasets/${datasetId}`}>
            <button className="btn-admin-blue">Return to Dataset</button>
          </Link>
        </div>
      </div>
    </div>
  </div>
)

AdminDataset.propTypes = {
  datasetId: PropTypes.string,
}

export default AdminDataset
