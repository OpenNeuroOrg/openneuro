import React from 'react'
import { Route } from 'react-router-dom'
import DataLadDataset from './datalad.dataset.jsx'

const DataLad = () => {
  return (
    <div>
      <Route
        name="datalad-dataset"
        path="/datasets/:datasetId"
        component={DataLadDataset}
      />
      <Route
        name="datalad-snapshot"
        path="/datasets/:datasetId/version/:snapshotId"
        component={DataLadDataset}
      />
    </div>
  )
}

export default DataLad
