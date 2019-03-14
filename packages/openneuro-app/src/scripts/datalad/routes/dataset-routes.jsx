import React from 'react'
import PropTypes from 'prop-types'
import { Route, Switch } from 'react-router-dom'
import DatasetContent from './dataset-content.jsx'
import SnapshotContent from './snapshot-content.jsx'
import DownloadDataset from '../download/download-dataset.jsx'
import Publish from './publish.jsx'

const stubComponent = () => null

const DatasetRoutes = ({ dataset }) => (
  <Switch>
    <Route
      name="dataset"
      exact
      path="/datasets/:datasetId"
      render={() => <DatasetContent dataset={dataset} />}
    />
    <Route
      name="download"
      exact
      path="/datasets/:datasetId/download"
      component={DownloadDataset}
    />
    <Route
      name="publish"
      exact
      path="/datasets/:datasetId/publish"
      component={() => <Publish datasetId={dataset.id} />}
    />
    <Route
      name="snapshot-create"
      exact
      path="/datasets/:datasetId/create-snapshot"
      component={stubComponent}
    />
    <Route
      name="share"
      exact
      path="/datasets/:datasetId/share"
      component={stubComponent}
    />
    <Route
      name="jobs"
      exact
      path="/datasets/:datasetId/jobs"
      component={stubComponent}
    />
    <Route
      name="subscribe"
      exact
      path="/datasets/:datasetId/subscribe"
      component={stubComponent}
    />
    <Route
      name="warn"
      exact
      path="/datasets/:datasetId/update-warn"
      component={stubComponent}
    />
    <Route
      name="fileEdit"
      exact
      path="/datasets/:datasetId/file-edit"
      component={stubComponent}
    />
    <Route
      name="fileDisplay"
      path="/datasets/:datasetId/file-display"
      component={stubComponent}
    />
    {/* Snapshot routes */}
    <Route
      name="snapshot"
      exact
      path="/datasets/:datasetId/versions/:tag"
      render={({
        match: {
          params: { tag },
        },
      }) => {
        return <SnapshotContent dataset={dataset} tag={tag} />
      }}
    />
    <Route
      name="snapshot-download"
      exact
      path="/datasets/:datasetId/versions/:snapshotId/download"
      component={DownloadDataset}
    />
  </Switch>
)

DatasetRoutes.propTypes = {
  dataset: PropTypes.object,
}

export default DatasetRoutes
