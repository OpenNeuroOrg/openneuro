import React from 'react'
import { Link } from 'react-router-dom'

import { Tooltip } from '../tooltip/Tooltip'
import { Icon } from '../icon/Icon'

export interface DatasetToolsProps {
  hasEdit: boolean
  rootPath: string
  isPublic: boolean
  isSnapshot: boolean
}

export const DatasetTools = ({
  hasEdit,
  rootPath,
  isPublic,
  isSnapshot,
}: DatasetToolsProps) => {
  return (
    <>
      <>
        {hasEdit && !isPublic && !isSnapshot && (
          <Tooltip tooltip="Publish the dataset publicly" flow="up">
            <Link className="dataset-tool" to={rootPath + '/publish'}>
              <Icon icon="fa fa-globe" label="Publish" />
            </Link>
          </Tooltip>
        )}
        {hasEdit && !isSnapshot && (
          <Tooltip tooltip="Share this dataset with collaborators" flow="up">
            <Link className="dataset-tool" to={rootPath + '/share'}>
              <Icon icon="fa fa-user" label="Share" />
            </Link>
          </Tooltip>
        )}

        {hasEdit && !isSnapshot && (
          <Tooltip tooltip="Create a new version of the dataset" flow="up">
            <Link className="dataset-tool" to={rootPath + '/snapshot'}>
              <Icon icon="fa fa-camera" label="Snapshot" />
            </Link>
          </Tooltip>
        )}
        <span>
          <Link className="dataset-tool" to={rootPath + '/download'}>
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
          <Link className="dataset-tool" to={rootPath + '/metadata'}>
            <Icon icon="fa fa-file-code" label="Metadata" />
          </Link>
        </Tooltip>
        {hasEdit && (
          <Tooltip tooltip="Remove your dataset from OpenNeuro" flow="up">
            <Link className="dataset-tool" to={rootPath + '/delete'}>
              <Icon icon="fa fa-trash" label="Delete" />
            </Link>
          </Tooltip>
        )}
      </>
    </>
  )
}
