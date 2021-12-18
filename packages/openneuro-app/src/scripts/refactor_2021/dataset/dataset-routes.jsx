import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { Route, Switch } from 'react-router-dom'
import AdminDataset from './routes/admin-datalad.jsx'
import AdminExports from './routes/admin-exports.jsx'

import SnapshotContainer from './snapshot-container'
import DraftContainer from './draft-container'
import DownloadDataset from './routes/download-dataset'
import Publish from './routes/publish.jsx'
import Share from './routes/manage-permissions.jsx'
import Snapshot from './routes/snapshot.jsx'
import AddMetadata from './routes/add-metadata.jsx'
import DeletePage from './routes/delete-page'
import { DeprecateSnapshotPage } from './routes/deprecate-snapshot-page'
import { FileDisplay } from './files'

//TODO imports

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
        exact
        path="/datasets/:datasetId"
        render={() => <DraftContainer dataset={dataset} />}
      />
      <Route
        exact
        path="/datasets/:datasetId/download"
        component={() => (
          <DownloadDataset
            worker={dataset.worker}
            datasetPermissions={dataset.permissions}
          />
        )}
      />
      <Route
        exact
        path="/datasets/:datasetId/admin-datalad"
        component={() => <AdminDataset dataset={dataset} />}
      />
      <Route
        exact
        path="/datasets/:datasetId/admin-exports"
        component={() => <AdminExports dataset={dataset} />}
      />
      <Route
        exact
        path="/datasets/:datasetId/publish"
        component={() => (
          <Publish datasetId={dataset.id} metadata={dataset.metadata} />
        )}
      />
      <Route
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
        exact
        path="/datasets/:datasetId/share"
        component={() => (
          <Share
            datasetId={dataset.id}
            permissions={dataset.permissions}
            reviewers={dataset.reviewers}
          />
        )}
      />
      <Route
        exact
        path="/datasets/:datasetId/file-edit"
        component={stubComponent}
      />
      <Route
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
        exact
        path="/datasets/:datasetId/versions/:tag"
        render={({
          match: {
            params: { tag },
          },
        }) => {
          return <SnapshotContainer dataset={dataset} tag={tag} />
        }}
      />
      <Route
        exact
        path="/datasets/:datasetId/versions/:snapshotId/download"
        component={() => (
          <DownloadDataset
            worker={dataset.worker}
            datasetPermissions={dataset.permissions}
          />
        )}
      />
      <Route
        name="snapshot-deprecate"
        exact
        path="/datasets/:datasetId/versions/:snapshotTag/deprecate"
        component={() => <DeprecateSnapshotPage />}
      />
      <Route
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
        exact
        path="/datasets/:datasetId/metadata"
        component={() => <AddMetadata dataset={dataset} />}
      />
      <Route
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
