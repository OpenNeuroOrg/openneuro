/* eslint-disable no-console */
import { indexingToken, indexQuery } from "@openneuro/search"
import { setContext } from "@apollo/client/link/context"
import { RetryLink } from "@apollo/client/link/retry"
import { Client } from "@elastic/elasticsearch"
import { datasetGenerator } from "./datasetGenerator"
import indexDatasets from "./indexDatasets"
import { createIndices } from "./createIndices"
import { InMemoryCache } from "@apollo/client/cache"
import { ApolloClient, ApolloLink, HttpLink } from "@apollo/client/core"

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

  const accessToken: string = indexingToken(
    process.env.JWT_SECRET || process.env.JEST_WORKER_ID,
  )

  const authLink = setContext((_, { headers }) => {
    return {
      headers: {
        ...headers,
        Cookie: `accessToken=${accessToken}`,
      },
    }
  })

  const httpLink = new HttpLink({ uri: process.env.GRAPHQL_URI })

  const apolloClient = new ApolloClient({
    cache: new InMemoryCache(),
    // Terminating httpLink must come last, otherwise retryLink has nothing to forward to
    link: ApolloLink.from([authLink, retryLink, httpLink]),
  })

  const elasticClient = new Client({
    node: process.env.ELASTICSEARCH_CONNECTION,
    maxRetries: 10,
    requestTimeout: 60000,
  })
  try {
    await createIndices(elasticClient)
  } catch (err) {
    console.error("Could not create indices, skipping indexing")
    console.error(err)
    process.exit(1)
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
