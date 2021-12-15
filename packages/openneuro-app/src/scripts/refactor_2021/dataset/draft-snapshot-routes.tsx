import React from 'react'
import { Route, Switch } from 'react-router-dom'
import DatasetQuery from './dataset-query'

const Dataset = () => {
  return (
    <Switch>
      <Route
        path="/datasets/:datasetId/versions/:snapshotId"
        component={DatasetQuery}
      />
      <Route path="/datasets/:datasetId/" component={DatasetQuery} />
    </Switch>
  )
}

export default Dataset
