import { apm } from '../../apm'
import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { useQuery, gql } from '@apollo/client'

import Spinner from '../../common/partials/spinner.jsx'
import DatasetQueryContext from '../../datalad/dataset/dataset-query-context.js'
import DatasetContext from '../../datalad/dataset/dataset-context.js'
import DatasetPage from './dataset-routes'
import FilesSubscription from '../../datalad/subscriptions/files-subscription.jsx'
import usePermissionsSubscription from '../../datalad/subscriptions/usePermissionsSubscription'
import useSnapshotsUpdatedSubscriptions from '../../datalad/subscriptions/useSnapshotsUpdatedSubscriptions'
import useDatasetDeletedSubscription, {
  datasetDeletedToast,
} from '../../datalad/subscriptions/useDatasetDeletedSubscription.jsx'
import useDraftSubscription from '../../datalad/subscriptions/useDraftSubscription.js'
import * as DatasetQueryFragments from '../../datalad/dataset/dataset-query-fragments.js'
import { DATASET_COMMENTS } from '../../datalad/dataset/comments-fragments.js'
import ErrorBoundary, {
  ErrorBoundaryAssertionFailureException,
} from '../../errors/errorBoundary.jsx'
import DatasetRedirect from '../../datalad/routes/dataset-redirect'

//TODO imports

/**
 * Generate the dataset page query
 */
export const getDatasetPage = gql`
  query dataset($datasetId: ID!) {
    dataset(id: $datasetId) {
      id
      created
      public
      following
      starred
      ...DatasetDraft
      ...DatasetPermissions
      ...DatasetSnapshots
      ...DatasetIssues
      ...DatasetMetadata
      ...DatasetComments
      uploader {
        id
        name
        email
      }
      analytics {
        downloads
        views
      }
      onBrainlife
    }
  }
  ${DatasetQueryFragments.DRAFT_FRAGMENT}
  ${DatasetQueryFragments.PERMISSION_FRAGMENT}
  ${DatasetQueryFragments.DATASET_SNAPSHOTS}
  ${DatasetQueryFragments.DATASET_ISSUES}
  ${DatasetQueryFragments.DATASET_METADATA}
  ${DATASET_COMMENTS}
`

/**
 * Add files fragment for draft route
 */
export const getDraftPage = gql`
  query dataset($datasetId: ID!) {
    dataset(id: $datasetId) {
      id
      created
      public
      following
      starred
      worker
      ...DatasetDraft
      ...DatasetDraftFiles
      ...DatasetPermissions
      ...DatasetSnapshots
      ...DatasetIssues
      ...DatasetMetadata
      ...DatasetComments
      uploader {
        id
        name
        email
      }
      analytics {
        downloads
        views
      }
      onBrainlife
    }
  }
  ${DatasetQueryFragments.DRAFT_FRAGMENT}
  ${DatasetQueryFragments.DRAFT_FILES_FRAGMENT}
  ${DatasetQueryFragments.PERMISSION_FRAGMENT}
  ${DatasetQueryFragments.DATASET_SNAPSHOTS}
  ${DatasetQueryFragments.DATASET_ISSUES}
  ${DatasetQueryFragments.DATASET_METADATA}
  ${DATASET_COMMENTS}
`

/**
 * Query to load and render dataset page - most dataset loading is done here
 * @param {Object} props
 * @param {Object} props.datasetId Accession number / id for dataset to query
 * @param {Object} props.draft Is this the draft page?
 * @param {Object} props.history React router history
 */
export const DatasetQueryHook = ({ datasetId, draft, history }) => {
  const { data, loading, error, fetchMore } = useQuery(
    draft ? getDraftPage : getDatasetPage,
    {
      variables: { datasetId },
      errorPolicy: 'all',
      fetchPolicy: draft ? 'cache-and-network' : 'cache-first',
      nextFetchPolicy: 'cache-first',
    },
  )
  usePermissionsSubscription([datasetId])
  useSnapshotsUpdatedSubscriptions(datasetId)
  useDatasetDeletedSubscription([datasetId], ({ data: subData }) => {
    if (subData && subData.datasetDeleted === datasetId) {
      history.push('/dashboard/datasets')
      datasetDeletedToast(datasetId, data?.dataset?.draft?.description?.Name)
    }
  })
  useDraftSubscription(datasetId)

  useEffect(() => {
    if (error) {
      if (data.dataset) {
        // show dataset page
        apm.captureError(error)
      } else {
        // direct to freshdesk
        throw error
      }
    }
  }, [error, data])
  if (loading) return <Spinner text="Loading Dataset" active />

  return (
    <DatasetContext.Provider value={data.dataset}>
      <ErrorBoundary subject={'error in dataset page'}>
        <DatasetQueryContext.Provider
          value={{
            datasetId,
            fetchMore,
            error,
          }}>
          <DatasetPage dataset={data.dataset} />
          <FilesSubscription datasetId={datasetId} />
        </DatasetQueryContext.Provider>
      </ErrorBoundary>
    </DatasetContext.Provider>
  )
}

DatasetQueryHook.propTypes = {
  datasetId: PropTypes.string,
  draft: PropTypes.bool,
  history: PropTypes.object,
}

/**
 * Routing wrapper for dataset query
 * @param {Object} props
 * @param {Object} props.match React router match object
 * @param {Object} props.draft Is this the draft page?
 * @param {Object} props.history React router history
 */
const DatasetQuery = ({ match, history }) => (
  <>
    <DatasetRedirect />
    <ErrorBoundaryAssertionFailureException subject={'error in dataset query'}>
      <DatasetQueryHook
        datasetId={match.params.datasetId}
        draft={!match.params.snapshotId}
        history={history}
      />
    </ErrorBoundaryAssertionFailureException>
  </>
)

DatasetQuery.propTypes = {
  match: PropTypes.object,
  history: PropTypes.object,
}

export default DatasetQuery
