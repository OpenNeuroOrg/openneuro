import { gql } from '@apollo/client'

export const indexQuery = gql`
  query getDatasets(
    $cursor: String
    $orderBy: DatasetSort = { created: descending }
    $filterBy: DatasetFilter = { public: true }
  ) {
    datasets(first: 5, after: $cursor, orderBy: $orderBy, filterBy: $filterBy) {
      edges {
        node {
          id
          created
          metadata {
            datasetName
            datasetUrl
            dataProcessed
            firstSnapshotCreatedAt
            latestSnapshotCreatedAt
            ages
            modalities
            datasetId
            dxStatus
            trialCount
            tasksCompleted
            studyDesign
            studyDomain
            studyLongitudinal
            dataProcessed
            species
            associatedPaperDOI
            openneuroPaperDOI
            seniorAuthor
            grantFunderName
            grantIdentifier
          }
          latestSnapshot {
            id
            tag
            description {
              Name
              Authors
            }
            summary {
              tasks
              modalities
              subjectMetadata {
                participantId
                group
                sex
                age
              }
              subjects
            }
            readme
          }
          draft {
            description {
              Name
            }
            issues {
              severity
            }
          }
          permissions {
            userPermissions {
              level
              user {
                id
              }
            }
          }
        }
      }
      pageInfo {
        endCursor
        hasNextPage
        count
      }
    }
  }
`
