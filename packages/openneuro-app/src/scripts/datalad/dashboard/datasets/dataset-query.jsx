/* eslint react/prop-types: 0, react/display-name: 0 */
import React from 'react'
import PropTypes from 'prop-types'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'
import DatasetTab from './dataset-tab.jsx'
import useMedia from '../../../mobile/media-hook.jsx'

const getDatasets = gql`
  query getDatasets(
    $cursor: String
    $orderBy: DatasetSort = { created: descending }
    $filterBy: DatasetFilter = {}
    $myDatasets: Boolean = false
  ) {
    datasets(
      first: 25
      after: $cursor
      orderBy: $orderBy
      filterBy: $filterBy
      myDatasets: $myDatasets
    ) {
      edges {
        node {
          id
          created
          uploader {
            id
            name
          }
          public
          permissions {
            userId
            level
            access: level
            user {
              id
              name
              email
              provider
            }
          }
          draft {
            id
            partial
            summary {
              modalities
              sessions
              subjects
              subjectMetadata {
                participantId
                age
                sex
                group
              }
              tasks
              size
              totalFiles
              dataProcessed
            }
            issues {
              severity
            }
            description {
              Name
            }
          }
          analytics {
            views
            downloads
          }
          stars {
            userId
            datasetId
          }
          followers {
            userId
            datasetId
          }
          snapshots {
            id
            created
            tag
          }
        }
      }
      pageInfo {
        startCursor
        endCursor
        hasPreviousPage
        hasNextPage
        count
      }
    }
  }
`

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

const datasetQueryDisplay = isPublic => ({
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
      loadMoreRows={loading ? () => {} : loadMoreRows(data, fetchMore)}
      refetch={refetch}
      queryVariables={variables}
      publicDashboard={isPublic}
      isMobile={useMedia('(max-width: 765px) ')}
    />
  )
}

const DatasetQuery = ({ public: isPublic }) => (
  <Query
    query={getDatasets}
    variables={{ filterBy: { public: isPublic }, myDatasets: !isPublic }}
    errorPolicy="all">
    {datasetQueryDisplay(isPublic)}
  </Query>
)

DatasetQuery.propTypes = {
  public: PropTypes.bool,
}

export default DatasetQuery
