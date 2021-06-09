import React, { FC, useContext, useEffect } from 'react'
import { gql, useQuery } from '@apollo/client'
import { useCookies } from 'react-cookie'
import { SearchResultsList, Button } from '@openneuro/components'
import { SearchParamsCtx } from './search-params-ctx'
import { getUnexpiredProfile } from '../authentication/profile'

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

const SearchResultsContainer: FC = () => {
  const [cookies] = useCookies()
  const profile = getUnexpiredProfile(cookies)
  const { searchParams, setSearchParams } = useContext(SearchParamsCtx)

  const {
    loading,
    data,
    fetchMore,
    refetch,
    variables,
    error = null,
  } = useQuery(searchQuery, {
    variables: {
      q: 'FSL',
    },
    errorPolicy: 'ignore',
  })

  return loading ? (
    <h1>Datasets loading placeholder</h1>
  ) : (
    <h1>
      <SearchResultsList items={data?.datasets.edges} profile={profile} />
      <div className="grid grid-nogutter" style={{ width: '100%' }}>
        <div className="col col-12 results-count">
          Showing <b>25</b> of <b>100</b> Datasets
        </div>
        <div className="col col-12 load-more ">
          <Button label="Load More" />
        </div>
      </div>
    </h1>
  )
}

export default SearchResultsContainer
