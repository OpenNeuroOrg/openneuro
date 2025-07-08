import React from "react"
import { Route, Routes } from "react-router-dom"
import { SnapshotDefault } from "./snapshot-default"
import DownloadDataset from "./download-dataset"
import { DeprecateSnapshotPage } from "./deprecate-snapshot-page"
import { FileDisplayRoute } from "../files/file-display"
import AddMetadata from "./add-metadata"
import Derivatives from "./derivatives"

export const TabRoutesSnapshot = ({ dataset, snapshot }) => {
  return (
    <Routes>
      <Route
        path="/"
        element={<SnapshotDefault dataset={dataset} snapshot={snapshot} />}
      />
      <Route
        path="download"
        element={
          <DownloadDataset
            worker={dataset.worker}
            datasetPermissions={dataset.permissions}
          />
        }
      />
      <Route
        path="derivatives"
        element={<Derivatives derivatives={dataset.derivatives} />}
      />
      <Route
        path="deprecate"
        element={
          <DeprecateSnapshotPage
            datasetId={dataset.id}
            snapshotTag={snapshot.tag}
          />
        }
      />
      <Route
        path="file-display/:filePath"
        element={
          <FileDisplayRoute
            datasetId={dataset.id}
            files={snapshot.files}
            snapshotTag={snapshot.tag}
          />
        }
      />
      <Route path="metadata" element={<AddMetadata dataset={dataset} />} />
    </Routes>
  )
}
