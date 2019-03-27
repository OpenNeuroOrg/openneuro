import React from 'react'
import PropTypes from 'prop-types'
import DatasetRoutes from '../routes/dataset-routes.jsx'
import Comments from './comments.jsx'

const DatasetMain = ({ dataset }) => (
  <>
    <div className="row">
      <DatasetRoutes dataset={dataset} />
    </div>
    <div className="row">
      <Comments
        datasetId={dataset.id}
        uploader={dataset.uploader}
        comments={dataset.comments}
      />
    </div>
  </>
)

DatasetMain.propTypes = {
  dataset: PropTypes.object,
}

export default DatasetMain
