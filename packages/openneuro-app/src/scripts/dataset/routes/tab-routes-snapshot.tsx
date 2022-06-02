import React from 'react'
import { Route, Switch } from 'react-router-dom'
import { SnapshotDefault } from './snapshot-default'
import DownloadDataset from './download-dataset'
import { DeprecateSnapshotPage } from './deprecate-snapshot-page'
import FileDisplay from '../files/file-display'
import AddMetadata from './add-metadata'
import Derivatives from './derivatives'

export const TabRoutesSnapshot = ({ dataset, snapshot }) => {
  return (
    <Switch>
      <Route
        exact
        path="/datasets/:datasetId/versions/:snapshotId"
        component={() => (
          <SnapshotDefault dataset={dataset} snapshot={snapshot} />
        )}
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
        exact
        path="/datasets/:datasetId/versions/:snapshotId/derivatives"
        component={() => <Derivatives derivatives={dataset.derivatives} />}
      />
      <Route
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
        path="/datasets/:datasetId/versions/:snapshotTag/metadata"
        component={() => <AddMetadata dataset={dataset} />}
      />
    </Switch>
  )
}
