import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { Route, Switch, Redirect } from 'react-router-dom'
import AdminDataset from '../../datalad/routes/admin-datalad.jsx'
import AdminExports from '../../datalad/routes/admin-exports.jsx'

import SnapshotContainer from './snapshot-container'
import DraftContainer from './draft-container'
import DownloadDataset from '../../datalad/download/download-dataset.jsx'
import Publish from '../../datalad/routes/publish.jsx'
import Share from '../../datalad/routes/manage-permissions.jsx'
import Snapshot from '../../datalad/routes/snapshot.jsx'
import FileDisplay from '../../datalad/routes/file-display.jsx'
import AddMetadata from '../../datalad/mutations/add-metadata.jsx'
import DeletePage from '../../datalad/dataset/delete-page'

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
        name="dataset"
        exact
        path="/datasets/:datasetId"
        render={() => <DraftContainer dataset={dataset} />}
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
        path="/datasets/:datasetId/admin-datalad"
        component={() => <AdminDataset dataset={dataset} />}
      />
      <Route
        name="admin"
        exact
        path="/datasets/:datasetId/admin-exports"
        component={() => <AdminExports dataset={dataset} />}
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
        name="snapshot-download"
        exact
        path="/datasets/:datasetId/versions/:snapshotId/download"
        component={DownloadDataset}
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
