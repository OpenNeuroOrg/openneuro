import { gql, useQuery } from "@apollo/client"
import { useCookies } from "react-cookie"
import { getProfile } from "../authentication/profile"
import * as Sentry from "@sentry/react"

// GraphQL query to fetch user data
export const GET_USER = gql`
  query User($userId: ID!) {
    user(id: $userId) {
      id
      name
      orcid
      email
      avatar
      location
      institution
      links
      provider
      admin
      created
      lastSeen
      blocked
      githubSynced
      github
      orcidConsent 
    }
  }
`

// GraphQL mutation to update user data
export const UPDATE_USER = gql`
  mutation updateUser(
    $id: ID!
    $location: String
    $links: [String]
    $institution: String
    $orcidConsent: Boolean 
  ) {
    updateUser(
      id: $id
      location: $location
      links: $links
      institution: $institution
      orcidConsent: $orcidConsent 
    ) {
      id
      location
      links
      institution
      orcidConsent
    }
  }
`

export const ADVANCED_SEARCH_DATASETS_QUERY = gql`
  query advancedSearchDatasets(
    $query: JSON!
    $cursor: String
    $allDatasets: Boolean
    $datasetStatus: String
    $sortBy: JSON
    $first: Int!
  ) {
    datasets: advancedSearch(
      query: $query
      allDatasets: $allDatasets
      datasetStatus: $datasetStatus
      sortBy: $sortBy
      first: $first
      after: $cursor
    ) {
      edges {
        id
        node {
          id
          created
          name
          uploader {
            id
            name
            orcid
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
          metadata {
            ages
          }
          latestSnapshot {
            size
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
              primaryModality
            }
            issues {
              severity
            }
            validation {
              errors
              warnings
            }
            description {
              Name
              Authors
              DatasetDOI
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

// Reusable hook to fetch user data
export const useUser = (userId?: string) => {
  const [cookies] = useCookies()
  const profile = getProfile(cookies)
  const profileSub = profile?.sub

  const finalUserId = userId || profileSub

  const { data: userData, loading: userLoading, error: userError } = useQuery(
    GET_USER,
    {
      variables: { userId: finalUserId },
      skip: !finalUserId,
    },
  )

  if (userError) {
    Sentry.captureException(userError)
  }

  return {
    user: userData?.user,
    loading: userLoading,
    error: userError,
  }
}
