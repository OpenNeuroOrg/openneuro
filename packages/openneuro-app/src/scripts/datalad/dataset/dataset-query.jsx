import * as Sentry from '@sentry/browser'
import React from 'react'
import PropTypes from 'prop-types'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'
import Spinner from '../../common/partials/spinner.jsx'
import DatasetPage from './dataset-page.jsx'
import * as DatasetQueryFragments from './dataset-query-fragments.js'
import ErrorBoundary from '../../errors/errorBoundary.jsx'

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
      ...DatasetComments
      ...DatasetIssues
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
  ${DatasetQueryFragments.DATASET_COMMENTS}
  ${DatasetQueryFragments.DATASET_ISSUES}
`

export const DatasetQueryRender = ({ loading, error, data }) => {
  if (loading) {
    return <Spinner text="Loading Dataset" active />
  } else {
    if (error) Sentry.captureException(error)
    return (
      <ErrorBoundary error={error} subject={'error in dataset page'}>
        <DatasetPage dataset={data.dataset} />
      </ErrorBoundary>
    )
  }
}

DatasetQueryRender.propTypes = {
  loading: PropTypes.bool,
  error: PropTypes.object,
  data: PropTypes.object,
}

const DatasetQuery = ({ match }) => (
  <ErrorBoundary subject={'error in dataset query'}>
    <Query
      query={getDatasetPage}
      variables={{ datasetId: match.params.datasetId }}>
      {DatasetQueryRender}
    </Query>
  </ErrorBoundary>
)

DatasetQuery.propTypes = {
  match: PropTypes.object,
}

export default DatasetQuery
