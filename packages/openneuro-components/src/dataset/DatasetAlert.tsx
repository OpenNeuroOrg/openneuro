import React from 'react'
import { Link } from 'react-router-dom'

export interface DatasetAlertProps {
  rootPath: string
  isPrivate: boolean
  datasetId: string
  hasDraftChanges: boolean
  hasSnapshot: boolean
}

export const DatasetAlert: React.FC<DatasetAlertProps> = ({
  rootPath,
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
            <strong>This dataset has not been published!</strong>{' '}
            <Link className="dataset-tool" to={rootPath + '/publish'}>
              create a snapshot
            </Link>{' '}
            to make all snapshots available publicly.
          </>
        ) : (
          <>
            <strong>This dataset has not been published!</strong>
            Before it can be published, please{' '}
            <Link className="dataset-tool" to={rootPath + '/snapshot'}>
              create a snapshot
            </Link>
          </>
        )
      ) : hasDraftChanges ? (
        <>
          <strong>This dataset has been published!</strong> There are currently
          unsaved changes to this Draft. Changes made here become public when
          you{' '}
          <Link className="dataset-tool" to={rootPath + '/snapshot'}>
            create a new snapshot.
          </Link>
        </>
      ) : (
        <>
          <strong>This dataset has been published!</strong> You can make changes
          to this Draft page, then{' '}
          <Link className="dataset-tool" to={rootPath + '/snapshot'}>
            create a new snapshot
          </Link>{' '}
          to make them public.
        </>
      )}
    </div>
  )
}
