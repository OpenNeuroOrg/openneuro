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
    <>
      {isPrivate ? (
        hasSnapshot ? (
          <div className="dataset-header-alert warning ">
            <span>
              <strong>This dataset has not been published!&#32;</strong>
              <Link
                className="dataset-tool"
                to={'/datasets/' + datasetId + '/publish'}
              >
                Publish this dataset&#32;
              </Link>
              to make all versions available publicly.
            </span>
            {hasDraftChanges && (
              <small>
                * There have been changes to the draft since your last version
              </small>
            )}
          </div>
        ) : (
          <div className="dataset-header-alert warning ">
            <span>
              <strong>This dataset has not been published!&#32;</strong>
              Before it can be published, please&#32;
              <Link
                className="dataset-tool"
                to={'/datasets/' + datasetId + '/snapshot'}
              >
                create a version
              </Link>
            </span>
          </div>
        )
      ) : hasDraftChanges ? (
        <div className="dataset-header-alert warning ">
          <span>
            <strong>This dataset has been published!&#32;</strong> There are
            currently unsaved changes to this Draft. Changes made here become
            public when you&#32;
            <Link
              className="dataset-tool"
              to={'/datasets/' + datasetId + '/snapshot'}
            >
              create a new version.
            </Link>
          </span>
        </div>
      ) : (
        <div className="dataset-header-alert ">
          <span>
            <strong>This dataset has been published!&#32;</strong> You can make
            changes to this Draft page, then&#32;
            <Link
              className="dataset-tool"
              to={'/datasets/' + datasetId + '/snapshot'}
            >
              create a new version&#32;
            </Link>
            to make them public.
          </span>
        </div>
      )}
    </>
  )
}
