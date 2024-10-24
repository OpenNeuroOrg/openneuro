/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ApolloClient, Query } from "@apollo/client"

export declare function createClient(
  uri: string,
  options: {
    getAuthorization?: () => string
    fetch?: typeof fetch
    clientVersion?: string
    links?: ApolloLink[]
    ssrMode?: boolean
    cache?: ApolloCache
  },
): ApolloClient<any>

export declare function datasetGenerator(
  client: ApolloClient,
  query: Query,
): AsyncGenerator<any>
