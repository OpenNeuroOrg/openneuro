import gql from 'graphql-tag'
import inquirer from 'inquirer'
import { getUrl } from './config.js'
import { configuredClient } from './configuredClient.js'
import { apm } from './apm.js'

const CREATE_DATASET = gql`
  mutation createDataset($affirmedDefaced: Boolean, $affirmedConsent: Boolean) {
    createDataset(
      affirmedDefaced: $affirmedDefaced
      affirmedConsent: $affirmedConsent
    ) {
      id
      worker
    }
  }
`

export const createDataset = async ({ affirmedDefaced, affirmedConsent }) => {
  const apmTransaction = apm.startTransaction('createDataset', 'custom')
  const url = getUrl()
  const client = configuredClient()
  try {
    const { data } = await client.mutate({
      mutation: CREATE_DATASET,
      variables: { affirmedDefaced, affirmedConsent },
    })
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

export const create = () => {
  inquirer
    .prompt({
      type: 'checkbox',
      name: 'affirmed',
      message: 'Please affirm one of the following:',
      choices: [
        'All structural scans have been defaced, obscuring any tissue on or near the face that could potentially be used to reconstruct the facial structure.',
        'I have explicit participant consent and ethical authorization to publish structural scans without defacing.',
      ],
    })
    .then(({ affirmed: [affirmedDefaced, affirmedConsent] }) =>
      createDataset({
        affirmedDefaced: !!affirmedDefaced,
        affirmedConsent: !!affirmedConsent,
      }),
    )
}
