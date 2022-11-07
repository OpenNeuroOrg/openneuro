import { indexDataset, queryForIndex, indexingToken } from '@openneuro/search'
import { elasticClient } from './elastic-client'
import {
  from,
  ApolloClient,
  InMemoryCache,
  NormalizedCacheObject,
} from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { HttpLink } from '@apollo/client/link/http'

/**
 * Setup SchemaLink based client for querying
 */
export const schemaLinkClient = (): ApolloClient<NormalizedCacheObject> => {
  const accessToken = indexingToken()
  const authLink = setContext((_, { headers }) => {
    return {
      headers: {
        ...headers,
        Cookie: `accessToken=${accessToken}`,
      },
    }
  })
  const httpLink = new HttpLink({
    uri: process.env.GRAPHQL_URI,
    fetch,
  })
  return new ApolloClient({
    link: from([authLink, httpLink]),
    cache: new InMemoryCache(),
  })
}

const client = schemaLinkClient()

export const reindexDataset = async (datasetId: string): Promise<void> => {
  const datasetIndexQueryResult = await queryForIndex(client, datasetId)
  await indexDataset(elasticClient, datasetIndexQueryResult.data.dataset)
}
