import React from "react"
import { Route, Routes } from "react-router-dom"
import { DatasetDefault } from "./dataset-default"
import AdminDataset from "./admin-datalad"
import DeletePage from "./delete-page"
import DownloadDataset from "./download-dataset"
import Publish from "./publish"
import Share from "./manage-permissions"
import Snapshot from "./snapshot"
import AddMetadata from "./add-metadata"
import Derivatives from "./derivatives"
import { FileDisplayRoute } from "../files/file-display"

export const TabRoutesDraft = ({ dataset, hasEdit }) => {
  return (
    <Routes>
      <Route
        path="*"
        element={<DatasetDefault dataset={dataset} hasEdit={hasEdit} />}
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
        path="delete"
        element={<DeletePage dataset={dataset} hasEdit={hasEdit} />}
      />
      <Route path="admin" element={<AdminDataset dataset={dataset} />} />
      <Route
        path="publish"
        element={<Publish datasetId={dataset.id} metadata={dataset.metadata} />}
      />
      <Route
        path="snapshot"
        element={
          <Snapshot
            datasetId={dataset.id}
            modified={dataset.draft.modified}
            snapshots={dataset.snapshots}
            validation={dataset.draft.validation}
            description={dataset.draft.description}
            fileCheck={dataset.draft.fileCheck}
          />
        }
      />
      <Route
        path="share"
        element={
          <Share
            datasetId={dataset.id}
            permissions={dataset.permissions}
            reviewers={dataset.reviewers}
            hasSnapshot={dataset.snapshots.length !== 0}
          />
        }
      />
      <Route
        path="file-display/:filePath"
        element={
          <FileDisplayRoute
            datasetId={dataset.id}
            files={dataset.draft.files}
          />
        }
      />
      <Route path="metadata" element={<AddMetadata dataset={dataset} />} />
    </Routes>
  )
}
