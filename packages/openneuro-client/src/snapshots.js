import gql from 'graphql-tag'

export const createSnapshot = gql`
        mutation ($datasetId: ID!, $tag: String!) {
          createSnapshot(datasetId: $datasetId, tag: $tag) {
            id
            tag
          }
        }
      `