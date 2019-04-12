import * as Sentry from '@sentry/browser'
import React, { memo } from 'react'
import PropTypes from 'prop-types'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'
import Spinner from '../../common/partials/spinner.jsx'
import DatasetPage from './dataset-page.jsx'
import * as DatasetQueryFragments from './dataset-query-fragments.js'
import DatasetQueryContext from './dataset-query-context.js'

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
      uploader {
        id
        name
        email
      }
      analytics {
        downloads
        views
      }
    }
  }
  ${DatasetQueryFragments.DRAFT_FRAGMENT}
  ${DatasetQueryFragments.PERMISSION_FRAGMENT}
  ${DatasetQueryFragments.DATASET_SNAPSHOTS}
  ${DatasetQueryFragments.DATASET_COMMENTS}
`

/**
 * This bit of wizardy prevents the extra rerender when network state has changed but we already have data
 * @param {object} prevProps
 * @param {object} nextProps
 */
const queryResultEquality = (prevProps, nextProps) => {
  if (prevProps.networkStatus !== nextProps.networkStatus) {
    return false
  }
  return true
}

export const DatasetQueryRender = memo(
  ({ loading, error, data, refetch, networkStatus }) => {
    console.log(networkStatus)
    if (loading) {
      return <Spinner text="Loading Dataset" active />
    } else if (error) {
      Sentry.captureException(error)
      throw new Error(error)
    } else {
      return (
        <DatasetQueryContext.Provider
          value={{ datasetId: data.dataset.id, refetch }}>
          <DatasetPage dataset={data.dataset} />
        </DatasetQueryContext.Provider>
      )
    }
  },
  queryResultEquality,
)

DatasetQueryRender.propTypes = {
  loading: PropTypes.bool,
  error: PropTypes.object,
  data: PropTypes.object,
}

const DatasetQuery = ({ match }) => (
  <Query
    query={getDatasetPage}
    variables={{ datasetId: match.params.datasetId }}
    notifyOnNetworkStatusChange>
    {(...args) => <DatasetQueryRender {...args} />}
  </Query>
)

DatasetQuery.propTypes = {
  match: PropTypes.object,
}

export default DatasetQuery
