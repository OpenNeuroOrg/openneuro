import React from 'react'
import gql from 'graphql-tag'
import { useParams } from 'react-router-dom'
import { useQuery } from '@apollo/react-hooks'
import { datasetQueryDisplay } from '../datalad/dashboard/datasets/dataset-query.jsx'

const searchQuery = gql`
  query searchDatasets($q: String!, $cursor: String) {
    search(q: $q, first: 25, after: $cursor) {
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
            id
            userPermissions {
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

/**
 * This component is responsible for obtaining results from Elastic based
 * on the URL string and forwarding the data to the dashboard component
 */
const SearchResultsQuery = ({ q }) => {
  const { query } = useParams()
  return datasetQueryDisplay(true, false)(
    useQuery(searchQuery, {
      variables: {
        q: query,
      },
      errorPolicy: 'all',
    }),
  )
}

export default SearchResultsQuery
