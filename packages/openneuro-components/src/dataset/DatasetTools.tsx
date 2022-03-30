import React from 'react'
import { Link } from 'react-router-dom'
import { useLocation, useHistory } from 'react-router-dom'
import { Tooltip } from '../tooltip/Tooltip'
import { Icon } from '../icon/Icon'
import { Button } from '../button/Button'

export interface DatasetToolsProps {
  hasEdit: boolean
  isPublic: boolean
  datasetId: string
  snapshotId?: string
  isAdmin: boolean
  isDatasetAdmin: boolean
  hasSnapshot?: boolean
}

export const DatasetTools = ({
  hasEdit,
  isPublic,
  datasetId,
  snapshotId,
  isAdmin,
  hasSnapshot,
  isDatasetAdmin,
}: DatasetToolsProps) => {
  const history = useHistory()
  const location = useLocation()
  const isSnapshot = snapshotId
  return (
    <>
      {hasEdit && !isPublic && !isSnapshot && (
        <>
          {hasSnapshot ? (
            <Tooltip tooltip="Publicize the dataset" flow="up">
              <Link
                className="dataset-tool"
                to={`/datasets/${datasetId}/publish`}>
                <Icon icon="fa fa-globe" label="Publish" />
              </Link>
            </Tooltip>
          ) : (
            <Tooltip tooltip="Create a version to publish" flow="up">
              <Link
                className="dataset-tool"
                to={`/datasets/${datasetId}/snapshot`}>
                <Icon icon="fa fa-globe" label="Publish" />
              </Link>
            </Tooltip>
          )}
        </>
      )}
      {hasEdit && !isSnapshot && (
        <Tooltip tooltip="Share this dataset with collaborators" flow="up">
          <Link className="dataset-tool" to={`/datasets/${datasetId}/share`}>
            <Icon icon="fa fa-user" label="Share" />
          </Link>
        </Tooltip>
      )}
      {hasEdit && isSnapshot && (
        <Tooltip tooltip="View the Dataset Draft" flow="up">
          <Link className="dataset-tool" to={`/datasets/${datasetId}`}>
            <Icon icon="fa fa-pencil" label="View Draft" />
          </Link>
        </Tooltip>
      )}
      {hasEdit && !isSnapshot && (
        <Tooltip tooltip="Create a new version of the dataset" flow="up">
          <Link className="dataset-tool" to={`/datasets/${datasetId}/snapshot`}>
            <Icon icon="fa fa-camera" label="Versioning" />
          </Link>
        </Tooltip>
      )}
      {isAdmin && !isSnapshot && (
        <Tooltip tooltip="Admin Datalad Tools" flow="up">
          <Link
            className="dataset-tool"
            to={`/datasets/${datasetId}/admin-datalad`}>
            <Icon icon="fa fa-magic" label="Datalad" />
          </Link>
        </Tooltip>
      )}
      {isAdmin && !isSnapshot && (
        <Tooltip tooltip="Admin Remote Export Tools" flow="up">
          <Link
            className="dataset-tool"
            to={`/datasets/${datasetId}/admin-exports`}>
            <Icon icon="fa fa-cloud-upload" label="Export" />
          </Link>
        </Tooltip>
      )}
      <span>
        <Link
          className="dataset-tool"
          to={
            snapshotId
              ? `/datasets/${datasetId}/versions/${snapshotId}/download`
              : `/datasets/${datasetId}/download`
          }>
          <Icon icon="fa fa-download" label="Download" />
        </Link>
      </span>
      <Tooltip
        wrapText={true}
        tooltip={
          hasEdit
            ? 'A form to describe your dataset (helps colleagues discover your dataset)'
            : 'View the dataset metadata'
        }
        flow="up">
        <Button
          icon="fa fa-file-code"
          label="Metadata"
          className="dataset-tool"
          nobg={true}
          onClick={() =>
            history.push({
              pathname: `/datasets/${datasetId}/metadata`,
              state: {
                submitPath: location.pathname,
              },
            })
          }
        />
      </Tooltip>
      {isDatasetAdmin && !isSnapshot && (
        <Tooltip tooltip="Remove your dataset from OpenNeuro" flow="up">
          <Link className="dataset-tool" to={`/datasets/${datasetId}/delete`}>
            <Icon icon="fa fa-trash" label="Delete" />
          </Link>
        </Tooltip>
      )}
      {hasEdit && isSnapshot && (
        <Tooltip tooltip="Flag this version as deprecated" flow="up">
          <Link
            className="dataset-tool"
            to={`/datasets/${datasetId}/versions/${snapshotId}/deprecate`}>
            <Icon icon="fa fa-remove" label="Deprecate Version" />
          </Link>
        </Tooltip>
      )}
    </>
  )
}
