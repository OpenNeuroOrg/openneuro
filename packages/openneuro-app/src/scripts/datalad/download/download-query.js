export const downloadQuery = (datasetId, snapshotTag) => ({
  query: snapshotTag
    ? `
      query dataset($datasetId: ID!) {
        downloadDataset(datasetId: $datasetId) {
          id
          filename
          size
          urls
        }
      }
    `
    : `
      query snapshot($datasetId: ID!, $tag: String!) {
        downloadSnapshot(datasetId: $datasetId, tag: $tag) {
          id
          filename
          size
          urls
        }
      }
    `,
  variables: {
    datasetId,
    tag: snapshotTag,
  },
})
