import React from 'react'
import { Route } from 'react-router-dom'
import DatasetQuery from './dataset-query.jsx'

const Dataset = () => {
  return (
    <div>
      <Route
        name="datalad-dataset"
        path="/datasets/:datasetId"
        component={DatasetQuery}
      />
      <Route
        name="datalad-snapshot"
        path="/datasets/:datasetId/version/:snapshotId"
        component={DatasetQuery}
      />
    </div>
  )
}

export default Dataset
