import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { Route, Switch } from 'react-router-dom'
import AdminDataset from './admin.jsx'
import DatasetContent from './dataset-content.jsx'
import SnapshotContent from './snapshot-content.jsx'
import DownloadDataset from '../download/download-dataset.jsx'
import Publish from './publish.jsx'
import Share from './manage-permissions.jsx'
import Snapshot from './snapshot.jsx'
import FileDisplay from './file-display.jsx'
import AddMetadata from '../mutations/add-metadata.jsx'
import DeletePage from '../dataset/delete-page.jsx'

const stubComponent = () => null

const DatasetRoutes = ({ dataset, error }) => {
  useEffect(() => {
    if (error) {
      throw error
    }
  }, [dataset, error])

  return (
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
        name="admin"
        exact
        path="/datasets/:datasetId/admin"
        component={AdminDataset}
      />
      <Route
        name="publish"
        exact
        path="/datasets/:datasetId/publish"
        component={() => (
          <Publish datasetId={dataset.id} metadata={dataset.metadata} />
        )}
      />
      <Route
        name="snapshot-create"
        exact
        path="/datasets/:datasetId/snapshot"
        component={() => (
          <Snapshot
            datasetId={dataset.id}
            snapshots={dataset.snapshots}
            issues={dataset.draft.issues}
            description={dataset.draft.description}
          />
        )}
      />
      <Route
        name="share"
        exact
        path="/datasets/:datasetId/share"
        component={() => (
          <Share datasetId={dataset.id} permissions={dataset.permissions} />
        )}
      />
      <Route
        name="fileEdit"
        exact
        path="/datasets/:datasetId/file-edit"
        component={stubComponent}
      />
      <Route
        name="fileDisplay"
        path="/datasets/:datasetId/file-display/:filePath"
        render={({
          match: {
            params: { datasetId, filePath },
          },
        }) => {
          return <FileDisplay datasetId={datasetId} filePath={filePath} />
        }}
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
      <Route
        name="snapshot-fileDisplay"
        path="/datasets/:datasetId/versions/:snapshotTag/file-display/:filePath"
        render={({
          match: {
            params: { datasetId, filePath, snapshotTag },
          },
        }) => {
          return (
            <FileDisplay
              datasetId={datasetId}
              snapshotTag={snapshotTag}
              filePath={filePath}
            />
          )
        }}
      />
      <Route
        name="metadata"
        exact
        path="/datasets/:datasetId/metadata"
        component={() => <AddMetadata dataset={dataset} />}
      />
      <Route
        name="delete"
        exact
        path="/datasets/:datasetId/delete"
        component={() => <DeletePage dataset={dataset} />}
      />
    </Switch>
  )
}

DatasetRoutes.propTypes = {
  dataset: PropTypes.object,
  error: PropTypes.object,
}

export default DatasetRoutes
