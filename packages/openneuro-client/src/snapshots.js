import { gql } from '@apollo/client'

export const createSnapshot = gql`
  mutation createSnapshot($datasetId: ID!, $tag: String!, $changes: [String!]) {
    createSnapshot(datasetId: $datasetId, tag: $tag, changes: $changes) {
      id
      tag
    }
  }
`

export const getSnapshot = gql`
  query getSnapshot($datasetId: ID!, $tag: String!) {
    snapshot(datasetId: $datasetId, tag: $tag) {
      id
      _id: id
      tag
      created
      description {
        Name
      }
      summary {
        size
        totalFiles
      }
      files {
        id
        _id: id
        name: filename
        filename
        size
      }
      analytics {
        views
        downloads
      }
    }
  }
`
