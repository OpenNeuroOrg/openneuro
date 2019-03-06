import React from 'react'
import PropTypes from 'prop-types'
import DatasetRoutes from './dataset-routes.jsx'

const DatasetMain = ({ dataset }) => (
  <div className="row">
    <DatasetRoutes dataset={dataset} />
  </div>
)

DatasetMain.propTypes = {
  dataset: PropTypes.object,
}

export default DatasetMain
