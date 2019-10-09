import React from 'react'
import { Route, Switch } from 'react-router-dom'
import DatasetQuery from './dataset-query.jsx'

const Dataset = () => {
  return (
    <Switch>
      <Route
        name="datalad-snapshot"
        path="/datasets/:datasetId/versions/:snapshotId"
        component={DatasetQuery}
      />
      <Route
        name="datalad-dataset"
        path="/datasets/:datasetId/"
        component={DatasetQuery}
      />
    </Switch>
  )
}

export default Dataset
