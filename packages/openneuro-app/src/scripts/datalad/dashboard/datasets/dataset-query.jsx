import React from 'react'
import PropTypes from 'prop-types'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'
import DatasetTab from './dataset-tab.jsx'

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
              tasks
              size
              totalFiles
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
      edges: [...previousResult.datasets.edges, ...newEdges],
      pageInfo,
    },
  }
}

/**
 * Load additional datasets based on next data cursor
 * @param {string} data Next data cursor
 * @param {function} fetchMore Apollo fetchMore function from the original query
 */
const loadMoreRows = (data, fetchMore) => () => {
  fetchMore({
    variables: {
      cursor: data.datasets.pageInfo.endCursor,
    },
    updateQuery,
  })
}

const datasetQueryDisplay = isPublic => ({
  loading,
  error,
  data,
  fetchMore,
  refetch,
  variables,
}) => {
  if (error) {
    throw error
  } else {
    return (
      <DatasetTab
        loading={loading}
        data={data}
        loadMoreRows={loading ? () => {} : loadMoreRows(data, fetchMore)}
        refetch={refetch}
        queryVariables={variables}
        publicDashboard={isPublic}
      />
    )
  }
}

const DatasetQuery = ({ public: isPublic }) => (
  <Query
    query={getDatasets}
    variables={{ filterBy: { public: isPublic }, myDatasets: !isPublic }}>
    {datasetQueryDisplay(isPublic)}
  </Query>
)

DatasetQuery.propTypes = {
  public: PropTypes.bool,
}

export default DatasetQuery
