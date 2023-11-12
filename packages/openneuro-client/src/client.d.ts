import { ApolloClient, Query } from "@apollo/client"

export declare function createClient(
  uri: string,
  options: {
    getAuthorization?: () => string
    fetch?: typeof fetch
    clientVersion?: string
    links?: Array<ApolloLink>
    ssrMode?: boolean
    cache?: ApolloCache
  },
): ApolloClient<any>

export async function* datasetGenerator(
  client: ApolloClient,
  query: Query,
): AsyncGenerator<any>
