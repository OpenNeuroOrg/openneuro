import path from 'path'
import { datasets } from 'openneuro-client'

/**
 * Get or create a dataset
 */
export const getOrCreateDataset = (client, dir, datasetId) => {
  const label = path.basename(dir)
  if (datasetId) {
    return Promise.resolve(datasetId)
  } else {
    return client
      .mutate({
        mutation: datasets.createDataset,
        variables: { label },
      })
      .then(({ data }) => {
        const dsId = data.createDataset.id
        // eslint-disable-next-line no-console
        console.log(`"${dsId}" created with label "${label}"`)
        return dsId
      })
  }
}
