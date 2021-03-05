import gql from 'graphql-tag'
import { getUrl } from './config.js'
import { configuredClient } from './configuredClient.js'
import { apm } from './apm.js'

const CREATE_DATASET = gql`
  mutation createDataset {
    createDataset {
      id
      worker
    }
  }
`

export const createDataset = async () => {
  const apmTransaction = apm.startTransaction('createDataset', 'custom')
  const url = getUrl()
  const client = configuredClient()
  try {
    const { data } = await client.mutate({ mutation: CREATE_DATASET })
    const datasetId = data.createDataset.id
    // Full worker value is something like "openneuro-worker-2"
    const worker = data.createDataset.worker.split('-').pop()
    console.log(`Dataset ${url}datasets/${datasetId} created.`)
    console.log(`Git remote: ${url}git/${worker}/${datasetId}`)
  } catch (err) {
    console.log(
      'Dataset creation failed, you may need to rerun setup with "openneuro login" first',
    )
  }
  apmTransaction.end()
}
