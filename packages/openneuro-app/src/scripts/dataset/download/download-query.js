import { gql } from "@apollo/client"

export const DOWNLOAD_DATASET = gql`
  query downloadDraft($datasetId: ID!) {
    dataset(id: $datasetId) {
      id
      draft {
        id
        files(recursive: true) {
          id
          directory
          filename
          size
          urls
        }
      }
    }
  }
`

export const DOWNLOAD_SNAPSHOT = gql`
  query downloadSnapshot($datasetId: ID!, $tag: String!) {
    snapshot(datasetId: $datasetId, tag: $tag) {
      id
      files(recursive: true) {
        id
        directory
        filename
        size
        urls
      }
    }
  }
`

export const downloadDataset =
  (client) => async ({ datasetId, snapshotTag }) => {
    if (snapshotTag) {
      const { data } = await client.query({
        query: DOWNLOAD_SNAPSHOT,
        variables: {
          datasetId,
          tag: snapshotTag,
        },
      })
      return data.snapshot.files
    } else {
      const { data } = await client.query({
        query: DOWNLOAD_DATASET,
        variables: {
          datasetId,
        },
      })
      return data.dataset.draft.files
    }
  }
