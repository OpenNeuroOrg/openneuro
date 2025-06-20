import React from "react"
import { DatasetToolButton } from "./DatasetToolButton"
import styled from "@emotion/styled"
import type { StyledComponent } from "@emotion/styled"
import { useAgreement } from "../../components/agreement"

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export const DatasetToolStyle: StyledComponent<{}> = styled
  .span`
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
`

export interface DatasetToolsProps {
  hasEdit: boolean
  isPublic: boolean
  datasetId: string
  snapshotId?: string
  isAdmin: boolean
  isDatasetAdmin: boolean
  hasSnapshot?: boolean
  hasDerivatives?: boolean
}

export const DatasetTools = ({
  hasEdit,
  isPublic,
  datasetId,
  snapshotId,
  isAdmin,
  hasSnapshot,
  isDatasetAdmin,
  hasDerivatives,
}: DatasetToolsProps) => {
  const [agree] = useAgreement()
  const isSnapshot = snapshotId
  return (
    <DatasetToolStyle>
      <DatasetToolButton
        tooltip={"View the dataset file tree"}
        path={snapshotId
          ? `/datasets/${datasetId}/versions/${snapshotId}`
          : `/datasets/${datasetId}`}
        icon="fa-folder"
        label="Files"
      />
      {hasEdit && !isPublic && !isSnapshot && (
        <>
          {hasSnapshot
            ? (
              <DatasetToolButton
                tooltip="Publicize the dataset"
                path={`/datasets/${datasetId}/publish`}
                icon="fa-globe"
                label="Publish"
              />
            )
            : (
              <DatasetToolButton
                tooltip="Create a version to publish"
                path={`/datasets/${datasetId}/snapshot?publish`}
                icon="fa-globe"
                label="Publish"
              />
            )}
        </>
      )}
      {hasEdit && !isSnapshot && (
        <DatasetToolButton
          tooltip="Share this dataset with collaborators"
          path={`/datasets/${datasetId}/share`}
          icon="fa-user"
          label="Share"
        />
      )}
      {hasEdit && isSnapshot && (
        <DatasetToolButton
          tooltip="View the Dataset Draft"
          path={`/datasets/${datasetId}`}
          icon="fa-pencil"
          label="View Draft"
        />
      )}
      {hasEdit && !isSnapshot && (
        <DatasetToolButton
          tooltip="Create a new version of the dataset"
          path={`/datasets/${datasetId}/snapshot`}
          icon="fa-camera"
          label="Versioning"
        />
      )}
      {isAdmin && !isSnapshot && (
        <DatasetToolButton
          tooltip="Admin Datalad Tools"
          path={`/datasets/${datasetId}/admin`}
          icon="fa-magic"
          label="Admin"
        />
      )}
      <DatasetToolButton
        tooltip={agree ? "How to Download" : "Agree to Terms of Service to Download"}
        path={snapshotId
          ? `/datasets/${datasetId}/versions/${snapshotId}/download`
          : `/datasets/${datasetId}/download`}
        icon="fa-download"
        label="Download"
        disable={!agree}
      />
      {hasDerivatives && (
        <DatasetToolButton
          tooltip={agree ? "Available Derivatives" : "Agree to Terms of Service to access Derivatives"}
          path={snapshotId
            ? `/datasets/${datasetId}/versions/${snapshotId}/derivatives`
            : `/datasets/${datasetId}/derivatives`}
          icon="fa-cubes"
          label="Derivatives"
          disable={!agree}
        />
      )}
      <DatasetToolButton
        tooltip={hasEdit
          ? "A form to describe your dataset (helps colleagues discover your dataset)"
          : "View the dataset metadata"}
        path={snapshotId
          ? `/datasets/${datasetId}/versions/${snapshotId}/metadata`
          : `/datasets/${datasetId}/metadata`}
        icon="fa-file-code"
        label="Metadata"
      />
      {isDatasetAdmin && !isSnapshot && (
        <DatasetToolButton
          tooltip="Remove your dataset from OpenNeuro"
          path={`/datasets/${datasetId}/delete`}
          icon="fa-trash"
          label="Delete"
        />
      )}
      {hasEdit && isSnapshot && (
        <DatasetToolButton
          tooltip="Flag this version as deprecated"
          path={`/datasets/${datasetId}/versions/${snapshotId}/deprecate`}
          icon="fa-remove"
          label="Deprecate Version"
        />
      )}
    </DatasetToolStyle>
  )
}
