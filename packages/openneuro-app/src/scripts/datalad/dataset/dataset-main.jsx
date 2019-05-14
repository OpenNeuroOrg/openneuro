import React from 'react'
import PropTypes from 'prop-types'
import DatasetRoutes from '../routes/dataset-routes.jsx'
import Comments from './comments.jsx'

const DatasetMain = ({ dataset }) => (
  <>
    <DatasetRoutes dataset={dataset} />
    <Comments
      datasetId={dataset.id}
      uploader={dataset.uploader}
      comments={dataset.comments}
    />
  </>
)

DatasetMain.propTypes = {
  dataset: PropTypes.object,
}

export default DatasetMain
