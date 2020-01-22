import gql from 'graphql-tag'

export const indexQuery = gql`
  query getDatasets(
    $cursor: String
    $orderBy: DatasetSort = { created: descending }
    $filterBy: DatasetFilter = { public: true }
  ) {
    datasets(
      first: 10
      after: $cursor
      orderBy: $orderBy
      filterBy: $filterBy
    ) {
      edges {
        node {
          id
          created
          metadata {
            dxStatus
            tasksCompleted
            trialCount
            studyDesign
            studyDomain
            studyLongitudinal
            dataProcessed
            species
            associatedPaperDOI
            openneuroPaperDOI
            seniorAuthor
            ages
            modalities
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
