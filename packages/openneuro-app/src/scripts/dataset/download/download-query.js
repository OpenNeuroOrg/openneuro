import { gql } from "@apollo/client"

export const DOWNLOAD_DATASET = gql`
query downloadDraft($datasetId: ID!, $tree: String) {
  dataset(id: $datasetId) {
    id
    draft {
      id
      files(tree: $tree) {
        id
        key
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
  query downloadSnapshot($datasetId: ID!, $tag: String!, $tree: String) {
    snapshot(datasetId: $datasetId, tag: $tag) {
      id
      files(tree: $tree) {
        id
        key
        directory
        filename
        size
        urls
      }
    }
  }
`

export const downloadDataset =
  (client) => async ({ datasetId, snapshotTag, tree = null }) => {
    if (snapshotTag) {
      const { data } = await client.query({
        query: DOWNLOAD_SNAPSHOT,
        variables: {
          datasetId,
          tag: snapshotTag,
          tree: tree,
        },
      })
      return data.snapshot.files
    } else {
      const { data } = await client.query({
        query: DOWNLOAD_DATASET,
        variables: {
          datasetId,
          tree,
        },
      })
      return data.dataset.draft.files
    }
  }
