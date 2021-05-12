import { gql } from '@apollo/client'

export const indexQuery = gql`
  query getIndex(
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
            dxStatus
            trialCount
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
            }
            readme
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
