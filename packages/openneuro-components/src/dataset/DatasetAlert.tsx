import React from 'react'
import { Link } from 'react-router-dom'

export interface DatasetAlertProps {
  isPrivate: boolean
  datasetId: string
  hasDraftChanges: boolean
  hasSnapshot: boolean
}

export const DatasetAlert: React.FC<DatasetAlertProps> = ({
  isPrivate,
  datasetId,
  hasDraftChanges,
  hasSnapshot,
}) => {
  return (
    <div
      className={
        isPrivate ? 'dataset-header-alert warning ' : 'dataset-header-alert '
      }>
      {isPrivate ? (
        hasSnapshot ? (
          <>
            <span>
              <strong>This dataset has not been published!</strong>{' '}
              <Link
                className="dataset-tool"
                to={'/datasets/' + datasetId + '/publish'}>
                Publish this dataset
              </Link>{' '}
              to make all versions available publicly.
            </span>
            {hasDraftChanges && (
              <small>
                * There have been changes to the draft since your last version
              </small>
            )}
          </>
        ) : (
          <>
            <strong>This dataset has not been published!</strong>
            Before it can be published, please{' '}
            <Link
              className="dataset-tool"
              to={'/datasets/' + datasetId + '/snapshot'}>
              create a version
            </Link>
          </>
        )
      ) : hasDraftChanges ? (
        <>
          <strong>This dataset has been published!</strong> There are currently
          unsaved changes to this Draft. Changes made here become public when
          you{' '}
          <Link
            className="dataset-tool"
            to={'/datasets/' + datasetId + '/snapshot'}>
            create a new version.
          </Link>
        </>
      ) : (
        <>
          <strong>This dataset has been published!</strong> You can make changes
          to this Draft page, then{' '}
          <Link
            className="dataset-tool"
            to={'/datasets/' + datasetId + '/snapshot'}>
            create a new version
          </Link>{' '}
          to make them public.
        </>
      )}
    </div>
  )
}
