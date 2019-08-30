import * as Sentry from '@sentry/browser'
import React from 'react'
import PropTypes from 'prop-types'
import { useQuery } from 'react-apollo'
import gql from 'graphql-tag'
import Spinner from '../../common/partials/spinner.jsx'
import DatasetQueryContext from './dataset-query-context.js'
import DatasetPage from './dataset-page.jsx'
import * as DatasetQueryFragments from './dataset-query-fragments.js'
import { DATASET_COMMENTS } from './comments-fragments.js'
import ErrorBoundary, {
  ErrorBoundaryAssertionFailureException,
} from '../../errors/errorBoundary.jsx'

/**
 * Generate the dataset page query
 * @param {number} commentDepth How many levels to recurse for comments
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
  ${DATASET_COMMENTS}
`

/**
 * Query to load and render dataset page - most dataset loading is done here
 * @param {Object} props
 * @param {Object} props.datasetId Accession number / id for dataset to query
 */
export const DatasetQueryHook = ({ datasetId }) => {
  const {
    data: { dataset },
    loading,
    error,
  } = useQuery(getDatasetPage, {
    variables: { datasetId },
  })
  if (loading) {
    return <Spinner text="Loading Dataset" active />
  } else {
    if (error) Sentry.captureException(error)
    return (
      <ErrorBoundary error={error} subject={'error in dataset page'}>
        <DatasetQueryContext.Provider
          value={{
            datasetId,
          }}>
          <DatasetPage dataset={dataset} />
        </DatasetQueryContext.Provider>
      </ErrorBoundary>
    )
  }
}

DatasetQueryHook.propTypes = {
  datasetId: PropTypes.string,
}

/**
 * Routing wrapper for dataset query
 * @param {Object} props
 * @param {Object} props.match React router match object
 */
const DatasetQuery = ({ match }) => (
  <ErrorBoundaryAssertionFailureException subject={'error in dataset query'}>
    <DatasetQueryHook datasetId={match.params.datasetId} />
  </ErrorBoundaryAssertionFailureException>
)

DatasetQuery.propTypes = {
  match: PropTypes.object,
}

export default DatasetQuery
