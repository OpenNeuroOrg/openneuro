/* eslint react/prop-types: 0, react/display-name: 0 */
import React from 'react'
import PropTypes from 'prop-types'
import { Query } from '@apollo/client/react/components'
import { datasets } from 'openneuro-client'
import DatasetTab from './dataset-tab.jsx'
import useMedia from '../../../mobile/media-hook.jsx'
import ErrorBoundary from '../../../../scripts/errors/errorBoundary.jsx'

export const updateQuery = (previousResult, { fetchMoreResult }) => {
  const newEdges = fetchMoreResult.datasets.edges
  const pageInfo = fetchMoreResult.datasets.pageInfo
  return {
    datasets: {
      __typename: previousResult.datasets.__typename,
      edges: [
        ...previousResult.datasets.edges,
        ...newEdges.filter(
          n =>
            !previousResult.datasets.edges.some(e => e.node.id === n.node.id),
        ),
      ],
      pageInfo,
    },
  }
}

/**
 * Load additional datasets based on next data cursor
 * @param {string} data Next data cursor
 * @param {function} fetchMore Apollo fetchMore function from the original query
 */
const loadMoreRows = (data, fetchMore) => {
  // Last cursor loaded (the pending promise)
  let loadingCursor
  // Pending promise to chain to if we need to delay a load
  let loadingPromise
  const loadMoreInner = cursor => {
    // Is an update fetch in progress?
    if (loadingCursor !== cursor) {
      // No, start a new fetch
      loadingPromise = fetchMore({
        variables: {
          cursor,
        },
        updateQuery,
      })
      loadingCursor = cursor
      return loadingPromise
    } else {
      // Yes, wait for the previous request to continue
      return loadingPromise.then(({ data }) =>
        loadMoreInner(data.datasets.pageInfo.endCursor),
      )
    }
  }
  return () => loadMoreInner(data.datasets.pageInfo.endCursor)
}

export const datasetQueryDisplay = (isPublic, isSaved) => ({
  loading,
  data,
  fetchMore,
  refetch,
  variables,
  error,
}) => {
  return (
    <DatasetTab
      loading={loading}
      data={data}
      error={error}
      loadMoreRows={
        loading
          ? () => {
              /* No op while loading */
            }
          : loadMoreRows(data, fetchMore)
      }
      refetch={refetch}
      queryVariables={variables}
      publicDashboard={isPublic}
      isMobile={useMedia('(max-width: 765px) ')}
      savedDashboard={isSaved}
    />
  )
}

const DatasetQuery = ({ public: isPublic, saved: isSaved }) => (
  <ErrorBoundary subject="Error loading dashboard">
    <Query
      query={datasets.getDatasets}
      variables={{
        filterBy: { public: isPublic, starred: isSaved },
        myDatasets: !(isPublic || isSaved),
      }}
      errorPolicy="all">
      {datasetQueryDisplay(isPublic, isSaved)}
    </Query>
  </ErrorBoundary>
)

DatasetQuery.propTypes = {
  public: PropTypes.bool,
}

export default DatasetQuery
