import { apm } from '../../apm'
import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { useQuery, gql, useApolloClient } from '@apollo/client'
import { Loading } from '@openneuro/components/loading'

import DatasetQueryContext from '../../datalad/dataset/dataset-query-context.js'
import DatasetContext from '../../datalad/dataset/dataset-context.js'
import DatasetRoutes from './dataset-routes'
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
import { trackAnalytics } from '../../utils/datalad'
import FourOFourPage from '../../errors/404page'
import FourOThreePage from '../../errors/403page'

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
      followers {
        userId
      }
      starred
      stars {
        userId
      }
      worker
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
      followers {
        userId
      }
      starred
      stars {
        userId
      }
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
      fetchPolicy: 'cache-and-network',
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

  if (loading)
    return (
      <div className="loading-dataset">
        <Loading />
        Loading Dataset
      </div>
    )
  if (error) {
    if (error.message === 'You do not have access to read this dataset.') {
      return <FourOThreePage />
    } else {
      try {
        apm.captureError(error)
      } catch (err) {
        // Ignore failure to write to APM
      }
      return <FourOFourPage />
    }
  }

  return (
    <DatasetContext.Provider value={data.dataset}>
      <ErrorBoundary subject={'error in dataset page'}>
        <DatasetQueryContext.Provider
          value={{
            datasetId,
            fetchMore,
            error,
          }}
        >
          <DatasetRoutes dataset={data.dataset} />
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
const DatasetQuery = ({ match, history }) => {
  const datasetId = match.params.datasetId
  const snapshotId = match.params.snapshotId
  const client = useApolloClient()
  trackAnalytics(client, datasetId, {
    snapshot: true,
    tag: snapshotId,
    type: 'views',
  })
  return (
    <>
      <DatasetRedirect />
      <ErrorBoundaryAssertionFailureException
        subject={'error in dataset query'}
      >
        <DatasetQueryHook
          datasetId={datasetId}
          draft={!snapshotId}
          history={history}
        />
      </ErrorBoundaryAssertionFailureException>
    </>
  )
}

DatasetQuery.propTypes = {
  match: PropTypes.object,
  history: PropTypes.object,
}

export default DatasetQuery
