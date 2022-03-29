import React from 'react'
import { Route, Switch } from 'react-router-dom'
import { DatasetDefault } from './dataset-default'
import AdminDataset from './admin-datalad'
import AdminExports from './admin-exports'
import DeletePage from './delete-page'
import DownloadDataset from './download-dataset'
import Publish from './publish'
import Share from './manage-permissions'
import Snapshot from './snapshot'
import AddMetadata from './add-metadata'
import FileDisplay from '../files/file-display'

export const TabRoutesDraft = ({ dataset, hasEdit }) => {
  return (
    <Switch>
      <Route
        exact
        path="/datasets/:datasetId"
        component={() => <DatasetDefault dataset={dataset} hasEdit={hasEdit} />}
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
        path="/datasets/:datasetId/delete"
        component={() => <DeletePage dataset={dataset} />}
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
        path="/datasets/:datasetId/file-display/:filePath"
        render={({
          match: {
            params: { datasetId, filePath },
          },
        }) => {
          return <FileDisplay datasetId={datasetId} filePath={filePath} />
        }}
      />
      <Route
        exact
        path="/datasets/:datasetId/metadata"
        component={() => <AddMetadata dataset={dataset} />}
      />
    </Switch>
  )
}
