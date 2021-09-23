import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import DatasetHistory from '../fragments/dataset-history.jsx'
import CacheClear from '../mutations/cache-clear.jsx'

const AdminDataset = ({ dataset }) => (
  <div className="datalad-dataset-form container">
    <div className="grid">
      <div className="col col-12">
        <h2>Admin: Datalad Tools</h2>
      </div>
      <div className="col col-12">
        <p>
          Delete dataset cache drops all dataset caches (snapshot index,
          draft/snapshot file listings, current dataset description) and the
          cache is repopulated on the next API call.
        </p>
        <p>
          Reset draft head will move the draft to a given commit and rerun
          validation.
        </p>
      </div>
      <div className="col col-12">
        <h3>Draft Head</h3> {dataset.draft.head}
      </div>
      <DatasetHistory datasetId={dataset.id} />
      <hr />
      <div className="col col-12 dataset-form-controls">
        <div className="grid">
          <CacheClear datasetId={dataset.id} />
          <Link
            className="return-link col-middle"
            to={`/datasets/${dataset.id}`}>
            Return to Dataset
          </Link>
        </div>
      </div>
    </div>
  </div>
)

AdminDataset.propTypes = {
  dataset: PropTypes.object,
}

export default AdminDataset
