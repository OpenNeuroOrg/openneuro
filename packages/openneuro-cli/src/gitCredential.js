import readline from 'readline'
import { configuredClient } from './actions.js'
import gql from 'graphql-tag'

const prepareRepoAccess = gql`
  mutation prepareRepoAccess($datasetId: ID!) {
    prepareRepoAccess(datasetId: $datasetId) {
      token
      endpoint
    }
  }
`

export function gitCredential() {
  const credential = {}
  const client = configuredClient()
  const stdin = readline.createInterface({
    input: process.stdin,
  })
  stdin.on('line', line => {
    const [key, value] = line.split('=', 2)
    credential[key] = value
  })
  stdin.on('close', () => {
    if ('path' in credential) {
      const datasetId = credential.path.split('/').pop()
      client
        .mutate({
          mutation: prepareRepoAccess,
          variables: {
            datasetId,
          },
        })
        .then(({ data }) => {
          const output = {
            username: 'openneuro-cli',
            password: data.prepareRepoAccess.token,
          }
          for (const key in output) {
            console.log(`${key}=${output[key]}`)
          }
        })
    } else {
      throw new Error(
        'Invalid input from git, check the credential helper is configured correctly',
      )
    }
  })
}
