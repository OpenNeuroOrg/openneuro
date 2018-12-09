import React from 'react'
import PropTypes from 'prop-types'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'
import Spinner from '../../../common/partials/spinner.jsx'
import DatasetTab from './dataset-tab.jsx'

const getDatasets = gql`
  query getDatasets(
    $cursor: String
    $public: Boolean
    $orderBy: DatasetSort = { created: ascending }
  ) {
    datasets(first: 20, after: $cursor, public: $public, orderBy: $orderBy) {
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

/**
 * Load additional datasets based on next data cursor
 * @param {string} cursor Next data cursor
 * @param {function} fetchMore Apollo fetchMore function from the original query
 */
const loadMoreRows = (cursor, fetchMore) => () => {
  fetchMore({
    variables: {
      cursor,
    },
    updateQuery: (previousResult, { fetchMoreResult }) => {
      const newEdges = fetchMoreResult.datasets.edges
      const pageInfo = fetchMoreResult.datasets.pageInfo
      return {
        datasets: {
          __typename: previousResult.datasets.__typename,
          edges: [...previousResult.datasets.edges, ...newEdges],
          pageInfo,
        },
      }
    },
  })
}

const DatasetQuery = ({ public: isPublic }) => (
  <Query
    query={getDatasets}
    variables={{ public: isPublic }}
    notifyOnNetworkStatusChange>
    {({ loading, error, data, fetchMore, refetch, variables }) => {
      if (loading) {
        return <Spinner text="Loading Datasets" active />
      } else if (error) {
        throw error
      } else {
        return (
          <DatasetTab
            datasets={data.datasets.edges}
            title={isPublic ? 'Public Datasets' : 'My Datasets'}
            pageInfo={data.datasets.pageInfo}
            loadMoreRows={loadMoreRows(
              data.datasets.pageInfo.endCursor,
              fetchMore,
            )}
            refetch={refetch}
            queryVariables={variables}
          />
        )
      }
    }}
  </Query>
)

DatasetQuery.propTypes = {
  public: PropTypes.bool,
}

export default DatasetQuery
