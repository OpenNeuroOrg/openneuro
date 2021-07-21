import React from 'react'
import { gql, useQuery } from '@apollo/client'
import { useParams } from 'react-router-dom'

import { datasetQueryDisplay } from '../datalad/dashboard/datasets/dataset-query.jsx'

const searchQuery = gql`
  query searchDatasets($q: String!, $cursor: String) {
    datasets: search(q: $q, first: 25, after: $cursor) {
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
            summary {
              modalities
              secondaryModalities
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
              pet {
                BodyPart
                ScannerManufacturer
                ScannerManufacturersModelName
                TracerName
                TracerRadionuclide
              }
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
const SearchResultsQuery: React.FC = () => {
  const { query } = useParams() as { query: string }
  return datasetQueryDisplay(
    true,
    false,
  )(
    useQuery(searchQuery, {
      variables: {
        q: query,
      },
      errorPolicy: 'ignore',
    }),
  )
}

export default SearchResultsQuery
