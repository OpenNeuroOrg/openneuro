import { createHttpLink } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { RetryLink } from 'apollo-link-retry'
import { Client } from '@elastic/elasticsearch'
import { createClient, datasetGenerator } from '@openneuro/client'
import jwt from 'jsonwebtoken'
import indexDatasets from './indexDatasets'
import { createIndices } from './createIndices'
import { indexQuery } from './indexQuery'

/**
 * Indexer entrypoint
 */
export default async function main(): Promise<void> {
  const retryLink = new RetryLink({
    delay: {
      initial: 5000,
    },
    attempts: {
      max: 5,
    },
  })

  const accessToken = jwt.sign(
    {
      scopes: ['dataset:indexing'],
    },
    process.env.JWT_SECRET,
    { expiresIn: 60 * 60 * 3 }, // 3 hours
  )

  const authLink = setContext((_, { headers }) => {
    return {
      headers: {
        ...headers,
        Cookie: `accessToken=${accessToken}`,
      },
    }
  })

  const apolloClient = createClient(process.env.GRAPHQL_URI, {
    fetch,
    links: [retryLink, authLink],
  })
  const elasticClient = new Client({
    node: process.env.ELASTICSEARCH_CONNECTION,
    maxRetries: 10,
    requestTimeout: 60000,
  })
  try {
    await createIndices(elasticClient)
  } catch (err) {
    console.error('Could not create indices, skipping indexing')
    console.error(err)
  }
  const datasets = datasetGenerator(apolloClient, indexQuery)
  try {
    await indexDatasets(elasticClient, datasets)
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
}

void main()
