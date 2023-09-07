import { apm } from '../apm'
import React from 'react'
import PropTypes from 'prop-types'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, gql, useApolloClient } from '@apollo/client'
import { Loading } from '@openneuro/components/loading'

import DatasetQueryContext from '../datalad/dataset/dataset-query-context.js'
import DatasetContext from '../datalad/dataset/dataset-context.js'
import DatasetRoutes from './dataset-routes'
import FilesSubscription from '../datalad/subscriptions/files-subscription.jsx'
import usePermissionsSubscription from '../datalad/subscriptions/usePermissionsSubscription'
import useSnapshotsUpdatedSubscriptions from '../datalad/subscriptions/useSnapshotsUpdatedSubscriptions'
import useDatasetDeletedSubscription, {
  datasetDeletedToast,
} from '../datalad/subscriptions/useDatasetDeletedSubscription.jsx'
import useDraftSubscription from '../datalad/subscriptions/useDraftSubscription.js'

import ErrorBoundary, {
  ErrorBoundaryAssertionFailureException,
} from '../errors/errorBoundary.jsx'
import DatasetRedirect from '../datalad/routes/dataset-redirect'
import { trackAnalytics } from '../utils/datalad'
import FourOFourPage from '../errors/404page'
import FourOThreePage from '../errors/403page'
import { getDatasetPage, getDraftPage } from '../queries/dataset'

/**
 * Query to load and render dataset page - most dataset loading is done here
 * @param {Object} props
 * @param {Object} props.datasetId Accession number / id for dataset to query
 * @param {Object} props.draft Draft object
 */
export const DatasetQueryHook = ({ datasetId, draft }) => {
  const navigate = useNavigate()
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
      navigate('/dashboard/datasets')
      datasetDeletedToast(datasetId, data?.dataset?.draft?.description?.Name)
    }
  })
  useDraftSubscription(datasetId)

  if (error) {
    if (error.message === 'You do not have access to read this dataset.') {
      return <FourOThreePage />
    } else if (error.message.includes('has been deleted')) {
      for (const err of error.graphQLErrors) {
        if (
          err.extensions.code === 'DELETED_DATASET' &&
          err.extensions.redirect
        ) {
          navigate(err.extensions.redirect)
        }
      }
      return <FourOFourPage message={error.message} />
    } else {
      try {
        apm.captureError(error)
      } catch (err) {
        // Ignore failure to write to APM
      }
      return <FourOFourPage />
    }
  } else {
    if (loading || !data)
      return (
        <div className="loading-dataset">
          <Loading />
          Loading Dataset
        </div>
      )
  }

  return (
    <DatasetContext.Provider value={data.dataset}>
      <ErrorBoundary subject={'error in dataset page'}>
        <DatasetQueryContext.Provider
          value={{
            datasetId,
            fetchMore,
            error,
          }}>
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
}

/**
 * Routing wrapper for dataset query
 *
 * Expects to be a child of a react-router Route component with datasetId and snapshotId params
 */
const DatasetQuery = () => {
  const { datasetId, snapshotId } = useParams()
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
        subject={'error in dataset query'}>
        <DatasetQueryHook datasetId={datasetId} draft={!snapshotId} />
      </ErrorBoundaryAssertionFailureException>
    </>
  )
}

DatasetQuery.propTypes = {
  match: PropTypes.object,
  history: PropTypes.object,
}

export default DatasetQuery
