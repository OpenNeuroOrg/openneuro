import gql from 'graphql-tag'

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
            readme
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
