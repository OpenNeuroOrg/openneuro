import { datasets } from '@openneuro/client'

export const downloadDataset =
  client =>
  async ({ datasetId, snapshotTag, tree = null }) => {
    if (snapshotTag) {
      const { data } = await client.query({
        query: datasets.downloadSnapshot,
        variables: {
          datasetId,
          tag: snapshotTag,
          tree: tree,
        },
      })
      return data.snapshot.files
    } else {
      const { data } = await client.query({
        query: datasets.downloadDataset,
        variables: {
          datasetId,
          tree,
        },
      })
      return data.dataset.draft.files
    }
  }
