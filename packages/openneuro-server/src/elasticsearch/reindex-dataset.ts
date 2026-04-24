import config from "../config"
import { indexDataset, indexingToken, queryForIndex } from "@openneuro/search"
import { getElasticClient } from "./elastic-client"
import { ApolloClient, from, InMemoryCache } from "@apollo/client"
import type { NormalizedCacheObject } from "@apollo/client"
import { setContext } from "@apollo/client/link/context"
import { HttpLink } from "@apollo/client/link/http"

/**
 * Setup SchemaLink based client for querying
 */
export const schemaLinkClient = (): ApolloClient<NormalizedCacheObject> => {
  const accessToken = indexingToken(config.auth.jwt.secret)
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
  })
  return new ApolloClient({
    link: from([authLink, httpLink]),
    cache: new InMemoryCache(),
  })
}

let _client: ApolloClient<NormalizedCacheObject> | null = null
function getClient(): ApolloClient<NormalizedCacheObject> {
  if (!_client) _client = schemaLinkClient()
  return _client
}

export const reindexDataset = async (datasetId: string): Promise<void> => {
  const datasetIndexQueryResult = await queryForIndex(getClient(), datasetId)
  await indexDataset(getElasticClient(), datasetIndexQueryResult.data.dataset)
}
