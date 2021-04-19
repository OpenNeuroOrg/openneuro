import { datasets } from 'openneuro-client'

export const downloadDataset = client => async ({ datasetId, snapshotTag }) => {
  if (snapshotTag) {
    const { data } = await client.query({
      query: datasets.downloadSnapshot,
      variables: {
        datasetId,
        tag: snapshotTag,
      },
    })
    return data.snapshot.files
  } else {
    const { data } = await client.query({
      query: datasets.downloadDataset,
      variables: {
        datasetId,
      },
    })
    console.log({ data })
    return data.dataset.draft.files
  }
}
